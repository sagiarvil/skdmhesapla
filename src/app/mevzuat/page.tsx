import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { LegalFact } from "@/components/seo/LegalFact";
import { pageMetadata } from "@/lib/skdm/seo";
import { PUBLIC_LEGAL_SOURCES } from "@/lib/seo/legal-sources";

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
          <GeriLink />
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
          <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/80 p-6 text-sm text-ink-900 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
                Yasama Radarı (Pending Legislation)
              </span>
              <span className="text-xs font-semibold text-amber-800">10 Eylül 2026 · EPRS Brifingi</span>
            </div>
            <h2 className="mt-3 text-base font-black text-ink-900 sm:text-lg">
              Avrupa Parlamentosu ENVI Komitesi 457 Downstream Ürün Kapsam Genişlemesi
            </h2>
            <p className="mt-2 font-medium leading-relaxed text-ink-800">
              Avrupa Parlamentosu Araştırma Servisi (EPRS), Komisyonun 180 ürünlük teklifine karşılık ENVI Komitesi&apos;nin kapsamı <strong>457 downstream ürüne</strong> çıkarma pozisyonunu benimsediğini duyurdu. Bu sinyal henüz yürürlükte kesinleşmiş mevzuat değildir.
            </p>
            <div className="mt-4 rounded-2xl bg-white/90 p-4 text-xs font-semibold text-ink-800 space-y-2 border border-amber-200">
              <p className="font-bold text-ink-900 uppercase tracking-wider text-[11px]">Yasama Süreci Boru Hattı:</p>
              <p className="font-mono text-[11px] text-brand-900 bg-brand-50 p-2 rounded-lg break-all">
                COM proposal (180) → ENVI position (457) → Parliament vote → trilogue → final OJ regulation → production CN update
              </p>
              <p className="text-ink-700">
                <strong>Demir Kural:</strong> Kesin mevzuat EUR-Lex / AB Resmî Gazetesi&apos;nde (Official Journal) yayımlanmadan skdmhesapla.com üzerindeki <strong>569 doğrulanmış resmi CN kapsam motoru</strong> değiştirilmez.
              </p>
              <p className="text-ink-700">
                <strong>Benchmark &amp; Değer İzleme:</strong> Komisyon incelemesi doğrultusunda; CBAM benchmark&apos;larının <strong>2026 içinde</strong> yeni ETS benchmark&apos;larına uyarlanması ve varsayılan değerler revizyonunun <strong>2027 veya 2028 başında</strong> yapılması yüksek öncelikle takip edilmektedir.
              </p>
            </div>
          </div>
          <ul className="space-y-4 text-sm font-medium text-ink-700">
            {PUBLIC_LEGAL_SOURCES.map((source) => (
              <li key={source.id} className="rounded-3xl border-2 border-line bg-white p-6">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-black text-ink-900">{source.title}</h2>
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800">
                    {source.applicability === "DEFINITIVE_PERIOD"
                      ? "Kesin Dönem"
                      : source.applicability === "TRANSITIONAL_PERIOD"
                      ? "Geçiş Dönemi"
                      : "Genel / Referans"}
                  </span>
                </div>
                <p className="mt-2 text-ink-700">{source.scope}</p>
                <a
                  className="mt-3 inline-block font-bold text-brand-800 underline"
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resmî Kaynak Bağlantısı
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <a href="/kaynak-politikasi/" className="text-brand-800 underline underline-offset-2">
              Kaynak politikası
            </a>
            <a href="/metodoloji/" className="text-brand-800 underline underline-offset-2">
              Metodoloji
            </a>
            <a href="/rehber/" className="text-brand-800 underline underline-offset-2">
              Rehber
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
