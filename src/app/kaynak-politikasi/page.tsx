import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/kaynak-politikasi/",
  title: "Kaynak politikası",
  description: "90 gün insan incelemesi",
});

export default function KaynakPolitikasiPage() {
  return (
    <>
      <RegistryJsonLd route="/kaynak-politikasi/" />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink />
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-800">Tazelik SLA</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Kaynak ve tazelik politikası
            </h1>
            <p className="text-base font-medium leading-relaxed text-ink-700">
              Aktif resmi kaynakların son insan incelemesi 90 günden eskiyse dağıtım bloklanır.
              Superseded kaynak indexable sayfada kullanılamaz. SEO, RM-001…004 ve hesap motorunun
              üstüne yazamaz.
            </p>
          </header>
          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 text-sm font-medium text-ink-700">
            <h2 className="text-lg font-black text-ink-900">Hiyerarşi</h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>RM-004 alan haritası</li>
              <li>RM-003 hesaplama motoru</li>
              <li>RM-002 UX</li>
              <li>RM-001 veri modeli</li>
              <li>AGENTS1</li>
              <li>SEO V7 registry</li>
            </ol>
          </section>
          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 text-sm font-medium text-ink-700">
            <h2 className="text-lg font-black text-ink-900">Çelişki</h2>
            <p>
              Public sayı/kural ile motor uyuşmazsa tahminle düzeltme yok: conflict kaydı, kaynak
              incelemesi, RM hiyerarşisi, sonra public içerik ve motor birlikte güncellenir.
            </p>
          </section>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/mevzuat/" className="text-brand-800 underline underline-offset-2">
              Mevzuat
            </Link>
            <Link href="/metodoloji/" className="text-brand-800 underline underline-offset-2">
              Metodoloji
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
