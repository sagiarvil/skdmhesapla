import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Lock,
  FileSpreadsheet,
  FileCode2,
  FileText,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";

export const metadata: Metadata = {
  title: "Fiyatlandırma — Şeffaf Tek Fiyat, Mühür Öncesi Tamamen Ücretsiz",
  description:
    "SKDM denetime hazırlık dosyanızı hazırlamak tamamen ücretsizdir. Yalnızca nihai mühürlü paket üretiminde tek fiyat: 9.900 ₺ (KDV dahil).",
};

const DAHIL_DOSYALAR = [
  {
    icon: FileText,
    title: "1. İzleme Planı (PDF)",
    desc: "IR 2025/2547 formatında: tesis tanımı, kaynak akışları, ölçüm yöntemleri ve veri kalite yaklaşımınız.",
  },
  {
    icon: FileText,
    title: "2. Tesis Emisyon Raporu (PDF)",
    desc: "10 katmanlı tesis, kaynak akışları, öncül maddeler ve süreç emisyon dökümünü içeren ana rapor.",
  },
  {
    icon: FileCheck,
    title: "3. Emisyon Hesaplama Eki (PDF)",
    desc: "AB 2023/956 ve IR 2025/2547 madde referanslı şeffaf matematiksel hesaplama dökümü.",
  },
  {
    icon: FileSpreadsheet,
    title: "4. AB İletişim Şablonu (XLSX)",
    desc: "AB Komisyonu'nun yayımladığı resmi iletişim şablonu (Communication Template) formatında doldurulmuş çalışma kitabı.",
  },
  {
    icon: FileText,
    title: "5. Alıcı Paketi (PDF)",
    desc: "İthalatçınızın göreceği sürüm: gömülü emisyon özetleri ve sertifika maliyeti projeksiyonu; ölçüm kanıtlarınızı içermez.",
  },
  {
    icon: FileSpreadsheet,
    title: "6. Doğrulayıcı Çalışma Alanı (XLSX)",
    desc: "Akredite bağımsız doğrulayıcının denetim adımlarını doğrudan yürütebileceği ön-doldurulmuş çalışma şablonu.",
  },
  {
    icon: FileText,
    title: "7. İşletmeci Arşiv Kopyası (PDF)",
    desc: "Kendi kayıtlarınız için tam sürüm; 5 yıllık saklama yükümlülüğünüzü karşılayacak kapsamda.",
  },
  {
    icon: FileSpreadsheet,
    title: "8. Kanıt Kayıt Defteri (XLSX)",
    desc: "Fatura, sayaç, kalibrasyon ve laboratuvar ölçüm kayıtlarının denetçiye sunulacağı tablo.",
  },
  {
    icon: FileCode2,
    title: "9. Hesaplama İzi (JSON)",
    desc: "Ruleset sürümü, çeyreklik ETS fiyatı ve ham girdileri içeren makine-okunabilir denetim izi.",
  },
  {
    icon: Lock,
    title: "10. Manifest ve SHA-256 Dijital Mühür",
    desc: "Paketteki tüm dosyaların bütünlüğünü kilitleyen ve /dogrula/ sayfasından teyit edilebilen master imza.",
  },
  {
    icon: FileCheck,
    title: "11. Mühür Doğrulama Belgesi (PDF)",
    desc: "Alıcınızın veya doğrulayıcınızın paketin özgünlüğünü /dogrula/ üzerinden nasıl teyit edeceğini açıklayan kılavuz.",
  },
];

const SSS_LISTESI = [
  {
    s: "Mühürleme öncesinde herhangi bir ücret öder miyim?",
    c: "Hayır. Sektör seçimi, GTİP arama, 10 katmanlı veri girişi, ipucu panelleri, taslak kaydı ve maliyet projeksiyonu tamamen ücretsizdir. Kredi kartı bilgisi dahi istenmez. Yalnızca dosyanızı kilitleyip mühürlü paketi indirmek istediğinizde tek seferlik ödeme alınır.",
  },
  {
    s: "Doğrulayıcı veya alıcım bu dosyayı kabul eder mi?",
    c: "Dosyalar AB Komisyonu'nun kesin dönem uygulama tüzüğü (IR 2025/2547) yapısında ve resmi iletişim şablonu formatında üretilir; akredite doğrulayıcının ihtiyaç duyacağı denetim kanıtları pakete dahildir. Nihai kabul kararı her zaman alıcınıza ve doğrulayıcıya aittir.",
  },
  {
    s: "Fatura kesiliyor mu ve KDV dahil mi?",
    c: "Evet. 9.900 ₺ bedel KDV dahildir. Ödemeniz sonrasında şirketiniz adına e-fatura düzenlenerek e-posta adresinize iletilir.",
  },
  {
    s: "Mühürleme sonrası dosyada bir düzeltme yapmam gerekirse?",
    c: "Aynı dosya üzerinde yapılacak düzeltmeler ve kalite kontrolleri sonrasında yeniden mühürleme ve indirme işlemleri ücretsizdir. Yeni bir tesis veya yeni bir dönem için yeni dosya ve yeni ödeme gerekir.",
  },
];

export default function FiyatlandirmaPage() {
  const fiyat = PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR");

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#faeed6] py-10 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        {/* ÜST BAŞLIK */}
        <div className="space-y-3 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Şeffaf ve Sabit Fiyatlandırma
          </span>
          <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-ink-900 sm:text-[40px] md:text-[44px]">
            Mühür Öncesi Her Şey Ücretsiz.
            <br />
            <span className="text-brand-800">Yalnızca Hazır Dosyanız İçin Tek Fiyat.</span>
          </h1>
          <p className="max-w-3xl text-base font-normal leading-relaxed text-ink-700 sm:text-[18px]">
            Danışmanlık firmaları aynı iş için 50.000 ₺ – 200.000 ₺ ister. SKDMHesapla ile dosyanızı
            kendiniz hazırlar, yalnızca bir günde ve çok daha düşük bir bedelle tamamlarsınız.
          </p>
        </div>

        <DisclaimerBanner />

        {/* ANA FİYATLANDIRMA KARTI */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between rounded-card border-2 border-brand-500 bg-white p-7 shadow-xl">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
                <div>
                  <span className="rounded-pill bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-900 border border-brand-500/30">
                    Çıktı Standardı
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-ink-900 sm:text-[24px]">
                    Mühürlü Denetime Hazırlık Paketi
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-4xl sm:text-5xl font-black text-ink-900 tabular-nums">
                    {fiyat} ₺
                  </div>
                  <div className="text-xs font-bold text-brand-800 uppercase tracking-wide">
                    KDV Dahil · Tek Seferlik
                  </div>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm font-semibold text-ink-900">
                {[
                  "IR 2025/2547 formatında izleme planı ve emisyon raporu",
                  "11 dosyadan oluşan mühürlü ZIP paketi",
                  "AB iletişim şablonu (Communication Template) çıktısı",
                  "Alıcı, doğrulayıcı ve işletmeci için ayrı paket görünümleri",
                  "SHA-256 dijital bütünlük imzası",
                  "Sınırsız ön-kontrol ve kalite kapısı (QC) doğrulaması",
                  "Anında indirilebilir dijital teslimat",
                ].map((madde) => (
                  <li key={madde} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-green" />
                    <span>{madde}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <Link
                href="/basla/"
                className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-ctl bg-brand-500 px-6 text-lg font-bold text-brand-900 shadow-md transition hover:bg-brand-400 hover:shadow-lg"
              >
                <span>Hemen Ücretsiz Başla</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-2 text-center text-xs font-medium text-ink-600">
                Hesaplama ve taslak oluşturma tamamen ücretsizdir. Kredi kartı istenmez.
              </p>
            </div>
          </div>

          {/* SAĞ SÜTUN */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-card border-2 border-line bg-brand-900 p-7 text-white shadow-xl">
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-brand-500" />
                <span>Neden SKDMHesapla?</span>
              </h3>
              <div className="space-y-4 text-sm text-brand-mist font-medium leading-relaxed">
                <div className="rounded-ctl border border-brand-500/25 bg-brand-950/60 p-4">
                  <div className="font-bold text-white mb-1">Geleneksel Danışmanlık:</div>
                  <p className="text-xs text-brand-tint">
                    50.000 ₺ – 200.000 ₺ maliyet, haftalarca süren e-posta trafiği ve veri gizliliği riskleri.
                  </p>
                </div>

                <div className="rounded-ctl border border-accent-green/40 bg-accent-green/10 p-4">
                  <div className="font-bold text-accent-green mb-1">SKDMHesapla Self-Servis:</div>
                  <p className="text-xs text-white">
                    9.900 ₺ sabit tek fiyat, aynı gün içinde denetime hazır dosya, verileriniz yalnızca sizde kalır.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-brand-800/80 pt-4 flex items-center justify-between text-xs text-brand-tint">
              <span>Kurumsal E-Fatura Düzenlenir</span>
              <span>•</span>
              <span>256-Bit SSL Güvenliği</span>
            </div>
          </div>
        </div>

        {/* PAKET İÇERİĞİ */}
        <section className="space-y-6 rounded-card border-2 border-line bg-white p-7 shadow-card">
          <div>
            <span className="rounded-pill bg-brand-100 px-3 py-1 text-xs font-bold text-brand-900 border border-brand-500/20">
              Paket İçeriği
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-ink-900">
              Mühürlü Pakette Neler Var? (11 Dosya)
            </h2>
            <p className="text-sm font-medium text-ink-700 mt-1">
              Ödeme yapıldığında sistemimiz bu 11 dosyayı tek bir ZIP arşivi içinde teslim eder:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DAHIL_DOSYALAR.map((d) => (
              <div
                key={d.title}
                className="rounded-ctl border border-line bg-soft-section p-4 space-y-2 hover:border-brand-500 transition-colors"
              >
                <div className="flex items-center gap-2.5 font-bold text-ink-900 text-sm">
                  <d.icon className="h-5 w-5 shrink-0 text-brand-800" />
                  <span>{d.title}</span>
                </div>
                <p className="text-xs leading-relaxed text-ink-700 font-medium">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SIKÇA SORULAN SORULAR */}
        <section className="space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-ink-900">Sıkça Sorulan Sorular</h2>
            <p className="text-sm font-medium text-ink-700 mt-1">
              Fiyatlandırma ve ödeme süreçleri hakkında merak edilenler.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SSS_LISTESI.map((item) => (
              <div
                key={item.s}
                className="rounded-card border-2 border-line bg-white p-5 shadow-sm space-y-2"
              >
                <h3 className="font-bold text-ink-900 text-base flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 shrink-0 text-brand-800 mt-0.5" />
                  <span>{item.s}</span>
                </h3>
                <p className="text-sm leading-relaxed text-ink-700 font-medium pl-7">{item.c}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ALT CTA */}
        <div className="rounded-card border-2 border-brand-500/40 bg-brand-950 p-8 text-center text-white shadow-xl space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Karbon Maliyetinizi ve Dosyanızı Ücretsiz Hesaplayın
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-mist">
            Sihirbazı hemen başlatın, adımları tamamlayın ve mühür öncesi tüm analizlerinizi görün.
          </p>
          <div>
            <Link
              href="/basla/"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-ctl bg-brand-500 px-8 text-lg font-bold text-brand-900 hover:bg-brand-400 shadow-md transition"
            >
              <span>Hesaplamayı Başlat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
