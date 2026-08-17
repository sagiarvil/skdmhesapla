"use client";

import { useState } from "react";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";
import { PLATFORM_STATS } from "@/lib/skdm/constants";
import { SITE } from "@/lib/skdm/site-config";
import { isPaddleCheckoutReady, openPaddleSealCheckout } from "@/lib/skdm/paddle";
import { track } from "@/lib/skdm/analytics";
import { waitForPaymentCompleted } from "@/lib/payment/order-status";
import type { SealPackageType, SealWorkflowType } from "@/lib/payment/seal-entitlement";
import { useBodyScrollLock } from "@/lib/ui/body-scroll-lock";

type Props = {
  open: boolean;
  sessionId: string;
  sectorSlug: string;
  customerEmail?: string;
  workflowType?: SealWorkflowType;
  packageType?: SealPackageType;
  fileCount?: number;
  onClose: () => void;
  onPaid: (transactionId: string) => void;
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

  useBodyScrollLock(open);

  if (!open) return null;

  const pay = async () => {
    setNote(null);
    if (!isPaddleCheckoutReady()) {
      setNote("Ödeme yapılandırması eksik. Gözden geçirin.");
      return;
    }
    setBusy(true);
    track("checkout_start", { sectorSlug, workflowType });
    try {
      await openPaddleSealCheckout({
        sessionId,
        sectorSlug,
        customerEmail,
        workflowType,
        packageType: resolvedPackageType,
        onCompleted: (transactionId) => {
          void (async () => {
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
            setBusy(false);
            onPaid(transactionId);
          })();
        },
        onClosed: () => {
          setBusy(false);
          setNote("Ödeme tamamlanmadı. Gözden geçirin.");
        },
      });
    } catch {
      setBusy(false);
      setNote("Ödeme penceresi açılamadı. Gözden geçirin.");
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
          Mühürlü paketi kilitle
        </h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">
          Ödeme yalnızca bu adımda alınır. Paddle (Merchant of Record) tahsilatı yapar ve faturayı keser.
          Bedel {fiyat} ₺, KDV dahildir.
        </p>
        <ul className="mt-4 space-y-1.5 text-sm font-semibold text-ink-900">
          <li>• {resolvedFileCount} dosyalık mühürlü ZIP, anında indirilir</li>
          <li>• SHA-256 bütünlük mührü ve /dogrula/ kaydı</li>
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
            className="min-h-11 rounded-ctl border border-line px-4 text-sm font-bold text-ink-800"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void pay()}
            className="min-h-11 rounded-ctl bg-brand-500 px-5 text-sm font-black text-brand-950 disabled:opacity-40"
          >
            {busy ? "Ödeme penceresi açılıyor…" : `Ödemeye geç — ${fiyat} ₺`}
          </button>
        </div>
      </div>
    </div>
  );
}
