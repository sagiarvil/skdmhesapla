import { Check, X, Clock, Shield, Globe2, Wallet, RefreshCw, ArrowRight } from "lucide-react";

/**
 * "Üç yolunuz var" — premium karşılaştırma.
 *
 * Tasarım kararları:
 * - SKDMHesapla sütunu tablodan TAŞAN yükseltilmiş kart (elevated) — göz
 *   doğrudan oraya gidiyor, "önerilen" olduğu rozet olmadan da anlaşılıyor.
 * - Fiyat sütun başlığında büyük punto — asıl satın alma sinyali orası.
 * - Sütunun altında CTA — karşılaştırmayı okuyan kişi aynı yerde harekete
 *   geçebiliyor, sayfayı yukarı kaydırmak zorunda kalmıyor.
 * - Rakip sütunları bilinçli olarak soluk (text-ink-500) — kontrast SKDMHesapla
 *   lehine, ama veriler okunabilir kalıyor (dürüst karşılaştırma).
 */
export function UcYolunuzVarKarsilastirma() {
  const satirlar = [
    {
      baslik: "Maliyet",
      icon: Wallet,
      danismanlik: "Proje bazlı yüksek bedel",
      abonelik: "Yıllık abonelik modelleri",
      biz: "9.900 ₺ tek sefer (KDV dahil)",
    },
    {
      baslik: "Süre",
      icon: Clock,
      danismanlik: "Haftalar süren yazışma",
      abonelik: "Kurulum ve eğitim gerektirir",
      biz: "Belgeler hazırsa aynı oturumda ilerleyebilirsiniz",
    },
    {
      baslik: "Düzeltme",
      icon: RefreshCw,
      danismanlik: "Ek ücrete tabi olabilir",
      abonelik: "Abonelik devam ettiği sürece",
      biz: "Aynı dosyada düzeltme ve yeniden mühürleme ücretsiz",
    },
    {
      baslik: "Dil",
      icon: Globe2,
      danismanlik: "Değişken",
      abonelik: "Çoğunlukla İngilizce",
      biz: "Tamamen Türkçe",
    },
    {
      baslik: "Veri gizliliği",
      icon: Shield,
      danismanlik: "Üçüncü kişilerle paylaşılır",
      abonelik: "Yurt dışı sunucular",
      biz: "Verileriniz sizde kalır; alıcıya yalnızca özet gider",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
          Üç yolunuz var
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-ink-600">
          SKDM yükümlülüğünü karşılamanın üç yaygın yolunu yan yana koyduk.
        </p>
      </div>

      {/* ── Masaüstü ── */}
      <div className="hidden md:block">
        <div className="relative grid grid-cols-[minmax(150px,0.9fr)_1fr_1fr_1.25fr] gap-x-0">
          {/* Yükseltilmiş vurgulu sütun — arka plan katmanı */}
          <div className="pointer-events-none absolute inset-y-[-14px] right-0 w-[calc((100%-150px)/3.25*1.25)] rounded-[28px] bg-white shadow-[0_20px_60px_-15px_rgba(26,54,32,0.28)] ring-1 ring-brand-800/10" />

          {/* Başlıklar */}
          <div className="pb-5" />
          <div className="flex items-end pb-5 pl-2">
            <span className="text-[13px] font-bold text-ink-400">Danışmanlık</span>
          </div>
          <div className="flex items-end pb-5 pl-2">
            <span className="text-[13px] font-bold text-ink-400">
              Abonelikli CBAM yazılımı
            </span>
          </div>
          <div className="relative z-10 flex flex-col justify-end rounded-t-[28px] bg-gradient-to-b from-brand-800 to-brand-900 px-7 pb-5 pt-7">
            <span className="text-[11px] font-black uppercase tracking-[0.14em] text-lime-300">
              Önerilen
            </span>
            <span className="mt-1 text-xl font-black text-white">SKDMHesapla</span>
          </div>

          {/* Satırlar */}
          {satirlar.map((s, i) => {
            const Icon = s.icon;
            const sonMu = i === satirlar.length - 1;
            return (
              <div key={s.baslik} className="contents">
                <div className={`flex items-center gap-2.5 py-6 pr-4 ${!sonMu ? "border-b border-line" : ""}`}>
                  <Icon className="h-[18px] w-[18px] shrink-0 text-brand-700" strokeWidth={2.2} />
                  <span className="text-[15px] font-black text-ink-900">{s.baslik}</span>
                </div>

                <div className={`flex items-start gap-2 py-6 pl-2 pr-5 ${!sonMu ? "border-b border-line" : ""}`}>
                  <X className="mt-[3px] h-4 w-4 shrink-0 text-ink-300" strokeWidth={2.5} />
                  <span className="text-[15px] font-medium leading-snug text-ink-500">
                    {s.danismanlik}
                  </span>
                </div>

                <div className={`flex items-start gap-2 py-6 pl-2 pr-5 ${!sonMu ? "border-b border-line" : ""}`}>
                  <X className="mt-[3px] h-4 w-4 shrink-0 text-ink-300" strokeWidth={2.5} />
                  <span className="text-[15px] font-medium leading-snug text-ink-500">
                    {s.abonelik}
                  </span>
                </div>

                <div className={`relative z-10 flex items-start gap-2.5 bg-white px-7 py-6 ${!sonMu ? "border-b border-brand-800/10" : ""}`}>
                  <Check className="mt-[3px] h-[18px] w-[18px] shrink-0 text-brand-700" strokeWidth={3} />
                  <span className="text-[15px] font-bold leading-snug text-ink-900">
                    {s.biz}
                  </span>
                </div>
              </div>
            );
          })}

          {/* CTA — yalnızca vurgulu sütunun altında */}
          <div className="col-span-3" />
          <div className="relative z-10 rounded-b-[28px] bg-white px-7 pb-7 pt-2">
            <a
              href="/basla/"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-800 px-6 py-3.5 text-[15px] font-black text-white transition hover:bg-brand-900"
            >
              Hemen başla
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-center text-[12px] font-medium text-ink-500">
              Ödeme öncesi hiçbir adımda ücret istenmez
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobil ── */}
      <div className="space-y-3 md:hidden">
        <div className="rounded-3xl bg-gradient-to-b from-brand-800 to-brand-900 p-6 shadow-lg">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-lime-300">
            Önerilen
          </span>
          <p className="mt-1 text-xl font-black text-white">SKDMHesapla</p>
          <ul className="mt-5 space-y-3">
            {satirlar.map((s) => (
              <li key={s.baslik} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" strokeWidth={3} />
                <span className="text-sm font-semibold leading-snug text-white/95">
                  <span className="text-lime-300/80">{s.baslik}: </span>
                  {s.biz}
                </span>
              </li>
            ))}
          </ul>
          <a
            href="/basla/"
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3.5 text-[15px] font-black text-brand-900"
          >
            Hemen başla
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <details className="rounded-3xl border border-line bg-white p-5">
          <summary className="cursor-pointer text-sm font-black text-ink-900">
            Diğer iki yolu karşılaştır
          </summary>
          <div className="mt-4 space-y-4">
            {satirlar.map((s) => (
              <div key={s.baslik} className="border-t border-line pt-3 first:border-0 first:pt-0">
                <p className="mb-1.5 text-[13px] font-black text-ink-900">{s.baslik}</p>
                <p className="text-sm text-ink-500">
                  <span className="font-semibold">Danışmanlık:</span> {s.danismanlik}
                </p>
                <p className="text-sm text-ink-500">
                  <span className="font-semibold">Abonelik:</span> {s.abonelik}
                </p>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
