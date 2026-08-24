import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { latestRegulatoryUpdates, regulatoryUpdatePath } from "@/lib/skdm/regulatory-updates";

const dateTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

const detectedTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Istanbul",
});

export function RegulatoryUpdatesHome() {
  const updates = latestRegulatoryUpdates(3);

  return (
    <section className="border-b border-line bg-[#f8faf7] py-14 sm:py-20" aria-labelledby="regulatory-home-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.5fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-brand-900 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Mevzuat radarında yeni
            </div>
            <h2 id="regulatory-home-title" className="mt-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
              SKDM değiştiğinde sadece haberi değil, dosyanıza etkisini görün.
            </h2>
            <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-ink-700">
              Resmî Komisyon yayınlarını; bağlayıcılık düzeyi, yayın tarihi ve Türk ihracatçı açısından yapılması gereken kontrol ile birlikte sınıflandırıyoruz.
            </p>

            <div className="mt-6 rounded-2xl border border-line bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-800" />
                <p className="text-sm font-semibold leading-relaxed text-ink-700">
                  İzleme saati ile resmî yayın tarihi ayrı tutulur. Rehber, operasyon kılavuzu ve bağlayıcı mevzuat aynı hukuki ağırlıkta sunulmaz.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/mevzuat-guncellemeleri/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-900 px-5 text-sm font-black text-white transition hover:bg-brand-800">
                Tüm güncellemeleri incele <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/basla/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand-800/20 bg-white px-5 text-sm font-black text-ink-900 transition hover:border-brand-800/40">
                Dosyanızın etkisini kontrol edin
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {updates.map((item) => (
              <article key={item.slug} className="rounded-3xl border-2 border-line bg-white p-5 shadow-sm transition hover:border-brand-800/25 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-wide">
                  <span className={item.priority === "P0" ? "rounded-full bg-red-50 px-2.5 py-1 text-red-800" : "rounded-full bg-amber-50 px-2.5 py-1 text-amber-900"}>
                    {item.priority === "P0" ? "Yüksek etki" : "Operasyonel etki"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{item.sourceTypeLabel}</span>
                  <span className="ml-auto text-ink-500 normal-case tracking-normal">Tespit: {detectedTr.format(new Date(item.detectedAt))}</span>
                </div>

                <h3 className="mt-4 text-lg font-black leading-snug text-ink-900 sm:text-xl">{item.shortTitle}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">{item.exporterImpact}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm font-black">
                  <a href={regulatoryUpdatePath(item.slug)} className="inline-flex items-center gap-1.5 text-brand-900 hover:text-brand-700">
                    Etki analizini aç <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink-600 hover:text-ink-900">
                    Resmî kaynak <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <span className="ml-auto text-xs font-bold text-ink-500">Resmî yayın: {dateTr.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
