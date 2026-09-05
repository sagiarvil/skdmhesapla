"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Cloud, CloudOff, FileLock2, History, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  createMaritimeCheckpoint,
  loadMaritimeWorkspace,
  MaritimeBackendError,
  reloadMaritimeFile,
  saveMaritimeFile,
  type MaritimeWorkspaceContext,
} from "@/lib/maritime/backend-client";
import {
  createMaritimePurchaseIntent,
  finalizeMaritimePurchase,
  getMaritimeCommerceStatus,
  getMaritimePurchaseIntentStatus,
  MARITIME_DOSSIER_PRICE_USD,
} from "@/lib/maritime/commerce-client";
import type { MaritimePreparationFile } from "@/lib/maritime/types";
import { isPaddleMaritimeCheckoutReady, openPaddleMaritimeCheckout } from "@/lib/skdm/paddle";
import { MaritimePaidDossierView } from "./MaritimePaidDossierView";
import { MaritimePreparationWorkbenchV2 } from "./MaritimePreparationWorkbenchV2";

const RECOVERY_KEY = "skdmhesapla-maritime-preparation-v2";

type SyncState = "loading" | "synced" | "pending" | "saving" | "offline" | "conflict" | "locked";

type CommerceState = {
  checked: boolean;
  paid: boolean;
  snapshotHash: string | null;
  transactionId: string | null;
};

const initialCommerce: CommerceState = { checked: false, paid: false, snapshotHash: null, transactionId: null };

export function MaritimePreparationEnterpriseBridge() {
  const { user, loading: authLoading } = useAuth();
  const [booted, setBooted] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const [message, setMessage] = useState("Sunucu çalışma alanı hazırlanıyor…");
  const [checkpointHash, setCheckpointHash] = useState<string | null>(null);
  const [commerce, setCommerce] = useState<CommerceState>(initialCommerce);
  const [commerceBusy, setCommerceBusy] = useState(false);
  const [commerceNote, setCommerceNote] = useState<string | null>(null);
  const contextRef = useRef<MaritimeWorkspaceContext | null>(null);
  const revisionRef = useRef(0);
  const lastSavedPayloadRef = useRef("");
  const saveInFlightRef = useRef(false);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.isAnonymous) {
      setBooted(false);
      setSyncState("offline");
      setMessage("Denizcilik çalışma dosyası için üye girişi gerekli.");
      return;
    }

    stoppedRef.current = false;
    const bootstrap = async () => {
      setSyncState("loading");
      setMessage("Firebase çalışma alanı ve yetkiler doğrulanıyor…");
      try {
        const q = new URLSearchParams(window.location.search);
        const requestedYear = Number(q.get("year")) || 2026;
        const response = await loadMaritimeWorkspace(requestedYear);
        if (stoppedRef.current) return;
        contextRef.current = response.context;
        revisionRef.current = response.fileState?.revision || 0;

        if (response.fileState?.status === "locked") {
          setSyncState("locked");
          setMessage("Sunucudaki hazırlık dosyası kilitli ve değiştirilemez.");
        } else {
          setSyncState("synced");
          setMessage("Firebase sunucu kaydı aktif. Tarayıcı yalnız kurtarma önbelleğidir.");
        }

        if (response.fileState?.file) {
          const serialized = JSON.stringify(response.fileState.file);
          localStorage.setItem(RECOVERY_KEY, serialized);
          lastSavedPayloadRef.current = serialized;
        } else {
          lastSavedPayloadRef.current = "";
        }
        setGeneration((x) => x + 1);
        setBooted(true);

        try {
          const paid = await getMaritimeCommerceStatus(response.context.year);
          if (!stoppedRef.current) setCommerce({ checked: true, paid: paid.paid, snapshotHash: paid.snapshotHash || null, transactionId: paid.transactionId || null });
        } catch {
          if (!stoppedRef.current) setCommerce({ ...initialCommerce, checked: true });
        }
      } catch (error) {
        if (stoppedRef.current) return;
        const text = error instanceof Error ? error.message : "Sunucu çalışma alanı açılamadı.";
        setSyncState("offline");
        setMessage(text);
        setBooted(true);
        setCommerce({ ...initialCommerce, checked: true });
      }
    };
    void bootstrap();
    return () => { stoppedRef.current = true; };
  }, [authLoading, user]);

  useEffect(() => {
    if (!booted || !user || user.isAnonymous || commerce.paid) return;
    const timer = window.setInterval(async () => {
      if (saveInFlightRef.current || !contextRef.current || syncState === "locked") return;
      const serialized = localStorage.getItem(RECOVERY_KEY) || "";
      if (!serialized || serialized === lastSavedPayloadRef.current) return;

      let file: MaritimePreparationFile;
      try { file = JSON.parse(serialized) as MaritimePreparationFile; }
      catch { setSyncState("offline"); setMessage("Tarayıcı kurtarma taslağı bozuk; sunucuya gönderilmedi."); return; }

      saveInFlightRef.current = true;
      setSyncState("saving");
      setMessage("Şifreli Firebase oturumuyla sunucuya kaydediliyor…");
      try {
        const result = await saveMaritimeFile(contextRef.current, file, revisionRef.current);
        revisionRef.current = result.revision;
        lastSavedPayloadRef.current = serialized;
        setSyncState(result.status === "locked" ? "locked" : "synced");
        setMessage(result.unchanged ? `Sunucu sürümü güncel · rev ${result.revision}` : `Sunucuya kaydedildi · rev ${result.revision}`);
      } catch (error) {
        if (error instanceof MaritimeBackendError && error.code === "REVISION_CONFLICT" && contextRef.current) {
          setSyncState("conflict");
          setMessage("Eşzamanlı değişiklik algılandı; sunucu sürümü geri yükleniyor…");
          try {
            const latest = await reloadMaritimeFile(contextRef.current);
            revisionRef.current = latest.revision;
            if (latest.file) {
              const latestSerialized = JSON.stringify(latest.file);
              localStorage.setItem(RECOVERY_KEY, latestSerialized);
              lastSavedPayloadRef.current = latestSerialized;
              setGeneration((x) => x + 1);
            }
            setSyncState(latest.status === "locked" ? "locked" : "synced");
            setMessage("Sunucu otoritesi geri yüklendi; kayıp/gizli overwrite engellendi.");
          } catch (reloadError) {
            setSyncState("offline");
            setMessage(reloadError instanceof Error ? reloadError.message : "Sunucu sürümü geri yüklenemedi.");
          }
        } else if (error instanceof MaritimeBackendError && error.code === "FILE_LOCKED") {
          setSyncState("locked");
          setMessage("Dosya sunucuda kilitli; tarayıcı değişiklikleri resmî çalışma kaydını değiştiremez.");
        } else {
          setSyncState("offline");
          setMessage(error instanceof Error ? error.message : "Sunucu kaydı geçici olarak başarısız.");
        }
      } finally {
        saveInFlightRef.current = false;
      }
    }, 3500);
    return () => window.clearInterval(timer);
  }, [booted, commerce.paid, syncState, user]);

  const persistAndCheckpoint = async () => {
    if (!contextRef.current || saveInFlightRef.current) throw new Error("Çalışma alanı kayda hazır değil.");
    const serialized = localStorage.getItem(RECOVERY_KEY) || "";
    if (serialized && serialized !== lastSavedPayloadRef.current) {
      const file = JSON.parse(serialized) as MaritimePreparationFile;
      const saved = await saveMaritimeFile(contextRef.current, file, revisionRef.current);
      revisionRef.current = saved.revision;
      lastSavedPayloadRef.current = serialized;
    }
    const result = await createMaritimeCheckpoint(contextRef.current);
    setCheckpointHash(result.snapshotHash);
    return result;
  };

  const checkpoint = async () => {
    if (!contextRef.current || saveInFlightRef.current) return;
    setSyncState("saving");
    setMessage("Değişmez kontrol noktası oluşturuluyor…");
    try {
      const result = await persistAndCheckpoint();
      setSyncState("synced");
      setMessage(`Değişmez kontrol noktası oluşturuldu · ${result.snapshotHash.slice(0, 12)}…`);
    } catch (error) {
      setSyncState("offline");
      setMessage(error instanceof Error ? error.message : "Kontrol noktası oluşturulamadı.");
    }
  };

  const buy = async () => {
    if (!contextRef.current || commerceBusy) return;
    setCommerceNote(null);
    if (!isPaddleMaritimeCheckoutReady()) {
      setCommerceNote("Paddle denizcilik fiyat kimliği yapılandırılmadı. Gözden geçirin.");
      return;
    }
    setCommerceBusy(true);
    try {
      setSyncState("saving");
      const checkpointResult = await persistAndCheckpoint();
      if (!checkpointResult.readiness.ready) {
        setSyncState("synced");
        setCommerceBusy(false);
        setCommerceNote(`Ödeme açılmadı: ${checkpointResult.readiness.missing.length} kritik hazırlık alanı/kanıtı tamamlanmalı.`);
        return;
      }
      const intent = await createMaritimePurchaseIntent(contextRef.current, checkpointResult.versionId, checkpointResult.snapshotHash);
      setSyncState("synced");
      if (intent.alreadyPaid) {
        setCommerce({ checked: true, paid: true, snapshotHash: intent.snapshotHash, transactionId: null });
        setCommerceBusy(false);
        return;
      }
      if (!intent.intentId) throw new Error("Satın alma kaydı oluşturulamadı.");
      setCommerceNote("349 USD · tek sefer · 1 gemi + 1 raporlama yılı. Ödeme Paddle tarafından alınır.");
      await openPaddleMaritimeCheckout({
        purchaseIntentId: intent.intentId,
        customerEmail: user?.email || undefined,
        onCompleted: () => {
          void (async () => {
            try {
              setCommerceNote("Ödeme tamamlandı. Değişmez dosya kilidi oluşturuluyor…");
              let transactionId: string | null = null;
              for (let attempt = 0; attempt < 40; attempt++) {
                const status = await getMaritimePurchaseIntentStatus(intent.intentId!);
                if (status.status === "completed" && status.transactionId) {
                  transactionId = status.transactionId;
                  break;
                }
                await new Promise((resolve) => window.setTimeout(resolve, 750));
              }
              if (!transactionId) throw new Error("Paddle ödeme kaydı henüz sunucuya ulaşmadı. Sayfayı yenileyerek devam edin.");
              const finalized = await finalizeMaritimePurchase(intent.intentId!);
              setCommerce({ checked: true, paid: true, snapshotHash: finalized.snapshotHash, transactionId: finalized.transactionId });
              setCommerceNote(null);
            } catch (error) {
              setCommerceNote(error instanceof Error ? error.message : "Ödeme sonrası dosya teslimi tamamlanamadı.");
            } finally {
              setCommerceBusy(false);
            }
          })();
        },
        onClosed: () => {
          setCommerceBusy(false);
          setCommerceNote("Ödeme tamamlanmadı. Dosyanız değişmeden çalışmaya devam edebilirsiniz.");
        },
      });
    } catch (error) {
      setCommerceBusy(false);
      setSyncState("synced");
      setCommerceNote(error instanceof Error ? error.message : "Ödeme penceresi açılamadı.");
    }
  };

  const blockUnpaidExports = (event: React.MouseEvent<HTMLDivElement>) => {
    if (commerce.paid) return;
    const button = (event.target as HTMLElement | null)?.closest("button");
    if (!button) return;
    const text = button.textContent || "";
    if (!text.includes("Makine-okunur paket") && !text.includes("Preparation report PDF")) return;
    event.preventDefault();
    event.stopPropagation();
    setCommerceNote("Nihai çıktı seti 349 USD tek seferlik ödeme sonrası değişmez snapshot üzerinden açılır.");
    document.getElementById("maritime-commerce-gate")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (authLoading || (user && !booted)) {
    return <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f7ef]"><div className="rounded-2xl border border-line bg-white p-7 text-center shadow-sm"><Loader2 className="mx-auto h-7 w-7 animate-spin text-brand-800"/><p className="mt-3 text-sm font-black">Enterprise denizcilik çalışma alanı açılıyor…</p></div></div>;
  }

  if (!user || user.isAnonymous) {
    return <div className="min-h-[70vh] bg-[#f4f7ef] px-5 py-16"><div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-xl"><FileLock2 className="mx-auto h-10 w-10 text-brand-800"/><h1 className="mt-4 text-2xl font-black">Kalıcı denizcilik dosyası için güvenli hesap gerekir.</h1><p className="mt-3 text-sm font-semibold leading-7 text-ink-700">Şirket, filo, gemi, raporlama yılı, voyage, fuel, kanıt, revision ve audit kayıtları Firebase backend üzerinde kullanıcı hesabınıza bağlanır.</p><Link href="/giris/" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-900 px-6 text-sm font-black text-white">Üye girişi</Link></div></div>;
  }

  if (commerce.paid && commerce.snapshotHash && contextRef.current) {
    return <MaritimePaidDossierView year={contextRef.current.year} snapshotHash={commerce.snapshotHash}/>;
  }

  const Icon = syncState === "offline" ? CloudOff : syncState === "saving" || syncState === "loading" ? RefreshCw : syncState === "locked" ? FileLock2 : Cloud;

  return <>
    <div className="sticky top-0 z-[60] border-b border-brand-800/20 bg-[#071812] px-4 py-2 text-white print:hidden">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Icon className={`h-4 w-4 shrink-0 text-brand-500 ${syncState === "saving" ? "animate-spin" : ""}`}/>
          <div className="min-w-0"><p className="text-[11px] font-black uppercase tracking-[.12em] text-brand-500">Enterprise Backend · Firebase</p><p className="truncate text-xs font-semibold text-slate-300">{message}</p></div>
        </div>
        <div className="flex items-center gap-2">
          {checkpointHash && <span className="hidden items-center gap-1 text-[11px] font-bold text-emerald-300 sm:flex"><CheckCircle2 className="h-3.5 w-3.5"/> checkpoint</span>}
          <button type="button" onClick={() => void checkpoint()} disabled={syncState === "saving" || syncState === "locked" || syncState === "offline"} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-xs font-black disabled:opacity-40"><History className="h-3.5 w-3.5"/>Değişmez kontrol noktası</button>
        </div>
      </div>
    </div>

    <div onClickCapture={blockUnpaidExports}>
      <MaritimePreparationWorkbenchV2 key={generation}/>
    </div>

    <section id="maritime-commerce-gate" className="sticky bottom-0 z-[55] border-t border-brand-800/20 bg-[#071812] px-4 py-3 text-white shadow-2xl print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black">1 gemi + 1 raporlama yılı + tam değişmez çıktı dosyası</p>
          <p className="mt-1 text-xs font-semibold text-slate-300">EU MRV + EU ETS + FuelEU Maritime · abonelik yok · kullanıcı başı ücret yok · aynı snapshot yeniden indirme ücretsiz.</p>
          {commerceNote && <p className="mt-1 text-xs font-bold text-brand-500">{commerceNote}</p>}
        </div>
        <button type="button" onClick={() => void buy()} disabled={commerceBusy || syncState === "offline"} className="min-h-12 shrink-0 rounded-xl bg-brand-500 px-6 text-sm font-black text-brand-950 disabled:opacity-40">
          {commerceBusy ? "Kontrol ediliyor…" : `Nihai dosyayı al — ${MARITIME_DOSSIER_PRICE_USD} USD`}
        </button>
      </div>
    </section>
  </>;
}
