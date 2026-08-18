/**
 * Site kimliği — tek gerçek kaynak (CURSOR İş Emri Faz 1.1).
 * Yasal unvan, iletişim, barındırma: sayfalarda elle yazılmaz.
 */
import { PADDLE_SEAL_PRICE_TRY } from "./config";
import { SEALED_PACKAGE_FILE_COUNT } from "./package-manifest";

export const SITE = {
  /** Barış netleştirmesi — tek yasal unvan (Türkiye kayıtlı şahıs işletmesi) */
  legalName: "CimetricaOne",
  brandName: "SKDMHesapla",
  /** Şahıs işletmesi vergi kimlik no'su — 11 haneli TCKN (VKN değil; tüzel VKN 10 hanedir). */
  vkn: "25403091318",
  email: "info@cimetricaone.com",
  /** İşletmeci merkezi (GATE-F/RM-006): hukuki kayıt yeri — sunucu konumuyla karıştırılmaz. */
  operatorLocation: "Türkiye",
  /** Kamuya açık adres: şahıs işletmesi — tam sokak adresi e-fatura kaydından teyit edilir */
  address: "Türkiye",
  addressNote:
    "Tam açık adres e-fatura ve resmi yazışmalarda kullanılır; web sitesinde vergi kimlik no ile teyit edilir.",
  /** firebase.json: hosting + functions europe-west3 (Frankfurt, AB) */
  hosting:
    "Google Cloud Firebase Hosting ve Cloud Functions (europe-west3, Frankfurt, AB); Firestore ve Storage aynı bölgede. Alan adı CDN: Cloudflare.",
  /** GATE-F: yalnızca sunucu konumu — işletmeci merkezi (operatorLocation) ayrı beyan edilir. */
  hostingShort: "Frankfurt (Almanya / AB)",
  packageFileCount: SEALED_PACKAGE_FILE_COUNT,
  sealPriceTry: PADDLE_SEAL_PRICE_TRY,
  /** Kamuya açık politika — tüm sayfalar bu metni kullanır. Ayrı reseal ürünü yok. */
  resealSameFileIsFree: true,
  resealPublicCopy: "Aynı dosyada düzeltme ve yeniden mühürleme ücretsizdir.",
} as const;
