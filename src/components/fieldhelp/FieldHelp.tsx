"use client";

import { useState } from "react";
import { resolveFieldWhatIsIt } from "@/lib/skdm/fieldhelp";
import type { FieldConfig } from "@/lib/skdm/fieldhelp/types";
import { Info } from "@phosphor-icons/react";

type Props = {
  id: string;
  cfg: FieldConfig;
  value: string;
  onChange: (id: string, value: string) => void;
  skipped?: boolean;
  onSkip?: (id: string) => void;
  /** GATE-1 (RM-007): alan etiketi özel olarak değişebilir (örn. VKN/TCKN seçime göre). */
  titleOverride?: string;
};

/** GATE-3 (RM-007): kullanıcının kesin bildiği alanlarda "Bilmiyorum" çıkmaz. */
const ALWAYS_KNOWN_FIELDS = new Set(["temsilciEmail", "temsilciAdi"]);

export function FieldHelp({ id, cfg, value, onChange, skipped, onSkip, titleOverride }: Props) {
  const [open, setOpen] = useState(false);
  const [idk, setIdk] = useState(false);
  const whatIsIt = resolveFieldWhatIsIt(id, cfg.whatIsIt);
  const anomaly =
    cfg.anomaly && cfg.type === "number" && Number(value) > cfg.anomaly.threshold
      ? cfg.anomaly.msg
      : null;

  const copyDelegation = async () => {
    if (!cfg.delegationTemplate) return;
    await navigator.clipboard.writeText(cfg.delegationTemplate);
  };

  const mahsupLocked = id === "mahsup";
  const displayValue = mahsupLocked ? "0" : value;
  const inputClass =
    "min-h-[48px] w-full rounded-2xl border-2 border-line bg-white px-4 text-base font-medium text-ink-900 shadow-sm transition-all focus:border-brand-800 focus:outline-none " +
    (cfg.type === "number" || id === "unlocode" || id.includes("cn")
      ? "font-mono tabular-nums text-lg font-semibold"
      : "") +
    (mahsupLocked ? " cursor-not-allowed opacity-80 bg-brand-50" : "");

  // GATE-3: anlamlı yardım başlıkları — alana göre değişir.
  const hasWhere = (cfg.whereToFind ?? []).length > 0;
  const hasWho =
    Boolean(cfg.whoHasIt) &&
    cfg.whoHasIt !== "—" &&
    !ALWAYS_KNOWN_FIELDS.has(id);

  // GATE-3: "Bilmiyorum" yalnızca boş, opsiyonel ve gerçekten bilinmeyebilecek alanlarda.
  const canBeUnknown =
    value.trim() === "" &&
    cfg.required !== "zorunlu" &&
    Boolean(cfg.delegationTemplate) &&
    !ALWAYS_KNOWN_FIELDS.has(id) &&
    cfg.type !== "select";

  return (
    <div
      className={`rounded-3xl border-2 border-line bg-brand-100/50 p-5 sm:p-6 space-y-3 ${skipped ? "opacity-50" : ""}`}
      id={`fb-${id}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-ink-900">{titleOverride ?? cfg.title}</span>
          {(hasWhere || hasWho || cfg.why || cfg.consequence) && (
            <button
              type="button"
              aria-label="Bu alan hakkında yardım"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-800/25 bg-white/80 text-brand-800 transition hover:bg-brand-100"
            >
              <Info size={15} weight="bold" />
            </button>
          )}
        </span>
        <span
          className={
            cfg.required === "zorunlu"
              ? "rounded-full bg-accent-yellow/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-ink-900 border border-accent-yellow/60"
              : "rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-900 border border-brand-500/40"
          }
        >
          {cfg.required}
        </span>
      </div>

      <div className="pt-1">
        {cfg.type === "select" && cfg.options ? (
          <select
            id={`input-${id}`}
            className={inputClass}
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
          >
            {cfg.options.map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={`input-${id}`}
            type={cfg.type || "text"}
            className={inputClass}
            value={displayValue}
            readOnly={mahsupLocked}
            aria-readonly={mahsupLocked || undefined}
            onChange={(e) => {
              if (mahsupLocked) return;
              onChange(id, e.target.value);
            }}
          />
        )}
      </div>
      <p className="text-xs sm:text-sm font-medium text-ink-600">{cfg.howToEnter}</p>
      {id === "mahsup" && (
        <p className="rounded-2xl bg-white/80 p-4 text-sm sm:text-[15px] font-medium leading-relaxed text-brand-950 border border-brand-800/20">
          <strong>Şu an bu alan sizin için 0&apos;dır.</strong> Türkiye ETS&apos;si 2026–2027
          pilot döneminde ve bu dönemde tesislere %100 ücretsiz tahsisat veriliyor,
          mali yükümlülük uygulanmıyor. Dolayısıyla mahsup edilecek ödenmiş bir karbon
          bedeliniz bulunmuyor. Bu durum TR-ETS mali yükümlülük dönemine geçtiğinde
          değişecek ve sistem sizi bilgilendirecek.
        </p>
      )}

      {open && (
        <div className="mt-1 space-y-3 rounded-2xl border border-line bg-white p-4 text-sm text-ink-900 shadow-sm">
          {cfg.why && (
            <p className="font-medium leading-relaxed text-ink-800">
              <b className="font-bold">Neden önemli:</b> {cfg.why}
            </p>
          )}
          {whatIsIt && (
            <p className="leading-relaxed">
              <b className="font-bold">Bu nedir?</b> {whatIsIt}
            </p>
          )}
          {hasWhere && (
            <div>
              <b className="font-bold">Nereden bulabilirim?</b>
              <ul className="mt-1 list-disc pl-5 space-y-1 text-ink-700">
                {(cfg.whereToFind ?? []).map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          {hasWho && (
            <div className="space-y-2">
              <p>
                <b className="font-bold">Kimde olabilir?</b> {cfg.whoHasIt}
              </p>
              {cfg.delegationTemplate ? (
                <div className="space-y-2">
                  <p className="rounded-xl bg-brand-100/60 p-3 text-sm leading-relaxed text-ink-800 border border-brand-800/15">
                    {cfg.delegationTemplate}
                  </p>
                  <button
                    type="button"
                    onClick={() => void copyDelegation()}
                    className="rounded-xl bg-brand-800 px-4 py-2 text-xs font-bold text-white hover:bg-brand-950 transition"
                  >
                    Bu kişiden iste — metni kopyala
                  </button>
                </div>
              ) : null}
            </div>
          )}
          {cfg.consequence && (
            <p className="leading-relaxed">
              <b className="font-bold">Eksik bırakırsam ne olur?</b> {cfg.consequence}
            </p>
          )}
        </div>
      )}

      {canBeUnknown && (
        <div className="mt-2">
          <button
            type="button"
            className="text-xs font-bold text-brand-800 underline hover:text-brand-950"
            onClick={() => setIdk(true)}
          >
            Bilmiyorum
          </button>
          {idk && (
            <div className="mt-2 rounded-2xl border border-accent-yellow/50 bg-accent-yellow/15 p-4 text-sm text-ink-900 space-y-2">
              <p className="font-medium">Bu bilgiyi şu anda girmek zorunda değilsiniz.</p>
              <div className="flex flex-wrap gap-3 text-xs font-bold text-brand-800">
                {hasWhere && (
                  <button
                    type="button"
                    className="underline hover:text-brand-950"
                    onClick={() => setOpen(true)}
                  >
                    Nereden bulacağımı göster
                  </button>
                )}
                {onSkip && (
                  <button type="button" className="underline hover:text-brand-950" onClick={() => onSkip(id)}>
                    Şimdilik eksik bırak
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {anomaly && (
        <p className="mt-2 rounded-2xl border border-accent-yellow bg-accent-yellow/20 p-3 text-sm font-semibold text-ink-900">
          {anomaly} — girdiyi gözden geçirin.
        </p>
      )}
    </div>
  );
}
