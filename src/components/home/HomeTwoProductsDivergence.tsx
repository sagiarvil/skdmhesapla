import React from "react";
import Link from "next/link";
import { Factory, Ship, ArrowRight, CheckCircle2, ShieldAlert, FileText, Anchor } from "lucide-react";

export function HomeTwoProductsDivergence() {
  return (
    <section className="border-b border-line bg-gradient-to-b from-white via-slate-50/50 to-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Üst Başlık & Net İki Ürün Deklarasyonu */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-900 shadow-xs">
            AB UYUM REJİMLERİ · DOĞRU ÜRÜN REHBERİ
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
            SKDMHesapla&apos;da 2 Temel AB Karbon Çözümü
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-ink-700">
            Avrupa Birliği mevzuatında sanayi üretimi ile deniz lojistiği <strong>iki ayrı yasal rejimdir</strong>.
            Tereddüde düşmeden, faaliyet alanınıza ve AB alıcınızın resmi talebine uygun çözümü seçin:
          </p>
        </div>

        {/* 2 Ürün Karşılaştırma ve Seçim Kartları */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* ÜRÜN 1: KARASAL İHRACATÇI SKDM / CBAM RAPORU */}
          <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-brand-800/25 bg-gradient-to-b from-[#f7fbf3] via-white to-white p-7 shadow-sm hover:border-brand-800 hover:shadow-xl transition-all duration-300">
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-brand-800/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-900 text-brand-400 shadow-sm">
                    <Factory className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">
                      1. ANA ÜRÜN · FABRİKA KAPISI
                    </span>
                    <h3 className="text-xl font-black text-ink-900">
                      Karasal İhracatçı CBAM / SKDM Raporu
                    </h3>
                  </div>
                </div>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-[11px] font-black text-brand-900 border border-brand-800/20">
                  Sanayi &amp; İhracat
                </span>
              </div>

              {/* Resmi AB Mevzuatı */}
              <div className="mt-4 rounded-xl bg-brand-900/[0.04] border border-brand-800/15 p-3 font-mono text-xs text-brand-950">
                <span className="font-bold text-brand-900 block text-[11px] uppercase tracking-wider">
                  Resmi AB Yasal Karşılığı:
                </span>
                <strong>EU CBAM Regulation (EU) 2023/956</strong> &amp; <strong>Implementing Reg (EU) 2025/2547</strong>
              </div>

              {/* Kriterler ve Kapsam */}
              <ul className="mt-5 space-y-3 text-xs sm:text-sm text-ink-800">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                  <span>
                    <strong>Kimler İçin:</strong> AB&apos;ye demir-çelik, alüminyum, çimento, gübre, hidrojen veya elektrik ihraç eden imalatçılar.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                  <span>
                    <strong>Hesaplama Sınırı:</strong> Fabrika kapısında doğrudan Kapsam 1 (baca gazı/yakıt) + Kapsam 2 (şebeke elektriği) gömülü emisyonları (SEE) ve öncül maddeler.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                  <span>
                    <strong>Alıcının Talebi:</strong> &ldquo;Gümrük beyanı ve CBAM portalı için resmi Communication Template formatında tesis emisyon çalışma dosyanızı iletin.&rdquo;
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                  <span>
                    <strong>Teslim Edilen Çıktı:</strong> 12 parçalı CBAM Mühürlü Dosya, Komisyon XLSX Eşleme Özeti, Kapsam 1-2 Hesap İzi, İzleme Planı ve SHA-256 Doğrulama Mührü.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-7 pt-4 border-t border-brand-800/15">
              <Link
                href="/basla/"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-900 px-6 text-sm font-black text-brand-400 transition hover:bg-brand-950 shadow-md group-hover:shadow-brand-900/20"
              >
                Karasal CBAM Dosyası Hazırla <ArrowRight className="h-4 w-4 text-brand-400" />
              </Link>
              <div className="mt-2 text-center text-xs font-semibold text-ink-600">
                Ücretsiz GTİP kontrolü ile başlayın · 569 resmi CN kodu
              </div>
            </div>
          </div>

          {/* ÜRÜN 2: DENİZCİLİK VE LOJİSTİK KARBONU */}
          <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-sky-400/40 bg-gradient-to-b from-[#061828] via-[#082238] to-[#04121d] p-7 text-white shadow-xl hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-sky-400/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-slate-950 shadow-sm">
                    <Ship className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                      2. ANA ÜRÜN · SEFER &amp; NAVLUN
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Denizcilik ve Lojistik Karbonu
                    </h3>
                  </div>
                </div>
                <span className="rounded-full bg-cyan-950 px-3 py-1 text-[11px] font-black text-cyan-300 border border-cyan-400/30">
                  Armatör &amp; Lojistik
                </span>
              </div>

              {/* Resmi AB Mevzuatı */}
              <div className="mt-4 rounded-xl bg-sky-950/80 border border-sky-400/25 p-3 font-mono text-xs text-sky-100">
                <span className="font-bold text-cyan-400 block text-[11px] uppercase tracking-wider">
                  Resmi AB Yasal Karşılığı:
                </span>
                <strong>EU ETS Maritime — Directive (EU) 2023/957</strong> &amp; <strong>FuelEU Maritime — Reg (EU) 2023/1805</strong>
              </div>

              {/* Kriterler ve Kapsam */}
              <ul className="mt-5 space-y-3 text-xs sm:text-sm text-sky-100/90">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <span>
                    <strong>Kimler İçin:</strong> Armatörler, gemi işletmecileri (DOC/ISM Company), lojistik yöneticileri ve navlun karbon sürşarjı ödeyen ihracatçılar.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <span>
                    <strong>Hesaplama Sınırı:</strong> 5.000 GT+ gemilerin Türkiye-AB arası (%50) ve AB içi (%100) seyir yakıt tüketimi (BDN), EUA teslim açığı ve FuelEU sera gazı yoğunluğu (gCO₂e/MJ).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <span>
                    <strong>Alıcının/Denetçinin Talebi:</strong> &ldquo;Klas kuruluşuna (DNV, BV, RINA) ve THETIS-MRV portalına sunulacak doğrulanabilir sefer ve yakıt kütüğünü teslim edin.&rdquo;
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <span>
                    <strong>Teslim Edilen Çıktı:</strong> 6 parçalı paket (EMSA THETIS XML v2, FuelEU JSON, Sefer Kütüğü CSV, Çift Dilli İngilizce &amp; Türkçe Pro Premium PDF Raporları).
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-7 pt-4 border-t border-sky-400/20">
              <Link
                href="/denizcilik/"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-300 px-6 text-sm font-black text-slate-950 transition hover:from-sky-300 hover:to-cyan-200 shadow-lg shadow-cyan-500/20"
              >
                Denizcilik Uyum Çözümünü Gör ($399) <ArrowRight className="h-4 w-4 text-slate-950" />
              </Link>
              <div className="mt-2 text-center text-xs font-semibold text-cyan-300/80">
                1 Gemi · 1 Raporlama Yılı · Tek Seferlik $399 · Anında İndirme
              </div>
            </div>
          </div>
        </div>

        {/* Müşteri Tereddütünü %100 Engelleyen Yasal Sınır Notu */}
        <div className="mt-8 rounded-2xl border-2 border-amber-400/40 bg-amber-50/80 p-4 sm:p-5 text-amber-950 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="text-xs sm:text-sm leading-relaxed font-medium">
            <strong className="font-black text-amber-900 block mb-0.5">
              HUKUKİ REJİM AYRIMI — Hangi Ürün Sizin İçin Doğru?
            </strong>
            Deniz navlunu CBAM (SKDM) fabrika kapısı formülüne <strong>asla girmez</strong> (AB 2023/956). Fabrika bacası emisyonu da denizcilik ETS&apos;sine girmez (AB 2023/957).
            İmalatçı sanayiyseniz <strong>Karasal CBAM</strong>; armatör veya navlun sürşarjı muhatabıysanız <strong>Denizcilik ETS &amp; FuelEU</strong> hizmetini seçmelisiniz.
          </div>
        </div>
      </div>
    </section>
  );
}
