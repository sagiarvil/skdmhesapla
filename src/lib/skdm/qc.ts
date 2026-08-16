/**
 * Fail-closed QC katmanı.
 * Blocking / warning / note — motor çıktısına ek denetimler.
 * G-23: kırmızı yok; amber uyarı + "tamamlanmadı / gözden geçirin" dili.
 */
export type QcSeverity = "blocking" | "warning" | "note";

export interface QcFinding {
  code: string;
  severity: QcSeverity;
  message: string;
}

export function runSkdmQc(input: {
  productionVolume: number;
  totalEmissionIntensity: number;
  sectorId: string;
}): QcFinding[] {
  const findings: QcFinding[] = [];
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
export function checkDProcessesEquality(input: {
  a: number;
  b: number;
  c: number;
  d: number;
}): QcFinding | null {
  if (input.a <= 0) return null;
  const sum = input.b + input.c + input.d;
  if (Math.abs(sum - input.a) < 0.01) return null;
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
export function checkEPurchPrecEquality(
  rows: { total: number; internal: number; other: number }[]
): QcFinding | null {
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (r.total <= 0) continue;
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

/** Katman 3–4 register tamamlık — mühür öncesi. */
export function checkRegisterCore(input: {
  goodsCount: number;
  processes: { id: string; name: string; included: string[] }[];
  streams: { method: string; name: string; ad: number; ncv: string }[];
}): QcFinding[] {
  const out: QcFinding[] = [];
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

export function hasBlockingQc(findings: QcFinding[]): boolean {
  return findings.some((f) => f.severity === "blocking");
}
