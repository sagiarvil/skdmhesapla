"use client";

import { useEffect, useState } from "react";
import { resolveFieldWhatIsIt } from "@/lib/skdm/fieldhelp";
import type { FieldConfig } from "@/lib/skdm/fieldhelp/types";
import { isOutsideStableViewport, stableScrollToField } from "@/lib/ui/stable-scroll";

type Props = {
  id: string;
  cfg: FieldConfig;
  value: string;
  onChange: (id: string, value: string) => void;
  skipped?: boolean;
  onSkip?: (id: string) => void;
};

type Panel = "what" | "where" | "who" | "consequence" | null;

export function FieldHelp({ id, cfg, value, onChange, skipped, onSkip }: Props) {
  const [panel, setPanel] = useState<Panel>(null);
  const [idk, setIdk] = useState(false);
  const whatIsIt = resolveFieldWhatIsIt(id, cfg.whatIsIt);
  const anomaly =
    cfg.anomaly && cfg.type === "number" && Number(value) > cfg.anomaly.threshold
      ? cfg.anomaly.msg
      : null;

  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p));

  useEffect(() => {
    if (!panel) return;
    const el = document.getElementById(`fb-${id}`);
    if (!el || !isOutsideStableViewport(el)) return;
    void stableScrollToField(id, { behavior: "smooth" });
  }, [panel, id]);

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

  return (
    <div
      className={`rounded-3xl border-2 border-line bg-brand-100/50 p-5 sm:p-6 space-y-3 ${skipped ? "opacity-50" : ""}`}
      id={`fb-${id}`}
      data-scroll-target
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-base sm:text-lg font-bold text-ink-900">{cfg.title}</span>
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
      <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-ink-700">{cfg.why}</p>

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

      <div className="flex flex-wrap gap-4 pt-1 text-xs sm:text-sm font-bold text-brand-800">
        <button type="button" className="hover:underline hover:text-brand-950 transition-colors" onClick={() => toggle("what")}>
          Bu nedir?
        </button>
        {cfg.whereToFind.length > 0 && (
          <button type="button" className="hover:underline hover:text-brand-950 transition-colors" onClick={() => toggle("where")}>
            Nereden bulabilirim?
          </button>
        )}
        {cfg.whoHasIt && cfg.whoHasIt !== "—" && (
          <button type="button" className="hover:underline hover:text-brand-950 transition-colors" onClick={() => toggle("who")}>
            Kimde olabilir?
          </button>
        )}
        <button type="button" className="hover:underline hover:text-brand-950 transition-colors" onClick={() => toggle("consequence")}>
          Eksik bırakırsam ne olur?
        </button>
      </div>

      {panel === "what" && (
        <div className="mt-2 rounded-xl bg-white p-4 text-sm text-ink-900 border border-line">{whatIsIt}</div>
      )}
      {panel === "where" && (
        <div className="mt-2 rounded-2xl border border-line bg-white p-4 text-sm text-ink-900 shadow-sm">
          <b className="font-bold">Bu bilgiyi şuralardan bulabilirsiniz:</b>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-ink-700">
            {cfg.whereToFind.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      {panel === "who" && (
        <div className="mt-2 rounded-2xl border border-line bg-white p-4 text-sm text-ink-900 shadow-sm space-y-3">
          <div><b className="font-bold">Muhtemel sahibi:</b> {cfg.whoHasIt}</div>
          {cfg.delegationTemplate ? (
            <div className="space-y-2">
              <p className="rounded-xl bg-brand-100/60 p-3 text-sm leading-relaxed text-ink-800 border border-brand-800/15">
                {cfg.delegationTemplate}
              </p>
              <button
                type="button"
                onClick={copyDelegation}
                className="rounded-xl bg-brand-800 px-4 py-2 text-xs font-bold text-white hover:bg-brand-950 transition"
              >
                Bu kişiden iste — metni kopyala
              </button>
            </div>
          ) : null}
        </div>
      )}
      {panel === "consequence" && (
        <div className="mt-2 rounded-2xl border border-line bg-white p-4 text-sm leading-relaxed text-ink-900 shadow-sm">
          {cfg.consequence || "—"}
        </div>
      )}

      {(cfg.required !== "zorunlu" || cfg.delegationTemplate) && (
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
                {cfg.whereToFind.length > 0 && (
                  <button type="button" className="underline hover:text-brand-950" onClick={() => toggle("where")}>
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
