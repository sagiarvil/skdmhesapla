import { DisclaimerBanner } from "@/components/legal/SiteChrome";

export const metadata = { title: "KVKK Aydınlatma Metni" };

export default function Page() {
  return (
    <article className="pasaport-zemin-yogun mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl font-bold">KVKK Aydınlatma Metni</h1>
      <DisclaimerBanner />
      <p className="text-sm leading-relaxed text-slate-700">
        Veri sorumlusu: Barış Bağırlar (VKN 25403091318), Levent Mah. Cömert Sok. No:1 Beşiktaş /
        İstanbul. İşlenen veriler: iletişim, hesaplama girdileri, sipariş kayıtları. Amaç: paket
        teslimatı ve destek. Saklama: europe-west3 (Google Firebase). Haklarınız (KVKK m.11):
        destek@skdmhesapla.com
      </p>
    </article>
  );
}
