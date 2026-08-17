import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { CredentialVerificationPanel } from "@/components/credential/CredentialVerificationPanel";
import { primaryCredential, methodology, GROUND_TRUTH_CLAIM, SCOPE_DISCLAIMER } from "@/lib/skdm/credential";
import { PERSON_ENTITY, LEGAL_ENTITY } from "@/lib/skdm/constants";
import { pageMetadata, personJsonLd } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/uzmanlik/baris-bagirlar/",
  title: "Barış Bağırlar | ISO 14064-1 Karbon Hesaplama Yetkinliği | SKDMHesapla",
  description:
    "SKDMHesapla ürün ve karbon hesaplama metodolojisi sorumlusu Barış Bağırlar'ın ISO 14064-1 sera gazı emisyon hesaplama eğitimi, uzmanlık kapsamı ve metodoloji sorumluluğunu inceleyin.",
});

export default function UzmanlikPage() {
  const jsonLd = personJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pasaport-zemin-yogun min-h-screen bg-[#faf8f3] py-10 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-10 px-5 sm:px-6">
          <GeriLink />

          {/* Header */}
          <header className="space-y-4 border-b border-line pb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-800 bg-brand-800/10 px-3 py-1 rounded-full">
                E-E-A-T & Yetkinlik Otoritesi
              </span>
              <span className="text-xs font-bold text-ink-500">
                Sürüm: {methodology.version}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
              Karbon Hesaplama Metodolojisi Sorumluluğu
            </h1>

            <p className="text-base sm:text-lg font-medium leading-relaxed text-ink-700 max-w-3xl">
              {GROUND_TRUTH_CLAIM}
            </p>
          </header>

          {/* Barış Bağırlar Profile Section */}
          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PERSON_ENTITY.imagePath}
                alt={PERSON_ENTITY.name}
                width={120}
                height={120}
                className="h-28 w-28 shrink-0 rounded-2xl border-2 border-brand-800/20 object-cover shadow-sm"
              />

              <div className="space-y-3 min-w-0">
                <div>
                  <h2 className="text-2xl font-black text-ink-900">{PERSON_ENTITY.name}</h2>
                  <p className="text-sm font-bold text-brand-900">{PERSON_ENTITY.jobTitle}</p>
                </div>

                <p className="text-sm font-medium leading-relaxed text-ink-700">
                  Barış Bağırlar, SKDMHesapla yazılım altyapısının karbon hesaplama motorunun
                  kuralları, formülleri, veri doğrulama mantığı ve AB CBAM mevzuat uyumluluğunun
                  ürün sorumlusudur. Hesaplama motoru keyfi bir form toplama aracı olmayıp,
                  küresel sera gazı hesaplama standartlarına ve AB uygulama tüzüklerine dayanan
                  deterministik bir sistemdir.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://www.linkedin.com/in/barisbagirlar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-brand-900 underline underline-offset-4"
                  >
                    LinkedIn Profilini Görüntüle →
                  </a>
                  <a
                    href="https://www.tarimkon.org/danisma-kurulu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-ink-600 underline underline-offset-4"
                  >
                    TARIMKON Danışma Kurulu Kaydı →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Mesleki Yetkinlik */}
          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-2xl font-black text-ink-900">Mesleki Yetkinlik</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Sera gazı emisyonlarının doğru hesaplanması, hem kurumsal envanter standartlarına
              (ISO 14064-1) hem de spesifik ürün bazlı sınırlandırma ilkelerine hâkimiyet gerektirir.
              Barış Bağırlar, Gaziantep Üniversitesi ve Gaziantep Sanayi Odası Mesleki Eğitim
              Merkezi (GSO-MEM) bünyesinde düzenlenen uzmanlık eğitimini tamamlamış, Kapsam 1
              doğrudan emisyonlar, Kapsam 2 dolaylı enerji emisyonları ve Kapsam 3 tedarik zinciri
              hesaplama metodolojileri üzerinde yetkinlik kazanmıştır.
            </p>
          </section>

          {/* ISO 14064-1 Eğitim Belgesi */}
          <section className="space-y-6 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-ink-900">ISO 14064-1 Eğitim Belgesi</h2>
              <p className="text-sm font-medium leading-relaxed text-ink-700">
                Aşağıda ürün ve metodoloji sorumlusunun ISO 14064-1 sera gazı emisyon hesaplama
                eğitim belgesi yer almaktadır. Hassas kişisel bilgiler güvenlik nedeniyle web
                sürümünde maskelenmiştir.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border-2 border-line bg-[#f4efe6] p-2 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={primaryCredential.credential.certificateAsset}
                alt="Barış Bağırlar ISO 14064-1 sera gazı emisyon hesaplama eğitim belgesi"
                loading="lazy"
                width={1200}
                height={850}
                className="w-full h-auto rounded-xl object-contain shadow-xs"
              />
            </div>
          </section>

          {/* Eğitimin Kapsamı */}
          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-2xl font-black text-ink-900">Eğitimin Kapsamı</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Alınan ISO 14064-1 mesleki eğitimi aşağıdaki teknik alan kapsama alanlarını içerir:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm font-semibold text-ink-800">
              {primaryCredential.scope.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-[#f8faf9] p-3 rounded-xl border border-line">
                  <span className="h-2 w-2 rounded-full bg-brand-800 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SKDMHesapla'daki Sorumluluğu */}
          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-2xl font-black text-ink-900">SKDMHesapla&apos;daki Sorumluluğu</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Barış Bağırlar&apos;ın sistem üzerindeki ana teknik sorumlulukları şunlardır:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm font-medium leading-relaxed text-ink-700 pl-2">
              <li>AB CBAM Tüzüğü ve Uygulama Yönetmelikleri ile ISO 14064-1 ilkelerinin metodolojik uyumlaştırılması.</li>
              <li>Hesaplama motorunun emisyon faktörleri, ısı/elektrik verileri ve prekürsör denklem mantıklarının denetlenmesi.</li>
              <li>Veri kalitesi kontrol kurallarının (QC) ve kilit kural denkliğinin (RM-003 G-08, G-27) sürdürülmesi.</li>
              <li>Mevzuat snapshot değişikliklerinin motor versiyonlarına yansıtılması ({methodology.version}).</li>
            </ol>
          </section>

          {/* CBAM ile ISO 14064-1 Arasındaki Sınır */}
          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-2xl font-black text-ink-900">CBAM ile ISO 14064-1 Arasındaki Sınır</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              İki standart arasındaki temel yöntemsel farkı anlamak önemlidir:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
              <div className="rounded-2xl border border-line bg-[#f8faf9] p-5 space-y-2">
                <h3 className="font-extrabold text-ink-900">ISO 14064-1 Standardı</h3>
                <p className="text-ink-700 font-medium leading-relaxed">
                  Kurumsal sera gazı envanteri için uluslararası bir çerçevedir. Şirketin
                  tüm tesis seviyesindeki Kapsam 1, 2 ve 3 emisyonlarını organizasyonel sınırlar
                  içinde hesaplar.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-[#f8faf9] p-5 space-y-2">
                <h3 className="font-extrabold text-ink-900">AB CBAM (SKDM) Rejimi</h3>
                <p className="text-ink-700 font-medium leading-relaxed">
                  Ürün bazlı gömülü emisyon (Embedded Emissions) hesaplayan zorunlu bir AB
                  gümrük mevzuatıdır. Belirli GTİP (CN) kodlu malların üretim süreçlerini ve
                  tesis (installation) sınırlarını baz alır.
                </p>
              </div>
            </div>
            <p className="text-xs font-medium leading-relaxed text-ink-600 pt-1">
              SKDMHesapla, ISO 14064-1 emisyon hesaplama disiplininden faydalanarak CBAM ürün bazlı
              gömülü emisyon metodolojisini kurgular; iki kavramı birbirine eşitlemez.
            </p>
          </section>

          {/* Metodoloji Kaynakları */}
          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-2xl font-black text-ink-900">Metodoloji Kaynakları</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Metodolojimiz doğrudan AB Komisyonu resmi yayınlarına ve ISO standart kılavuzlarına dayanır:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm font-medium text-ink-800 pl-2">
              <li>EU Regulation 2023/956 (CBAM Regulation)</li>
              <li>EU Implementing Regulation 2023/1773 (Geçiş Dönemi Raporlama Yönetmeliği)</li>
              <li>EU Guidance Document on CBAM Implementation for Goods Importers & Operators</li>
              <li>ISO 14064-1:2018 Greenhouse Gases — Part 1</li>
            </ul>
            <p className="pt-2">
              <Link
                href="/metodoloji/"
                className="inline-flex items-center text-xs font-bold text-brand-900 underline underline-offset-4"
              >
                SKDMHesapla Detaylı Metodoloji Dokümanını İnceleyin →
              </Link>
            </p>
          </section>

          {/* Bağımsız Doğrulama Hakkında */}
          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-2xl font-black text-ink-900">Bağımsız Doğrulama Hakkında</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              {SCOPE_DISCLAIMER}
            </p>
            <p className="text-xs font-medium text-ink-600">
              SKDMHesapla ihracatçı firmanıza verilerin toplanması, AB şablon denkliğinin sağlanması,
              hesaplama izlenebilirliğinin oluşturulması ve mühürlü 11 parçalı denetime hazırlık
              dosyasının üretilmesini sağlar.
            </p>
          </section>

          {/* Credential Verification Panel Component */}
          <CredentialVerificationPanel />

          <footer className="text-center pt-4 text-xs font-medium text-ink-500 space-y-1">
            <p>{LEGAL_ENTITY.copyrightFull}</p>
            <p>Teknik Sorumluluk Revizyon Tarihi: {methodology.reviewDate}</p>
          </footer>
        </div>
      </article>
    </>
  );
}
