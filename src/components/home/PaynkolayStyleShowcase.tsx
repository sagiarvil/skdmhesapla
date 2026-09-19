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
} from "lucide-react";

// PDF Sayfa 3 Stili: Tüm İhtiyaçlarınız SKDMHesapla'da
const allNeedsItems = [
  { no: "01", label: "Resmi AB İletişim Şablonu (Communication Template)" },
  { no: "02", label: "Anında GTİP & Kapsam Kontrolü" },
  { no: "03", label: "Kapsam 1 Doğrudan Emisyon (Yakıt & Proses)" },
  { no: "04", label: "Kapsam 2 Dolaylı Emisyon (Şebeke Elektriği)" },
  { no: "05", label: "Öncül Madde (Precursor) Akıllı Entegrasyonu" },
  { no: "06", label: "Doğrulamaya Hazır Excel Dosyası (.xlsx)" },
  { no: "07", label: "12 Parçalı Akredite Denetçi Kanıt Paketi" },
  { no: "08", label: "6 Ana Sektörün Tümü (Demir, Çelik, Alüminyum...)" },
  { no: "09", label: "SHA-256 Dijital Sağlama & Bütünlük Kütüğü" },
  { no: "10", label: "Danışmanlık Masrafsız, Hızlı ve Şeffaf Çözüm" },
  { no: "11", label: "Tesis & Ticari Sır Koruma Güvencesi" },
  { no: "12", label: "2026 Kesin Dönem Mevzuatına %100 Uyum" },
];

// PDF Sayfa 21 Stili: Neden SKDMHesapla (6 Numaralı Avantaj)
const whyUsItems = [
  {
    num: "1",
    title: "Şeffaf ve Erişilebilir Maliyet",
    desc: "Geleneksel danışmanlık firmalarının talep ettiği onbinlerce Euro'luk teklifler yerine, KOBİ ve ihracatçı dostu net ve öngörülebilir fiyatlandırma.",
  },
  {
    num: "2",
    title: "Haftalar Değil, Dakikalar",
    desc: "Günlerce süren manuel Excel sancısı ve formül karmaşası yerine; tesis verilerinizi girdiğiniz anda saniyeler içinde eksiksiz hesaplama.",
  },
  {
    num: "3",
    title: "Resmi AB Mevzuat Garantisi",
    desc: "Avrupa Komisyonu (EU) 2023/956 ve 2025/2547 regülasyonlarına tam uyumlu, deterministik mühendislik formülleriyle çalışan güvenilir motor.",
  },
  {
    num: "4",
    title: "Ticari Sırlarınız %100 Güvende",
    desc: "Fabrikanızın üretim, enerji, tedarikçi ve maliyet verileri üçüncü taraflarla asla paylaşılmaz; uçtan uca şifreli altyapıda güvenle korunur.",
  },
  {
    num: "5",
    title: "Akredite Denetçi Standartlarında",
    desc: "Doğrulayıcı kuruluşların (verifiers) ve AB gümrük beyan sahiplerinin aradığı 12 parçalı denetim kütüğü ve hesap iziyle eksiksiz teslimat.",
  },
  {
    num: "6",
    title: "Brüksel ile Eşzamanlı Güncel",
    desc: "Avrupa Birliği'nden yayımlanan tüm yeni mevzuat değişiklikleri, katsayı güncellemeleri ve teknik kurallar anında sisteme entegre edilir.",
  },
];

// PDF Sayfa 5 Stili: Altyapı ve Güvenlik Kontrolleri
const securityControls = [
  {
    icon: Lock,
    title: "Veri Güvenliği & Gizlilik",
    desc: "Tüm tesis ve sevkiyat verileriniz en üst düzey kurumsal şifreleme ve ticari sır korumasıyla saklanır.",
  },
  {
    icon: FileCheck,
    title: "Resmi Şablon Uyumu",
    desc: "Avrupa Komisyonu resmi Communication Template alanları ve formatlarıyla %100 birebir eşleme.",
  },
  {
    icon: ShieldCheck,
    title: "Kriptografik Bütünlük",
    desc: "SHA-256 dijital sağlama toplamı ile tahrif edilemez hesap izi ve kanıt kütüğü.",
  },
  {
    icon: Server,
    title: "7/24 Kesintisiz Erişim",
    desc: "İstediğiniz an yeni sevkiyatlarınız için hesaplama yapın, rapor üretin ve arşivinize erişin.",
  },
  {
    icon: Scale,
    title: "Denetçi Doğrulama Kolaylığı",
    desc: "Akredite doğrulayıcıların ve gümrük müşavirlerinin kolayca teyit edebileceği şeffaf hesap izi.",
  },
  {
    icon: Layers,
    title: "6 Ana Sektör Kapsamı",
    desc: "Demir-çelik, alüminyum, çimento, gübre, elektrik ve hidrojen sektörlerinin tamamına tam destek.",
  },
];

export function PaynkolayStyleShowcase() {
  return (
    <div className="space-y-16 py-10 sm:py-16">
      {/* 1. BÖLÜM: TÜM İHTİYAÇLARINIZ TEK PLATFORMDA (PDF SAYFA 3 TARZI HAP GRID) */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="rounded-3xl border border-brand-800/15 bg-gradient-to-br from-[#f0f7ec] via-[#f7faf5] to-white p-7 sm:p-12 shadow-sm">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-900 border border-brand-800/20">
              <Sparkles className="h-3.5 w-3.5 text-brand-700" />
              Eksiksiz Çözüm Paketi
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-ink-900">
              Tüm CBAM / SKDM İhtiyaçlarınız Tek Çatı Altında
            </h2>
            <p className="mt-2 text-sm sm:text-base font-medium text-ink-700">
              Avrupa Birliği müşterinizin talep ettiği tüm teknik dosya ve şablonları karmaşık süreçlere girmeden tek merkezden yönetin.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allNeedsItems.map((item) => (
              <div
                key={item.no}
                className="flex items-center gap-3 rounded-2xl border border-brand-800/10 bg-white/90 p-3.5 shadow-xs hover:border-brand-800/30 hover:bg-white hover:shadow-sm transition"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-black text-brand-900 border border-brand-800/15">
                  {item.no}
                </span>
                <span className="text-xs sm:text-sm font-bold text-ink-900 leading-snug">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. BÖLÜM: 3 ADIMDA KOLAY VE HIZLI ÇÖZÜM + SAĞDA KOKPİT MOCKUP (PDF SAYFA 6, 7 & 13 TARZI) */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Sol Kolon: Satış Odaklı Açıklama ve Adımlar */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800 border border-emerald-200">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                Hızlı &amp; Kolay Süreç
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-ink-900 leading-tight">
                3 Basit Adımda Resmi CBAM Dosyanız Hazır
              </h2>
              <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-ink-700">
                Avrupa'daki alıcınızın talep ettiği teknik emisyon raporunu hazırlamak hiç bu kadar kolay olmamıştı. Yüzlerce sayfalık regülasyon kılavuzlarını okumanıza gerek yok.
              </p>
            </div>

            {/* Tikli Hap Adımlar (Pay'nKolay Sayfa 7 Stili) */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-brand-800/15 bg-white p-4 shadow-xs">
                <CheckCircle2 className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black text-ink-900">1. GTİP / CN Kodunu Kontrol Edin</h3>
                  <p className="text-xs text-ink-600 mt-0.5">Ürününüzün 8 haneli kodunu girerek CBAM kapsamını ve zorunlu emisyon rotasını saniyeler içinde netleştirin.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-brand-800/15 bg-white p-4 shadow-xs">
                <CheckCircle2 className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black text-ink-900">2. Tesis ve Enerji Tüketimini Girin</h3>
                  <p className="text-xs text-ink-600 mt-0.5">Elektrik, yakıt ve üretim tonajı verilerinizi basit rehber eşliğinde sisteme aktarın.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-brand-800/15 bg-white p-4 shadow-xs">
                <CheckCircle2 className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black text-ink-900">3. Resmi AB Şablonu ve Raporu İndirin</h3>
                  <p className="text-xs text-ink-600 mt-0.5">Avrupa Komisyonu formatında Communication Template ve doğrulamaya hazır 12 parçalı denetim paketini anında teslim alın.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/basla/"
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950 shadow-md transition hover:bg-brand-400"
              >
                Ücretsiz GTİP Sorgulaması Yap <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/fiyatlandirma/"
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-brand-800/20 bg-white px-5 text-sm font-black text-brand-900 transition hover:bg-brand-50"
              >
                Fiyatlandırmayı İncele
              </Link>
            </div>
          </div>

          {/* Sağ Kolon: Rapor & Kokpit Mockup'ı (Pay'nKolay Cihaz/Tablet Kartı Stili) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border-2 border-brand-800/20 bg-white p-6 sm:p-8 shadow-xl">
              {/* Mockup Üst Bar */}
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black tracking-wider uppercase text-brand-900">
                    SKDMHesapla Resmi Çıktı Paneli
                  </span>
                </div>
                <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-bold text-brand-900 border border-brand-800/15">
                  Doğrulamaya Hazır
                </span>
              </div>

              {/* Mockup Gövde */}
              <div className="mt-5 space-y-4">
                {/* Tesis ve Ürün Bilgisi */}
                <div className="rounded-2xl bg-[#f7faf5] border border-brand-800/10 p-4">
                  <div className="flex justify-between items-center text-xs text-ink-600 font-semibold">
                    <span>Tesis: Örnek İhracatçı Tesis A.Ş.</span>
                    <span>Dönem: 2026/Q1</span>
                  </div>
                  <div className="mt-2 text-sm font-black text-ink-900">
                    Sıcak Haddelenmiş Rulo Sac (GTİP: 7208 37 00)
                  </div>
                </div>

                {/* Emisyon Skor Kartı */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-line bg-white p-3.5 text-center shadow-xs">
                    <span className="block text-[11px] font-semibold text-ink-500 uppercase">Toplam Gömülü Emisyon</span>
                    <span className="mt-1 block text-2xl font-black text-brand-800">1.428</span>
                    <span className="block text-[10px] font-bold text-ink-600">t CO₂e / ton ürün</span>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-3.5 text-center shadow-xs">
                    <span className="block text-[11px] font-semibold text-ink-500 uppercase">Kapsam 1 + Kapsam 2</span>
                    <span className="mt-1 block text-2xl font-black text-ink-900">1.12 + 0.31</span>
                    <span className="block text-[10px] font-bold text-emerald-700">Resmi Katsayı Uyumlu</span>
                  </div>
                </div>

                {/* Dosya Paketleri */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-line bg-white p-3 text-xs font-bold text-ink-800">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      <span>cbam_communication_template.xlsx</span>
                    </div>
                    <span className="text-emerald-700 font-black">Hazır</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-line bg-white p-3 text-xs font-bold text-ink-800">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-brand-700" />
                      <span>12 Parçalı Denetçi Çalışma Arşivi (.zip)</span>
                    </div>
                    <span className="text-brand-900 font-black">Mühürlü</span>
                  </div>
                </div>

                {/* SHA-256 Dijital Mühür */}
                <div className="rounded-xl bg-slate-900 p-3 text-[10px] font-mono text-slate-300 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-amber-400 font-bold">SHA-256:</span> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b...
                  </div>
                  <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                </div>

                {/* Mockup Buton */}
                <div className="pt-1">
                  <div className="w-full py-3 rounded-xl bg-brand-500 text-brand-950 font-black text-xs text-center flex items-center justify-center gap-2 shadow-sm">
                    <Download className="h-4 w-4" />
                    Resmi Rapor Paketini İndir (.ZIP)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BÖLÜM: NEDEN SKDMHESAPLA? (PDF SAYFA 21 TARZI 6 NUMARALI AVANTAJ KARTI) */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-900 border border-brand-800/20">
            Farkımız
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-ink-900">
            Neden SKDMHesapla?
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-ink-700">
            Geleneksel pahalı danışmanlık süreçlerine karşı dijital, hızlı, şeffaf ve güvenli ihracatçı altyapısı.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyUsItems.map((item) => (
            <div
              key={item.num}
              className="flex flex-col justify-between rounded-3xl border border-brand-800/15 bg-white p-6 shadow-xs hover:border-brand-800/35 hover:shadow-md transition"
            >
              <div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-500 text-sm font-black text-brand-950 shadow-xs">
                  {item.num}
                </span>
                <h3 className="mt-4 text-lg font-black text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700 font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BÖLÜM: ALTYAPI VE GÜVENLİK KONTROLLERİ (PDF SAYFA 5 TARZI 6 İKONLU KART) */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="rounded-3xl border border-line bg-[#0d2218] p-8 sm:p-12 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-300 border border-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
              Kurumsal Güvence
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight">
              Altyapı ve Güvenlik Standartları
            </h2>
            <p className="mt-2 text-sm sm:text-base font-medium text-slate-300">
              Fabrikanızın ticari mahremiyeti ve AB gümrük süreçleriniz için tavizsiz güvenlik protokolleri.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {securityControls.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xs hover:bg-white/[0.08] transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-black text-white">
                    {sec.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300 font-medium">
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
