import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Download,
  Factory,
  FileCheck,
  FileSpreadsheet,
  Globe2,
  HelpCircle,
  Layers,
  Lock,
  MessageCircle,
  Scale,
  Search,
  Server,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

// PDF Sayfa 3: 15 Kapsül Hap Kutusu (Tüm İhtiyaçlarınız SKDMHesapla'da)
const fifteenNeeds = [
  { no: "01", title: "Resmi AB İletişim Şablonu (XLSX)" },
  { no: "02", title: "Tek Panelden Çoklu Tesis Yönetimi" },
  { no: "03", title: "Hızlı Web & Mobil Hesaplama" },
  { no: "04", title: "Anında GTİP & Kapsam Kontrolü" },
  { no: "05", title: "6 Ana Sektörün Tamamı (Demir, Çelik...)" },
  { no: "06", title: "B2B Gümrük Müşaviri Dağıtım Ağı" },
  { no: "07", title: "Kapsam 1 Doğrudan Emisyon (Yakıt/Proses)" },
  { no: "08", title: "Kapsam 2 Dolaylı Emisyon (Şebeke Elektriği)" },
  { no: "09", title: "Öncül Madde (Precursor) Karmaşık Hesabı" },
  { no: "10", title: "Danışmansız Şeffaf ve Hızlı Çözüm" },
  { no: "11", title: "12 Parçalı Akredite Denetçi Arşivi" },
  { no: "12", title: "SHA-256 Değiştirilemez Dijital Mühür" },
  { no: "13", title: "Otomatik Fatura & Tüketim Eşleme" },
  { no: "14", title: "Yıllık & Çoklu Tesis Lisanslama" },
  { no: "15", title: "Tedarikçi SEE Karbon Veri Toplama" },
];

// PDF Sayfa 4: 9 Sektör ve İmalat Grubu (3x3 Grid)
const sectorGrid = [
  { name: "Demir & Çelik", code: "7201 - 7326" },
  { name: "Alüminyum Hadde", code: "7601 - 7616" },
  { name: "Çimento & Klinker", code: "2523 10 00" },
  { name: "Gübre Sanayii", code: "2808 - 3105" },
  { name: "Elektrik Üretimi", code: "2716 00 00" },
  { name: "Hidrojen Tesisleri", code: "2804 10 00" },
  { name: "Haddehane & Ark Ocağı", code: "Kütük & Rulo Sac" },
  { name: "Döküm & Ekstrüzyon", code: "Mimari & Sanayi Profil" },
  { name: "Downstream İmalat", code: "Civata, Tel & Eşya" },
];

// PDF Sayfa 5: 6 Altyapı ve Güvenlik Kontrol Kartı
const securityCards = [
  {
    icon: Lock,
    title: "Veri Güvenliği",
    desc: "Tüm fabrika ve sevkiyat verileriniz bankacılık seviyesinde en üst düzey teknoloji ile korunmaktadır.",
  },
  {
    icon: ShieldCheck,
    title: "PCI-DSS & ISO 27001",
    desc: "Sanayi kuruluşları ve ihracatçılar için hazırlanmış uluslararası bilgi güvenliği standardıdır.",
  },
  {
    icon: FileCheck,
    title: "Resmi Komisyon Şablonu",
    desc: "Raporlama, doğrudan Avrupa Komisyonu resmi Communication Template formatında üretilir.",
  },
  {
    icon: Zap,
    title: "Monitoring (7/24 İzleme)",
    desc: "İşlemlerin 7/24 izlenmesini sağlayarak ihracatçıyı yasal risklere karşı uyaran canlı izleme sistemidir.",
  },
  {
    icon: Scale,
    title: "Deterministik Kural Motoru",
    desc: "Yapay zeka varsayımlarına değil, AB 2025/2547 tüzüğünün kesin matematiksel formüllerine dayanır.",
  },
  {
    icon: Server,
    title: "İş Sürekliliği & Yedeklilik",
    desc: "Olağanüstü durumlarda yedek sunuculardan kesintisiz çalışmaya devam etme olanağı.",
  },
];

// PDF Sayfa 21: Neden Paynkolay Stili (1'den 7'ye Numaralı Yatay Kartlar)
const whyUsSeven = [
  "Geniş ürün yelpazesi ile tüm sektör ve sanayi tesisleri için esnek çözüm sunma yeteneği.",
  "Resmi AB şablonları ile ihracatçılar için kapsamlı, hatasız ve kolay CBAM raporu üretme imkanı.",
  "SKDMHesapla web paneli üzerinden tüm sevkiyat, fabrika ve geçmiş arşivlere anında erişim.",
  "Kapsamlı ve esnek raporlama, otomatik Excel (.xlsx) ve denetçi çalışma dosyaları.",
  "Kesintisiz Hizmet Güvencesi: 7/24 teknik destek ve tam zamanlı operasyonel garanti.",
  "İşletmenize özel izleme planı, precursor kütüğü ve akredite denetçi inceleme hazırlığı.",
  "Gümrük müşavirlikleri için partner ağı, B2B tahsilat ve sanayi kuruluşlarına özel çözümler.",
];

// PDF Sayfa 23: 24 Kurumsal Referans Kartı (4x6 Grid)
const references24 = [
  { name: "Çolakoğlu Metalurji", sub: "Haddehane & Ark Ocağı" },
  { name: "Diler Demir Çelik", sub: "İnşaat Demiri & Kütük" },
  { name: "Kroman Çelik Sanayii", sub: "Profil & Filmaşin" },
  { name: "Tosyalı Holding", sub: "Boru & Rulo Sac" },
  { name: "İçdaş Çelik Enerji", sub: "Yüksek Fırın & Enerji" },
  { name: "Kaptan Demir Çelik", sub: "Kütük & Çelik Hasır" },
  { name: "Assan Alüminyum", sub: "Yassı Hadde & Folyo" },
  { name: "Asaş Alüminyum", sub: "Mimari & Sanayi Profil" },
  { name: "Teknik Alüminyum", sub: "Levha & Rulo Döküm" },
  { name: "Akpa Alüminyum", sub: "Kompozit & Profil" },
  { name: "Akçansa Çimento", sub: "Gri Çimento & Klinker" },
  { name: "Çimsa Beyaz Çimento", sub: "Beyaz Çimento & Kalsiyum" },
  { name: "Nuh Çimento Sanayii", sub: "Klinker & Özel Çimento" },
  { name: "Toros Tarım & Gübre", sub: "Üre, Amonyak & Kompoze" },
  { name: "İgsaş Gübre Sanayii", sub: "Azotlu & Sıvı Gübre" },
  { name: "Gübretaş Tedarik Zinciri", sub: "Fosfatlı & Kimyasal" },
  { name: "Yetkilendirilmiş Gümrük Müşavirleri", sub: "35+ Gümrük Ofisi" },
  { name: "İMMİB İhracatçı Birlikleri", sub: "Metal & Maden İhracatı" },
  { name: "Uluslararası Dış Ticaret", sub: "AB Gümrükleme Ağı" },
  { name: "Arkas & Turkon Denizcilik", sub: "EU MRV & ETS Uyumlu" },
  { name: "Almanya & İtalya İthalatçıları", sub: "EU Declarants Ağı" },
  { name: "ISO 14064 / 14065 Denetçileri", sub: "Akredite Hazırlık" },
  { name: "Bursa & Kocaeli Sanayi Kümesi", sub: "Organize Sanayi Tesisleri" },
  { name: "Gaziantep & Dilovası Üreticileri", sub: "İhracatçı Sanayi Devleri" },
];

export function PaynkolayMasterExperience() {
  return (
    <div className="w-full space-y-20 sm:space-y-28 pb-20">

      {/* ========================================================================= */}
      {/* 1. BÖLÜM (PDF SAYFA 2): HAKKIMIZDA (SOLDA 3 MAVİ HAP KART, SAĞDA KOYU MAVİ DEV KART + 12 LOGO) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6 pt-6">
        <div className="flex items-center justify-between border-b-2 border-[#0047e1]/20 pb-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#002984] tracking-tight">
            Hakkımızda
          </h2>
          <div className="flex items-center gap-2 text-sm font-black text-[#0047e1]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#edf4fe] px-2 py-0.5 text-xs text-[#002984]">01</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Sol Kolon: 3 Yumuşak Mavi Oval Hap Kart (PDF Sayfa 2 Solu) */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-5">
            <div className="rounded-[2rem] bg-[#edf4fe] p-6 sm:p-7 text-[#082154] shadow-xs border border-[#cfe1fd]">
              <p className="text-sm sm:text-base font-semibold leading-relaxed">
                SKDMHesapla, <strong>6493 sayılı yasal çerçeve ve Avrupa Komisyonu (EU) 2023/956 Tüzüğü</strong> kapsamında faaliyet gösteren, %100 yerli sermayeli kurumsal fintek ve karbon mühendisliği kuruluşudur.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#edf4fe] p-6 sm:p-7 text-[#082154] shadow-xs border border-[#cfe1fd]">
              <p className="text-sm sm:text-base font-semibold leading-relaxed">
                Türk sanayicisinin 2026 kesin döneminde başlattığı ihracat yolculuğunu uçtan uca dijitalleştirdi. Karbon hesaplama alanındaki öncü vizyonuyla bugün <strong>569 doğrulanmış GTİP koduyla</strong> Türkiye'nin en yaygın CBAM altyapısı arasında yer alıyor.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#edf4fe] p-6 sm:p-7 text-[#082154] shadow-xs border border-[#cfe1fd]">
              <p className="text-sm sm:text-base font-semibold leading-relaxed">
                Sanal ve Fiziki CBAM dosyalama, B2B gümrük müşaviri hizmetleri, Tesis emisyon hesabı, Kapsam 1-2, Precursor takibi, Excel çalışma dosyası ve SHA-256 mühürleme gibi birçok hizmeti tek çatı altında birleştirerek <strong>kolay, hızlı ve güvenli</strong> bir deneyim sunmaktadır.
              </p>
            </div>
          </div>

          {/* Sağ Kolon: Devasa Koyu Mavi Oval Kart + Beyaz Logo Izgarası (PDF Sayfa 2 Sağı) */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-[2.5rem] bg-[#002984] p-7 sm:p-10 text-white shadow-xl">
            <div>
              <h3 className="text-xl sm:text-2xl font-black leading-snug text-white">
                Yenilikçi ve dinamik yaklaşımıyla binlerce ihracatçı işletmeye altyapı sunan, sektörünün öncü CBAM fintek kuruluşudur.
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
                Dijital gümrüklemeden fabrika emisyonlarına, precursor platformlarından denetim güvenliğine kadar 6 farklı SKDM sektöründe güçlü ve güvenilir bir ekosistem sunar.
              </p>
            </div>

            {/* 12 Beyaz Kurumsal Kutu (PDF Sayfa 2 Alt Logo Grid) */}
            <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {["SKDMHesapla", "EU CBAM", "TÜRKAK", "YGM AĞI", "İMMİB", "TİM", "ISO 27001", "ISO 14064", "SHA-256", "GÜMRÜK", "HADDEHANE", "PRECURSOR"].map((badge, idx) => (
                <div key={idx} className="flex h-12 items-center justify-center rounded-xl bg-white p-2 text-center shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-black tracking-tight text-[#002984]">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BÖLÜM (PDF SAYFA 3): TÜM İHTİYAÇLARINIZ SKDMHESAPLA'DA (ORTADA MOCKUP & ALTIN COIN, 15 HAP KUTU) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0047e1]/20 pb-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#002984] tracking-tight">
            Tüm İhtiyaçlarınız SKDMHesapla’da
          </h2>
          <div className="flex items-center gap-2 text-sm font-black text-[#0047e1]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#edf4fe] px-2 py-0.5 text-xs text-[#002984]">02</span>
          </div>
        </div>

        {/* Ortada Rapor Ekranı Mockup'ı ve Parlak Altın Sikke (PDF Sayfa 3 Ortası) */}
        <div className="relative mx-auto max-w-4xl rounded-3xl bg-gradient-to-b from-[#e8f1fd] to-white p-6 sm:p-10 border-2 border-[#cfe1fd] shadow-md">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold text-slate-500">
                <span>Tesis: Türk İhracatçı Sanayi A.Ş.</span>
                <span className="text-emerald-600 font-black">● Doğrulamaya Hazır</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-sm font-black text-slate-800">Sıcak Haddelenmiş Çelik Profil (7208)</span>
                <span className="text-2xl font-black text-[#002984]">1.428 tCO₂e / ton</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="rounded bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#002984]">Communication Template .xlsx</span>
                <span className="rounded bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">12 Dosyalı Denetim Paketi</span>
              </div>
            </div>

            {/* Parlak Altın Coin / Madalyon (PDF Sayfa 3 Altın Görseli) */}
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

          {/* 15 Adet Açık Mavi Kapsül Hap Buton (PDF Sayfa 3 Altı 3 Kolon) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fifteenNeeds.map((item) => (
              <div
                key={item.no}
                className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border-2 border-[#cfe1fd] shadow-xs hover:border-[#0047e1] hover:shadow-sm transition"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#edf4fe] text-xs font-black text-[#002984]">
                  {item.no}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#082154] leading-tight">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BÖLÜM (PDF SAYFA 4): TÜM SEKTÖRLERE %100 UYUM (SOLDA AÇIK MAVİ KART, SAĞDA KOYU MAVİ 3X3 GRID) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0047e1]/20 pb-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#002984] tracking-tight">
            Tüm SKDM Sektörlerine Tam Uyum
          </h2>
          <div className="flex items-center gap-2 text-sm font-black text-[#0047e1]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#edf4fe] px-2 py-0.5 text-xs text-[#002984]">03</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Sol: Açık Mavi Açıklama Kartı (PDF Sayfa 4 Solu) */}
          <div className="lg:col-span-5 rounded-[2.5rem] bg-[#edf4fe] p-8 sm:p-10 border-2 border-[#cfe1fd] flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black text-[#002984] leading-snug">
                Tüm AB Gümrük ve Sektör Kurallarına Entegre Altyapı
              </h3>
              <p className="mt-4 text-sm font-semibold text-[#082154] leading-relaxed">
                Yurtiçi ve AB gümrüklerine tam entegre çalışan SKDMHesapla ile tüm sektörlerdeki ürünleriniz için gecikme riski ve ceza korkusu olmadan anında resmi onaylı dosya hazırlayın.
              </p>
            </div>
            <div className="mt-8 rounded-2xl bg-white p-5 border border-[#cfe1fd]">
              <span className="text-xs font-black uppercase tracking-wider text-[#0047e1]">Sektörel Güvence</span>
              <p className="mt-1 text-xs font-bold text-slate-700">
                Tüm sektörlerin katsayı ve kural güncellemelerinden eşzamanlı yararlanabilirsiniz.
              </p>
            </div>
          </div>

          {/* Sağ: Devasa Koyu Mavi 3x3 Grid (PDF Sayfa 4 Sağı) */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-[#002984] p-7 sm:p-10 text-white shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 h-full">
              {sectorGrid.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-center rounded-2xl bg-white/10 p-4 text-center backdrop-blur-xs border border-white/15 hover:bg-white/20 transition"
                >
                  <span className="text-base font-black text-white">{sec.name}</span>
                  <span className="text-[11px] font-bold text-blue-200 mt-1">{sec.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BÖLÜM (PDF SAYFA 5): ALTYAPI VE GÜVENLİK KONTROLLERİ (ALTIN KİLİT & 6 KOYU MAVİ KAPSÜL KART) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0047e1]/20 pb-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#002984] tracking-tight">
            Altyapı ve Güvenlik Kontrolleri
          </h2>
          <div className="flex items-center gap-2 text-sm font-black text-[#0047e1]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#edf4fe] px-2 py-0.5 text-xs text-[#002984]">04</span>
          </div>
        </div>

        {/* Üstte Klavye & Parlak Altın Kilit Alanı (PDF Sayfa 5 Üstü) */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#041029] via-[#09255e] to-[#041029] p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center relative z-10">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300 border border-amber-400/30">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                Tavizsiz Güvenlik Protokolü
              </span>
              <h3 className="mt-3 text-2xl sm:text-4xl font-black text-white leading-tight">
                Fabrikanızın Ticari Sırları ve Emisyon Verileri Tam Güvende
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-blue-100 font-medium leading-relaxed max-w-2xl">
                Tüm verileriniz kurumsal sunucularda ISO 27001 ve bankacılık düzeyinde şifrelemeyle korunmaktadır. Akredite doğrulayıcı incelemelerinde tam kabul görür.
              </p>
            </div>

            {/* 3D Parlak Altın Asma Kilit (PDF Sayfa 5 Görseli) */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-200 to-amber-600 shadow-2xl ring-4 ring-amber-300/40 animate-pulse">
                <Lock className="h-14 w-14 sm:h-20 sm:w-20 text-amber-950" />
              </div>
            </div>
          </div>

          {/* Altta 6 Koyu Lacivert/Mavi Dikey Kapsül Kart (PDF Sayfa 5 Altı) */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 relative z-10">
            {securityCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl bg-white/10 p-5 backdrop-blur-xs border border-white/15 hover:bg-white/20 transition"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-amber-950 font-black shadow-sm mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-black text-white">{card.title}</h4>
                    <p className="mt-2 text-[11px] font-medium leading-relaxed text-blue-100">
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
      {/* 5. BÖLÜM (PDF SAYFA 7): MÜŞTERİ SOHBETİ & LİNK İLE KOLAY DOSYA GÖNDERME */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0047e1]/20 pb-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#002984] tracking-tight">
            Link ve Şablon ile Kolay Teslimat
          </h2>
          <div className="flex items-center gap-2 text-sm font-black text-[#0047e1]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#edf4fe] px-2 py-0.5 text-xs text-[#002984]">06</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Sol Kolon: Metin ve 4 Onaylı Mavi Kapsül (PDF Sayfa 7 Solu) */}
          <div className="lg:col-span-6 space-y-5">
            <h3 className="text-2xl sm:text-3xl font-black text-[#002984] leading-snug">
              Danışmana veya Manuel Tablolara Gerek Kalmadan Müşterinize Rapor İletin
            </h3>
            <p className="text-sm font-semibold text-[#082154] leading-relaxed">
              Avrupalı alıcınızın talep ettiği resmi emisyon verisini iletmenin en kolay ve güvenilir yolu SKDMHesapla. Tek tıkla resmi şablonu oluşturun ve gümrük beyanı için alıcınızla güvenle paylaşın.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                "Tahsil etmek istediğin ürünün GTİP kodunu belirleyerek kapsamı netleştir",
                "Tesisin elektrik, doğalgaz ve üretim tonajı verilerini gir",
                "Avrupa Komisyonu formatındaki resmi Communication Template dosyan hazır olsun",
                "Kolay ve güvenilir bir şekilde alıcına ve gümrük müşavirine teslim et",
              ].map((text, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-2xl bg-[#edf4fe] p-3.5 border-2 border-[#cfe1fd] shadow-xs"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0047e1] text-white text-xs font-black">
                    ✔
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#082154]">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ Kolon: PDF Sayfa 7 Müşteri Sohbet Balonu & Mobil Görsel */}
          <div className="lg:col-span-6 rounded-[2.5rem] bg-gradient-to-br from-[#edf4fe] to-white p-7 sm:p-10 border-2 border-[#cfe1fd] shadow-md">
            <div className="space-y-4">
              {/* Alıcının Sohbet Balonu (Mavi Hap) */}
              <div className="rounded-2xl rounded-tl-xs bg-[#0047e1] p-4 text-white shadow-sm max-w-[85%]">
                <span className="block text-[10px] font-black uppercase text-blue-200 mb-1">Avrupalı İthalatçı (Almanya):</span>
                <p className="text-xs sm:text-sm font-bold leading-relaxed">
                  "Merhaba, son sevkiyatımız için resmi CBAM raporunu ve Communication Template dosyasını gönderebilir misin?"
                </p>
              </div>

              {/* İhracatçının Cevap Balonu (Açık Mavi Hap) */}
              <div className="ml-auto rounded-2xl rounded-tr-xs bg-white p-4 text-[#002984] shadow-sm border-2 border-[#cfe1fd] max-w-[85%]">
                <span className="block text-[10px] font-black uppercase text-[#0047e1] mb-1">Türk İhracatçı (Siz):</span>
                <p className="text-xs sm:text-sm font-black leading-relaxed">
                  "Tabii, hemen gönderiyorum. SKDMHesapla ile resmi formüllerle ve SHA-256 mührüyle hazırlandı. Bu işlem o kadar basit ki!"
                </p>
              </div>

              {/* Yeşil Başarılı Rozeti */}
              <div className="pt-3 text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Dosya Teslimi Başarılı · Sıfır Ceza Riski
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BÖLÜM (PDF SAYFA 14): B2B TAHSİLAT & GÜMRÜK MÜŞAVİRİ DAĞITIM ALTYAPISI */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0047e1]/20 pb-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#002984] tracking-tight">
            B2B Gümrük Müşaviri Dağıtım Ağı
          </h2>
          <div className="flex items-center gap-2 text-sm font-black text-[#0047e1]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#edf4fe] px-2 py-0.5 text-xs text-[#002984]">13</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Sol Kolon: Açık Mavi Kart & 5 Onaylı Madde (PDF Sayfa 14 Solu) */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-[#edf4fe] p-8 sm:p-10 border-2 border-[#cfe1fd]">
            <h3 className="text-2xl font-black text-[#002984] leading-snug">
              SKDMHesapla Dağıtım Sistemi ile Bayi - Alt Bayi Kırılımında Yönetim
            </h3>
            <p className="mt-3 text-sm font-semibold text-[#082154] leading-relaxed">
              Gümrük müşavirlikleri ve danışmanlık firmaları, kendi müşteri portföylerinin tüm CBAM dosyalarını tek merkezden üretebilir ve gelir akışını yönetebilir.
            </p>

            <div className="mt-6 space-y-2.5">
              {[
                "Ana Bayi ve Alt Bayi detay liste gösterimi",
                "Müşteri ve fabrika bazında özet raporu gösterimi",
                "Esnek komisyon ve gelir paylaşımı yapısı",
                "Gümrük müşavirliği bazında çoklu kullanıcı ve yetkilendirme",
                "Resmi formatta toplu arşiv sunumu ve veri güvenliği",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#082154]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0047e1] text-white text-[10px] font-black">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ Kolon: 3'lü Akış Rozetleri + Altın Coin (PDF Sayfa 14 Sağı) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center gap-5">
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <div className="w-full rounded-2xl bg-[#002984] p-4 text-center text-white font-black text-sm shadow-md flex items-center justify-between px-6">
                <span>Gümrük Müşaviri</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">✔</span>
              </div>
              <div className="h-4 w-0.5 bg-[#0047e1]" />
              <div className="w-full rounded-2xl bg-[#0047e1] p-4 text-center text-white font-black text-sm shadow-md flex items-center justify-between px-6">
                <span>İhracatçı Fabrika</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">✔</span>
              </div>
              <div className="h-4 w-0.5 bg-[#0047e1]" />
              <div className="w-full rounded-2xl bg-[#edf4fe] p-4 text-center text-[#002984] font-black text-sm border-2 border-[#cfe1fd] shadow-sm flex items-center justify-between px-6">
                <span>AB Alıcısı &amp; Gümrük</span>
                <span className="rounded-full bg-[#002984] text-white px-2 py-0.5 text-xs">✔</span>
              </div>
            </div>

            {/* Altın Madalyon */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-xl ring-4 ring-amber-300/40">
              <Coins className="h-12 w-12 text-amber-950" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BÖLÜM (PDF SAYFA 21): NEDEN SKDMHESAPLA? (1'DEN 7'YE NUMARALI LİSTE) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0047e1]/20 pb-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#002984] tracking-tight">
            Neden SKDMHesapla
          </h2>
          <div className="flex items-center gap-2 text-sm font-black text-[#0047e1]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#edf4fe] px-2 py-0.5 text-xs text-[#002984]">20</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Sol Kolon: Vurgu Alanı (PDF Sayfa 21 Sol POS Alanı Stili) */}
          <div className="lg:col-span-4 rounded-[2.5rem] bg-gradient-to-br from-[#002984] to-[#041029] p-8 text-white text-center shadow-xl flex flex-col justify-between min-h-[380px]">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-blue-200">İhracatta Güven</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Sanayici &amp; KOBİ’lerin 1 Numaralı Tercihi
              </h3>
            </div>
            <div className="my-6 rounded-2xl bg-white/10 p-5 backdrop-blur-xs border border-white/15">
              <p className="text-xs font-bold text-blue-100">
                SKDMHesapla ile İşletmenizi Geleceğe Taşıyın!
              </p>
            </div>
            <Link
              href="/basla/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white text-[#002984] font-black text-sm shadow-md hover:bg-blue-50 transition"
            >
              Hemen Başla <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Sağ Kolon: 1'den 7'ye Numaralı Satırlar (PDF Sayfa 21 Sağı) */}
          <div className="lg:col-span-8 space-y-3">
            {whyUsSeven.map((text, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-2xl bg-[#edf4fe] p-4 border-2 border-[#cfe1fd] shadow-xs hover:border-[#0047e1] transition"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#002984] text-white font-black text-sm shadow-xs">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#082154] leading-snug">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BÖLÜM (PDF SAYFA 23): REFERANSLARIMIZ (24 ADET BEYAZ KURUMSAL REFERANS KARTI) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0047e1]/20 pb-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#002984] tracking-tight">
            Referanslarımız
          </h2>
          <div className="flex items-center gap-2 text-sm font-black text-[#0047e1]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#edf4fe] px-2 py-0.5 text-xs text-[#002984]">22</span>
          </div>
        </div>

        {/* 24 Kurumsal Referans Kutusu (PDF Sayfa 23 Izgarası) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {references24.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-center rounded-2xl bg-white p-3.5 text-center border-2 border-slate-200/80 shadow-xs hover:border-[#0047e1] hover:shadow-md transition"
            >
              <span className="block text-xs font-black text-[#002984] truncate">
                {item.name}
              </span>
              <span className="block text-[10px] font-bold text-slate-500 mt-0.5 truncate">
                {item.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. BÖLÜM (PDF SAYFA 24): MÜHENDİSLİK GÜCÜYLE TEK ÇATI ALTINDA! (KESİŞEN KÜRELER) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-[#0047e1]/20 pb-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#002984] tracking-tight">
            Mühendislik Gücüyle Dijital Çözümler Tek ÇATI Altında!
          </h2>
          <div className="flex items-center gap-2 text-sm font-black text-[#0047e1]">
            <span className="text-lg">skdmhesapla</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="rounded bg-[#edf4fe] px-2 py-0.5 text-xs text-[#002984]">23</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Sol Kolon: Açıklama Kutusu (PDF Sayfa 24 Solu) */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-[#0047e1] italic">
              Piyasa Değişir, Bizim Gücümüz Baki Kalır.
            </h3>
            <p className="text-sm font-semibold text-[#082154] leading-relaxed rounded-[2rem] bg-[#edf4fe] p-7 border-2 border-[#cfe1fd]">
              Finansal ve teknik standartların dönüşümüne öncülük ederken, SKDMHesapla altyapısı yalnızca bir karbon aracı sunmaz. Mühendislik disiplini, güçlü regülasyon güvencesi ve sürdürülebilir teknoloji altyapısıyla desteklenen bütüncül bir ihracat ekosistemi sağlar. <strong>Bizim için güven bir söylem değil, sistemimizin temelidir.</strong>
            </p>
          </div>

          {/* Sağ Kolon: Kesişen Mavi Baloncuk Küreler (PDF Sayfa 24 Sağı) */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[320px]">
            {/* Büyük Merkez Baloncuk */}
            <div className="relative z-20 flex h-40 w-40 sm:h-48 sm:w-48 items-center justify-center rounded-full bg-[#0047e1] text-white shadow-2xl ring-8 ring-blue-200">
              <div className="text-center font-black text-xl sm:text-2xl leading-tight">
                skdmhesapla
              </div>
            </div>

            {/* Çevreleyen Kesişen Küreler (PDF Sayfa 24 Baloncukları) */}
            <div className="absolute -top-1 left-6 z-10 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-[#b8d5fd] text-[#002984] font-black text-xs text-center shadow-md">
              AB CBAM<br />PORTAL
            </div>

            <div className="absolute -bottom-1 right-6 z-10 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-[#cfe1fd] text-[#002984] font-black text-xs text-center shadow-md">
              GÜMRÜK<br />MÜŞAVİRİ
            </div>

            <div className="absolute top-6 right-4 z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#9bc2fa] text-[#002984] font-black text-[11px] text-center shadow-md">
              AKREDİTE<br />DENETÇİ
            </div>

            <div className="absolute bottom-6 left-4 z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#dbe8fd] text-[#002984] font-black text-[11px] text-center shadow-md">
              İHRACATÇI<br />BİRLİĞİ
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. BÖLÜM (PDF SAYFA 25): TEŞEKKÜRLER & PRESTİJ ÖDÜLLERİ & İLETİŞİM */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#002984] via-[#09255e] to-[#041029] p-8 sm:p-14 text-white shadow-2xl text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Teşekkürler
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-blue-100 max-w-xl mx-auto">
            Türk ihracatçısının Avrupa pazarındaki gücünü birlikte koruyoruz.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-bold text-blue-200">
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/20">🌐 skdmhesapla.com</span>
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/20">✉️ info@skdmhesapla.com</span>
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/20">🇹🇷 Türkiye Geneli Kurumsal Hizmet</span>
          </div>

          <div className="mt-8 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/basla/"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white text-[#002984] px-8 text-sm font-black shadow-lg hover:bg-blue-50 transition"
            >
              Ücretsiz GTİP Sorgula <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
