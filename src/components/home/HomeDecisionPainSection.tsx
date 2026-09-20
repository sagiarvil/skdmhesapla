import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, DollarSign, FileSpreadsheet, Lock, ShieldAlert, Users, Zap } from "lucide-react";

export function HomeDecisionPainSection() {
  return (
    <section className="border-b border-line bg-gradient-to-b from-white via-[#f7faf5] to-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Üst Başlık: Ticari Problem & Karar Odaklı Yaklaşım */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-800/20 bg-rose-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-rose-900 shadow-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-700" />
            TİCARİ RİSK &amp; MALİYET ANALİZİ
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
            CBAM&apos;de Ürününüz Rapor Değildir, Karardır.
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-ink-700">
            Eksik veya yanlış veri sadece bürokratik bir sorun değildir; doğrudan <strong>nakit cezası, gümrük blokajı ve müşteri kaybıdır</strong>.
            İşte sistemin işletmenizi koruduğu 4 kritik ticari risk:
          </p>
        </div>

        {/* 4 Acı ve Pahalı Maliyet Kartı */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Kart 1: Varsayılan Değer Cezası */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-rose-200 bg-white p-5 shadow-xs hover:border-rose-400 hover:shadow-md transition">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-black text-ink-900">
                Varsayılan Değer Cezası
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-700 font-medium">
                Tesisinizin gerçek verisini resmi şablonla vermezseniz, AB Komisyonu en yüksek varsayılan değeri uygular. Bu da ton başına <strong>~%30 daha fazla vergi</strong> demektir.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-100 text-[11px] font-bold text-rose-800">
              Risk: On binlerce € haksız karbon vergisi
            </div>
          </div>

          {/* Kart 2: Gümrük Blokajı */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-amber-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-black text-ink-900">
                Gümrük Blokajı &amp; Ret
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-700 font-medium">
                Resmi Communication Template formatında ve kanıt zinciriyle sunulmayan beyanlar AB gümrüklerinde askıya alınır; liman bekleme masrafı işletmenize biner.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] font-bold text-amber-900">
              Risk: Sevkiyatın reddi ve demuraj masrafı
            </div>
          </div>

          {/* Kart 3: Alıcının Siparişi İptali */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-sky-200 bg-white p-5 shadow-xs hover:border-sky-400 hover:shadow-md transition">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-800">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-black text-ink-900">
                Müşterinin Tedarikçi Değiştirmesi
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-700 font-medium">
                Avrupalı ithalatçı, CBAM ceza riskinden kaçınmak için doğrulanabilir veri sunamayan üreticileri bırakıp hızlıca hazır olan tedarikçilere geçer.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sky-100 text-[11px] font-bold text-sky-900">
              Risk: Yıllık AB ihracat kontratının kaybı
            </div>
          </div>

          {/* Kart 4: Dış Danışmanlık İsrafı */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-emerald-200 bg-white p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-black text-ink-900">
                10.000€+ Dış Danışmanlık İsrafı
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-700 font-medium">
                Her dosya için haftalar süren, dışa bağımlı ve fahiş danışmanlık faturaları ödemek yerine kurum içinde 15 dakikada kendi kararınızı üretin.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] font-bold text-emerald-900">
              Risk: Tekrarlayan yüksek danışmanlık maliyeti
            </div>
          </div>
        </div>

        {/* 15 Dakikalık Çözüm Köprüsü */}
        <div className="mt-10 rounded-3xl border-2 border-brand-800/20 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-brand-800">
              Karar Sistemi Çözümü
            </span>
            <h3 className="mt-1 text-xl sm:text-2xl font-black text-ink-900">
              15 Dakikada Kendi Verinizi Kontrol Edin, Gümrük Riskini Sıfırlayın.
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-ink-700 font-medium leading-relaxed">
              Ürün adıyla tahmin yürütmeyin. GTİP kodunuzu girin, eksik yakıt/elektrik/precursor girdilerini sistem göstersin ve AB alıcınızın doğrudan kabul edeceği SHA-256 mühürlü 12 parçalı resmi denetim paketini hazırlayın.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/basla/"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-400 px-6 text-sm font-black text-brand-950 shadow-md transition active:scale-95"
            >
              Ücretsiz Kontrolü Başlat <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
