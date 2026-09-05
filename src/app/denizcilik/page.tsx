import type { Metadata } from "next";
import Link from "next/link";
import {
  Ship,
  Anchor,
  ArrowRight,
  ShieldCheck,
  Scale,
  TrendingDown,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { MaritimeSurchargeSimulator } from "@/components/maritime/MaritimeSurchargeSimulator";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/",
  title: "Denizcilik ve Lojistik Karbonu — EU ETS Maritime & FuelEU | SKDMHesapla",
  description:
    "AB Denizcilik ETS (%40-%70-%100 geçişi), FuelEU Maritime sera gazı yoğunluğu ve Türk limanları (Ambarlı, Mersin, Kocaeli, Aliağa) navlun emisyon hesaplama çerçevesi.",
});

const phaseInTimeline = [
  {
    year: "2024",
    percentage: "%40",
    scope: "Raporlanan doğrulanmış CO₂ emisyonlarının %40'ı için EUA teslim yükümlülüğü.",
    status: "Tamamlandı",
    statusBg: "bg-ink-100 text-ink-800",
  },
  {
    year: "2025",
    percentage: "%70",
    scope: "Raporlanan doğrulanmış CO₂ emisyonlarının %70'i için EUA teslim yükümlülüğü.",
    status: "Yürürlükte",
    statusBg: "bg-brand-100 text-brand-900 font-bold",
  },
  {
    year: "2026+",
    percentage: "%100",
    scope: "Tüm emisyonların %100 teslimi. Ayrıca metan (CH₄) ve diazot monoksit (N₂O) sisteme dahil edilir.",
    status: "Tam Kapsam",
    statusBg: "bg-amber-100 text-amber-900 font-bold",
  },
] as const;

const portCorridors = [
  {
    hub: "Ambarlı Liman Kompleksi (İstanbul)",
    terminals: "Marport, Kumport, Mardaş",
    tradeFlow: "Marmara ve Trakya sanayisinin konteyner ihracatı (İtalya, İspanya, Pire aktarmalı Kuzey Avrupa).",
    etsImpact: "Ambarlı-AB limanları arası tek yönlü seferlerde toplam seyir emisyonunun %50'si ETS teslimine tabidir.",
  },
  {
    hub: "Mersin Uluslararası Limanı (MIP)",
    terminals: "MIP Rıhtımları, Doğu Akdeniz Terminali",
    tradeFlow: "Gaziantep OSB, Adana, İskenderun ve İç Anadolu çelik, tekstil ve kimya ihracatı.",
    etsImpact: "Doğu Akdeniz-Güney Avrupa feeder ve direkt hatlarında sefer başına %50 ETS tahakkuku uygulanır.",
  },
  {
    hub: "Kocaeli & İzmit Körfezi Limanları",
    terminals: "Evyapport, Yılport Gebze, DP World Yarımca",
    tradeFlow: "Ağır sanayi, çelik rulo/profil, kimyasal madde ve otomotiv sevkiyatları.",
    etsImpact: "Genel kargo ve dökme yük taşımacılığında navlun başına yansıtılan EUA sürşarjı kritik maliyet unsurudur.",
  },
  {
    hub: "Aliağa & Nemrut Körfezi Limanları (İzmir)",
    terminals: "Nemport, TCEEGE, Batıçim, Ege Gübre",
    tradeFlow: "Ege Bölgesi inşaat demiri, kütük demir, alüminyum profil ve çimento sevkiyatları.",
    etsImpact: "Dökme yük ve hurda/demir gemilerinde 5.000 GT üstü armatörler için doğrudan MRV & ETS takip zorunluluğu.",
  },
] as const;

const comparisonMatrix = [
  {
    parameter: "Hukuki Temel",
    cbam: "AB Tüzüğü 2023/956 & 2025/2547",
    maritimeEts: "AB Direktifi 2023/957 & 2003/87/EC",
    fueleu: "AB Tüzüğü 2023/1805",
  },
  {
    parameter: "Yükümlü Taraf",
    cbam: "AB İthalatçısı (Yetkili CBAM Beyan Sahibi)",
    maritimeEts: "Gemi İşletmecisi / Armatör (ISM Company)",
    fueleu: "Gemi İşletmecisi / Armatör (ISM Company)",
  },
  {
    parameter: "Kapsanan Faaliyet",
    cbam: "İthal edilen ürünün üretimindeki gömülü emisyon (SEE)",
    maritimeEts: "5.000 GT+ gemilerin sefer ve liman emisyonları",
    fueleu: "Gemide tüketilen enerjinin sera gazı yoğunluğu (Well-to-Wake)",
  },
  {
    parameter: "Türk İhracatçısına Yansıması",
    cbam: "Resmi CBAM beyanı için doğrudan/dolaylı emisyon hesabı",
    maritimeEts: "Navlun faturasında 'ETS Surcharge' (karbon ek ücreti)",
    fueleu: "Uyumsuz gemiler için navlun cezası veya yeşil yakıt primi",
  },
  {
    parameter: "Doğrulama Merci",
    cbam: "Akredite Bağımsız CBAM Doğrulayıcısı",
    maritimeEts: "Akredite Denizcilik MRV Doğrulayıcısı (Klas Kuruluşları)",
    fueleu: "Akredite FuelEU Doğrulayıcısı (Klas Kuruluşları)",
  },
] as const;

export default function DenizcilikPage() {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <RegistryJsonLd route="/denizcilik/" />

      {/* Hero Section */}
      <section className="border-b border-line bg-gradient-to-b from-[#f0f5f7] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-800/20 bg-white px-3.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-sky-950 shadow-sm">
            <Anchor className="h-3.5 w-3.5 text-sky-700" />
            AB Denizcilik ETS · FuelEU Maritime · Tedarik Zinciri
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Denizcilik ve lojistik karbonu: EU ETS, FuelEU ve Türk ihracatçısı
          </h1>

          {/* Hero Answer Engine (İlk 100px AEO/LLMO/GEO bloğu) */}
          <div className="hero-answer-engine mt-6 max-w-3xl rounded-2xl border border-sky-900/15 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-sky-950">
              Doğrudan Çıkarım & Yasal Sınır (Hero Grounding Answer)
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-ink-800">
              AB Direktifi 2023/957 uyarınca 1 Ocak 2024 itibarıyla 5.000 GT üzeri ticari gemiler AB ETS kapsamındadır.
              Türkiye limanları ile AB limanları arasındaki seferlerde emisyonların %50&apos;si için EUA (karbon tahsisatı) teslimi zorunludur.
              CBAM gömülü emisyon hesabı (AB 2023/956 &amp; 2025/2547) fabrika kapısında biter ve deniz navlununu içermez; ancak armatörlerin yansıttığı
              ETS navlun sürşarjı (freight surcharge) ve 1 Ocak 2025&apos;te başlayan FuelEU Maritime (AB 2023/1805) sera gazı yoğunluğu kuralları Türk ihracatçısının
              nihai CIF teslim maliyetini ve Kapsam 3 lojistik karbon ayak izini doğrudan belirler.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/denizcilik/dosya-hazirla/"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-900 px-6 text-sm font-black text-white transition hover:bg-sky-800 shadow-sm"
            >
              Denizcilik dosyasını hazırlayın ($399) <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/basla/"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-sky-900/20 bg-white px-6 text-sm font-black text-sky-950 transition hover:bg-sky-50"
            >
              İhracatçı GTİP Kapsam Kontrolü
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Temel Sütun */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-line bg-[#fafcfb] p-6">
              <Ship className="h-7 w-7 text-sky-800" />
              <h2 className="mt-4 text-lg font-black text-ink-900">1. Maritime ETS (2024+)</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                5.000 GT ve üzeri kargo ve yolcu gemilerinin Türkiye-AB arasındaki seferlerinde emisyonların %50&apos;si kademeli olarak (%40 → %70 → %100) ETS&apos;ye tabidir.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-[#fafcfb] p-6">
              <TrendingDown className="h-7 w-7 text-emerald-700" />
              <h2 className="mt-4 text-lg font-black text-ink-900">2. FuelEU Maritime (2025+)</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                Gemide tüketilen yakıtların Well-to-Wake (kuyudan-pervaneye) sera gazı yoğunluğu sınırlandırılır. Uyumsuzluk durumunda gemi başına cezai yaptırım doğar.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-[#fafcfb] p-6">
              <Scale className="h-7 w-7 text-amber-700" />
              <h2 className="mt-4 text-lg font-black text-ink-900">3. CBAM &amp; Navlun Ayrımı</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                SKDM tesis sınırı ile deniz taşımacılığı yasal olarak ayrı rejimlerdir. Navlun emisyonu CBAM beyanına değil, CIF/DDP navlun ek maliyetine yansır.
              </p>
            </article>
          </div>

          {/* İnteraktif Sürşarj Simülatörü (Exclusive Tool & Monetization Hook) */}
          <div className="mt-12">
            <MaritimeSurchargeSimulator />
          </div>
        </div>
      </section>

      {/* Bölüm 1: EU ETS Kademeli Geçiş Takvimi */}
      <section className="border-y border-line bg-[#f8faf9] py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-800">
              AB Direktifi (EU) 2023/957
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl text-ink-900">
              EU ETS Denizcilik Kademeli Geçiş Takvimi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Deniz taşımacılığı sektörünün karbon piyasasına uyum sağlaması amacıyla Avrupa Birliği 3 yıllık aşamalı geçiş
              takvimi uygulamaktadır. Teslim yükümlülüğü her yıl Eylül ayı sonunda bir önceki yılın doğrulanmış emisyonları için gerçekleşir.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {phaseInTimeline.map((item) => (
              <div key={item.year} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-ink-900">{item.year}</span>
                  <span className={`rounded-lg px-2.5 py-1 text-xs ${item.statusBg}`}>{item.status}</span>
                </div>
                <div className="mt-4 text-3xl font-black text-sky-900">{item.percentage}</div>
                <p className="mt-2 text-xs font-medium leading-5 text-ink-700">{item.scope}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-sky-900/15 bg-white p-5">
            <h3 className="text-sm font-black uppercase tracking-wide text-sky-950">
              Coğrafi Kapsam ve Sefer Paylaşım Kuralı (%50 / %100)
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                <span><strong>İki AB limanı arası seferler:</strong> Emisyonların %100&apos;ü ETS teslim yükümlülüğündedir.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                <span><strong>Türkiye limanı ile AB limanı arası seferler:</strong> Sefer boyunca oluşan emisyonun tam %50&apos;si ETS kapsamındadır.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                <span><strong>AB limanında demirleme / rıhtımda bekleme:</strong> Limanda tüketilen enerjiden kaynaklanan emisyonların %100&apos;ü ETS&apos;ye tabidir.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bölüm 2: Türk Limanları & GEO Lojistik Havzaları */}
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-800">
              Türkiye İhracat Koridorları &amp; Liman Ekosistemi
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl text-ink-900">
              Türk Limanlarından AB&apos;ye Navlun ve Karbon Akışı
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Türkiye&apos;nin önde gelen konteyner, dökme yük ve Ro-Ro limanları AB deniz ticaretinde doğrudan
              ETS ve FuelEU düzenlemeleriyle temas halindedir. Armatörlerin ve hat operatörlerinin (feeder) uyguladığı karbon sürşarjları
              ihracatçının navlun tekliflerine yansımaktadır.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {portCorridors.map((port) => (
              <article key={port.hub} className="rounded-2xl border border-line bg-[#fafcfb] p-6">
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-sky-800" />
                  <h3 className="text-base font-black text-ink-900">{port.hub}</h3>
                </div>
                <div className="mt-2 text-xs font-semibold text-sky-900">Terminaller: {port.terminals}</div>
                <p className="mt-3 text-xs leading-relaxed text-ink-700"><strong>Yük Akışı:</strong> {port.tradeFlow}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 bg-white p-2.5 rounded-xl border border-line">
                  <strong>ETS &amp; Navlun Etkisi:</strong> {port.etsImpact}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Karşılaştırma Matrisi: CBAM vs ETS Maritime vs FuelEU */}
      <section className="border-t border-line bg-[#f8faf9] py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-800">
              Teknik Uyum ve Düzenleme Ayrımı
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl text-ink-900">
              CBAM, EU ETS Denizcilik ve FuelEU Karşılaştırma Matrisi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Üç düzenleme sıklıkla birbirine karıştırılmaktadır. Aşağıdaki matris yükümlü tarafları, yasal dayanakları
              ve Türk ihracatçısının finansal sorumluluk sınırlarını netleştirmektedir.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-line bg-[#f0f5f7] text-ink-900">
                <tr>
                  <th className="p-3 sm:p-4 font-black">Parametre</th>
                  <th className="p-3 sm:p-4 font-black">CBAM (SKDM)</th>
                  <th className="p-3 sm:p-4 font-black">EU ETS Denizcilik</th>
                  <th className="p-3 sm:p-4 font-black">FuelEU Maritime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-700">
                {comparisonMatrix.map((row) => (
                  <tr key={row.parameter} className="hover:bg-slate-50/60">
                    <td className="p-3 sm:p-4 font-bold text-ink-900 whitespace-nowrap">{row.parameter}</td>
                    <td className="p-3 sm:p-4">{row.cbam}</td>
                    <td className="p-3 sm:p-4">{row.maritimeEts}</td>
                    <td className="p-3 sm:p-4">{row.fueleu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sorumluluk Sınırı & E-E-A-T */}
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="rounded-3xl border-2 border-sky-900/15 bg-gradient-to-br from-[#06151f] to-[#0a2333] p-6 text-white sm:p-10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-sky-400" />
              <h2 className="text-xl font-black sm:text-2xl">Yasal Sınırlar ve E-E-A-T Metodoloji Beyanı</h2>
            </div>
            <p className="mt-4 text-sm font-normal leading-relaxed text-slate-300">
              SKDMHesapla, AB Direktifi 2023/957 (Maritime ETS) veya AB Tüzüğü 2023/1805 (FuelEU Maritime) kapsamında
              akredite bir denizcilik doğrulayıcısı (klas kuruluşu veya MRV verifier) değildir. Platformumuz, ihracatçılar, armatörler
              ve lojistik operasyonları için deterministik emisyon hesabı, sefer karbon payı modellemesi ve Kapsam 3 tedarik zinciri veri
              hazırlık araçları sunar.
            </p>
            <p className="mt-3 text-sm font-normal leading-relaxed text-slate-300">
              İçerik ve hesaplama mantığı, <strong>Barış Bağırlar</strong> (ISO 14064-1 Sera Gazı Baş Denetçisi, GSO-MEM Karbon Danışma Kurulu Üyesi)
              liderliğinde incelenmiş ve yasal kaynaklarla sınırlandırılmıştır. Resmi THETIS-MRV doğrulama raporları IACS üyesi yetkili klas kuruluşları tarafından düzenlenir.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-white/10">
              <Link
                href="/uzmanlik/baris-bagirlar/"
                className="inline-flex items-center gap-2 text-xs font-bold text-sky-300 hover:text-white"
              >
                Baş Denetçi ve Metodoloji Sorumlusu <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/kaynak-politikasi/"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Resmi Kaynak Hiyerarşisi Politikası <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* İhracatçının 4 Adımlı Korunma ve Tasarruf Stratejisi (Conversion & Monetization) */}
      <section className="border-t border-line bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-wider text-brand-900">
              Mali Risk Yönetimi &amp; Hukuki Ayrım
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl text-ink-900">
              Fazladan Karbon Vergisi Ödememek İçin İhracatçı Yol Haritası
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              AB alıcıları, deniz taşımacılığındaki ETS sürşarjları nedeniyle Türk tedarikçilerinden gelen her faturayı
              ve karbon raporunu mercek altına almaktadır. Mükerrer maliyet ödememek ve pazar payınızı korumak için izlemeniz gereken 4 adım:
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-line bg-[#fbfdfb] p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-xs font-black text-brand-900">
                01
              </span>
              <h3 className="mt-3 text-base font-black text-ink-900">GTİP Kapsamını Doğrulayın</h3>
              <p className="mt-2 text-xs leading-5 text-ink-600">
                Ürününüzün 569 resmi CN/GTİP kodu içinde olup olmadığını kontrol edin. Kapsam dışıysa boşuna CBAM masrafı yapmayın.
              </p>
              <Link href="/basla/" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-brand-800 hover:underline">
                Ücretsiz Kontrol <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-line bg-[#fbfdfb] p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-xs font-black text-sky-900">
                02
              </span>
              <h3 className="mt-3 text-base font-black text-ink-900">Gerçek SEE&apos;yi Sunun</h3>
              <p className="mt-2 text-xs leading-5 text-ink-600">
                Cezai varsayılan (default) değerler yerine fabrikanızın gerçek tesis ve elektrik verileriyle hesaplanmış düşük emisyonu beyan edin.
              </p>
              <Link href="/cbam-hesaplama/" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-sky-800 hover:underline">
                Hesaplama Motoru <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-line bg-[#fbfdfb] p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-xs font-black text-amber-900">
                03
              </span>
              <h3 className="mt-3 text-base font-black text-ink-900">Navlunu CBAM&apos;dan Ayırın</h3>
              <p className="mt-2 text-xs leading-5 text-ink-600">
                Armatörün navluna kestiği ETS sürşarjını faturada net belirtin; CBAM Communication Template&apos;e dahil edilmesini engelleyin.
              </p>
              <Link href="/metodoloji/" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-amber-800 hover:underline">
                Metodoloji Ayrımı <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-line bg-[#fbfdfb] p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-900 text-xs font-black text-white">
                04
              </span>
              <h3 className="mt-3 text-base font-black text-ink-900">Uyum Dosyasını Hazırlayın</h3>
              <p className="mt-2 text-xs leading-5 text-ink-600">
                1 gemi · 1 raporlama yılı · tek seferlik ($399). EU MRV, ETS ve FuelEU kanıt omurgasıyla klas doğrulayıcısına hazır paket.
              </p>
              <Link href="/denizcilik/dosya-hazirla/" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-sky-800 hover:underline">
                Dosyayı Hazırla ($399) <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular */}
      <section className="border-t border-line bg-[#f8faf9] py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-ink-900">
            Denizcilik Karbonu &amp; ETS Sık Sorulan Sorular
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-line bg-white p-5">
              <h3 className="text-base font-black text-ink-900">Deniz navlunu CBAM beyanına eklenir mi?</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700">
                Hayır. AB 2023/956 ve 2025/2547 uyarınca CBAM gömülü emisyonu (SEE) yalnızca üretim tesisindeki doğrudan (Kapsam 1) ve elektrik (Kapsam 2) emisyonları ile öncül maddeleri kapsar. Deniz yoluyla yapılan uluslararası nakliye CBAM formülüne girmez; ancak navlun faturasındaki ETS ek ücreti olarak ithalatçının toplam maliyetine yansır.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-white p-5">
              <h3 className="text-base font-black text-ink-900">Türkiye-AB seferlerinde neden %50 emisyon dikkate alınır?</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700">
                Direktif 2023/957 kuralına göre, bir ucu AB limanında olan üçüncü ülke seferlerinde yetki paylaşımı ve çifte vergilendirmeyi önlemek amacıyla emisyonların %50&apos;si AB ETS kapsamına alınır. Diğer %50 ise bayrak devleti veya kalkış ülkesinin olası karbon düzenlemelerine bırakılmıştır.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-white p-5">
              <h3 className="text-base font-black text-ink-900">ETS Surcharge (Karbon Navlun Ek Ücreti) nasıl hesaplanır?</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700">
                Hat operatörleri (Maersk, MSC, CMA CGM vb.), geminin seferlik yakıt tüketimi, taşınan TEU kapasitesi, geçerli phase-in oranı (%70 in 2025) ve güncel AB EUA karbon izin fiyatını çarparak konteyner başına standart bir sürşarj belirler ve navluna yansıtır.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-white p-5">
              <h3 className="text-base font-black text-ink-900">5.000 GT altındaki gemiler kapsama girer mi?</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700">
                Şu anda EU ETS Maritime zorunluluğu 5.000 Gross Tonnage (GT) ve üzeri ticari gemiler için geçerlidir. Ancak 2027 yılı itibarıyla 400 ile 5.000 GT arasındaki genel kargo ve açık deniz gemilerinin genel kapsama dahil edilmesi AB Komisyonu tarafından incelenmektedir.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA / Dönüşüm */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="rounded-3xl border border-line bg-gradient-to-br from-[#071926] to-[#0c2a3f] p-8 text-center text-white sm:p-12 shadow-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-white/10 px-3.5 py-1 text-xs font-black text-sky-300">
              <Ship className="h-4 w-4" /> 1 Gemi · 1 Raporlama Yılı · Tek Seferlik $399
            </div>
            <h2 className="mt-4 text-2xl font-black sm:text-4xl text-white">
              Denizcilik Karbon Uyum Hazırlık Dosyanızı Şimdi Oluşturun
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              EU MRV, EU ETS Maritime ve FuelEU Maritime için voyage, bunker yakıt ve BDN kanıt omurgasını tek dosyada toplayın;
              klas kuruluşlarına (DNV, Bureau Veritas, RINA vb.) hazır ve değişmez snapshot güvencesiyle teslim edin.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/denizcilik/dosya-hazirla/"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-500 px-7 text-sm font-black text-slate-950 transition hover:bg-sky-400 shadow-md"
              >
                Denizcilik dosyasını hazırlayın ($399) <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/basla/"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-black text-white hover:bg-white/10"
              >
                İhracatçı Kapsam Kontrolü (0 TL)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
