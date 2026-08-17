import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import IcerikArama from "@/components/IcerikArama";
import {
  SOZLUK_KATEGORILERI,
  SOZLUK_TERIMLERI_FINAL,
} from "@/lib/skdm/content/sozluk";
import { indexableEntries } from "@/lib/seo/registry";

export const metadata: Metadata = pageMetadata({
  path: "/sozluk/",
  title: "SKDM Sözlüğü 2026 — CBAM Terimleri, İngilizce-Türkçe Karşılıkları ve Anlamları",
  description: "CBAM/SKDM mevzuatında geçen tüm terimlerin net tanımları: embedded emissions, default values, mark-up, bubble approach, precursor, declarant, sertifika fiyatı ve kontrol denkliği.",
});

const KART =
  "scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all";

export default function SozlukPage() {
  const terimler = SOZLUK_TERIMLERI_FINAL;
  const leafIds = new Set(
    indexableEntries()
      .map((e) => e.route)
      .filter((r) => r.startsWith("/sozluk/") && r !== "/sozluk/")
      .map((r) => r.replace("/sozluk/", "").replace(/\/$/, "")),
  );

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#dcebf2] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Resmi Terimler &amp; Referans Kütüphanesi
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-[40px] md:text-[44px]">
            SKDM Sözlüğü
          </h1>
          <p className="text-base font-normal leading-relaxed text-ink-700 sm:text-[18px]">
            {terimler.length} terim: her birinin sabit tanımı, resmi mevzuat karşılığı ve nerede
            kullanıldığı. Süreç ve karar soruları için{" "}
            <Link href="/rehber/" className="font-bold text-brand-800 underline">
              SKDM Rehberi
            </Link>
            &apos;ne bakın.
          </p>
        </div>

        <IcerikArama
          hedefId="sozluk-govde"
          placeholder="Sözlükte ara… (ör. mark-up, bubble approach, de minimis)"
        />

        {/* DİZİN — kategori kısayolları */}
        <nav
          aria-label="Sözlük dizini"
          className="rounded-3xl border-2 border-line bg-white p-5 shadow-sm"
        >
          <b className="text-sm font-black text-ink-900">Dizin — konuya atlayın:</b>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SOZLUK_KATEGORILERI.map((k) => (
              <li key={k.id}>
                <a
                  href={`#kat-${k.id}`}
                  className="inline-block rounded-full border border-brand-800/25 bg-brand-100/60 px-3.5 py-1.5 text-xs font-bold text-brand-900 transition hover:bg-brand-500/30"
                >
                  {k.ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div id="sozluk-govde" className="space-y-12">
          {SOZLUK_KATEGORILERI.map((kat) => {
            const liste = terimler.filter((t) => t.kategori === kat.id);
            if (liste.length === 0) return null;
            return (
              <section key={kat.id} data-ara-grup id={`grup-${kat.id}`}>
                <div className="border-b-2 border-line pb-3" id={`kat-${kat.id}`}>
                  <h2 className="scroll-mt-24 text-xl font-bold text-ink-900 sm:text-[24px]">
                    {kat.ad}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-ink-600">
                    {liste.length} terim
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {liste.map((t) => (
                    <section
                      key={t.id}
                      id={t.id}
                      data-ara={`${t.id} ${t.en} ${t.tr} ${t.tanim} ${t.nerede} ${kat.ad}`}
                      className={KART}
                    >
                      <dt className="text-xl font-black text-ink-900">
                        {t.en ? `${t.en} → ${t.tr}` : t.tr}
                      </dt>
                      <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                        {leafIds.has(t.id) ? (
                          <>
                            {t.tanim.slice(0, 160)}
                            {t.tanim.length > 160 ? "…" : ""}
                            <Link
                              href={`/sozluk/${t.id}/`}
                              className="mt-2 block font-bold text-brand-800 underline underline-offset-2"
                            >
                              Tam tanım ve sınırlar
                            </Link>
                          </>
                        ) : (
                          <>
                            {t.tanim}
                            <span className="mt-2 block text-xs font-bold text-brand-800 bg-brand-100/60 p-2.5 rounded-xl border border-brand-500/20">
                              Kullanım Yeri: {t.nerede}
                            </span>
                          </>
                        )}
                      </dd>
                    </section>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
          <b className="text-base font-black text-ink-900">Aradığınız terim yok mu?</b>
          <p className="mt-2 text-sm font-medium text-ink-700 leading-relaxed">
            Alıcınızın yazısında geçen ve burada bulamadığınız her terimi{" "}
            <Link href="/iletisim/" className="font-bold text-brand-800 underline">
              iletin
            </Link>
            ; tanımı 48 saat içinde sözlüğe eklenir.
          </p>
        </div>
      </div>
    </article>
  );
}
