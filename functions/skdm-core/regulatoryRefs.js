"use strict";
/**
 * Mevzuat referansları — tek doğruluk kaynağı (GATE-G / RM-006, INV-5).
 *
 * Site metinleri ve PDF/XLSX şablonları referans numaralarını buradan besler;
 * elle yazılmış tüzük numarası literalı üretmez. Her referansın nerede
 * kullanıldığı `usedIn` ile kayıtlıdır; `scripts/verify-gate-g-regulatory-refs.mjs`
 * sitede iddia edilen referansın ilgili teslim belgesinde fiilen geçtiğini
 * doğrular.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REG_REF = exports.REGULATORY_REFS = void 0;
exports.regRefById = regRefById;
exports.REGULATORY_REFS = [
    {
        id: "cbam-2023-956",
        code: "AB 2023/956",
        fullTitleTr: "Sınırda Karbon Düzenleme Mekanizması (SKDM) temel tüzüğü",
        fullTitleEn: "Regulation (EU) 2023/956 establishing the Carbon Border Adjustment Mechanism",
        topicTr: "SKDM'yi kuran ana yasal metin; izleme planı ve emisyon raporu yükümlülüğünün dayanağı.",
        usedIn: [
            { kind: "site", name: "/fiyatlandirma/ SSS" },
            { kind: "site", name: "/ mevzuat dayanağı" },
            { kind: "document", name: "Kapsamli-Durum-Raporu.pdf", section: "Kapsam 2" },
            { kind: "document", name: "Izleme-Yontem-Plani.pdf", section: "Mevzuat dayanağı" },
        ],
    },
    {
        id: "omnibus-2025-2083",
        code: "AB 2025/2083",
        fullTitleTr: "Omnibus-I sadeleştirme paketi (50 ton de minimis, sertifika takvimi)",
        fullTitleEn: "Regulation (EU) 2025/2083 (Omnibus-I simplification)",
        topicTr: "De minimis eşiği, sertifika satışı ertelenmesi ve bulundurma oranı değişiklikleri.",
        usedIn: [
            { kind: "site", name: "/fiyatlandirma/" },
            { kind: "site", name: "/ mevzuat dayanağı" },
            { kind: "document", name: "De-Minimis-Muafiyet-Kapsam-Beyani.pdf" },
            { kind: "document", name: "Kapsamli-Durum-Raporu.pdf", section: "Kapak" },
        ],
    },
    {
        id: "ir-2025-2547",
        code: "IR 2025/2547",
        fullTitleTr: "Kesin dönem izleme ve raporlama uygulama tüzüğü (izleme planı + emisyon raporu formatı)",
        fullTitleEn: "Implementing Regulation (EU) 2025/2547 — monitoring and reporting rules",
        topicTr: "İzleme planı ve işletmeci emisyon raporu yapısının kaynağı; paketteki 1. dosya bu formata oturur.",
        usedIn: [
            { kind: "site", name: "/fiyatlandirma/ SSS" },
            { kind: "site", name: "/ SSS" },
            { kind: "document", name: "Izleme-Yontem-Plani.pdf", section: "Mevzuat dayanağı" },
        ],
    },
    {
        id: "ir-2025-2621",
        code: "IR 2025/2621",
        fullTitleTr: "Varsayılan (benchmark) değerler uygulama tüzüğü",
        fullTitleEn: "Implementing Regulation (EU) 2025/2621 — default values",
        topicTr: "Veri sağlanmadığında alıcının kullanacağı varsayılan gömülü emisyon değerleri.",
        usedIn: [
            { kind: "site", name: "/sozluk/" },
            { kind: "document", name: "Kapsamli-Durum-Raporu.pdf", section: "Veri kalitesi" },
            { kind: "document", name: "Emisyon-Hesaplama-Eki.pdf", section: "Varsayılan değer kullanımı" },
        ],
    },
    {
        id: "ir-2025-2546",
        code: "IR 2025/2546",
        fullTitleTr: "Doğrulayıcı risk analizi uygulama tüzüğü",
        fullTitleEn: "Implementing Regulation (EU) 2025/2546 — verifier risk analysis",
        topicTr: "Akredite doğrulayıcının saha denetiminde odaklandığı risk alanları.",
        usedIn: [
            { kind: "site", name: "/sozluk/" },
            { kind: "document", name: "Kapsamli-Durum-Raporu.pdf", section: "Doğrulayıcı hazırlık" },
        ],
    },
];
/** Kısa kod erişimi — site metinleri ve PDF şablonları tek yerden beslenir. */
exports.REG_REF = Object.fromEntries(exports.REGULATORY_REFS.map((r) => [r.id, r.code]));
function regRefById(id) {
    return exports.REGULATORY_REFS.find((r) => r.id === id);
}
