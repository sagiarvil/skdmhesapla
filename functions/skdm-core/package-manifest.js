"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEALED_PACKAGE_FILENAMES = exports.SEALED_PACKAGE_FILE_COUNT = exports.SEALED_PACKAGE_FILES = void 0;
exports.manifestAudienceFor = manifestAudienceFor;
exports.filenamesForAudience = filenamesForAudience;
exports.sealedFileCountForAudience = sealedFileCountForAudience;
exports.SEALED_PACKAGE_FILES = [
    {
        filename: "Kapsamli-Durum-Raporu.pdf",
        label: "Kapsamlı Durum Raporu",
        desc: "Paketin A'dan Z'ye özeti: tesis kimliği, G/P/B/E register, Annex II emisyon dengesi, maliyet, denklik, bulgular ve yasal sınırlar.",
        audience: "all",
    },
    {
        filename: "Denetime-Hazirlik-Dosyasi.pdf",
        label: "Denetime Hazırlık Ana Dosyası",
        desc: "İdari kimlik ve yönetici özeti: tesis, kaynak akışları, öncül maddeler, süreçler ve hazırlık skoru.",
        audience: "all",
    },
    {
        filename: "Emisyon-Hesaplama-Eki.pdf",
        label: "Emisyon Hesaplama Eki",
        desc: "Satır bazlı emisyon hesabı: her akış için formül, kullanılan emisyon faktörü kaynağı ve toplamla mutabakat.",
        audience: "all",
    },
    {
        filename: "SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx",
        label: "CBAM Communication Template Veri Eşleme Özeti (XLSX)",
        desc: "Tesis, ürün, süreç, kaynak akışı, precursor ve emisyon alanlarını Avrupa Komisyonu Communication Template'e aktarımı kolaylaştıracak şekilde eşleyen çalışma özeti. Bu dosya Avrupa Komisyonu'nun yayımladığı resmî XLSX'in birebir kopyası değildir.",
        audience: "all",
    },
    {
        filename: "Izleme-Yontem-Plani.pdf",
        label: "İzleme Planı",
        desc: "Tesis tanımı, kaynak akışları, ölçüm yöntemleri ve veri kalite yaklaşımınız. Denetime hazırlık dosyasıdır; doğrulama görüşü değildir.",
        audience: "verifier",
    },
    {
        filename: "Kanit-Kayit-Defteri.xlsx",
        label: "Kanıt Kayıt Defteri (XLSX)",
        desc: "Fatura, sayaç, kalibrasyon ve laboratuvar ölçüm kayıtlarının denetçiye sunulacağı kanıt defteri.",
        audience: "verifier",
    },
    {
        filename: "Dogrulayici-Calisma-Alani.xlsx",
        label: "Doğrulayıcı Çalışma Alanı (XLSX)",
        desc: "Doğrulayıcının denetim adımlarını satır satır yürütebileceği ön-doldurulmuş çalışma alanı.",
        audience: "verifier",
    },
    {
        filename: "Oncul-Madde-Tedarikci-Beyani.pdf",
        label: "Öncül Madde Tedarikçi Beyanı",
        desc: "Öncül madde SEE beyanları. Ticari sır içerebileceği için yalnızca doğrulayıcı setinde teslim edilir.",
        audience: "verifier",
    },
    {
        filename: "Elektrik-ve-Isi-Denge-Raporu.xlsx",
        label: "Elektrik ve Isı Denge Raporu (XLSX)",
        desc: "Kaynak akışı register'ından türetilen enerji dengesi; her yakıt kendi satırında, kendi emisyon faktörüyle.",
        audience: "verifier",
    },
    {
        filename: "De-Minimis-Muafiyet-Kapsam-Beyani.pdf",
        label: "De Minimis Muafiyet Beyannamesi",
        desc: "Alıcının (AB ithalatçısının) yıllık toplam ithalatı üzerinden de minimis durumu (50 ton) beyanı.",
        audience: "buyer",
    },
    {
        filename: "Hesaplama-Izi.json",
        label: "Hesaplama İzi (JSON)",
        desc: "Ruleset sürümü, çeyreklik ETS fiyatı, register anlık görüntüsü ve satır bazlı hesap adımlarını içeren makine-okunabilir denetim izi.",
        audience: "verifier",
    },
    {
        filename: "BUTUNLIK-MANIFESTOSU.json",
        label: "Manifest ve SHA-256 Dijital Mühür",
        desc: "Paketteki tüm dosyaların bütünlüğünü kilitleyen master imza — /dogrula/ sayfasından teyit edilebilir. Bu bütünlük kaydı akredite doğrulama görüşü değildir.",
        audience: "all",
    },
];
exports.SEALED_PACKAGE_FILE_COUNT = exports.SEALED_PACKAGE_FILES.length;
exports.SEALED_PACKAGE_FILENAMES = exports.SEALED_PACKAGE_FILES.map((f) => f.filename);
function manifestAudienceFor(filename) {
    return exports.SEALED_PACKAGE_FILES.find((f) => f.filename === filename)?.audience ?? "all";
}
function filenamesForAudience(audience) {
    const set = new Set();
    for (const f of exports.SEALED_PACKAGE_FILES) {
        if (audience === "verifier") {
            set.add(f.filename);
        }
        else if (f.audience === "all" || f.audience === "buyer") {
            set.add(f.filename);
        }
    }
    return set;
}
function sealedFileCountForAudience(audience) {
    return filenamesForAudience(audience).size;
}
