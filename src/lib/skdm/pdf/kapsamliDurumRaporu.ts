/**
 * 12. paket bileşeni — Kapsamlı Durum Raporu.
 * Tarayıcı + Node ortak: ek bağımlılık yok (Plan 20 seal-binary).
 * Hesaplama: Annex II only-direct + TR-ETS pilot mahsup=0.
 */
import type { SkdmCalculationResult } from "../calculator";
import { textToMultiPagePdfBytes } from "../seal-binary";

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

export const ANNEX_II_SADECE_DIREKT = new Set<string>([
  "iron-steel",
  "aluminum",
  "aluminium",
  "electricity",
  "hydrogen",
]);

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
  const sadeceDirekt = ANNEX_II_SADECE_DIREKT.has(g.sectorId);
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
      ...(ANNEX_II_SADECE_DIREKT.has(result.sector.id)
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

export function buildKapsamliDurumRaporuText(g: KapsamliRaporGirdisi): string {
  const r = hesapla(g);
  const engel = g.findings.filter((f) => f.seviye === "ENGEL").length;
  const uyari = g.findings.filter((f) => f.seviye === "RISK" || f.seviye === "IYILESTIRME").length;
  const L: string[] = [];
  const push = (...lines: string[]) => L.push(...lines);

  push(
    "=== SKDMHESAPLA — KAPSAMLI DURUM RAPORU ===",
    `Paket: ${g.packageId}`,
    `Tarih: ${trTarih(g.timestamp)}`,
    `Motor: ${g.engineVersion} | Ruleset: ${g.rulesetVersion}`,
    `Hash: ${g.packageHash}`,
    "",
    "SKDM (CBAM) Veri Paketi — A'dan Z'ye Tam Görünüm",
    `Tesis: ${g.tesisAdiEN}`,
    `İşletme: ${g.firma}`,
    `Sektör: ${g.sectorLabel} · UNLOCODE ${g.unlocode}`,
    `Dönem: 01.01.${g.yil} – 31.12.${g.yil} · İhraç hacmi ${trNum(g.tonaj, 0)} ton`,
    "",
    "--- 01 · YÖNETİCİ ÖZETİ ---",
    `Hazırlık skoru: %${g.readinessScore} | Engelleyici: ${engel} | Uyarı: ${uyari} | Paket dosyası: 12`,
    `${g.firma} — ${g.tesisAdiEN} — ${g.yil} SKDM veri paketi mühürlenmiştir.`,
    r.sadeceDirekt
      ? "Annex II: yalnızca doğrudan emisyon fiyatlandırması uygulanır."
      : "Doğrudan + dolaylı emisyonlar fiyatlandırmaya dahildir.",
    "Öne çıkanlar:",
    r.sadeceDirekt
      ? "• Toplam gömülü emisyon yalnız Kapsam 1 — Kapsam 2 fatura dışı (Annex II)."
      : "• Toplam gömülü emisyon Kapsam 1 + Kapsam 2.",
    TR_ETS_PILOT_YILLARI.has(g.yil)
      ? "• TR-ETS pilot: mahsup 0 (%100 ücretsiz tahsisat)."
      : `• TR-ETS mahsup: ${trNum(r.etkinMahsup)} €/tCO2e.`,
    r.denklikSaglandi
      ? "• Üretim denkliği (a = b+c+d) sağlanmıştır."
      : "• Üretim denkliği sağlanmamıştır — gözden geçirin.",
    "",
    "--- 02 · TESİS VE FİRMA KİMLİĞİ ---",
    `İşletme: ${g.firma}`,
    `Tesis (EN): ${g.tesisAdiEN}`,
    `UNLOCODE: ${g.unlocode} | Ülke: Türkiye (TR)`,
    `Yetkili: ${g.yetkili}`,
    `Sektör / CN: ${g.sectorLabel} — ${g.cnRange}`,
    `İhraç hacmi: ${trNum(g.tonaj, 0)} ton`,
    "",
    "--- 03 · REGISTER G / P ---",
    "Mal kategorileri (G):"
  );
  if (g.goods.length === 0) push("  (kayıt yok)");
  g.goods.forEach((x) =>
    push(`  ${x.id.toLocaleUpperCase("tr-TR")} | ${x.category} | CN ${x.cn} | ${x.route}`)
  );
  push("Üretim süreçleri (P):");
  if (g.processes.length === 0) push("  (kayıt yok)");
  g.processes.forEach((x) =>
    push(
      `  ${x.id.toLocaleUpperCase("tr-TR")} | ${x.name} | ${(x.included || []).join(", ") || "—"}`
    )
  );

  push("", "--- 04 · EMİSYON ÖZETİ (B / D / E) ---", "Kaynak akışları (B):");
  if (g.streams.length === 0) push("  (kayıt yok)");
  g.streams.forEach((s) =>
    push(
      `  ${s.method} | ${s.name} | ${trNum(s.ad, 0)} ${s.unit}${s.ncv && s.ncv !== "-" ? ` NCV ${s.ncv}` : ""} | ${s.processId}`
    )
  );
  push(
    r.sadeceDirekt
      ? "Emisyon dengesi — yalnız kapsam-içi (Annex II, direkt):"
      : "Emisyon dengesi:",
    `  Kapsam 1: ${trNum(g.kapsam1)} tCO2e — maliyete girer: Evet`,
    `  Kapsam 2: ${trNum(g.kapsam2)} tCO2e — maliyete girer: ${r.sadeceDirekt ? "Hayır (Annex II)" : "Evet"}`,
    `  TOPLAM fatura edilen: ${trNum(r.faturaEdilenEmisyon)} tCO2e`,
    "Öncül maddeler (E):"
  );
  if (g.precursors.length === 0) push("  (kayıt yok)");
  g.precursors.forEach((p) =>
    push(
      `  ${p.name} | toplam ${trNum(p.total, 0)} t | içi ${trNum(p.internal, 0)} | dış ${trNum(p.other, 0)} | SEE ${trNum(p.see, 2)}`
    )
  );

  push(
    "",
    "--- 05 · KONTROL DENKLİKLERİ ---",
    `D_Processes (a)=${trNum(g.dProcesses.a, 0)} (b)=${trNum(g.dProcesses.b, 0)} (c)=${trNum(g.dProcesses.c, 0)} (d)=${trNum(g.dProcesses.d, 0)}`,
    `Kontrol (b)+(c)+(d)=${trNum(r.denklikToplam, 0)} — ${r.denklikSaglandi ? "(a) ile eşleşiyor" : "(a) ile eşleşmiyor — gözden geçirin"}`,
    "",
    "--- 06 · MALİYET PROJEKSİYONU ---",
    "Tutar AB ithalatçısının üstleneceği tahmini SKDM sertifika maliyetidir; ihracatçıya kesilen fatura değildir.",
    `Alıcının üstleneceği tahmini maliyet: ${trEur(r.maliyetEur)}`,
    `Fatura edilen emisyon: ${trNum(r.faturaEdilenEmisyon)} tCO2e`,
    `CBAM faktörü (${g.yil}): %${trNum(r.cbamFaktoru * 100, 1)}`,
    `Yükümlü emisyon: ${trNum(r.yukumluEmisyon, 3)} tCO2e`,
    `ETS: ${g.etsQuarter} — ${trNum(g.etsPrice, 1)} €/tCO2e`,
    TR_ETS_PILOT_YILLARI.has(g.yil)
      ? "TR ETS mahsup: 0 € — pilot dönemde %100 ücretsiz tahsisat"
      : `TR ETS mahsup: ${trNum(r.etkinMahsup, 2)} €/tCO2e`,
    `Çeyreklik asgari elde tutma (%50): ${trNum(r.ceyreklikTutma, 3)} tCO2e`,
    "",
    "--- 07 · VERİ KALİTESİ ---",
    `Doğrudan ölçüm / kaynak akışı sayısı: ${g.streams.length}`,
    "Gerçek ölçülmüş veri, mark-up'lı varsayılanlara kıyasla genellikle daha savunulabilirdir.",
    "",
    "--- 08 · DOĞRULAYICI HAZIRLIK ---",
    "İç kontrol: alan bazlı giriş kaydı",
    "Veri yönetimi: kaynaktan sisteme izlenebilir zincir",
    r.denklikSaglandi
      ? "Potansiyel yanlış beyan: kontrol denklikleri sağlandı"
      : "Potansiyel yanlış beyan: denklik sağlanmadı — inceleme gerekli",
    `Örnekleme: ${g.streams.length} kaynak akışı, ${g.precursors.length} öncül madde`,
    "Bu değerlendirme doğrulama görüşü değildir.",
    "",
    "--- 09 · BULGU KAYDI ---"
  );
  if (g.findings.length === 0) push("Kayda değer bulgu bulunmamaktadır.");
  else g.findings.forEach((f) => push(`[${f.seviye}] ${f.metin}`));
  push(
    engel === 0
      ? "Engelleyici bulgu bulunmamaktadır. Dosya mühürlemeye hazırdır."
      : "Engelleyici bulgu mevcuttur; mühürleme öncesi giderilmelidir.",
    "",
    "--- 10 · PAKET İÇERİĞİ (12 DOSYA) ---",
    "1. Kapsamli-Durum-Raporu.pdf — bu belge",
    "2. Denetime-Hazirlik-Dosyasi.pdf",
    "3. Emisyon-Hesaplama-Eki.pdf",
    "4. Kanit-Kayit-Defteri.xlsx",
    "5. Dogrulayici-Calisma-Alani.xlsx",
    "6. Hesaplama-Izi.json",
    "7. SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx",
    "8. Izleme-Yontem-Plani.pdf",
    "9. Oncul-Madde-Tedarikci-Beyani.pdf — doğrulayıcı (alıcıya gitmez)",
    "10. Elektrik-ve-Isi-Denge-Raporu.xlsx",
    "11. De-Minimis-Muafiyet-Kapsam-Beyani.pdf",
    "12. BUTUNLIK-MANIFESTOSU.json",
    "",
    "--- 11 · BÜTÜNLÜK ---",
    `Paket: ${g.packageId}`,
    `Mühür: ${trTarih(g.timestamp)}`,
    `Motor / ruleset: ${g.engineVersion} / ${g.rulesetVersion}`,
    `İmza: ${g.packageHash}`,
    "Doğrulama: skdmhesapla.com/dogrula/",
    "",
    "--- 12 · KAPSAM SINIRLARI ---",
    "— AB'ye beyan göndermez (CBAM Registry / yetkilendirilmiş beyan sahibi).",
    "— Akredite doğrulama görüşü vermez.",
    "— Gümrük onayı veya GTİP kararı vermez.",
    "— Girilen verilerin doğruluğunu garanti etmez; tutarlılığı denetler.",
    "",
    "SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır."
  );

  return L.join("\n");
}

export function kapsamliDurumRaporuPdfBytes(g: KapsamliRaporGirdisi): Uint8Array {
  return textToMultiPagePdfBytes(buildKapsamliDurumRaporuText(g));
}
