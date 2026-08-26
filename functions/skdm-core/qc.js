"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSkdmQc = runSkdmQc;
exports.checkDProcessesEquality = checkDProcessesEquality;
exports.checkEPurchPrecEquality = checkEPurchPrecEquality;
exports.checkTaxIdField = checkTaxIdField;
exports.checkRegisterCore = checkRegisterCore;
exports.hasBlockingQc = hasBlockingQc;
exports.computeConsistencyScore = computeConsistencyScore;
exports.countQcSeverities = countQcSeverities;
exports.runFullQc = runFullQc;
/**
 * Fail-closed QC katmanı.
 * Blocking / warning / note — motor çıktısına ek denetimler.
 * G-23: kırmızı yok; amber uyarı + "tamamlanmadı / gözden geçirin" dili.
 */
const tax_id_1 = require("./tax-id");
function runSkdmQc(input) {
    const findings = [];
    if (input.productionVolume <= 0) {
        findings.push({
            code: "VOLUME_ZERO",
            severity: "blocking",
            message: "Sevkiyat hacmi tamamlanmadı — sıfır veya negatif olamaz; girdiyi gözden geçirin.",
        });
    }
    if (input.sectorId === "iron-steel" && input.totalEmissionIntensity > 20) {
        findings.push({
            code: "INTENSITY_OUTLIER",
            severity: "warning",
            message: "Emisyon yoğunluğu sektör aralığının dışında görünüyor; girdileri gözden geçirin.",
        });
    }
    return findings;
}
/** D_Processes (e): a = b + c + d (G-kapısı). */
function checkDProcessesEquality(input) {
    if (input.a <= 0)
        return null;
    const sum = input.b + input.c + input.d;
    if (Math.abs(sum - input.a) < 0.01)
        return null;
    return {
        code: "D_PROCESSES_BALANCE",
        severity: "blocking",
        message: `Üretim seviyesi denklemi tamamlanmadı: (b+c+d)=${sum} ≠ (a)=${input.a}. Mühürleme engelli — değerleri gözden geçirin.`,
    };
}
/**
 * E_PurchPrec denkliği: satırda total > 0 ise total = internal + other.
 * (Resmi şablon dağılım kontrolü — aşım veya eksik pay mühürlemeyi engeller.)
 */
function checkEPurchPrecEquality(rows) {
    for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (r.total <= 0)
            continue;
        const sum = r.internal + r.other;
        if (Math.abs(sum - r.total) >= 0.01) {
            return {
                code: "E_PURCHPREC_BALANCE",
                severity: "blocking",
                message: `Öncül madde #${i + 1} dağılımı tamamlanmadı: iç+diğer (${sum}) ≠ toplam (${r.total}). Mühürleme engelli — gözden geçirin.`,
            };
        }
    }
    return null;
}
/**
 * GATE-M1 — VKN / vergi kimlik numarası format + checksum denetimi (RM-005).
 * Tüzel kişi unvanı taşıyan kayıt yalnızca 10 haneli VKN kabul eder;
 * 11 haneli değer TC Kimlik No'dur ve tüzel kişi için engelleyici bulgudur.
 * G-23: metinlerde "hata/red/başarısız/geçersiz" kelimeleri kullanılmaz.
 */
function checkTaxIdField(title, taxId, tur, isletmeTuruDegeri) {
    const temiz = String(taxId || "").trim();
    const findings = [];
    // GATE-1 (RM-007): işletme türü seçilmeden devam edilemez — alan dolu olsa bile
    // seçim boşsa hangi biçimin geçerli olduğu bilinemez.
    if (isletmeTuruDegeri !== undefined && isletmeTuruDegeri !== "turel" && isletmeTuruDegeri !== "sahis") {
        findings.push({
            code: "TAX_ID_BIZ_TYPE_MISSING",
            severity: "blocking",
            message: "İşletme türü seçilmedi — tüzel firma için 10 haneli VKN, şahıs firması için 11 haneli T.C. kimlik numarası geçerlidir. Seçim yapılmadan bu alan tamamlanamaz.",
        });
    }
    // GATE-1 (RM-007): alan zorunlu — boş bırakılamaz.
    if (!temiz) {
        return [
            ...findings,
            {
                code: "TAX_ID_MISSING",
                severity: "blocking",
                message: "Vergi kimlik numarası girilmedi — tüzel kişi için 10 haneli VKN, şahıs firması için 11 haneli T.C. kimlik numarasıdır. Bu alan dosyanın kimlik sayfasını tamamlar.",
            },
        ];
    }
    // GATE-1 (RM-007): unvan tüzel kişi ibaresi taşıyorken "şahıs firması" seçimi çelişkilidir.
    if ((0, tax_id_1.isletmeTuruUnvanCeliski)(title, tur)) {
        findings.push({
            code: "TAX_ID_TITLE_TYPE_CONFLICT",
            severity: "blocking",
            message: "Unvanınızda tüzel kişi ibaresi geçiyor ama şahıs firması seçtiniz. Bunlardan biri yanlış olabilir — kontrol eder misiniz?",
        });
    }
    const denetim = (0, tax_id_1.denetleVergiKimlikNo)(title, taxId, tur);
    if (denetim.ok)
        return findings;
    switch (denetim.durum.durum) {
        case "turel-11-hane":
            findings.push({
                code: "TAX_ID_TUREL_11_HANE",
                severity: "blocking",
                message: "Tüzel kişi unvanı ile 11 haneli numara eşleşmiyor — tüzel kişinin vergi kimlik numarası 10 hanelidir; 11 haneli değer gerçek kişi kimlik numarası olabilir. Gözden geçirin.",
            });
            break;
        case "sahis-10-hane":
            findings.push({
                code: "TAX_ID_SAHIS_10_HANE",
                severity: "blocking",
                message: "Şahıs firması için 10 haneli değer eşleşmiyor — gerçek kişi kimlik numarası 11 hanelidir; 10 haneli değer tüzel kişi VKN'si olabilir. Gözden geçirin.",
            });
            break;
        case "checksum":
            findings.push({
                code: "TAX_ID_CHECKSUM",
                severity: "blocking",
                message: "Vergi kimlik numarası kontrol hanesi doğrulanamıyor — numarayı vergi levhasından teyit edin. Gözden geçirin.",
            });
            break;
        case "uzunluk":
            findings.push({
                code: "TAX_ID_LENGTH",
                severity: "blocking",
                message: "Vergi kimlik numarası tamamlanmadı — tüzel kişi için 10, şahıs firması için 11 haneli olmalıdır. Gözden geçirin.",
            });
            break;
        default:
            break;
    }
    return findings;
}
/** Katman 3–4 register tamamlık — mühür öncesi. */
function checkRegisterCore(input) {
    const out = [];
    if (input.processes.length > 10) {
        out.push({
            code: "P_OVER_MAX",
            severity: "blocking",
            message: "Üretim süreçleri P1–P10 ile sınırlıdır (en fazla 10). Fazla satırları gözden geçirin.",
        });
    }
    if (input.goodsCount > 0 && input.processes.length === 0) {
        out.push({
            code: "P_MISSING",
            severity: "blocking",
            message: "Mal kategorisi var ama üretim süreci (P) tamamlanmadı — Katman 3'ü gözden geçirin.",
        });
    }
    for (const p of input.processes) {
        if (!p.name.trim()) {
            out.push({
                code: "P_NAME_EMPTY",
                severity: "blocking",
                message: `${p.id} süreç adı tamamlanmadı — gözden geçirin.`,
            });
            break;
        }
        if (input.goodsCount > 0 && p.included.length === 0) {
            out.push({
                code: "P_BUBBLE_EMPTY",
                severity: "blocking",
                message: `${p.id} bubble approach: kapsanan kategori seçilmedi — gözden geçirin.`,
            });
            break;
        }
    }
    if (input.streams.length === 0) {
        out.push({
            code: "B_STREAM_MISSING",
            severity: "blocking",
            message: "B_EmInst kaynak akışı tamamlanmadı — Katman 4'ü gözden geçirin.",
        });
    }
    for (let i = 0; i < input.streams.length; i++) {
        const s = input.streams[i];
        if (!s.name.trim() || s.ad <= 0) {
            out.push({
                code: "B_STREAM_INCOMPLETE",
                severity: "blocking",
                message: `Kaynak akışı #${i + 1} adı/faaliyet verisi tamamlanmadı — gözden geçirin.`,
            });
            break;
        }
        if (s.method === "Combustion" && !s.ncv.trim()) {
            out.push({
                code: "B_NCV_REQUIRED",
                severity: "blocking",
                message: `Kaynak akışı #${i + 1} Combustion için NCV tamamlanmadı — gözden geçirin.`,
            });
            break;
        }
    }
    return out;
}
function hasBlockingQc(findings) {
    return findings.some((f) => f.severity === "blocking");
}
/**
 * GATE-P (RM-006): Tutarlılık bileşeni — mutabakat/QC kontrollerinin skor karşılığı.
 * - Engelleyici bulgu varsa tutarlılık 40 (mühürleme engelli).
 * - Yalnızca uyarı varsa 90 (gözden geçirin).
 * - Temizse 100.
 */
function computeConsistencyScore(findings) {
    const blocking = findings.some((f) => f.severity === "blocking");
    if (blocking)
        return 40;
    const warnings = findings.some((f) => f.severity === "warning");
    if (warnings)
        return 90;
    return 100;
}
/** Bulgu sayımı — rapor ve arayüz için tek kaynak. */
function countQcSeverities(findings) {
    return {
        blocking: findings.filter((f) => f.severity === "blocking").length,
        warning: findings.filter((f) => f.severity === "warning").length,
        note: findings.filter((f) => f.severity === "note").length,
    };
}
/** Sihirbaz ve PDF raporunun aynı QC bileşimini kullanması için tek kaynak (INV-5). */
function runFullQc(input) {
    const reg = input.registers || {};
    const dFinding = reg.dProcesses ? checkDProcessesEquality(reg.dProcesses) : null;
    const eFinding = reg.precs ? checkEPurchPrecEquality(reg.precs) : null;
    return [
        ...runSkdmQc({
            productionVolume: input.result.productionVolume,
            totalEmissionIntensity: input.result.totalEmissionIntensity,
            sectorId: input.result.sectorId,
        }),
        ...(dFinding ? [dFinding] : []),
        ...(eFinding ? [eFinding] : []),
        ...checkRegisterCore({
            goodsCount: reg.goodsCount || 0,
            processes: reg.processes || [],
            streams: reg.streams || [],
        }),
        ...checkTaxIdField(reg.fieldValues?.tesisAdiTR || reg.fieldValues?.vFirma, reg.fieldValues?.vkn, reg.fieldValues?.isletmeTuru === "turel" || reg.fieldValues?.isletmeTuru === "sahis"
            ? reg.fieldValues.isletmeTuru
            : undefined, reg.fieldValues?.isletmeTuru),
    ];
}
