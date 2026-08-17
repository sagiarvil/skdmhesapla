/**
 * Mühürlü paket dosya listesi — tek doğruluk kaynağı (Case Manager §42).
 * UI copy, PLATFORM_STATS.fileCount ve CI bu listeden türetilir.
 */
export const SEALED_PACKAGE_FILES = [
  {
    filename: "Kapsamli-Durum-Raporu.pdf",
    label: "Kapsamlı Durum Raporu (A'dan Z'ye paket özeti)",
  },
  {
    filename: "Denetime-Hazirlik-Dosyasi.pdf",
    label: "Denetime hazırlık ana dosyası (İdari Kimlik & Yönetici Özeti)",
  },
  {
    filename: "Emisyon-Hesaplama-Eki.pdf",
    label: "Emisyon hesaplama ve yoğunluk eki (Spesifik Emisyonlar)",
  },
  {
    filename: "SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx",
    label: "SKDM İletişim Özeti (Communication Template alan özeti)",
  },
  {
    filename: "Izleme-Yontem-Plani.pdf",
    label: "İzleme ve Metodoloji Planı (MMP / ISO 14064 Uyumlu)",
  },
  {
    filename: "Kanit-Kayit-Defteri.xlsx",
    label: "Faaliyet verisi ve kanıt kayıt defteri (Faturalar & Sayaçlar)",
  },
  {
    filename: "Dogrulayici-Calisma-Alani.xlsx",
    label: "Doğrulayıcı ön-doldurulmuş çalışma alanı (Verifier Worksheet)",
  },
  {
    filename: "Oncul-Madde-Tedarikci-Beyani.pdf",
    label: "Öncül madde (Precursor) tedarikçi beyan ve tespit eki",
  },
  {
    filename: "Elektrik-ve-Isi-Denge-Raporu.xlsx",
    label: "Elektrik ve ısı denge raporu (Energy & Heat Balance)",
  },
  {
    filename: "De-Minimis-Muafiyet-Kapsam-Beyani.pdf",
    label: "De Minimis ve kapsam muafiyet beyannamesi (50t/yıl kuralı)",
  },
  {
    filename: "Hesaplama-Izi.json",
    label: "Deterministik hesaplama izi (Register snapshot gömülü)",
  },
  {
    filename: "BUTUNLIK-MANIFESTOSU.json",
    label: "Bütünlük manifestosu ve SHA-256 dijital mührü",
  },
] as const;

export type SealedPackageFilename = (typeof SEALED_PACKAGE_FILES)[number]["filename"];

export const SEALED_PACKAGE_FILE_COUNT = SEALED_PACKAGE_FILES.length;

export const SEALED_PACKAGE_FILENAMES: readonly SealedPackageFilename[] =
  SEALED_PACKAGE_FILES.map((f) => f.filename);
