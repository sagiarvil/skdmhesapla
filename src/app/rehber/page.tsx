import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Compass, ArrowRight } from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";
import { REHBER_SECTIONS } from "@/lib/skdm/content/rehber";
import IcerikArama from "@/components/IcerikArama";

export const metadata: Metadata = {
  title: "SKDM Rehberi 2026 — Karar Ağacı, Uygulama ve Kapsam Kılavuzu",
  description:
    "SKDM nedir, kimler kapsamda, 10 katmanlı resmi şablon yapısı, Kademe A (zorunlu) ve Kademe B (tedarikçi veri çerçevesi) uygulama adımları.",
};

/** Markdown linklerini [Metin](URL) ve **kalın** etiketlerini render eder. */
function RichText({ text }: { text: string }) {
  // Regex ile hem [link](url) hem **kalın** formatlarını böl
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
  const parts = text.split(tokenRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
          const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (match) {
            const [, label, href] = match;
            return (
              <Link
                key={i}
                href={href}
                className="font-bold text-brand-800 underline underline-offset-2 hover:text-brand-900 transition-colors"
              >
                {label}
              </Link>
            );
          }
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-extrabold text-ink-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function RehberPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7f2e8] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-3 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Mevzuat Uygulama &amp; Karar Kılavuzu
          </span>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">SKDM Rehberi 2026</h1>
          <p className="text-base font-semibold leading-relaxed text-ink-700 sm:text-xl">
            Bu rehber &ldquo;Ne yapmalıyım?&rdquo; sorusuna senaryo bazlı cevap verir. Terimlerin sabit tanımları için doğrudan{" "}
            <Link href="/sozluk/" className="font-bold text-brand-800 underline">
              SKDM Sözlüğü
            </Link>
            &apos;ne bağlanır.
          </p>
        </div>

        <IcerikArama hedefId="rehber-govde" />

        <div id="rehber-govde" className="space-y-6">
          {REHBER_SECTIONS.map((sec, index) => (
            <section
              key={sec.title}
              id={sec.id}
              data-ara={`${sec.title} ${sec.body.join(" ")} ${sec.list?.join(" ") ?? ""}`}
              className={
                sec.id === "baslangic-rotasi"
                  ? "scroll-mt-24 space-y-4 rounded-3xl border-2 border-brand-500 bg-white p-7 shadow-xl"
                  : sec.id === "kademe-b"
                  ? "scroll-mt-24 space-y-4 rounded-3xl border-2 border-line border-t-8 border-t-brand-800 bg-white p-7 shadow-md hover:shadow-lg transition-all"
                  : "scroll-mt-24 space-y-4 rounded-3xl border-2 border-line bg-white p-7 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
              }
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-ink-900">{sec.title}</h2>
                {sec.id === "baslangic-rotasi" && (
                  <span className="rounded-full bg-brand-500/25 px-3 py-1 text-xs font-black text-brand-950">
                    Öncelikli Rota
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {sec.body.map((p, pIdx) => (
                  <p key={pIdx} className="text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
                    <RichText text={p} />
                  </p>
                ))}
              </div>

              {sec.list && (
                <div className="mt-4 rounded-2xl border border-line bg-[#f8fbf9] p-5">
                  <ul className="list-disc space-y-2 pl-5 text-base sm:text-lg text-ink-700 font-medium">
                    {sec.list.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        <RichText text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* ALT CTA */}
        <div className="rounded-3xl border-2 border-brand-500/40 bg-brand-950 p-8 text-center text-white shadow-2xl space-y-4">
          <h2 className="text-2xl font-black">Dosyanızı Başlatmaya Hazır mısınız?</h2>
          <p className="text-brand-mist text-base max-w-xl mx-auto">
            Sektörünüzü seçin veya GTİP arayarak 10 katmanlı sihirbazı hemen ücretsiz başlatın.
          </p>
          <div>
            <Link
              href="/basla/"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-brand-500 px-8 text-lg font-black text-brand-950 hover:bg-brand-400 transition"
            >
              <span>Hesaplamayı Başlat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
