import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";
import {
  NASIL_ALT_BANT,
  NASIL_STEPS,
  NASIL_UST_BANT,
} from "@/lib/skdm/content/nasil-calisir";

export const metadata = { title: "Nasıl Çalışır" };

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Plan 21: ürün akışı — triyaj + 10 katman, iç-ses haritalı (Ek F). */
export default function Page() {
  const fiyat = PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR");
  return (
    <article className="pasaport-zemin-yogun mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <GeriLink />
      <h1 className="font-display text-3xl font-bold text-ink-900">Nasıl Çalışır</h1>
      <DisclaimerBanner />

      <div className="rounded-card border border-brand-500/40 border-t-[3px] border-t-brand-500 bg-brand-100/80 px-4 py-3 shadow-card">
        <p className="text-sm font-semibold text-brand-900">
          <RichText text={NASIL_UST_BANT.badge} />
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-900">
          <RichText text={NASIL_UST_BANT.body.replace("9.900", fiyat)} />
        </p>
      </div>

      <div className="space-y-6">
        {NASIL_STEPS.map((s) => (
          <section key={s.id} className="scroll-mt-24 space-y-2 border-b border-line pb-6 last:border-0">
            <h2 className="text-lg font-bold text-ink-900">{s.title}</h2>
            {s.innerVoice && (
              <p className="text-sm italic text-ink-600">İç ses: {s.innerVoice}</p>
            )}
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-900">
              {s.bullets.map((b) => (
                <li key={b.slice(0, 40)}>
                  <RichText text={b} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="rounded-card border border-line bg-white p-4 shadow-card">
        <h2 className="text-base font-bold text-ink-900">Güven cümleleri</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-900">
          {NASIL_ALT_BANT.map((b) => (
            <li key={b.slice(0, 40)}>
              <RichText text={b} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
