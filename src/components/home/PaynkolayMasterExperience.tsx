import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Coins,
  FileCheck,
  FileSpreadsheet,
  Lock,
  Scale,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from 'lucide-react';

// Acının Maliyeti (Iyzico / N Kolay Netliği)
const painPoints = [
  {
    title: 'Gümrükte Sipariş İptali & Blokaj',
    riskTag: 'Gecikme Başına 10.000€ - 50.000€ Ceza',
    desc: 'AB gümrüğünde eksik veya hatalı emisyon beyanı, malın limanda rehin kalmasına ve alıcının siparişi derhal iptal etmesine yol açar.',
    solution: 'Resmi tüzük parametreleriyle 15 dakikada sıfır riskli karar dosyası.',
  },
  {
    title: 'Varsayılan Ceza Katsayısı (Default Values)',
    riskTag: 'Ton Başına +40€ ile +100€ Fazladan Vergi',
    desc: 'Fabrika verisi yerine Komisyonun cezai varsayılan katsayıları kullanılırsa, ton başına astronomik karbon vergisi ödenir.',
    solution: 'Gerçek proses ve enerji verinizi eşleyerek fazladan karbon faturasını sıfırlar.',
  },
  {
    title: 'Banka Kredi Limitinde %30 Daralma',
    riskTag: 'Kredi Komitesi & Yeşil Finansman Reddi',
    desc: 'Bankalar sürdürülebilirlik karnesi ve CBAM izi olmayan sanayicilerin yatırım kredisi limitlerini aşağı çeker.',
    solution: 'Bankaların ve denetçilerin doğrudan onaylayacağı ISO 14064 uyumlu kanıt seti.',
  },
];

// 15 Hap Karar Maddesi
const fifteenNeeds = [
  { no: '01', title: 'Resmi AB Communication Template (.xlsx)' },
  { no: '02', title: '15 Dakikada Kesin Karar & Risk Raporu' },
  { no: '03', title: '569 GTİP Kodu Kapsam & Muafiyet Tespiti' },
  { no: '04', title: 'Gümrük Blokajı & Sipariş İptal Koruma Kalkanı' },
  { no: '05', title: '6 CBAM Sektörü (Demir-Çelik, Alüminyum, Çimento...)' },
  { no: '06', title: 'B2B Gümrük Müşaviri & Partner Dağıtım Ağı' },
  { no: '07', title: 'Kapsam 1 Doğrudan Emisyon (Fırın & Proses Hesabı)' },
  { no: '08', title: 'Kapsam 2 Dolaylı Emisyon (Şebeke Elektrik Faktörü)' },
  { no: '09', title: 'Öncül Madde (Precursor) Karmaşık Zincir Çözümü' },
  { no: '10', title: 'Danışmansız, Sıfır Ek Masraflı Self-Servis Süreç' },
  { no: '11', title: '12 Dosyalı Akredite Denetçi & Alıcı Kanıt Paketi' },
  { no: '12', title: 'SHA-256 Değiştirilemez Kriptografik Dijital Mühür' },
  { no: '13', title: 'Otomatik Fatura, Tüketim & Üretim Eşleme Motoru' },
  { no: '14', title: 'Çoklu Tesis & Tedarikçi SEE Karbon Veri Toplama' },
  { no: '15', title: 'Gümrük Beyanında %100 Yasal Kabul & Sıfır Ceza' },
];

// Sektörel Karar Tablosu
const sectorGrid = [
  { name: 'Demir & Çelik', code: '7201 - 7326', risk: 'Fırın & Ark Ocağı Yüksek Risk' },
  { name: 'Alüminyum Hadde', code: '7601 - 7616', risk: 'Elektroliz Kapsam 2 Cezası' },
  { name: 'Çimento & Klinker', code: '2523 10 00', risk: 'Kalsinasyon Proses İzi' },
  { name: 'Gübre Sanayii', code: '2808 - 3105', risk: 'N2O ve Amonyak Reaksiyonu' },
  { name: 'Elektrik Üretimi', code: '2716 00 00', risk: 'Enterkonneksiyon Şebeke İletimi' },
  { name: 'Hidrojen Tesisleri', code: '2804 10 00', risk: 'SMR Buhar Reformlama İzi' },
  { name: 'Haddehane & Ark Ocağı', code: 'Kütük & Rulo Sac', risk: 'Yassı & Uzun Çelik İmalatı' },
  { name: 'Döküm & Ekstrüzyon', code: 'Mimari & Sanayi Profil', risk: 'Billet & Termal Çözümler' },
  { name: 'Downstream İmalat', code: 'Civata, Tel & Bağlantı', risk: 'İşlenmiş Nihai Ürünler' },
];

// 6 Altyapı Güvenlik Kartı
const securityCards = [
  {
    icon: Lock,
    title: 'Ticari Sır & Veri Zırhı',
    desc: 'Fabrikanızın üretim reçeteleri, maliyetleri ve enerji tüketimi bankacılık seviyesinde şifrelenir; rakiplerle asla paylaşılmaz.',
  },
  {
    icon: ShieldCheck,
    title: 'ISO 27001 & SOC-2',
    desc: 'Büyük sanayi kuruluşları ve kurumsal ihracatçılar için uluslararası düzeyde doğrulanmış bilgi güvenliği standardı.',
  },
  {
    icon: FileCheck,
    title: 'Resmi Komisyon Şablonu',
    desc: 'Raporlama doğrudan Avrupa Komisyonu resmi Communication Template formatında üretilir; AB gümrüklerinde sorgusuz geçer.',
  },
  {
    icon: Zap,
    title: '7/24 Mevzuat & Ceza Takibi',
    desc: 'AB 2023/956 ve 2025/2547 tüzük değişikliklerini anlık tarar; ihracatçıyı ceza risklerine karşı önceden uyarır.',
  },
  {
    icon: Scale,
    title: 'Deterministik Kural Motoru',
    desc: 'Yapay zeka varsayımları veya tahminlerle değil; AB tüzüğünün kesin matematiksel ve kimyasal formülleriyle çalışır.',
  },
  {
    icon: Server,
    title: 'SHA-256 Dijital Mühür',
    desc: 'Üretilen her dosya SHA-256 hash imzasıyla mühürlenir; denetçi ve alıcı nezdinde yasal kanıt niteliği kazanır.',
  },
];

// 1'den 7'ye Tercih Nedenleri
const whyUsSeven = [
  {
    title: 'Sıfır Gümrük Riski ve Kesintisiz İhracat:',
    desc: 'AB alıcınızın malı gümrükte reddetmesini veya ton başına 100€ ceza ödemesini kesin olarak engelleyen yasal karar altyapısı.',
  },
  {
    title: 'Resmi AB Communication Template (.xlsx):',
    desc: 'Komisyonun güncel formatıyla birebir uyumlu; alıcınızın sistemine tek tıkla yükleyebileceği hazır çalışma dosyası.',
  },
  {
    title: '15 Dakikada Tamamlanan Self-Servis Süreç:',
    desc: 'Aylarca süren pahalı danışmanlık süreçlerine son verin; fabrikanızın verilerini girin, dosyanızı aynı oturumda teslim alın.',
  },
  {
    title: '12 Parçalı Akredite Denetçi & Alıcı Arşivi:',
    desc: 'Yalnızca tek bir özet değil; hesap izi, izleme planı, precursor kütüğü ve kanıt belgelerini içeren eksiksiz denetim paketi.',
  },
  {
    title: 'SHA-256 Değiştirilemez Kriptografik Güvence:',
    desc: 'Her teslim paketi dijital mühürle kilitlenir; verilerinizin doğruluğu ve bütünlüğü uluslararası denetçilerce kanıtlanır.',
  },
  {
    title: 'B2B Gümrük Müşaviri Dağıtım Ağı:',
    desc: 'Gümrük müşavirleri ve danışmanlar için çoklu müşteri yönetimi, alt bayi altyapısı ve kurumsal gelir ortaklığı modeli.',
  },
  {
    title: 'Tedarikçi SEE Karbon Veri Toplama Portalı:',
    desc: 'Girdilerinizin (hurda, kütük, kimyasal) tedarikçilerinden standart emisyon verisi toplayarak karmaşık zinciri çözer.',
  },
];

// 24 Sanayi Referansı
const references24 = [
  { name: 'Çolakoğlu Metalurji', sub: 'Haddehane & Ark Ocağı' },
  { name: 'Diler Demir Çelik', sub: 'İnşaat Demiri & Kütük' },
  { name: 'Kroman Çelik Sanayii', sub: 'Profil & Filmaşin' },
  { name: 'Tosyalı Holding', sub: 'Boru & Rulo Sac' },
  { name: 'İçdaş Çelik Enerji', sub: 'Yüksek Fırın & Enerji' },
  { name: 'Kaptan Demir Çelik', sub: 'Kütük & Çelik Hasır' },
  { name: 'Assan Alüminyum', sub: 'Yassı Hadde & Folyo' },
  { name: 'Asaş Alüminyum', sub: 'Mimari & Sanayi Profil' },
  { name: 'Teknik Alüminyum', sub: 'Levha & Rulo Döküm' },
  { name: 'Akpa Alüminyum', sub: 'Kompozit & Profil' },
  { name: 'Akçansa Çimento', sub: 'Gri Çimento & Klinker' },
  { name: 'Çimsa Beyaz Çimento', sub: 'Beyaz Çimento & Kalsiyum' },
  { name: 'Nuh Çimento Sanayii', sub: 'Klinker & Özel Çimento' },
  { name: 'Toros Tarım & Gübre', sub: 'Üre, Amonyak & Kompoze' },
  { name: 'İgsaş Gübre Sanayii', sub: 'Azotlu & Sıvı Gübre' },
  { name: 'Gübretaş Tedarik Zinciri', sub: 'Fosfatlı & Kimyasal' },
  { name: 'Yetkilendirilmiş Müşavirler', sub: '35+ Gümrük Ofisi' },
  { name: 'İMMİB İhracatçı Birlikleri', sub: 'Metal & Maden Ağı' },
  { name: 'Uluslararası Dış Ticaret', sub: 'AB Gümrükleme Hattı' },
  { name: 'Arkas & Turkon Lojistik', sub: 'EU MRV & ETS Uyumlu' },
  { name: 'Almanya & İtalya Alıcıları', sub: 'EU Declarants Ağı' },
  { name: 'ISO 14064 / 14065 Denetimi', sub: 'Akredite Hazırlık' },
  { name: 'Marmara Sanayi Kümesi', sub: 'Organize Sanayi Devleri' },
  { name: 'Ege & Çukurova Üreticileri', sub: 'İhracatçı Sanayi Tesisleri' },
];

export function PaynkolayMasterExperience() {
  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-16">

      {/* ========================================================================= */}
      {/* 1. BÖLÜM: ACININ MALİYETİ & FİNANSAL TEHLİKE (İYZİCO / N KOLAY NETLİĞİ) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6 pt-4">
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-rose-50/60 p-5 sm:p-10 md:p-12 border-2 border-rose-200 pk-card-plain">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-rose-800 border border-rose-200">
              <AlertTriangle className="h-4 w-4 text-rose-700" />
              Sanayicinin Karşılaştığı Gerçek Tehlike
            </span>
            <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Acının Maliyeti: Yanlış veya Eksik Raporun Şirketinize Bedeli
            </h2>
            <p className="mt-3 text-sm sm:text-base font-semibold text-slate-700">
              Rapor hazırlamak bir formalite değildir. Yanlış hesap veya gecikme doğrudan şirketinizin kasasını vurur:
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {painPoints.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border-2 border-rose-200 bg-white p-6 shadow-xs hover:border-rose-400 hover:shadow-md transition"
              >
                <div>
                  <span className="text-[11px] font-black uppercase text-rose-700 tracking-wider block">
                    Kayıp Senaryosu 0{idx + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-black text-[#0f172a] leading-snug">
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
                  <span className="text-[10px] font-black uppercase text-[#0a1fc8] block mb-1">
                    SKDMHesapla Karar Çözümü:
                  </span>
                  <p className="text-xs font-bold text-[#0f172a] leading-snug">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BÖLÜM (PDF SAYFA 2): HAKKIMIZDA & EKOSİSTEM (SOLDA 3 ZÜMRÜT HAP, SAĞDA ORMAN YEŞİLİ DEV KART + 12 LOGO) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0a1fc8]/15 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">MİSYON &amp; ALTYAPI</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Hakkımızda &amp; Karar Sistemi
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#0a1fc8]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#e0e7ff] px-2.5 py-1 text-xs text-[#0f172a] font-bold border border-[#0a1fc8]/15">01</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Sol Kolon: 3 Yumuşak Zümrüt Zeminli Oval Hap Kart */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 text-[#0f172a] shadow-xs border border-blue-100 pk-card">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0a1fc8] text-white text-[11px] font-black">1</span>
                <span className="text-xs font-black uppercase tracking-wider text-[#0a1fc8]">Yasal Çerçeve &amp; Güvence</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">
                SKDMHesapla, <strong>Avrupa Komisyonu (EU) 2023/956 ve 2025/2547 Tüzükleri</strong> kapsamında Türk sanayicisinin ihracatını korumak için geliştirilmiş kurumsal karbon karar ve risk önleme altyapısıdır.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#f8fafc] p-6 text-[#0f172a] shadow-xs border border-blue-100 pk-card">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0a1fc8] text-white text-[11px] font-black">2</span>
                <span className="text-xs font-black uppercase tracking-wider text-[#0a1fc8]">Karar ve Risk Sistemi</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">
                Biz sadece statik bir rapor üretmiyoruz. <strong>Ürününüz gümrükte takılır mı? AB alıcınız cezayla karşılaşır mı? Hangi katsayı ton başına kaç Euro tasarruf sağlar?</strong> Bu soruların kesin ve yasal cevabını 15 dakikada veriyoruz.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#f8fafc] p-6 text-[#0f172a] shadow-xs border border-blue-100 pk-card">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0a1fc8] text-white text-[11px] font-black">3</span>
                <span className="text-xs font-black uppercase tracking-wider text-[#0a1fc8]">Uçtan Uca B2B Dağıtım</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">
                569 GTİP kodu, B2B gümrük müşaviri dağıtım ağı, Kapsam 1-2 emisyon hesabı, Precursor takibi, Communication Template (.xlsx) ve SHA-256 mühürleme ile <strong>kolay, hızlı ve güvenli</strong> bir ihracat kalkanı kuruyoruz.
              </p>
            </div>
          </div>

          {/* Sağ Kolon: Çok Açık Mavi & Elit Pastel Kart + 12 Logo */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#eff6ff] via-[#dbeafe] to-[#e0e7ff] p-5 sm:p-8 md:p-9 text-[#0f172a] shadow-lg border-2 border-blue-200">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0a1fc8] border border-blue-200 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0a1fc8]" />
                Ulusal İhracat Güvencesi
              </span>
              <h3 className="mt-3 text-xl sm:text-2xl font-black leading-snug text-[#0a1fc8]">
                Yenilikçi karar mimarisiyle Türk sanayicisine rehberlik eden, sektörünün öncü CBAM teknoloji kuruluşudur.
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                Gümrük kapılarından fabrika ocaklarına, tedarikçi zincirinden akredite denetimlere kadar 6 temel sektörde ihracatınızın kesintiye uğramasını engeller.
              </p>
            </div>

            {/* 12 Beyaz Kurumsal Kutu */}
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {['SKDMHesapla', 'EU CBAM', 'TÜRKAK', 'YGM AĞI', 'İMMİB', 'TİM', 'ISO 27001', 'ISO 14064', 'SHA-256', 'GÜMRÜK', 'HADDEHANE', 'PRECURSOR'].map((badge, idx) => (
                <div key={idx} className="flex h-11 items-center justify-center rounded-xl bg-white p-2 text-center shadow-xs border border-blue-200 hover:border-[#0a1fc8] transition">
                  <span className="text-[10px] font-black tracking-tight text-[#0a1fc8]">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BÖLÜM (PDF SAYFA 3): TÜM İHTİYAÇLARINIZ SKDMHESAPLA'DA (15 HAP KUTU & MÜHÜR) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0a1fc8]/15 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">KOMPLE ÇÖZÜM SETİ</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Tüm İhtiyaçlarınız SKDMHesapla’da
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#0a1fc8]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#e0e7ff] px-2.5 py-1 text-xs text-[#0f172a] font-bold border border-[#0a1fc8]/15">02</span>
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#eef7f1] to-white p-4.5 sm:p-8 md:p-9 border-2 border-blue-100 shadow-md">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold text-slate-600">
                <span>Tesis: Türk İhracatçı Sanayi A.Ş. (Dilovası / Kocaeli)</span>
                <span className="text-[#0a1fc8] font-black flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Doğrulamaya Hazır
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-sm font-black text-slate-900">Sıcak Haddelenmiş Çelik Profil (GTİP: 7208 39 00)</span>
                <span className="text-2xl font-black text-[#0a1fc8]">1.428 tCO₂e / ton</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#0f172a] border border-blue-100">
                  Communication Template .xlsx
                </span>
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 border border-amber-200">
                  12 Dosyalı Denetim Paketi
                </span>
                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-800 border border-slate-200">
                  SHA-256 Dijital Mühür
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-2xl ring-4 ring-amber-300/50">
                <div className="text-center text-amber-950">
                  <Coins className="mx-auto h-8 w-8 text-amber-900" />
                  <span className="block text-xs font-black uppercase tracking-wider mt-1">RESMİ MÜHÜR</span>
                  <span className="block text-[9px] font-bold">SHA-256</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fifteenNeeds.map((item) => (
              <div
                key={item.no}
                className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border-2 border-blue-100 shadow-xs hover:border-[#0a1fc8] hover:shadow-sm transition pk-pill"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f8fafc] text-xs font-black text-[#0a1fc8] border border-blue-100">
                  {item.no}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0f172a] leading-tight">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BÖLÜM (PDF SAYFA 4): TÜM SEKTÖRLERE %100 UYUM (3X3 GRID) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0a1fc8]/15 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">SEKTÖREL KAPSAM</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Tüm SKDM Sektörlerine Tam Uyum
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#0a1fc8]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#e0e7ff] px-2.5 py-1 text-xs text-[#0f172a] font-bold border border-[#0a1fc8]/15">03</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-5 rounded-3xl sm:rounded-[2.5rem] bg-[#f8fafc] p-5 sm:p-8 border-2 border-blue-100 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">Sıfır Gümrük Riski</span>
              <h3 className="mt-2 text-2xl font-black text-[#0f172a] leading-snug">
                Tüm AB Gümrük ve Sektör Kurallarına Entegre Altyapı
              </h3>
              <p className="mt-4 text-sm font-semibold text-[#0f172a]/80 leading-relaxed">
                AB gümrüklerine tam entegre çalışan SKDMHesapla ile çelikten alüminyuma, gübreden çimentoya kadar tüm sektörleriniz için gecikme riski ve ceza korkusu olmadan anında resmi onaylı dosya hazırlayın.
              </p>
            </div>
            <div className="mt-8 rounded-2xl bg-white p-5 border border-blue-100 shadow-xs">
              <span className="text-xs font-black uppercase tracking-wider text-[#0a1fc8]">Dinamik Katsayı Güvencesi</span>
              <p className="mt-1 text-xs font-bold text-slate-700 leading-relaxed">
                Tüm sektörlerin katsayı ve kural güncellemelerinden (2025/2547 tüzüğü) eşzamanlı yararlanabilir, siparişlerinizi riske atmadan teslim edebilirsiniz.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#eff6ff] via-[#dbeafe] to-[#e0e7ff] p-5 sm:p-8 md:p-9 text-[#0f172a] shadow-lg border-2 border-blue-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 h-full">
              {sectorGrid.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl bg-white p-4 text-center border border-blue-200 shadow-xs hover:border-[#0a1fc8] hover:shadow-md transition"
                >
                  <div>
                    <span className="text-base font-black text-[#0f172a] block">{sec.name}</span>
                    <span className="text-[11px] font-bold text-[#0a1fc8] mt-1 block">{sec.code}</span>
                  </div>
                  <span className="mt-3 block rounded-lg bg-blue-50 py-1 px-2 text-[10px] font-black text-[#0a1fc8] border border-blue-200">
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
        <div className="flex items-center justify-between border-b-2 border-[#0a1fc8]/15 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">GÜVENLİK PROTOKOLÜ</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Altyapı ve Güvenlik Kontrolleri
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#0a1fc8]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#e0e7ff] px-2.5 py-1 text-xs text-[#0f172a] font-bold border border-[#0a1fc8]/15">04</span>
          </div>
        </div>

        <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#eff6ff] via-[#dbeafe] to-[#e0e7ff] p-5 sm:p-8 md:p-10 text-[#0f172a] shadow-lg overflow-hidden border-2 border-blue-200">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center relative z-10">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-900 border border-amber-300 shadow-xs">
                <Lock className="h-3.5 w-3.5 text-amber-700" />
                Tavizsiz Güvenlik Protokolü
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-black text-[#0a1fc8] leading-tight">
                Fabrikanızın Ticari Sırları ve Emisyon Verileri Tam Güvende
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed max-w-2xl">
                Tüm verileriniz kurumsal AB sunucularında ISO 27001 ve bankacılık düzeyinde şifrelemeyle korunmaktadır. Rakipleriniz veya üçüncü şahıslar asla erişemez.
              </p>
            </div>

            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-200 to-amber-600 shadow-xl ring-4 ring-amber-300/40 animate-pulse">
                <Lock className="h-12 w-12 sm:h-16 sm:w-16 text-amber-950" />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-6 relative z-10">
            {securityCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl bg-white p-4 border border-blue-200 shadow-xs hover:border-[#0a1fc8] hover:shadow-md transition"
                >
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-amber-950 font-black shadow-sm mb-2.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-black text-[#0f172a]">{card.title}</h4>
                    <p className="mt-1.5 text-[10.5px] font-medium leading-relaxed text-slate-600">
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
      {/* 6. BÖLÜM (PDF SAYFA 7): ALICI-İHRACATÇI SOHBETİ & LİNK İLE TESLİMAT */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0a1fc8]/15 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">ALICI İLİŞKİSİ</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Link ve Şablon ile Kolay Teslimat
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#0a1fc8]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#e0e7ff] px-2.5 py-1 text-xs text-[#0f172a] font-bold border border-[#0a1fc8]/15">06</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-2xl font-black text-[#0f172a] leading-snug">
              Danışmana veya Karmaşık Tablolara Boğulmadan Alıcınıza Dosya İletin
            </h3>
            <p className="text-sm font-semibold text-[#0f172a]/80 leading-relaxed">
              Avrupalı alıcınızın talep ettiği resmi emisyon verisini iletmenin en hızlı yolu SKDMHesapla. Tek tıkla resmi şablonu oluşturun ve gümrük beyanı için alıcınızla güvenle paylaşın.
            </p>

            <div className="space-y-2 pt-1">
              {[
                'İhraç ettiğiniz ürünün GTİP kodunu seçerek kapsam ve muafiyet durumunu netleştirin.',
                'Tesisinizin elektrik, yakıt ve üretim tonajı verilerini rehberli alana girin.',
                'Avrupa Komisyonu formatındaki resmi Communication Template dosyanız anında hazır olsun.',
                'Tek tıkla alıcınıza, gümrük müşavirinize ve akredite denetçiye teslim edin.',
              ].map((text, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-2xl bg-[#f8fafc] p-3 border border-blue-100 shadow-xs"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0a1fc8] text-white text-[11px] font-black">
                    ✔
                  </span>
                  <span className="text-xs font-bold text-[#0f172a]">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-[2.5rem] bg-gradient-to-br from-[#eef7f1] to-white p-6 sm:p-9 border-2 border-blue-100 shadow-md">
            <div className="space-y-3.5">
              <div className="rounded-2xl rounded-tl-xs bg-[#eff6ff] p-4 text-[#0f172a] shadow-sm max-w-[85%] border border-blue-200">
                <span className="block text-[10px] font-black uppercase text-indigo-200 mb-1">Avrupalı İthalatçı (Almanya / İtalya):</span>
                <p className="text-xs sm:text-sm font-bold leading-relaxed">
                  &quot;Merhaba, son sevkiyatımız için resmi CBAM raporunu ve Communication Template dosyasını gönderebilir misiniz? Gümrük beyan süremiz doluyor.&quot;
                </p>
              </div>

              <div className="ml-auto rounded-2xl rounded-tr-xs bg-white p-4 text-[#0f172a] shadow-sm border-2 border-blue-100 max-w-[85%]">
                <span className="block text-[10px] font-black uppercase text-[#0a1fc8] mb-1">Türk İhracatçı (Siz):</span>
                <p className="text-xs sm:text-sm font-black leading-relaxed">
                  &quot;Tabii ki, dosyanız hazır! SKDMHesapla ile AB 2025/2547 resmi formülleri ve SHA-256 dijital mührüyle oluşturuldu. İndirme linki ektedir.&quot;
                </p>
              </div>

              <div className="pt-2 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-black text-[#0f172a] border border-blue-200 shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-[#0a1fc8]" />
                  Dosya Teslimi Başarılı · Gümrükte Sıfır Ceza Riski
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BÖLÜM (PDF SAYFA 14): B2B GÜMRÜK MÜŞAVİRİ DAĞITIM AĞI */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0a1fc8]/15 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">B2B DAĞITIM AĞI</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              B2B Gümrük Müşaviri Dağıtım Ağı
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#0a1fc8]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#e0e7ff] px-2.5 py-1 text-xs text-[#0f172a] font-bold border border-[#0a1fc8]/15">13</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 rounded-3xl sm:rounded-[2.5rem] bg-[#f8fafc] p-5 sm:p-8 md:p-9 border-2 border-blue-100">
            <h3 className="text-xl sm:text-2xl font-black text-[#0f172a] leading-snug">
              SKDMHesapla Dağıtım Sistemi ile Bayi - Alt Bayi Kırılımında Yönetim
            </h3>
            <p className="mt-2.5 text-xs sm:text-sm font-semibold text-[#0f172a]/80 leading-relaxed">
              Gümrük müşavirlikleri ve danışmanlık firmaları, kendi müşteri portföylerinin tüm CBAM dosyalarını tek merkezden üretebilir, müşteri ilişkisini koruyarak ek gelir akışı yaratabilir.
            </p>

            <div className="mt-5 space-y-2">
              {[
                'Müşteri ilişkisi tamamen sizde kalır, doğrudan satış yapılmaz.',
                'Ana bayi ve alt bayi kırılımında çoklu fabrika yönetimi.',
                'Müşteri ve fabrika bazında anlık özet ve risk kontrol paneli.',
                'Tekrarlayan manuel Excel operasyonu yerine otomatik motor.',
                'Resmi formatta toplu arşivleme ve SHA-256 dijital güvence.',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0f172a]">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0a1fc8] text-white text-[9px] font-black">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2.5 w-full max-w-xs">
              <div className="w-full rounded-2xl bg-[#eff6ff] p-3.5 text-center text-[#0a1fc8] font-black text-xs shadow-sm flex items-center justify-between px-5 border border-blue-200">
                <span>Gümrük Müşaviri</span>
                <span className="rounded-full bg-indigo-300 text-slate-950 font-black px-1.5 py-0.5 text-[10px]">✔</span>
              </div>
              <div className="h-3 w-0.5 bg-[#0a1fc8]" />
              <div className="w-full rounded-2xl bg-white p-3.5 text-center text-[#0a1fc8] font-black text-xs shadow-sm flex items-center justify-between px-5 border border-blue-200">
                <span>İhracatçı Fabrika</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">✔</span>
              </div>
              <div className="h-3 w-0.5 bg-[#0a1fc8]" />
              <div className="w-full rounded-2xl bg-[#f8fafc] p-3.5 text-center text-[#0f172a] font-black text-xs border-2 border-blue-200 shadow-sm flex items-center justify-between px-5">
                <span>AB Alıcısı &amp; Gümrük</span>
                <span className="rounded-full bg-[#0a1fc8] text-white px-1.5 py-0.5 text-[10px]">✔</span>
              </div>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-xl ring-4 ring-amber-300/40">
              <Coins className="h-10 w-10 text-amber-950" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BÖLÜM (PDF SAYFA 21): NEDEN SKDMHESAPLA? */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0a1fc8]/15 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">TERCİH NEDENLERİ</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Neden SKDMHesapla
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#0a1fc8]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#e0e7ff] px-2.5 py-1 text-xs text-[#0f172a] font-bold border border-[#0a1fc8]/15">20</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4 rounded-[2.5rem] bg-gradient-to-br from-[#eff6ff] via-[#dbeafe] to-[#e0e7ff] p-7 text-[#0f172a] text-center shadow-lg flex flex-col justify-between min-h-[340px] border-2 border-blue-200">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#0a1fc8]">İhracatta Güven</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0a1fc8] leading-tight">
                Sanayici &amp; İhracatçının Kesin Karar Sistemi
              </h3>
            </div>
            <div className="my-4 rounded-2xl bg-white p-4 border border-blue-200 shadow-xs">
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                Pahalı danışmanlıklara ve cezai gecikmelere son verin. İşletmenizi güvenle geleceğe taşıyın!
              </p>
            </div>
            <Link
              href="/basla/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#1030e0] hover:bg-[#0a1fc8] text-white font-black text-xs shadow-md transition pk-btn-primary"
            >
              Hemen Başla <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-8 space-y-2.5">
            {whyUsSeven.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-2xl bg-[#f8fafc] p-3.5 border border-blue-100 shadow-xs hover:border-[#0a1fc8] transition pk-pill"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#0a1fc8] text-indigo-200 font-black text-xs shadow-xs mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <strong className="text-xs sm:text-sm font-black text-[#0f172a] block">
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
      {/* 9. BÖLÜM (PDF SAYFA 23): REFERANSLARIMIZ (24 ADET KART) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0a1fc8]/15 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">SANAYİ DEVLERİ &amp; İHRACAT</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Referanslarımız &amp; Çalışma Ekosistemi
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#0a1fc8]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#e0e7ff] px-2.5 py-1 text-xs text-[#0f172a] font-bold border border-[#0a1fc8]/15">22</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {references24.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-center rounded-2xl bg-white p-3 text-center border border-slate-100 shadow-xs hover:border-[#0a1fc8] hover:shadow-sm transition"
            >
              <span className="block text-xs font-black text-[#0f172a] truncate">
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
      {/* 10. BÖLÜM (PDF SAYFA 24): MÜHENDİSLİK GÜCÜYLE TEK ÇATI ALTINDA! */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0a1fc8]/15 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a1fc8]">ENTEGRE DİJİTAL ÇÖZÜMLER</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              Mühendislik Gücüyle Dijital Çözümler Tek Çatı Altında!
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#0a1fc8]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#e0e7ff] px-2.5 py-1 text-xs text-[#0f172a] font-bold border border-[#0a1fc8]/15">23</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-2xl font-black text-[#0a1fc8] italic">
              Mevzuat Değişir, Bizim Gücümüz Baki Kalır.
            </h3>
            <p className="text-sm font-semibold text-[#0f172a] leading-relaxed rounded-[2rem] bg-[#f8fafc] p-6 border-2 border-blue-100">
              Avrupa Birliği standartlarının dönüşümüne öncülük ederken, SKDMHesapla altyapısı yalnızca bir hesaplama aracı sunmaz. Mühendislik disiplini, güçlü regülasyon güvencesi ve sürdürülebilir teknoloji altyapısıyla desteklenen bütüncül bir ihracat ekosistemi sağlar. <strong>Bizim için güven bir söylem değil, sistemimizin temelidir.</strong>
            </p>
          </div>

          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[280px] w-full overflow-hidden sm:overflow-visible py-4">
            <div className="relative z-20 flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1fc8] to-[#050d4a] text-white shadow-2xl ring-8 ring-blue-200 border-2 border-blue-400/30">
              <div className="text-center font-black text-lg sm:text-xl leading-tight">
                skdm<span className="text-indigo-300">hesapla</span>
              </div>
            </div>

            <div className="absolute -top-1 left-6 z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#dbeafe] text-[#0f172a] font-black text-[11px] text-center shadow-md border border-blue-200">
              AB CBAM<br />PORTALI
            </div>

            <div className="absolute -bottom-1 right-6 z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#e0e7ff] text-[#0f172a] font-black text-[11px] text-center shadow-md border border-blue-200">
              GÜMRÜK<br />MÜŞAVİRİ
            </div>

            <div className="absolute top-6 right-4 z-10 flex h-18 w-18 sm:h-22 sm:w-22 items-center justify-center rounded-full bg-[#c7d2fe] text-[#0f172a] font-black text-[10px] text-center shadow-md border border-emerald-400">
              AKREDİTE<br />DENETÇİ
            </div>

            <div className="absolute bottom-6 left-4 z-10 flex h-18 w-18 sm:h-22 sm:w-22 items-center justify-center rounded-full bg-[#ede9fe] text-[#0f172a] font-black text-[10px] text-center shadow-md border border-blue-200">
              İHRACATÇI<br />BİRLİĞİ
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. BÖLÜM (PDF SAYFA 25): TEŞEKKÜRLER & İLETİŞİM */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#eff6ff] via-[#dbeafe] to-[#e0e7ff] p-5 sm:p-10 md:p-12 text-[#0f172a] shadow-xl text-center border-2 border-blue-200">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0a1fc8]">
            Teşekkürler
          </h2>
          <p className="mt-2.5 text-sm sm:text-base font-semibold text-slate-700 max-w-xl mx-auto">
            Türk ihracatçısının Avrupa pazarındaki rekabet gücünü birlikte koruyoruz.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-bold text-[#0a1fc8]">
            <span className="rounded-full bg-white px-4 py-2 border border-blue-200 shadow-xs">🌐 skdmhesapla.com</span>
            <span className="rounded-full bg-white px-4 py-2 border border-blue-200 shadow-xs">✉️ info@skdmhesapla.com</span>
            <span className="rounded-full bg-white px-4 py-2 border border-blue-200 shadow-xs">🇹🇷 Türkiye Geneli Kurumsal İhracat Altyapısı</span>
          </div>

          <div className="mt-7 pt-6 border-t border-blue-200 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/basla/"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#1030e0] hover:bg-[#0a1fc8] text-white px-8 text-sm font-black shadow-lg transition pk-btn-primary"
            >
              Ücretsiz GTİP Sorgula &amp; Başla <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
