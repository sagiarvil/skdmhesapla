import { ArrowRight, ExternalLink } from "lucide-react";
import { latestRegulatoryUpdates } from "@/lib/skdm/regulatory-updates";

const priorityClass: Record<string, string> = {
  P0: "border-red-200 bg-red-50 text-red-800",
  P1: "border-amber-200 bg-amber-50 text-amber-900",
  P2: "border-slate-200 bg-slate-50 text-slate-700",
};

const dtf = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Istanbul",
});

export function RegulatoryUpdatesSection() {
  const updates = latestRegulatoryUpdates(3);

  return (
    <section className="border-b border-line bg-[#f8fbf9] py-12 sm:py-16" aria-labelledby="regulatory-updates-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-800">Canlı mevzuat izleme</span>
            <h2 id="regulatory-updates-title" className="text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
              SKDM mevzuatında ne değişti?
            </h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700 sm:text-base">
              Avrupa Komisyonu ve EUR-Lex kaynaklarındaki değişiklikleri yalnız haber olarak değil;
              hesaplama, dosya, Registry ve doğrulama etkisiyle birlikte yayınlıyoruz.
            </p>
          </div>
          <a href="/mevzuat-guncellemeleri/" className="inline-flex items-center gap-2 font-black text-brand-900 hover:text-brand-700">
            Tüm güncellemeleri incele <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {updates.map((item) => (
            <article key={item.slug} className="flex h-full flex-col rounded-2xl border-2 border-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${priorityClass[item.priority]}`}>
                  {item.priority} {item.priority === "P0" ? "Kritik" : "Operasyonel"}
                </span>
                <time dateTime={item.detectedAt} className="text-xs font-bold text-ink-500">
                  Tespit: {dtf.format(new Date(item.detectedAt))}
                </time>
              </div>
              <h3 className="mt-4 text-lg font-black leading-snug text-ink-900">{item.shortTitle}</h3>
              <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-ink-700">{item.summary}</p>
              <div className="mt-5 border-t border-line pt-4">
                <a href={`/mevzuat-guncellemeleri/#${item.slug}`} className="inline-flex items-center gap-2 text-sm font-black text-brand-900">
                  Dosyanıza etkisini görün <ArrowRight className="h-4 w-4" />
                </a>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1.5 text-xs font-bold text-ink-500 hover:text-ink-800">
                  Resmî kaynak <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
