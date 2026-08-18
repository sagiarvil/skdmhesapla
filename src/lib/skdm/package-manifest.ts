/**
 * Mühürlü paket dosya listesi — tek doğruluk kaynağı (Case Manager §42).
 * UI copy, PLATFORM_STATS.fileCount ve CI bu listeden türetilir.
 *
 * GATE-M4 (RM-005): `audience` alanı teslimat setlerini belirler (config-driven).
 * - "verifier" dosyalar alıcı (buyer) ZIP'inden kod seviyesinde filtrelenir (INV-4).
 * - "buyer" dosyalar alıcıya gönderilir ve doğrulayıcı setine de girer (denetim bütünlüğü).
 * - "all" her iki sete de girer.
 * Filtreleme package-seal.buildSealedZipForAudience üzerinden tek noktada çalışır.
 */

export type PackageAudience = "buyer" | "verifier" | "all";

export type SealedPackageFile = {
  filename: string;
  label: string;
  audience: PackageAudience;
};

export const SEALED_PACKAGE_FILES: readonly SealedPackageFile[] = [
  {
    filename: "Kapsamli-Durum-Raporu.pdf",
    label: "Kapsamlı Durum Raporu (A'dan Z'ye paket özeti)",
    audience: "all",
  },
  {
    filename: "Denetime-Hazirlik-Dosyasi.pdf",
    label: "Denetime hazırlık ana dosyası (İdari Kimlik & Yönetici Özeti)",
    audience: "all",
  },
  {
    filename: "Emisyon-Hesaplama-Eki.pdf",
    label: "Emisyon hesaplama ve yoğunluk eki (Spesifik Emisyonlar)",
    audience: "all",
  },
  {
    filename: "SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx",
    label: "SKDM İletişim Özeti (Communication Template alan özeti)",
    audience: "all",
  },
  {
    filename: "Izleme-Yontem-Plani.pdf",
    label: "İzleme ve Metodoloji Planı (denetime hazırlık — doğrulama görüşü değildir)",
    audience: "verifier",
  },
  {
    filename: "Kanit-Kayit-Defteri.xlsx",
    label: "Faaliyet verisi ve kanıt kayıt defteri (Faturalar & Sayaçlar)",
    audience: "verifier",
  },
  {
    filename: "Dogrulayici-Calisma-Alani.xlsx",
    label: "Doğrulayıcı ön-doldurulmuş çalışma alanı (Verifier Worksheet)",
    audience: "verifier",
  },
  {
    filename: "Oncul-Madde-Tedarikci-Beyani.pdf",
    label: "Öncül madde (Precursor) tedarikçi beyan ve tespit eki",
    audience: "verifier",
  },
  {
    filename: "Elektrik-ve-Isi-Denge-Raporu.xlsx",
    label: "Elektrik ve ısı denge raporu (Energy & Heat Balance)",
    audience: "verifier",
  },
  {
    filename: "De-Minimis-Muafiyet-Kapsam-Beyani.pdf",
    label: "De Minimis ve kapsam muafiyet beyannamesi (50t/yıl kuralı)",
    audience: "buyer",
  },
  {
    filename: "Hesaplama-Izi.json",
    label: "Deterministik hesaplama izi (Register snapshot gömülü)",
    audience: "verifier",
  },
  {
    filename: "BUTUNLIK-MANIFESTOSU.json",
    label: "Bütünlük manifestosu ve SHA-256 dijital mührü",
    audience: "all",
  },
];

export type SealedPackageFilename = (typeof SEALED_PACKAGE_FILES)[number]["filename"];

export const SEALED_PACKAGE_FILE_COUNT = SEALED_PACKAGE_FILES.length;

export const SEALED_PACKAGE_FILENAMES: readonly SealedPackageFilename[] =
  SEALED_PACKAGE_FILES.map((f) => f.filename);

/** Bir dosyanın teslimat kitlesi — manifest SSOT'tan. */
export function manifestAudienceFor(filename: string): PackageAudience {
  return SEALED_PACKAGE_FILES.find((f) => f.filename === filename)?.audience ?? "all";
}

/**
 * Belirli kitle için dosya adı kümesi (config-driven; hardcode yok).
 * - Doğrulayıcı seti = tam paket (alıcıya yönelik dosyalar dahil — denetim bütünlüğü).
 * - Alıcı seti = "verifier" etiketli dosyalar hariç (INV-4 kod garantisi).
 */
export function filenamesForAudience(audience: PackageAudience): Set<string> {
  const set = new Set<string>();
  for (const f of SEALED_PACKAGE_FILES) {
    if (audience === "verifier") {
      set.add(f.filename);
    } else if (f.audience === "all" || f.audience === "buyer") {
      set.add(f.filename);
    }
  }
  return set;
}

export function sealedFileCountForAudience(audience: PackageAudience): number {
  return filenamesForAudience(audience).size;
}
