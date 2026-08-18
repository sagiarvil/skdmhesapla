/**
 * GATE-M2 (RM-005) — Türkçe büyük/küçük harf dönüşümleri.
 * JS varsayılan `.toUpperCase()` İ/ı ve ı/i ayrımını tanımaz; tüm dönüşümler
 * tr-TR locale ile yapılır (mandate: her büyük/küçük harf dönüşümü tr-TR).
 */
export const trUpper = (s: string): string => String(s ?? "").toLocaleUpperCase("tr-TR");
export const trLower = (s: string): string => String(s ?? "").toLocaleLowerCase("tr-TR");
