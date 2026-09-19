import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Globe2,
  Handshake,
  Network,
  Share2,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

// PDF Sayfa 14 & 17 B2B ve Pazar Yeri Tahsilat / Dağıtım Altyapısı Stili
const distributionPillars = [
  {
    title: "Gümrük Müşavirlikleri & YGM",
    desc: "Müşterilerinizin CBAM dosyalarını kendi operasyonel kontrolünüzde hazırlayın. Müşteri ilişkisi tamamen sizde kalsın, teknik hesaplamayı SKDMHesapla motoru yapsın.",
    badge: "Dağıtım Kanalı",
    points: ["Tek panelden 50+ ihracatçı fabrikayı yönetin", "Gümrük beyannameleriyle birebir GTİP eşlemesi", "Hızlı gelir paylaşımı ve operasyon tasarrufu"],
  },
  {
    title: "Dış Ticaret & Sürdürülebilirlik Danışmanları",
    desc: "Karmaşık Excel tabloları ve değişen AB katsayılarıyla boğuşmadan, danışmanlık verdiğiniz sanayi tesislerine akredite seviyede rapor sunun.",
    badge: "Çözüm Ortaklığı",
    points: ["Resmi Communication Template formatında teslimat", "12 parçalı denetçi kanıt kütüğü hazır çıktısı", "Danışmanlık kapasitenizi 5 katına çıkarın"],
  },
  {
    title: "Avrupa Birliği İthalatçıları (EU Buyers)",
    desc: "Türkiye'deki tedarikçi fabrikalarınızdan standart, doğrulanmış ve Brüksel standartlarında emisyon verisi toplayın.",
    badge: "Tedarikçi Satış Kanalı",
    points: ["Tüm Türk tedarikçilerden tek tip veri seti", "Gümrükte ceza ve ret riskine karşı yasal dayanak", "İngilizce ve Türkçe çift dilli veri portalı"],
  },
];

export function B2BDistributionAndSalesChannel() {
  return (
    <section className="border-b border-line bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Başlık Alanı (PDF Sayfa 14 & 24 Stili) */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-900 border border-brand-800/20">
            <Network className="h-3.5 w-3.5 text-brand-700" />
            B2B Dağıtım &amp; Satış Ekosistemi
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-ink-900">
            Gümrük Müşavirleri ve Partner Dağıtım Ağı
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-ink-700">
            SKDMHesapla yalnızca bir hesap aracı değil; Türkiye genelinde gümrük müşavirlikleri, danışmanlar ve ihracatçılar için ortak bir satış ve dağıtım omurgasıdır.
          </p>
        </div>

        {/* 3 Ana Dağıtım Kartı (PDF Sayfa 14 B2B Kırılımı Stili) */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {distributionPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border-2 border-brand-800/15 bg-gradient-to-b from-[#f8fbf6] to-white p-6 sm:p-7 shadow-xs hover:border-brand-800/35 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-bold text-brand-900 border border-brand-800/20">
                    {pillar.badge}
                  </span>
                  <Share2 className="h-4 w-4 text-brand-800" />
                </div>
                <h3 className="mt-4 text-lg font-black text-ink-900 leading-snug">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700 font-medium">
                  {pillar.desc}
                </p>
                <ul className="mt-4 space-y-2 text-xs font-semibold text-ink-800">
                  {pillar.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-800 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  href="/partner-network/"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-brand-900 hover:text-brand-700 hover:underline"
                >
                  Partner Dağıtım Şartlarını İnceleyin <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Kurumsal Satış & Hızlı Başla Çağrı Bloğu (PDF Sayfa 24 Stili) */}
        <div className="mt-12 rounded-3xl border border-brand-800/20 bg-gradient-to-r from-brand-950 via-brand-900 to-[#071812] p-8 text-white sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-brand-300">
                Kurumsal Satış Kanalı
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
                Fabrikanız veya Müşteri Portföyünüz İçin Kurumsal Teklif Alın
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tekil sevkiyatlardan holding düzeyinde çoklu fabrika lisanslarına kadar; ihtiyacınıza özel esnek lisanslama ve doğrudan teknik mühendislik desteği.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <Link
                href="/fiyatlandirma/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950 shadow-md transition hover:bg-brand-400"
              >
                Fiyat Paketlerini Gör <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/iletisim/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 text-sm font-black text-white hover:bg-white/20 transition"
              >
                Kurumsal Teklif İste
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
