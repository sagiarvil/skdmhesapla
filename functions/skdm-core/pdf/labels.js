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
        title: "KAPSAMLI DURUM RAPORU",
        subtitle: "SKDM (CBAM) Veri Paketi — A'dan Z'ye Tam Görünüm",
        badge: "DOĞRULANABİLİR MÜHÜR",
        mukurlu: "MÜHÜRLÜ VERİ PAKETİ",
    },
    coverFacts: {
        tesis: "TESİS",
        isletme: "İŞLETME",
        sektor: "SEKTÖR",
        donem: "RAPORLAMA DÖNEMİ",
        ihracHacmi: "İHRAÇ HACMİ",
        motor: "MOTOR / RULESET",
    },
    sections: {
        yoneticiOzeti: "YÖNETİCİ ÖZETİ — DOSYA BİR BAKIŞTA",
        tesisKimligi: "TESİS VE FİRMA KİMLİĞİ",
        register: "KAPSAM VE ÜRÜN REGISTER'I (G / P)",
        emisyon: "EMİSYON HESAPLAMA ÖZETİ (B / D / E)",
        denklik: "KONTROL DENKLİKLERİ",
        maliyet: "MALİYET PROJEKSİYONU",
        veriKalitesi: "VERİ KALİTESİ VE KANIT DURUMU",
        dogrulayici: "DOĞRULAYICI HAZIRLIK DEĞERLENDİRMESİ",
        bulgular: "BULGU KAYDI",
        paketIcerigi: (n) => `PAKET İÇERİĞİ (${n} DOSYA)`,
        butunluk: "BÜTÜNLÜK VE SÜRÜM BİLGİSİ",
        kapsam: "KAPSAM SINIRLARI VE YASAL BİLDİRİM",
        metodoloji: "METODOLOJİ, KAYNAKLAR VE YETKİNLİK",
    },
};
