"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Cpu,
  Layers,
  Building2,
  Sprout,
  Zap,
  ChevronDown,
  Lock,
  Server,
  Sparkles,
  HelpCircle,
  Calculator,
  Clock,
  DownloadCloud,
  FileCheck2,
  Flame,
  MessageCircle,
  Scale,
  ShieldAlert,
  Sliders,
  TrendingDown,
  QrCode,
  Check,
  ExternalLink,
  Coins,
} from "lucide-react";
import GtipArama from "@/components/GtipArama";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";

interface SectorData {
  slug: string;
  label: string;
  icon: React.ElementType;
  code: string;
  avgIntensity: number; // tCO2e / ton
  scope1Share: number; // %
  scope2Share: number; // %
  desc: string;
  typicalProducts: string;
}

const SECTORS: SectorData[] = [
  {
    slug: "demir-celik",
    label: "Demir-Çelik",
    icon: Layers,
    code: "7201-7326",
    avgIntensity: 1.85,
    scope1Share: 72,
    scope2Share: 28,
    desc: "Yüksek fırın, ark ocağı ve haddehane emisyonları",
    typicalProducts: "Nervürlü demir, sac, profil, tel, vida",
  },
  {
    slug: "aluminyum",
    label: "Alüminyum",
    icon: Building2,
    code: "7601-7616",
    avgIntensity: 6.40,
    scope1Share: 25,
    scope2Share: 75,
    desc: "Elektroliz ve döküm yüksek Kapsam 2 elektrik izi",
    typicalProducts: "Külçe, profil, sac, levha, boru",
  },
  {
    slug: "cimento",
    label: "Çimento",
    icon: Building2,
    code: "2507-2523",
    avgIntensity: 0.82,
    scope1Share: 88,
    scope2Share: 12,
    desc: "Kalsinasyon prosesi ve döner fırın yakıt tüketimi",
    typicalProducts: "Gri klinker, portland çimento, beyaz çimento",
  },
  {
    slug: "gubre",
    label: "Gübre",
    icon: Sprout,
    code: "2808-3105",
    avgIntensity: 2.60,
    scope1Share: 80,
    scope2Share: 20,
    desc: "Amonyak ve nitrik asit N2O ve CO2 reaksiyonları",
    typicalProducts: "Üre, amonyum nitrat, NPK kompoze",
  },
  {
    slug: "elektrik",
    label: "Elektrik",
    icon: Zap,
    code: "2716 00 00",
    avgIntensity: 0.44,
    scope1Share: 95,
    scope2Share: 5,
    desc: "Şebeke iletim ve üretim tesis faktörleri",
    typicalProducts: "Yüksek gerilim enterkonneksiyon iletimi",
  },
  {
    slug: "hidrojen",
    label: "Hidrojen",
    icon: Zap,
    code: "2804 10 00",
    avgIntensity: 8.90,
    scope1Share: 70,
    scope2Share: 30,
    desc: "SMR buhar reformlama veya elektroliz Kapsam 2",
    typicalProducts: "Sıkıştırılmış saf H2, sıvı hidrojen",
  },
];

const QUICK_GTIPS = [
  { gtip: "7208", label: "Sıcak Haddelenmiş Sac" },
  { gtip: "7601", label: "İşlenmemiş Alüminyum" },
  { gtip: "2523", label: "Çimento Klinkeri" },
  { gtip: "3102", label: "Azotlu Mineral Gübre" },
];

const TONNAGE_PRESETS = [100, 500, 1000, 5000];

const MOBILE_FAQS = [
  {
    q: "AB müşterim CBAM raporu istedi, ne yapmalıyım?",
    a: "Önce ihraç ettiğiniz ürünün GTİP/CN kodunun CBAM kapsamında olup olmadığını kontrol edin. Kapsamdaysa, tesisinizin elektrik, yakıt ve girdi tüketim verilerini girerek resmi Communication Template formatında rapor üretin.",
  },
  {
    q: "Ücret ne zaman alınır?",
    a: `GTİP kapsam kontrolü, veri girişi ve hesaplama hazırlığı tamamen ücretsizdir. Yalnızca 12 parçalı resmi mühürlü arşiv paketini indirmek istediğinizde tek seferlik ${PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR")} ₺ (KDV Dahil) ödenir.`,
  },
  {
    q: "Doğrulama (Verification) zorunlu mu?",
    a: "2026 yılından itibaren akredite doğrulayıcı denetimi zorunludur. SKDMHesapla, doğrulayıcının talep edeceği hesap izi, formül dökümü ve kaynak kanıtlarını eksiksiz paketler.",
  },
  {
    q: "50 ton muafiyeti kimleri kapsar?",
    a: "Yıllık net sevkiyatı 50 tonun altında kalan bazı alıcılar için geçici istisnalar bulunsa da AB ithalatçıları tedarikçi emisyon verisini şeffaf olarak talep etmektedir.",
  },
  {
    q: "Rapor Avrupa Komisyonu şablonuyla uyumlu mu?",
    a: "Evet, SKDMHesapla doğrudan Avrupa Komisyonu'nun en güncel resmi CBAM Communication Template (XLSX) yapısına bit-for-bit uyumlu çıktı üretir.",
  },
];

export function MobileHomeCockpit() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  // İnteraktif Simülatör Durumu
  const [selectedSectorSlug, setSelectedSectorSlug] = useState<string>("demir-celik");
  const [tonnage, setTonnage] = useState<number>(500);

  const activeSector = useMemo(() => {
    return SECTORS.find((s) => s.slug === selectedSectorSlug) || SECTORS[0];
  }, [selectedSectorSlug]);

  const calculations = useMemo(() => {
    const totalEmissions = tonnage * activeSector.avgIntensity;
    const s1 = totalEmissions * (activeSector.scope1Share / 100);
    const s2 = totalEmissions * (activeSector.scope2Share / 100);

    // AB Varsayılan Değer Cezası (Komisyon varsayılan değerleri gerçek veriden ~%30 daha yüksektir)
    const defaultEmissions = totalEmissions * 1.32;
    const carbonPriceEUR = 85; // €85/ton ETS ortalaması
    const potentialTaxEUR = Math.round(totalEmissions * carbonPriceEUR);
    const defaultTaxEUR = Math.round(defaultEmissions * carbonPriceEUR);
    const taxSavingEUR = defaultTaxEUR - potentialTaxEUR;

    return {
      total: Math.round(totalEmissions),
      s1: Math.round(s1),
      s2: Math.round(s2),
      potentialTaxEUR,
      defaultTaxEUR,
      taxSavingEUR,
    };
  }, [tonnage, activeSector]);

  return (
    <div className="flex flex-col bg-[#0a1106] text-white">
      {/* 1. TOP LIVE MISSION HUD & TICKER */}
      <div className="sticky top-[56px] z-30 flex items-center justify-between border-b border-white/10 bg-[#0d1607]/95 px-3.5 py-2 backdrop-blur-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#bdd652] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#bdd652]" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#bdd652]">
            2026 AB SKDM MOTORU
          </span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-200">
            EUA: ~€85/t
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-300">
          <Server className="h-3 w-3 text-[#bdd652]" />
          <span>Frankfurt AB Güvencesi</span>
        </div>
      </div>

      {/* 2. HERO COCKPIT (APPLE & STRIPE STANDARD LUXURY FINTECH) */}
      <section className="relative overflow-hidden px-4 pt-6 pb-6">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#bdd652]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-16 -right-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bdd652]/35 bg-[#bdd652]/10 px-3 py-1 text-[10.5px] font-black uppercase tracking-wider text-[#bdd652] shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#bdd652]" />
            Türk İhracatçısı İçin 1 Numaralı CBAM Platformu
          </div>

          {/* Headline */}
          <h1 className="mt-3 text-[30px] font-black leading-[1.10] tracking-tight text-white">
            AB Müşteriniz <span className="text-[#bdd652]">CBAM Raporu</span> mu İstedi?
          </h1>

          <p className="mt-2.5 text-[13px] font-medium leading-relaxed text-slate-300">
            Tahmini ortalamalarla değil; fabrikanızın gerçek elektrik ve yakıt verileriyle,
            Avrupa Komisyonu <strong className="text-white">Communication Template</strong> uyumlu,
            akredite denetime hazır mühürlü dosya hazırlayın.
          </p>

          {/* 3 CANLI TELEMETRİ ROZETİ */}
          <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-center backdrop-blur-xl">
            <div className="flex flex-col py-1">
              <span className="text-[17px] font-black text-[#bdd652] tracking-tight">569</span>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-tighter">CN / GTİP Kodu</span>
            </div>
            <div className="flex flex-col py-1 border-x border-white/10">
              <span className="text-[17px] font-black text-emerald-400 tracking-tight">12 Dosya</span>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-tighter">Resmi Arşiv</span>
            </div>
            <div className="flex flex-col py-1">
              <span className="text-[17px] font-black text-lime-300 tracking-tight">SHA-256</span>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-tighter">Kripto Mühür</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. APPLE WALLET TARZI DİJİTAL ÜRÜN PASAPORTU (DIGITAL PRODUCT PASSPORT) */}
      <section className="px-4 pb-6">
        <div className="relative rounded-3xl border border-[#bdd652]/35 bg-gradient-to-br from-[#18280d] via-[#12200a] to-[#0c1606] p-4.5 text-white shadow-2xl overflow-hidden">
          {/* Holografik Arka Plan Işıltısı */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-[#bdd652]/20 via-transparent to-transparent pointer-events-none" />

          {/* Pasaport Üst Çubuğu */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#bdd652] text-[#142109]">
                <QrCode className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-white block leading-none">
                  CBAM ÜRÜN PASAPORTU
                </span>
                <span className="text-[9px] font-mono text-[#bdd652] leading-tight">
                  EU 2023/956 · SHA-256 DOĞRULANDI
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black text-emerald-300 border border-emerald-500/30">
              <Check className="h-2.5 w-2.5" /> DENETİME HAZIR
            </span>
          </div>

          {/* Pasaport Gövdesi */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-white/[0.04] p-2.5 border border-white/5">
              <span className="text-[9.5px] text-slate-400 block uppercase">Ürün / Sektör</span>
              <strong className="text-white text-[12px] block truncate">{activeSector.label}</strong>
              <span className="text-[9.5px] font-mono text-slate-400 block">CN: {activeSector.code}</span>
            </div>

            <div className="rounded-xl bg-white/[0.04] p-2.5 border border-white/5">
              <span className="text-[9.5px] text-slate-400 block uppercase">Özgül Emisyon</span>
              <strong className="text-[#bdd652] text-[13px] block">
                {activeSector.avgIntensity}{" "}
                <span className="text-[9px] font-normal text-slate-300">tCO₂e/t</span>
              </strong>
              <span className="text-[9.5px] text-emerald-400 block">Kapsam 1 + Kapsam 2</span>
            </div>
          </div>

          {/* Güvenlik Mühür Kodu Şeridi */}
          <div className="mt-3 pt-2.5 border-t border-dashed border-white/15 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
            <span className="truncate max-w-[200px]">HASH: 86ed9faf23fd...c97289ca</span>
            <span className="text-[#bdd652] font-bold">12 DOSYA ZIP</span>
          </div>
        </div>
      </section>

      {/* 4. CANLI GTİP ARAMA MİKRO-KARTI */}
      <section className="px-4 pb-6">
        <div className="rounded-2xl border-2 border-[#bdd652]/35 bg-white p-4 text-ink-900 shadow-2xl shadow-black/50">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#305018]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#213110]">
                Canlı GTİP Kapsam Kontrolü
              </span>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-900">
              ÜCRETSİZ SORGULA
            </span>
          </div>

          <p className="mb-3 text-[11px] font-medium leading-snug text-ink-600">
            Ürününüzün 4 veya 8 haneli GTİP kodunu girerek CBAM kapsamını ve vergilendirme durumunu anında öğrenin:
          </p>

          <GtipArama />

          {/* Popüler Filtre Çipleri */}
          <div className="mt-3 pt-3 border-t border-line/60">
            <span className="text-[9.5px] font-bold uppercase text-ink-400 tracking-wider block mb-1.5">
              Popüler İhracat Ürünleri:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_GTIPS.map((chip) => (
                <button
                  key={chip.gtip}
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("gtip-input") as HTMLInputElement | null;
                    if (input) {
                      input.value = chip.gtip;
                      input.dispatchEvent(new Event("input", { bubbles: true }));
                      input.focus();
                    } else {
                      window.location.href = `/rehber/gtip-bulma/?gtip=${chip.gtip}`;
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-slate-50 px-2 py-1 text-[11px] font-bold text-ink-800 transition active:scale-95 hover:border-[#bdd652] hover:bg-lime-50 cursor-pointer"
                >
                  <span className="font-mono text-emerald-800">{chip.gtip}</span>
                  <span className="text-ink-500">· {chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. İNTERAKTİF SİMÜLATÖR & FİNANSAL TASARRUF MOTORU (ULTRA-B2B COCKPIT) */}
      <section className="border-t border-white/10 bg-gradient-to-b from-[#0f190a] to-[#091106] px-4 py-7">
        <div className="mb-4">
          <div className="flex items-center gap-1.5">
            <Calculator className="h-4 w-4 text-[#bdd652]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#bdd652]">
              FİNANSAL CBAM SİMÜLATÖRÜ
            </span>
          </div>
          <h2 className="mt-1 text-base font-black text-white">
            Emisyon Yükünüzü &amp; Tasarrufunuzu Hesaplayın
          </h2>
          <p className="text-[11.5px] text-slate-300 mt-0.5">
            Gerçek fabrika verisi girdiğinizde varsayılan değer cezalarına karşı ne kadar avantaj sağladığınızı görün:
          </p>
        </div>

        {/* Sektör Seçici Buton Grubu */}
        <div className="space-y-3.5">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              1. Sektör Seçin:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {SECTORS.map((s) => {
                const isSelected = s.slug === selectedSectorSlug;
                const IconComponent = s.icon;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setSelectedSectorSlug(s.slug)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition active:scale-95 cursor-pointer ${
                      isSelected
                        ? "bg-[#bdd652] text-[#142109] border-[#bdd652] font-black shadow-lg shadow-[#bdd652]/20"
                        : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 mb-1 ${isSelected ? "text-[#142109]" : "text-[#bdd652]"}`} />
                    <span className="text-[10.5px] leading-tight font-bold">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tonaj Seçici */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                2. Yıllık İhracat Miktarı:
              </label>
              <span className="text-xs font-black text-[#bdd652]">
                {tonnage.toLocaleString("tr-TR")} Ton
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {TONNAGE_PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTonnage(t)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold border transition active:scale-95 cursor-pointer ${
                    tonnage === t
                      ? "bg-[#bdd652]/20 border-[#bdd652] text-[#bdd652]"
                      : "bg-white/5 border-white/10 text-slate-300"
                  }`}
                >
                  {t} Ton
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={50}
              max={10000}
              step={50}
              value={tonnage}
              onChange={(e) => setTonnage(Number(e.target.value))}
              className="w-full mt-3 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#bdd652]"
            />
          </div>

          {/* Canlı Simülasyon Kartı: Emisyon + Finansal Tasarruf */}
          <div className="rounded-2xl border border-[#bdd652]/35 bg-[#13220b] p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#bdd652]" />
                <span className="text-[11px] font-black uppercase text-white">
                  {activeSector.label} Analiz Sonucu
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-[#bdd652]">
                CN: {activeSector.code}
              </span>
            </div>

            {/* Metrikler */}
            <div className="grid grid-cols-2 gap-2.5 my-3">
              <div className="bg-white/5 rounded-xl p-2.5">
                <span className="text-[9px] text-slate-400 block uppercase">Tahmini Emisyon</span>
                <span className="text-lg font-black text-[#bdd652] tracking-tight block">
                  ~{calculations.total.toLocaleString("tr-TR")}{" "}
                  <span className="text-xs font-normal text-slate-300">tCO₂e</span>
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  ({activeSector.avgIntensity} tCO₂e / ton)
                </span>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5">
                <span className="text-[9px] text-emerald-300 block uppercase font-bold flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> Gerçek Veri Tasarrufu
                </span>
                <span className="text-lg font-black text-emerald-400 tracking-tight block">
                  ~€{calculations.taxSavingEUR.toLocaleString("tr-TR")}
                </span>
                <span className="text-[9px] text-slate-300 block mt-0.5">
                  Varsayılan değer cezasına kıyasla
                </span>
              </div>
            </div>

            {/* Kapsam 1 ve 2 Dağılım Çubuğu */}
            <div className="bg-white/5 rounded-xl p-2.5 mb-3">
              <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                <span>Kapsam 1 (Yakıt): ~{calculations.s1} t ({activeSector.scope1Share}%)</span>
                <span>Kapsam 2 (Elektrik): ~{calculations.s2} t ({activeSector.scope2Share}%)</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden flex">
                <div style={{ width: `${activeSector.scope1Share}%` }} className="bg-[#bdd652] h-full" />
                <div style={{ width: `${activeSector.scope2Share}%` }} className="bg-emerald-500 h-full" />
              </div>
            </div>

            {/* Aksiyon Butonu */}
            <Link
              href={`/hesapla/${activeSector.slug}/`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#bdd652] to-[#a2be38] text-[#142109] font-black text-xs tracking-wide shadow-lg shadow-[#bdd652]/25 active:scale-95 transition"
            >
              <span>{activeSector.label} İçin Resmi Dosya Başlat</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. İNTERAKTİF STEPPER (4 ADIMDA RESMİ PROTOKOL) */}
      <section className="border-t border-white/10 bg-[#0c1409] px-4 py-7">
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#bdd652]">
            RESMİ PROTOKOL
          </span>
          <h2 className="mt-0.5 text-base font-black text-white">4 Adımda Denetime Hazır Teslimat</h2>
        </div>

        <div className="space-y-2">
          {/* Adım 1 */}
          <div
            onClick={() => setActiveStepTab(1)}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              activeStepTab === 1
                ? "border-[#bdd652] bg-[#bdd652]/10"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#bdd652] text-xs font-black text-[#213110]">
                  1
                </div>
                <h3 className="text-xs font-bold text-white">GTİP &amp; Kapsam Doğrulaması</h3>
              </div>
              <span className="text-[10px] font-mono text-[#bdd652]">Ücretsiz</span>
            </div>
            {activeStepTab === 1 && (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-300 pl-8">
                569 resmî 8 haneli CN kodunda ürününüzün Kapsam 1 ve Kapsam 2 sınırlarını ve öncül madde yükümlülüklerini anında kontrol edin.
              </p>
            )}
          </div>

          {/* Adım 2 */}
          <div
            onClick={() => setActiveStepTab(2)}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              activeStepTab === 2
                ? "border-[#bdd652] bg-[#bdd652]/10"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#bdd652] text-xs font-black text-[#213110]">
                  2
                </div>
                <h3 className="text-xs font-bold text-white">Tesis Verilerini İşleyin</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Tesis Girdisi</span>
            </div>
            {activeStepTab === 2 && (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-300 pl-8">
                Doğrudan yakıt faturaları (doğalgaz, kömür, fuel-oil), elektrik sayaçları ve girdi öncül maddelerini rehber eşliğinde sisteme girin.
              </p>
            )}
          </div>

          {/* Adım 3 */}
          <div
            onClick={() => setActiveStepTab(3)}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              activeStepTab === 3
                ? "border-[#bdd652] bg-[#bdd652]/10"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#bdd652] text-xs font-black text-[#213110]">
                  3
                </div>
                <h3 className="text-xs font-bold text-white">Deterministik Hesaplama</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Şeffaf İzi</span>
            </div>
            {activeStepTab === 3 && (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-300 pl-8">
                Avrupa Komisyonu resmi formüllerine göre özgül gömülü emisyonu (tCO2e/t) ve formül dökümünü denetçinin inceleyebileceği şeffaflıkta üretin.
              </p>
            )}
          </div>

          {/* Adım 4 */}
          <div
            onClick={() => setActiveStepTab(4)}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              activeStepTab === 4
                ? "border-[#bdd652] bg-[#bdd652]/10"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#bdd652] text-xs font-black text-[#213110]">
                  4
                </div>
                <h3 className="text-xs font-bold text-[#bdd652]">12 Parçalı Mühürlü Arşiv</h3>
              </div>
              <span className="text-[10px] font-mono text-[#bdd652]">Tek Tıkla Teslim</span>
            </div>
            {activeStepTab === 4 && (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-200 pl-8">
                Resmi Communication Template XLSX, SHA-256 bütünlük özeti, doğrulayıcı hesap izi ve AB ithalatçı beyan mektubu tek bir arşivde anında iner.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 7. DANIŞMANLIK VS SKDMHESAPLA (LÜKS KARŞILAŞTIRMA MATRİSİ) */}
      <section className="border-t border-white/10 bg-gradient-to-b from-[#0a1107] to-[#12200c] px-4 py-7">
        <div className="rounded-2xl border border-lime-500/35 bg-white/[0.03] p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-lime-400">
                NEDEN SKDMHESAPLA?
              </span>
              <h3 className="text-sm font-black text-white mt-0.5">Klasik Danışmanlık vs SKDMHesapla</h3>
            </div>
            <span className="rounded-full bg-[#bdd652] px-2.5 py-1 text-[10px] font-black text-[#213110]">
              SABİT {PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR")} ₺
            </span>
          </div>

          <div className="mt-3.5 space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#bdd652] mt-0.5" />
              <div>
                <strong className="text-white block">Aynı Gün Teslimat:</strong>
                <span className="text-slate-300 text-[11px]">
                  Haftalarca süren danışmanlık toplantıları yerine 1 saatte mühürlü dosyanızı indirin.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#bdd652] mt-0.5" />
              <div>
                <strong className="text-white block">Avrupa Komisyonu Resmi Şablonu:</strong>
                <span className="text-slate-300 text-[11px]">
                  Resmi CBAM Communication Template XML/XLSX yapısıyla %100 uyumlu.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#bdd652] mt-0.5" />
              <div>
                <strong className="text-white block">Kriptografik SHA-256 Mührü:</strong>
                <span className="text-slate-300 text-[11px]">
                  Denetçi ve AB ithalatçısı için tahrif edilemez matematiksel bütünlük kanıtı.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10.5px] text-slate-400">Veri hazırlığı ücretsizdir</span>
            <Link
              href="/basla/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#bdd652] px-4 py-2 text-xs font-black text-[#213110] shadow hover:bg-lime-300 active:scale-95 transition"
            >
              Hemen Başla <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. ÖRNEK MÜHÜRLÜ DOSYA İNCELEME & DOĞRULAMA BANNERI */}
      <section className="border-t border-white/10 bg-[#0e1708] px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-[#bdd652]" />
              Örnek Mühürlü Paketi İnceleyin
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Demo Aktif</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            Satın almadan önce resmi Communication Template ve SHA-256 doğrulama sertifikası örneğini canlı inceleyin:
          </p>
          <div className="flex gap-2">
            <Link
              href="/v/SEAL-2026-DOĞRULANDI"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/15 transition active:scale-95"
            >
              Örnek Mührü Gör
            </Link>
            <Link
              href="/v/demo"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-[#bdd652]/15 hover:bg-[#bdd652]/25 text-xs font-bold text-[#bdd652] border border-[#bdd652]/30 transition active:scale-95"
            >
              Canlı Doğrulama
            </Link>
          </div>
        </div>
      </section>

      {/* 9. İHRACATÇI DOĞRUDAN DANIŞMA & WHATSAPP DESTEK */}
      <section className="border-t border-white/10 bg-[#0a1106] px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-950/40 to-lime-950/40 p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-[#bdd652]" />
              <span className="text-xs font-black text-white">Sorularınız mı Var?</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-tight">
              CBAM uzmanımızla doğrudan iletişime geçin, dosyanızı birlikte planlayalım.
            </p>
          </div>
          <Link
            href="/iletisim/"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white transition active:scale-95"
          >
            İletişime Geç
          </Link>
        </div>
      </section>

      {/* 10. SIKÇA SORULAN SORULAR */}
      <section className="border-t border-white/10 bg-[#0c1409] px-4 py-7">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-[#bdd652]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Sıkça Sorulan Sorular
            </h2>
          </div>
          <Link href="/sss/" className="text-[11px] font-bold text-[#bdd652] hover:underline">
            Tüm SSS →
          </Link>
        </div>

        <div className="space-y-2">
          {MOBILE_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-white transition hover:bg-white/[0.05] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="pr-2">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#bdd652] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/5 bg-black/30 p-3.5 text-[11.5px] font-medium leading-relaxed text-slate-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. FRANKFURT GÜVENLİK VE MÜHÜR ROZETİ & DİP CTA */}
      <section className="border-t border-white/10 bg-[#060a03] px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-300">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Frankfurt AWS / Hetzner AB Veri Güvencesi</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400">
          Verileriniz KVKK ve GDPR uyumlu olarak Avrupa Birliği sınırları içinde şifreli saklanır.
        </p>

        <div className="mt-5">
          <Link
            href="/basla/"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#bdd652] via-[#cbf056] to-[#a8c734] py-3.5 text-sm font-black text-[#213110] shadow-xl shadow-[#bdd652]/25 active:scale-[0.98] transition"
          >
            Ücretsiz GTİP Kontrolü Yap <ArrowRight className="h-4 w-4 stroke-[3]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
