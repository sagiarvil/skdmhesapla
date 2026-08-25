import { SITE } from "@/lib/skdm/site-config";

/**
 * Presentation facade for public operator facts.
 * Canonical values live in src/lib/skdm/site-config.ts; this module exists so
 * UI components can consume Turkish field names without duplicating facts.
 */
export const ISLETMECI = {
  urunAdi: SITE.brandName,
  ticariUnvan: SITE.legalName,
  vergiEtiketi: SITE.vknLabel,
  vergiNo: SITE.vkn,
  yasalKimlikNotu: SITE.publicLegalIdentityNote,
  adres: SITE.address,
  eposta: SITE.email,
  destekEposta: SITE.supportEmail,
  sunucuKonumu: SITE.hostingShort,
  muhurFiyatiTl: SITE.sealPriceTry,
  muhurFiyatiEtiket: SITE.sealPriceLabel,
  kdvDahil: SITE.vatIncluded,
  yenidenMuhurlemePolitikasi: SITE.resealPublicCopy,
} as const;

export type Isletmeci = typeof ISLETMECI;
