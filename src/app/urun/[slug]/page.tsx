import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GeriLink } from "@/components/nav/GeriLink";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { pageMetadata } from "@/lib/skdm/seo";
import { getRegistryEntry } from "@/lib/seo/registry";
import { getProductDecision, PRODUCT_DECISIONS } from "@/lib/seo/product-decisions";

export function generateStaticParams() {
  return PRODUCT_DECISIONS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rec = getRegistryEntry(`/urun/${slug}/`);
  if (!rec) return {};
  return pageMetadata({ path: rec.route, title: rec.title, description: rec.metaDescription });
}

export default async function UrunKararPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rec = getRegistryEntry(`/urun/${slug}/`);
  const data = getProductDecision(slug);
  if (!rec || !data) notFound();

  return (
    <>
      <RegistryJsonLd route={rec.route} />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink href="/" />
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-800">
              Ürün kararı · hukuki hüküm değil
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {rec.h1}
            </h1>
            <p className="text-base font-medium leading-relaxed text-ink-700">
              {data.ctaNote} Sistem akredite doğrulama görüşü veya gümrük onayı vermez.
            </p>
          </header>

          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6">
            <h2 className="text-lg font-black text-ink-900">Kararı değiştiren nitelikler</h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm font-medium text-ink-700">
              {data.attributes.map((a) => (
                <li key={a.title}>
                  <strong className="text-ink-900">{a.title}.</strong> {a.body}
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6">
            <h2 className="text-lg font-black text-ink-900">CN / GTİP veri ihtiyacı</h2>
            <p className="text-sm font-medium text-ink-700">{data.cnNeed}</p>
          </section>

          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6">
            <h2 className="text-lg font-black text-ink-900">Kapsam sınırı</h2>
            <p className="text-sm font-medium text-ink-700">{data.boundary}</p>
            <p className="text-sm font-medium text-ink-600">{rec.limitations}</p>
          </section>

          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/basla/" className="text-brand-800 underline underline-offset-2">
              Kapsam kontrolüne git
            </Link>
            <Link href="/rehber/" className="text-brand-800 underline underline-offset-2">
              Rehber
            </Link>
            <Link href="/sozluk/cbam/" className="text-brand-800 underline underline-offset-2">
              CBAM / SKDM terimi
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
