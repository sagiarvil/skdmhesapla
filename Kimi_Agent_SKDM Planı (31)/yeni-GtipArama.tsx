"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { gtipAra, type GtipOneri } from "@/data/gtip-kodlari";

export default function GtipArama() {
  const [sorgu, setSorgu] = useState("");
  const sonuclar = gtipAra(sorgu);

  return (
    <div className="w-full">
      <label
        htmlFor="gtip-arama"
        className="mb-3 block text-base font-extrabold text-ink-900 sm:text-lg"
      >
        GTİP kodunuzu veya ürününüzü yazın:
      </label>

      <div className="relative flex items-center rounded-2xl border-2 border-brand-800/30 bg-white p-2 shadow-2xl transition-all focus-within:border-brand-800 focus-within:ring-4 focus-within:ring-brand-500/25">
        <div className="pointer-events-none flex items-center pl-3 pr-2 text-brand-800">
          <Search className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <input
          id="gtip-arama"
          type="text"
          value={sorgu}
          onChange={(e) => setSorgu(e.target.value)}
          placeholder="Örnek: İnşaat demiri, çelik profil, külçe alüminyum, üre gübre…"
          className="w-full appearance-none border-0 bg-transparent px-3 py-2 text-lg font-bold text-ink-900 shadow-none outline-none ring-0 placeholder:font-normal placeholder:text-ink-600/70 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:text-xl"
          style={{ outline: "none", boxShadow: "none", border: "none" }}
        />

        {sorgu && (
          <button
            type="button"
            onClick={() => setSorgu("")}
            className="mr-2 rounded-full p-1.5 text-xs font-bold text-ink-600 hover:bg-slate-100"
          >
            ✕
          </button>
        )}
      </div>

      {sonuclar.length > 0 && (
        <ul className="mt-3 divide-y divide-line rounded-2xl border-2 border-brand-800/25 bg-white p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {sonuclar.map((g: GtipOneri) => (
            <li key={g.urunAdi}>
              <Link
                href={`/hesapla/${g.sektorSlug}/`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl p-3.5 transition hover:bg-brand-500/15"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-black text-brand-900 shadow-sm group-hover:scale-105 transition-transform">
                    ✓
                  </span>
                  <div>
                    <span className="text-lg font-extrabold text-ink-900 group-hover:text-brand-900">
                      {g.urunAdi}
                    </span>
                    <div className="text-xs font-medium text-ink-600">
                      Hedef Sektör: <strong className="text-brand-900">{g.sektorSlug}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pl-11 sm:pl-0">
                  <span className="rounded-lg bg-brand-100 px-3 py-1.5 font-mono text-sm font-black text-brand-900 border border-brand-500/30">
                    {g.cnKodu !== "—" ? `CN: ${g.cnKodu}` : "Kademe B"}
                  </span>
                  {g.kademe === "A" && (
                    <span className="rounded-lg bg-accent-yellow/20 px-2.5 py-1 text-xs font-black text-ink-900 border border-accent-yellow/40">
                      Kademe A (Zorunlu)
                    </span>
                  )}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-900 group-hover:bg-brand-800 group-hover:text-white transition">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2.5 text-xs font-semibold text-ink-600 leading-relaxed sm:text-sm">
        Önerilen kod bilgilendirme amaçlıdır; kesin GTİP teyidini gümrük beyannameniz veya alıcınızla yapınız.
      </p>
    </div>
  );
}
