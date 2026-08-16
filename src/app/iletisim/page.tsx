import { DisclaimerBanner } from "@/components/legal/SiteChrome";

export const metadata = { title: "İletişim" };

export default function Page() {
  return (
    <article className="pasaport-zemin-yogun mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl font-bold">İletişim</h1>
      <DisclaimerBanner />
      <ul className="space-y-2 text-sm text-slate-700">
        <li>
          <strong>İşletmeci:</strong> Barış Bağırlar
        </li>
        <li>
          <strong>VKN:</strong> <span className="font-mono">25403091318</span>
        </li>
        <li>
          <strong>Adres:</strong> Levent Mah. Cömert Sok. No:1, Beşiktaş / İstanbul
        </li>
        <li>
          <strong>E-posta:</strong> destek@skdmhesapla.com
        </li>
        <li>
          <strong>Barındırma:</strong> Google Firebase (Hosting / Firestore / Functions)
        </li>
      </ul>
    </article>
  );
}
