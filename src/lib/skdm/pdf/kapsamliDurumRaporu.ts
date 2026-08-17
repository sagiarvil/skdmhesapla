/**
 * 12. paket bileşeni — Kapsamlı Durum Raporu.
 * Tarayıcı + Node ortak: ek bağımlılık yok (Plan 20 seal-binary).
 * Hesaplama: Annex II only-direct + TR-ETS pilot mahsup=0.
 */
import type { SkdmCalculationResult } from "../calculator";
import {
  richPagesToPdfBytes,
  paginateRichLines,
  type PdfLine,
} from "../seal-binary";
import {
  SEALED_PACKAGE_FILE_COUNT,
  SEALED_PACKAGE_FILES,
} from "../package-manifest";
import { ANNEX_II_SADECE_DIREKT } from "../config";
import officialCn from "../../../../data/skdm/parameters-cn-codes.json";
import { officialCnStatus, RULESET_VERSION as CN_RULESET_VERSION } from "../annex-ruleset";

const CN_STATUS_TR: Record<ReturnType<typeof officialCnStatus>, string> = {
  listed: "Resmi 8-hane listede",
  "prefix-only": "Onek eslesti, 8 hane teyit edin",
  out: "Listede yok -- gozden gecirin",
};

/** package-seal SealRegisterSnapshot ile uyumlu — döngüsel import yok. */
export type RaporRegisterSnapshot = {
  goods?: { id: string; category: string; cn: string; route: string }[];
  processes?: { id: string; name: string; included: string[] }[];
  streams?: {
    method: string;
    name: string;
    ad: number;
    unit: string;
    ncv: string;
    processId?: string;
  }[];
  precs?: {
    name: string;
    total: number;
    internal: number;
    other: number;
    source: string;
    see: number;
  }[];
  dProcesses?: { a: number; b: number; c: number; d: number };
  fieldValues?: Record<string, string>;
};

export interface SkdmFinding {
  seviye: "ENGEL" | "RISK" | "IYILESTIRME" | "BILGI";
  metin: string;
}

export interface KapsamliRaporGirdisi {
  packageId: string;
  timestamp: string;
  engineVersion: string;
  rulesetVersion: string;
  sectorId: string;
  sectorLabel: string;
  cnRange: string;
  firma: string;
  tesisAdiEN: string;
  unlocode: string;
  yetkili: string;
  yil: number;
  tonaj: number;
  kapsam1: number;
  kapsam2: number;
  etsQuarter: string;
  etsPrice: number;
  trEtsNetting: number;
  goods: { id: string; category: string; cn: string; route: string }[];
  processes: { id: string; name: string; included: string[] }[];
  streams: {
    method: string;
    name: string;
    ad: number;
    unit: string;
    ncv: string;
    processId: string;
  }[];
  precursors: {
    name: string;
    total: number;
    internal: number;
    other: number;
    source: string;
    see: number;
  }[];
  dProcesses: { a: number; b: number; c: number; d: number };
  findings: SkdmFinding[];
  packageHash: string;
  readinessScore: number;
}

/** @deprecated aluminium yazımı — config SSOT + legacy alias */
const ANNEX_II = new Set([...ANNEX_II_SADECE_DIREKT, "aluminium"]);

export { ANNEX_II_SADECE_DIREKT };

export const CBAM_FAKTORU: Record<number, number> = {
  2026: 0.025,
  2027: 0.05,
  2028: 0.1,
  2029: 0.215,
  2030: 0.325,
  2031: 0.435,
  2032: 0.545,
  2033: 0.655,
  2034: 1.0,
};

export const TR_ETS_PILOT_YILLARI = new Set<number>([2026, 2027]);

export interface HesapSonucu {
  sadeceDirekt: boolean;
  faturaEdilenEmisyon: number;
  kapsam2Gosterim: number;
  cbamFaktoru: number;
  yukumluEmisyon: number;
  etkinMahsup: number;
  mahsupSifirlandi: boolean;
  maliyetEur: number;
  ceyreklikTutma: number;
  denklikSaglandi: boolean;
  denklikToplam: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const round3 = (n: number) => Math.round(n * 1000) / 1000;
const trNum = (n: number, d = 2) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
const trEur = (n: number) =>
  "€" + n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const trTarih = (iso: string) =>
  new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function hesapla(g: KapsamliRaporGirdisi): HesapSonucu {
  const sadeceDirekt = ANNEX_II.has(g.sectorId);
  const faturaEdilenEmisyon = sadeceDirekt ? g.kapsam1 : g.kapsam1 + g.kapsam2;
  const cbamFaktoru = CBAM_FAKTORU[g.yil] ?? 1.0;
  const yukumluEmisyon = round3(faturaEdilenEmisyon * cbamFaktoru);
  const mahsupSifirlandi = TR_ETS_PILOT_YILLARI.has(g.yil) && g.trEtsNetting !== 0;
  const etkinMahsup = TR_ETS_PILOT_YILLARI.has(g.yil) ? 0 : g.trEtsNetting;
  const maliyetEur = round2(yukumluEmisyon * Math.max(0, g.etsPrice - etkinMahsup));
  const denklikToplam = g.dProcesses.b + g.dProcesses.c + g.dProcesses.d;
  const denklikSaglandi = Math.abs(denklikToplam - g.dProcesses.a) < 0.01;
  return {
    sadeceDirekt,
    faturaEdilenEmisyon,
    kapsam2Gosterim: g.kapsam2,
    cbamFaktoru,
    yukumluEmisyon,
    etkinMahsup,
    mahsupSifirlandi,
    maliyetEur,
    ceyreklikTutma: round3(yukumluEmisyon * 0.5),
    denklikSaglandi,
    denklikToplam,
  };
}

export function buildKapsamliRaporGirdisi(
  result: SkdmCalculationResult,
  registers: RaporRegisterSnapshot | undefined,
  meta: {
    packageId: string;
    timestamp: string;
    engineVersion: string;
    rulesetVersion: string;
    packageHash: string;
  }
): KapsamliRaporGirdisi {
  const fv = registers?.fieldValues || {};
  const d = registers?.dProcesses || {
    a: result.productionVolume,
    b: result.productionVolume,
    c: 0,
    d: 0,
  };
  return {
    packageId: meta.packageId,
    timestamp: meta.timestamp,
    engineVersion: meta.engineVersion,
    rulesetVersion: meta.rulesetVersion,
    sectorId: result.sector.id,
    sectorLabel: result.sector.name,
    cnRange: (result.sector.cnCodes || []).join(", "),
    firma: fv.vFirma || "Beyan edilmemiş işletme",
    tesisAdiEN: fv.tesisAdiEN || fv.vFirma || result.sector.name,
    unlocode: fv.unlocode || "—",
    yetkili: fv.yetkili || "—",
    yil: result.year,
    tonaj: result.productionVolume,
    kapsam1: result.scope1TotalEmissions,
    kapsam2: result.scope2TotalEmissions,
    etsQuarter: result.etsQuarter,
    etsPrice: result.euEtsPriceEur,
    trEtsNetting: result.trEtsNettingEur,
    goods: (registers?.goods || []).map((g) => ({
      id: g.id,
      category: g.category,
      cn: g.cn,
      route: g.route,
    })),
    processes: (registers?.processes || []).map((p) => ({
      id: p.id,
      name: p.name,
      included: p.included || [],
    })),
    streams: (registers?.streams || []).map((s) => ({
      method: s.method,
      name: s.name,
      ad: s.ad,
      unit: s.unit,
      ncv: s.ncv,
      processId: s.processId || "",
    })),
    precursors: (registers?.precs || []).map((p) => ({
      name: p.name,
      total: p.total,
      internal: p.internal,
      other: p.other,
      source: p.source,
      see: p.see,
    })),
    dProcesses: d,
    findings: [
      ...(ANNEX_II.has(result.sector.id)
        ? [
            {
              seviye: "BILGI" as const,
              metin:
                "Bu sektörde endirekt emisyon SKDM maliyetine girmez — bilgi amaçlı gösterildi (Annex II).",
            },
          ]
        : []),
      ...(TR_ETS_PILOT_YILLARI.has(result.year)
        ? [
            {
              seviye: "BILGI" as const,
              metin: "TR ETS mahsup alanı 0 — pilot dönem ücretsiz tahsisat kuralı gereği.",
            },
          ]
        : []),
    ],
    packageHash: meta.packageHash,
    readinessScore: result.readinessScore,
  };
}

/** PdfLine yardımcıları */
const sec = (text: string, num?: string): PdfLine => ({ type: "section", text, num });
const kv = (key: string, val: string): PdfLine => ({ type: "kv", key, val });
const tblH = (cols: string[], widths?: number[], right?: number[]): PdfLine => ({
  type: "table-h",
  cols,
  widths,
  right,
});
const tblR = (even: boolean, cols: string[], widths?: number[], right?: number[]): PdfLine => ({
  type: "table-r",
  cols,
  even,
  widths,
  right,
});
const metric = (label: string, value: string): PdfLine => ({ type: "metric", label, value });
const kpiRow = (cards: { label: string; value: string; accent?: boolean }[]): PdfLine => ({
  type: "kpi-row",
  cards,
});
const bullet = (text: string): PdfLine => ({ type: "bullet", text });
const note = (text: string): PdfLine => ({ type: "note", text });
const body = (text: string): PdfLine => ({ type: "body", text });
const spacer = (size?: number): PdfLine => ({ type: "spacer", size });
const divider = (): PdfLine => ({ type: "divider" });
const pageBreak = (): PdfLine => ({ type: "page-break" });
const cover = (
  title: string,
  subtitle: string,
  badge: string,
  facts: { key: string; val: string }[]
): PdfLine => ({ type: "cover", title, subtitle, badge, facts });

export function buildKapsamliRaporLines(g: KapsamliRaporGirdisi): PdfLine[] {
  const r = hesapla(g);
  const engel = g.findings.filter((f) => f.seviye === "ENGEL").length;
  const uyari = g.findings.filter((f) => f.seviye === "RISK" || f.seviye === "IYILESTIRME").length;
  const L: PdfLine[] = [];

  // ── KAPAK (sayfa 1) ────────────────────────────────────────────────────────
  L.push(
    cover(
      "KAPSAMLI DURUM RAPORU",
      "SKDM (CBAM) Veri Paketi — A'dan Z'ye Tam Görünüm",
      g.packageId,
      [
        { key: "TESİS", val: g.tesisAdiEN },
        { key: "İŞLETME", val: g.firma },
        { key: "SEKTÖR", val: `${g.sectorLabel} · ${g.unlocode}` },
        { key: "RAPORLAMA DÖNEMİ", val: `01.01.${g.yil} – 31.12.${g.yil}` },
        { key: "İHRAC HACMİ", val: `${trNum(g.tonaj, 0)} ton` },
        { key: "MOTOR / RULESET", val: `${g.engineVersion} · ${g.rulesetVersion}` },
      ]
    ),
    spacer(6),
    note(`Paket bütünlük imzası: ${g.packageHash}`),
    note("Bu rapor, mühürlü paketin özet bileşenidir — kaynak belgelerin A'dan Z'ye görünümüdür."),
    pageBreak()
  );

  // ── 01 · YÖNETİCİ ÖZETİ ───────────────────────────────────────────────────
  L.push(
    sec("YÖNETİCİ ÖZETİ — DOSYA BİR BAKIŞTA", "01"),
    spacer(8),
    kpiRow([
      { label: "Hazırlık skoru", value: `%${g.readinessScore}`, accent: true },
      { label: "Engelleyici bulgu", value: `${engel}` },
      { label: "Uyarı", value: `${uyari}` },
      { label: "Paket dosyası", value: `${SEALED_PACKAGE_FILE_COUNT}` },
    ]),
    spacer(8),
    body(`${g.firma} firması adına ${g.tesisAdiEN} tesisi için ${g.yil} döneminde SKDM veri paketi mühürlenmiştir.`),
    body(`Sektör: ${g.sectorLabel}${r.sadeceDirekt ? " (Annex II — yalnızca doğrudan emisyon fiyatlandırması)." : "."}`),
    spacer(6),
    body("Öne çıkan noktalar"),
  );
  if (r.sadeceDirekt) {
    L.push(
      bullet("Toplam gömülü emisyon yalnızca doğrudan (Kapsam 1) emisyonlardan hesaplanmıştır — Annex II gereği elektrik (Kapsam 2) sertifika maliyetine dahil edilmez."),
    );
  } else {
    L.push(bullet("Toplam gömülü emisyon Kapsam 1 + Kapsam 2 olarak hesaplanmıştır."));
  }
  L.push(
    bullet(TR_ETS_PILOT_YILLARI.has(g.yil)
      ? "Türkiye'de ödenmiş bir karbon bedeli bulunmamaktadır; TR-ETS pilot döneminde tesislere %100 ücretsiz tahsisat uygulanır."
      : `TR-ETS mahsup: ${trNum(r.etkinMahsup)} EUR/tCO2e.`),
    bullet(r.denklikSaglandi ? "Üretim denkliği (a = b+c+d) sağlanmıştır." : "Üretim denkliği sağlanamamıştır — gözden geçirin."),
  );

  // ── 02 · TESİS KİMLİĞİ ────────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("TESİS VE FİRMA KİMLİĞİ", "02"),
    spacer(8),
    kv("İşletme unvanı", g.firma),
    kv("Tesis adı (EN)", g.tesisAdiEN),
    kv("UNLOCODE", g.unlocode),
    kv("Ülke", "Türkiye (TR)"),
    kv("Yetkili temsilci", g.yetkili),
    kv("Sektör", `${g.sectorLabel} — CN aralığı ${g.cnRange}`),
    kv("Raporlama dönemi", `01.01.${g.yil} – 31.12.${g.yil}`),
    kv("İhraç hacmi (bu sevkiyat)", `${trNum(g.tonaj, 0)} ton`),
    spacer(6),
    note("Bu bölüm, resmi AB Communication Template'in A_InstData sayfasına karşılık gelir."),
  );

  // ── 03 · REGISTER G / P ───────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("KAPSAM VE ÜRÜN REGISTER'I (G / P)", "03"),
    spacer(8),
    body("Mal kategorileri (G) — Communication Template A.4(a)"),
    tblH(["ID", "Kategori", "CN kodu", "Üretim rotası"], [0.5, 2.2, 1.3, 1]),
  );
  if (g.goods.length === 0) L.push(body("  (kayıt yok)"));
  g.goods.forEach((x, i) =>
    L.push(tblR(i % 2 === 0, [x.id.toUpperCase(), x.category, x.cn, x.route], [0.5, 2.2, 1.3, 1]))
  );
  if (g.goods.length > 0) {
    L.push(spacer(6), body("CN resmi liste (Parameters_CNCodes, 569 kod):"));
    g.goods.forEach((x) => {
      const st = officialCnStatus(x.cn, officialCn.codes);
      L.push(bullet(`${x.cn} — ${CN_STATUS_TR[st]}`));
    });
  }
  L.push(
    spacer(8),
    body("Üretim süreçleri (P) — bubble approach, A.4(b)"),
    tblH(["ID", "Süreç adı", "Kapsadığı adımlar"], [0.5, 1.8, 2.4]),
  );
  if (g.processes.length === 0) L.push(body("  (kayıt yok)"));
  g.processes.forEach((x, i) =>
    L.push(tblR(i % 2 === 0, [x.id.toUpperCase(), x.name, (x.included || []).join(", ") || "--"], [0.5, 1.8, 2.4]))
  );

  // ── 04 · EMİSYON HESAPLAMA ────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("EMİSYON HESAPLAMA ÖZETİ (B / D / E)", "04"),
    spacer(8),
    body("Kaynak akışları (B_EmInst)"),
    tblH(["Yöntem", "Kaynak akışı", "Faaliyet verisi", "Süreç"], [1.1, 1.8, 1.6, 0.6]),
  );
  if (g.streams.length === 0) L.push(body("  (kayıt yok)"));
  g.streams.forEach((s, i) =>
    L.push(tblR(i % 2 === 0,
      [s.method, s.name, `${trNum(s.ad, 0)} ${s.unit}${s.ncv && s.ncv !== "-" ? ` (NCV ${s.ncv})` : ""}`, s.processId],
      [1.1, 1.8, 1.6, 0.6]
    ))
  );
  L.push(
    spacer(8),
    body(r.sadeceDirekt ? "Emisyon dengesi — yalnızca kapsam-içi (Annex II, direkt)" : "Emisyon dengesi:"),
    tblH(["Kapsam", "Kaynak", "Emisyon (tCO2e)", "Maliyete giriyor mu?"], [1.1, 1.6, 0.9, 1], [2]),
    tblR(false, ["Kapsam 1 (direkt)", "Yakma + proses emisyonları", trNum(g.kapsam1), "Evet"], [1.1, 1.6, 0.9, 1], [2]),
    tblR(true, ["Kapsam 2 (endirekt)", "Şebeke elektriği", trNum(g.kapsam2), r.sadeceDirekt ? "Hayır — Annex II" : "Evet"], [1.1, 1.6, 0.9, 1], [2]),
    tblR(false, ["TOPLAM (fatura edilen)", "—", trNum(r.faturaEdilenEmisyon), "—"], [1.1, 1.6, 0.9, 1], [2]),
  );
  if (r.sadeceDirekt) {
    L.push(spacer(6), note("Neden Kapsam 2 fatura dışı: Regulation (EU) 2023/956 Annex II, bu sektörde yalnızca doğrudan (Kapsam 1) emisyonların fiyatlandırılacağını tanımlar."));
  }
  L.push(
    spacer(8),
    body("Öncül maddeler (E_PurchPrec)"),
    tblH(["Madde", "Toplam", "Tesis içi", "Dış kaynak", "SEE (tCO2e/t)"], [1.8, 0.8, 0.8, 0.8, 0.9], [1, 2, 3, 4]),
  );
  if (g.precursors.length === 0) L.push(body("  (kayıt yok)"));
  g.precursors.forEach((p, i) =>
    L.push(tblR(i % 2 === 0, [p.name, `${trNum(p.total, 0)} t`, `${trNum(p.internal, 0)} t`, `${trNum(p.other, 0)} t`, trNum(p.see, 2)], [1.8, 0.8, 0.8, 0.8, 0.9], [1, 2, 3, 4]))
  );

  // ── 05 · DENKLİK ──────────────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("KONTROL DENKLİKLERİ", "05"),
    spacer(8),
    body("Üretim seviyesi denkliği — D_Processes (e)"),
    tblH(["Bileşen", "Değer (ton)"], [3, 1.2], [1]),
    tblR(false, ["(a) Toplam üretim", trNum(g.dProcesses.a, 0)], [3, 1.2], [1]),
    tblR(true, ["(b) Pazara / ihracata giden", trNum(g.dProcesses.b, 0)], [3, 1.2], [1]),
    tblR(false, ["(c) Tesis içi tüketilen", trNum(g.dProcesses.c, 0)], [3, 1.2], [1]),
    tblR(true, ["(d) Stok / diğer", trNum(g.dProcesses.d, 0)], [3, 1.2], [1]),
    spacer(6),
    body(r.denklikSaglandi
      ? `Kontrol: (b)+(c)+(d) = ${trNum(r.denklikToplam, 0)} — (a) ile eşleşiyor`
      : `DİKKAT: (b)+(c)+(d) = ${trNum(r.denklikToplam, 0)} — (a)=${trNum(g.dProcesses.a, 0)} ile EŞLEŞMİYOR`),
  );

  // ── 06 · MALİYET ──────────────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("MALİYET PROJEKSİYONU", "06"),
    spacer(8),
    note("Aşağıdaki tutar, alıcınızın (AB'deki ithalatçı / yetkilendirilmiş beyan sahibi) üstleneceği tahmini SKDM sertifika maliyetidir. Bu, size kesilen bir fatura değildir."),
    spacer(10),
    metric("Alıcının üstleneceği tahmini maliyet", trEur(r.maliyetEur)),
    spacer(8),
    tblH(["Kalem", "Değer"], [2.4, 1.6], [1]),
    tblR(false, ["Toplam gömülü emisyon (yalnız Kapsam 1)", `${trNum(g.kapsam1)} tCO2e`], [2.4, 1.6], [1]),
    tblR(true, [`CBAM faktörü (${g.yil})`, `%${trNum(r.cbamFaktoru * 100, 1)}`], [2.4, 1.6], [1]),
    tblR(false, ["Yükümlü emisyon", `${trNum(r.yukumluEmisyon, 3)} tCO2e`], [2.4, 1.6], [1]),
    tblR(true, ["ETS fiyatı (ruleset)", `${g.etsQuarter} — ${trNum(g.etsPrice, 1)} EUR/tCO2e`], [2.4, 1.6]),
    tblR(false, ["TR ETS mahsup",
      TR_ETS_PILOT_YILLARI.has(g.yil)
        ? "0 EUR — pilot dönemde %100 ücretsiz tahsisat"
        : `${trNum(r.etkinMahsup, 2)} EUR/tCO2e`], [2.4, 1.6], [1]),
    tblR(true, ["Alıcının üstleneceği tahmini maliyet", trEur(r.maliyetEur)], [2.4, 1.6], [1]),
    tblR(false, ["Çeyreklik asgari elde tutma (%50)", `${trNum(r.ceyreklikTutma, 3)} tCO2e`], [2.4, 1.6], [1]),
    spacer(6),
    note("TR ETS mahsup notu: Türkiye ETS'si 2026-2027 pilot döneminde tesislere %100 ücretsiz tahsisat uyguladığı için Türk üreticiler için mahsup edilecek ödenmiş bir karbon bedeli bulunmamaktadır."),
  );

  // ── 07 · VERİ KALİTESİ ────────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("VERİ KALİTESİ VE KANIT DURUMU", "07"),
    spacer(8),
    tblH(["Veri kalitesi hiyerarşisi", "Bu dosyada"], [1.8, 1.6]),
    tblR(false, ["1. Doğrudan ölçüm (sayaç / fatura)", "Kaynak akışlarının tamamı"], [1.8, 1.6]),
    tblR(true, ["2. Hesaplama (dolaylı türetim)", "—"], [1.8, 1.6]),
    tblR(false, ["3. Varsayılan değer (mark-up'lı)", "—"], [1.8, 1.6]),
    spacer(6),
    note("Gerçek ölçülmüş veri, IR (AB) 2025/2621'deki mark-up'lı varsayılan değerlere kıyasla genellikle daha savunulabilir sonuç üretir."),
  );

  // ── 08 · DOĞRULAYICI HAZIRLIK ─────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("DOĞRULAYICI HAZIRLIK DEĞERLENDİRMESİ", "08"),
    spacer(8),
    note("Akredite doğrulayıcının risk analizinde odaklandığı beş alan (IR 2025/2546) ve bu dosyanın karşılık durumu:"),
    spacer(6),
    tblH(["Risk alanı", "Durum"], [1.6, 1.8]),
    tblR(false, ["İç kontrol sistemleri", "Alan bazlı giriş kaydı tutuluyor"], [1.6, 1.8]),
    tblR(true, ["Veri yönetim süreçleri", "Kaynaktan sisteme izlenebilir zincir mevcut"], [1.6, 1.8]),
    tblR(false, ["Ölçüm güvenilirliği", "Sayaç ve kalibrasyon kayıtları pakette"], [1.6, 1.8]),
    tblR(true, ["Potansiyel yanlış beyan alanları", r.denklikSaglandi ? "Kontrol denklikleri sağlandı" : "DİKKAT: denklik sağlanamadı"], [1.6, 1.8]),
    tblR(false, ["Örnekleme stratejisi", `${g.streams.length} kaynak akışı, ${g.precursors.length} öncül madde`], [1.6, 1.8]),
    spacer(6),
    note("Bu değerlendirme bir doğrulama görüşü değildir; doğrulayıcının saha ziyaretinde soracağı soruların önceden cevaplanmış olmasını sağlayan bir hazırlık kontrolüdür."),
  );

  // ── 09 · BULGULAR ─────────────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("BULGU KAYDI", "09"),
    spacer(8),
  );
  if (g.findings.length === 0) {
    L.push(body("Kayda değer bulgu bulunmamaktadır."));
  } else {
    g.findings.forEach((f) => {
      const prefix = f.seviye === "ENGEL" ? "ENGELLİYOR" : f.seviye === "RISK" ? "GÖZDEN GEÇİR" : f.seviye === "IYILESTIRME" ? "İYİLEŞTİRME" : "BİLGİ";
      L.push(kv(prefix, f.metin));
    });
  }
  L.push(
    spacer(6),
    body(engel === 0
      ? "Engelleyici bulgu bulunmamaktadır. Dosya mühürlemeye hazırdır."
      : "Engelleyici bulgu mevcuttur; mühürleme öncesi giderilmelidir."),
  );

  // ── 10 · PAKET İÇERİĞİ ───────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec(`PAKET İÇERİĞİ (${SEALED_PACKAGE_FILE_COUNT} DOSYA)`, "10"),
    spacer(8),
    tblH(["#", "Dosya", "Format", "Kime"], [0.3, 2.6, 0.7, 1.6]),
  );
  const audienceMap: Record<string, string> = {
    "Kapsamli-Durum-Raporu.pdf": "Yönetim + doğrulayıcı + alıcı",
    "SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx": "AB alıcısı + doğrulayıcı",
    "Dogrulayici-Calisma-Alani.xlsx": "Doğrulayıcı",
    "Izleme-Yontem-Plani.pdf": "Doğrulayıcı",
    "Denetime-Hazirlik-Dosyasi.pdf": "Yönetim + alıcı",
    "Hesaplama-Izi.json": "Doğrulayıcı",
    "Kanit-Kayit-Defteri.xlsx": "Doğrulayıcı",
    "Oncul-Madde-Tedarikci-Beyani.pdf": "Doğrulayıcı (alıcıya gitmez)",
    "Elektrik-ve-Isi-Denge-Raporu.xlsx": "Doğrulayıcı",
    "De-Minimis-Muafiyet-Kapsam-Beyani.pdf": "Alıcı",
    "BUTUNLIK-MANIFESTOSU.json": "Tümü",
  };
  SEALED_PACKAGE_FILES.forEach((f, i) => {
    const ext = f.filename.split(".").pop()?.toUpperCase() || "—";
    const audience = audienceMap[f.filename] || "Tümü";
    L.push(tblR(i % 2 === 0, [`${i + 1}`, f.filename, ext, audience], [0.3, 2.6, 0.7, 1.6]));
  });
  L.push(
    spacer(6),
    note("Madde 9 (Öncül Madde Tedarikçi Beyanı) ticari sır içerdiği için yalnızca doğrulayıcı erişimindedir; AB alıcısına iletilen pakette bu belge yer almaz."),
  );

  // ── 11 · BÜTÜNLÜK ─────────────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("BÜTÜNLÜK VE SÜRÜM BİLGİSİ", "11"),
    spacer(8),
    kv("Paket numarası", g.packageId),
    kv("Mühürleme zamanı", trTarih(g.timestamp)),
    kv("Hesaplama motoru", g.engineVersion),
    kv("Mevzuat sürümü (ruleset)", g.rulesetVersion),
    kv("CN resmi liste", `Parameters_CNCodes ${officialCn.count} kod — ${CN_RULESET_VERSION}`),
    spacer(6),
    note(`Paket bütünlük imzası: ${g.packageHash}`),
    spacer(6),
    body("Bu paket mühürlendikten sonra içeriği değiştirilemez. Düzeltme gerekirse yeni bir sürüm oluşturulur."),
    note("Bütünlük imzası: skdmhesapla.com/dogrula/ adresinden bağımsız olarak doğrulanabilir."),
  );

  // ── 12 · KAPSAM SINIRLARI ─────────────────────────────────────────────────
  L.push(
    spacer(10),
    sec("KAPSAM SINIRLARI VE YASAL BİLDİRİM", "12"),
    spacer(8),
    body("Bu belge şunları YAPMAZ:"),
    bullet("AB'ye beyan göndermez — resmi SKDM beyanı yalnızca AB'deki yetkilendirilmiş beyan sahibi tarafından CBAM Registry üzerinden yapılır."),
    bullet("Akredite doğrulama görüşü vermez — bu değerlendirme bir doğrulayıcının görüşünün yerini tutmaz."),
    bullet("Gümrük onayı veya GTİP kararı vermez."),
    bullet("Girilen verilerin doğruluğunu garanti etmez — veri kullanıcı tarafından sağlanmıştır."),
    spacer(6),
    divider(),
    spacer(6),
    note("SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır."),
  );

  // ── 13 · METODOLOJİ, KAYNAKLAR VE YETKİNLİK ────────────────────────────────
  L.push(
    spacer(10),
    sec("METODOLOJİ, KAYNAKLAR VE YETKİNLİK", "13"),
    spacer(8),
    kv("Calculation ID", g.packageId),
    kv("Generated at", trTarih(g.timestamp)),
    kv("Engine version", g.engineVersion),
    kv("Methodology version", "CBAM-2026.08.1"),
    kv("Regulatory snapshot", "2026-08-01"),
    kv("Input dataset version", "2026.1"),
    kv("Emission factor dataset", "IPCC / JRC / TEIAS 2026"),
    kv("Calculation hash", g.packageHash),
    spacer(6),
    body("METODOLOJİ SORUMLULUĞU:"),
    body("Barış Bağırlar — Ürün ve Karbon Hesaplama Metodolojisi Sorumlusu"),
    body("Mesleki eğitim: ISO 14064-1 Sera Gazı Emisyon Hesaplama Eğitimi"),
    body("Veren kurum: Gaziantep Üniversitesi / GSO-MEM"),
    spacer(6),
    note(`Yetkinliği ve doküman bütünlüğünü doğrula: https://skdmhesapla.com/v/${g.packageId}`),
    note("https://skdmhesapla.com/uzmanlik/baris-bagirlar"),
    spacer(6),
    note("Kapsam notu: SKDMHesapla hesaplama, veri hazırlama ve doğrulama öncesi çalışma altyapısı sağlar. Bu doküman akredite doğrulayıcı görüşü, resmi CBAM beyanı, gümrük kararı veya kamu otoritesi onayı değildir."),
  );

  return L;
}

/** Gövde metni — doğrulama testi için (PDF body yorumu) */
export function buildKapsamliDurumRaporuText(g: KapsamliRaporGirdisi): string {
  const r = hesapla(g);
  const engel = g.findings.filter((f) => f.seviye === "ENGEL").length;
  const uyari = g.findings.filter((f) => f.seviye === "RISK" || f.seviye === "IYILESTIRME").length;
  return [
    "KAPSAMLI DURUM RAPORU",
    "SKDM (CBAM) Veri Paketi -- A'dan Z'ye Tam Gorunum",
    `Paket: ${g.packageId}`,
    `Tesis: ${g.tesisAdiEN}`,
    `Isletme: ${g.firma}`,
    `Sektor: ${g.sectorLabel}  UNLOCODE: ${g.unlocode}`,
    `Donem: 01.01.${g.yil} - 31.12.${g.yil}  Ihrac: ${g.tonaj} ton`,
    `Hazirlik: %${g.readinessScore}  Engel: ${engel}  Uyari: ${uyari}  Dosya: ${SEALED_PACKAGE_FILE_COUNT}`,
    "YÖNETİCİ ÖZETİ",
    `Annex II: ${r.sadeceDirekt ? "yalniz Kapsam 1" : "Kapsam 1+2"}`,
    `Fatura edilen emisyon: ${r.faturaEdilenEmisyon} tCO2e`,
    `Maliyet: ${trEur(r.maliyetEur)}`,
    `Hash: ${g.packageHash}`,
  ].join("\n");
}

export function kapsamliDurumRaporuPdfBytes(g: KapsamliRaporGirdisi): Uint8Array {
  const lines = buildKapsamliRaporLines(g);
  const pages = paginateRichLines(lines);
  const plainBody = buildKapsamliDurumRaporuText(g);
  return richPagesToPdfBytes(
    pages,
    {
      title: "SKDMHESAPLA  |  KAPSAMLI DURUM RAPORU",
      footer: `${g.packageId}  |  skdmhesapla.com/dogrula/`,
    },
    plainBody
  );
}
