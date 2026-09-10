"use client";

import React, { useState, useId } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Ship, Scale, Flame, AlertTriangle, Radio } from "lucide-react";

interface FuelSpec {
  name: string;
  factorCO2: number; // tCO2 / tFuel
  ghgIntensity: number; // gCO2eq / MJ (Well-to-Wake)
  lcv: number; // MJ / kg
}

const FUEL_SPECS: Record<string, FuelSpec> = {
  vlsfo: { name: "VLSFO (%0.5 Kükürt)", factorCO2: 3.114, ghgIntensity: 91.16, lcv: 41.0 },
  mgo: { name: "MGO / LSMGO (%0.1 Kükürt)", factorCO2: 3.206, ghgIntensity: 91.16, lcv: 42.7 },
  lng: { name: "LNG (Sıvılaştırılmış Doğalgaz)", factorCO2: 2.750, ghgIntensity: 78.30, lcv: 49.1 },
  bioB20: { name: "B20 Biyoyakıt Karışımı (RED II PoS)", factorCO2: 2.491, ghgIntensity: 74.50, lcv: 40.5 },
};

export function GemiKarbonHesaplayiciClient() {
  const searchParams = useSearchParams();
  const gemiParam = searchParams.get("gemi") || "";
  const yakitParam = searchParams.get("yakit");
  const yakitTipiParam = searchParams.get("yakitTipi");
  const rotaParam = searchParams.get("rota");
  const yilParam = searchParams.get("yil");

  const [routeType, setRouteType] = useState<"extra_eu" | "intra_eu">(
    rotaParam === "intra_eu" ? "intra_eu" : "extra_eu"
  );
  const [fuelType, setFuelType] = useState<string>(
    yakitTipiParam && FUEL_SPECS[yakitTipiParam] ? yakitTipiParam : "vlsfo"
  );
  const [fuelAmount, setFuelAmount] = useState<number>(
    yakitParam && Number(yakitParam) > 0 ? Number(yakitParam) : 65
  );
  const [year, setYear] = useState<"2025" | "2026">(
    yilParam === "2025" ? "2025" : "2026"
  );
  const [euaPrice, setEuaPrice] = useState<number>(72);

  const routeTypeId = useId();
  const fuelTypeId = useId();
  const fuelAmountId = useId();
  const yearId = useId();
  const euaPriceId = useId();

  // Savunmacı Hesaplama: Sıfıra bölme, negatif ve NaN sızıntı korumaları
  const safeFuelAmount = Math.max(0, isNaN(fuelAmount) ? 0 : fuelAmount);
  const safeEuaPrice = Math.max(0, isNaN(euaPrice) ? 0 : euaPrice);

  const fuel = FUEL_SPECS[fuelType] || FUEL_SPECS.vlsfo;
  const scopeMultiplier = routeType === "extra_eu" ? 0.5 : 1.0;
  const totalPhysicalCO2 = safeFuelAmount * fuel.factorCO2;
  const scopeAdjustedCO2 = totalPhysicalCO2 * scopeMultiplier;

  // 2025: %70 Phase-In, CO2 only
  // 2026: %100 Phase-In, +%2 CH4/N2O eşdeğer artışı
  const phaseInRate = year === "2025" ? 0.7 : 1.0;
  const nonCO2Factor = year === "2026" ? 1.02 : 1.0; // 2026 CH4/N2O genişlemesi
  const etsLiableEmissions = scopeAdjustedCO2 * phaseInRate * nonCO2Factor;
  const totalEtsCostEur = etsLiableEmissions * safeEuaPrice;

  // FuelEU Hesabı (Target 2025-2029: 89.34 gCO2eq/MJ)
  const fueleuTarget = 89.34;
  const energyMJ = safeFuelAmount * 1000 * fuel.lcv * scopeMultiplier;
  const actualIntensity = fuel.ghgIntensity;
  // Compliance Balance = (Target - Actual) * Energy
  const complianceBalanceGrams = (fueleuTarget - actualIntensity) * energyMJ;
  const isDeficit = complianceBalanceGrams < 0;
  // Penalty = (Abs(Deficit) / (41000 * Target)) * 2400 EUR
  const penaltyTonVlsfoEq = isDeficit
    ? Math.abs(complianceBalanceGrams) / (fueleuTarget * 41000)
    : 0;
  const fueleuPenaltyEur = penaltyTonVlsfoEq * 2400;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Form */}
      <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Ship className="h-5 w-5 text-cyan-700" />
          <span>Sefer ve Yakıt Parametreleri</span>
        </h2>

        {gemiParam && (
          <div className="mb-5 flex items-center justify-between rounded-xl bg-cyan-950/85 border border-cyan-400/40 p-3 text-xs font-mono text-cyan-200 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>KİLİTLİ HEDEF: <strong className="text-white">{gemiParam}</strong></span>
            </div>
            <span className="text-[10px] bg-cyan-800/80 px-2 py-0.5 rounded text-cyan-100 font-bold">
              Radar Telemetrisi Aktarıldı
            </span>
          </div>
        )}

        <div className="space-y-4">
          {/* Rota Tipi */}
          <div>
            <label htmlFor={routeTypeId} className="block text-xs font-bold text-slate-700 mb-1">
              Rota ve Coğrafi Kapsam
            </label>
            <select
              id={routeTypeId}
              value={routeType}
              onChange={(e) => setRouteType(e.target.value as "extra_eu" | "intra_eu")}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            >
              <option value="extra_eu">Türkiye - AB Limanı Arası Sefer (%50 ETS &amp; FuelEU Kapsamı)</option>
              <option value="intra_eu">İki AB Limanı Arası Sefer (%100 Tam Kapsam)</option>
            </select>
          </div>

          {/* Yakıt Tipi */}
          <div>
            <label htmlFor={fuelTypeId} className="block text-xs font-bold text-slate-700 mb-1">
              Kullanılan Yakıt Türü
            </label>
            <select
              id={fuelTypeId}
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            >
              {Object.entries(FUEL_SPECS).map(([key, spec]) => (
                <option key={key} value={key}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Yakıt Miktarı */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={fuelAmountId} className="text-xs font-bold text-slate-700">
                Tüketilen Yakıt Miktarı (Metrik Ton)
              </label>
              <span className="text-xs font-mono font-bold text-cyan-800">{fuelAmount} Ton</span>
            </div>
            <input
              id={fuelAmountId}
              type="range"
              min="5"
              max="500"
              step="5"
              value={fuelAmount}
              onChange={(e) => setFuelAmount(Number(e.target.value))}
              className="w-full accent-cyan-600"
            />
          </div>

          {/* Raporlama Yılı */}
          <div>
            <label htmlFor={yearId} className="block text-xs font-bold text-slate-700 mb-1">
              Raporlama Yılı ve Yürürlük Rejimi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setYear("2026")}
                className={`group relative flex flex-col justify-between rounded-xl p-3 text-left transition-all ${
                  year === "2026"
                    ? "border-2 border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-600/20"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-200/80 text-emerald-950">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    YÜRÜRLÜKTE
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    %100
                  </span>
                </div>
                <div className="mt-2">
                  <span className="block text-xs font-black tracking-tight">2026 Rejimi</span>
                  <span className="block text-[10px] text-emerald-800 font-medium">
                    CO₂ + CH₄ + N₂O Çoklu Gaz
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setYear("2025")}
                className={`group relative flex flex-col justify-between rounded-xl p-3 text-left transition-all ${
                  year === "2025"
                    ? "border-2 border-sky-700 bg-sky-50/80 text-sky-950 font-bold shadow-xs ring-1 ring-sky-600/20"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-sky-200/80 text-sky-950">
                    GEÇMİŞ DÖNEM
                  </span>
                  <span className="font-mono text-xs font-bold text-sky-800">
                    %70
                  </span>
                </div>
                <div className="mt-2">
                  <span className="block text-xs font-black tracking-tight">2025 Geçişi</span>
                  <span className="block text-[10px] text-sky-800 font-medium">
                    Yalnızca CO₂ Kapsamı
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* EUA Fiyatı */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={euaPriceId} className="text-xs font-bold text-slate-700">
                Tahmini EUA Karbon Fiyatı (€ / Ton)
              </label>
              <span className="text-xs font-mono font-bold text-cyan-800">{euaPrice} €</span>
            </div>
            <input
              id={euaPriceId}
              type="range"
              min="50"
              max="120"
              step="2"
              value={euaPrice}
              onChange={(e) => setEuaPrice(Number(e.target.value))}
              className="w-full accent-cyan-600"
            />
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-6 space-y-4">
        {/* EU ETS Sonuç Kartı */}
        <div className="rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-br from-sky-900 to-[#05192d] p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-cyan-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                EU ETS Sefer Maliyeti
              </span>
            </div>
            <span className="text-xs font-mono bg-cyan-400/20 text-cyan-200 px-2.5 py-0.5 rounded-full">
              {year === "2026" ? "%100 Yürürlük" : "%70 Yürürlük"}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white">
              {Math.round(totalEtsCostEur).toLocaleString("tr-TR")} €
            </span>
            <span className="text-xs text-sky-200 font-medium">
              (~${Math.round(totalEtsCostEur * 1.08).toLocaleString("tr-TR")})
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-300 block">Fiziksel CO₂:</span>
              <strong className="text-white font-mono">{totalPhysicalCO2.toFixed(1)} Ton</strong>
            </div>
            <div>
              <span className="text-slate-300 block">Teslim Edilecek EUA:</span>
              <strong className="text-cyan-300 font-mono">{etsLiableEmissions.toFixed(1)} Adet</strong>
            </div>
          </div>
        </div>

        {/* FuelEU Sonuç Kartı */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-teal-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                FuelEU Maritime Uyum Durumu
              </span>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                isDeficit ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {isDeficit ? "Uyum Açığı (Ceza Riski)" : "Uyum Sağlandı"}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Yakıt Yoğunluğu:</span>
              <strong className="text-slate-900 font-mono text-sm">{actualIntensity.toFixed(2)} g/MJ</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Hedef Yoğunluk (2025):</span>
              <strong className="text-slate-900 font-mono text-sm">{fueleuTarget.toFixed(2)} g/MJ</strong>
            </div>
          </div>

          {isDeficit && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Tahmini FuelEU Cezası: {Math.round(fueleuPenaltyEur).toLocaleString("tr-TR")} €</span>
              </div>
              <span>
                Standart fosil yakıt (VLSFO/MGO) tüketiminde hedefin üzerinde kalındığı için ton eşdeğeri başına 2.400 EUR ceza riski bulunur. Biyoyakıt veya banking ile kapatılabilir.
              </span>
            </div>
          )}
        </div>

        {/* Conversion CTA */}
        <div className="rounded-2xl border border-cyan-300 bg-gradient-to-r from-cyan-50 to-sky-50 p-6 text-center">
          <h3 className="text-sm font-black text-slate-900">
            Resmi Denetim ve THETIS-MRV Rapor Paketi
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            9 yasal klasör, THETIS-MRV XML çıktısı ve akredite doğrulayıcı inceleme dosyanızı hazırlayın.
          </p>
          <Link
            href="/denizcilik/dosya-hazirla/#form-section"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-black text-white hover:bg-slate-800 transition-colors shadow-md w-full"
          >
            <span>Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
