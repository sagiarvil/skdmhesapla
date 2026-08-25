"use client";

import { useState } from "react";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";
import { PLATFORM_STATS } from "@/lib/skdm/constants";
import { SITE } from "@/lib/skdm/site-config";
import { isPaddleCheckoutReady, openPaddleSealCheckout } from "@/lib/skdm/paddle";
import { track } from "@/lib/skdm/analytics";
import { waitForPaymentCompleted } from "@/lib/payment/order-status";
import { authFetch } from "@/lib/api/auth-fetch";
import type { SealPackageType, SealWorkflowType } from "@/lib/payment/seal-entitlement";

type Props = {
  open: boolean;
  sessionId: string;
  sectorSlug: string;
  customerEmail?: string;
  workflowType?: SealWorkflowType;
  packageType?: SealPackageType;
  fileCount?: number;
  onClose: () => void;
  /** PCF geriye uyumluluk. CBAM teslimi bu callback'e güvenmez; sunucudan indirilir. */
  onPaid: (transactionId: string) => void;
};

type CbamSealResponse = {
  ok?: boolean;
  packageId?: string;
  masterHash?: string;
  status?: "ready" | "building";
  downloadPath?: string;
  message?: string;
};

export function SealModal({
  open,
  sessionId,
  sectorSlug,
  customerEmail,
  workflowType = "cbam",
  packageType,
  fileCount,
  onClose,
  onPaid,
}: Props) {
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fiyat = PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR");
  const resolvedFileCount = fileCount ?? PLATFORM_STATS.fileCount;
  const resolvedPackageType =
    packageType ?? (workflowType === "pcf" ? "PCF_SEAL_PACKAGE_9900" : "CBAM_SEAL_PACKAGE_9900");

  if (!open) return null;

  const ensureCbamServerReady = async () => {
    const response = await authFetch("/api/cbam/feature-flags");
    if (!response.ok) throw new Error("CBAM paket sunucusu hazır değil");
    const body = (await response.json()) as {
      cbamServerAuthoritativeSealReady?: boolean;
      commercialReleaseReady?: boolean;
      paidSealDataPolicy?: string;
    };
    if (!body.cbamServerAuthoritativeSealReady) {
      throw new Error("CBAM paket sunucusu kalite kapısında");
    }
    if (!body.commercialReleaseReady) {
      throw new Error("Ücretli CBAM teslimi production ödeme kabulü tamamlanana kadar kapalıdır");
    }
    if (body.paidSealDataPolicy !== "actual-data-only") {
      throw new Error("CBAM veri politikası doğrulanamadı");
    }
  };

  const sealAndDownloadCbam = async (transactionId: string) => {
    setNote("Ödeme doğrulandı. Dosya sunucuda yeniden hesaplanıyor ve mühürleniyor…");
    const sealRes = await authFetch("/api/cbam/seal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        paddleTransactionId: transactionId,
        workflowType: "cbam",
      }),
    });
    const sealBody = (await sealRes.json().catch(() => null)) as CbamSealResponse | null;
    if (!sealRes.ok || !sealBody?.packageId) {
      throw new Error(sealBody?.message || "Sunucu-otoriteli CBAM paketi üretilemedi");
    }

    const downloadPath = sealBody.downloadPath || `/api/cbam/download?packageId=${encodeURIComponent(sealBody.packageId)}`;
    let downloadRes: Response | null = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      if (sealBody.status === "building" || attempt > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, 1250));
      }
      downloadRes = await authFetch(downloadPath);
      if (downloadRes.status !== 409) break;
    }
    if (!downloadRes?.ok) {
      const body = (await downloadRes?.json().catch(() => null)) as { message?: string } | null;
      throw new Error(body?.message || "Paket üretildi ancak indirme tamamlanamadı");
    }

    const blob = await downloadRes.blob();
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement("a");
      a.href = url;
      const disposition = downloadRes.headers.get("Content-Disposition") || "";
      const match = /filename="([^"]+)"/.exec(disposition);
      a.download = match?.[1] || `${sealBody.packageId}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      URL.revokeObjectURL(url);
    }

    track("cbam_server_seal_download", {
      sectorSlug,
      transactionId,
      packageId: sealBody.packageId,
      masterHash: sealBody.masterHash,
    });
    setNote("Sunucu-mühürlü paket indirildi. SHA-256 kayıt numarası paket manifestosundadır.");
  };

  const pay = async () => {
    setNote(null);
    if (!isPaddleCheckoutReady()) {
      setNote("Ödeme yapılandırması eksik. Gözden geçirin.");
      return;
    }
    setBusy(true);
    try {
      if (workflowType === "cbam") {
        setNote("Sunucu kalite kapısı kontrol ediliyor…");
        await ensureCbamServerReady();
      }

      track("checkout_start", { sectorSlug, workflowType });
      await openPaddleSealCheckout({
        sessionId,
        sectorSlug,
        customerEmail,
        workflowType,
        packageType: resolvedPackageType,
        onCompleted: (transactionId) => {
          void (async () => {
            try {
              setNote("Ödeme kaydı doğrulanıyor…");
              const st = await waitForPaymentCompleted({ transactionId, sessionId });
              if (st.status !== "completed") {
                setBusy(false);
                setNote(
                  st.status === "rejected"
                    ? "Ödeme bu çalışma ile eşleşmedi. Gözden geçirin."
                    : `Ödeme kaydı henüz işlenmedi. İşlem no: ${transactionId}`,
                );
                return;
              }
              track("payment_success", { sectorSlug, transactionId, workflowType });

              if (workflowType === "cbam") {
                await sealAndDownloadCbam(transactionId);
                setBusy(false);
                return;
              }

              setBusy(false);
              onPaid(transactionId);
            } catch (error) {
              setBusy(false);
              setNote(error instanceof Error ? error.message : "Paket teslimi tamamlanamadı. Gözden geçirin.");
            }
          })();
        },
        onClosed: () => {
          setBusy(false);
          setNote("Ödeme tamamlanmadı. Gözden geçirin.");
        },
      });
    } catch (error) {
      setBusy(false);
      setNote(error instanceof Error ? error.message : "Ödeme penceresi açılamadı. Gözden geçirin.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-brand-950/55 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="seal-modal-title"
    >
      <div className="w-full max-w-lg rounded-card border-2 border-brand-500 bg-white p-6 shadow-xl sm:p-7">
        <h2 id="seal-modal-title" className="text-xl font-black tracking-tight text-ink-900">
          {workflowType === "cbam" ? "SKDM-CBAM paketini sunucuda kilitle" : "Mühürlü paketi kilitle"}
        </h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">
          Ödeme yalnızca bu adımda alınır. Paddle (Merchant of Record) tahsilatı yapar ve faturayı keser.
          Bedel {fiyat} ₺, KDV dahildir.
        </p>
        <ul className="mt-4 space-y-1.5 text-sm font-semibold text-ink-900">
          <li>• {resolvedFileCount} dosyalık ZIP ve SHA-256 bütünlük kaydı</li>
          <li>• CBAM paketinde hesap ve dosya içeriği ödeme sonrası sunucuda yeniden üretilir</li>
          {workflowType === "cbam" && <li>• Ücretli paket yalnız gerçek tesis / kaynak akışı verisiyle oluşturulur; sektör benchmark ön izlemesi mühürlenmez</li>}
          <li>• Akredite doğrulama görüşü veya gümrük onayı değildir</li>
          <li>• {SITE.resealPublicCopy}</li>
          <li>• İndirilen dijital içerikte cayma hakkı kullanılmaz</li>
        </ul>
        <p className="mt-3 text-xs font-medium text-ink-600">
          Ayrıntı: <a className="font-bold text-brand-900 underline" href="/iade-politikasi/">İade politikası</a>
          {" · "}
          <a className="font-bold text-brand-900 underline" href="/kullanim-kosullari/">Kullanım koşulları</a>
        </p>
        {note && (
          <p className="mt-3 rounded-2xl p-3 text-sm font-semibold" style={{ background: "#F3EDE4", color: "#6B5A3A" }}>
            {note}
          </p>
        )}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="min-h-11 rounded-ctl border border-line px-4 text-sm font-bold text-ink-800 disabled:opacity-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void pay()}
            className="min-h-11 rounded-ctl bg-brand-500 px-5 text-sm font-black text-brand-950 disabled:opacity-40"
          >
            {busy ? "Kontrol ediliyor…" : `Ödemeye geç — ${fiyat} ₺`}
          </button>
        </div>
      </div>
    </div>
  );
}
