"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  hesaplaUrl,
  cozSiniflandirma,
  uretimPaylasimYolu,
  type SihirbazAkis,
  type SihirbazSoru,
  type SihirbazVerdict,
} from "@/lib/skdm/siniflandirma";

type Props = { akis: SihirbazAkis; urunAdi: string; baslangicAdim?: number };

const btnOlive =
  "inline-flex min-h-12 items-center rounded-[10px] bg-[#4E5F35] px-[22px] text-[15px] font-bold text-white shadow-[0_2px_0_#3c4a29] hover:bg-[#3c4a29]";
const btnGhost =
  "inline-flex min-h-12 items-center rounded-[10px] border-[1.5px] border-[#E9E4D6] bg-transparent px-[22px] text-[15px] font-bold text-[#5C5A4E] hover:border-[#6B7F4A] hover:text-[#4E5F35]";

function soruMetni(akis: SihirbazAkis, s: SihirbazSoru, cevap: Record<string, string>): SihirbazSoru {
  if (s.id === "q3" && cevap.q2 === "celik") {
    return {
      ...s,
      title: "Çelik profilin net ağırlığını biliyor musunuz?",
      hint: "Sadece metal kısım beyan edilecek — camın ağırlığı hesaba girmez.",
    };
  }
  return s;
}

export function SiniflandirmaSihirbazi({ akis, urunAdi, baslangicAdim = 0 }: Props) {
  const [gorunen, setGorunen] = useState(baslangicAdim);
  const [cevap, setCevap] = useState<Record<string, string>>({});
  const [karar, setKarar] = useState<SihirbazVerdict | null>(null);
  const [cikis, setCikis] = useState(false);
  const [bildirim, setBildirim] = useState<string | null>(null);
  const [oranAcik, setOranAcik] = useState(false);
  const [toplamKg, setToplamKg] = useState("");
  const [metalPay, setMetalPay] = useState("");
  const sonRef = useRef<HTMLDivElement | null>(null);
  const yuklendi = useRef(false);

  useEffect(() => {
    if (yuklendi.current) return;
    yuklendi.current = true;
    try {
      const raw = localStorage.getItem(`skdm_siniflandirma_${akis.lexiconId}`);
      if (!raw) return;
      const kayit = JSON.parse(raw) as { cevap?: Record<string, string> };
      if (kayit.cevap && Object.keys(kayit.cevap).length > 0) {
        setCevap(kayit.cevap);
        const dolu = akis.questions.filter((s) => kayit.cevap?.[s.id]).length;
        setGorunen(Math.max(baslangicAdim, dolu, 1));
        const v = cozSiniflandirma(akis.lexiconId, kayit.cevap);
        if (v) setKarar(v);
      }
    } catch (err) {
      console.error(err);
    }
  }, [akis.lexiconId, akis.questions, baslangicAdim]);

  useEffect(() => {
    sonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [gorunen, karar, cikis, oranAcik]);

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

  function sec(soruId: string, optId: string, soruIndex: number) {
    const next: Record<string, string> = { ...cevap, [soruId]: optId };
    for (let i = soruIndex + 1; i < akis.questions.length; i++) {
      delete next[akis.questions[i]!.id];
    }
    setCevap(next);
    setCikis(false);
    const v = cozSiniflandirma(akis.lexiconId, next);
    if (v) {
      setKarar(v);
      return;
    }
    setKarar(null);
    setGorunen(Math.min(soruIndex + 2, akis.questions.length));
  }

  function indirBeyan() {
    const blob = new Blob([akis.kapsamDisiBeyanMetni], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SKDM-kapsam-disi-not.txt";
    a.click();
    URL.revokeObjectURL(url);
    bildir("Kapsam dışı beyan dosyası indirildi.");
  }

  function ctaTik(action?: SihirbazVerdict["ctas"][number]["action"]) {
    if (action === "copy-gumruk") void kopyala(akis.gumrukMetni, "Gümrük müşavirine metin kopyalandı.");
    if (action === "copy-uretim") {
      const yol = `${window.location.origin}${uretimPaylasimYolu()}`;
      void kopyala(`${akis.uretimMetni}\n\nTek soru bağlantısı: ${yol}`, "Üretim talebi ve bağlantı kopyalandı.");
    }
    if (action === "copy-kapsam-disi") {
      void kopyala(akis.kapsamDisiBeyanMetni, "Kapsam dışı beyan metni kopyalandı.");
    }
    if (action === "indir-beyan") indirBeyan();
    if (action === "save") kaydet();
    if (action === "oran") setOranAcik(true);
  }

  const acik = gorunen > 0;
  const gorunenSorular = akis.questions.slice(0, gorunen);

  return (
    <div className="mt-3 space-y-3.5">
      <div className="rounded-lg border-l-[3px] border-[#946A1E] bg-[#F6ECD6] px-4 py-3.5 text-sm leading-relaxed text-[#5C4310]">
        <strong className="mb-1 block font-bold">{akis.whyTitle}</strong>
        {akis.whyBody}
      </div>

      {!acik && (
        <button type="button" onClick={() => setGorunen(1)} className={btnOlive}>
          Netleştirelim →
        </button>
      )}

      {gorunenSorular.map((ham, idx) => {
        const s = soruMetni(akis, ham, cevap);
        return (
          <div
            key={s.id}
            className="rounded-[14px] border border-[#E9E4D6] bg-white p-[22px]"
          >
            <div className="mb-1.5 text-[12.5px] font-bold text-[#4E5F35]">{s.numLabel}</div>
            <h4 className="mb-1.5 text-[16.5px] font-bold text-[#2B2A24]">{s.title}</h4>
            <p className="mb-3.5 text-[13.5px] text-[#8C8A7C]">{s.hint}</p>
            <div className="flex flex-col gap-2.5">
              {s.options.map((o) => {
                const sel = cevap[s.id] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => sec(s.id, o.id, idx)}
                    className={`rounded-[10px] border-[1.5px] px-4 py-3 text-left text-[14.5px] ${
                      sel
                        ? "border-[#6B7F4A] bg-[#EEF1E3] font-bold text-[#4E5F35]"
                        : "border-[#E9E4D6] bg-white hover:border-[#6B7F4A]"
                    }`}
                  >
                    <span className="block">{o.label}</span>
                    <span
                      className={`mt-0.5 block text-[12.5px] font-normal ${
                        sel ? "text-[#4E5F35]" : "text-[#8C8A7C]"
                      }`}
                    >
                      {o.sub}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="mt-3 inline-block text-[13.5px] text-[#5C5A4E] underline underline-offset-[3px]"
              onClick={() => setCikis(true)}
            >
              {s.idkLabel}
            </button>
          </div>
        );
      })}

      {karar && (
        <div
          className={`rounded-[14px] border-[1.5px] p-6 ${
            karar.tip === "in"
              ? "border-[#6B7F4A] bg-[#EEF1E3]"
              : karar.tip === "out"
                ? "border-[#4A6B85] bg-[#E6EDF1]"
                : "border-[#BD6A3E] bg-[#F7E9DD]"
          }`}
        >
          <h3 className="mb-2 text-[19px] font-extrabold text-[#2B2A24]">{karar.baslik}</h3>
          <p className="mb-3 text-[15px] text-[#2B2A24]">{karar.metin}</p>
          {karar.facts.map(([k, v]) => (
            <div
              key={k}
              className="flex gap-2.5 border-t border-black/10 py-2.5 text-sm"
            >
              <b className="min-w-[130px] shrink-0">{k}</b>
              <span>{v}</span>
            </div>
          ))}
          {karar.ctas.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {karar.ctas.map((c) =>
                c.href ? (
                  <Link key={c.label} href={c.href} className={c.kind === "olive" ? btnOlive : btnGhost}>
                    {c.label}
                  </Link>
                ) : (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => ctaTik(c.action)}
                    className={c.kind === "olive" ? btnOlive : btnGhost}
                  >
                    {c.label}
                  </button>
                )
              )}
            </div>
          )}
          {oranAcik && karar.tip === "split" && (
            <div className="mt-4 space-y-3 rounded-[10px] border border-[#E9E4D6] bg-white p-4">
              <p className="text-sm font-bold text-[#2B2A24]">
                Oranı siz girin — sistem metal payı uydurmaz.
              </p>
              <label className="block text-sm">
                Sistem toplam net ağırlığı (kg)
                <input
                  type="text"
                  inputMode="decimal"
                  value={toplamKg}
                  onChange={(e) => setToplamKg(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border-[1.5px] border-[#E9E4D6] px-3 py-2 font-bold"
                />
              </label>
              <label className="block text-sm">
                Metal profil payı (%)
                <input
                  type="text"
                  inputMode="decimal"
                  value={metalPay}
                  onChange={(e) => setMetalPay(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border-[1.5px] border-[#E9E4D6] px-3 py-2 font-bold"
                  placeholder="Üretim kaydınızdan"
                />
              </label>
              {(() => {
                const kg = Number(String(toplamKg).replace(",", "."));
                const pay = Number(String(metalPay).replace(",", "."));
                const ton = kg > 0 && pay > 0 && pay <= 100 ? (kg * (pay / 100)) / 1000 : 0;
                if (ton <= 0) {
                  return (
                    <p className="text-xs text-[#8C8A7C]">
                      Cam hariç metal net ağırlık = toplam × pay. Değerler girilince hesaplamaya geçilir.
                    </p>
                  );
                }
                return (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-[#4E5F35]">
                      Beyan edilecek metal: {ton.toLocaleString("tr-TR", { maximumFractionDigits: 3 })} ton
                    </p>
                    <Link
                      href={hesaplaUrl({
                        celik: cevap.q2 === "celik",
                        beyan: "metal",
                        tonaj: ton,
                      })}
                      className={btnOlive}
                    >
                      Bu tonajla hesaplamaya geç →
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {cikis && (
        <div className="rounded-xl border border-dashed border-[#E9E4D6] bg-white p-[18px] text-sm text-[#5C5A4E]">
          <b className="mb-1.5 block text-[#2B2A24]">Sorun değil — burada takılıp kalmayın.</b>
          Bu bilgiyi bulmanın üç yolu var. Hangisini seçerseniz seçin, buraya kaldığınız yerden dönebilirsiniz.
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => ctaTik("copy-gumruk")}
              className="mr-2 mt-2.5 rounded-[9px] border-[1.5px] border-[#E9E4D6] bg-white px-3.5 py-2 text-[13.5px] hover:border-[#6B7F4A] hover:text-[#4E5F35]"
            >
              Gümrük müşavirime sorayım
            </button>
            <button
              type="button"
              onClick={() => ctaTik("copy-uretim")}
              className="mr-2 mt-2.5 rounded-[9px] border-[1.5px] border-[#E9E4D6] bg-white px-3.5 py-2 text-[13.5px] hover:border-[#6B7F4A] hover:text-[#4E5F35]"
            >
              Üretimden isteyeyim
            </button>
            <button
              type="button"
              onClick={() => ctaTik("save")}
              className="mt-2.5 rounded-[9px] border-[1.5px] border-[#E9E4D6] bg-white px-3.5 py-2 text-[13.5px] hover:border-[#6B7F4A] hover:text-[#4E5F35]"
            >
              Şimdilik kaydet, sonra döneyim
            </button>
          </div>
        </div>
      )}

      {bildirim && (
        <p className="rounded-xl bg-[#EEF1E3] px-3 py-2 text-sm font-bold text-[#4E5F35]">{bildirim}</p>
      )}

      <p className="text-[13px] text-[#8C8A7C]">
        Bu bir gümrük sınıflandırma kararı değildir; kesin GTİP teyidini gümrük beyannameniz ve
        müşavirinizle yapınız.
      </p>
      <div ref={sonRef} />
    </div>
  );
}
