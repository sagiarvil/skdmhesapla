import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, Ship } from "lucide-react";

export interface MaritimeRegulationPageProps {
  eyebrow: string;
  title: string;
  description: string;
  whatItDoes: readonly string[];
  whatItNeeds: readonly string[];
  output: readonly string[];
  sourceHref: string;
  sourceLabel: string;
}

export function MaritimeRegulationPage({
  eyebrow,
  title,
  description,
  whatItDoes,
  whatItNeeds,
  output,
  sourceHref,
  sourceLabel,
}: MaritimeRegulationPageProps) {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <section className="border-b border-line bg-gradient-to-b from-[#eef7f0] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-brand-900"><Ship className="h-3.5 w-3.5" /> {eyebrow}</span>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-ink-700 sm:text-lg">{description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/denizcilik/kapsam-kontrolu/" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-black text-white hover:bg-brand-700">Kapsam kontrolünü çalıştır <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/denizcilik/" className="inline-flex min-h-12 items-center rounded-xl border border-line bg-white px-5 text-sm font-black text-brand-900 hover:bg-brand-50">Denizcilik ana sayfası</Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-5 px-5 sm:px-6 lg:grid-cols-3">
          {[
            ["Ne yapar?", whatItDoes],
            ["Hangi veri gerekir?", whatItNeeds],
            ["Çıktı ne olur?", output],
          ].map(([heading, items]) => (
            <article key={heading as string} className="rounded-3xl border border-line bg-[#fbfdfb] p-6">
              <h2 className="text-xl font-black">{heading as string}</h2>
              <ul className="mt-4 space-y-3">
                {(items as readonly string[]).map((item) => (
                  <li key={item} className="flex gap-2 text-sm font-medium leading-6 text-ink-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /> {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-[#071812] py-12 text-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <h2 className="text-2xl font-black">Ürün sınırı</h2>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-300">SKDMHesapla; kapsam ön değerlendirmesi, veri hazırlığı, hesap izi, maliyet analizi ve kanıt organizasyonu sağlar. Akredite doğrulayıcı görüşü, hukuki görüş veya yetkili makam kararı üretmez.</p>
          <a href={sourceHref} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-300">{sourceLabel} <ExternalLink className="h-4 w-4" /></a>
        </div>
      </section>
    </main>
  );
}
