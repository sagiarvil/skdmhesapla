/**
 * src/config/isletmeci.ts
 * MANDATE-SKDMHESAPLA-ANASAYFA-PREMIUM-V1 · GATE-P5
 */
export const ISLETMECI = {
  urunAdi: "SKDMHesapla",
  ticariUnvan: "CimetricaOne",
  vergiEtiketi: "T.C. Kimlik No",
  vergiNo: "25403091318",
  adres: "Levent Mah. Cömert Sok. No:1, Beşiktaş/İstanbul",
  eposta: "info@cimetricaone.com",
  destekEposta: "destek@skdmhesapla.com",
  sunucuKonumu: "Frankfurt (Almanya / AB)",
  muhurFiyatiTl: 9900,
  muhurFiyatiEtiket: "9.900 ₺",
  kdvDahil: true,
  yenidenMuhurlemePolitikasi:
    "Aynı dosyada düzeltme ve yeniden mühürleme ücretsizdir. Yeni tesis veya yeni dönem için yeni dosya ve yeni ödeme gerekir.",
} as const;

export type Isletmeci = typeof ISLETMECI;
