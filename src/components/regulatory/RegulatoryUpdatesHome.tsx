import { ArrowRight, Radar, ShieldCheck } from "lucide-react";
import { latestRegulatoryUpdates } from "@/lib/skdm/regulatory-updates";

const dateTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

export function RegulatoryUpdatesHome() {
  const updates = latestRegulatoryUpdates(3);

  return (
    <section
      className="border-b border-line bg-[#f8faf7] py-10 sm:py-14"
      aria-labelledby="regulatory-home-title"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border-2 border-brand-800/15 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />

          <div className="relative grid gap-7 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-[#f7faf5] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-brand-900">
                <Radar className="h-3.5 w-3.5" />
                SKDM Mevzuat Radarı
              </div>

              <h2
                id="regulatory-home-title"
                className="mt-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl"
              >
                AB SKDM mevzuatını sürekli izliyoruz.
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-ink-700 sm:text-base">
                Uygulama tüzükleri, varsayılan değerler, benchmarklar, doğrulama ve akreditasyon kuralları,
                Komisyon rehberleri ile CBAM Registry/O3CI süreçlerindeki değişiklikleri takip ediyoruz.
                Ana sayfada yalnız en yeni 3 gelişme gösterilir.
              </p>

              <div className="mt-4 inline-flex items-start gap-2 text-xs font-semibold leading-relaxed text-ink-600 sm:text-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                <span>Yeni kayıt geldiğinde otomatik olarak en üste çıkar; dördüncü kayıt ana sayfadan düşer, arşivde kalır.</span>
              </div>

              <div className="mt-6">
                <a
                  href="https://skdmhesapla.com/mevzuat-guncellemeleri/"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-900 px-6 text-sm font-black text-white shadow-md transition hover:bg-brand-800 sm:text-base"
                >
                  Tüm mevzuat güncellemelerini incele
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-[#fbfcfb]">
              <div className="border-b border-line px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-ink-500">
                Son 3 gelişme
              </div>
              <ol className="divide-y divide-line">
                {updates.map((item, index) => (
                  <li key={item.slug}>
                    <a
                      href={`https://skdmhesapla.com/mevzuat-guncellemeleri/#${item.slug}`}
                      className="group flex items-start gap-3 px-4 py-4 transition hover:bg-white sm:px-5"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-900 text-xs font-black text-white">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <strong className="text-sm font-black leading-snug text-ink-900 group-hover:text-brand-900">
                            {item.shortTitle}
                          </strong>
                          <span className="text-[11px] font-bold text-ink-500">
                            {dateTr.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}
                          </span>
                        </span>
                        <span className="mt-1 block line-clamp-2 text-xs font-medium leading-relaxed text-ink-600 sm:text-sm">
                          {item.exporterImpact}
                        </span>
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-800 transition group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
