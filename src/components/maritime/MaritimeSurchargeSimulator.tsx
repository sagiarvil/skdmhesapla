"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Ship,
  Compass,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  FileCheck,
  ChevronDown,
} from "lucide-react";

interface CorridorOption {
  id: string;
  name: string;
  ports: string;
  distanceNm: number;
  avgCo2PerTeu: number; // ton CO2e per TEU across voyage
  avgCo2PerRoroUnit: number; // ton CO2e per Ro-Ro semi-trailer/vehicle
  avgCo2PerBulkTon: number; // ton CO2e per ton cargo
}

const CORRIDORS: CorridorOption[] = [
  {
    id: "ambarli-genoa",
    name: "Ambarlı (İstanbul) ➔ Cenova / Barselona",
    ports: "Marport/Kumport ➔ Cenova (İtalya)",
    distanceNm: 1250,
    avgCo2PerTeu: 0.38,
    avgCo2PerRoroUnit: 0.55,
    avgCo2PerBulkTon: 0.019,
  },
  {
    id: "mersin-valencia",
    name: "Mersin (MIP) ➔ Valensiya / Barselona",
    ports: "MIP Rıhtımları ➔ Valensiya (İspanya)",
    distanceNm: 1480,
    avgCo2PerTeu: 0.46,
    avgCo2PerRoroUnit: 0.65,
    avgCo2PerBulkTon: 0.023,
  },
  {
    id: "kocaeli-rotterdam",
    name: "Kocaeli (İzmit Körfezi) ➔ Rotterdam / Antwerp",
    ports: "Evyap/Yılport ➔ Rotterdam (Hollanda)",
    distanceNm: 3100,
    avgCo2PerTeu: 0.88,
    avgCo2PerRoroUnit: 1.25,
    avgCo2PerBulkTon: 0.044,
  },
  {
    id: "aliaga-trieste",
    name: "Aliağa / Nemrut ➔ Trieste (Adriyatik Ro-Ro)",
    ports: "Nemport/TCEEGE ➔ Trieste (İtalya)",
    distanceNm: 980,
    avgCo2PerTeu: 0.32,
    avgCo2PerRoroUnit: 0.45,
    avgCo2PerBulkTon: 0.016,
  },
  {
    id: "iskenderun-ravenna",
    name: "İskenderun ➔ Ravenna / Koper (Dökme Çelik)",
    ports: "İskenderun Terminalleri ➔ Ravenna (İtalya)",
    distanceNm: 1320,
    avgCo2PerTeu: 0.40,
    avgCo2PerRoroUnit: 0.58,
    avgCo2PerBulkTon: 0.020,
  },
];

const EUA_PRICE_EUR = 80; // €/ton CO2e standard 2026 market equilibrium benchmark

export function MaritimeSurchargeSimulator() {
  const [corridorId, setCorridorId] = useState<string>("ambarli-genoa");
  const [cargoType, setCargoType] = useState<"teu" | "roro" | "bulk">("teu");
  const [quantity, setQuantity] = useState<number>(20);
  const [yearOption, setYearOption] = useState<"2025" | "2026">("2026");

  const selectedCorridor = useMemo(
    () => CORRIDORS.find((c) => c.id === corridorId) || CORRIDORS[0],
    [corridorId]
  );

  const phaseInRatio = yearOption === "2025" ? 0.7 : 1.0;
  const voyageScopeRatio = 0.5; // Third-country (Turkey to EU) 50% allocation

  const simulation = useMemo(() => {
    let factor = selectedCorridor.avgCo2PerTeu;
    if (cargoType === "roro") factor = selectedCorridor.avgCo2PerRoroUnit;
    else if (cargoType === "bulk") factor = selectedCorridor.avgCo2PerBulkTon;

    const totalVoyageCo2 = quantity * factor;
    const reportableCo2 = totalVoyageCo2 * voyageScopeRatio;
    const liableCo2 = reportableCo2 * phaseInRatio;
    const estimatedSurchargeEur = Math.round(liableCo2 * EUA_PRICE_EUR);
    const surchargePerUnitEur =
      quantity > 0 ? (estimatedSurchargeEur / quantity).toFixed(1) : "0";

    return {
      totalVoyageCo2: totalVoyageCo2.toFixed(1),
      reportableCo2: reportableCo2.toFixed(1),
      liableCo2: liableCo2.toFixed(1),
      estimatedSurchargeEur,
      surchargePerUnitEur,
    };
  }, [selectedCorridor, cargoType, quantity, phaseInRatio]);

  return (
    <div className="rounded-3xl border-2 border-sky-900/15 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-sky-100 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-sky-950">
            <Compass className="h-3.5 w-3.5 text-sky-800" />
            İnteraktif Simülatör
          </div>
          <h3 className="mt-2 text-xl font-black text-ink-900 sm:text-2xl">
            Türk Limanları Navlun ETS Sürşarjı Simülatörü
          </h3>
          <p className="mt-1 text-xs text-ink-600 sm:text-sm">
            Türkiye-AB deniz ticaretinde sefer başına armatörlerin navluna yansıttığı tahmini karbon maliyetini canlı hesaplayın.
          </p>
        </div>
        <div className="rounded-xl border border-sky-900/10 bg-[#f0f5f7] px-3 py-2 text-right">
          <span className="block text-[11px] font-bold text-sky-900">EUA Referans Fiyatı</span>
          <span className="text-sm font-black text-ink-900">€{EUA_PRICE_EUR} / tCO₂e</span>
        </div>
      </div>

      {/* Kontroller */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Koridor Seçimi */}
        <div className="rounded-2xl border border-sky-900/15 bg-[#f8fbfa] p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-ink-800">
              1. Liman Koridoru
            </label>
            <span className="rounded bg-sky-100 px-1.5 py-0.2 text-[10px] font-bold text-sky-950">
              TR - AB Rotası
            </span>
          </div>
          <div className="relative mt-2">
            <select
              value={corridorId}
              onChange={(e) => setCorridorId(e.target.value)}
              className="w-full appearance-none rounded-xl border-2 border-slate-300 bg-white py-2.5 pl-3 pr-8 text-xs font-bold text-ink-900 shadow-xs transition-all focus:border-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-500/15"
            >
              {CORRIDORS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <span className="mt-1.5 block text-[11px] font-semibold text-sky-900">
            Mesafe: {selectedCorridor.distanceNm} Deniz Mili
          </span>
        </div>

        {/* Yük Türü */}
        <div className="rounded-2xl border border-sky-900/15 bg-[#f8fbfa] p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-ink-800">
              2. Taşıma / Yük Tipi
            </label>
            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-700">
              Yük Birimi
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setCargoType("teu");
                setQuantity(20);
              }}
              className={`rounded-xl border-2 py-2 text-[11px] font-bold transition shadow-xs ${
                cargoType === "teu"
                  ? "border-sky-800 bg-sky-900 text-white font-black"
                  : "border-slate-300 bg-white text-ink-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              Konteyner (TEU)
            </button>
            <button
              type="button"
              onClick={() => {
                setCargoType("roro");
                setQuantity(10);
              }}
              className={`rounded-xl border-2 py-2 text-[11px] font-bold transition shadow-xs ${
                cargoType === "roro"
                  ? "border-sky-800 bg-sky-900 text-white font-black"
                  : "border-slate-300 bg-white text-ink-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              Ro-Ro Römork
            </button>
            <button
              type="button"
              onClick={() => {
                setCargoType("bulk");
                setQuantity(500);
              }}
              className={`rounded-xl border-2 py-2 text-[11px] font-bold transition shadow-xs ${
                cargoType === "bulk"
                  ? "border-sky-800 bg-sky-900 text-white font-black"
                  : "border-slate-300 bg-white text-ink-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              Dökme (Ton)
            </button>
          </div>
          <span className="mt-1.5 block text-[11px] font-medium text-ink-600">
            {cargoType === "teu"
              ? "Standart 20'/40' konteyner"
              : cargoType === "roro"
              ? "Ro-Ro yarı römork / ticari araç"
              : "Çelik, kütük, maden, çimento"}
          </span>
        </div>

        {/* Hacim Girdisi */}
        <div className="rounded-2xl border border-sky-900/15 bg-[#f8fbfa] p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-ink-800">
              3. Sevkiyat Miktarı
            </label>
            <span className="rounded-md bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[10px] font-bold text-rose-700">
              * Zorunlu
            </span>
          </div>
          <div className="relative mt-2">
            <input
              type="number"
              min={1}
              max={cargoType === "bulk" ? 50000 : 5000}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-xl border-2 border-slate-300 bg-white py-2 pl-3 pr-14 font-mono text-xs font-bold text-ink-900 shadow-xs transition-all focus:border-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-500/15"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-700 border border-slate-300">
                {cargoType === "teu" ? "TEU" : cargoType === "roro" ? "Araç" : "Ton"}
              </span>
            </div>
          </div>
          <span className="mt-1.5 block text-[11px] font-medium text-ink-600">
            Örnek: {cargoType === "teu" ? "20 TEU konteyner" : cargoType === "roro" ? "10 yarı römork" : "500 ton çelik profil"}
          </span>
        </div>

        {/* Phase-In Yılı */}
        <div className="rounded-2xl border border-sky-900/15 bg-[#f8fbfa] p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-ink-800">
              4. 2026 ETS Rejimi &amp; Oranı
            </label>
            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-950">
              Tam Kapsam
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setYearOption("2026")}
              className={`rounded-xl border-2 py-2 text-xs font-bold transition shadow-xs ${
                yearOption === "2026"
                  ? "border-emerald-700 bg-emerald-800 text-white font-black"
                  : "border-slate-300 bg-white text-ink-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              2026 (%100 Tam Teslim)
            </button>
            <button
              type="button"
              onClick={() => setYearOption("2025")}
              className={`rounded-xl border-2 py-2 text-xs font-bold transition shadow-xs ${
                yearOption === "2025"
                  ? "border-sky-800 bg-sky-900 text-white font-black"
                  : "border-slate-300 bg-white text-ink-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              2025 Geçişi (%70)
            </button>
          </div>
          <span className="mt-1.5 block text-[11px] font-medium text-ink-600">
            {yearOption === "2026"
              ? "2026 yürürlük: %100 EUA + CO₂/CH₄/N₂O çoklu gaz"
              : "2025 geçmiş dönem: %70 EUA teslim yükümlülüğü"}
          </span>
        </div>
      </div>

      {/* Hesaplama Sonuç Panosu */}
      <div className="mt-7 grid gap-4 rounded-2xl border-2 border-sky-900/20 bg-gradient-to-br from-[#eef5f8] via-white to-[#e8f1f5] p-5 sm:grid-cols-4">
        <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-bold text-ink-500">Toplam Sefer Emisyonu</span>
          <span className="mt-1 block text-xl font-black text-ink-900">
            {simulation.totalVoyageCo2} <span className="text-xs font-normal text-ink-600">tCO₂e</span>
          </span>
          <span className="text-[10px] text-ink-500">Gemi seyir emisyonu</span>
        </div>

        <div className="rounded-xl border-2 border-sky-300 bg-sky-50/80 p-4 shadow-xs">
          <span className="block text-[11px] font-black text-sky-950">%50 AB ETS Sorumluluğu</span>
          <span className="mt-1 block text-xl font-black text-sky-950">
            {simulation.reportableCo2} <span className="text-xs font-normal text-sky-800">tCO₂e</span>
          </span>
          <span className="text-[10px] font-semibold text-sky-800">Türkiye-AB sefer payı</span>
        </div>

        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/80 p-4 shadow-xs">
          <span className="block text-[11px] font-black text-emerald-950">Teslim Edilecek EUA Payı</span>
          <span className="mt-1 block text-xl font-black text-emerald-950">
            {simulation.liableCo2} <span className="text-xs font-normal text-emerald-800">tCO₂e</span>
          </span>
          <span className="text-[10px] font-semibold text-emerald-800">%{phaseInRatio * 100} Phase-in oranı</span>
        </div>

        <div className="rounded-xl border-2 border-sky-500 bg-gradient-to-br from-[#072033] to-[#0b3352] p-4 text-white shadow-md ring-1 ring-sky-400/30">
          <span className="block text-[11px] font-bold text-sky-200">Tahmini Navlun Sürşarjı</span>
          <span className="mt-1 block text-2xl font-black text-white">
            €{simulation.estimatedSurchargeEur.toLocaleString("tr-TR")}
          </span>
          <span className="text-[11px] text-sky-200">
            Birim başı: ~€{simulation.surchargePerUnitEur} / {cargoType === "teu" ? "TEU" : cargoType === "roro" ? "Araç" : "Ton"}
          </span>
        </div>
      </div>

      {/* STRATEJİK TİCARİ VE GELİR KÖPRÜSÜ (BANA PARA KAZANDIRAN DÖNÜŞÜM BLOKU) */}
      <div className="mt-6 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-white p-5 sm:p-6 shadow-sm border-l-8 border-l-amber-600">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-amber-700" />
          <div>
            <h4 className="text-base font-black text-amber-950">
              İhracatçı İçin Hayati Uyarı: Navlun Sürşarjı CBAM Beyanına Eklenmez!
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-amber-900">
              Armatör faturanıza yansıyan bu <strong>€{simulation.estimatedSurchargeEur.toLocaleString("tr-TR")}</strong> tutarındaki navlun sürşarjı gemi işletmecisine aittir.
              AB 2025/2547 sayılı Kesin Dönem Tüzüğü gereğince CBAM beyanındaki özgül gömülü emisyona (SEE) <strong>dahil edilemez</strong>.
              Eğer fabrikanızın fabrika kapısı gerçek üretim emisyonlarını kanıtlayamazsanız, Avrupalı alıcınız varsayılan (default) en yüksek cezai katsayılarla vergi ödemek zorunda kalır ve bu maliyeti doğrudan ihracat bedelinizden keser.
            </p>

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-sky-600/50 bg-gradient-to-b from-sky-50 via-white to-sky-50/30 p-4.5 shadow-sm">
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-sky-950">
                  <span className="flex h-2 w-2 rounded-full bg-sky-600"></span>
                  Armatörler ve Gemi İşletmecileri İçin
                </div>
                <p className="mt-1.5 text-[11px] leading-4 text-ink-700">
                  1 gemi · 1 raporlama yılı · tek seferlik (599 USD). EU MRV, ETS ve FuelEU uyum dosyanızı klas doğrulayıcısına hazır hale getirin.
                </p>
                <Link
                  href="/denizcilik/dosya-hazirla/#form-section"
                  className="mt-3.5 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-sky-900 px-4 text-xs font-black text-white transition hover:bg-sky-800 shadow-sm"
                >
                  Hemen Başla: Klas Paketini Oluşturun (599 USD) <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border-2 border-brand-600/40 bg-gradient-to-b from-brand-50 via-white to-brand-50/30 p-4.5 shadow-sm">
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-brand-950">
                  <span className="flex h-2 w-2 rounded-full bg-brand-600"></span>
                  Türk İhracatçıları ve Üreticiler İçin
                </div>
                <p className="mt-1.5 text-[11px] leading-4 text-ink-700">
                  Navlunu CBAM formülünden hariç tutun; fabrikanızın fabrika kapısı gerçek üretim emisyonlarını kanıtlayın.
                </p>
                <Link
                  href="/basla/"
                  className="mt-3.5 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-800 px-4 text-xs font-black text-white transition hover:bg-brand-700 shadow-sm"
                >
                  Ücretsiz Kapsam Kontrolünü Başlat <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
