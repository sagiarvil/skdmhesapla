/**
 * SKDMHesapla — Tek Doğruluk Kaynağı (Single Source of Truth)
 * Yasal kimlik, iletişim ve navigasyon sabitleri.
 */

export const LEGAL_ENTITY = {
  brandName: "SKDMHesapla",
  companyName: "CimetricaOne",
  vkn: "25403091318",
  supportEmail: "info@cimetricaone.com",
  serverLocation: "Frankfurt (Almanya / AB)",
  disclaimer:
    "SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır.",
  copyrightShort: "© 2026 CimetricaOne - VKN 25403091318",
  copyrightFull: "© 2026 SKDMHesapla · CimetricaOne - VKN 25403091318",
} as const;

export const PLATFORM_STATS = {
  layerCount: 10, // 10 katmanlı denetim & kalite mimarisi
  stepCount: 11, // Triyaj (Adım 0) + 10 veri adımı = 11 adım
  fileCount: 11, // 11 parçalı mühürlü denetime hazırlık paketi
  sectorCount: 20, // 6 Kademe A + 14 Kademe B = 20 sektör
} as const;

export const SITE_NAV_LINKS = [
  { href: "/nasil-calisir/", label: "Nasıl Çalışır" },
  { href: "/rehber/", label: "Rehber" },
  { href: "/tedarikci-verisi/", label: "Tedarikçi Verisi" },
  { href: "/sozluk/", label: "Sözlük" },
  { href: "/dogrula/", label: "Doğrula" },
  { href: "/fiyatlandirma/", label: "Fiyatlandırma" },
] as const;

export const SITE_LEGAL_LINKS = [
  { href: "/dogrula/", label: "Mühür Doğrulama" },
  { href: "/tedarikci-verisi/", label: "Tedarikçi Verisi" },
  { href: "/fiyatlandirma/", label: "Fiyatlandırma" },
  { href: "/kullanim-kosullari/", label: "Kullanım Koşulları" },
  { href: "/kvkk-aydinlatma/", label: "KVKK" },
  { href: "/iade-politikasi/", label: "İade" },
  { href: "/iletisim/", label: "İletişim" },
] as const;
