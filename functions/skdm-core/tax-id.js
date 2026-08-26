"use strict";
/**
 * Türk vergi kimlik numarası (VKN) ve T.C. kimlik numarası (TCKN) doğrulaması.
 *
 * - VKN: tüzel/gerçek kişiye ait 10 hane + son hane kontrol (GİB ISO 7064 türevi).
 * - TCKN: gerçek kişiye ait 11 hane + son iki hane kontrol.
 * - Tüzel kişi unvanı taşıyan kayıtta VKN yalnızca 10 haneli olabilir (mandate RM-005 GATE-M1).
 *
 * Bu modül saf fonksiyondur; UI metni üretmez. Bulgu metni qc.ts tarafından
 * G-23 onaylı dille (hata/red/başarısız/geçersiz yasak) oluşturulur.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TUREL_KISILIK_IBARESI = exports.TCKN_HANE = exports.VKN_HANE = void 0;
exports.isLegalEntityTitle = isLegalEntityTitle;
exports.computeVknCheckDigit = computeVknCheckDigit;
exports.isValidVkn = isValidVkn;
exports.isValidTcKimlik = isValidTcKimlik;
exports.denetleVergiKimlikNo = denetleVergiKimlikNo;
exports.isletmeTuruUnvanCeliski = isletmeTuruUnvanCeliski;
exports.VKN_HANE = 10;
exports.TCKN_HANE = 11;
/** Tüzel kişi unvan belirteçleri (mandate: A.Ş., Ltd. Şti., Koop., Şti., Kollektif, Komandit). */
exports.TUREL_KISILIK_IBARESI = /(?:^|[\s&/\\|,;()"'-])(A\.?\s?Ş\.?|A\.?\s?S\.?|AŞ|Ltd\.?\s?Şti\.?|Ltd\.?|Şti\.?|Koop\.?|Kooperatif|Kollektif|Komandit|Anonim\s+Şirket|Limited\s+Şirket)(?![A-Za-zÇĞÖÜİŞçğıöüş])/i;
function isLegalEntityTitle(title) {
    return exports.TUREL_KISILIK_IBARESI.test(String(title || "").trim());
}
/** VKN kontrol hanesi — GİB algoritması (ilk 9 haneden 10. hane türetilir). */
function computeVknCheckDigit(first9) {
    if (!/^[0-9]{9}$/.test(first9))
        return null;
    const d = first9.split("").map(Number);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        const tmp = (d[i] + (9 - i)) % 10;
        if (tmp === 0)
            continue;
        let product = (tmp * Math.pow(2, 9 - i)) % 9;
        if (product === 0)
            product = 9;
        sum += product;
    }
    return (10 - (sum % 10)) % 10;
}
/** 10 haneli VKN + son hane checksum doğrulaması. */
function isValidVkn(value) {
    if (!/^[0-9]{10}$/.test(value))
        return false;
    const check = computeVknCheckDigit(value.slice(0, 9));
    return check !== null && check === Number(value[9]);
}
/** 11 haneli TCKN + son iki hane checksum doğrulaması. */
function isValidTcKimlik(value) {
    if (!/^[0-9]{11}$/.test(value))
        return false;
    const d = value.split("").map(Number);
    if (d[0] === 0)
        return false;
    if (d.every((x) => x === d[0]))
        return false;
    const t10 = ((d[0] + d[2] + d[4] + d[6] + d[8]) * 7 - (d[1] + d[3] + d[5] + d[7])) % 10;
    if (d[9] !== (t10 + 10) % 10)
        return false;
    const sum10 = d.slice(0, 10).reduce((a, b) => a + b, 0);
    return d[10] === sum10 % 10;
}
/**
 * Unvan + işletme türü + vergi kimlik numarası üçlüsünü denetler.
 * - tur "turel": yalnızca 10 haneli VKN + checksum kabul; 11 hane → turel-11-hane.
 * - tur "sahis": yalnızca 11 haneli TCKN + checksum kabul; 10 hane → sahis-10-hane.
 * - tur yoksa (eski akış): unvandan tüzel olduğu çıkarılır.
 * - Diğer uzunluklar → uzunluk bulgusu.
 */
function denetleVergiKimlikNo(title, value, tur) {
    const temiz = String(value || "").trim();
    if (!temiz)
        return { durum: { durum: "bos" }, ok: true };
    const turel = tur ? tur === "turel" : isLegalEntityTitle(title);
    if (turel) {
        if (temiz.length === exports.VKN_HANE) {
            return isValidVkn(temiz)
                ? { durum: { durum: "gecerli-vkn" }, ok: true }
                : { durum: { durum: "checksum" }, ok: false };
        }
        if (temiz.length === exports.TCKN_HANE) {
            return { durum: { durum: "turel-11-hane", hane: temiz.length }, ok: false };
        }
        return { durum: { durum: "uzunluk", hane: temiz.length }, ok: false };
    }
    if (tur === "sahis") {
        if (temiz.length === exports.TCKN_HANE) {
            return isValidTcKimlik(temiz)
                ? { durum: { durum: "gecerli-tckn" }, ok: true }
                : { durum: { durum: "checksum" }, ok: false };
        }
        if (temiz.length === exports.VKN_HANE) {
            return { durum: { durum: "sahis-10-hane", hane: temiz.length }, ok: false };
        }
        return { durum: { durum: "uzunluk", hane: temiz.length }, ok: false };
    }
    if (temiz.length === exports.VKN_HANE) {
        return isValidVkn(temiz)
            ? { durum: { durum: "gecerli-vkn" }, ok: true }
            : { durum: { durum: "checksum" }, ok: false };
    }
    if (temiz.length === exports.TCKN_HANE) {
        return isValidTcKimlik(temiz)
            ? { durum: { durum: "gecerli-tckn" }, ok: true }
            : { durum: { durum: "checksum" }, ok: false };
    }
    return { durum: { durum: "uzunluk", hane: temiz.length }, ok: false };
}
/** GATE-1 (RM-007): unvan tüzel kişi ibaresi taşıyorsa "şahıs firması" seçimi çelişkilidir. */
function isletmeTuruUnvanCeliski(title, tur) {
    return tur === "sahis" && isLegalEntityTitle(title);
}
