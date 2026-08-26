"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trLower = exports.trUpper = void 0;
/**
 * GATE-M2 (RM-005) — Türkçe büyük/küçük harf dönüşümleri.
 * JS varsayılan `.toUpperCase()` İ/ı ve ı/i ayrımını tanımaz; tüm dönüşümler
 * tr-TR locale ile yapılır (mandate: her büyük/küçük harf dönüşümü tr-TR).
 */
const trUpper = (s) => String(s ?? "").toLocaleUpperCase("tr-TR");
exports.trUpper = trUpper;
const trLower = (s) => String(s ?? "").toLocaleLowerCase("tr-TR");
exports.trLower = trLower;
