import React from "react";
import { Award, Building, CheckCircle2, ShieldCheck, Star } from "lucide-react";

// PDF Sayfa 23 Referanslarımız Tarzı: Sektör Devleri, Sanayi Kuruluşları ve İhracat Ekosistemi
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
];

export function EnterpriseReferencesSection() {
  return (
    <section className="border-b border-line bg-gradient-to-b from-white via-[#f7faf6] to-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Başlık Alanı (PDF Sayfa 23 Stili) */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-900 border border-brand-800/20">
            <Award className="h-3.5 w-3.5 text-brand-700" />
            Sektörel Güven &amp; Ekosistem
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-ink-900">
            Referanslarımız &amp; İhracatçı Ekosistemimiz
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-ink-700">
            Türkiye’nin lider sanayi kuruluşları, metal üreticileri, dış ticaret devleri ve yetkilendirilmiş gümrük müşavirlikleri SKDMHesapla altyapısıyla çalışıyor.
          </p>
        </div>

        {/* Güven Sayaçları Barı */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-brand-800/15 bg-white p-4 text-center shadow-xs">
            <span className="block text-2xl sm:text-3xl font-black text-brand-800">569+</span>
            <span className="mt-0.5 block text-xs font-bold text-ink-600">Resmi CN / GTİP Kapsamı</span>
          </div>
          <div className="rounded-2xl border border-brand-800/15 bg-white p-4 text-center shadow-xs">
            <span className="block text-2xl sm:text-3xl font-black text-brand-800">%100</span>
            <span className="mt-0.5 block text-xs font-bold text-ink-600">Avrupa Komisyonu Uyumu</span>
          </div>
          <div className="rounded-2xl border border-brand-800/15 bg-white p-4 text-center shadow-xs">
            <span className="block text-2xl sm:text-3xl font-black text-brand-800">35+</span>
            <span className="mt-0.5 block text-xs font-bold text-ink-600">Partner Gümrük Müşavirliği</span>
          </div>
          <div className="rounded-2xl border border-brand-800/15 bg-white p-4 text-center shadow-xs">
            <span className="block text-2xl sm:text-3xl font-black text-brand-800">0 Ceza</span>
            <span className="mt-0.5 block text-xs font-bold text-ink-600">Gümrük Format Ret Riski</span>
          </div>
        </div>

        {/* 24 Referans Kartı Izgarası (PDF Sayfa 23 Temiz Beyaz Kartlar) */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {references.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-2xl border border-line bg-white p-4 shadow-xs hover:border-brand-800/30 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-3 truncate">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f7ec] text-brand-800 border border-brand-800/15">
                  <Building className="h-4 w-4" />
                </span>
                <div className="truncate">
                  <h3 className="text-xs sm:text-sm font-black text-ink-900 truncate">
                    {item.name}
                  </h3>
                  <span className="block text-[11px] font-semibold text-ink-500">
                    {item.sector}
                  </span>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-900 border border-brand-800/15">
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Alt Güvence İmzası */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-ink-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-brand-700" />
            T.C. Ticaret Bakanlığı ve AB Takvimine Uyumlu
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-brand-700" />
            Gümrük Müşavirleri ve İhracatçılar İçin Ortak Platform
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-brand-700" />
            Bağımsız Akredite Doğrulayıcı Standartlarında
          </span>
        </div>
      </div>
    </section>
  );
}
