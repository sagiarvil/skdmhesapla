"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SITE = void 0;
/**
 * Site kimliği — tek gerçek kaynak (CURSOR İş Emri Faz 1.1).
 * Yasal unvan, iletişim, barındırma ve kamuya açık ticari politika
 * sayfalarda elle yazılmaz.
 */
const config_1 = require("./config");
const package_manifest_1 = require("./package-manifest");
exports.SITE = {
    /** Barış netleştirmesi — tek yasal unvan (Türkiye kayıtlı şahıs işletmesi) */
    legalName: "CimetricaOne",
    brandName: "SKDMHesapla",
    /** Kişisel vergi/kimlik numarası public bundle içinde tutulmaz. */
    vkn: "",
    vknLabel: "Yasal kimlik",
    publicLegalIdentityNote: "Yasal kimlik ve vergi bilgileri fatura, ödeme belgesi ve yetkili mercilere sunulan belgelerde paylaşılır.",
    email: "info@cimetricaone.com",
    supportEmail: "destek@skdmhesapla.com",
    /** İşletmeci merkezi (GATE-F/RM-006): hukuki kayıt yeri — sunucu konumuyla karıştırılmaz. */
    operatorLocation: "Türkiye",
    /** Kamuya açık işletmeci adresi — footer/yasal sayfalar bu değeri kullanır. */
    address: "Levent Mah. Cömert Sok. No:1, Beşiktaş/İstanbul",
    addressNote: "İşletmeci adresi ile sunucu konumu farklı kavramlardır.",
    /** firebase.json: hosting + functions europe-west3 (Frankfurt, AB) */
    hosting: "Google Cloud Firebase Hosting ve Cloud Functions (europe-west3, Frankfurt, AB); Firestore ve Storage aynı bölgede. Alan adı CDN: Cloudflare.",
    /** GATE-F: yalnızca sunucu konumu — işletmeci merkezi (operatorLocation) ayrı beyan edilir. */
    hostingShort: "Frankfurt (Almanya / AB)",
    packageFileCount: package_manifest_1.SEALED_PACKAGE_FILE_COUNT,
    sealPriceTry: config_1.PADDLE_SEAL_PRICE_TRY,
    sealPriceLabel: `${config_1.PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR")} ₺`,
    vatIncluded: true,
    /** Kamuya açık politika — tüm sayfalar bu metni kullanır. Ayrı reseal ürünü yok. */
    resealSameFileIsFree: true,
    resealPublicCopy: "Aynı dosyada düzeltme ve yeniden mühürleme ücretsizdir. Yeni tesis veya yeni dönem için yeni dosya ve yeni ödeme gerekir.",
};
