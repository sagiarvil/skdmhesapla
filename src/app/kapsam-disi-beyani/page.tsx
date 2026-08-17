import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { CAM_BALKON_AKIS } from "@/lib/skdm/siniflandirma";

export const metadata: Metadata = pageMetadata({
  path: "/kapsam-disi-beyani/",
  title: "Kapsam dışı beyan notu",
  description:
    "SKDM kapsamı dışında görünen ürün için alıcıya iletilecek kısa not. Gümrük kararı değildir.",
});

export default function KapsamDisiBeyaniPage() {
  return (
    <>
      <RegistryJsonLd route="/kapsam-disi-beyani/" />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink />
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-800">Kademe B</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Kapsam dışı beyan notu
            </h1>
            <p className="text-base font-medium leading-relaxed text-ink-700">
              Bu metin gümrük kararı değildir. Alıcınız yine de karbon verisi istiyorsa tedarikçi
              dosyasına geçebilirsiniz.
            </p>
          </header>
          <pre className="whitespace-pre-wrap rounded-3xl border-2 border-line bg-white p-6 text-sm font-medium leading-relaxed text-ink-800">
            {CAM_BALKON_AKIS.kapsamDisiBeyanMetni}
          </pre>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/karbon-raporu/" className="text-brand-800 underline underline-offset-2">
              Karbon raporunu hazırla
            </Link>
            <Link href="/basla/" className="text-brand-800 underline underline-offset-2">
              GTİP ile yeniden kontrol
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
