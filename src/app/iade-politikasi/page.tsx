import { DisclaimerBanner } from "@/components/legal/SiteChrome";

export const metadata = { title: "İade Politikası" };

export default function Page() {
  return (
    <article className="pasaport-zemin-yogun mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl font-bold">İade Politikası</h1>
      <DisclaimerBanner />
      <p className="text-sm leading-relaxed text-slate-700">
        Paket mühürlenip indirildikten sonra iade yoktur (anında ifa edilen dijital içerik). Mühürleme
        öncesi tüm aşamalar ücretsizdir. Teknik sorun: 14 gün içinde destek@skdmhesapla.com.
      </p>
    </article>
  );
}
