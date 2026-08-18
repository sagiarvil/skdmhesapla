"use client";

import { useCallback, useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * Küçük kopyala butonu — paket numarası / SHA-256 gibi tek satırlık kodları
 * panoya kopyalar. Kopyalanınca 1,6 sn boyunca ✓ gösterir.
 */
export function KopyalaButonu({ deger, label }: { deger: string; label?: string }) {
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = useCallback(async () => {
    if (!deger) return;
    try {
      await navigator.clipboard.writeText(deger);
      setKopyalandi(true);
      window.setTimeout(() => setKopyalandi(false), 1600);
    } catch {
      // panoya erişim reddedilirse kullanıcı metni elle seçebilir
    }
  }, [deger]);

  return (
    <button
      type="button"
      onClick={() => void kopyala()}
      aria-label={label ? `${label} kopyala` : "Kopyala"}
      title={label ? `${label} kopyala` : "Kopyala"}
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand-800/20 bg-white/70 text-brand-800 transition hover:border-brand-800/50 hover:bg-brand-100"
    >
      {kopyalandi ? <Check className="h-3 w-3 text-emerald-700" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}
