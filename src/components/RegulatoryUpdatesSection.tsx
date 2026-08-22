import { ArrowRight, ExternalLink, Radio, ShieldAlert } from "lucide-react";
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
  timeZone: "Europe/Istanbul",
});

const detectedTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Istanbul",
});

export function RegulatoryUpdatesSection() {
  const updates = latestRegulatoryUpdates(3);

  return (
    <section className="border-b border-line bg-[#f8fbf9] py-14 sm:py-20" aria-labelledby="regulatory-updates-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-white px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-brand-900 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              CANLI MEVZUAT VE REHBER RADARI
            </div>
            <h2 id="regulatory-updates-title" className="text-2xl font-black tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
              SKDM mevzuatında ne değişti?
            </h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700 sm:text-base">
              Avrupa Komisyonu ve EUR-Lex yayınlarındaki değişiklikleri yalnız haber olarak değil;
              hesaplama, dosya şablonu, Registry ve doğrulama etkisiyle birlikte sınıflandırıyoruz.
            </p>
          </div>
          <a
            href="/mevzuat-guncellemeleri/"
            className="inline-flex items-center gap-2 text-sm font-black text-brand-900 hover:text-brand-700 transition shrink-0 group"
          >
            <span>Tüm güncellemeleri ve indeksi incele</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* 3 Kutulu Canlı Güncelleme Kartları */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {updates.map((item) => (
            <article
              key={item.slug}
              className="flex h-full flex-col justify-between rounded-3xl border-2 border-brand-800/15 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-500 hover:shadow-lg"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${priorityClass[item.priority]}`}>
                    {item.priority === "P0" ? "P0 · Yüksek Etki" : "P1 · Operasyonel"}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-ink-500">
                    Tespit: {detectedTr.format(new Date(item.detectedAt))}
                  </span>
                </div>

                <h3 className="text-lg font-black leading-snug text-ink-900">{item.shortTitle}</h3>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-ink-700">{item.summary}</p>
              </div>

              <div className="mt-6 border-t border-line pt-4 space-y-2">
                <a
                  href={`/mevzuat-guncellemeleri/#${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-brand-900 hover:text-brand-700 group/link"
                >
                  <span>Dosyanıza etkisini ve analizi görün</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-link:translate-x-0.5" />
                </a>
                <div className="flex items-center justify-between text-[11px] font-bold text-ink-500 pt-1">
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-ink-900 transition"
                  >
                    <span>Resmî kaynak</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span>Yayın: {dtf.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
