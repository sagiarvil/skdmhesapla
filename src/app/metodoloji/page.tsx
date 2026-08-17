import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { methodology, primaryCredential, GROUND_TRUTH_CLAIM, SCOPE_DISCLAIMER } from "@/lib/skdm/credential";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";
import { pageMetadata, techArticleJsonLd } from "@/lib/skdm/seo";
import { LegalFact } from "@/components/seo/LegalFact";

export const metadata: Metadata = pageMetadata({
  path: "/metodoloji/",
  title: "SKDMHesapla CBAM Hesaplama Metodolojisi | Kaynaklı & İzlenebilir",
  description:
    "SKDMHesapla'nın AB Sınırda Karbon Düzenleme Mekanizması (CBAM) emisyon hesaplama metodolojisi, kaynakları, veri kalite kontrolleri ve versiyonlandırma altyapısı.",
});

export default function MetodolojiPage() {
  const jsonLd = techArticleJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-10 px-5 sm:px-6">
          <GeriLink />

          {/* Header */}
          <header className="space-y-4 border-b border-line pb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-800 bg-brand-800/10 px-3 py-1 rounded-full">
                Teknik Metodoloji Dokümanı
              </span>
              <span className="text-xs font-mono font-bold text-ink-600 bg-white border border-line px-2.5 py-0.5 rounded-md">
                Ver: {methodology.version}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
              SKDMHesapla CBAM Hesaplama Metodolojisi
            </h1>

            <p className="text-base sm:text-lg font-medium leading-relaxed text-ink-700 max-w-3xl">
              Bu doküman, SKDMHesapla platformunun karbon hesaplama mantığını, mevzuat dayanaklarını,
              sistem sınırlarını ve veri doğrulama kurallarını şeffaf biçimde açıklar.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-600 pt-2 border-t border-line/60">
              <span>Metodoloji Sorumlusu: <strong className="text-ink-900">{methodology.owner}</strong></span>
              <span>Motor Sürümü: <strong className="text-ink-900">{methodology.calculationEngineVersion}</strong></span>
              <span>Mevzuat Referans Tarihi: <strong className="text-ink-900">{methodology.regulatorySnapshot}</strong></span>
            </div>
          </header>

          {/* 1. Metodolojinin amacı */}
          <section id="amaci" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">1. Metodolojinin Amacı</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              SKDMHesapla metodolojisinin temel amacı, AB CBAM mevzuatına tabi Türk ihracatçıların
              üretim süreçlerine ait gömülü emisyonları (Embedded Emissions) deterministik, kaynaklı,
              izlenebilir ve üçüncü taraf denetçilerce doğrulamaya hazır biçimde hesaplamaktır.
              Sonucu gizli bir kapalı kutu olarak sunmak yerine, tüm varsayımları ve kaynakları kullanıcıya gösterir.
            </p>
          </section>

          {/* 2. Düzenleyici dayanak */}
          <section id="duzenleyici-dayanak" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">2. Düzenleyici Dayanak</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Hesaplama motorumuz aşağıdaki AB mevzuat hükümleri ile birebir uyumlu olarak kurgulanmıştır:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm font-medium text-ink-800 pl-2">
              <li><strong>(EU) 2023/956 Tüzüğü:</strong> AB Sınırda Karbon Düzenleme Mekanizması Ana Tüzüğü.</li>
              <li><strong>(EU) 2023/1773 Uygulama Yönetmeliği:</strong> Geçiş dönemi emisyon hesaplama ve raporlama kuralları.</li>
              <li><strong>AB Komisyonu Tesis Rehberi (Guidance for Installation Operators):</strong> Sektörel sınır belirleme kuralları.</li>
            </ul>
          </section>

          {/* 3. Sistem sınırları */}
          <section id="system-boundaries" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">3. Sistem Sınırları</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Hesaplama sistem sınırları &quot;Gate-to-Gate&quot; (Tesis Girişinden Tesis Çıkışına) yaklaşımını esas alır.
              Tesis içerisine giren ham maddelerin, yakıtların, elektriğin ve ara girdilerin tesis kapısından çıkış ürünü haline gelene kadarki sera gazı etkisi kapsanır.
            </p>
          </section>

          {/* 4. Installation kavramı */}
          <section id="installation" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">4. Tesis (Installation) Kavramı</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Tesis, üretim faaliyetlerinin gerçekleştirildiği fiziki ve teknik ünite olarak tanımlanır.
              Tek bir tesis içerisinde birden fazla CBAM ürünü veya üretim süreci yer alabilir. SKDMHesapla, tesis bazında kütle ve enerji dengesini ayrıştırır.
            </p>
          </section>

          {/* 5. Production process */}
          <section id="production-process" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">5. Üretim Süreci (Production Process)</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Her bir GTİP (CN) kodu bir üretim süreci ile ilişkilendirilir. AB CBAM tüzüğü gereğince bir CN kodu iki ayrı üretim sürecine bölünemez. Sistem bu fiziksel kısıtı veri girişinde otomatik denetler.
            </p>
          </section>

          {/* 6. Direct emissions */}
          <section id="direct-emissions" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">6. Doğrudan Emisyonlar (Direct Emissions)</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Tesis sınırları dâhilinde yakıt yakılması (doğal gaz, kömür, motorin vb.) ve proses tepkimeleri sonucu açığa çıkan emisyonları ifade eder. Yakıt miktarı ve yakıt emisyon faktörü üzerinden t CO₂e olarak hesaplanır.
            </p>
          </section>

          {/* 7. Indirect emissions */}
          <section id="indirect-emissions" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">7. Dolaylı Emisyonlar (Indirect Emissions)</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Üretim sürecinde dışarıdan satın alınan ve tüketilen elektrik, buhar, ısı ve soğutma enerjisinden kaynaklanan emisyonlardır.
            </p>
          </section>

          {/* 8. Electricity */}
          <section id="electricity" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">8. Elektrik Emisyon Metodolojisi</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Elektrik emisyonları, şebeke emisyon faktörü (grid factor) veya PPA (İkili Anlaşma) / yenilenebilir enerji sertifikalı gerçek emisyon faktörleri kullanılarak t CO₂ / MWh bazında hesaplanır.
            </p>
          </section>

          {/* 9. Precursors */}
          <section id="precursors" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">9. Gömülü Ara Girdiler (Precursors)</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Karmaşık malların (örneğin cıvata, vida veya işlenmiş alüminyum profiller) üretiminde kullanılan ham çelik, ham alüminyum veya klinker gibi CBAM kapsamındaki ara girdilerin bünyesinde getirdiği emisyonlardır.
            </p>
          </section>

          {/* 10. Embedded emissions */}
          <section id="embedded-emissions" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">10. Spesifik Gömülü Emisyon (SEE)</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Üretilen birim ton ürün başına düşen emisyon miktarını ifade eder (t CO₂e / ton ürün). Formula:
              <br />
              <code className="inline-block bg-[#f8faf9] p-2 rounded-lg border border-line mt-2 font-mono text-xs font-bold text-brand-900">
                SEE = (Doğrudan Emisyonlar + Dolaylı Emisyonlar + Prekürsör Emisyonları) / Toplam Üretim Miktarı (Ton)
              </code>
            </p>
          </section>

          {/* 11. Actual data */}
          <section id="actual-data" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">11. Gerçek Veri (Actual Data) Önceliği</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              AB CBAM rejiminin nihai uygulamasında tesise ait gerçek ölçüm verileri zorunludur. SKDMHesapla öncelikli olarak ihracatçının sayaç, fatura ve irsaliye bazlı gerçek verilerini işler.
            </p>
          </section>

          {/* 12. Default values */}
          <section id="default-values" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">12. Varsayılan Değerler (Default Values)</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Gerçek verinin temin edilemediği durumlarda AB Komisyonu tarafından yayımlanan sektörel varsayılan değerler kullanılır. Ancak varsayılan değer kullanılan alanlar mühürleme raporunda gerekçelendirilmek zorundadır.
            </p>
          </section>

          {/* 13. Emission factors */}
          <section id="emission-factors" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">13. Emisyon Faktörü Veri Tabanı</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Sistemimiz IPCC, Turstat, EPDK, TEİAŞ ve AB JRC veri tabanlarındaki güncel kütle/enerji emisyon faktörlerini kullanır. Emisyon faktör seti versiyonlanmıştır.
            </p>
          </section>

          {/* 14. Data quality controls */}
          <section id="qc" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">14. Veri Kalite Kontrolleri (QC)</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Sihirbaz ekranında girilen veriler anlık olarak 10 katmanlı kalite kontrol algoritması (QC) tarafından taranır. Fiziksel tutarsızlıklar, aşırı yüksek/düşük birim değerler anında kullanıcıya bildirilir.
            </p>
          </section>

          {/* 15. Missing data handling */}
          <section id="missing-data" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">15. Eksik Veri Yönetimi</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Eksik veriler kullanıcı arayüzünde kırmızı renk veya yıkıcı kelimelerle değil, yönlendirici ve açıklayıcı metinlerle işaretlenir. Eksik veriler tamamlanmadan mühürlü paket üretilemez.
            </p>
          </section>

          {/* 16. Allocation methodology */}
          <section id="allocation" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">16. Tahsis (Allocation) Metodolojisi</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Ortak tesis alanlarında veya ortak yakıt kullanımında emisyonların üretilen ürünler arasındaki dağıtımı kütlesel üretim oranları (kütle payı) esas alınarak yapılır.
            </p>
          </section>

          {/* 17. Calculation assumptions */}
          <section id="assumptions" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">17. Hesaplama Varsayımları</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Her hesaplama raporunda kullanılan tüm varsayımlar (ör. alt ısııl değer varsayımı, ortalama taşıma mesafesi vb.) raporda açıkça kütük dosyası (Audit Trail) olarak kaydedilir.
            </p>
          </section>

          {/* 18. Verification readiness */}
          <section id="readiness" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">18. Denetime Hazırlık (Verification Readiness)</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              SKDMHesapla çıktısı olan <LegalFact id="packageFileCount" /> parçalı paket, akredite bağımsız doğrulayıcı kurumların talep ettiği veri yapısına birebir uygun şekilde dizayn edilmiştir.
            </p>
          </section>

          {/* 19. ISO 14064-1 metodolojik bağlantısı */}
          <section id="iso-link" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">19. ISO 14064-1 Metodolojik Bağlantısı</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              {GROUND_TRUTH_CLAIM}
            </p>
            <p className="text-xs font-medium text-ink-600">
              Ürün sorumlumuz {primaryCredential.holder.name}, {primaryCredential.credential.name} belgesi sahibidir.
            </p>
          </section>

          {/* 20. SKDMHesapla'nın yapmadığı işlemler */}
          <section id="not-done" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">20. SKDMHesapla&apos;nın Yapmadığı İşlemler</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              {SCOPE_DISCLAIMER}
            </p>
          </section>

          {/* 21. Methodology changelog */}
          <section id="changelog" className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">21. Metodoloji Değişiklik Günlüğü (Changelog)</h2>
            <div className="space-y-3 text-xs sm:text-sm font-medium text-ink-800">
              <div className="border-l-2 border-brand-800 pl-4 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="font-extrabold text-ink-900">v2026.08.1</strong>
                  <span className="text-xs text-ink-500">17 Ağustos 2026</span>
                </div>
                <p className="text-ink-700">
                  - Elektrik ve ikili anlaşma (PPA) veri kaynak açıklamaları güncellendi.
                  <br />
                  - Prekürsör veri doğrulama kontrolleri geliştirildi.
                  <br />
                  - Calculation provenance alanı ve SHA-256 bütünlük doğrulaması entegre edildi.
                </p>
              </div>
            </div>
          </section>

          {/* 22. Kaynaklar */}
          <section id="kaynaklar" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">22. Resmi Kaynaklar ve Referanslar</h2>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm font-medium text-ink-800 pl-2">
              <li>EU Commission CBAM Dedicated Portal: taxation-customs.ec.europa.eu</li>
              <li>IPCC Guidelines for National Greenhouse Gas Inventories</li>
              <li>ISO 14064-1:2018 Standard Documentation</li>
            </ul>
          </section>

          {/* 23. Metodoloji sorumluluğu */}
          <section id="sorumluluk" className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900">23. Metodoloji Sorumluluğu ve Teknik Gözetim</h2>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pt-2">
              <div>
                <p className="text-base font-bold text-ink-900">{primaryCredential.holder.name}</p>
                <p className="text-xs font-semibold text-brand-900">{primaryCredential.holder.role}</p>
                <p className="text-xs text-ink-600 mt-1">{primaryCredential.credential.name} — {primaryCredential.credential.issuingOrganization}</p>
              </div>
              <Link
                href={primaryCredential.holder.profileUrl}
                className="inline-flex items-center text-xs font-bold text-brand-900 underline underline-offset-4"
              >
                Yetkinliği Doğrula →
              </Link>
            </div>
          </section>

          <footer className="text-center pt-4 text-xs font-medium text-ink-500 space-y-1">
            <p>{LEGAL_ENTITY.copyrightFull}</p>
            <p>Son Teknik İnceleme Tarihi: {methodology.reviewDate}</p>
          </footer>
        </div>
      </article>
    </>
  );
}
