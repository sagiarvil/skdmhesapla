"use client";

import { useState } from "react";
import Link from "next/link";
import {
  cozSiniflandirma,
  type SihirbazAkis,
  type SihirbazVerdict,
} from "@/lib/skdm/siniflandirma";

type Props = { akis: SihirbazAkis; urunAdi: string };

export function SiniflandirmaSihirbazi({ akis, urunAdi }: Props) {
  const [acik, setAcik] = useState(false);
  const [adim, setAdim] = useState(0);
  const [cevap, setCevap] = useState<Record<string, string>>({});
  const [karar, setKarar] = useState<SihirbazVerdict | null>(null);
  const [cikis, setCikis] = useState(false);
  const [bildirim, setBildirim] = useState<string | null>(null);

  const soruHam = akis.questions[adim];
  const soru =
    soruHam && cevap.q2 === "celik" && soruHam.id === "q3"
      ? {
          ...soruHam,
          title: "Çelik profilin net ağırlığını biliyor musunuz?",
          hint: "Sadece metal kısım beyan edilecek — camın ağırlığı hesaba girmez.",
        }
      : soruHam;

  function bildir(msg: string) {
    setBildirim(msg);
    window.setTimeout(() => setBildirim(null), 2800);
  }

  async function kopyala(metin: string, ok: string) {
    try {
      await navigator.clipboard.writeText(metin);
      bildir(ok);
    } catch (err) {
      console.error(err);
      bildir("Panoya yazılamadı — metni elle kopyalayın.");
    }
  }

  function kaydet() {
    localStorage.setItem(
      `skdm_siniflandirma_${akis.lexiconId}`,
      JSON.stringify({ urunAdi, cevap, at: new Date().toISOString() })
    );
    bildir("Taslak kaydedildi — kaldığınız yerden dönebilirsiniz.");
  }

  function sec(optId: string) {
    if (!soru) return;
    const next = { ...cevap, [soru.id]: optId };
    setCevap(next);
    setCikis(false);
    const v = cozSiniflandirma(akis.lexiconId, next);
    if (v) {
      setKarar(v);
      return;
    }
    setKarar(null);
    setAdim((n) => Math.min(n + 1, akis.questions.length - 1));
  }

  function ctaTik(action?: SihirbazVerdict["ctas"][number]["action"]) {
    if (action === "copy-gumruk") void kopyala(akis.gumrukMetni, "Gümrük müşavirine metin kopyalandı.");
    if (action === "copy-uretim") void kopyala(akis.uretimMetni, "Üretim talebi kopyalandı.");
    if (action === "save") kaydet();
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-xl border border-accent-yellow/50 bg-accent-yellow/15 px-4 py-3 text-sm text-ink-900">
        <strong className="mb-1 block font-extrabold">{akis.whyTitle}</strong>
        <p className="font-medium leading-relaxed text-ink-700">{akis.whyBody}</p>
      </div>

      {!acik && (
        <button
          type="button"
          onClick={() => setAcik(true)}
          className="inline-flex min-h-12 items-center rounded-xl bg-brand-800 px-5 text-sm font-bold text-white shadow-sm hover:bg-brand-900"
        >
          Netleştirelim →
        </button>
      )}

      {acik && soru && !karar && (
        <div className="rounded-2xl border-2 border-line bg-white p-5 sm:p-6">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-800">
            {soru.numLabel}
          </div>
          <h4 className="text-base font-extrabold text-ink-900 sm:text-lg">{soru.title}</h4>
          <p className="mt-1 mb-4 text-sm font-medium text-ink-600">{soru.hint}</p>
          <div className="flex flex-col gap-2.5">
            {soru.options.map((o) => {
              const sel = cevap[soru.id] === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => sec(o.id)}
                  className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                    sel
                      ? "border-brand-800 bg-brand-100 font-bold text-brand-950"
                      : "border-line bg-white hover:border-brand-800"
                  }`}
                >
                  <span className="block text-sm sm:text-[15px]">{o.label}</span>
                  <span className="mt-0.5 block text-xs font-medium text-ink-600">{o.sub}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-ink-600 underline underline-offset-4 hover:text-brand-800"
            onClick={() => setCikis(true)}
          >
            {soru.idkLabel}
          </button>
        </div>
      )}

      {karar && (
        <div
          className={`rounded-2xl border-2 p-5 sm:p-6 ${
            karar.tip === "in"
              ? "border-brand-500 bg-brand-100/80"
              : karar.tip === "out"
                ? "border-slate-300 bg-slate-50"
                : "border-accent-yellow/60 bg-accent-yellow/15"
          }`}
        >
          <h3 className="text-lg font-extrabold text-ink-900 sm:text-xl">{karar.baslik}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700 sm:text-[15px]">
            {karar.metin}
          </p>
          <div className="mt-3 divide-y divide-black/10">
            {karar.facts.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 py-2.5 text-sm sm:flex-row sm:gap-3">
                <span className="min-w-[140px] shrink-0 font-bold text-ink-900">{k}</span>
                <span className="font-medium text-ink-700">{v}</span>
              </div>
            ))}
          </div>
          {karar.ctas.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {karar.ctas.map((c) =>
                c.href ? (
                  <Link
                    key={c.label}
                    href={c.href}
                    className={`inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold ${
                      c.kind === "olive"
                        ? "bg-brand-800 text-white hover:bg-brand-900"
                        : "border-2 border-line bg-white text-ink-800 hover:border-brand-800"
                    }`}
                  >
                    {c.label}
                  </Link>
                ) : (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => ctaTik(c.action)}
                    className={`inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold ${
                      c.kind === "olive"
                        ? "bg-brand-800 text-white hover:bg-brand-900"
                        : "border-2 border-line bg-white text-ink-800 hover:border-brand-800"
                    }`}
                  >
                    {c.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}

      {cikis && (
        <div className="rounded-2xl border-2 border-dashed border-line bg-white p-5 text-sm text-ink-700">
          <strong className="mb-1 block font-extrabold text-ink-900">
            Sorun değil — burada takılıp kalmayın.
          </strong>
          Bu bilgiyi bulmanın üç yolu var. Hangisini seçerseniz seçin, buraya kaldığınız yerden dönebilirsiniz.
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => ctaTik("copy-gumruk")}
              className="rounded-xl border-2 border-line bg-white px-3 py-2 text-xs font-bold hover:border-brand-800"
            >
              Gümrük müşavirime sorayım
            </button>
            <button
              type="button"
              onClick={() => ctaTik("copy-uretim")}
              className="rounded-xl border-2 border-line bg-white px-3 py-2 text-xs font-bold hover:border-brand-800"
            >
              Üretimden isteyeyim
            </button>
            <button
              type="button"
              onClick={() => ctaTik("save")}
              className="rounded-xl border-2 border-line bg-white px-3 py-2 text-xs font-bold hover:border-brand-800"
            >
              Şimdilik kaydet, sonra döneyim
            </button>
          </div>
        </div>
      )}

      {bildirim && (
        <p className="rounded-xl border border-brand-500/40 bg-brand-100 px-3 py-2 text-sm font-bold text-brand-950">
          {bildirim}
        </p>
      )}

      {acik && (
        <p className="text-xs font-medium text-ink-600">
          Bu bir gümrük sınıflandırma kararı değildir; kesin GTİP teyidini gümrük beyannameniz ve
          müşavirinizle yapınız.
        </p>
      )}
    </div>
  );
}
