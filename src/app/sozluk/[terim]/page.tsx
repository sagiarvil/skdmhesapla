import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GeriLink } from "@/components/nav/GeriLink";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { pageMetadata } from "@/lib/skdm/seo";
import { getRegistryEntry, indexableEntries } from "@/lib/seo/registry";
import { SOZLUK_TERIMLERI_FINAL } from "@/lib/skdm/content/sozluk";

function leafIds() {
  return indexableEntries()
    .map((e) => e.route)
    .filter((r) => r.startsWith("/sozluk/") && r !== "/sozluk/")
    .map((r) => r.replace("/sozluk/", "").replace(/\/$/, ""));
}

export function generateStaticParams() {
  return leafIds().map((terim) => ({ terim }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ terim: string }>;
}): Promise<Metadata> {
  const { terim } = await params;
  const rec = getRegistryEntry(`/sozluk/${terim}/`);
  if (!rec) return {};
  return pageMetadata({ path: rec.route, title: rec.title, description: rec.metaDescription });
}

export default async function SozlukLeafPage({ params }: { params: Promise<{ terim: string }> }) {
  const { terim } = await params;
  const rec = getRegistryEntry(`/sozluk/${terim}/`);
  const row = SOZLUK_TERIMLERI_FINAL.find((t) => t.id === terim);
  if (!rec || !row) notFound();

  return (
    <>
      <RegistryJsonLd route={rec.route} />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#dcebf2] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink href="/sozluk/" />
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-800">SKDM sözlük</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{rec.h1}</h1>
            {row.en ? <p className="text-sm font-semibold text-ink-600">{row.en}</p> : null}
          </header>
          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6">
            <h2 className="text-lg font-black text-ink-900">Tanım</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">{row.tanim}</p>
          </section>
          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6">
            <h2 className="text-lg font-black text-ink-900">Nerede kullanılır</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">{row.nerede}</p>
          </section>
          <p className="text-sm font-medium text-ink-600">{rec.limitations}</p>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/sozluk/" className="text-brand-800 underline underline-offset-2">
              Sözlük dizinine dön
            </Link>
            <Link href="/rehber/" className="text-brand-800 underline underline-offset-2">
              Rehber
            </Link>
            <Link href="/mevzuat/" className="text-brand-800 underline underline-offset-2">
              Mevzuat
            </Link>
            <Link href="/basla/" className="text-brand-800 underline underline-offset-2">
              Kapsam kontrolü
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
