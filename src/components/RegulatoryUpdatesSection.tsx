import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { latestRegulatoryUpdates, regulatoryUpdatePath } from "@/lib/skdm/regulatory-updates";

const dtf = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

const statusLabel = {
  IMPLEMENTED: "İşlendi",
  ACTION_REQUIRED: "Aksiyon gerekli",
  MONITORING: "İzlemede",
} as const;

export function RegulatoryUpdatesSection() {
  const updates = latestRegulatoryUpdates(4);

  return (
    <section className="border-b border-line bg-[#f8fbf9] py-8 sm:py-10" aria-labelledby="regulatory-updates-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="rounded-3xl border border-brand-800/15 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-900">Mevzuat radarı</span>
              </div>
              <h2 id="regulatory-updates-title" className="mt-2 text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Resmî değişiklikleri dosyanıza etkisiyle birlikte izliyoruz.
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">
                Avrupa Komisyonu ve EUR-Lex güncellemelerini haber olarak değil; hesaplama, veri, şablon ve doğrulama hazırlığı etkisiyle sınıflandırıyoruz.
              </p>
            </div>
            <a href="/mevzuat-guncellemeleri/" className="group inline-flex shrink-0 items-center gap-2 text-sm font-black text-brand-900 hover:text-brand-700">
              Tüm güncellemeleri incele <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {updates.map((item, index) => {
              const isLatest = index === 0;
              const implemented = item.productStatus === "IMPLEMENTED";
              return (
                <article
                  key={item.slug}
                  className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${isLatest ? "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-emerald-50 shadow-[0_10px_30px_rgba(146,64,14,0.10)] motion-safe:animate-[pulse_4s_ease-in-out_infinite]" : "border-line bg-[#fbfdfb]"}`}
                >
                  {isLatest && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-emerald-500" />}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-900">{item.priority}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${implemented ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
                        {statusLabel[item.productStatus]}
                      </span>
                      {isLatest && <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900"><Sparkles className="h-3 w-3" /> Son güncelleme</span>}
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-ink-500">{dtf.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-black leading-snug text-ink-900">{item.shortTitle}</h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <a href={regulatoryUpdatePath(item.slug)} className="text-xs font-black text-brand-900 hover:text-brand-700">Etkisini gör</a>
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label="Resmî kaynağı aç" className="text-ink-500 hover:text-ink-900"><ExternalLink className="h-3.5 w-3.5" /></a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
