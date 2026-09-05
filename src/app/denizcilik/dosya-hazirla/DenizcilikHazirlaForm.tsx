"use client";

import React, { useState } from "react";
import {
  Ship,
  Compass,
  Fuel,
  FileCheck2,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function DenizcilikHazirlaForm() {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Form State
  const [shipName, setShipName] = useState("");
  const [imoNumber, setImoNumber] = useState("");
  const [flagState, setFlagState] = useState("TR - Türkiye");
  const [grossTonnage, setGrossTonnage] = useState("12500");
  const [shipType, setShipType] = useState("Konteyner Gemisi");

  const [reportingYear, setReportingYear] = useState("2025");
  const [departurePort, setDeparturePort] = useState("Ambarlı (TR)");
  const [destinationPort, setDestinationPort] = useState("Cenova (IT)");
  const [annualVoyages, setAnnualVoyages] = useState("24");

  const [fuelType, setFuelType] = useState("VLSFO (0.50% Sülfür)");
  const [fuelQuantity, setFuelQuantity] = useState("1850");
  const [bdnCount, setBdnCount] = useState("8");
  const [verifierPref, setVerifierPref] = useState("DNV / Bureau Veritas / RINA");

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border-2 border-sky-800/30 bg-[#f4f8fa] p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-900 text-white shadow-sm">
          <CheckCircle2 className="h-8 w-8 text-sky-300" />
        </div>
        <h3 className="mt-5 text-2xl font-black text-ink-900">
          Denizcilik Karbon Uyum Dosyası Taslağınız Oluşturuldu!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-700">
          <strong>{shipName || "Gemi"} (IMO: {imoNumber || "Belirtilmedi"})</strong> için {reportingYear} raporlama yılı sefer ve yakıt verileriniz kilitlendi.
        </p>

        <div className="mt-6 rounded-2xl border border-sky-900/15 bg-white p-5 text-left text-xs text-ink-800">
          <div className="flex justify-between border-b border-line pb-2">
            <span className="font-bold text-ink-600">Hizmet Bedeli:</span>
            <span className="font-black text-ink-900">$399 (Tek Seferlik)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-line">
            <span className="font-bold text-ink-600">Kapsam:</span>
            <span className="font-semibold text-sky-950">EU MRV + EU ETS + FuelEU Maritime</span>
          </div>
          <div className="flex justify-between py-2 border-b border-line">
            <span className="font-bold text-ink-600">Klas Hazırlığı:</span>
            <span className="font-semibold text-emerald-800">READY FOR VERIFICATION</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="font-bold text-ink-600">Arşiv Güvencesi:</span>
            <span className="font-semibold text-ink-900">Değişmez Snapshot + Yeniden İndirme</span>
          </div>
        </div>

        <div className="mt-7">
          <button
            type="button"
            onClick={() => alert("Paddle ödeme altyapısı güvenli ödeme oturumu başlatılıyor... ($399)")}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-900 px-6 text-sm font-black text-white shadow-md transition hover:bg-sky-800 sm:w-auto"
          >
            <Lock className="h-4 w-4 text-sky-300" /> Paddle ile Güvenli Öde ($399) ve Mühürlü Dosyayı İndir
          </button>
          <p className="mt-3 text-[11px] text-ink-500">
            Faturanız işletme unvanınıza düzenlenir ve sistem tarafından anında e-posta adresinize gönderilir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
      {/* 4 Adımlı İlerleme Çubuğu */}
      <div className="grid grid-cols-4 gap-2 border-b border-line pb-5">
        {[
          { num: 1, label: "Gemi Kimliği" },
          { num: 2, label: "Seferler" },
          { num: 3, label: "Bunker & BDN" },
          { num: 4, label: "Doğrulama" },
        ].map((s) => (
          <div key={s.num} className="text-center">
            <div
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                step === s.num
                  ? "bg-sky-900 text-white"
                  : step > s.num
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span className="mt-1 block text-[10px] font-bold text-ink-700 sm:text-xs">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleFinalOrder} className="mt-6 space-y-5">
        {/* Adım 1: Gemi Kimlik Bilgileri */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-black text-ink-900 flex items-center gap-2">
              <Ship className="h-5 w-5 text-sky-800" /> Adım 1: Gemi ve ISM İşletmecisi Bilgileri
            </h3>
            <p className="text-xs text-ink-600">
              EU MRV ve THETIS-MRV sisteminde kayıtlı resmi gemi parametrelerini girin.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Gemi Adı (Ship Name) *
                </label>
                <input
                  type="text"
                  required
                  value={shipName}
                  onChange={(e) => setShipName(e.target.value)}
                  placeholder="Örn: M/V MARMARA STAR"
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  IMO Numarası (IMO Number) *
                </label>
                <input
                  type="text"
                  required
                  value={imoNumber}
                  onChange={(e) => setImoNumber(e.target.value)}
                  placeholder="7 haneli sayı, örn: 9876543"
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Bayrak Devleti (Flag)
                </label>
                <input
                  type="text"
                  value={flagState}
                  onChange={(e) => setFlagState(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Brüt Tonaj (Gross Tonnage - GT) *
                </label>
                <input
                  type="number"
                  min={5000}
                  value={grossTonnage}
                  onChange={(e) => setGrossTonnage(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                />
                <span className="mt-1 block text-[10px] text-ink-500">Zorunlu eşik: ≥ 5.000 GT</span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Gemi Tipi
                </label>
                <select
                  value={shipType}
                  onChange={(e) => setShipType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                >
                  <option value="Konteyner Gemisi">Konteyner Gemisi</option>
                  <option value="Dökme Yük Gemisi (Bulk Carrier)">Dökme Yük Gemisi (Bulk Carrier)</option>
                  <option value="Ro-Ro Kargo Gemisi">Ro-Ro Kargo Gemisi</option>
                  <option value="Genel Kargo (General Cargo)">Genel Kargo (General Cargo)</option>
                  <option value="Tanker (Kimyasal/Petrol)">Tanker (Kimyasal/Petrol)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Adım 2: Sefer ve Liman Kapsamı */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-black text-ink-900 flex items-center gap-2">
              <Compass className="h-5 w-5 text-sky-800" /> Adım 2: Raporlama Yılı ve Seferler
            </h3>
            <p className="text-xs text-ink-600">
              Geminin Türkiye ve AB limanları arasındaki seyir döngüsünü ve sefer sıklığını belirleyin.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Raporlama Takvim Yılı
                </label>
                <select
                  value={reportingYear}
                  onChange={(e) => setReportingYear(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                >
                  <option value="2025">2025 (%70 ETS Phase-in + FuelEU Başlangıcı)</option>
                  <option value="2026">2026 (%100 Kesin Dönem ETS)</option>
                  <option value="2024">2024 Geçmiş Yıl Düzeltmesi (%40 ETS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Yıllık Tahmini Sefer Sayısı (Voyages)
                </label>
                <input
                  type="number"
                  min={1}
                  value={annualVoyages}
                  onChange={(e) => setAnnualVoyages(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Ana Kalkış Limanı (Türkiye)
                </label>
                <input
                  type="text"
                  value={departurePort}
                  onChange={(e) => setDeparturePort(e.target.value)}
                  placeholder="Örn: Ambarlı, Mersin, Evyapport"
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Ana Varış Limanı (Avrupa Birliği)
                </label>
                <input
                  type="text"
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  placeholder="Örn: Cenova, Rotterdam, Valensiya, Trieste"
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Adım 3: Bunker Yakıt & BDN Kanıt Omurgası */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-black text-ink-900 flex items-center gap-2">
              <Fuel className="h-5 w-5 text-sky-800" /> Adım 3: Bunker Yakıt &amp; BDN Kanıt Omurgası
            </h3>
            <p className="text-xs text-ink-600">
              FuelEU Maritime ve MRV için yakıt türü, yıllık tüketim ve Bunker Delivery Notes (BDN) kanıt sayısı.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Birincil Yakıt Türü
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                >
                  <option value="VLSFO (0.50% Sülfür)">VLSFO (Çok Düşük Sülfürlü Fuel Oil)</option>
                  <option value="LSMGO (0.10% Sülfür)">LSMGO (Düşük Sülfürlü Gaz Yağı)</option>
                  <option value="HFO (Ağır Yakıt)">HFO (Scrubber donanımlı Ağır Yakıt)</option>
                  <option value="LNG (Sıvılaştırılmış Doğal Gaz)">LNG (Sıvılaştırılmış Doğal Gaz)</option>
                  <option value="Biyoyakıt Karışımı (Bio-blend)">Biyoyakıt Karışımı (Bio-blend)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-ink-700">
                  Toplam Tüketilen Yakıt (Metrik Ton)
                </label>
                <input
                  type="number"
                  min={1}
                  value={fuelQuantity}
                  onChange={(e) => setFuelQuantity(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-ink-700">
                Ekli Bunker Teslim Notu (BDN) Sayısı
              </label>
              <input
                type="number"
                min={1}
                value={bdnCount}
                onChange={(e) => setBdnCount(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
              />
              <span className="mt-1 block text-[10px] text-ink-500">
                BDN faturaları doğrulayıcı için kanıt zinciri olarak mühürlü pakete indekslenir.
              </span>
            </div>
          </div>
        )}

        {/* Adım 4: Doğrulama ve Mühürleme Onayı */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-black text-ink-900 flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-sky-800" /> Adım 4: Klas Doğrulamasına Hazırlık ve Teslim
            </h3>
            <p className="text-xs text-ink-600">
              Dosyanız IACS üyesi yetkili klas kuruluşuna doğrudan sunulacak düzende oluşturulur.
            </p>

            <div>
              <label className="block text-xs font-black uppercase text-ink-700">
                Hedef Klas Kuruluşu / Verifier
              </label>
              <input
                type="text"
                value={verifierPref}
                onChange={(e) => setVerifierPref(e.target.value)}
                placeholder="Örn: DNV, Bureau Veritas, RINA, ABS, ClassNK"
                className="mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfb] px-3.5 py-2.5 text-xs font-bold text-ink-900 focus:border-sky-800 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-sky-900/15 bg-[#f0f5f7] p-4 text-xs text-ink-800 space-y-1.5">
              <div className="font-black text-sky-950">Hazırlanan Dosya İçeriği:</div>
              <div>• Gemi Sefer ve Mesafe Raporu (Voyage Emission Summary)</div>
              <div>• FuelEU Maritime Sera Gazı Yoğunluğu (WtW) Hesap Çizelgesi</div>
              <div>• EU ETS %50 Seferlik EUA Teslim Matrisi</div>
              <div>• BDN &amp; Yakıt Kanıt İndeksi ve Kriptografik SHA-256 Mührü</div>
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex items-center justify-between border-t border-line pt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="rounded-xl border border-line px-4 py-2 text-xs font-bold text-ink-700 hover:bg-slate-50"
            >
              Geri
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-900 px-5 py-2.5 text-xs font-black text-white hover:bg-sky-800"
            >
              Devam Et <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-black text-white hover:bg-emerald-600 shadow-sm"
            >
              <Lock className="h-3.5 w-3.5" /> Dosyayı Kilitle ve $399 İle Başlat
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
