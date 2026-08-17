"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Static export uyumlu kanonik taşıma; Firebase 301 üretimde birincildir. */
export function YonlendirKarbonRaporu() {
  useEffect(() => {
    window.location.replace("/karbon-raporu/");
  }, []);
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-5 py-16">
      <p className="text-base font-medium text-ink-800">
        Tedarikçi karbon dosyası akışı ürün karbon raporu sayfasına taşındı.
      </p>
      <Link href="/karbon-raporu/" className="font-bold text-brand-800 underline underline-offset-2">
        Karbon raporunu hazırla
      </Link>
    </div>
  );
}
