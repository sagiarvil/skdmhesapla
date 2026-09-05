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
  Factory,
  Box,
  Truck,
  Anchor,
  Plus,
  Minus,
  MapPin,
  Check,
  Layers,
  Sparkles,
  Navigation,
} from "lucide-react";

interface CorridorOption {
  id: string;
  name: string;
  ports: string;
  originPort: string;
  destPort: string;
  shortRoute: string;
  region: string;
  bestFor: string;
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
    originPort: "Ambarlı (İstanbul)",
    destPort: "Cenova (İtalya)",
    shortRoute: "Ambarlı ➔ Cenova",
    region: "Batı Akdeniz",
    bestFor: "Konteyner FCL",
    distanceNm: 1250,
    avgCo2PerTeu: 0.38,
    avgCo2PerRoroUnit: 0.55,
    avgCo2PerBulkTon: 0.019,
  },
  {
    id: "mersin-valencia",
    name: "Mersin (MIP) ➔ Valensiya / Barselona",
    ports: "MIP Rıhtımları ➔ Valensiya (İspanya)",
    originPort: "Mersin (MIP)",
    destPort: "Valensiya (İspanya)",
    shortRoute: "Mersin ➔ Valensiya",
    region: "Batı Akdeniz",
    bestFor: "Konteyner & Narenciye",
    distanceNm: 1480,
    avgCo2PerTeu: 0.46,
    avgCo2PerRoroUnit: 0.65,
    avgCo2PerBulkTon: 0.023,
  },
  {
    id: "kocaeli-rotterdam",
    name: "Kocaeli (İzmit Körfezi) ➔ Rotterdam / Antwerp",
    ports: "Evyap/Yılport ➔ Rotterdam (Hollanda)",
    originPort: "Kocaeli (İzmit)",
    destPort: "Rotterdam (Hollanda)",
    shortRoute: "Kocaeli ➔ Rotterdam",
    region: "Kuzey Avrupa",
    bestFor: "Sanayi & Kimya",
    distanceNm: 3100,
    avgCo2PerTeu: 0.88,
    avgCo2PerRoroUnit: 1.25,
    avgCo2PerBulkTon: 0.044,
  },
  {
    id: "aliaga-trieste",
    name: "Aliağa / Nemrut ➔ Trieste (Adriyatik Ro-Ro)",
    ports: "Nemport/TCEEGE ➔ Trieste (İtalya)",
    originPort: "Aliağa / Nemrut",
    destPort: "Trieste (İtalya)",
    shortRoute: "Aliağa ➔ Trieste",
    region: "Adriyatik Hattı",
    bestFor: "Ro-Ro Römork",
    distanceNm: 980,
    avgCo2PerTeu: 0.32,
    avgCo2PerRoroUnit: 0.45,
    avgCo2PerBulkTon: 0.016,
  },
  {
    id: "iskenderun-ravenna",
    name: "İskenderun ➔ Ravenna / Koper (Dökme Çelik)",
    ports: "İskenderun Terminalleri ➔ Ravenna (İtalya)",
    originPort: "İskenderun",
    destPort: "Ravenna / Koper",
    shortRoute: "İskenderun ➔ Ravenna",
    region: "Adriyatik Çelik",
    bestFor: "Dökme Çelik & Maden",
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
  const [isRouteMenuOpen, setIsRouteMenuOpen] = useState<boolean>(false);

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
        <div className="rounded-xl border border-sky-900/10 bg-[#f0f5f7] px-3.5 py-2 text-right shadow-2xs">
          <span className="block text-[11px] font-bold text-sky-900">EUA Referans Fiyatı</span>
          <span className="text-sm font-black text-ink-900">€{EUA_PRICE_EUR} / tCO₂e</span>
        </div>
      </div>

      {/* Kontroller: 4 Kurumsal Kart Buton Bloğu */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* KART 1: LİMAN KORİDORU */}
        <div className="relative flex flex-col justify-between rounded-2xl border-2 border-sky-900/15 bg-white p-4 shadow-xs transition-all hover:border-sky-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">
                1
              </span>
              <label className="text-xs font-black uppercase text-ink-900">
                Liman Koridoru
              </label>
            </div>
            <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-black uppercase text-sky-900 border border-sky-200">
              TR - AB Rotası
            </span>
          </div>

          {/* Rota Seçici Butonu (Tek Satır, Kırılmayan Rota) */}
          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setIsRouteMenuOpen(!isRouteMenuOpen)}
              className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left transition hover:border-sky-600 hover:bg-white hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-600/15"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <MapPin className="h-3.5 w-3.5 text-sky-700 shrink-0" />
                  <span className="truncate">{selectedCorridor.shortRoute}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 pl-5 text-[11px] text-slate-500">
                  <span>{selectedCorridor.region}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-slate-700">
                    {selectedCorridor.distanceNm.toLocaleString("tr-TR")} NM
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isRouteMenuOpen ? "rotate-180 text-sky-900" : ""
                }`}
              />
            </button>

            {/* Rota Seçim Menüsü (Popover) */}
            {isRouteMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsRouteMenuOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sefer Rotası Seçin (5 Hat)
                  </div>
                  <div className="space-y-1">
                    {CORRIDORS.map((c) => {
                      const isSelected = c.id === corridorId;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCorridorId(c.id);
                            setIsRouteMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs transition ${
                            isSelected
                              ? "bg-sky-900 text-white font-semibold shadow-2xs"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="truncate font-bold">
                              {c.shortRoute}
                            </div>
                            <div className={`text-[10px] truncate ${isSelected ? "text-sky-200" : "text-slate-400"}`}>
                              {c.region} · {c.bestFor}
                            </div>
                          </div>
                          <span className={`shrink-0 font-mono text-[10px] font-bold ${isSelected ? "text-sky-300" : "text-slate-500"}`}>
                            {c.distanceNm} NM
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* KART 2: TAŞIMA / YÜK TİPİ (TEK SATIR, NET SEÇENEKLER) */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-sky-900/15 bg-white p-4 shadow-xs transition-all hover:border-sky-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">
                2
              </span>
              <label className="text-xs font-black uppercase text-ink-900">
                Taşıma / Yük Tipi
              </label>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-700 border border-slate-200">
              {cargoType === "teu" ? "TEU" : cargoType === "roro" ? "Römork" : "Tonaj"}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {/* Konteyner */}
            <button
              type="button"
              onClick={() => {
                setCargoType("teu");
                setQuantity(20);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                cargoType === "teu"
                  ? "border-2 border-sky-700 bg-sky-50 text-sky-950 font-bold shadow-xs ring-1 ring-sky-600/15"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Box className={`h-4 w-4 shrink-0 ${cargoType === "teu" ? "text-sky-700" : "text-slate-400"}`} />
                <span className="text-xs font-bold">Konteyner</span>
              </div>
              <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                cargoType === "teu" ? "bg-sky-200/80 text-sky-950" : "bg-slate-100 text-slate-600"
              }`}>
                TEU
              </span>
            </button>

            {/* Ro-Ro */}
            <button
              type="button"
              onClick={() => {
                setCargoType("roro");
                setQuantity(10);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                cargoType === "roro"
                  ? "border-2 border-sky-700 bg-sky-50 text-sky-950 font-bold shadow-xs ring-1 ring-sky-600/15"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className={`h-4 w-4 shrink-0 ${cargoType === "roro" ? "text-sky-700" : "text-slate-400"}`} />
                <span className="text-xs font-bold">Ro-Ro Taşıma</span>
              </div>
              <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                cargoType === "roro" ? "bg-sky-200/80 text-sky-950" : "bg-slate-100 text-slate-600"
              }`}>
                Römork
              </span>
            </button>

            {/* Dökme */}
            <button
              type="button"
              onClick={() => {
                setCargoType("bulk");
                setQuantity(500);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                cargoType === "bulk"
                  ? "border-2 border-sky-700 bg-sky-50 text-sky-950 font-bold shadow-xs ring-1 ring-sky-600/15"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Anchor className={`h-4 w-4 shrink-0 ${cargoType === "bulk" ? "text-sky-700" : "text-slate-400"}`} />
                <span className="text-xs font-bold">Dökme Yük</span>
              </div>
              <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                cargoType === "bulk" ? "bg-sky-200/80 text-sky-950" : "bg-slate-100 text-slate-600"
              }`}>
                Tonaj
              </span>
            </button>
          </div>
        </div>

        {/* KART 3: SEVKİYAT MİKTARI (DOKUNSAL STEPPER + HIZLI PRESET BUTONLARI) */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-sky-900/15 bg-white p-4 shadow-xs transition-all hover:border-sky-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">
                3
              </span>
              <label className="text-xs font-black uppercase text-ink-900">
                Sevkiyat Miktarı
              </label>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
              Parametre
            </span>
          </div>

          {/* Stepper Kontrolü: Tek Parça Dokunsal Kutu */}
          <div className="mt-3 flex items-stretch rounded-xl border-2 border-slate-200 bg-white shadow-2xs transition focus-within:border-sky-700 focus-within:ring-2 focus-within:ring-sky-600/10">
            <button
              type="button"
              onClick={() => {
                const step = cargoType === "bulk" ? 100 : cargoType === "roro" ? 1 : 5;
                setQuantity((q) => Math.max(1, q - step));
              }}
              aria-label="Miktarı azalt"
              className="flex w-10 items-center justify-center border-r border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 active:bg-slate-200"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="relative flex flex-1 items-center justify-center py-2 px-2">
              <input
                type="number"
                min={1}
                max={cargoType === "bulk" ? 50000 : 5000}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-full text-center font-mono text-base font-black text-slate-900 focus:outline-none"
              />
              <span className="shrink-0 font-mono text-[11px] font-bold text-slate-400 pointer-events-none pr-1">
                {cargoType === "teu" ? "TEU" : cargoType === "roro" ? "Adet" : "Ton"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                const step = cargoType === "bulk" ? 100 : cargoType === "roro" ? 1 : 5;
                setQuantity((q) => q + step);
              }}
              aria-label="Miktarı artır"
              className="flex w-10 items-center justify-center border-l border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 active:bg-slate-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Hızlı Seçim Butonları (Presets) */}
          <div className="mt-3">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Hızlı Miktar Seçimi:
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(cargoType === "teu"
                ? [10, 20, 40, 100]
                : cargoType === "roro"
                ? [5, 10, 20, 50]
                : [250, 500, 1000, 2500]
              ).map((preset) => {
                const isPresetActive = quantity === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`rounded-lg py-1.5 text-center font-mono text-xs font-bold transition ${
                      isPresetActive
                        ? "bg-sky-800 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {preset}{cargoType === "bulk" ? "t" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* KART 4: 2026 ETS REJİMİ & ORANI (KIRILMAYAN, NET SEÇENEKLER) */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-sky-900/15 bg-white p-4 shadow-xs transition-all hover:border-sky-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">
                4
              </span>
              <label className="text-xs font-black uppercase text-ink-900">
                ETS Yürürlük Rejimi
              </label>
            </div>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-950 border border-emerald-200">
              {yearOption === "2026" ? "%100 Kapsam" : "%70 Geçiş"}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {/* 2026 Rejimi */}
            <button
              type="button"
              onClick={() => setYearOption("2026")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                yearOption === "2026"
                  ? "border-2 border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-600/20"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs font-bold">2026 Rejimi</span>
              </div>
              <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                yearOption === "2026" ? "bg-emerald-200/80 text-emerald-950" : "bg-slate-100 text-slate-600"
              }`}>
                %100 Kapsam
              </span>
            </button>

            {/* 2025 Geçişi */}
            <button
              type="button"
              onClick={() => setYearOption("2025")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                yearOption === "2025"
                  ? "border-2 border-sky-700 bg-sky-50/80 text-sky-950 font-bold shadow-xs ring-1 ring-sky-600/20"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                <span className="text-xs font-bold">2025 Geçişi</span>
              </div>
              <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                yearOption === "2025" ? "bg-sky-200/80 text-sky-950" : "bg-slate-100 text-slate-600"
              }`}>
                %70 Teslim
              </span>
            </button>
          </div>

          <div className="mt-2.5 text-center text-[10px] font-medium text-slate-500">
            {yearOption === "2026"
              ? "Tam teslim: CO₂ + CH₄ + N₂O çoklu gaz kapsamı."
              : "Geçiş fazı: Yalnızca CO₂ için %70 teslim yükümlülüğü."}
          </div>
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

      {/* STRATEJİK HUKUKİ AYRIM VE PREMIUM ÇÖZÜM DÖNÜŞÜM PANELİ */}
      <div className="mt-8 space-y-5">
        {/* Zarif Hukuki Uyarı ve Bilgilendirme Çubuğu */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 backdrop-blur-xs">
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 border border-amber-500/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-black uppercase text-amber-800 tracking-wider">
                  HUKUKİ REJİM AYRIMI · TÜZÜK (AB) 2025/2547
                </span>
                <span className="text-xs font-black text-amber-950">
                  Navlun Sürşarjı Fabrika CBAM Beyanına Eklenemez!
                </span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Armatör faturanıza yansıyan bu <strong>€{simulation.estimatedSurchargeEur.toLocaleString("tr-TR")}</strong> tutarındaki navlun sürşarjı armatörün EU ETS maliyetidir.
                CBAM sistem sınırı fabrika kapısında biter; navlun bedeli ürün gömülü emisyonuna (SEE) <strong>kesinlikle dahil edilemez</strong>. İhtiyacınıza uygun resmi çözümü seçin:
              </p>
            </div>
          </div>
        </div>

        {/* 2 PREMIUM DÖNÜŞÜM KARTI: Sol Armatör (599 USD) / Sağ İhracatçı (CBAM) */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* KART 1: ARMATÖR & GEMİ İŞLETMECİSİ (MARITIME NAVY / CYAN) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-sky-400/40 bg-gradient-to-br from-[#061928] via-[#09263f] to-[#04121d] p-6 text-white shadow-xl transition-all hover:border-cyan-400/60 hover:shadow-cyan-500/10 group">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-60" />

            <div>
              {/* Üst Başlık & Rozet */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 shadow-sm">
                    <Ship className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-cyan-300">
                      Armatör &amp; Gemi İşletmecisi
                    </span>
                    <h5 className="text-sm font-black text-white">
                      Klas Denetim Uyum Dosyası
                    </h5>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-black text-xl text-white tracking-tight">599 USD</span>
                  <span className="block text-[10px] text-sky-200">1 gemi · 1 yıl</span>
                </div>
              </div>

              {/* Açıklama ve Özellik Listesi */}
              <p className="mt-3.5 text-xs text-sky-100/90 leading-relaxed font-normal">
                1 gemi için akredite klas (DNV, BV, RINA vb.) denetimine hazır 9 yasal klasörlük mühürlü teknik paket.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-sky-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>EMSA THETIS-MRV uyumlu resmi doğrulama XML&apos;i</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>FuelEU Maritime sera gazı yoğunluğu &amp; ceza kütüğü</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>SHA-256 dijital mühür &amp; değişmez kanıt snapshot&apos;ı</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/denizcilik/dosya-hazirla/#form-section"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-300 px-5 text-xs sm:text-sm font-black text-slate-950 transition hover:from-sky-300 hover:to-cyan-200 shadow-lg shadow-cyan-500/20 active:scale-[0.99]"
              >
                <span>Hemen Başla: Gemi Paketini Oluşturun (599 USD)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* KART 2: TÜRK İHRACATÇISI & SANAYİ ÜRETİCİSİ (EMERALD / FOREST CLEAN TECH) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-emerald-400/40 bg-gradient-to-br from-[#052218] via-[#073224] to-[#041a12] p-6 text-white shadow-xl transition-all hover:border-emerald-400/60 hover:shadow-emerald-500/10 group">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-60" />

            <div>
              {/* Üst Başlık & Rozet */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 shadow-sm">
                    <Factory className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-300">
                      Türk İhracatçısı &amp; Sanayici
                    </span>
                    <h5 className="text-sm font-black text-white">
                      Fabrika Kapısı CBAM Beyanı
                    </h5>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-black text-xl text-white tracking-tight">4.900 TL</span>
                  <span className="block text-[10px] text-emerald-200">Tesis Başına</span>
                </div>
              </div>

              {/* Açıklama ve Özellik Listesi */}
              <p className="mt-3.5 text-xs text-emerald-100/90 leading-relaxed font-normal">
                Navlunu formülden çıkarın; fabrikanızın gerçek üretim emisyonlarını kanıtlayarak cezaları sıfırlayın.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-emerald-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Kesin Dönem 2025/2547 mevzuatına %100 tam uyum</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Avrupalı alıcının CBAM portalına yükleyeceği XML/PDF</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Cezai varsayılan değerlerden ve vergi kesintisinden koruma</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/basla/"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 px-5 text-xs sm:text-sm font-black text-slate-950 transition hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
              >
                <span>Ücretsiz Kapsam Kontrolünü Başlat</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
