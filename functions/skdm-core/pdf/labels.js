"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDF_LABELS = void 0;
/**
 * GATE-M2 (RM-005) — PDF etiket/başlık sabitleri: tek i18n kaynağı.
 * Rapordaki kapak etiketleri ve bölüm başlıkları buradan beslenir;
 * dağınık string literal üretilmez. Tüm değerler doğru Türkçe gliflerle.
 */
exports.PDF_LABELS = {
    cover: {
        title: "KAPSAMLI DURUM RAPORU / COMPREHENSIVE STATUS REPORT",
        subtitle: "SKDM (CBAM) Veri Paketi — A'dan Z'ye Tam Görünüm / Full CBAM Data Dossier",
        badge: "DOĞRULANABİLİR MÜHÜR / VERIFIABLE SEAL",
        mukurlu: "MÜHÜRLÜ VERİ PAKETİ / SEALED DATA PACKAGE",
    },
    coverFacts: {
        tesis: "TESİS / INSTALLATION",
        isletme: "İŞLETME / OPERATOR",
        sektor: "SEKTÖR / SECTOR",
        donem: "RAPORLAMA DÖNEMİ / REPORTING PERIOD",
        ihracHacmi: "İHRAÇ HACMİ / EXPORT VOLUME",
        motor: "MOTOR / RULESET",
    },
    sections: {
        yoneticiOzeti: "YÖNETİCİ ÖZETİ — DOSYA BİR BAKIŞTA / EXECUTIVE SUMMARY",
        tesisKimligi: "TESİS VE FİRMA KİMLİĞİ / INSTALLATION & OPERATOR IDENTITY",
        register: "KAPSAM VE ÜRÜN REGISTER'I (G / P) / SCOPE & GOODS REGISTER",
        emisyon: "EMİSYON HESAPLAMA ÖZETİ (B / D / E) / EMISSION CALCULATION SUMMARY",
        denklik: "KONTROL DENKLİKLERİ / CONTROL RECONCILIATIONS",
        maliyet: "MALİYET PROJEKSİYONU / CBAM COST PROJECTION",
        veriKalitesi: "VERİ KALİTESİ VE KANIT DURUMU / DATA QUALITY & EVIDENCE STATUS",
        dogrulayici: "DOĞRULAYICI HAZIRLIK DEĞERLENDİRMESİ / VERIFIER READINESS ASSESSMENT",
        bulgular: "BULGU KAYDI / FINDINGS LOG",
        paketIcerigi: (n) => `PAKET İÇERİĞİ (${n} DOSYA) / PACKAGE CONTENTS (${n} FILES)`,
        butunluk: "BÜTÜNLÜK VE SÜRÜM BİLGİSİ / INTEGRITY & VERSION INFO",
        kapsam: "KAPSAM SINIRLARI VE YASAL BİLDİRİM / SCOPE BOUNDARIES & LEGAL NOTICE",
        metodoloji: "METODOLOJİ, KAYNAKLAR VE YETKİNLİK / METHODOLOGY & REGULATORY BASIS",
    },
};
