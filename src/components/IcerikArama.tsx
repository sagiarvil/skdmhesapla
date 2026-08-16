"use client";
import { useState } from "react";
import { MagnifyingGlass, XCircle } from "@phosphor-icons/react";

// Ek G §21 — Sayfa içi DEV Arama Konsolu
// Rehber ve Sözlük sayfalarında tüm terim ve bölümlerde anlık filtreleme sağlar.
export default function IcerikArama({ hedefId }: { hedefId: string }) {
  const [sorgu, setSorgu] = useState("");
  const [sonucSayisi, setSonucSayisi] = useState<number | null>(null);

  function filtrele(q: string) {
    setSorgu(q);
    const kok = document.getElementById(hedefId);
    if (!kok) return;
    const bloklar = kok.querySelectorAll<HTMLElement>("[data-ara]");
    const terim = q.trim().toLocaleLowerCase("tr");

    let count = 0;
    bloklar.forEach((b) => {
      const eslesti =
        terim.length < 2 ||
        (b.dataset.ara ?? "").toLocaleLowerCase("tr").includes(terim) ||
        b.textContent?.toLocaleLowerCase("tr").includes(terim);
      b.style.display = eslesti ? "" : "none";
      if (eslesti) count++;
    });

    setSonucSayisi(terim.length >= 2 ? count : null);
  }

  function temizle() {
    filtrele("");
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <div className="relative flex items-center rounded-3xl border-3 border-brand-800/35 bg-white p-2 shadow-2xl transition-all focus-within:border-brand-900 focus-within:ring-4 focus-within:ring-brand-500/20 hover:border-brand-800/60">
        <div className="pl-4 pr-2 text-brand-800">
          <MagnifyingGlass className="h-7 w-7" weight="bold" />
        </div>

        <input
          type="search"
          value={sorgu}
          onChange={(e) => filtrele(e.target.value)}
          placeholder="Rehber ve sözlükte ara… (Örn: CN kodu, emisyon, Kapsam 2, de minimis)"
          aria-label="Sayfa içinde ara"
          className="w-full appearance-none bg-transparent py-4 px-2 text-lg sm:text-xl font-bold text-ink-900 placeholder:text-ink-500/70 placeholder:font-normal focus:outline-none"
          style={{ outline: "none", boxShadow: "none", border: "none" }}
        />

        {sorgu && (
          <button
            type="button"
            onClick={temizle}
            className="p-2 text-ink-500 hover:text-ink-900 transition mr-2"
            aria-label="Aramayı temizle"
          >
            <XCircle className="h-6 w-6" weight="fill" />
          </button>
        )}
      </div>

      {sonucSayisi !== null && (
        <div className="mt-3 text-center text-sm font-bold text-brand-900">
          {sonucSayisi > 0 ? (
            <span>🔍 &ldquo;{sorgu}&rdquo; için <strong>{sonucSayisi}</strong> ilgili başlık bulundu.</span>
          ) : (
            <span className="text-clay">⚠️ Eşleşen başlık bulunamadı. Lütfen farklı bir terim deneyin.</span>
          )}
        </div>
      )}
    </div>
  );
}
