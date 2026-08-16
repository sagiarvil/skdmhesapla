"use client";
import { useState } from "react";
import Link from "next/link";
import { gtipAra, type GtipOneri } from "@/data/gtip-kodlari";

// Ek G §20 — "GTİP kodumu bilmiyorum" akışı. /basla/ üstüne ve sihirbaz
// Adım 0'a konur. Stil: mevcut token'lar (brand-500/900, rounded-ctl).
export default function GtipArama() {
  const [sorgu, setSorgu] = useState("");
  const sonuclar = gtipAra(sorgu);

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="gtip-arama" className="mb-2 block text-sm font-semibold text-brand-900">
        GTİP kodunuzu bilmiyor musunuz? Ürününüzü yazın:
      </label>
      <input
        id="gtip-arama"
        type="text"
        value={sorgu}
        onChange={(e) => setSorgu(e.target.value)}
        placeholder="ör. inşaat demiri, külçe alüminyum, üre…"
        className="w-full rounded-ctl border border-brand-tint px-4 py-3 text-sm outline-none focus:border-brand-500 bg-white"
      />
      {sonuclar.length > 0 && (
        <ul className="mt-2 divide-y divide-brand-tint/50 rounded-ctl border border-brand-tint bg-white shadow-card">
          {sonuclar.map((g: GtipOneri) => (
            <li key={g.urunAdi}>
              <Link
                href={`/hesapla/${g.sektorSlug}/`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-brand-mist/30"
              >
                <span className="text-sm font-medium text-brand-900">{g.urunAdi}</span>
                <span className="font-mono text-xs text-brand-900/70">
                  {g.cnKodu !== "—" ? `CN: ${g.cnKodu}` : "Kademe B"}
                  {g.kademe === "A" ? " · Kademe A" : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-xs text-brand-900/60">
        Önerilen kod bilgilendirme amaçlıdır; nihai kod teyidini alıcınızla yapın.
      </p>
    </div>
  );
}
