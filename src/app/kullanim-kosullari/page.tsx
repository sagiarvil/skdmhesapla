import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";

export const metadata = { title: "Kullanım Koşulları" };

export default function Page() {
  const fiyat = PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR");
  return (
    <article className="pasaport-zemin-yogun mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Kullanım Koşulları</h1>
      <DisclaimerBanner />
      <p className="text-sm leading-relaxed text-slate-700">
        SKDMHesapla, self-servis B2B dijital yazılımdır. Hukuki tavsiye veya gümrük yönlendirmesi
        verilmez. Mühürlü paket bilgilendirme amaçlıdır; resmi SKDM beyanı yalnızca yetkilendirilmiş
        beyan sahibi tarafından yapılır. Mühür öncesi tüm aşamalar ücretsizdir. Mühürlü paket ücreti{" "}
        <strong className="font-mono">{fiyat} ₺</strong> (KDV dahil, tek seferlik).
      </p>
    </article>
  );
}
