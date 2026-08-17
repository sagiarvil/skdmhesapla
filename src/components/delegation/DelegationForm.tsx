"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDelegationShare,
  submitDelegationValue,
  type VeriTalebiShare,
} from "@/lib/skdm/delegation-share";
import { getField } from "@/lib/skdm/fieldhelp";
import { emitFunnelEvent } from "@/lib/seo/funnel-events";

type Status = "loading" | "missing" | "not_found" | "filled" | "ready";

const CARD = "w-full rounded-3xl border-2 bg-white p-6 sm:p-8 shadow-xl";

export function DelegationForm() {
  const [status, setStatus] = useState<Status>("loading");
  const [share, setShare] = useState<VeriTalebiShare | null>(null);
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("token")?.trim() || ""
      : "";

  const load = useCallback(async () => {
    if (!token) {
      setStatus("missing");
      return;
    }
    const res = await getDelegationShare(token);
    if (!res.ok || !res.share) {
      setStatus("not_found");
      return;
    }
    if (res.share.used) {
      setStatus("filled");
      return;
    }
    setShare(res.share);
    setStatus("ready");
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (status === "ready") emitFunnelEvent("delegation_page_viewed", {});
  }, [status]);

  const submit = async () => {
    if (!share) return;
    if (share.required === "zorunlu" && value.trim() === "") {
      setSubmitError("Bu alan zorunlu — değeri yazıp tekrar deneyin.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const res = await submitDelegationValue(token, value.trim());
    if (!res.ok) {
      setSubmitError(
        res.message
          ? `Gönderilemedi — ${res.message}`
          : "Gönderilemedi, kısa süre sonra tekrar deneyin."
      );
      setSubmitting(false);
      return;
    }
    emitFunnelEvent("delegation_value_submitted", {});
    setStatus("filled");
  };

  if (status === "loading") {
    return (
      <div className={CARD}>
        <p className="text-sm font-semibold text-ink-700">Veri talebi yükleniyor…</p>
      </div>
    );
  }

  if (status === "missing") {
    return (
      <div className={CARD}>
        <h1 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
          Bu sayfaya bir veri talebi bağlantısıyla ulaşmanız gerekiyor
        </h1>
        <p className="mt-3 text-sm font-medium text-ink-700">
          Bağlantıyı gönderen kişiden adresin tamamını kopyalayıp yeniden deneyebilirsiniz.
        </p>
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className={CARD}>
        <h1 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
          Bu bağlantıya ulaşamadık
        </h1>
        <p className="mt-3 text-sm font-medium text-ink-700">
          Bağlantıyı gönderen kişiden yeni bir talebi paylaşmasını isteyebilirsiniz.
        </p>
      </div>
    );
  }

  if (status === "filled") {
    return (
      <div className={CARD}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <span className="text-xl font-black">✓</span>
        </div>
        <h1 className="mt-4 text-xl font-extrabold text-ink-900 sm:text-2xl">
          Bilgi dosyanıza işlendi
        </h1>
        <p className="mt-3 text-sm font-medium text-ink-700">
          Gönderdiğiniz değer, ilgili çalışma dosyasına kaydedildi. Başka bir talebiniz varsa
          yeni bağlantıyla bu sayfaya dönebilirsiniz.
        </p>
      </div>
    );
  }

  if (!share) return null;

  return (
    <div className={CARD}>
      <span
        className={
          share.required === "zorunlu"
            ? "rounded-full bg-accent-yellow/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-ink-900 border border-accent-yellow/60"
            : "rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-900 border border-brand-500/40"
        }
      >
        {share.required}
      </span>
      <h1 className="mt-3 text-xl font-extrabold text-ink-900 sm:text-2xl">{share.fieldTitle}</h1>
      {share.why && (
        <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">{share.why}</p>
      )}

      <div className="mt-6">
        {share.inputType === "select" ? (
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white px-4 text-base font-medium text-ink-900 shadow-sm transition-all focus:border-brand-800 focus:outline-none"
          >
            <option value="">Seçin…</option>
            {getField(share.fieldId)?.options?.map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={share.inputType === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={share.howToEnter || "Değerinizi yazın"}
            className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white px-4 text-base font-medium text-ink-900 shadow-sm transition-all focus:border-brand-800 focus:outline-none"
          />
        )}
      </div>
      {share.howToEnter && (
        <p className="mt-2 text-xs font-medium text-ink-600">{share.howToEnter}</p>
      )}

      {submitError && (
        <p className="mt-4 rounded-2xl border border-accent-yellow bg-accent-yellow/20 p-3 text-sm font-semibold text-ink-900">
          {submitError}
        </p>
      )}

      <button
        type="button"
        disabled={submitting}
        onClick={() => void submit()}
        className="mt-6 min-h-[48px] w-full rounded-2xl bg-brand-800 px-6 text-base font-bold text-white shadow-md transition-all hover:bg-brand-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Gönderiliyor…" : "Gönder"}
      </button>

      <p className="mt-4 text-xs font-medium text-ink-600">
        Bu sayfa yalnızca istenen tek bilgiyi toplar; hesap açmanıza gerek yoktur.
      </p>
    </div>
  );
}
