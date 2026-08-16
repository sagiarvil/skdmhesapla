import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { REHBER_SECTIONS } from "@/lib/skdm/content/rehber";
import IcerikArama from "@/components/IcerikArama";

export const metadata: Metadata = {
  title: "SKDM Rehberi — 2026 Uygulama ve Kapsam Kılavuzu",
  description: "SKDM nedir, kimler kapsamda, 10 katman, Kademe B/C tedarikçi veri çerçevesi.",
};

/** docs/sayfa-icerik-rehber.md içindeki **kalın** işaretlerini render et. */
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

export default function RehberPage() {
  return (
    <article className="pasaport-zemin-yogun mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <GeriLink />
      <div>
        <h1 className="font-display text-3xl font-bold text-ink-900">SKDM Rehberi</h1>
        <p className="mt-2 text-sm text-ink-600">
          Bilgilendirme amaçlıdır; resmi beyan veya akredite doğrulama değildir. Terimler:{" "}
          <Link href="/sozluk/" className="font-semibold text-brand-800 underline">
            Sözlük
          </Link>
          .
        </p>
      </div>

      <IcerikArama hedefId="rehber-govde" />

      <div id="rehber-govde" className="space-y-6">
        {REHBER_SECTIONS.map((sec) => (
          <section
            key={sec.title}
            id={sec.id}
            data-ara={`${sec.title} ${sec.body.join(" ")} ${sec.list?.join(" ") ?? ""}`}
            className={
              sec.id === "kademe-b"
                ? "scroll-mt-24 space-y-2 rounded-card border border-line border-t-[3px] border-t-brand-800 bg-white p-5 shadow-card"
                : "scroll-mt-24 space-y-2 rounded-card border border-line bg-white/70 p-5"
            }
          >
            <h2 className="text-xl font-bold text-ink-900">{sec.title}</h2>
            {sec.body.map((p) => (
              <p key={p.slice(0, 48)} className="text-sm leading-relaxed text-ink-900">
                <RichText text={p} />
              </p>
            ))}
            {sec.list && (
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-900">
                {sec.list.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div>
        <Link
          href="/basla/"
          className="inline-flex min-h-ctl items-center rounded-ctl bg-brand-500 px-5 text-sm font-semibold text-brand-900 hover:bg-brand-400"
        >
          Hesaplamaya Başla
        </Link>
      </div>
    </article>
  );
}
