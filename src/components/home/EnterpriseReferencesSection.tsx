import React from "react";
import { Award, Building, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

// PDF Sayfa 23 Referanslarımız Tarzı: 24 Sektör Devi ve Kurumsal İhracat Ekosistemi
const references = [
  // Demir-Çelik
  { name: "Çolakoğlu Metalurji Ekosistemi", sector: "Demir-Çelik", badge: "Haddehane & Ark Ocağı" },
  { name: "Diler Demir Çelik Tedarikçileri", sector: "Demir-Çelik", badge: "İnşaat Demiri & Kütük" },
  { name: "Kroman Çelik Sanayi Ağı", sector: "Demir-Çelik", badge: "Profil & Filmaşin" },
  { name: "Tosyalı Holding İhracat Ağı", sector: "Demir-Çelik", badge: "Boru & Rulo Sac" },
  { name: "İçdaş Çelik Enerji Ağı", sector: "Demir-Çelik", badge: "Yüksek Fırın & Enerji" },
  { name: "Kaptan Demir Çelik Paydaşları", sector: "Demir-Çelik", badge: "Kütük & Çelik Hasır" },

  // Alüminyum
  { name: "Assan Alüminyum İhracatçıları", sector: "Alüminyum", badge: "Yassı Hadde & Folyo" },
  { name: "Asaş Alüminyum Ekstrüzyon", sector: "Alüminyum", badge: "Mimari & Sanayi Profil" },
  { name: "Teknik Alüminyum İş Ortakları", sector: "Alüminyum", badge: "Levha & Rulo Döküm" },
  { name: "Akpa Alüminyum İhracat Ağı", sector: "Alüminyum", badge: "Kompozit & Profil" },

  // Çimento & Gübre
  { name: "Akçansa Çimento Tedarik Ağı", sector: "Çimento", badge: "Gri Çimento & Klinker" },
  { name: "Çimsa Beyaz Çimento Ağı", sector: "Çimento", badge: "Beyaz Çimento & Kalsiyum" },
  { name: "Nuh Çimento Sanayi Ekosistemi", sector: "Çimento", badge: "Klinker & Özel Çimento" },
  { name: "Toros Tarım & Gübre Ağı", sector: "Gübre", badge: "Üre, Amonyak & Kompoze" },
  { name: "İgsaş Gübre Sanayi İhracatı", sector: "Gübre", badge: "Azotlu & Sıvı Gübre" },
  { name: "Gübretaş Tedarik Zinciri", sector: "Gübre", badge: "Fosfatlı & Kimyasal Gübre" },

  // Dağıtım, Gümrük ve Lojistik
  { name: "Yetkilendirilmiş Gümrük Müşavirlikleri (YGM)", sector: "Dağıtım & Gümrük", badge: "35+ Gümrük Ofisi" },
  { name: "İMMİB & TİM İhracatçı Üyeleri", sector: "İhracatçı Birlikleri", badge: "Metal & Maden İhracatı" },
  { name: "Uluslararası Dış Ticaret & Lojistik", sector: "Lojistik & Taşıma", badge: "AB Gümrükleme" },
  { name: "Arkas & Turkon Denizcilik Ağı", sector: "Denizcilik", badge: "EU MRV & ETS Uyumlu" },
  { name: "Avrupa Birliği İthalatçı Ağları (Almanya/İtalya)", sector: "AB Satış Kanalı", badge: "EU Declarants" },
  { name: "ISO 14064 / 14065 Denetim Paydaşları", sector: "Denetim & Doğrulama", badge: "Akredite Hazırlık" },
  { name: "Kroman Çelik Sanayi Ağı", sector: "Sanayi Altyapısı", badge: "Ark Ocağı Standardı" },
  { name: "Ereğli & İskenderun Tedarikçileri", sector: "Yassı Çelik", badge: "Entegre Tesis Standardı" },
];

export function EnterpriseReferencesSection() {
  return (
    <section className="border-b border-line bg-gradient-to-b from-[#f7faf5] via-white to-[#f7faf5] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Başlık Alanı (PDF Sayfa 23 Stili) */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-900 border border-brand-800/20">
            <Award className="h-3.5 w-3.5 text-brand-700" />
            Sektörel Güven &amp; Ekosistem
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#0a2016]">
            Referanslarımız &amp; İhracatçı Ekosistemimiz
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-[#1b3d2c]">
            Türkiye’nin lider sanayi kuruluşları, metal üreticileri, dış ticaret devleri ve yetkilendirilmiş gümrük müşavirlikleri SKDMHesapla altyapısıyla çalışıyor.
          </p>
        </div>

        {/* Güven Sayaçları Barı - Yüksek Kontrast */}
        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <div className="rounded-2xl border-2 border-brand-800/20 bg-white p-5 text-center shadow-xs">
            <span className="block text-3xl sm:text-4xl font-black text-brand-800">569+</span>
            <span className="mt-1 block text-xs sm:text-sm font-extrabold text-[#0a2016]">Resmi CN / GTİP Kapsamı</span>
          </div>
          <div className="rounded-2xl border-2 border-brand-800/20 bg-white p-5 text-center shadow-xs">
            <span className="block text-3xl sm:text-4xl font-black text-brand-800">%100</span>
            <span className="mt-1 block text-xs sm:text-sm font-extrabold text-[#0a2016]">Avrupa Komisyonu Uyumu</span>
          </div>
          <div className="rounded-2xl border-2 border-brand-800/20 bg-white p-5 text-center shadow-xs">
            <span className="block text-3xl sm:text-4xl font-black text-brand-800">35+</span>
            <span className="mt-1 block text-xs sm:text-sm font-extrabold text-[#0a2016]">Partner Gümrük Müşavirliği</span>
          </div>
          <div className="rounded-2xl border-2 border-brand-800/20 bg-white p-5 text-center shadow-xs">
            <span className="block text-3xl sm:text-4xl font-black text-brand-800">0 Ceza</span>
            <span className="mt-1 block text-xs sm:text-sm font-extrabold text-[#0a2016]">Gümrük Format Ret Riski</span>
          </div>
        </div>

        {/* 24 Referans Kartı Izgarası (PDF Sayfa 23 Temiz Beyaz Kartlar) */}
        <div className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {references.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-2xl border-2 border-brand-800/10 bg-white p-4 shadow-xs hover:border-brand-800/40 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 truncate">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800 border border-brand-800/20">
                  <Building className="h-5 w-5" />
                </span>
                <div className="truncate">
                  <h3 className="text-xs sm:text-sm font-black text-[#0a2016] truncate">
                    {item.name}
                  </h3>
                  <span className="block text-[11px] font-bold text-brand-700">
                    {item.sector}
                  </span>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-950 border border-emerald-300">
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Alt Güvence İmzası */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-bold text-[#1b3d2c]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-brand-700 shrink-0" />
            T.C. Ticaret Bakanlığı ve AB Takvimine Uyumlu
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-brand-700 shrink-0" />
            Gümrük Müşavirleri ve İhracatçılar İçin Ortak Platform
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-brand-700 shrink-0" />
            Bağımsız Akredite Doğrulayıcı Standartlarında
          </span>
        </div>
      </div>
    </section>
  );
}
