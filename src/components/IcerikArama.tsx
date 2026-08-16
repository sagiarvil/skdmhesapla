"use client";
import { useState } from "react";

// Ek G §21 — sayfa-içi arama. Kullanım: sayfada aranabilir her blok
// <section data-ara="terim ingilizce karşılığı açıklama metni..."> işaretlenir.
// Bileşen yazarken eşleşmeyen blokları gizler, eşleşeni vurgular.
export default function IcerikArama({ hedefId }: { hedefId: string }) {
  const [sorgu, setSorgu] = useState("");

  function filtrele(q: string) {
    setSorgu(q);
    const kok = document.getElementById(hedefId);
    if (!kok) return;
    const bloklar = kok.querySelectorAll<HTMLElement>("[data-ara]");
    const terim = q.trim().toLocaleLowerCase("tr");
    bloklar.forEach((b) => {
      const eslesti =
        terim.length < 2 ||
        (b.dataset.ara ?? "").toLocaleLowerCase("tr").includes(terim) ||
        b.textContent?.toLocaleLowerCase("tr").includes(terim);
      b.style.display = eslesti ? "" : "none";
    });
  }

  return (
    <div className="sticky top-16 z-10 mb-6 bg-white/95 py-2 backdrop-blur">
      <input
        type="search"
        value={sorgu}
        onChange={(e) => filtrele(e.target.value)}
        placeholder="Bu sayfada ara… (Türkçe veya İngilizce terim)"
        aria-label="Sayfa içinde ara"
        className="w-full max-w-md rounded-ctl border border-brand-tint px-4 py-2.5 text-sm outline-none focus:border-brand-500 bg-white"
      />
    </div>
  );
}
