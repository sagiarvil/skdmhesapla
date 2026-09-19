import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Anchor,
  ArrowRight,
  CheckCircle2,
  Coins,
  Compass,
  FileCheck,
  FileSpreadsheet,
  Lock,
  Scale,
  Server,
  ShieldCheck,
  Ship,
  TrendingDown,
  Zap,
} from 'lucide-react';

// 1. Acının Maliyeti (Denizcilikte Armatör & İhracatçının Karşılaştığı Cezai Maliyetler)
const maritimePainPoints = [
  {
    title: 'Gemiye Liman Yasağı & Tutuklama (Expulsion Order)',
    riskTag: 'Tüm AB Limanlarından Men Cezası',
    desc: 'EU ETS tahsisatı (EUA) teslim etmeyen veya FuelEU cezalarını ödemeyen gemiler hakkında AB bayrak devletleri tarafından seyrüsefer yasağı ve liman tutuklaması kararı verilir.',
    solution: '9 yasal klasörlük THETIS-MRV ve FuelEU kütüğü ile sıfır açıkla denetime girin.',
  },
  {
    title: 'FuelEU Ağır Cezai Katsayısı (Compliance Deficit)',
    riskTag: 'Eksik MJ Başına 2.400€ / Ton VLSFO Denk Ceza',
    desc: 'Well-to-Wake sera gazı yoğunluk sınırını (89.34 gCO₂e/MJ) aşan gemiler, düzeltilmeyen her ton uyumsuz yakıt için astronomik nakit cezası öder.',
    solution: 'Gemi yakıt kütüğünü sefer bazında izleyip ceza riskini önceden simüle eder ve sıfırlar.',
  },
  {
    title: 'Hatalı Navlun Sürşarjı & CBAM Uyuşmazlığı',
    riskTag: 'Gümrükte Çifte Vergi & Fatura Reddi',
    desc: 'Armatörün kestiği ETS sürşarjı fabrika kapısı CBAM beyanına yanlışlıkla dahil edilirse ithalatçının beyanı gümrükte reddedilir, navlun bedeli ihtilafa düşer.',
    solution: 'Lojistik sürşarjı ile fabrika kapısı gömülü emisyonunu (SEE) yasal sınır hattıyla ayırır.',
  },
];

// 2. 15 Hap Karar Maddesi (Denizcilik Uyum ve Karar Sistemi)
const maritimeFifteenNeeds = [
  { no: '01', title: 'EMSA THETIS-MRV Uyumlu Resmi XML Dosyası' },
  { no: '02', title: 'FuelEU Maritime Madde 15 Sefer & Yakıt Kütüğü' },
  { no: '03', title: '5.000+ GT & 400+ GT Kapsam & Muafiyet Çözümü' },
  { no: '04', title: 'TR-AB Seferlerinde %50 Emisyon Ayrım Kuralı' },
  { no: '05', title: '2026 %100 Tam EUA Teslimi & CH₄ + N₂O Hesabı' },
  { no: '06', title: 'B2B Acente, Armatör & Müşavir Dağıtım Portalı' },
  { no: '07', title: 'Bunker Teslim Belgeleri (BDN) Dijital Eşleme' },
  { no: '08', title: 'Well-to-Wake (WtW) Sera Gazı Yoğunluk Kontrolü' },
  { no: '09', title: 'İhracatçı İçin ETS Navlun Sürşarj Ayrım Kalkanı' },
  { no: '10', title: 'Klas Denetçisi (DNV, RINA, BV) Öncesi Pre-Audit' },
  { no: '11', title: '9 Parçalı Mühürlü Klas Denetim Arşiv Paketi' },
  { no: '12', title: 'SHA-256 Kriptografik Değişmezlik Snapshot İmzası' },
  { no: '13', title: 'Ambarlı, Mersin, Kocaeli, Aliağa Özel Koridorları' },
  { no: '14', title: 'Çift Dilli (Türkçe & İngilizce) Yönetici Özeti' },
  { no: '15', title: 'Gemi Başına Tek Seferlik Şeffaf Lisans (599 USD)' },
];

// 3. 3x3 Sektörel Koridor & Gemi Tipi Risk Tablosu
const maritimeSectorGrid = [
  { name: 'Konteyner Hatları', code: 'Ambarlı ➔ Cenova/Barselona', risk: 'TEU Başına ETS Sürşarjı' },
  { name: 'Dökme Yük & Hurda', code: 'Aliağa ➔ İtalya/İspanya', risk: 'Ton Başına Yüksek Sefer İzi' },
  { name: 'Ro-Ro & Treyler', code: 'Pendik/Yalova ➔ Trieste', risk: 'Sabit Hat Sefer Emisyonu' },
  { name: 'Genel Kargo (400-5000 GT)', code: 'Karadeniz & Akdeniz', risk: '2025 MRV Zorunlu Takip' },
  { name: 'Kimyasal & Petrol Tankeri', code: 'Kocaeli & Ceyhan Çıkışlı', risk: 'Liman Bekleme & Pompa İzi' },
  { name: 'Feeder & Kısa Deniz', code: 'Pire & Malta Aktarmalı', risk: '%50 Sefer Paylaşım Kuralı' },
  { name: 'Ağır Yük & Proje Kargo', code: 'Derince & Nemrut Hatları', risk: 'Düzensiz Sefer Tahsisatı' },
  { name: 'Offshore & Destek Gemileri', code: '400+ GT Özel Kapsam', risk: 'THETIS-MRV İzleme Kütüğü' },
  { name: 'Türk İhracatçı Yükü', code: 'FOB / CIF / DDP Teslim', risk: 'Navlun Sürşarj İhtilafı' },
];

// 4. 6 Altyapı ve Güvenlik Kartı (PDF Sayfa 5 Stili)
const maritimeSecurityCards = [
  {
    icon: Lock,
    title: 'Gemi & Sefer Veri Zırhı',
    desc: 'Armatör ve işletmecilerin bunker (BDN), tüketim, hız ve navlun sözleşme verileri bankacılık seviyesinde şifrelenir; üçüncü taraflarla paylaşılmaz.',
  },
  {
    icon: ShieldCheck,
    title: 'ISO 27001 & SOC-2 Uyum',
    desc: 'Uluslararası denizcilik standartlarına uygun bilgi güvenliği altyapısı ile armatörün ticari sırları tam koruma altındadır.',
  },
  {
    icon: FileCheck,
    title: 'EMSA & THETIS-MRV Şablonu',
    desc: 'Çıktılar Avrupa Deniz Emniyeti Ajansı (EMSA) Part A-G resmi XML formatında üretilir; klas kuruluşlarınca sorgusuz kabul edilir.',
  },
  {
    icon: Zap,
    title: '2026 Mevzuat & Ceza Motoru',
    desc: 'Direktif (AB) 2023/959 (%100 EUA) ve Tüzük 2023/1805 (FuelEU) kurallarını anlık günceller; ceza risklerini önceden bildirir.',
  },
  {
    icon: Scale,
    title: 'Deterministik Kural Motoru',
    desc: 'Tahmini ortalamalar yerine IMO Resolution A.1078(28) ve resmi AB kimyasal emisyon katsayılarıyla sıfır toleransla çalışır.',
  },
  {
    icon: Server,
    title: 'SHA-256 Mühürlü Snapshot',
    desc: 'Hazırlanan denetim kütüğü SHA-256 hash imzasıyla kilitlenir; IACS akredite klas kuruluşlarına geriye dönük kanıt olarak sunulur.',
  },
];

// 5. 1'den 7'ye Tercih Nedenleri (PDF Sayfa 21 Stili)
const maritimeWhyUsSeven = [
  {
    title: 'Sıfır Liman Tutuklama Riski ve Kesintisiz Seyir:',
    desc: 'AB limanlarında gemilerinizin seyrüsefer yasağı (expulsion order) almasını engelleyen, regülasyona tam uyumlu karar sistemi.',
  },
  {
    title: 'Resmi EMSA THETIS-MRV XML Çıktısı:',
    desc: 'Klas kuruluşlarının (DNV, RINA, BV, ABS) denetim sistemine tek tıkla aktarabileceğiniz Part A-G resmi veri şablonu.',
  },
  {
    title: 'FuelEU Maritime Kütüğü & Ceza Önleme:',
    desc: '89.34 gCO₂e/MJ sınırını aşmadan yakıt karışımınızı ve olası uyumsuzluk açıklarınızı önceden hesaplayıp cezaları bertaraf edin.',
  },
  {
    title: '9 Parçalı Mühürlü Klas Denetim Arşivi:',
    desc: 'Yalnızca tek bir tablo değil; BDN kütüğü, sefer izleme defteri, WtW hesap tablosu ve iki dilli denetim raporu tek pakette.',
  },
  {
    title: 'SHA-256 Değiştirilemez Kriptografik Güvence:',
    desc: 'Her teslim paketi zaman damgası ve hash imzasıyla kilitlenir; denetçiye sunulan verinin değiştirilmediği kanıtlanır.',
  },
  {
    title: 'B2B Acente & Gemi İşletmecisi Portalı:',
    desc: 'Gemi yönetim firmaları (DOC holders) ve acenteler için filo bazlı çoklu gemi takibi ve merkezi uyum paneli.',
  },
  {
    title: 'İhracatçı Navlun Sürşarj Kalkanı:',
    desc: 'İhracatçıların faturasındaki "ETS Surcharge" bedellerini denetleyerek haksız navlun artışlarını ve CBAM çifte vergisini önler.',
  },
];

// 6. 24 Denizcilik & Liman Ekosistemi Referansı (PDF Sayfa 23 Stili)
const maritimeReferences24 = [
  { name: 'Ambarlı Marport', sub: 'Marmara Konteyner Hattı' },
  { name: 'Kumport Liman Hizmetleri', sub: 'Kuzey Avrupa Seferleri' },
  { name: 'MIP Mersin Limanı', sub: 'Doğu Akdeniz Feeder' },
  { name: 'DP World Yarımca', sub: 'Sanayi & Otomotiv Hattı' },
  { name: 'Aliağa Nemport', sub: 'Ege Konteyner İhracatı' },
  { name: 'TCEEGE Konteyner Terminali', sub: 'Ege & Akdeniz Koridoru' },
  { name: 'Asyaport Liman A.Ş.', sub: 'Aktarma & Ana Hat' },
  { name: 'Evyapport Kocaeli', sub: 'Körfez Sıvı & Dökme' },
  { name: 'Yılport Gebze', sub: 'Genel Kargo & Konteyner' },
  { name: 'Arkas Denizcilik Filosu', sub: 'Akdeniz & Karadeniz' },
  { name: 'Turkon Line Konteyner', sub: 'Batı Akdeniz & Kuzey' },
  { name: 'Medlog Lojistik & Gemi', sub: 'Kıyı Taşıma & Feeder' },
  { name: 'DFDS Akdeniz Hatları', sub: 'Pendik/Yalova Ro-Ro' },
  { name: 'Ulusoy Ro-Ro İşletmesi', sub: 'Çeşme ➔ Trieste Hattı' },
  { name: 'Ege Gübre İskelesi', sub: 'Kimyasal & Dökme Çelik' },
  { name: 'Batıçim Liman Tesisleri', sub: 'Klinker & Çimento Yükü' },
  { name: 'İskenderun Liman İdaresi', sub: 'Çelik & Ağır Yük Hattı' },
  { name: 'Gemas Acentelik A.Ş.', sub: 'Boğaz & Liman Acenteliği' },
  { name: 'Vapur Donatanları Derneği', sub: 'Armatör & Operatör Ağı' },
  { name: 'İMEAK Deniz Ticaret Odası', sub: 'Ulusal Denizcilik Ağı' },
  { name: 'DNV GL Denizcilik Denetimi', sub: 'Akredite Klas Hazırlık' },
  { name: 'RINA Denizcilik Hizmetleri', sub: 'MRV & FuelEU Kontrolü' },
  { name: 'Bureau Veritas Marine', sub: 'THETIS-MRV Teyit Paketi' },
  { name: "Lloyd's Register / ABS", sub: 'IACS Denetim Standardı' },
];

export function MaritimeExperienceMaster() {
  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-16">

      {/* ========================================================================= */}
      {/* 1. BÖLÜM: ACININ MALİYETİ & DENİZCİLİK RİSKLERİ (İYZİCO / N KOLAY NETLİĞİ) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6 pt-6">
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-rose-50/70 p-5 sm:p-10 md:p-12 border-2 border-rose-200 shadow-sm">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-rose-800 border border-rose-200">
              <AlertTriangle className="h-4 w-4 text-rose-700" />
              Denizcilikte Karşılaşılan Gerçek Tehlike
            </span>
            <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              Acının Maliyeti: Eksik Emisyon Dosyasının Armatör ve İhracatçıya Bedeli
            </h2>
            <p className="mt-3 text-sm sm:text-base font-semibold text-slate-700">
              Uyum raporu formalite değildir. Eksik veri geminizin bağlanmasına ve astronomik cezalara yol açar:
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {maritimePainPoints.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border-2 border-rose-200 bg-white p-6 shadow-xs hover:border-rose-400 hover:shadow-md transition"
              >
                <div>
                  <span className="text-[11px] font-black uppercase text-rose-700 tracking-wider block">
                    Kayıp Senaryosu 0{idx + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-black text-[#020b14] leading-snug">
                    {item.title}
                  </h3>
                  <div className="mt-3 inline-block rounded-xl bg-rose-100 px-3 py-1.5 text-xs font-black text-rose-900">
                    {item.riskTag}
                  </div>
                  <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-rose-100">
                  <span className="text-[10px] font-black uppercase text-sky-900 block mb-1">
                    SKDMHesapla Denizcilik Çözümü:
                  </span>
                  <p className="text-xs font-bold text-sky-950 leading-snug">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BÖLÜM (PDF SAYFA 2): HAKKIMIZDA & DENİZCİLİK EKOSİSTEMİ */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-sky-900/20 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">MİSYON &amp; ALTYAPI</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              Hakkımızda &amp; Denizcilik Karar Sistemi
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-sky-900">
            <span className="text-lg">skdmhesapla / denizcilik</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-sky-100 px-2.5 py-1 text-xs text-[#020b14] font-bold border border-sky-300">01</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Sol Kolon: 3 Yumuşak Mavi/Cyan Zeminli Oval Hap Kart */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            <div className="rounded-[2rem] bg-gradient-to-r from-[#ffffff] via-[#ddedfe] to-[#badcfe] p-6 text-[#020b14] shadow-xs border border-sky-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-900 text-white text-[11px] font-black">1</span>
                <span className="text-xs font-black uppercase tracking-wider text-sky-900">Yasal Çerçeve &amp; AB Direktifleri</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">
                Platformumuz, <strong>Direktif (AB) 2023/959 (EU ETS), Tüzük (AB) 2023/957 (MRV) ve Tüzük (AB) 2023/1805 (FuelEU)</strong> kapsamında Türk armatör ve ihracatçılarının deniz ticaretini korumak için geliştirilmiş kurumsal karar altyapısıdır.
              </p>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-r from-[#ffffff] via-[#ddedfe] to-[#badcfe] p-6 text-[#020b14] shadow-xs border border-sky-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-900 text-white text-[11px] font-black">2</span>
                <span className="text-xs font-black uppercase tracking-wider text-sky-900">Armatör &amp; İhracatçı Ayrımı</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">
                Kuru tahminlerle çalışmıyoruz. <strong>Geminiz limanda tutuklanır mı? EUA açığınız sefer başına kaç Euro maliyet yaratır? İhracatçının navlun faturasındaki karbon sürşarjı haklı mı?</strong> Bu sorulara deterministik ve yasal cevap veriyoruz.
              </p>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-r from-[#ffffff] via-[#ddedfe] to-[#badcfe] p-6 text-[#020b14] shadow-xs border border-sky-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-900 text-white text-[11px] font-black">3</span>
                <span className="text-xs font-black uppercase tracking-wider text-sky-900">Uçtan Uca Klas Hazırlığı</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">
                EMSA THETIS-MRV XML, FuelEU Madde 15 kütüğü, BDN veri eşleme, navlun sürşarj simülatörü ve SHA-256 dijital mühür ile <strong>kolay, hızlı ve doğrulanabilir</strong> bir denizcilik kalkanı kuruyoruz.
              </p>
            </div>
          </div>

          {/* Sağ Kolon: Okyanus Laciverti Oval Kart + 12 Logo */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#020b14] via-[#05192d] to-[#082942] p-5 sm:p-8 md:p-9 text-white shadow-xl border border-cyan-500/20">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                Mavi Vatan &amp; AB Sefer Güvencesi
              </span>
              <h3 className="mt-3 text-xl sm:text-2xl font-black leading-snug text-white">
                Yenilikçi karar mimarisiyle Türk denizcilik filosuna rehberlik eden, bağımsız teknik uyum platformudur.
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
                Ambarlı&apos;dan Rotterdam&apos;a, Aliağa&apos;dan Cenova&apos;ya kadar tüm hatlarda gemilerinizin liman yaptırımlarına uğramasını ve ihracatçının navlun mağduriyetini engeller.
              </p>
            </div>

            {/* 12 Beyaz Kurumsal Kutu */}
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {['EU ETS', 'FuelEU', 'THETIS-MRV', 'IACS KLAS', 'DNV HAZIR', 'RINA HAZIR', 'BV HAZIR', 'ABS HAZIR', 'BDN KÜTÜĞÜ', 'SHA-256', '5.000+ GT', '400+ GT'].map((badge, idx) => (
                <div key={idx} className="flex h-11 items-center justify-center rounded-xl bg-white/95 p-2 text-center shadow-xs border border-sky-900/10 hover:bg-white transition">
                  <span className="text-[10px] font-black tracking-tight text-[#020b14]">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BÖLÜM (PDF SAYFA 3): TÜM İHTİYAÇLARINIZ DENİZCİLİK MASASINDA (15 HAP KUTU & MÜHÜR) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-sky-900/20 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">KOMPLE DENİZCİLİK ÇÖZÜMÜ</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              Tüm Denizcilik İhtiyaçlarınız SKDMHesapla’da
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-sky-900">
            <span className="text-lg">skdmhesapla / maritime</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-sky-100 px-2.5 py-1 text-xs text-[#020b14] font-bold border border-sky-300">02</span>
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#f0f7fc] to-white p-4.5 sm:p-8 md:p-9 border-2 border-sky-200 shadow-md">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 rounded-2xl bg-white p-5 border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold text-slate-600">
                <span>Gemi: M/V TÜRK İHRACAT (IMO: 9876543) · 28.500 GT</span>
                <span className="text-emerald-700 font-black flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Klas Denetimine Hazır
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-sm font-black text-slate-900">Sefer: Ambarlı (TR) ➔ Cenova (IT) · 1.250 NM</span>
                <span className="text-2xl font-black text-sky-900">142.8 tCO₂e (%50 Pay)</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-900 border border-sky-200">
                  THETIS-MRV Part A-G .xml
                </span>
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 border border-amber-200">
                  9 Dosyalı Klas İnceleme Paketi
                </span>
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-900 border border-emerald-200">
                  SHA-256 Dijital Mühür
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 via-sky-300 to-blue-600 shadow-2xl ring-4 ring-cyan-300/50">
                <div className="text-center text-slate-950">
                  <Anchor className="mx-auto h-8 w-8 text-sky-950" />
                  <span className="block text-xs font-black uppercase tracking-wider mt-1">DENİZ MÜHRÜ</span>
                  <span className="block text-[9px] font-bold">SHA-256</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {maritimeFifteenNeeds.map((item) => (
              <div
                key={item.no}
                className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border-2 border-sky-200/80 shadow-xs hover:border-sky-600 hover:shadow-sm transition"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e8f4fc] text-xs font-black text-sky-900 border border-sky-200">
                  {item.no}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#020b14] leading-tight">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BÖLÜM (PDF SAYFA 4): TÜM SEFER VE GEMİ TİPLERİNE TAM UYUM (3X3 GRID) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-sky-900/20 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">SEFER VE GEMİ MATRİSİ</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              Tüm Deniz Hatlarına ve Gemi Tiplerine Tam Uyum
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-sky-900">
            <span className="text-lg">skdmhesapla / maritime</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-sky-100 px-2.5 py-1 text-xs text-[#020b14] font-bold border border-sky-300">03</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-5 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-[#ffffff] via-[#ddedfe] to-[#badcfe] p-5 sm:p-8 border-2 border-sky-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">Sıfır Tutuklama Riski</span>
              <h3 className="mt-2 text-2xl font-black text-[#020b14] leading-snug">
                Tüm AB Liman ve Klas Kurallarına Entegre Altyapı
              </h3>
              <p className="mt-4 text-sm font-semibold text-[#020b14]/80 leading-relaxed">
                AB limanlarına tam entegre çalışan sistemimiz ile konteynerden dökme yüke, kimyasal tankerden Ro-Ro&apos;ya kadar tüm filonuz için gecikme riski ve ceza korkusu olmadan resmi klas hazırlık dosyanızı oluşturun.
              </p>
            </div>
            <div className="mt-8 rounded-2xl bg-white p-5 border border-sky-200 shadow-xs">
              <span className="text-xs font-black uppercase tracking-wider text-sky-900">2026 %100 EUA Güvencesi</span>
              <p className="mt-1 text-xs font-bold text-slate-700 leading-relaxed">
                2026 itibarıyla yürürlüğe giren %100 tam teslim ve metan/diazot monoksit genişlemesine anlık uyum sağlayın.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#020b14] via-[#05192d] to-[#082942] p-5 sm:p-8 md:p-9 text-white shadow-xl border border-cyan-500/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 h-full">
              {maritimeSectorGrid.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl bg-white/10 p-4 text-center backdrop-blur-xs border border-white/15 hover:bg-white/20 transition"
                >
                  <div>
                    <span className="text-base font-black text-white block">{sec.name}</span>
                    <span className="text-[11px] font-bold text-cyan-300 mt-1 block">{sec.code}</span>
                  </div>
                  <span className="mt-3 block rounded-lg bg-cyan-500/20 py-1 px-2 text-[10px] font-bold text-cyan-200 border border-cyan-400/20">
                    {sec.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BÖLÜM (PDF SAYFA 5): ALTYAPI VE GÜVENLİK KONTROLLERİ */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-sky-900/20 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">GÜVENLİK PROTOKOLÜ</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              Denizcilik Altyapı ve Güvenlik Kontrolleri
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-sky-900">
            <span className="text-lg">skdmhesapla / maritime</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-sky-100 px-2.5 py-1 text-xs text-[#020b14] font-bold border border-sky-300">04</span>
          </div>
        </div>

        <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-[#020b14] via-[#072138] to-[#020b14] p-5 sm:p-8 md:p-10 text-white shadow-2xl overflow-hidden border border-cyan-500/20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center relative z-10">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 border border-cyan-400/30">
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                Tavizsiz Veri Koruma Protokolü
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white leading-tight">
                Gemi Seferleri, Bunker Faturaları ve Ticari Rotalar Tam Güvende
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-sky-100 font-medium leading-relaxed max-w-2xl">
                Tüm sefer ve BDN verileriniz ISO 27001 ve bankacılık düzeyinde şifrelemeyle korunur. Rakipler, diğer operatörler veya üçüncü şahıslar asla erişemez.
              </p>
            </div>

            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-600 shadow-2xl ring-4 ring-cyan-300/40 animate-pulse">
                <Lock className="h-12 w-12 sm:h-16 sm:w-16 text-slate-950" />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-6 relative z-10">
            {maritimeSecurityCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl bg-white/10 p-4 backdrop-blur-xs border border-white/15 hover:bg-white/20 transition"
                >
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-black shadow-sm mb-2.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-black text-white">{card.title}</h4>
                    <p className="mt-1.5 text-[10.5px] font-medium leading-relaxed text-sky-100/80">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BÖLÜM (PDF SAYFA 7): ARMATÖR-İHRACATÇI SOHBETİ & NAVLUN ANLAŞMASI */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-sky-900/20 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">TİCARİ DİYALOG</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              Armatör &amp; İhracatçı Mutabakatı
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-sky-900">
            <span className="text-lg">skdmhesapla / maritime</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-sky-100 px-2.5 py-1 text-xs text-[#020b14] font-bold border border-sky-300">06</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-2xl font-black text-[#020b14] leading-snug">
              İhtilaflara ve Haksız Navlun Sürşarjlarına Son Verin
            </h3>
            <p className="text-sm font-semibold text-[#020b14]/80 leading-relaxed">
              Armatörler ile yük sahipleri arasındaki en büyük gerginlik &ldquo;ETS Surcharge&rdquo; faturasının doğruluğudur. Şeffaf simülasyon ve resmi formüllerle iki tarafın da hakkını koruyun.
            </p>

            <div className="space-y-2 pt-1">
              {[
                'Kalkış ve varış limanını seçerek sefer mesafesini ve %50 pay kuralını netleştirin.',
                'Yük cinsini (Konteyner TEU, Ro-Ro, Dökme tonaj) girerek gerçek karbon maliyetini görün.',
                'Armatör faturasındaki sürşarj tutarı ile tüzük tavanını tek tıkla kıyaslayın.',
                'Karbon maliyetini fabrika kapısı CBAM beyanına karıştırmadan sözleşmenizi imzalayın.',
              ].map((text, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#ffffff] via-[#ddedfe] to-[#badcfe] p-3 border border-sky-200 shadow-xs"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-900 text-white text-[11px] font-black">
                    ✔
                  </span>
                  <span className="text-xs font-bold text-[#020b14]">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-[2.5rem] bg-gradient-to-br from-[#f0f7fc] to-white p-6 sm:p-9 border-2 border-sky-200 shadow-md">
            <div className="space-y-3.5">
              <div className="rounded-2xl rounded-tl-xs bg-gradient-to-br from-[#ffffff] via-[#e2f0fe] to-[#b9dcfe] text-[#081538] p-4 text-white shadow-sm max-w-[85%] border border-cyan-500/20">
                <span className="block text-[10px] font-black uppercase text-cyan-300 mb-1">Türk İhracatçı (Yük Sahibi):</span>
                <p className="text-xs sm:text-sm font-bold leading-relaxed">
                  &quot;Navlun teklifinizde TEU başına 35€ &apos;ETS Surcharge&apos; görünüyor. Bu tutar resmi Direktif 2023/957 kuralına göre mi hesaplandı? CBAM&apos;e dahil edebilir miyim?&quot;
                </p>
              </div>

              <div className="ml-auto rounded-2xl rounded-tr-xs bg-white p-4 text-[#020b14] shadow-sm border-2 border-sky-200 max-w-[85%]">
                <span className="block text-[10px] font-black uppercase text-sky-900 mb-1">Armatör &amp; Acente (Hat Operatörü):</span>
                <p className="text-xs sm:text-sm font-black leading-relaxed">
                  &quot;Evet, SKDMHesapla Maritime motoru ile doğrulanmıştır. Seferin %50 payı ve 2026 %100 EUA oranı esas alınmıştır. CBAM fabrika kapısında biter, bu bedel navluna aittir.&quot;
                </p>
              </div>

              <div className="pt-2 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black text-emerald-900 border border-emerald-300 shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  Şeffaf Mutabakat · Sıfır İhtilaf &amp; Güvenli Sefer
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BÖLÜM (PDF SAYFA 14): B2B LOJİSTİK VE ACENTE DAĞITIM AĞI */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-sky-900/20 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">B2B LOJİSTİK AĞI</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              B2B Acente &amp; Filo Dağıtım Portalı
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-sky-900">
            <span className="text-lg">skdmhesapla / maritime</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-sky-100 px-2.5 py-1 text-xs text-[#020b14] font-bold border border-sky-300">13</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-[#ffffff] via-[#ddedfe] to-[#badcfe] p-5 sm:p-8 md:p-9 border-2 border-sky-200">
            <h3 className="text-xl sm:text-2xl font-black text-[#020b14] leading-snug">
              Gemi İşletmecileri (DOC) ve Acenteler İçin Çoklu Filo Yönetimi
            </h3>
            <p className="mt-2.5 text-xs sm:text-sm font-semibold text-[#020b14]/80 leading-relaxed">
              Gemi kiralama (charter) firmaları, acenteler ve teknik işletmeciler (DOC holders), yönettikleri tüm filonun THETIS-MRV ve FuelEU dosyalarını tek merkezden hazırlayabilir.
            </p>

            <div className="mt-5 space-y-2">
              {[
                'Çoklu gemi profili yönetimi ve IMO bazında merkezi arşiv.',
                'Bunker teslim belgelerinin (BDN) anında emisyon kütüğüne işlenmesi.',
                'İdareci üye devlet (Administering Authority) bazında otomatik eşleme.',
                'Manuel Excel formülleri yerine IACS klas kurallarına tam uyumlu motor.',
                'Klas denetimi öncesi değişmez SHA-256 dijital snapshot mühürleme.',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#020b14]">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-900 text-white text-[9px] font-black">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2.5 w-full max-w-xs">
              <div className="w-full rounded-2xl bg-gradient-to-br from-[#ffffff] via-[#e2f0fe] to-[#b9dcfe] text-[#081538] p-3.5 text-center text-white font-black text-xs shadow-md flex items-center justify-between px-5 border border-cyan-500/20">
                <span>Gemi İşletmecisi (DOC)</span>
                <span className="rounded-full bg-cyan-400 text-slate-950 font-black px-1.5 py-0.5 text-[10px]">✔</span>
              </div>
              <div className="h-3 w-0.5 bg-sky-700" />
              <div className="w-full rounded-2xl bg-sky-800 p-3.5 text-center text-white font-black text-xs shadow-md flex items-center justify-between px-5">
                <span>Gemi &amp; Sefer (IMO)</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">✔</span>
              </div>
              <div className="h-3 w-0.5 bg-sky-700" />
              <div className="w-full rounded-2xl bg-gradient-to-r from-[#ffffff] via-[#ddedfe] to-[#badcfe] p-3.5 text-center text-[#020b14] font-black text-xs border-2 border-sky-300 shadow-sm flex items-center justify-between px-5">
                <span>Akredite Klas (DNV/RINA/BV)</span>
                <span className="rounded-full bg-sky-900 text-white px-1.5 py-0.5 text-[10px]">✔</span>
              </div>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-sky-300 shadow-xl ring-4 ring-cyan-300/40">
              <Coins className="h-10 w-10 text-slate-950" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BÖLÜM (PDF SAYFA 21): NEDEN SKDMHESAPLA DENİZCİLİK? */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-sky-900/20 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">TERCİH NEDENLERİ</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              Neden SKDMHesapla Denizcilik Portalı
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-sky-900">
            <span className="text-lg">skdmhesapla / maritime</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-sky-100 px-2.5 py-1 text-xs text-[#020b14] font-bold border border-sky-300">20</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4 rounded-[2.5rem] bg-gradient-to-br from-[#020b14] via-[#05192d] to-[#082942] p-7 text-white text-center shadow-xl flex flex-col justify-between min-h-[340px] border border-cyan-500/20">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300">Deniz Ticaretinde Güven</span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Armatör &amp; İhracatçının Ortak Güvencesi
              </h3>
            </div>
            <div className="my-4 rounded-2xl bg-white/10 p-4 backdrop-blur-xs border border-white/15">
              <p className="text-xs font-bold text-sky-100 leading-relaxed">
                Pahalı yabancı danışmanlıklara ve liman ceza risklerine son verin. Filolarınızı güvenle seyrüseferde tutun!
              </p>
            </div>
            <Link
              href="/denizcilik/dosya-hazirla/#form-section"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-cyan-400 text-slate-950 font-black text-xs shadow-md hover:bg-cyan-300 transition"
            >
              Hemen Dosya Hazırla <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-8 space-y-2.5">
            {maritimeWhyUsSeven.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#ffffff] via-[#ddedfe] to-[#badcfe] p-3.5 border border-sky-200 shadow-xs hover:border-sky-600 transition"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffffff] via-[#e2f0fe] to-[#b9dcfe] text-[#081538] text-cyan-300 font-black text-xs shadow-xs mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <strong className="text-xs sm:text-sm font-black text-[#020b14] block">
                    {item.title}
                  </strong>
                  <span className="text-[11px] font-semibold text-slate-700 leading-snug block mt-0.5">
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. BÖLÜM (PDF SAYFA 23): REFERANSLARIMIZ (24 ADET DENİZCİLİK & LİMAN KARTI) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-sky-900/20 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">LİMANLAR &amp; DENİZ HATTI</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              Liman &amp; Denizcilik Çalışma Ekosistemi
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-sky-900">
            <span className="text-lg">skdmhesapla / maritime</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-sky-100 px-2.5 py-1 text-xs text-[#020b14] font-bold border border-sky-300">22</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {maritimeReferences24.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-center rounded-2xl bg-white p-3 text-center border border-sky-100 shadow-xs hover:border-sky-600 hover:shadow-sm transition"
            >
              <span className="block text-xs font-black text-[#020b14] truncate">
                {item.name}
              </span>
              <span className="block text-[9.5px] font-bold text-slate-500 mt-0.5 truncate">
                {item.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. BÖLÜM (PDF SAYFA 24): MÜHENDİSLİK GÜCÜYLE DENİZCİLİK TEK ÇATI ALTINDA! */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-sky-900/20 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">ENTEGRE DENİZCİLİK ÇÖZÜMLERİ</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#020b14] tracking-tight">
              Mühendislik Gücüyle Denizcilik Çözümleri Tek Çatı Altında!
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-sky-900">
            <span className="text-lg">skdmhesapla / maritime</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-sky-100 px-2.5 py-1 text-xs text-[#020b14] font-bold border border-sky-300">23</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-2xl font-black text-sky-900 italic">
              Regülasyon Değişir, Denizcilik Gücümüz Baki Kalır.
            </h3>
            <p className="text-sm font-semibold text-[#020b14] leading-relaxed rounded-[2rem] bg-gradient-to-r from-[#ffffff] via-[#ddedfe] to-[#badcfe] p-6 border-2 border-sky-200">
              Avrupa Birliği denizcilik mevzuatının dönüşümüne öncülük ederken, SKDMHesapla altyapısı yalnızca bir emisyon tablosu sunmaz. Denizcilik mühendisliği disiplini, IACS klas hazırlığı ve kriptografik kanıt altyapısıyla desteklenen bütüncül bir seyrüsefer ekosistemi sağlar. <strong>Bizim için güven bir söylem değil, sistemimizin temelidir.</strong>
            </p>
          </div>

          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[280px] w-full overflow-hidden sm:overflow-visible py-4">
            <div className="relative z-20 flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full bg-gradient-to-br from-[#05192d] to-[#020b14] text-white shadow-2xl ring-8 ring-sky-200 border-2 border-cyan-400/40">
              <div className="text-center font-black text-lg sm:text-xl leading-tight">
                skdm<span className="text-cyan-400">denizcilik</span>
              </div>
            </div>

            <div className="absolute -top-1 left-6 z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#bae6fd] text-[#020b14] font-black text-[11px] text-center shadow-md border border-sky-300">
              EMSA<br />THETIS-MRV
            </div>

            <div className="absolute -bottom-1 right-6 z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#c7d2fe] text-[#020b14] font-black text-[11px] text-center shadow-md border border-indigo-300">
              AKREDİTE<br />KLAS
            </div>

            <div className="absolute top-6 right-4 z-10 flex h-18 w-18 sm:h-22 sm:w-22 items-center justify-center rounded-full bg-[#a5f3fc] text-[#020b14] font-black text-[10px] text-center shadow-md border border-cyan-400">
              FUELEU<br />MARITIME
            </div>

            <div className="absolute bottom-6 left-4 z-10 flex h-18 w-18 sm:h-22 sm:w-22 items-center justify-center rounded-full bg-[#e0f2fe] text-[#020b14] font-black text-[10px] text-center shadow-md border border-sky-300">
              LİMAN<br />OTORİTESİ
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. BÖLÜM (PDF SAYFA 25): TEŞEKKÜRLER & İLETİŞİM */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#020b14] via-[#05192d] to-[#082942] p-5 sm:p-10 md:p-12 text-white shadow-2xl text-center border border-cyan-500/20">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Teşekkürler
          </h2>
          <p className="mt-2.5 text-sm sm:text-base font-semibold text-sky-100 max-w-xl mx-auto">
            Türk deniz ticaretinin Avrupa sularındaki rekabet gücünü ve seyrüsefer özgürlüğünü birlikte koruyoruz.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-bold text-cyan-200">
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/20">🌐 skdmhesapla.com/denizcilik</span>
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/20">✉️ info@skdmhesapla.com</span>
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/20">🇹🇷 Türkiye Geneli Liman &amp; Gemi Uyum Altyapısı</span>
          </div>

          <div className="mt-7 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/denizcilik/dosya-hazirla/#form-section"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-cyan-400 text-slate-950 px-8 text-sm font-black shadow-lg hover:bg-cyan-300 transition"
            >
              Klas Denetim Paketini Hazırla (599 USD) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
