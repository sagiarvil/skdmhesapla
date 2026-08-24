import { ArrowRight, ExternalLink } from "lucide-react";
import { latestRegulatoryUpdates } from "@/lib/skdm/regulatory-updates";

const dtf = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

export function RegulatoryUpdatesSection() {
  const updates = latestRegulatoryUpdates(3);

  return (
    <section className="border-b border-line bg-[#f8fbf9] py-8 sm:py-10" aria-labelledby="regulatory-updates-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
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

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {updates.map((item) => (
              <article key={item.slug} className="rounded-2xl border border-line bg-[#fbfdfb] p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-900">
                    {item.priority}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-ink-500">{dtf.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}</span>
                </div>
                <h3 className="mt-2 text-sm font-black leading-snug text-ink-900">{item.shortTitle}</h3>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <a href={`/mevzuat-guncellemeleri/#${item.slug}`} className="text-xs font-black text-brand-900 hover:text-brand-700">Etkisini gör</a>
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label="Resmî kaynağı aç" className="text-ink-500 hover:text-ink-900"><ExternalLink className="h-3.5 w-3.5" /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
