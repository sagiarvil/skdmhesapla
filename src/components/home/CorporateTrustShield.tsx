import React from "react";
import {
  FileCheck2,
  Lock,
  Scale,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

// PDF Sayfa 5 & 24 Kurumsal Güven, Sertifikasyon ve Altyapı Standartları
const trustPillars = [
  {
    icon: Lock,
    title: "Ticari Sır & Veri Mahremiyeti",
    desc: "Fabrikanızın üretim kapasitesi, enerji maliyetleri ve tedarikçi bilgileri en üst düzey kurumsal şifrelemeyle korunur; asla üçüncü şahıslarla paylaşılmaz.",
    tag: "ISO 27001 Standardı",
  },
  {
    icon: ShieldCheck,
    title: "SHA-256 Kriptografik Dijital Mühür",
    desc: "Üretilen her hesaplama dosyası, geri dönülemez ve değiştirilemez bir SHA-256 sağlama toplamı ile mühürlenir; denetimlerde tahrif edilmediğini kanıtlar.",
    tag: "Değiştirilemez Kütük",
  },
  {
    icon: FileCheck2,
    title: "Avrupa Komisyonu Resmi Şablonu",
    desc: "Raporlama, doğrudan Avrupa Komisyonu resmi Communication Template (XLSX) standartlarıyla %100 birebir eşleme ile üretilir.",
    tag: "(EU) 2023/956 & 2025/2547",
  },
  {
    icon: Scale,
    title: "Akredite Denetçi Uyumu",
    desc: "TÜRKAK ve AB akreditasyonuna sahip bağımsız doğrulayıcıların (verifiers) aradığı 12 parçalı kanıt zinciri ve hesap izi standart olarak sunulur.",
    tag: "Denetime Hazır",
  },
  {
    icon: Server,
    title: "Kesintisiz Bulut Altyapısı & Yedekleme",
    desc: "Yüksek erişilebilirlikli sunucu altyapısı ve coğrafi yedekleme ile ihracat beyanlarınız için 7/24 kesintisiz operasyonel süreklilik sağlanır.",
    tag: "7/24 Kesintisiz",
  },
  {
    icon: Sparkles,
    title: "Sıfır Hata ve Format Güvencesi",
    desc: "Resmi katsayılar ve mevzuat kılavuzları ile eşzamanlı güncellenen sistemimiz sayesinde AB gümrüklerinde format reddi yaşama riski sıfırdır.",
    tag: "%100 Format Garantisi",
  },
];

export function CorporateTrustShield() {
  return (
    <section className="border-b border-line bg-[#061610] py-14 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-300 border border-white/15">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
            Kurumsal Güven &amp; Sertifikasyon
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">
            Bankacılık ve Kurumsal Standartta Güvenlik
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-slate-300">
            Sanayi tesislerinizin ticari sırlarını koruyan, akredite denetçiler tarafından tam kabul gören tavizsiz güvenlik protokolleri.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xs hover:border-brand-500/40 hover:bg-white/[0.07] transition"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-brand-300 border border-white/15">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-black text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
