import Link from "next/link";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";

export const metadata = { title: "Fiyatlandırma" };

/** Ek F: arayüzde tek fiyat — 9.900 ₺. */
export default function Page() {
  const fiyat = PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR");
  return (
    <article className="pasaport-zemin-yogun bg-soft-section">
      <div className="mx-auto max-w-container space-y-10 px-5 py-14 sm:px-6 sm:py-24">
        <h1 className="text-[30px] font-bold leading-[38px] text-ink-900 sm:text-[44px] sm:leading-[56px]">
          Fiyatlandırma
        </h1>
        <DisclaimerBanner />
        <p className="text-ink-600">
          Mühür öncesi her şey ücretsizdir; kart bilgisi istenmez. Ödeme yalnızca kilitleme anında
          alınır. Fiyat KDV dahildir.
        </p>
        <div className="max-w-md rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-ink-900">Mühürlü Paket</h2>
          <p className="mt-3 text-5xl font-bold tabular-nums text-ink-900">{fiyat} ₺</p>
          <p className="mt-1 text-sm text-ink-600">KDV dahil · tek seferlik · tek mühürlü rapor</p>
        </div>
        <Link
          href="/hesapla/demir-celik/"
          className="inline-flex min-h-ctl items-center rounded-ctl bg-brand-500 px-6 text-base font-semibold text-brand-900 hover:bg-brand-100"
        >
          Hesapla ve Mühürle
        </Link>
      </div>
    </article>
  );
}
