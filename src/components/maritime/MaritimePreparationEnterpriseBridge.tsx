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
import type { MaritimePreparationFile } from "@/lib/maritime/types";
import { MaritimePreparationWorkbenchV2 } from "./MaritimePreparationWorkbenchV2";

const RECOVERY_KEY = "skdmhesapla-maritime-preparation-v2";

type SyncState = "loading" | "synced" | "pending" | "saving" | "offline" | "conflict" | "locked";

export function MaritimePreparationEnterpriseBridge() {
  const { user, loading: authLoading } = useAuth();
  const [booted, setBooted] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const [message, setMessage] = useState("Sunucu çalışma alanı hazırlanıyor…");
  const [checkpointHash, setCheckpointHash] = useState<string | null>(null);
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
          // First migration only: an old browser draft may be promoted to the authenticated backend.
          lastSavedPayloadRef.current = "";
        }
        setGeneration((x) => x + 1);
        setBooted(true);
      } catch (error) {
        if (stoppedRef.current) return;
        const text = error instanceof Error ? error.message : "Sunucu çalışma alanı açılamadı.";
        setSyncState("offline");
        setMessage(text);
        setBooted(true); // Local recovery UI remains visible, but never presented as authoritative.
      }
    };
    void bootstrap();
    return () => { stoppedRef.current = true; };
  }, [authLoading, user]);

  useEffect(() => {
    if (!booted || !user || user.isAnonymous) return;
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
  }, [booted, syncState, user]);

  const checkpoint = async () => {
    if (!contextRef.current || saveInFlightRef.current) return;
    setSyncState("saving");
    setMessage("Değişmez kontrol noktası oluşturuluyor…");
    try {
      // Force any pending browser state to the server first.
      const serialized = localStorage.getItem(RECOVERY_KEY) || "";
      if (serialized && serialized !== lastSavedPayloadRef.current) {
        const file = JSON.parse(serialized) as MaritimePreparationFile;
        const saved = await saveMaritimeFile(contextRef.current, file, revisionRef.current);
        revisionRef.current = saved.revision;
        lastSavedPayloadRef.current = serialized;
      }
      const result = await createMaritimeCheckpoint(contextRef.current);
      setCheckpointHash(result.snapshotHash);
      setSyncState("synced");
      setMessage(`Değişmez kontrol noktası oluşturuldu · ${result.snapshotHash.slice(0, 12)}…`);
    } catch (error) {
      setSyncState("offline");
      setMessage(error instanceof Error ? error.message : "Kontrol noktası oluşturulamadı.");
    }
  };

  if (authLoading || (user && !booted)) {
    return <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f7ef]"><div className="rounded-2xl border border-line bg-white p-7 text-center shadow-sm"><Loader2 className="mx-auto h-7 w-7 animate-spin text-brand-800"/><p className="mt-3 text-sm font-black">Enterprise denizcilik çalışma alanı açılıyor…</p></div></div>;
  }

  if (!user || user.isAnonymous) {
    return <div className="min-h-[70vh] bg-[#f4f7ef] px-5 py-16"><div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-xl"><FileLock2 className="mx-auto h-10 w-10 text-brand-800"/><h1 className="mt-4 text-2xl font-black">Kalıcı denizcilik dosyası için güvenli hesap gerekir.</h1><p className="mt-3 text-sm font-semibold leading-7 text-ink-700">Şirket, filo, gemi, raporlama yılı, voyage, fuel, kanıt, revision ve audit kayıtları Firebase backend üzerinde kullanıcı hesabınıza bağlanır.</p><Link href="/giris/" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-900 px-6 text-sm font-black text-white">Üye girişi</Link></div></div>;
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
    <MaritimePreparationWorkbenchV2 key={generation}/>
  </>;
}
