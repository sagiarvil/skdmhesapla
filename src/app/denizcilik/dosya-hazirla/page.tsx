import type { Metadata } from "next";
import Link from "next/link";
import {
  Ship,
  Anchor,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  FileCheck2,
  Download,
  Fuel,
  Compass,
  FileSpreadsheet,
} from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { DenizcilikHazirlaForm } from "./DenizcilikHazirlaForm";
import { MaritimeRegulatoryMatchBanner } from "@/components/maritime/MaritimeRegulatoryMatchBanner";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/dosya-hazirla/",
  title: "THETIS-MRV XML ve FuelEU Uyum Dosyası Hazırlama (599 USD) | SKDMHesapla",
  description:
    "Gemi başına yıllık 599 USD. Akredite doğrulayıcı incelemesine hazır 9 yasal klasörlük mühürlü THETIS-MRV XML ve FuelEU uyum veri paketini indirin.",
});

const features = [
  {
    title: "1 gemi · 1 raporlama yılı · tek seferlik",
    desc: "Abonelik yok, gizli taahhüt yok. Seçilen geminin tüm takvim yılı sefer ve yakıt verileri için kalıcı uyum dosyası.",
  },
  {
    title: "EU MRV + EU ETS + FuelEU Maritime",
    desc: "3 temel AB denizcilik regülasyonunu tek hesaplama izinde birleştiren eksiksiz teknik veri omurgası.",
  },
  {
    title: "Voyage + fuel + evidence veri omurgası",
    desc: "Liman kalışları, sefer koordinatları, BDN (Bunker Delivery Notes) ve yakıt tüketim kayıtlarının izlenebilir zinciri.",
  },
  {
    title: "READY FOR VERIFICATION hazırlık kapısı",
    desc: "DNV, Bureau Veritas, RINA gibi IACS üyesi yetkili klas kuruluşları ve akredite verifier'ların doğrudan inceleyeceği denetim düzeni.",
  },
  {
    title: "Değişmez snapshot + yeniden indirme",
    desc: "Kriptografik SHA-256 bütünlük özeti ile mühürlenmiş, denetim takviminde dilediğiniz an tekrar erişilebilir arşiv.",
  },
] as const;

export default function DenizcilikDosyaHazirlaPage() {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <RegistryJsonLd route="/denizcilik/dosya-hazirla/" />

      {/* Hero & Başlık */}
      <section className="border-b border-line bg-gradient-to-b from-[#f0f5f7] to-white py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href="/denizcilik/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-900 hover:underline"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Denizcilik ve Lojistik Karbonu Rehberi
            </a>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-800/20 bg-white px-3.5 py-1 text-xs font-black uppercase tracking-wider text-sky-950 shadow-sm">
              <Anchor className="h-3.5 w-3.5 text-sky-700" />
              599 USD · Tek Seferlik · 1 Gemi / 1 Raporlama Yılı
            </div>
          </div>

          <span className="mt-5 inline-block rounded-full bg-sky-950 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/30">
            TEKNİK UYUM VE VERİ MÜHÜRLEME SİSTEMİ
          </span>

          <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">
            Klas Denetimine Hazır Gemi Uyum Paketi Oluşturucu
          </h1>
          <p className="mt-2 text-sm font-bold text-sky-950">
            1 Gemi · 1 Raporlama Yılı · 599 USD (Tek Seferlik Ücret)
          </p>

          {/* Denizcilik Mevzuat ve Servis Şartnamesi */}
          <div className="hero-answer-engine mt-6 max-w-3xl rounded-2xl border border-sky-900/15 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-sky-950">
              Mevzuat Standartları ve Teknik Dosya Şartnamesi (AB 2015/757 &amp; AB 2023/1805)
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-ink-800">
              Denizcilik Karbon Uyum Hazırlık Dosyası; 5.000 GT ve üzeri ticari gemiler için AB Direktifi 2023/957 (EU ETS Maritime),
              AB Tüzüğü 2023/1805 (FuelEU Maritime) ve AB Tüzüğü 2015/757 (EU MRV) standartlarında hazırlanan teknik denetim paketidir.
              Gemi işletmecileri (ISM Companies) ve armatörler için seferlik yakıt (BDN), liman süreleri ve sera gazı yoğunluğunu tek veri omurgasında
              birleştirir. <strong>599 USD tek seferlik bedelle</strong> akredite klas kuruluşlarına (DNV, BV, RINA vb.) sunulmaya hazır mühürlü dosya üretir.
            </p>
          </div>

          {/* Hızlı Aksiyon Butonları */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#form-section"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-900 px-6 text-sm font-black text-white hover:bg-sky-800 transition shadow-md"
            >
              Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD) <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/denizcilik/#simulator"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-sky-800/30 bg-white px-5 text-sm font-bold text-sky-950 hover:bg-sky-50 transition shadow-xs"
            >
              İhracatçı Navlun Sürşarjı Simülatörüne İn ↓
            </Link>
          </div>
        </div>
      </section>

      {/* 2 Sütunlu Çalışma Alanı: Sol Form / Sağ Paket Özeti */}
      <section id="form-section" className="scroll-mt-20 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 space-y-12">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Sol: Gemi & Sefer Veri Giriş Konsolu (7 Kolon) */}
            <div className="lg:col-span-7">
              <DenizcilikHazirlaForm />
            </div>

            {/* Sağ: Paket Detayları, Fiyat ve Kapsam (5 Kolon) */}
            <div className="space-y-6 lg:col-span-5">
              {/* Fiyat Kartı */}
              <div className="rounded-3xl border-2 border-sky-900/20 bg-gradient-to-br from-[#071926] to-[#0c2a3f] p-6 text-white shadow-md sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-sky-500/20 px-3 py-1 text-xs font-black text-sky-300">
                    ÖZEL DENİZCİLİK PAKETİ
                  </span>
                  <Ship className="h-6 w-6 text-sky-400" />
                </div>

                <h2 className="mt-4 text-xl font-black sm:text-2xl">
                  Denizcilik Karbon Uyum Hazırlık Dosyası
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white sm:text-5xl">599 USD</span>
                  <span className="text-xs font-medium text-slate-300">/ 1 gemi · 1 raporlama yılı</span>
                </div>
                <p className="mt-2 text-xs text-sky-200">
                  Tek seferlik ödeme. Sıfır abonelik. Değişmez snapshot ve süresiz yeniden indirme hakkı.
                </p>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                  {features.map((feat) => (
                    <div key={feat.title} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                      <div>
                        <div className="text-xs font-bold text-white">{feat.title}</div>
                        <div className="text-[11px] text-slate-300 leading-4">{feat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center text-xs text-slate-300">
                  <Lock className="inline mr-1.5 h-3.5 w-3.5 text-sky-400" />
                  Ödeme Paddle güvencesiyle kredi kartı veya havale/EFT ile alınır.
                </div>
              </div>

              {/* 9 Yasal Klasörlük Mühürlü Paket Teslimat Kartı */}
              <div className="rounded-2xl border-2 border-sky-400/40 bg-gradient-to-br from-[#071d2e] to-[#0b2d45] p-5 text-white shadow-md">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <FileCheck2 className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300">
                    Ödeme Sonrası Anında Üretilecek 9 Yasal Klasörlük Mühürlü Paket:
                  </h3>
                </div>
                <ul className="mt-3.5 space-y-2 text-xs text-sky-100 font-medium leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">1.</span>
                    <span>Part A-G EMSA Uyumlu THETIS-MRV Doğrulama XML Dosyası</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">2.</span>
                    <span>FuelEU Maritime Sera Gazı Yoğunluğu ve Ceza/Denge Tablosu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">3.</span>
                    <span>Türkiye-AB Sefer Paylaşım Matrisi (%50 Kapsam Hesap Özeti)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">4.</span>
                    <span>EUA Karbon Tahsisat Açığı ve Teslim Yükümlülüğü Finansal Dökümü</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">5.</span>
                    <span>Akredite Doğrulayıcı İnceleme Özeti (Pre-Audit Executive Dossier)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">6.</span>
                    <span>SHA-256 Kriptografik Değişmezlik ve Zaman Damgası Sertifikası</span>
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-300 leading-normal">
                  <strong>Yasal Bildirim:</strong> Bu dosya akredite klas kuruluşlarının (DNV, RINA vb.) sistemlerine doğrudan yüklenmek üzere mevzuat şemasına tam uyumlu teknik veri tabanı olarak üretilir.
                </div>
              </div>

              {/* Hukuki Sınır Kartı */}
              <div className="rounded-2xl border border-line bg-[#fbfdfb] p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-sky-800" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-ink-900">
                    Akreditasyon ve Rol Ayrımı
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-700">
                  SKDMHesapla akredite klas kuruluşu (IACS) veya bağımsız MRV verifier değildir.
                  Sistemimiz, armatörlerin ve ISM şirketlerinin sefer, bunker ve yakıt kayıtlarını AB standartlarına
                  göre toplayıp hesap izi kurarak <strong>doğrulayıcı incelemesine hazır hale getiren</strong> teknik yazılım altyapısıdır.
                </p>
              </div>

              {/* Sanayi CBAM vs Denizcilik Ayrımı */}
              <div className="rounded-2xl border border-amber-800/20 bg-amber-50/50 p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
                  Sanayi CBAM Raporundan Neden Farklıdır?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-amber-900">
                  Karadaki fabrikalar için uygulanan SKDM (4.900 TL), ürün GTİP kodları ve öncül maddeler üzerinden yürür.
                  Denizcilik Uyum Dosyası (599 USD) ise doğrudan <strong>gemi IMO numarası</strong>, sefer koordinatları ve bunker yakıt yoğunluğu (FuelEU) üzerinden gemi işletmecisine özel olarak yapılandırılmıştır.
                </p>
              </div>
            </div>
          </div>

          {/* AB Mevzuat Eşleşme ve Doğru Ürün Teyit Kartı */}
          <MaritimeRegulatoryMatchBanner />
        </div>
      </section>

      {/* Alt Aksiyon Alanı */}
      <section className="border-t border-line/60 bg-gradient-to-b from-[#f7fafc] to-[#edf4f9] py-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-sky-950">
            Denizcilik Karbon Uyum Dosyası ve Navlun Simülatörü
          </h2>
          <p className="text-xs sm:text-sm text-ink-700 max-w-2xl mx-auto">
            Gemi sefer kütüğü, BDN yakıt kayıtları ve FuelEU hesaplamalarını doğrudan klas denetimine hazır formata dönüştürün veya navlun sürşarjı etkisini simüle edin.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3.5">
            <a
              href="#form-section"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-900 px-7 text-sm font-black text-white hover:bg-sky-800 transition shadow-md"
            >
              Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD) <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/denizcilik/#simulator"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-sky-800/30 bg-white px-6 text-sm font-bold text-sky-950 hover:bg-sky-50 transition shadow-xs"
            >
              İhracatçı Navlun Sürşarjı Simülatörüne İn ↓
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
