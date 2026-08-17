"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { MagnifyingGlass, XCircle } from "@phosphor-icons/react";
import {
  clearDomHighlights,
  highlightDomMatches,
  HighlightText,
} from "@/lib/skdm/search-highlight";

/**
 * Sayfa içi arama — yalnızca yaprak [data-ara] kartlarını süzgeçler.
 * Eşleşen öbek sonuç metninde kırmızı mark ile vurgulanır.
 */
export default function IcerikArama({
  hedefId,
  placeholder = "Sayfada ara… (ör. mark-up, de minimis, CN kodu)",
}: {
  hedefId: string;
  placeholder?: string;
}) {
  const [sorgu, setSorgu] = useState("");
  const [sonucSayisi, setSonucSayisi] = useState<number | null>(null);
  const inputId = useId();

  const uygula = useCallback(
    (q: string) => {
      const kok = document.getElementById(hedefId);
      if (!kok) {
        setSonucSayisi(null);
        return;
      }

      clearDomHighlights(kok);

      const terim = q.trim().toLocaleLowerCase("tr");
      const aktif = terim.length >= 1;

      const tumAra = Array.from(kok.querySelectorAll<HTMLElement>("[data-ara]"));
      const kartlar = tumAra.filter((el) => !el.querySelector("[data-ara]"));

      let count = 0;
      for (const kart of kartlar) {
        if (!aktif) {
          kart.hidden = false;
          kart.style.removeProperty("display");
          continue;
        }
        const kaynak = `${kart.getAttribute("data-ara") ?? ""} ${kart.textContent ?? ""}`;
        const eslesti = kaynak.toLocaleLowerCase("tr").includes(terim);
        kart.hidden = !eslesti;
        if (eslesti) {
          count += 1;
          highlightDomMatches(kart, q.trim());
        }
      }

      const gruplar = kok.querySelectorAll<HTMLElement>("[data-ara-grup]");
      gruplar.forEach((grup) => {
        if (!aktif) {
          grup.hidden = false;
          return;
        }
        const altKartlar = Array.from(grup.querySelectorAll<HTMLElement>("[data-ara]")).filter(
          (el) => !el.querySelector("[data-ara]")
        );
        grup.hidden = !altKartlar.some((k) => !k.hidden);
      });

      setSonucSayisi(aktif ? count : null);
    },
    [hedefId]
  );

  useEffect(() => {
    uygula(sorgu);
  }, [sorgu, uygula]);

  function temizle() {
    setSorgu("");
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <label htmlFor={inputId} className="sr-only">
        Sayfa içinde ara
      </label>
      <div className="relative flex items-center rounded-3xl border-3 border-brand-800/35 bg-white p-2 shadow-2xl transition-all focus-within:border-brand-900 focus-within:ring-4 focus-within:ring-brand-500/20 hover:border-brand-800/60">
        <div className="pl-4 pr-2 text-brand-800" aria-hidden>
          <MagnifyingGlass className="h-7 w-7" weight="bold" />
        </div>

        <input
          id={inputId}
          type="search"
          value={sorgu}
          onChange={(e) => setSorgu(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="w-full appearance-none bg-transparent py-4 px-2 text-lg sm:text-xl font-bold text-ink-900 placeholder:text-ink-500/70 placeholder:font-normal focus:outline-none"
          style={{ outline: "none", boxShadow: "none", border: "none" }}
        />

        {sorgu ? (
          <button
            type="button"
            onClick={temizle}
            className="p-2 text-ink-500 hover:text-ink-900 transition mr-2"
            aria-label="Aramayı temizle"
          >
            <XCircle className="h-6 w-6" weight="fill" />
          </button>
        ) : null}
      </div>

      {sonucSayisi !== null ? (
        <p className="mt-3 text-center text-sm font-bold text-brand-900" aria-live="polite">
          {sonucSayisi > 0 ? (
            <span>
              “<HighlightText text={sorgu.trim()} query={sorgu.trim()} />” için{" "}
              <strong>{sonucSayisi}</strong> sonuç
            </span>
          ) : (
            <span className="text-ink-700">
              Eşleşen başlık yok — farklı bir terim deneyin veya dizinden seçin.
            </span>
          )}
        </p>
      ) : null}
    </div>
  );
}
