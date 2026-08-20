/**
 * Site kimliği — tek gerçek kaynak (CURSOR İş Emri Faz 1.1).
 * Yasal unvan, iletişim, barındırma ve kamuya açık ticari politika
 * sayfalarda elle yazılmaz.
 */
import { PADDLE_SEAL_PRICE_TRY } from "./config";
import { SEALED_PACKAGE_FILE_COUNT } from "./package-manifest";

export const SITE = {
  /** Barış netleştirmesi — tek yasal unvan (Türkiye kayıtlı şahıs işletmesi) */
  legalName: "CimetricaOne",
  brandName: "SKDMHesapla",
  /** Şahıs işletmesi vergi kimlik no'su — 11 haneli TCKN (VKN değil; tüzel VKN 10 hanedir). */
  vkn: "25403091318",
  vknLabel: "T.C. Kimlik No",
  email: "info@cimetricaone.com",
  supportEmail: "destek@skdmhesapla.com",
  /** İşletmeci merkezi (GATE-F/RM-006): hukuki kayıt yeri — sunucu konumuyla karıştırılmaz. */
  operatorLocation: "Türkiye",
  /** Kamuya açık işletmeci adresi — footer/yasal sayfalar bu değeri kullanır. */
  address: "Levent Mah. Cömert Sok. No:1, Beşiktaş/İstanbul",
  addressNote: "İşletmeci adresi ile sunucu konumu farklı kavramlardır.",
  /** firebase.json: hosting + functions europe-west3 (Frankfurt, AB) */
  hosting:
    "Google Cloud Firebase Hosting ve Cloud Functions (europe-west3, Frankfurt, AB); Firestore ve Storage aynı bölgede. Alan adı CDN: Cloudflare.",
  /** GATE-F: yalnızca sunucu konumu — işletmeci merkezi (operatorLocation) ayrı beyan edilir. */
  hostingShort: "Frankfurt (Almanya / AB)",
  packageFileCount: SEALED_PACKAGE_FILE_COUNT,
  sealPriceTry: PADDLE_SEAL_PRICE_TRY,
  sealPriceLabel: `${PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR")} ₺`,
  vatIncluded: true,
  /** Kamuya açık politika — tüm sayfalar bu metni kullanır. Ayrı reseal ürünü yok. */
  resealSameFileIsFree: true,
  resealPublicCopy:
    "Aynı dosyada düzeltme ve yeniden mühürleme ücretsizdir. Yeni tesis veya yeni dönem için yeni dosya ve yeni ödeme gerekir.",
} as const;
