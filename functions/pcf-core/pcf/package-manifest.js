"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PCF_FORBIDDEN_CBAM_FILENAMES = exports.PCF_SEALED_PACKAGE_FILE_COUNT = exports.PCF_SEALED_PACKAGE_FILES = void 0;
/**
 * Kademe B PCF mühürlü paket SSOT.
 * CBAM Communication Template / de-minimis / doğrulayıcı çalışma alanı YASAK.
 */
exports.PCF_SEALED_PACKAGE_FILES = [
    { filename: "01-Product-Carbon-Footprint-Report-EN.pdf", label: "Alıcıya gönderilebilir İngilizce ürün karbon ayak izi raporu" },
    { filename: "02-Urun-Karbon-Ayak-Izi-Raporu-TR.pdf", label: "İşletmeci arşiv kopyası" },
    { filename: "03-Carbon-Data-Summary.xlsx", label: "Ürün, malzeme, enerji, tahsis ve sonuç özeti" },
    { filename: "04-Emission-Factor-Register.xlsx", label: "Kullanılan her faktörün kaynak, sürüm, yıl, coğrafya, boundary ve lisans kaydı" },
    { filename: "05-Evidence-Register.xlsx", label: "Üretim, elektrik, yakıt, malzeme ve tedarikçi kanıt indeksleri" },
    { filename: "06-Calculation-Trace.json", label: "Deterministik PCF hesaplama izi ve sürüm snapshot'ı" },
    { filename: "07-BUTUNLUK-MANIFESTOSU.json", label: "Dosya SHA-256 hash'leri ve master package hash" },
    { filename: "08-Muhur-Dogrulama-Belgesi.pdf", label: "Paket bütünlüğünün /dogrula üzerinden teyit yöntemi" },
];
exports.PCF_SEALED_PACKAGE_FILE_COUNT = exports.PCF_SEALED_PACKAGE_FILES.length;
exports.PCF_FORBIDDEN_CBAM_FILENAMES = [
    "SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx",
    "De-Minimis-Muafiyet-Kapsam-Beyani.pdf",
    "Dogrulayici-Calisma-Alani.xlsx",
];
