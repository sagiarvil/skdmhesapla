import React from "react";
import Link from "next/link";
import {
  Ship,
  Compass,
  FileCheck2,
  Download,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
} from "lucide-react";

export function MaritimeProcessInfographic() {
  const steps = [
    {
      number: "01",
      title: "Gemi ve DOC Şirket Bilgileri",
      duration: "Doğrulama",
      badge: "IMO Checksum Doğrulaması",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
      icon: Ship,
      iconBg: "bg-sky-600 text-white",
      description:
        "IMO numaranızı, gemi adını, tonajını ve akredite doğrulayıcınızı (DNV, Bureau Veritas, RINA, ABS vb.) seçin.",
      benefits: [
        "Resmi IMO kontrol basamağı formülü (Res. A.1078(28)) yanlış girişleri engeller.",
        "Yetkili İdareci Makam (Yunanistan, İtalya, Almanya vb.) otomatik eşlenir.",
      ],
      easeStatement: "Resmi IMO ve bayrak devleti verileriyle tam tutarlı profil.",
    },
    {
      number: "02",
      title: "Sefer & Bunker (BDN) Yakıt Girişi",
      duration: "Hesaplama",
      badge: "Mevzuat Karar Ağacı",
      badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
      icon: Compass,
      iconBg: "bg-teal-600 text-white",
      description:
        "Türk limanlarından (Ambarlı, Mersin vb.) AB limanlarına (Rotterdam, Pire vb.) yapılan seferleri ve yakıt miktarını girin.",
      benefits: [
        "Direktif 2023/957 gereği TR-AB seferlerindeki %50 emisyon kuralı ayrılır.",
        "Türkçe ve uluslararası sayı formatları deterministik hassasiyetle işlenir.",
      ],
      easeStatement: "Tüzük kuralları doğrultusunda coğrafi kapsam ayrımı.",
    },
    {
      number: "03",
      title: "Analiz ve Çift Dilli Önizleme",
      duration: "Denetim İzi",
      badge: "Tam Şeffaf Hesaplama İzi",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: FileCheck2,
      iconBg: "bg-amber-600 text-white",
      description:
        "EU ETS karbon açığı (%70 phase-in) ve FuelEU sera gazı yoğunluğu (gCO₂e/MJ) ceza maruziyetini detaylı inceleyin.",
      benefits: [
        "Nihai onay öncesinde raporun tüm matematiksel ara ve nihai değerleri listelenir.",
        "Raporu hem Türkçe hem İngilizce olarak modalda denetleyin ve doğrulayın.",
      ],
      easeStatement: "Ödeme öncesinde tüm emisyon ve EUA kalemleri şeffaf olarak listelenir.",
    },
    {
      number: "04",
      title: "Güvenli Lisans & 6 Parçalık Mühürlü Paket",
      duration: "Mühürlü Paket",
      badge: "Klas Denetimine Hazır",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      icon: Download,
      iconBg: "bg-emerald-600 text-white",
      description:
        "Paddle PCI-DSS Seviye 1 güvencesiyle tek seferlik 599 USD lisanslama ile tüm resmi çıktı setini indirin.",
      benefits: [
        "İngilizce & Türkçe Pro Premium PDF'ler, EMSA THETIS XML ve FuelEU JSON tek pakette.",
        "Kriptografik SHA-256 bütünlük manifestosu ile klas doğrulayıcısına sunulmaya hazır.",
      ],
      easeStatement: "Mühürlü PKZIP arşivi ve 6 resmi teknik dosya anında teslim edilir.",
    },
  ];

  return (
    <section className="border-t border-line bg-gradient-to-b from-white via-sky-50/30 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        {/* Başlık ve Mühendislik İş Akışı */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-800/20 bg-sky-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-sky-950 shadow-xs">
            <FileCheck2 className="h-3.5 w-3.5 text-sky-700" />
            RESMİ KLAS VE MEVZUAT UYUMLU İŞ AKIŞI
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
            Gemi ve Sefer Verilerinden Doğrulama Dosyasına: 4 Aşamalı Mühendislik Süreci
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-ink-700">
            THETIS-MRV ve FuelEU Maritime kuralları kapsamında sefer kayıtları, bunker belgeleri (BDN) ve liman operasyonları deterministik formüllerle işlenir; akredite klas denetimine tam uyumlu teknik paket oluşturulur.
          </p>
        </div>

        {/* 4 Adımlı İnfografik Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-sky-400/25 bg-white p-6 shadow-sm hover:border-sky-500 hover:shadow-xl transition-all duration-300"
              >
                {/* Üst Numara & Süre */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-mono text-2xl font-black text-sky-950">
                      {step.number}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                      <Clock className="h-3 w-3 text-slate-500" />
                      {step.duration}
                    </span>
                  </div>

                  {/* İkon ve Başlık */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${step.iconBg} group-hover:scale-110 transition`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-black text-ink-900 leading-tight">
                      {step.title}
                    </h3>
                  </div>

                  {/* Kategori Rozeti */}
                  <div className="mt-3">
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                  </div>

                  {/* Açıklama */}
                  <p className="mt-3 text-xs leading-relaxed text-ink-700">
                    {step.description}
                  </p>

                  {/* Kolaylık Maddeleri */}
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[11px] text-ink-800">
                    {step.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-700" />
                        <span className="leading-tight">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kolaylık Güvencesi Notu */}
                <div className="mt-5 rounded-xl border border-sky-800/10 bg-sky-50/60 p-2.5 text-[11px] font-bold text-sky-950 text-center">
                  {step.easeStatement}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rahatlatıcı Müşteri Güven ve Destek Barı */}
        <div className="mt-10 rounded-2xl border-2 border-sky-800/20 bg-gradient-to-r from-sky-950 via-[#07243a] to-sky-950 p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">
                Müşteri Güvenliği &amp; Kesintisiz Destek Garantisi
              </h4>
              <p className="text-xs text-sky-100/80 mt-0.5 font-normal">
                Paddle PCI-DSS Seviye 1 güvenceli ödeme · Kredi kartı bilgisi tutulmaz · SHA-256 dijital mühür
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/denizcilik/dosya-hazirla/"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-300 px-5 text-xs sm:text-sm font-black text-slate-950 transition hover:from-sky-300 hover:to-cyan-200 shadow-md shadow-cyan-500/20"
            >
              Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD) <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/denizcilik/#simulator"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-sky-900/60 px-4 text-xs font-bold text-cyan-200 hover:bg-sky-800 transition"
            >
              İhracatçı Navlun Sürşarjı Simülatörüne İn ↓
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
