/**
 * SKDMHesapla — Tek Doğruluk Kaynağı (Single Source of Truth)
 * Yasal kimlik, iletişim ve navigasyon sabitleri.
 */

import { SEALED_PACKAGE_FILE_COUNT } from "./package-manifest";
import { SITE } from "./site-config";

export const LEGAL_ENTITY = {
  brandName: SITE.brandName,
  companyName: SITE.legalName,
  vkn: SITE.vkn,
  vknLabel: SITE.vknLabel,
  publicLegalIdentityNote: SITE.publicLegalIdentityNote,
  supportEmail: SITE.email,
  /** İşletmeci merkezi (hukuki kayıt yeri) — sunucu konumundan ayrıdır (GATE-F). */
  operatorLocation: SITE.operatorLocation,
  serverLocation: SITE.hostingShort,
  address: SITE.address,
  addressNote: SITE.addressNote,
  hostingDetail: SITE.hosting,
  disclaimer:
    "SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır.",
  copyrightShort: "© 2026 CimetricaOne",
  copyrightFull: "© 2026 SKDMHesapla · CimetricaOne",
} as const;

export const PLATFORM_STATS = {
  layerCount: 10,
  stepCount: 15,
  /** Tek kaynak: package-manifest.ts — elle sayı yazma. */
  fileCount: SEALED_PACKAGE_FILE_COUNT,
  sectorCount: 20,
} as const;

export const SITE_NAV_LINKS = [
  { href: "/cbam-hesaplama/", label: "CBAM Hesaplama" },
  { href: "/nasil-calisir/", label: "Nasıl Çalışır" },
  { href: "/metodoloji/", label: "Metodoloji" },
  { href: "/rehber/", label: "Rehber" },
  { href: "/sss/", label: "SSS" },
  { href: "/tedarikci-verisi/", label: "Tedarikçi Verisi" },
  { href: "/fiyatlandirma/", label: "Fiyatlandırma" },
] as const;

/** Footer ürün sütunu — header ile aynı ritim, Doğrula burada değil. */
export const SITE_FOOTER_PRODUCT_LINKS = [
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
] as const;

export const SITE_LEGAL_LINKS = [
  { href: "/hakkinda/", label: "Hakkında" },
  { href: "/uzmanlik/baris-bagirlar/", label: "Metodoloji Sorumlusu" },
  { href: "/mevzuat/", label: "Mevzuat" },
  { href: "/kaynak-politikasi/", label: "Kaynak politikası" },
  { href: "/dogrula/", label: "Mühür Doğrulama" },
  { href: "/kullanim-kosullari/", label: "Kullanım Koşulları" },
  { href: "/kvkk-aydinlatma/", label: "KVKK" },
  { href: "/iade-politikasi/", label: "İade" },
  { href: "/iletisim/", label: "İletişim" },
] as const;

/** E-E-A-T — ürün sorumlusu / entity (Person şeması kaynağı). */
export const PERSON_ENTITY = {
  name: "Barış Bağırlar",
  jobTitle: "Ürün ve Karbon Hesaplama Metodolojisi Sorumlusu",
  profileUrl: "/uzmanlik/baris-bagirlar",
  imagePath: "/kisiler/baris-bagirlar.jpg",
  sameAs: [
    "https://www.linkedin.com/in/barisbagirlar/",
    "https://www.tarimkon.org/danisma-kurulu/",
  ] as const,
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
  ] as const,
  knowsAbout: [
    "ISO 14064-1",
    "Kapsam 1 emisyon",
    "Kapsam 2 emisyon",
    "Kapsam 3 emisyon",
    "SKDM",
    "CBAM",
    "Yeşil dönüşüm",
  ] as const,
} as const;
