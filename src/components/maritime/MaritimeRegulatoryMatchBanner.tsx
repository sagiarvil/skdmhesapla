import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, FileText, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export function MaritimeRegulatoryMatchBanner() {
  return (
    <div className="rounded-3xl border-2 border-sky-400/40 bg-gradient-to-br from-[#06192a] via-[#09263f] to-[#041320] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Arka Plan Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Üst Başlık & Teyit Rozeti */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/20 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 font-black text-sm">
            ✓
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white">
            Doğru Hizmette misiniz? AB Mevzuat ve Sektörel Adlandırma Sözleşmesi
          </h2>
        </div>
        <span className="rounded-full bg-cyan-950 px-3 py-1 text-[11px] font-mono font-bold text-cyan-300 border border-cyan-400/30">
          %100 MEVZUAT EŞLEŞMESİ
        </span>
      </div>

      <p className="mt-4 text-xs sm:text-sm text-sky-100/90 leading-relaxed">
        Tıpkı karasal sanayide <em>&ldquo;SKDM&rdquo;</em> teriminin resmi uluslararası adının <strong>&ldquo;EU CBAM&rdquo;</strong> olması gibi;
        denizcilikte platformumuzun sunduğu hizmetin Avrupa Birliği mevzuatındaki ve uluslararası klas kuruluşlarındaki
        (DNV, Bureau Veritas, RINA, ABS) resmi yasal karşılıkları aşağıdadır:
      </p>

      {/* 4 Resmi Hizmet Karşılığı Grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        <div className="rounded-xl border border-sky-400/20 bg-sky-950/60 p-3">
          <span className="block text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
            1. AB YASAL ADI
          </span>
          <strong className="block mt-1 text-white font-sans text-sm">
            EU ETS Maritime
          </strong>
          <span className="block mt-1 text-[11px] text-sky-100 font-semibold">
            Direktif (AB) 2023/957 (2003/87/EC Md. 3ga-3gg) · EUA Teslim Yükümlülüğü
          </span>
        </div>

        <div className="rounded-xl border border-emerald-400/20 bg-emerald-950/60 p-3">
          <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            2. AB YASAL ADI
          </span>
          <strong className="block mt-1 text-white font-sans text-sm">
            FuelEU Maritime
          </strong>
          <span className="block mt-1 text-[11px] text-emerald-100 font-semibold">
            Tüzük (AB) 2023/1805 &amp; IR (AB) 2024/2031 · Sera Gazı Yoğunluğu &amp; Ceza
          </span>
        </div>

        <div className="rounded-xl border border-indigo-400/20 bg-indigo-950/60 p-3">
          <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
            3. DİJİTAL SİSTEM ADI
          </span>
          <strong className="block mt-1 text-white font-sans text-sm">
            EMSA THETIS-MRV v2
          </strong>
          <span className="block mt-1 text-[11px] text-indigo-100 font-semibold">
            Tüzük (AB) 2015/757 &amp; IR (AB) 2023/2449 Ek II (Part A-G) XML Formatı
          </span>
        </div>

        <div className="rounded-xl border border-amber-400/20 bg-amber-950/60 p-3">
          <span className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            4. TİCARİ NAVLUN ADI
          </span>
          <strong className="block mt-1 text-white font-sans text-sm">
            ETS Freight Surcharge
          </strong>
          <span className="block mt-1 text-[11px] text-amber-100 font-semibold">
            Konteyner / Sefer Başına Yansıtılan Karbon Navlun Ek Maliyet Hesabı
          </span>
        </div>
      </div>

      {/* Kontrol Listesi: Evet Bu Hizmet / Hayır Karasal Ürün */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 pt-5 border-t border-sky-400/20 text-xs leading-relaxed">
        {/* Sol: Aradığınız Hizmet Bu mu? */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/50 p-4">
          <div className="flex items-center gap-2 font-black text-emerald-300 uppercase tracking-wide">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Aşağıdaki Durumlardaysanız DOĞRU YERDESİNİZ:</span>
          </div>
          <ul className="mt-3 space-y-2 text-emerald-50 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>5.000 GT üzeri kargo/yolcu gemisi işletiyorsanız veya acentesiyseniz,</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>DNV, RINA, Bureau Veritas veya ABS denetimi için <strong>THETIS-MRV XML</strong> veya <strong>FuelEU</strong> dosyası hazırlıyorsanız,</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Türkiye-AB seferlerindeki %50 EUA karbon açığını ve yakıt kütüğünü mühürlemek istiyorsanız.</span>
            </li>
          </ul>
        </div>

        {/* Sağ: Ne Zaman Karasal CBAM'e Gitmelisiniz? */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/50 p-4">
          <div className="flex items-center gap-2 font-black text-amber-300 uppercase tracking-wide">
            <XCircle className="h-4 w-4 text-amber-400" />
            <span>Ne Zaman Karasal CBAM Sayfasına Gitmelisiniz?</span>
          </div>
          <p className="mt-3 text-amber-50 font-medium">
            Eğer bir sanayi üreticisiyseniz (çelik profil, cıvata, alüminyum döküm, çimento vb.) ve AB müşteriniz
            sizden <strong>gümrük beyanı için fabrika emisyon raporu</strong> istediyse, denizcilik sayfasında değil;
            <strong>Karasal CBAM (SKDM)</strong> sayfasında olmalısınız.
          </p>
          <div className="mt-3 pt-2 border-t border-amber-500/20">
            <Link
              href="/basla/"
              className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-white transition underline"
            >
              Karasal Sanayi CBAM Raporlama Sayfasına Git →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
