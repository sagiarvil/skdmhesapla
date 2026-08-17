import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GeriLink } from "@/components/nav/GeriLink";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { LegalFact } from "@/components/seo/LegalFact";
import { pageMetadata } from "@/lib/skdm/seo";
import { SKDM_SECTORS, ANNEX_II_SADECE_DIREKT } from "@/lib/skdm/config";
import { getRegistryEntry } from "@/lib/seo/registry";

const SLUG_TO_ID: Record<string, string> = {
  "demir-celik": "iron-steel",
  aluminyum: "aluminum",
  cimento: "cement",
  gubre: "fertilizer",
  elektrik: "electricity",
  hidrojen: "hydrogen",
};

export function generateStaticParams() {
  return Object.keys(SLUG_TO_ID).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rec = getRegistryEntry(`/sektor/${slug}/`);
  if (!rec) return {};
  return pageMetadata({
    path: rec.route,
    title: rec.title,
    description: rec.metaDescription,
  });
}

export default async function SektorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = SLUG_TO_ID[slug];
  const sector = id ? SKDM_SECTORS[id] : undefined;
  const rec = getRegistryEntry(`/sektor/${slug}/`);
  if (!sector || !rec || sector.tier !== "A") notFound();
  const annex2 = ANNEX_II_SADECE_DIREKT.has(sector.id);
  const route = rec.route;

  return (
    <>
      <RegistryJsonLd route={route} />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink href="/" />
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-800">
              Kademe A sektör ailesi · CN/GTİP kararı
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {rec.h1}
            </h1>
            <p className="text-base font-medium leading-relaxed text-ink-700">
              Sektör adı hukuki kapsam kararı değildir. Kararın ana girdisi doğrulanmış CN/GTİP
              sınıflandırmasıdır. SKDM Kademe A evreni <LegalFact id="sectorFamilyCount" /> sektör
              ailesi ve <LegalFact id="cnUniverseCount" /> CN kodudur.
            </p>
          </header>

          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6">
            <h2 className="text-lg font-black text-ink-900">Bu ailede ne değişir?</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm font-medium text-ink-700">
              <li>Sektör ailesi: {sector.name}</li>
              <li>Aday CN aralığı (örnek, tam evren değil): {sector.cnCodes.join(", ")}</li>
              <li>
                Annex II yalnız doğrudan emisyon: {annex2 ? "evet" : "hayır — dolaylı emisyon faturaya girebilir"}
              </li>
              <li>Bir CN kodu = bir üretim süreci; ikiye bölünemez.</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6">
            <h2 className="text-lg font-black text-ink-900">Kararı değiştiren girdiler</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm font-medium text-ink-700">
              <li>Fatura ve gümrük beyannamesindeki CN/GTİP</li>
              <li>Üretim süreci (tek süreç kuralı)</li>
              <li>Annex II doğrudan/dolaylı sınır</li>
              <li>
                De minimis: alıcının yıllık ithalatı <LegalFact id="deMinimisTons" /> ton eşiği
                (elektrik ve hidrojen hariç)
              </li>
            </ol>
          </section>

          <p className="text-sm font-medium text-ink-600">{rec.limitations}</p>

          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/basla/" className="text-brand-800 underline underline-offset-2">
              GTİP / CN ile kapsam kontrolü
            </Link>
            <Link href="/rehber/" className="text-brand-800 underline underline-offset-2">
              SKDM rehberi
            </Link>
            <Link href="/metodoloji/" className="text-brand-800 underline underline-offset-2">
              Metodoloji
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
