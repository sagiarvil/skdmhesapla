import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { LEGAL_ENTITY, PERSON_ENTITY, PLATFORM_STATS } from "@/lib/skdm/constants";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/about/",
  title: "Hakkımızda — skdmhesapla.com Kurumsal Kimlik & E-E-A-T",
  description:
    "skdmhesapla.com kurumsal çözüm, ürün ve yetkinlik merkezi. AB SKDM (CBAM) ve Denizcilik MRV/ETS/FuelEU için deterministik mevzuat ve denetime hazırlık altyapısı.",
});

export default function AboutPage() {
  return (
    <>
      <RegistryJsonLd route="/about/" />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink />

          <header className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
              Kurumsal Kimlik ve E-E-A-T Otoritesi
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-[40px]">
              Hakkımızda
            </h1>
            <p className="text-base font-medium leading-relaxed text-ink-700 sm:text-lg">
              {LEGAL_ENTITY.brandName} (skdmhesapla.com), Türk ihracatçıları ve denizcilik şirketleri için AB SKDM (CBAM) ve ETS denetime hazırlık dosyası üreten deterministik, self-servis bir yazılım platformudur.
            </p>
          </header>

          <section
            id="baris-bagirlar"
            className="scroll-mt-24 space-y-5 rounded-3xl border-2 border-line bg-white p-6 shadow-sm"
            itemScope
            itemType="https://schema.org/Person"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="text-xl font-black text-ink-900">Metodoloji Sorumlusu</h2>
              <span className="text-xs font-bold text-brand-800 bg-brand-800/10 px-2.5 py-1 rounded-full">
                Uzmanlık ve Metodoloji Sorumluluğu
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PERSON_ENTITY.imagePath}
                alt={PERSON_ENTITY.name}
                width={96}
                height={96}
                itemProp="image"
                className="h-24 w-24 shrink-0 rounded-full border-2 border-brand-800/20 object-cover shadow-sm"
              />
              <div className="space-y-3 min-w-0 flex-1">
                <div>
                  <p className="text-xl font-black text-ink-900" itemProp="name">
                    {PERSON_ENTITY.name}
                  </p>
                  <p className="text-sm font-bold text-brand-900" itemProp="jobTitle">
                    {PERSON_ENTITY.jobTitle}
                  </p>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-[#f8faf9] p-3.5 text-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/credentials/iso-14064-1-baris-bagirlar.webp"
                    alt="Barış Bağırlar TS EN ISO 14064-1 Sera Gazı Eğitimi Katılım Sertifikası - Gaziantep Sanayi Odası"
                    width={56}
                    height={80}
                    className="h-20 w-14 shrink-0 rounded-lg border border-line object-cover shadow-2xs"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      Resmi Katılım Sertifikası
                    </span>
                    <div className="font-extrabold text-ink-900 text-xs sm:text-sm">TS EN ISO 14064-1</div>
                    <div className="font-bold text-brand-900 text-xs truncate">Sera Gazı Salınım ve Raporlama Eğitimi</div>
                    <div className="text-ink-600 font-medium text-[11px]">Gaziantep Sanayi Odası (GSO-MEM) • 21-23 Kasım 2024</div>
                  </div>
                </div>

                <ul className="space-y-2 text-sm font-medium leading-relaxed text-ink-700">
                  <li>
                    SKDMHesapla&apos;nın karbon hesaplama metodolojisi, ISO 14064-1 kapsamında
                    sera gazı emisyon hesaplama eğitimi sahibi ürün sorumlusunun metodolojik gözetiminde geliştirilmektedir.
                  </li>
                  <li>
                    <a
                      href="https://www.tarimkon.org/danisma-kurulu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-brand-800 underline underline-offset-2"
                      itemProp="affiliation"
                    >
                      TARIMKON — Uluslararası Tarım ve Gıda Konfederasyonu Danışma Kurulu
                    </a>{" "}
                    üyesi (Genel Başkan Danışmanı).
                  </li>
                </ul>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Link
                    href="/uzmanlik/baris-bagirlar/"
                    className="inline-flex items-center text-sm font-black text-brand-900 hover:text-brand-700 underline underline-offset-4"
                  >
                    Yetkinlik ve Metodoloji Sorumluluğunu İncele →
                  </Link>
                  <a
                    href="https://www.linkedin.com/in/barisbagirlar/"
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex text-xs font-bold text-ink-600 underline underline-offset-2"
                    itemProp="sameAs"
                  >
                    LinkedIn Profili
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs font-medium leading-relaxed text-ink-600 border-t border-line pt-3">
              Not: Bu bölüm kişi ve kurum bağlantılarını şeffaflık için listeler.{" "}
              {LEGAL_ENTITY.disclaimer}
            </p>
          </section>

          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-ink-900">İşletmeci Bilgileri</h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-bold text-ink-500">Ticari Unvan</dt>
                <dd className="font-semibold text-ink-900">{LEGAL_ENTITY.companyName}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink-500">Yasal Kimlik</dt>
                <dd className="font-semibold text-ink-900">{LEGAL_ENTITY.publicLegalIdentityNote}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink-500">İşletmeci Merkezi</dt>
                <dd className="font-semibold text-ink-900">{LEGAL_ENTITY.operatorLocation}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink-500">Destek E-posta</dt>
                <dd>
                  <a
                    className="font-semibold text-brand-800 underline"
                    href={`mailto:${LEGAL_ENTITY.supportEmail}`}
                  >
                    {LEGAL_ENTITY.supportEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink-500">Sunucu Konumu</dt>
                <dd className="font-semibold text-ink-900">{LEGAL_ENTITY.serverLocation}</dd>
              </div>
            </dl>
          </section>

          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-ink-900">Hizmet Kapsamı ve Sınırları</h2>
            <p className="text-base font-medium leading-relaxed text-ink-700">
              {LEGAL_ENTITY.disclaimer}
            </p>
            <ul className="list-disc space-y-2 pl-5 text-base font-medium text-ink-700">
              <li>{PLATFORM_STATS.sectorCount} CBAM sektörü için yapılandırılmış veri girişi ve pre-calc motoru</li>
              <li>{PLATFORM_STATS.stepCount} adımlı sihirbaz ve deterministik kalite kontrolleri</li>
              <li>{PLATFORM_STATS.fileCount} parçalı kriptografik mühürlü denetime hazırlık paketi</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-ink-900">İletişim ve Yasal Rotalar</h2>
            <p className="text-base font-medium text-ink-700">
              Destek ve sorularınız için{" "}
              <Link href="/iletisim/" className="font-bold text-brand-800 underline">
                İletişim
              </Link>{" "}
              sayfasını kullanın. Kişisel veriler ve gizlilik politikası için{" "}
              <Link href="/privacy/" className="font-bold text-brand-800 underline">
                Gizlilik Politikası (Privacy Policy)
              </Link>{" "}
              ve{" "}
              <Link href="/kvkk-aydinlatma/" className="font-bold text-brand-800 underline">
                KVKK Aydınlatma
              </Link>{" "}
              sayfalarını inceleyebilirsiniz.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
