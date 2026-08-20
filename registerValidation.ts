/**
 * GATE-S (RM-007): Mühürleme ÖNCESİ register doğrulaması — birinci savunma hattı.
 *
 * OLAY: createSealedAuditPackage'a beklenenden farklı şekilde bir register
 * verildiğinde (örn. precursor satırında internal/other eksik), hata PDF
 * üretiminin derinliklerinde, anlaşılmaz bir stack trace olarak patlıyordu.
 * Kullanıcıya hiçbir açıklama gitmiyordu, hiçbir dosya üretilmiyordu.
 *
 * KURAL: Register verisi PDF/XLSX kod yoluna girmeden ÖNCE tamamen
 * doğrulanır. Sorun varsa, GATE-A ve GATE-1'le AYNI ÜSLUPTA (Fail-Closed,
 * hangi alan/hangi satır olduğu belirtilerek) net bir Türkçe hata fırlatılır.
 *
 * Bu, savunmalı formatlayıcıların (trNum/trEur — bkz. kapsamliDurumRaporu.ts)
 * YERİNE geçmez, ONLARDAN ÖNCE gelir. İki katman birbirini tamamlar:
 * biri atlanırsa diğeri tutar.
 */

export interface RegisterValidationHata {
  /** Hangi register bölümünde ("streams", "precs", "goods", "dProcesses" vb.) */
  bolum: string;
  /** Kaçıncı satır (0-tabanlı) — bölüm satır bazlı değilse belirtilmez. */
  satirIndeksi?: number;
  /** Hangi alan */
  alan: string;
  /** Kullanıcıya gösterilecek, sorunu tarif eden mesaj. */
  mesaj: string;
}

export class SealRegisterValidationError extends Error {
  readonly hatalar: RegisterValidationHata[];

  constructor(hatalar: RegisterValidationHata[]) {
    const ozet = hatalar
      .map(
        (h) =>
          `[${h.bolum}${h.satirIndeksi !== undefined ? `[${h.satirIndeksi}]` : ""}.${h.alan}] ${h.mesaj}`,
      )
      .join(" | ");
    super(`Fail-Closed Register Doğrulaması (GATE-S): ${ozet}`);
    this.name = "SealRegisterValidationError";
    this.hatalar = hatalar;
  }
}

function sayiGecerliMi(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * Bir register snapshot'ını PDF/XLSX üretimine göndermeden önce doğrular.
 * SealRegisterSnapshot tipiyle aynı şekli bekler; alan adları o tipe göre
 * senkron tutulmalıdır (bkz. package-seal.ts).
 */
export function validateSealRegisterSnapshot(reg: {
  goods?: unknown[];
  processes?: unknown[];
  streams?: Array<{ ad?: unknown; name?: unknown }>;
  precs?: Array<{
    name?: unknown;
    total?: unknown;
    internal?: unknown;
    other?: unknown;
    see?: unknown;
  }>;
  dProcesses?: { a?: unknown; b?: unknown; c?: unknown; d?: unknown };
}): void {
  const hatalar: RegisterValidationHata[] = [];

  // --- precs: internal/other/total/see sayısal olmalı ---
  (reg.precs || []).forEach((p, i) => {
    const ad = typeof p.name === "string" && p.name.trim() ? p.name : `(satır ${i + 1})`;
    if (!sayiGecerliMi(p.total)) {
      hatalar.push({
        bolum: "precs",
        satirIndeksi: i,
        alan: "total",
        mesaj: `"${ad}" öncül maddesinde toplam miktar sayı değil — kayıt eksik olabilir.`,
      });
    }
    if (!sayiGecerliMi(p.internal)) {
      hatalar.push({
        bolum: "precs",
        satirIndeksi: i,
        alan: "internal",
        mesaj: `"${ad}" öncül maddesinde tesis-içi miktar sayı değil.`,
      });
    }
    if (!sayiGecerliMi(p.other)) {
      hatalar.push({
        bolum: "precs",
        satirIndeksi: i,
        alan: "other",
        mesaj: `"${ad}" öncül maddesinde dış kaynak miktarı sayı değil.`,
      });
    }
    if (!sayiGecerliMi(p.see)) {
      hatalar.push({
        bolum: "precs",
        satirIndeksi: i,
        alan: "see",
        mesaj: `"${ad}" öncül maddesinde SEE (gömülü emisyon) değeri sayı değil.`,
      });
    }
    // Denklik: internal + other, total ile tutmalı — GATE-S bunu da yakalar.
    if (
      sayiGecerliMi(p.total) &&
      sayiGecerliMi(p.internal) &&
      sayiGecerliMi(p.other) &&
      Math.abs((p.internal as number) + (p.other as number) - (p.total as number)) > 1e-6
    ) {
      hatalar.push({
        bolum: "precs",
        satirIndeksi: i,
        alan: "internal+other",
        mesaj: `"${ad}": tesis-içi (${p.internal}) + dış kaynak (${p.other}) toplamı, toplam miktara (${p.total}) eşit değil.`,
      });
    }
  });

  // --- streams: faaliyet verisi (ad) sayısal olmalı ---
  (reg.streams || []).forEach((s, i) => {
    const ad = typeof s.name === "string" && s.name.trim() ? s.name : `(satır ${i + 1})`;
    if (!sayiGecerliMi(s.ad)) {
      hatalar.push({
        bolum: "streams",
        satirIndeksi: i,
        alan: "ad",
        mesaj: `"${ad}" kaynak akışında faaliyet verisi sayı değil.`,
      });
    }
  });

  // --- dProcesses: üretim denkliği alanlarının tümü sayısal olmalı ---
  if (reg.dProcesses) {
    (["a", "b", "c", "d"] as const).forEach((k) => {
      if (!sayiGecerliMi(reg.dProcesses![k])) {
        hatalar.push({
          bolum: "dProcesses",
          alan: k,
          mesaj: `Üretim denkliği alanı "${k}" sayı değil.`,
        });
      }
    });
  }

  if (hatalar.length > 0) {
    throw new SealRegisterValidationError(hatalar);
  }
}
