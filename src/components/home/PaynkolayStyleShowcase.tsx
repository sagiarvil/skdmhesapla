import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
  Lock,
  FileCheck,
  Server,
  Layers,
  Scale,
  Clock,
  Sparkles,
  Download,
  MessageSquare,
  Building,
  Factory,
  Globe2,
  Send,
  Zap,
  Check,
} from "lucide-react";

// PDF Sayfa 3 Stili: 12 Kapsül Hap
const allNeedsItems = [
  { no: "01", title: "Resmi AB İletişim Şablonu", sub: "Communication Template XLSX" },
  { no: "02", title: "Anında GTİP & Kapsam Analizi", sub: "569+ 8 Haneli CN Kodu" },
  { no: "03", title: "Kapsam 1 Doğrudan Emisyon", sub: "Doğalgaz, Kömür ve Proses" },
  { no: "04", title: "Kapsam 2 Dolaylı Emisyon", sub: "Şebeke Elektriği ve TEİAŞ" },
  { no: "05", title: "Öncül Madde (Precursor) Takibi", sub: "Karmaşık Tedarik Zinciri" },
  { no: "06", title: "Doğrulamaya Hazır Excel Dosyası", sub: "Alıcı ve Denetçi İçin" },
  { no: "07", title: "12 Parçalı Kanıt Arşivi", sub: "İzleme Planı ve Tesis İzi" },
  { no: "08", title: "6 Ana Sektörün Tamamı", sub: "Demir, Çelik, Alüminyum..." },
  { no: "09", title: "SHA-256 Dijital Mühürleme", sub: "Değiştirilemez Kütük" },
  { no: "10", title: "Yüksek Danışmanlık Masrafına Son", sub: "Şeffaf ve Net Fiyat" },
  { no: "11", title: "Ticari Sır & Veri İzolasyonu", sub: "ISO 27001 Güvencesi" },
  { no: "12", title: "2026 Kesin Dönem Uyumu", sub: "Brüksel Mevzuat Garantisi" },
];

// PDF Sayfa 21 Stili: 6 Büyük Numaralı Neden Kartı
const whyUsItems = [
  {
    num: "1",
    title: "Erişilebilir ve Şeffaf Maliyet",
    desc: "Danışmanlık firmalarının talep ettiği onbinlerce Euro'luk afaki faturalar yerine; KOBİ ve ihracatçı dostu, ne ödeyeceğinizi bildiğiniz şeffaf paketler.",
  },
  {
    num: "2",
    title: "Haftalar Değil, Dakikalar İçinde",
    desc: "Günlerce süren karmaşık manuel Excel formülleriyle vakit kaybetmeyin. Fabrikanızın üretim ve enerji verilerini girin, dosyanız anında üretilsin.",
  },
  {
    num: "3",
    title: "%100 Resmi AB Mevzuat Garantisi",
    desc: "Avrupa Komisyonu (EU) 2023/956 ve 2025/2547 direktiflerine birebir uygun; gümrükte format reddi veya usulsüzlük cezası riskini sıfırlayan altyapı.",
  },
  {
    num: "4",
    title: "Ticari Sırlarınız Tam Güvende",
    desc: "Fabrikanızın üretim tonajı, tedarikçileri, enerji faturaları ve maliyet yapıları asla üçüncü şahıslara veya danışmanlara sızdırılmaz; uçtan uca şifrelenir.",
  },
  {
    num: "5",
    title: "Akredite Denetçi Standartlarında",
    desc: "TÜRKAK ve AB akreditasyonuna sahip bağımsız doğrulayıcıların (verifiers) aradığı 12 parçalı denetim kütüğü ve geriye dönük hesap iziyle eksiksiz.",
  },
  {
    num: "6",
    title: "Brüksel ile Eşzamanlı Güncel",
    desc: "Avrupa Birliği'nin yayımladığı tüm yeni emisyon katsayıları, ülke elektrik faktörleri ve mevzuat değişiklikleri sisteme anında yansıtılır.",
  },
];

// PDF Sayfa 5 Stili: Altyapı ve Güvenlik Kontrolleri
const securityControls = [
  {
    icon: Lock,
    title: "Veri Güvenliği & Gizlilik",
    desc: "Fabrika üretim verileriniz ve ticari sırlarınız bankacılık seviyesinde şifreli sunucularda saklanır.",
    tag: "ISO 27001",
  },
  {
    icon: FileCheck,
    title: "Resmi Şablon Uyumu",
    desc: "Avrupa Komisyonu resmi Communication Template XLSX dosyaları ile birebir veri eşlemesi.",
    tag: "(EU) 2023/956",
  },
  {
    icon: ShieldCheck,
    title: "Kriptografik Mühür",
    desc: "SHA-256 sağlama toplamı ile üretilen raporların sonradan değiştirilmediği ispatlanır.",
    tag: "Değiştirilemez",
  },
  {
    icon: Server,
    title: "7/24 Kesintisiz Erişim",
    desc: "İstediğiniz an yeni sevkiyatlarınız için hesaplama yapın, rapor üretin ve geçmiş arşivinize ulaşın.",
    tag: "%99.9 Uptime",
  },
  {
    icon: Scale,
    title: "Denetçi Onay Güvencesi",
    desc: "Akredite doğrulayıcıların inceleme süreçlerini hızlandıran şeffaf hesaplama izi sunulur.",
    tag: "Verifier-Ready",
  },
  {
    icon: Layers,
    title: "6 Ana Sektör Koruması",
    desc: "Demir-çelik, alüminyum, çimento, gübre, elektrik ve hidrojen sektörlerinin tamamına eksiksiz destek.",
    tag: "569+ CN Kodu",
  },
];

export function PaynkolayStyleShowcase() {
  return (
    <div className="space-y-20 py-8 sm:py-16">

      {/* ŞEMA 1: PDF SAYFA 24 STİLİ - BİRBİRİYLE KESİŞEN EKOSİSTEM VE GÜÇ KÜRELERİ */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="rounded-3xl border-2 border-brand-800/15 bg-gradient-to-br from-[#f2f8ed] via-[#f9fbf8] to-white p-8 sm:p-14 shadow-md">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Sol: Net Güç & Değer Açıklaması */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-white px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-900 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                Tek Çatı Altında Güçlü Ekosistem
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0a2016] leading-[1.12]">
                Avrupa Birliği Standartlarında Güçlü Altyapı
              </h2>
              <p className="text-sm sm:text-base font-medium leading-relaxed text-[#1b3d2c]">
                Piyasa değişir, mevzuat güncellenir; SKDMHesapla’nın mühendislik gücü baki kalır. Türk ihracatçısı, gümrük müşavirleri ve akredite denetçiler için tasarlanmış bütüncül bir karbon uyum ekosistemi sunuyoruz.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/basla/"
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950 shadow-md transition hover:bg-brand-400"
                >
                  Ücretsiz Başla <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/platform-kabiliyetleri/"
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-brand-800/20 bg-white px-5 text-sm font-black text-brand-900 hover:bg-brand-50 transition"
                >
                  Ekosistemi Keşfet
                </Link>
              </div>
            </div>

            {/* Sağ: PDF Sayfa 24 Tarzı Kesişen Geometrik Küreler Şeması */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px]">
              {/* Merkez Ana Küre */}
              <div className="relative z-20 flex h-40 w-40 sm:h-48 sm:w-48 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-950 p-6 text-center text-white shadow-2xl ring-8 ring-brand-500/20">
                <div>
                  <span className="block text-xs uppercase tracking-widest text-brand-300 font-extrabold">MERKEZ</span>
                  <span className="mt-1 block text-lg sm:text-xl font-black leading-tight">SKDMHesapla Motoru</span>
                  <span className="mt-1 inline-block rounded-full bg-brand-500/30 px-2 py-0.5 text-[9px] font-bold text-brand-200">SHA-256 Mühürlü</span>
                </div>
              </div>

              {/* Çevreleyen Kesişen Küreler (PDF Sayfa 24 Baloncukları) */}
              <div className="absolute -top-2 left-4 sm:left-10 z-10 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 p-3 text-center text-white shadow-lg opacity-95 transition hover:scale-105">
                <span className="text-[11px] sm:text-xs font-black leading-tight">Avrupa<br />Komisyonu<br />(EU CBAM)</span>
              </div>

              <div className="absolute -bottom-2 right-4 sm:right-8 z-10 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-brand-900 p-3 text-center text-white shadow-lg opacity-95 transition hover:scale-105">
                <span className="text-[11px] sm:text-xs font-black leading-tight">Gümrük<br />Müşavirleri<br />(YGM Ağı)</span>
              </div>

              <div className="absolute top-10 right-2 sm:right-6 z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-emerald-800 p-2 text-center text-white shadow-md opacity-90 transition hover:scale-105">
                <span className="text-[10px] sm:text-[11px] font-black leading-tight">Akredite<br />Denetçi<br />(Verifier)</span>
              </div>

              <div className="absolute bottom-8 left-2 sm:left-8 z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-800 to-slate-900 p-2 text-center text-white shadow-md opacity-90 transition hover:scale-105">
                <span className="text-[10px] sm:text-[11px] font-black leading-tight">T.C. İhracatçı<br />Birlikleri<br />(İMMİB/TİM)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ŞEMA 2: PDF SAYFA 3 STİLİ - 12 HAP KAPSÜL KART (TÜM İHTİYAÇLARINIZ TEK PLATFORMDA) */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="rounded-3xl border-2 border-brand-800/15 bg-white p-7 sm:p-12 shadow-sm">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-900 border border-brand-800/20">
              Eksiksiz Çözüm
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-[#0a2016]">
              Tüm CBAM / SKDM İhtiyaçlarınız SKDMHesapla’da
            </h2>
            <p className="mt-2 text-sm sm:text-base font-medium text-[#1b3d2c]">
              Avrupa Birliği müşterinizin talep ettiği tüm teknik dosya ve şablonları karmaşık süreçlere girmeden tek merkezden yönetin.
            </p>
          </div>

          {/* 12 Kapsül Kart Grid (PDF Sayfa 3 Stili) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {allNeedsItems.map((item) => (
              <div
                key={item.no}
                className="group flex items-center gap-3.5 rounded-2xl border-2 border-brand-800/10 bg-gradient-to-r from-[#f4f9f1] to-white p-4 shadow-xs hover:border-brand-800/35 hover:bg-white hover:shadow-md transition"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-sm font-black text-brand-950 shadow-xs group-hover:scale-105 transition">
                  {item.no}
                </span>
                <div className="min-w-0">
                  <span className="block text-xs sm:text-sm font-black text-[#0a2016] truncate">
                    {item.title}
                  </span>
                  <span className="block text-[11px] font-bold text-brand-800 truncate">
                    {item.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ŞEMA 3: PDF SAYFA 7 & 13 STİLİ - MÜŞTERİ SOHBET BALONU + 3 ADIMLI ÇÖZÜM + SAĞDA KOKPİT MOCKUP */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Sol Kolon: WhatsApp Diyalog Balonu & Adımlar */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-900 border border-emerald-300">
                <Clock className="h-3.5 w-3.5 text-emerald-700" />
                Kolay &amp; Anında Çözüm
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#0a2016] leading-tight">
                Alıcınıza Raporunuzu Dakikalar İçinde Gönderin
              </h2>
              <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-[#1b3d2c]">
                Avrupalı ithalatçınız rapor istediğinde artık panik yok. Süreci 3 basit adımda profesyonelce tamamlayın.
              </p>
            </div>

            {/* PDF Sayfa 7 Stili: Müşteri Sohbet Simülasyonu */}
            <div className="rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/70 to-white p-4 shadow-sm space-y-3">
              {/* Alıcının Mesajı */}
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-xs font-black">EU</span>
                <div className="rounded-2xl rounded-tl-xs bg-white border border-slate-200 p-3 shadow-xs text-xs font-semibold text-slate-800">
                  <span className="block font-black text-slate-900 mb-0.5">Alman Alıcı (GmbH):</span>
                  "Gümrük beyanı için son sevkiyatınızın resmi CBAM raporunu ve Communication Template dosyasını acil gönderebilir misiniz?"
                </div>
              </div>

              {/* İhracatçının Cevabı */}
              <div className="flex items-start gap-2.5 max-w-[85%] ml-auto flex-row-reverse">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-brand-950 text-xs font-black">TR</span>
                <div className="rounded-2xl rounded-tr-xs bg-brand-800 text-white p-3 shadow-xs text-xs font-semibold">
                  <span className="block font-black text-brand-200 mb-0.5">Siz (İhracatçı):</span>
                  "Tabii ki, dosyanız SKDMHesapla ile resmi formüllerle ve SHA-256 mührüyle hazırlandı. Ekte iletiyorum! ✔"
                </div>
              </div>
            </div>

            {/* 3 Adım Tikli Liste */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 rounded-xl border border-brand-800/15 bg-white p-3.5 shadow-xs">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-brand-950 font-black text-xs">1</span>
                <span className="text-xs sm:text-sm font-bold text-[#0a2016]">GTİP Kodunuzu girin, CBAM kapsamını anında görün.</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-brand-800/15 bg-white p-3.5 shadow-xs">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-brand-950 font-black text-xs">2</span>
                <span className="text-xs sm:text-sm font-bold text-[#0a2016]">Tesisinizin elektrik, yakıt ve üretim tonajını yazın.</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-brand-800/15 bg-white p-3.5 shadow-xs">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-brand-950 font-black text-xs">3</span>
                <span className="text-xs sm:text-sm font-bold text-[#0a2016]">Resmi AB Communication Template dosyanızı anında indirin.</span>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/basla/"
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-7 text-sm font-black text-brand-950 shadow-md hover:bg-brand-400 transition"
              >
                Hemen Ücretsiz Dene <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Sağ Kolon: Tablet/Kart Mockup (PDF Sayfa 6 Cihaz Ekranı Stili) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border-2 border-brand-800/25 bg-white p-6 sm:p-8 shadow-2xl">
              {/* Mockup Üst Bar */}
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black tracking-wider uppercase text-brand-950">
                    SKDMHesapla Resmi Çıktı Paneli
                  </span>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-900 border border-emerald-300">
                  Doğrulamaya Hazır
                </span>
              </div>

              {/* Mockup Gövde */}
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#f5faf2] border border-brand-800/15 p-4">
                  <div className="flex justify-between items-center text-xs text-ink-600 font-bold">
                    <span>Tesis: Örnek İhracatçı Tesis A.Ş.</span>
                    <span>Dönem: 2026/Q1</span>
                  </div>
                  <div className="mt-2 text-sm font-black text-ink-900">
                    Sıcak Haddelenmiş Rulo Sac (GTİP: 7208 37 00)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border-2 border-brand-800/15 bg-white p-4 text-center shadow-xs">
                    <span className="block text-[11px] font-bold text-ink-500 uppercase">Toplam Gömülü Emisyon</span>
                    <span className="mt-1 block text-3xl font-black text-brand-800">1.428</span>
                    <span className="block text-[10px] font-extrabold text-ink-600">t CO₂e / ton ürün</span>
                  </div>
                  <div className="rounded-2xl border-2 border-brand-800/15 bg-white p-4 text-center shadow-xs">
                    <span className="block text-[11px] font-bold text-ink-500 uppercase">Kapsam 1 + Kapsam 2</span>
                    <span className="mt-1 block text-3xl font-black text-ink-900">1.12 + 0.31</span>
                    <span className="block text-[10px] font-extrabold text-emerald-700">Resmi Katsayı Uyumlu</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-line bg-white p-3 text-xs font-bold text-ink-800">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      <span>cbam_communication_template.xlsx</span>
                    </div>
                    <span className="text-emerald-700 font-black">Hazır ✔</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-line bg-white p-3 text-xs font-bold text-ink-800">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-brand-700" />
                      <span>12 Parçalı Denetçi Çalışma Arşivi (.zip)</span>
                    </div>
                    <span className="text-brand-900 font-black">Mühürlü ✔</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#091a13] p-3 text-[10px] font-mono text-emerald-300 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-amber-400 font-bold">SHA-256:</span> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b...
                  </div>
                  <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                </div>

                <div className="w-full py-3.5 rounded-xl bg-brand-500 text-brand-950 font-black text-xs text-center flex items-center justify-center gap-2 shadow-sm">
                  <Download className="h-4 w-4" />
                  Resmi Rapor Paketini İndir (.ZIP)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ŞEMA 4: PDF SAYFA 14 STİLİ - B2B DAĞITIM VE DEĞER ZİNCİRİ AKIŞ ŞEMASI */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="rounded-3xl border-2 border-brand-800/15 bg-gradient-to-br from-[#0c2419] to-[#04120c] p-8 sm:p-12 text-white shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-300 border border-white/20">
              B2B Dağıtım &amp; Satış Kanalı
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-white">
              Uçtan Uca B2B Dağıtım ve Entegrasyon Zinciri
            </h2>
            <p className="mt-2 text-sm sm:text-base font-medium text-emerald-100">
              Müşteri fabrikadan yetkilendirilmiş gümrük müşavirine, oradan Avrupa gümrüğüne kesintisiz akış.
            </p>
          </div>

          {/* 3'lü Akış Şeması (PDF Sayfa 14 Bayi - Alt Bayi - Müşteri Zinciri) */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3 relative">
            {/* 1. Üretici Fabrika */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 text-center backdrop-blur-xs relative hover:bg-white/[0.1] transition">
              <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-brand-500 text-brand-950 font-black">
                <Factory className="h-6 w-6" />
              </span>
              <span className="mt-4 inline-block rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[10px] font-black text-brand-300 uppercase">Adım 1</span>
              <h3 className="mt-2 text-lg font-black text-white">1. İhracatçı Fabrika</h3>
              <p className="mt-1.5 text-xs text-emerald-100 leading-relaxed font-medium">
                Tesis enerji, yakıt ve üretim tonajı verilerini basit rehberle girer.
              </p>
            </div>

            {/* 2. Gümrük Müşaviri / Danışman */}
            <div className="rounded-2xl border-2 border-brand-400 bg-brand-800/40 p-6 text-center backdrop-blur-xs relative shadow-lg hover:bg-brand-800/50 transition">
              <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-white text-brand-950 font-black">
                <Building className="h-6 w-6" />
              </span>
              <span className="mt-4 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black text-white uppercase">Dağıtım Merkezi</span>
              <h3 className="mt-2 text-lg font-black text-white">2. Gümrük Müşaviri &amp; Danışman</h3>
              <p className="mt-1.5 text-xs text-white leading-relaxed font-medium">
                Çoklu müşteri fabrikalarını tek panelden yönetir; hesaplamayı doğrular.
              </p>
            </div>

            {/* 3. AB Alıcısı & Gümrük */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 text-center backdrop-blur-xs relative hover:bg-white/[0.1] transition">
              <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-brand-500 text-brand-950 font-black">
                <Globe2 className="h-6 w-6" />
              </span>
              <span className="mt-4 inline-block rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[10px] font-black text-brand-300 uppercase">Adım 3</span>
              <h3 className="mt-2 text-lg font-black text-white">3. AB Alıcısı &amp; Gümrük</h3>
              <p className="mt-1.5 text-xs text-emerald-100 leading-relaxed font-medium">
                Resmi Communication Template ve kanıt paketini alır; sıfır ceza ile teslimat onaylanır.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/partner-network/"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950 hover:bg-brand-400 transition shadow-md"
            >
              Partner Dağıtım Ağına Katılın <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ŞEMA 5: PDF SAYFA 21 STİLİ - 6 BÜYÜK NUMARALI NEDEN SKDMHESAPLA KARTI */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-900 border border-brand-800/20">
            Farkımız ve Değerimiz
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#0a2016]">
            Neden SKDMHesapla?
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-[#1b3d2c]">
            Geleneksel pahalı danışmanlık süreçlerine karşı dijital, hızlı, şeffaf ve güvenli ihracatçı altyapısı.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyUsItems.map((item) => (
            <div
              key={item.num}
              className="flex flex-col justify-between rounded-3xl border-2 border-brand-800/15 bg-white p-6 shadow-xs hover:border-brand-800/40 hover:shadow-md transition"
            >
              <div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-base font-black text-brand-950 shadow-xs">
                  {item.num}
                </span>
                <h3 className="mt-4 text-lg font-black text-[#0a2016]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#1b3d2c] font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ŞEMA 6: PDF SAYFA 5 STİLİ - ALTYAPI VE GÜVENLİK KONTROLLERİ (YÜKSEK KONTRASTLI KOYU ZÜMRÜT KAPSÜLLER) */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="rounded-3xl border-2 border-brand-800/20 bg-[#071911] p-8 sm:p-12 text-white shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-300 border border-white/20">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
              Kurumsal Güvence
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-white">
              Altyapı ve Güvenlik Standartları
            </h2>
            <p className="mt-2 text-sm sm:text-base font-medium text-emerald-100">
              Fabrikanızın ticari mahremiyeti ve AB gümrük süreçleriniz için tavizsiz güvenlik protokolleri.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {securityControls.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border-2 border-white/15 bg-white/[0.05] p-5 backdrop-blur-xs hover:border-brand-400 hover:bg-white/[0.09] transition"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-brand-950 font-black shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black text-brand-300 border border-white/15">
                      {sec.tag}
                    </span>
                  </div>
                  {/* Yüksek Kontrastlı Metinler: Arka planda asla ezilmez */}
                  <h3 className="mt-3.5 text-base font-black text-white">
                    {sec.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-emerald-100 font-medium">
                    {sec.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
