/**
 * PUBLIC EXAMPLE PACKAGES
 *
 * Güvenlik ilkesi:
 * - Hesap motoruna bağlı değildir.
 * - Gerçek katsayı içermez.
 * - Emisyon faktörü içermez.
 * - Enerji/hammadde miktarı içermez.
 * - Ara hesap içermez.
 * - Register snapshot içermez.
 * - ZIP / JSON / CSV üretmez.
 *
 * Bu veri yalnız ürün deneyimini göstermek içindir.
 */

export type PublicExamplePackage = {
  id: string;
  title: string;
  sector: string;
  scenario: string;
  description: string;
  coverage: string[];
};

export const PUBLIC_EXAMPLE_PACKAGES: PublicExamplePackage[] = [
  {
    id: "example-steel",
    title: "ÖRNEK — Demir-Çelik SKDM Paketi",
    sector: "Demir-Çelik",
    scenario: "Karma üretim tesisi",
    description:
      "Bir üreticinin SKDM veri toplama, kalite kontrol ve denetime hazırlık sürecinin sadeleştirilmiş örneği.",
    coverage: [
      "Ürün kapsam kontrolü",
      "Üretim süreci organizasyonu",
      "Emisyon veri toplama",
      "Öncül veri kontrolü",
      "Denetime hazırlık kontrolü",
    ],
  },
  {
    id: "example-aluminium",
    title: "ÖRNEK — Alüminyum SKDM Paketi",
    sector: "Alüminyum",
    scenario: "Üretim ve işleme tesisi",
    description:
      "Alüminyum üreticisinin veri hazırlama ve alıcıya sunum sürecini gösteren sentetik örnek.",
    coverage: [
      "CN / ürün kapsamı",
      "Tesis veri organizasyonu",
      "Üretim verisi",
      "Emisyon kanıtları",
      "Paketleme ve kontrol",
    ],
  },
  {
    id: "example-supplier",
    title: "ÖRNEK — AB Alıcısına Veri Paketi",
    sector: "Tedarikçi Verisi",
    scenario: "Türk üretici → AB ithalatçısı",
    description:
      "AB müşterisinin veri talebine cevap hazırlama sürecini gösteren salt okunur örnek.",
    coverage: [
      "Talep edilen veri alanları",
      "Sorumlu kişi koordinasyonu",
      "Kanıt dokümanı kontrolü",
      "Eksik veri uyarıları",
      "Teslim öncesi kalite kontrol",
    ],
  },
];

Object.freeze(PUBLIC_EXAMPLE_PACKAGES);
