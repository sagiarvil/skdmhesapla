"use strict";
/**
 * SKDMHesapla — Tek Doğruluk Kaynağı (Single Source of Truth)
 * Yasal kimlik, iletişim ve navigasyon sabitleri.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERSON_ENTITY = exports.SITE_LEGAL_LINKS = exports.SITE_FOOTER_PRODUCT_LINKS = exports.SITE_NAV_LINKS = exports.PLATFORM_STATS = exports.LEGAL_ENTITY = void 0;
const package_manifest_1 = require("./package-manifest");
const site_config_1 = require("./site-config");
exports.LEGAL_ENTITY = {
    brandName: site_config_1.SITE.brandName,
    companyName: site_config_1.SITE.legalName,
    vkn: site_config_1.SITE.vkn,
    vknLabel: site_config_1.SITE.vknLabel,
    publicLegalIdentityNote: site_config_1.SITE.publicLegalIdentityNote,
    supportEmail: site_config_1.SITE.email,
    /** İşletmeci merkezi (hukuki kayıt yeri) — sunucu konumundan ayrıdır (GATE-F). */
    operatorLocation: site_config_1.SITE.operatorLocation,
    serverLocation: site_config_1.SITE.hostingShort,
    address: site_config_1.SITE.address,
    addressNote: site_config_1.SITE.addressNote,
    hostingDetail: site_config_1.SITE.hosting,
    disclaimer: "SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır.",
    copyrightShort: "© 2026 CimetricaOne",
    copyrightFull: "© 2026 SKDMHesapla · CimetricaOne",
};
exports.PLATFORM_STATS = {
    layerCount: 10,
    stepCount: 15,
    /** Tek kaynak: package-manifest.ts — elle sayı yazma. */
    fileCount: package_manifest_1.SEALED_PACKAGE_FILE_COUNT,
    sectorCount: 20,
};
exports.SITE_NAV_LINKS = [
    { href: "/cbam-hesaplama/", label: "CBAM Hesaplama" },
    { href: "/nasil-calisir/", label: "Nasıl Çalışır" },
    { href: "/metodoloji/", label: "Metodoloji" },
    { href: "/rehber/", label: "Rehber" },
    { href: "/sss/", label: "SSS" },
    { href: "/tedarikci-verisi/", label: "Tedarikçi Verisi" },
    { href: "/fiyatlandirma/", label: "Fiyatlandırma" },
];
/** Footer ürün sütunu — header ile aynı ritim, Doğrula burada değil. */
exports.SITE_FOOTER_PRODUCT_LINKS = [
    { href: "/cbam-hesaplama/", label: "CBAM / SKDM Hesaplama" },
    { href: "/basla/", label: "GTİP ile kapsam kontrolü" },
    { href: "/cbam-50-ton-muafiyeti/", label: "CBAM 50 Ton Muafiyeti" },
    { href: "/cbam-dogrulama/", label: "CBAM Doğrulama" },
    { href: "/sss/", label: "CBAM / SKDM SSS" },
    { href: "/nasil-calisir/", label: "Nasıl Çalışır" },
    { href: "/metodoloji/", label: "Metodoloji" },
    { href: "/rehber/", label: "Rehber" },
    { href: "/sozluk/", label: "Sözlük" },
    { href: "/sektor/demir-celik/", label: "Demir-çelik SKDM" },
    { href: "/tedarikci-verisi/", label: "Tedarikçi Verisi" },
    { href: "/fiyatlandirma/", label: "Fiyatlandırma" },
];
exports.SITE_LEGAL_LINKS = [
    { href: "/hakkinda/", label: "Hakkında" },
    { href: "/uzmanlik/baris-bagirlar/", label: "Metodoloji Sorumlusu" },
    { href: "/mevzuat/", label: "Mevzuat" },
    { href: "/kaynak-politikasi/", label: "Kaynak politikası" },
    { href: "/dogrula/", label: "Mühür Doğrulama" },
    { href: "/kullanim-kosullari/", label: "Kullanım Koşulları" },
    { href: "/kvkk-aydinlatma/", label: "KVKK" },
    { href: "/iade-politikasi/", label: "İade" },
    { href: "/iletisim/", label: "İletişim" },
];
/** E-E-A-T — ürün sorumlusu / entity (Person şeması kaynağı). */
exports.PERSON_ENTITY = {
    name: "Barış Bağırlar",
    jobTitle: "Ürün ve Karbon Hesaplama Metodolojisi Sorumlusu",
    profileUrl: "/uzmanlik/baris-bagirlar",
    imagePath: "/kisiler/baris-bagirlar.jpg",
    sameAs: [
        "https://www.linkedin.com/in/barisbagirlar/",
        "https://www.tarimkon.org/danisma-kurulu/",
    ],
    affiliation: [
        {
            name: "Gaziantep Üniversitesi — Gaziantep Sanayi Odası Mesleki Eğitim Merkezi (GSO-MEM)",
            role: "ISO 14064-1 Kapsam 1–2–3 emisyon hesabı ve yeşil yol haritası mentörlüğü",
        },
        {
            name: "TARIMKON — Uluslararası Tarım ve Gıda Konfederasyonu",
            role: "Danışma Kurulu üyesi (Genel Başkan Danışmanı)",
            url: "https://www.tarimkon.org/danisma-kurulu/",
        },
    ],
    knowsAbout: [
        "ISO 14064-1",
        "Kapsam 1 emisyon",
        "Kapsam 2 emisyon",
        "Kapsam 3 emisyon",
        "SKDM",
        "CBAM",
        "Yeşil dönüşüm",
    ],
};
