import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
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
          <strong key={i} className="font-extrabold text-ink-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function RehberPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10 px-5 sm:px-6">
        <GeriLink />
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <BookOpen className="h-4 w-4" />
            <span>Mevzuat ve Uygulama Kılavuzu</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">SKDM Rehberi 2026</h1>
          <p className="text-base font-semibold leading-relaxed text-ink-700 sm:text-xl">
            Bilgilendirme amaçlıdır; resmi beyan veya akredite doğrulama değildir. Tüm terim açıklamaları için:{" "}
            <Link href="/sozluk/" className="font-bold text-brand-800 underline">
              SKDM Sözlüğü
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
                  ? "scroll-mt-24 space-y-3 rounded-2xl border-2 border-line border-t-4 border-t-brand-800 bg-white p-6 shadow-md hover:shadow-lg transition-all sm:p-8"
                  : "scroll-mt-24 space-y-3 rounded-2xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all sm:p-8"
              }
            >
              <h2 className="text-2xl font-black text-ink-900">{sec.title}</h2>
              {sec.body.map((p) => (
                <p key={p.slice(0, 48)} className="text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
                  <RichText text={p} />
                </p>
              ))}
              {sec.list && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base sm:text-lg text-ink-700 font-medium">
                  {sec.list.map((item) => (
                    <li key={item.slice(0, 40)} className="leading-relaxed">
                      <RichText text={item} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
