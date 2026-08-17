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
const sec = (text: string): PdfLine => ({ type: "section", text });
const kv = (key: string, val: string): PdfLine => ({ type: "kv", key, val });
const tblH = (...cols: string[]): PdfLine => ({ type: "table-h", cols });
const tblR = (even: boolean, ...cols: string[]): PdfLine => ({ type: "table-r", cols, even });
const metric = (label: string, value: string): PdfLine => ({ type: "metric", label, value });
const bullet = (text: string): PdfLine => ({ type: "bullet", text });
const note = (text: string): PdfLine => ({ type: "note", text });
const body = (text: string): PdfLine => ({ type: "body", text });
const spacer = (): PdfLine => ({ type: "spacer" });
const divider = (): PdfLine => ({ type: "divider" });

export function buildKapsamliRaporLines(g: KapsamliRaporGirdisi): PdfLine[] {
  const r = hesapla(g);
  const engel = g.findings.filter((f) => f.seviye === "ENGEL").length;
  const uyari = g.findings.filter((f) => f.seviye === "RISK" || f.seviye === "IYILESTIRME").length;
  const L: PdfLine[] = [];

  // ── KAPAK (sayfa 1) ────────────────────────────────────────────────────────
  L.push(
    spacer(),
    metric("SKDM (CBAM) Veri Paketi", "Kapsamli Durum Raporu"),
    spacer(),
    kv("Tesis", g.tesisAdiEN),
    kv("Isletme", g.firma),
    kv("Sektor", `${g.sectorLabel} - UNLOCODE ${g.unlocode}`),
    kv("Raporlama donemi", `01.01.${g.yil} - 31.12.${g.yil} - Ihrac hacmi ${trNum(g.tonaj, 0)} ton`),
    kv("Paket numarasi", g.packageId),
    kv("Motor / Ruleset", `${g.engineVersion} - ${g.rulesetVersion}`),
    spacer(),
    note(`SHA-256: ${g.packageHash}`),
    spacer(),
    note("Bu rapor, muhurlu paketin ozet bilesienidir -- kaynak belgelerin A'dan Z'ye gorununudur."),
  );

  // ── 01 · YÖNETİCİ ÖZETİ ───────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("01 - YONETICI OZETI -- DOSYA BIR BAKISTA"),
    spacer(),
    tblH(`%${g.readinessScore}`, `${engel}`, `${uyari}`, `${SEALED_PACKAGE_FILE_COUNT}`),
    tblR(false, "Hazirlik skoru", "Engelleyici bulgu", "Uyari", "Paket dosyasi"),
    spacer(),
    body(`${g.firma} firmasi adina ${g.tesisAdiEN} tesisi icin ${g.yil} doneminde SKDM veri paketi muhurlenm.`),
    body(`Sektor: ${g.sectorLabel}${r.sadeceDirekt ? " (Annex II -- yalnizca dogrudan emisyon fiyatlandirmasi)." : "."}`),
    spacer(),
    body("One cikan noktalar"),
  );
  if (r.sadeceDirekt) {
    L.push(
      bullet("Toplam gomulu emisyon yalnizca dogrudan (Kapsam 1) emisyonlardan hesaplanmistir -- Annex II geregi elektrik (Kapsam 2) sertifika maliyetine dahil edilmez."),
    );
  } else {
    L.push(bullet("Toplam gomulu emisyon Kapsam 1 + Kapsam 2 olarak hesaplanmistir."));
  }
  L.push(
    bullet(TR_ETS_PILOT_YILLARI.has(g.yil)
      ? "Turkiye'de odenmis bir karbon bedeli bulunmamaktadir; TR-ETS pilot doneminde tesislere %100 ucretsiz tahsisat uygulanir."
      : `TR-ETS mahsup: ${trNum(r.etkinMahsup)} EUR/tCO2e.`),
    bullet(r.denklikSaglandi ? "Uretim denligi (a = b+c+d) saglanmistir." : "Uretim denkligi saglanamamistir -- gozden gecirin."),
  );

  // ── 02 · TESİS KİMLİĞİ ────────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("02 - TESIS VE FIRMA KIMLIGI"),
    spacer(),
    kv("Isletme unvani", g.firma),
    kv("Tesis adi (EN)", g.tesisAdiEN),
    kv("UNLOCODE", g.unlocode),
    kv("Ulke", "Turkiye (TR)"),
    kv("Yetkili temsilci", g.yetkili),
    kv("Sektor", `${g.sectorLabel} -- CN araligi ${g.cnRange}`),
    kv("Raporlama donemi", `01.01.${g.yil} - 31.12.${g.yil}`),
    kv("Ihrac hacmi (bu sevkiyat)", `${trNum(g.tonaj, 0)} ton`),
    spacer(),
    note("Bu bolum, resmi AB Communication Template'in A_InstData sayfasina karsilik gelir."),
  );

  // ── 03 · REGISTER G / P ───────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("03 - KAPSAM VE URUN REGISTER'I (G / P)"),
    spacer(),
    body("Mal kategorileri (G) -- Communication Template A.4(a)"),
    tblH("ID", "Kategori", "CN kodu", "Uretim rotasi"),
  );
  if (g.goods.length === 0) L.push(body("  (kayit yok)"));
  g.goods.forEach((x, i) => L.push(tblR(i % 2 === 0, x.id.toUpperCase(), x.category, x.cn, x.route)));
  if (g.goods.length > 0) {
    L.push(spacer(), body("CN resmi liste (Parameters_CNCodes, 569 kod):"));
    g.goods.forEach((x) => {
      const st = officialCnStatus(x.cn, officialCn.codes);
      L.push(bullet(`${x.cn} -- ${CN_STATUS_TR[st]}`));
    });
  }
  L.push(
    spacer(),
    body("Uretim surecleri (P) -- bubble approach, A.4(b)"),
    tblH("ID", "Surec adi", "Kapsadigi adimlar"),
  );
  if (g.processes.length === 0) L.push(body("  (kayit yok)"));
  g.processes.forEach((x, i) =>
    L.push(tblR(i % 2 === 0, x.id.toUpperCase(), x.name, (x.included || []).join(", ") || "--"))
  );

  // ── 04 · EMİSYON HESAPLAMA ────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("04 - EMISYON HESAPLAMA OZETI (B / D / E)"),
    spacer(),
    body("Kaynak akislari (B_EmInst)"),
    tblH("Yontem", "Kaynak akisi", "Faaliyet verisi", "Surec"),
  );
  if (g.streams.length === 0) L.push(body("  (kayit yok)"));
  g.streams.forEach((s, i) =>
    L.push(tblR(i % 2 === 0,
      s.method,
      s.name,
      `${trNum(s.ad, 0)} ${s.unit}${s.ncv && s.ncv !== "-" ? ` (NCV ${s.ncv})` : ""}`,
      s.processId
    ))
  );
  L.push(
    spacer(),
    body(r.sadeceDirekt ? "Emisyon dengesi -- yalnizca kapsam-ici (Annex II, direkt)" : "Emisyon dengesi:"),
    tblH("Kapsam", "Kaynak", "Emisyon (tCO2e)", "Maliyete giriyor mu?"),
    tblR(false, "Kapsam 1 (direkt)", "Yakma + proses emisyonlari", trNum(g.kapsam1), "Evet"),
    tblR(true, "Kapsam 2 (endirekt)", "Sebeke elektrigi", trNum(g.kapsam2), r.sadeceDirekt ? "Hayir -- Annex II" : "Evet"),
    tblR(false, "TOPLAM (fatura edilen)", "--", trNum(r.faturaEdilenEmisyon), "--"),
    spacer(),
  );
  if (r.sadeceDirekt) {
    L.push(note("Neden Kapsam 2 fatura disi: Regulation (EU) 2023/956 Annex II, bu sektorde yalnizca dogrudan (Kapsam 1) emisyonlarin fiyatlandirilacagini tanimlar."));
  }
  L.push(
    spacer(),
    body("Oncul maddeler (E_PurchPrec)"),
    tblH("Madde", "Toplam", "Tesis ici", "Dis kaynak", "SEE (tCO2e/t)"),
  );
  if (g.precursors.length === 0) L.push(body("  (kayit yok)"));
  g.precursors.forEach((p, i) =>
    L.push(tblR(i % 2 === 0, p.name, `${trNum(p.total, 0)} t`, `${trNum(p.internal, 0)} t`, `${trNum(p.other, 0)} t`, trNum(p.see, 2)))
  );

  // ── 05 · DENKLİK ──────────────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("05 - KONTROL DENKIKLERI"),
    spacer(),
    body("Uretim seviyesi denkligi -- D_Processes (e)"),
    tblH("Bilesen", "Deger (ton)"),
    tblR(false, "(a) Toplam uretim", trNum(g.dProcesses.a, 0)),
    tblR(true, "(b) Pazara / ihracata giden", trNum(g.dProcesses.b, 0)),
    tblR(false, "(c) Tesis ici tuketilen", trNum(g.dProcesses.c, 0)),
    tblR(true, "(d) Stok / diger", trNum(g.dProcesses.d, 0)),
    spacer(),
    body(r.denklikSaglandi
      ? `Kontrol: (b)+(c)+(d) = ${trNum(r.denklikToplam, 0)} -- (a) ile eslesiy`
      : `DIKKAT: (b)+(c)+(d) = ${trNum(r.denklikToplam, 0)} -- (a)=${trNum(g.dProcesses.a, 0)} ile ESLESMIO`),
  );

  // ── 06 · MALİYET ──────────────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("06 - MALIYET PROJEKSIYONU"),
    spacer(),
    note("Asagidaki tutar, aliciinizin (AB'deki ithalatci / yetkilendirilmis beyan sahibi) ustlenecegi tahmini SKDM sertifika maliyetidir. Bu, size kesilen bir fatura degildir."),
    spacer(),
    metric("Alicinin ustlenecegi tahmini maliyet", trEur(r.maliyetEur)),
    spacer(),
    tblH("Kalem", "Deger"),
    tblR(false, `Toplam gomulu emisyon (yalniz Kapsam 1)`, `${trNum(g.kapsam1)} tCO2e`),
    tblR(true, `CBAM faktoru (${g.yil})`, `%${trNum(r.cbamFaktoru * 100, 1)}`),
    tblR(false, "Yukumlu emisyon", `${trNum(r.yukumluEmisyon, 3)} tCO2e`),
    tblR(true, "ETS fiyati (ruleset)", `${g.etsQuarter} -- ${trNum(g.etsPrice, 1)} EUR/tCO2e`),
    tblR(false, "TR ETS mahsup",
      TR_ETS_PILOT_YILLARI.has(g.yil)
        ? "0 EUR -- pilot donemde %100 ucretsiz tahsisat"
        : `${trNum(r.etkinMahsup, 2)} EUR/tCO2e`),
    tblR(true, "Alicinin ustlenecegi tahmini maliyet", trEur(r.maliyetEur)),
    tblR(false, "Ceyreklik asgari elde tutma (%50)", `${trNum(r.ceyreklikTutma, 3)} tCO2e`),
    spacer(),
    note("TR ETS mahsup notu: Turkiye ETS'si 2026-2027 pilot doneminde tesislere %100 ucretsiz tahsisat uyguladigi icin Turk ureticiler icin mahsup edilecek odenmis bir karbon bedeli bulunmamaktadir."),
  );

  // ── 07 · VERİ KALİTESİ ────────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("07 - VERI KALITESI VE KANIT DURUMU"),
    spacer(),
    tblH("Veri kalitesi hiyerarsisi", "Bu dosyada"),
    tblR(false, "1. Dogrudan olcum (sayac / fatura)", "Kaynak akislarinin tamami"),
    tblR(true, "2. Hesaplama (dolayli turetim)", "--"),
    tblR(false, "3. Varsayilan deger (mark-up'li)", "--"),
    spacer(),
    note("Gercek olculmus veri, IR (AB) 2025/2621'deki mark-up'li varsayilan degerlere kiyasla genellikle daha savunulabilir sonuc uretir."),
  );

  // ── 08 · DOĞRULAYICI HAZIRLIK ─────────────────────────────────────────────
  L.push(
    spacer(),
    sec("08 - DOGRULAYICI HAZIRLIK DEGERLENDIRMESI"),
    spacer(),
    note("Akredite dogrulayicinin risk analizinde odaklandigi bes alan (IR 2025/2546) ve bu dosyanin karsilik durumu:"),
    spacer(),
    tblH("Risk alani", "Durum"),
    tblR(false, "Ic kontrol sistemleri", "Alan bazli giris kaydi tuluyor"),
    tblR(true, "Veri yonetim surecleri", "Kaynaktan sisteme izlenebilir zincir mevcut"),
    tblR(false, "Olcum guvenilirligi", "Sayac ve kalibrasyon kayitlari pakette"),
    tblR(true, "Potansiyel yanlis beyan alanlari", r.denklikSaglandi ? "Kontrol denklikleri saglandi" : "DIKKAT: denklik saglanamadi"),
    tblR(false, "Ornekleme stratejisi", `${g.streams.length} kaynak akisi, ${g.precursors.length} oncul madde`),
    spacer(),
    note("Bu degerlendirme bir dogrulama gorusu degildir; dogrulayicinin saha ziyaretinde soracagi sorularin onceden cevaplanmis olmasini saglayan bir hazirlik kontroludur."),
  );

  // ── 09 · BULGULAR ─────────────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("09 - BULGU KAYDI"),
    spacer(),
  );
  if (g.findings.length === 0) {
    L.push(body("Kayda deger bulgu bulunmamaktadir."));
  } else {
    g.findings.forEach((f) => {
      const prefix = f.seviye === "ENGEL" ? "ENGELLIYOR" : f.seviye === "RISK" ? "GOZDEN GECIR" : f.seviye === "IYILESTIRME" ? "IYILESTIRME" : "BILGI";
      L.push(kv(prefix, f.metin));
    });
  }
  L.push(
    spacer(),
    body(engel === 0
      ? "Engelleyici bulgu bulunmamaktadir. Dosya muhUrlemeye hazirdir."
      : "Engelleyici bulgu mevcuttur; muhurleme oncesi giderilmelidir."),
  );

  // ── 10 · PAKET İÇERİĞİ ───────────────────────────────────────────────────
  L.push(
    spacer(),
    sec(`10 - PAKET ICERIGI (${SEALED_PACKAGE_FILE_COUNT} DOSYA)`),
    spacer(),
    tblH("#", "Dosya", "Format", "Kime"),
  );
  const audienceMap: Record<string, string> = {
    "Kapsamli-Durum-Raporu.pdf": "Yonetim + dogrulayici + alici",
    "SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx": "AB alicisi + dogrulayici",
    "Dogrulayici-Calisma-Alani.xlsx": "Dogrulayici",
    "Izleme-Yontem-Plani.pdf": "Dogrulayici",
    "Denetime-Hazirlik-Dosyasi.pdf": "Yonetim + alici",
    "Hesaplama-Izi.json": "Dogrulayici",
    "Kanit-Kayit-Defteri.xlsx": "Dogrulayici",
    "Oncul-Madde-Tedarikci-Beyani.pdf": "Dogrulayici (aliciya gitmez)",
    "Elektrik-ve-Isi-Denge-Raporu.xlsx": "Dogrulayici",
    "De-Minimis-Muafiyet-Kapsam-Beyani.pdf": "Alici",
    "BUTUNLIK-MANIFESTOSU.json": "Tumu",
  };
  SEALED_PACKAGE_FILES.forEach((f, i) => {
    const ext = f.filename.split(".").pop()?.toUpperCase() || "—";
    const audience = audienceMap[f.filename] || "Tumu";
    L.push(tblR(i % 2 === 0, `${i + 1}`, f.filename, ext, audience));
  });
  L.push(
    spacer(),
    note("Madde 9 (Oncul Madde Tedarikci Beyani) ticari sir icerdigi icin yalnizca dogrulayici erisimindedir; AB alicisina iletilen pakette bu belge yer almaz."),
  );

  // ── 11 · BÜTÜNLÜK ─────────────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("11 - BUTUNLUK VE SURUM BILGISI"),
    spacer(),
    kv("Paket numarasi", g.packageId),
    kv("MuhUrleme zamani", trTarih(g.timestamp)),
    kv("Hesaplama motoru", g.engineVersion),
    kv("Mevzuat surumu (ruleset)", g.rulesetVersion),
    kv("CN resmi liste", `Parameters_CNCodes ${officialCn.count} kod -- ${CN_RULESET_VERSION}`),
    spacer(),
    note(`Paket butunluk imzasi: ${g.packageHash}`),
    spacer(),
    body("Bu paket muhUrlendikten sonra icerigi degistirilemez. Duzeltme gerekirse yeni bir surum olusturulur."),
    note("Butunluk imzasi: skdmhesapla.com/dogrula/ adresinden bagimsiz olarak dogrulanabilir."),
  );

  // ── 12 · KAPSAM SINIRLARI ─────────────────────────────────────────────────
  L.push(
    spacer(),
    sec("12 - KAPSAM SINIRLARI VE YASAL BILDIRIM"),
    spacer(),
    body("Bu belge sunlari YAPMAZ:"),
    bullet("AB'ye beyan gondermez -- resmi SKDM beyani yalnizca AB'deki yetkilendirilmis beyan sahibi tarafindan CBAM Registry uzerinden yapilir."),
    bullet("Akredite dogrulama gorusu vermez -- bu degerlendirme bir dogrulayicinin gorusunun yerini tutmaz."),
    bullet("Gumruk onayi veya GTIP karari vermez."),
    bullet("Girilen verilerin dogrulugunu garanti etmez -- veri kullanici tarafindan saglanmistir."),
    spacer(),
    divider(),
    spacer(),
    note("SKDMHesapla, akredite dogrulama gorusu veya gumruk onayi vermez; denetime hazirlik dosyanizi olusturan self-servis yazilimdir."),
  );

  // ── 13 · METODOLOJİ, KAYNAKLAR VE YETKİNLİK ────────────────────────────────
  L.push(
    spacer(),
    sec("13 - METODOLOJI, KAYNAKLAR VE YETKINLIK"),
    spacer(),
    kv("Calculation ID", g.packageId),
    kv("Generated at", trTarih(g.timestamp)),
    kv("Engine version", g.engineVersion),
    kv("Methodology version", "CBAM-2026.08.1"),
    kv("Regulatory snapshot", "2026-08-01"),
    kv("Input dataset version", "2026.1"),
    kv("Emission factor dataset", "IPCC / JRC / TEIAS 2026"),
    kv("Calculation hash", g.packageHash),
    spacer(),
    body("METODOLOJI SORUMLULU GU:"),
    body("Baris Bagirlar -- Urun ve Karbon Hesaplama Metodolojisi Sorumlusu"),
    body("Mesleki egitim: ISO 14064-1 Sera Gazi Emisyon Hesaplama Egitimi"),
    body("Veren kurum: Gaziantep Universitesi / GSO-MEM"),
    spacer(),
    note(`Yetkinligi ve dokuman butunlugunu dogrula: https://skdmhesapla.com/v/${g.packageId}`),
    note("https://skdmhesapla.com/uzmanlik/baris-bagirlar"),
    spacer(),
    note("Kapsam notu: SKDMHesapla hesaplama, veri hazirlama ve dogrulama oncesi calisma altyapisi saglar. Bu dokuman akredite dogrulayici gorusu, resmi CBAM beyani, gumruk karari veya kamu otoritesi onayi degildir."),
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
