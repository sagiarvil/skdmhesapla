"use client";

import { useState } from "react";
import type { FieldConfig } from "@/lib/skdm/fieldhelp/types";
import { createDelegationShare } from "@/lib/skdm/delegation-share";

/**
 * Tek alanlı delegasyon linki üretici.
 * Link, gerçek backend çağrısıyla oluşturulur ve panoya kopyalanır;
 * linki açan kişi yalnızca o tek alanı doldurur.
 */
export function DelegationLinkButton({
  sessionId,
  sectorSlug,
  fieldId,
  field,
  label = "Link oluştur, kopyala",
  tone = "light",
}: {
  sessionId: string;
  sectorSlug: string;
  fieldId: string;
  field: FieldConfig;
  label?: string;
  tone?: "light" | "dark";
}) {
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handle = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await createDelegationShare({
        sessionId,
        sectorSlug,
        fieldId,
        fieldTitle: field.title,
        why: field.why,
        howToEnter: field.howToEnter,
        required: field.required,
        inputType: field.type || "text",
      });
      if (!res.ok) {
        setError(res.message || "Link oluşturulamadı — tekrar deneyin.");
        return;
      }
      if (!res.url) {
        setError("Link oluşturulamadı — tekrar deneyin.");
        return;
      }
      const absolute = new URL(res.url, window.location.origin).href;
      setLink(absolute);
      await navigator.clipboard.writeText(absolute).catch(() => {});
    } catch {
      setError("Link oluşturulamadı — tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  const isDark = tone === "dark";

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        disabled={busy}
        onClick={handle}
        className={`min-h-[40px] rounded-xl px-4 py-2 text-xs font-bold transition-all ${
          isDark
            ? "border border-white/40 bg-white/10 text-white hover:bg-white/20"
            : "border border-brand-800/30 bg-white text-brand-900 hover:bg-brand-100/60"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {busy ? "Oluşturuluyor…" : label}
      </button>

      {link && (
        <div className="space-y-1">
          <div
            className="break-all rounded-lg border border-line bg-white px-3 py-2 font-mono text-[11.5px] font-semibold text-brand-900"
            style={{ wordBreak: "break-all" }}
          >
            {link}
          </div>
          <p className="text-[11.5px] font-semibold text-brand-800">
            Panoya kopyalandı — bu linke tıklayan kişi yalnızca bu tek alanı görür, hesap açması gerekmez.
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-accent-yellow/15 px-3 py-2 text-[11.5px] font-semibold text-ink-800">
          {error}
        </p>
      )}
    </div>
  );
}
