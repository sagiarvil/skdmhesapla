"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";

const MALZEME_YOL: Record<string, { href: string; label: string }> = {
  glass: { href: "/hesapla/cam/", label: "Cam tedarikçi dosyası" },
  aluminium: { href: "/hesapla/yapi/", label: "Yapı / metal tedarikçi dosyası" },
  steel: { href: "/hesapla/yapi/", label: "Çelik tedarikçi dosyası" },
  pvc: { href: "/hesapla/plastik/", label: "Plastik tedarikçi dosyası" },
  wood: { href: "/hesapla/mobilya/", label: "Ahşap tedarikçi dosyası" },
};

export function HazirlaIcerik() {
  const searchParams = useSearchParams();
  const malzeme = searchParams.get("malzeme");
  const ids = (malzeme ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const yollar = [
    ...new Map(
      ids
        .map((id) => MALZEME_YOL[id])
        .filter(Boolean)
        .map((y) => [y.href, y]),
    ).values(),
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
      <GeriLink />
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-800">Kademe B</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Tedarikçi karbon dosyası
        </h1>
        <p className="text-base font-medium leading-relaxed text-ink-700">
          Bu çıktı SKDM raporu değildir. Alıcınızın Kapsam 3 / CSRD talebi için ISO 14067
          mantığında veri dosyası üretir. SKDM hesap motoruna hüküm olarak bağlanmaz.
        </p>
      </header>
      <ul className="space-y-3 text-sm font-bold">
        {yollar.length > 0 ? (
          yollar.map((y) => (
            <li key={y.href}>
              <Link
                href={y.href}
                className="inline-flex rounded-2xl border-2 border-brand-800/20 bg-white px-4 py-3 text-brand-900 hover:bg-brand-100/60"
              >
                {y.label}
              </Link>
            </li>
          ))
        ) : (
          <li>
            <Link
              href="/tedarikci-verisi/"
              className="inline-flex rounded-2xl border-2 border-brand-800/20 bg-white px-4 py-3 text-brand-900 hover:bg-brand-100/60"
            >
              Tedarikçi veri merkezini aç
            </Link>
          </li>
        )}
      </ul>
      <Link href="/basla/" className="text-sm font-bold text-brand-800 underline underline-offset-2">
        GTİP ile kapsam kontrolüne dön
      </Link>
    </div>
  );
}
