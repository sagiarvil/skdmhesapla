"use client";

import { useState } from "react";
import { resolveFieldWhatIsIt } from "@/lib/skdm/fieldhelp";
import type { FieldConfig } from "@/lib/skdm/fieldhelp/types";

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

  const copyDelegation = async () => {
    if (!cfg.delegationTemplate) return;
    await navigator.clipboard.writeText(cfg.delegationTemplate);
  };

  const inputClass =
    "min-h-ctl w-full rounded-ctl border border-line bg-white px-3 text-sm text-ink-900 " +
    (cfg.type === "number" || id === "unlocode" || id.includes("cn")
      ? "font-mono tabular-nums"
      : "");

  return (
    <div
      className={`rounded-ctl border border-line bg-brand-100/40 p-4 ${skipped ? "opacity-50" : ""}`}
      id={`fb-${id}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink-900">{cfg.title}</span>
        <span
          className={
            cfg.required === "zorunlu"
              ? "rounded-pill bg-accent-yellow/20 px-2 py-0.5 text-[10px] font-bold uppercase text-ink-900"
              : "rounded-pill bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-800"
          }
        >
          {cfg.required}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink-600">{cfg.why}</p>

      <div className="mt-3">
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
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
          />
        )}
      </div>
      <p className="mt-1 text-[11px] text-ink-600/80">{cfg.howToEnter}</p>
      {id === "mahsup" && (
        <p className="mt-1.5 text-xs leading-relaxed text-brand-900/70">
          <strong>Şu an bu alan sizin için 0&apos;dır.</strong> Türkiye ETS&apos;si 2026–2027
          pilot döneminde ve bu dönemde tesislere %100 ücretsiz tahsisat veriliyor,
          mali yükümlülük uygulanmıyor. Dolayısıyla mahsup edilecek ödenmiş bir karbon
          bedeliniz bulunmuyor. Bu durum TR-ETS mali yükümlülük dönemine geçtiğinde
          değişecek ve sistem sizi bilgilendirecek.
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-accent-teal">
        <button type="button" className="underline" onClick={() => toggle("what")}>
          Bu nedir?
        </button>
        {cfg.whereToFind.length > 0 && (
          <button type="button" className="underline" onClick={() => toggle("where")}>
            Nereden bulabilirim?
          </button>
        )}
        {cfg.whoHasIt && cfg.whoHasIt !== "—" && (
          <button type="button" className="underline" onClick={() => toggle("who")}>
            Kimde olabilir?
          </button>
        )}
        <button type="button" className="underline" onClick={() => toggle("consequence")}>
          Eksik bırakırsam ne olur?
        </button>
      </div>

      {panel === "what" && (
        <div className="mt-2 rounded-ctl bg-white p-3 text-xs text-ink-900">{whatIsIt}</div>
      )}
      {panel === "where" && (
        <div className="mt-2 rounded-ctl bg-white p-3 text-xs text-ink-900">
          <b>Bu bilgiyi şuralardan bulabilirsiniz:</b>
          <ul className="mt-1 list-disc pl-4">
            {cfg.whereToFind.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      {panel === "who" && (
        <div className="mt-2 rounded-ctl bg-white p-3 text-xs text-ink-900">
          <b>Muhtemel sahibi:</b> {cfg.whoHasIt}
          {cfg.delegationTemplate ? (
            <div className="mt-2 space-y-2">
              <p className="rounded-ctl bg-brand-100 p-2 text-[11px] leading-relaxed">
                {cfg.delegationTemplate}
              </p>
              <button
                type="button"
                onClick={copyDelegation}
                className="rounded-ctl bg-brand-800 px-3 py-1.5 text-[11px] font-semibold text-white"
              >
                Bu kişiden iste — metni kopyala
              </button>
            </div>
          ) : null}
        </div>
      )}
      {panel === "consequence" && (
        <div className="mt-2 rounded-ctl bg-white p-3 text-xs text-ink-900">
          {cfg.consequence || "—"}
        </div>
      )}

      {(cfg.required !== "zorunlu" || cfg.delegationTemplate) && (
        <div className="mt-2">
          <button
            type="button"
            className="text-[11px] font-medium text-brand-800 underline"
            onClick={() => setIdk(true)}
          >
            Bilmiyorum
          </button>
          {idk && (
            <div className="mt-2 rounded-ctl border border-accent-yellow/40 bg-accent-yellow/10 p-3 text-xs text-ink-900">
              Bu bilgiyi şu anda girmek zorunda değilsiniz.
              <div className="mt-2 flex flex-wrap gap-2">
                {cfg.whereToFind.length > 0 && (
                  <button type="button" className="underline" onClick={() => toggle("where")}>
                    Nereden bulacağımı göster
                  </button>
                )}
                {onSkip && (
                  <button type="button" className="underline" onClick={() => onSkip(id)}>
                    Şimdilik eksik bırak
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {anomaly && (
        <p className="mt-2 rounded-ctl border border-accent-yellow bg-accent-yellow/15 px-2 py-1.5 text-xs text-ink-900">
          {anomaly} — girdiyi gözden geçirin.
        </p>
      )}
    </div>
  );
}
