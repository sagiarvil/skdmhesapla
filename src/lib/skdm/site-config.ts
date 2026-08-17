/**
 * Site kimliği — tek gerçek kaynak (CURSOR İş Emri Faz 1.1).
 * Yasal unvan, iletişim, barındırma: sayfalarda elle yazılmaz.
 */
import { PADDLE_SEAL_PRICE_TRY } from "./config";
import { SEALED_PACKAGE_FILE_COUNT } from "./package-manifest";

export const SITE = {
  /** Barış netleştirmesi — tek yasal unvan */
  legalName: "CimetricaOne",
  brandName: "SKDMHesapla",
  vkn: "25403091318",
  email: "info@cimetricaone.com",
  /** Kamuya açık adres: şahıs işletmesi — tam sokak adresi e-fatura kaydından teyit edilir */
  address: "Türkiye",
  addressNote:
    "Tam açık adres e-fatura ve resmi yazışmalarda kullanılır; web sitesinde VKN ile teyit edilir.",
  /** firebase.json: hosting + functions europe-west3 (Frankfurt, AB) */
  hosting:
    "Google Cloud Firebase Hosting ve Cloud Functions (europe-west3, Frankfurt, AB); Firestore ve Storage aynı bölgede. Alan adı CDN: Cloudflare.",
  hostingShort: "Frankfurt (Almanya / AB)",
  packageFileCount: SEALED_PACKAGE_FILE_COUNT,
  sealPriceTry: PADDLE_SEAL_PRICE_TRY,
  /** Kamuya açık politika — tüm sayfalar bu metni kullanır. Ayrı reseal ürünü yok. */
  resealSameFileIsFree: true,
  resealPublicCopy: "Aynı dosyada düzeltme ve yeniden mühürleme ücretsizdir.",
} as const;
