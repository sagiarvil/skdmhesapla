import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { LegalFact } from "@/components/seo/LegalFact";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/mevzuat/",
  title: "Mevzuat",
  description: "SKDM resmi kaynak haritası",
});

export default function MevzuatPage() {
  return (
    <>
      <RegistryJsonLd route="/mevzuat/" />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink href="/" />
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-800">Resmi kaynak haritası</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              SKDM mevzuat kaynakları
            </h1>
            <p className="text-base font-medium leading-relaxed text-ink-700">
              SEO katmanı ayrı bir CBAM doğrusu üretmez. Public sayılar motor ve mandate ile aynı
              kaynaktan gelir: <LegalFact id="sectorFamilyCount" /> sektör ailesi,{" "}
              <LegalFact id="cnUniverseCount" /> CN kodu.
            </p>
          </header>
          <ul className="space-y-4 text-sm font-medium text-ink-700">
            <li className="rounded-3xl border-2 border-line bg-white p-6">
              <h2 className="text-lg font-black text-ink-900">(AB) 2023/956</h2>
              <p>CBAM ana tüzük. Annex I mallar, Annex II yalnız-direkt sektörler.</p>
              <a className="font-bold text-brand-800 underline" href="https://eur-lex.europa.eu/eli/reg/2023/956/oj">
                EUR-Lex
              </a>
            </li>
            <li className="rounded-3xl border-2 border-line bg-white p-6">
              <h2 className="text-lg font-black text-ink-900">(AB) 2025/2083 Omnibus</h2>
              <p>
                De minimis <LegalFact id="deMinimisTons" /> ton (ithalatçı, elektrik/hidrojen hariç).
              </p>
              <a className="font-bold text-brand-800 underline" href="https://eur-lex.europa.eu/eli/reg/2025/2083/oj">
                EUR-Lex
              </a>
            </li>
            <li className="rounded-3xl border-2 border-line bg-white p-6">
              <h2 className="text-lg font-black text-ink-900">Komisyon CBAM portalı</h2>
              <p>Resmi şablonlar ve kayıt sistemi.</p>
              <a
                className="font-bold text-brand-800 underline"
                href="https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en"
              >
                taxation-customs.ec.europa.eu
              </a>
            </li>
          </ul>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/kaynak-politikasi/" className="text-brand-800 underline underline-offset-2">
              Kaynak politikası
            </Link>
            <Link href="/metodoloji/" className="text-brand-800 underline underline-offset-2">
              Metodoloji
            </Link>
            <Link href="/rehber/" className="text-brand-800 underline underline-offset-2">
              Rehber
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
