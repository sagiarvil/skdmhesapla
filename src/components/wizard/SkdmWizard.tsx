"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { JetBrains_Mono } from "next/font/google";
import { FieldHelp } from "@/components/fieldhelp/FieldHelp";
import {
  GoodsRegister,
  PrecRegister,
  ProcessRegister,
  StreamRegister,
} from "@/components/wizard/RegisterTables";
import { calculateSkdmLiability } from "@/lib/skdm/calculator";
import { createSealedAuditPackage } from "@/lib/skdm/package-seal";
import { PackageDownloads } from "@/components/seal/PackageDownloads";
import { SealModal } from "@/components/seal/SealModal";
import { EstimatedCostCard } from "@/components/wizard/EstimatedCostCard";
import { estimateCertificateCost } from "@/lib/calc/estimateCost";
import { assessCostReadiness, wizardCostInputs } from "@/lib/calc/dataReadiness";
import {
  TKD_FILENAME,
  buildTkdGirdisiFromWizard,
  tedarikciKarbonDosyasiPdfBytes,
} from "@/lib/skdm/pdf/tedarikciKarbonDosyasi";
import {
  DEFAULT_ETS_QUARTER,
  ETS_PRICE_QUARTERLY,
  PADDLE_SEAL_PRICE_TRY,
  SKDM_SECTORS,
  resolveTrEtsNettingEur,
} from "@/lib/skdm/config";
import { SITE } from "@/lib/skdm/site-config";
import { emitFunnelEvent } from "@/lib/seo/funnel-events";
import { PLATFORM_STATS } from "@/lib/skdm/constants";
import {
  FIELD_HELP_DB,
  getField,
  layerFieldIds,
} from "@/lib/skdm/fieldhelp";
import {
  checkDProcessesEquality,
  checkEPurchPrecEquality,
  checkRegisterCore,
  hasBlockingQc,
  runSkdmQc,
} from "@/lib/skdm/qc";
import {
  loadSessionDraft,
  MAX_PROCESSES,
  newSessionId,
  saveSessionDraft,
  type GoodRow,
  type PrecRow,
  type ProcessRow,
  type SkdmSessionDraft,
  type StreamRow,
} from "@/lib/skdm/session-store";

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono-jb",
  display: "swap",
});

const SLUG_TO_ID: Record<string, string> = {
  "demir-celik": "iron-steel",
  aluminyum: "aluminum",
  cimento: "cement",
  gubre: "fertilizer",
  elektrik: "electricity",
  hidrojen: "hydrogen",
  // Kademe B/C — Türkçe slug'lar (gtip-kodlari.ts ile birebir aynı)
  batarya: "battery",
  ambalaj: "packaging",
  gida: "food",
  lojistik: "logistics",
  plastik: "plastics",
  kimya: "chemicals",
  cam: "glass",
  tekstil: "textile",
  makine: "machinery",
  otomotiv: "automotive",
  elektronik: "electronics",
  mobilya: "furniture",
  kagit: "paper",
  yapi: "construction",
};

/** Adım etiketleri — insan dili; teknik katman kodları arayüzde gösterilmez. */
const STEPS = [
  { n: 0, label: "Başlangıç" },
  { n: 1, label: "Firma ve tesis" },
  { n: 2, label: "Ne satıyorsunuz" },
  { n: 3, label: "Üretim adımları" },
  { n: 4, label: "Enerji ve yakıt" },
  { n: 5, label: "Üretim miktarı" },
  { n: 6, label: "Hammaddeler" },
  { n: 7, label: "Doğrulayıcı" },
  { n: 8, label: "Karbon bedeli" },
  { n: 9, label: "Belgeler" },
  { n: 10, label: "Özet ve mühür" },
] as const;

const TRIAGE = ["E-posta", "Excel dosyası", "PDF/form", "Sözlü talep", "Hiçbir şey", "Bilmiyorum"] as const;

const DOC_CHECKS = [
  { name: "Elektrik faturası", ok: true, note: "Veri kaynağı olarak kullanılabilir" },
  { name: "ISO 14064 belgesi", ok: false, note: "CBAM doğrulaması yerine geçmez — gözden geçirin" },
  { name: "Üretim Excel'i", ok: true, note: "Hesaplama kaynağı; doğrulamada destek gerekebilir" },
] as const;

/* ── Claude teması (sihirbaz kapsamı) ── */
const T = {
  paper: "#FBF9F4",
  card: "#FFFFFF",
  ink: "#2B2A24",
  inkSoft: "#5C5A4E",
  mute: "#8C8A7C",
  line: "#E9E4D6",
  olive: "#6B7F4A",
  oliveDeep: "#4E5F35",
  oliveWash: "#EEF1E3",
  clay: "#BD6A3E",
  clayWash: "#F7E9DD",
  sky: "#4A6B85",
  skyWash: "#E6EDF1",
  amberWash: "#F6ECD6",
} as const;

const cardCls = "rounded-[14px] border bg-white p-5 sm:p-6";
const cardStyle = { borderColor: T.line, boxShadow: "0 1px 2px rgba(43,42,36,.04)" } as const;

function defaultFieldValues(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [id, cfg] of Object.entries(FIELD_HELP_DB.fields)) {
    out[id] = cfg.default !== undefined ? String(cfg.default) : "";
  }
  return out;
}

function StepHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-6 space-y-2">
      <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-800">{eyebrow}</div>
      <h2 className="text-2xl sm:text-3xl md:text-[30px] font-extrabold leading-tight tracking-tight text-ink-900">
        {title}
      </h2>
      {desc && <p className="text-base sm:text-lg leading-relaxed text-ink-700 font-medium">{desc}</p>}
    </div>
  );
}

function NavRow({
  step,
  onBack,
  onNext,
  nextLabel = "Devam edelim →",
  isDark = false,
}: {
  step: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  isDark?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-line/60 pt-6">
      <div>
        {onBack && (
          <button
            type="button"
            className={`min-h-[48px] rounded-2xl border-2 px-6 py-3 text-base font-bold transition-all shadow-sm ${
              isDark
                ? "border-white/50 bg-white/10 text-white hover:bg-white/20"
                : "border-line bg-white text-ink-900 hover:bg-neutral-50 hover:border-brand-800"
            }`}
            style={isDark ? { color: "#ffffff", borderColor: "rgba(255,255,255,0.4)" } : { borderColor: T.line, color: T.inkSoft }}
            onClick={onBack}
          >
            ← Geri
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold" style={{ color: isDark ? "#C9D6B4" : T.mute }}>Adım {step} / 10</span>
        {onNext && (
          <button
            type="button"
            className="min-h-[48px] rounded-2xl px-7 py-3 text-base font-bold text-white transition-all shadow-md hover:bg-brand-900"
            style={{ background: T.oliveDeep, boxShadow: "0 2px 0 #3c4a29" }}
            onClick={onNext}
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}

import { useAuth } from "@/lib/firebase/auth-context";

export function SkdmWizard({ sectorSlug }: { sectorSlug: string }) {
  const { saveSealedToHistory } = useAuth();
  const sectorId = SLUG_TO_ID[sectorSlug] || "iron-steel";
  const sector = SKDM_SECTORS[sectorId] || SKDM_SECTORS["iron-steel"];

  const [sessionId] = useState(() => newSessionId());
  const [createdAt] = useState(() => new Date().toISOString());
  const [step, setStep] = useState(0);
  const [triage, setTriage] = useState<string | undefined>();
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(defaultFieldValues);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [goods, setGoods] = useState<GoodRow[]>([]);
  const [goodsN, setGoodsN] = useState(0);
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [procN, setProcN] = useState(0);
  const [streams, setStreams] = useState<StreamRow[]>([]);
  const [precs, setPrecs] = useState<PrecRow[]>([]);
  const [dA, setDA] = useState(0);
  const [dB, setDB] = useState(0);
  const [dC, setDC] = useState(0);
  const [dD, setDD] = useState(0);
  const [noVerifier, setNoVerifier] = useState(true);
  const [resumeBanner, setResumeBanner] = useState(false);
  const [sinifNotu, setSinifNotu] = useState<string | null>(null);
  const [remoteOk, setRemoteOk] = useState<boolean | null>(null);
  const [sealedName, setSealedName] = useState<string | null>(null);
  const [sealedVaryant, setSealedVaryant] = useState<"skdm" | "tkd">("skdm");
  const [sealModalOpen, setSealModalOpen] = useState(false);
  const [paidTxn, setPaidTxn] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const draft = loadSessionDraft(sectorSlug);
    if (draft) {
      setStep(draft.step);
      setTriage(draft.triage);
      setFieldValues({ ...defaultFieldValues(), ...draft.fieldValues });
      setSkipped(draft.skippedFields || []);
      setGoods(draft.goods || []);
      setGoodsN(draft.goods?.length || 0);
      setProcesses(draft.processes || []);
      setProcN(draft.processes?.length || 0);
      setStreams(draft.streams || []);
      setPrecs(draft.precs || []);
      if (draft.dProcesses) {
        setDA(draft.dProcesses.a);
        setDB(draft.dProcesses.b);
        setDC(draft.dProcesses.c);
        setDD(draft.dProcesses.d);
      }
      setResumeBanner(true);
    }
    const p = new URLSearchParams(window.location.search);
    if (p.get("sinif") === "AMB-001") {
      const tonaj = Number(String(p.get("tonaj") || "").replace(",", "."));
      const beyan = p.get("beyan");
      const cn = p.get("cn") || (sectorSlug === "demir-celik" ? "7308" : "7610");
      if (tonaj > 0) {
        setFieldValues((fv) => ({ ...fv, tonaj: String(tonaj) }));
      }
      if (beyan === "metal") {
        setSinifNotu(
          `Sınıflandırma notu: yalnız metal profil net ağırlığı beyan edilecek (CN ${cn}) — cam, conta, aksesuar ve ambalaj hariç. Bu bir gümrük kararı değildir.`
        );
      } else {
        setSinifNotu(
          `Sınıflandırma notu: cam balkon akışından gelindi (CN ${cn}). Kesin GTİP teyidi gümrük beyannamesi ile yapılır.`
        );
      }
    }
  }, [sectorSlug]);

  useEffect(() => {
    emitFunnelEvent("wizard_started", { sectorSlug });
  }, [sectorSlug]);

  useEffect(() => {
    emitFunnelEvent("wizard_layer_completed", { sectorSlug, step });
  }, [sectorSlug, step]);

  useEffect(() => {
    const t = window.setInterval(() => {
      const draft: SkdmSessionDraft = {
        sessionId,
        sectorSlug,
        createdAt,
        updatedAt: new Date().toISOString(),
        step,
        triage,
        fieldValues,
        skippedFields: skipped,
        goods,
        processes,
        streams,
        precs,
        dProcesses: { a: dA, b: dB, c: dC, d: dD },
        ePurchPrec: precs.map((p) => ({
          total: p.total,
          internal: p.internal,
          other: p.other,
        })),
        status: "draft",
      };
      void saveSessionDraft(draft).then((r) => setRemoteOk(r.remoteOk));
    }, 10_000);
    return () => window.clearInterval(t);
  }, [
    sessionId,
    sectorSlug,
    createdAt,
    step,
    triage,
    fieldValues,
    skipped,
    goods,
    processes,
    streams,
    precs,
    dA,
    dB,
    dC,
    dD,
  ]);

  const parsedTonaj = Number(String(fieldValues.tonaj ?? "").replace(",", "."));
  const volume = parsedTonaj > 0 ? parsedTonaj : dA > 0 ? dA : 0;
  const year = Number(fieldValues.yil) || 2026;
  const quarter = DEFAULT_ETS_QUARTER;
  // Pilot 2026–2027: mahsup kilitli 0 (Ek G §15) — kullanıcı girişi yok sayılır
  const trNet = resolveTrEtsNettingEur(year, Number(fieldValues.mahsup) || 0);
  const sectorBench = SKDM_SECTORS[sectorId] || SKDM_SECTORS["iron-steel"];

  const facilityDeclared =
    streams.some((s) => s.ad > 0 && Boolean(s.method?.trim())) ||
    precs.some((p) => p.see > 0 && p.total > 0);
  const precEmbedded = precs.reduce(
    (acc, p) => (p.see > 0 && p.total > 0 ? acc + p.see * p.total : acc),
    0
  );
  const customDirect =
    precEmbedded > 0 && volume > 0 ? precEmbedded / volume : sectorBench.defaultDirectEmission;
  const customIndirect = sectorBench.defaultIndirectEmission;
  const verificationOk = noVerifier || Boolean(fieldValues.vFirma?.trim());

  const result = useMemo(
    () =>
      calculateSkdmLiability({
        sectorId,
        productionVolume: volume,
        year,
        importerAnnualVolumeStatus: "unknown",
        etsQuarter: quarter,
        trEtsNettingEur: trNet,
        useCustomEmissions: facilityDeclared,
        customDirectEmission: customDirect,
        customIndirectEmission: customIndirect,
        hasVerificationEvidence: verificationOk,
      }),
    [
      sectorId,
      volume,
      year,
      quarter,
      trNet,
      facilityDeclared,
      customDirect,
      customIndirect,
      verificationOk,
    ]
  );

  const costInputs = wizardCostInputs({
    goodsCount: goods.length,
    processCount: processes.length,
    streamCount: streams.length,
    totalProductionQty: dA,
  });
  const displayCostInputs = {
    ...costInputs,
    totalProductionQty:
      assessCostReadiness(costInputs).state === "ready" && volume > 0 ? volume : costInputs.totalProductionQty,
  };
  const displayCostEur = estimateCertificateCost(sectorId, displayCostInputs, {
    year,
    importerAnnualVolumeStatus: "unknown",
    etsQuarter: quarter,
    trEtsNettingEur: trNet,
    useCustomEmissions: facilityDeclared,
    customDirectEmission: customDirect,
    customIndirectEmission: customIndirect,
    hasVerificationEvidence: verificationOk,
  });

  const dFinding = checkDProcessesEquality({ a: dA, b: dB, c: dC, d: dD });
  const eFinding = checkEPurchPrecEquality(
    precs.map((p) => ({ total: p.total, internal: p.internal, other: p.other }))
  );
  const registerFindings = checkRegisterCore({
    goodsCount: goods.length,
    processes,
    streams,
  });
  const qc = [
    ...runSkdmQc({
      productionVolume: volume,
      totalEmissionIntensity: result.totalEmissionIntensity,
      sectorId,
    }),
    ...(dFinding ? [dFinding] : []),
    ...(eFinding ? [eFinding] : []),
    ...registerFindings,
  ];
  const sealBlocked = hasBlockingQc(qc) || result.readinessScore !== 100;

  const missing = useMemo(() => {
    const items: { name: string; action: string; copy?: string }[] = [];
    if (!fieldValues.tesisAdiEN?.trim()) {
      items.push({
        name: "Tesis adı (İngilizce)",
        action: "Talep oluştur (kopyala)",
        copy: getField("tesisAdiEN")?.delegationTemplate,
      });
    }
    if (goods.length === 0) items.push({ name: "Ürün kategorisi", action: "2. adımda ekleyin" });
    if (processes.length === 0) items.push({ name: "Üretim adımı", action: "3. adımda ekleyin" });
    if (streams.length === 0) items.push({ name: "Enerji/yakıt kaynağı", action: "4. adımda ekleyin" });
    if (dA <= 0) items.push({ name: "Toplam üretim miktarı", action: "Üretimden iste" });
    if (dFinding) items.push({ name: "Üretim miktarı denkliği", action: "Gözden geçirin" });
    if (eFinding) items.push({ name: "Hammadde denkliği", action: "Gözden geçirin" });
    for (const f of registerFindings) {
      if (f.severity === "blocking") items.push({ name: f.message, action: "Gözden geçirin" });
    }
    return items;
  }, [
    fieldValues.tesisAdiEN,
    goods.length,
    processes.length,
    streams.length,
    dA,
    dFinding,
    eFinding,
    registerFindings,
  ]);

  const setField = (id: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [id]: value }));
  };

  const performSealA = async (transactionId: string) => {
    const pkg = createSealedAuditPackage(result, {
      sessionId,
      sectorSlug,
      goods,
      processes,
      streams,
      precs,
      dProcesses: { a: dA, b: dB, c: dC, d: dD },
      fieldValues,
    });
    if (!pkg.zipBytes) return;

    try {
      await fetch("/api/seal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.packageId,
          sessionId,
          orderId: transactionId,
          paddleTransactionId: transactionId,
          readinessScore: result.readinessScore,
          masterHash: pkg.masterHash,
          manifesto: pkg.manifesto,
          zipFilename: pkg.zipFilename,
          files: pkg.files.map((f) => ({
            filename: f.filename,
            mimeType: f.mimeType,
            sizeBytes: f.sizeBytes,
            sha256: f.sha256,
          })),
        }),
      });
    } catch {
      // İndirme yine yapılır; sipariş kaydı webhook'tan gelir
    }

    try {
      saveSealedToHistory({
        packageId: pkg.packageId,
        sectorSlug,
        sectorName: sector.name,
        zipFilename: pkg.zipFilename || `${pkg.packageId}.zip`,
        masterHash: pkg.masterHash,
        importerCostEur: result.importerCostEur,
        sealedAt: new Date().toISOString(),
        quarter,
      });
    } catch {
      // Yutulur
    }

    const copy = new Uint8Array(pkg.zipBytes.byteLength);
    copy.set(pkg.zipBytes);
    const blob = new Blob([copy], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = pkg.zipFilename || `${pkg.packageId}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setSealedName(pkg.zipFilename || pkg.packageId);
  };

  const handleSeal = async () => {
    if (sealBlocked) return;
    emitFunnelEvent("seal_intent", { sectorSlug });

    if (sector.tier !== "A") {
      const packageId = `TKD-${year}-${sectorSlug.slice(0, 2).toUpperCase()}-${sessionId.slice(-4).toUpperCase()}`;
      const girdi = buildTkdGirdisiFromWizard({
        sector,
        fieldValues,
        goods,
        streams,
        precs,
        uretimMiktari: volume,
        timestamp: new Date().toISOString(),
        packageId,
      });
      const pdf = tedarikciKarbonDosyasiPdfBytes(girdi);
      const copy = new Uint8Array(pdf.byteLength);
      copy.set(pdf);
      const blob = new Blob([copy], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = TKD_FILENAME;
      a.click();
      URL.revokeObjectURL(url);
      setSealedVaryant("tkd");
      setSealedName(TKD_FILENAME);
      return;
    }

    if (paidTxn) {
      await performSealA(paidTxn);
      return;
    }
    setSealModalOpen(true);
  };

  /* Üretim denkliği — insan diliyle mesaj */
  const dSum = dB + dC + dD;
  const dDiff = Math.abs(dA - dSum);
  const dMessage =
    dA <= 0
      ? { kind: "wait" as const, text: "Sayıları girdikçe burada otomatik kontrol edeceğiz." }
      : dFinding
        ? {
            kind: "no" as const,
            text: `${dDiff.toLocaleString("tr-TR")} ton'un nereye gittiği belirsiz — ihracat, fabrika içi kullanım veya stok kalemlerinden birine eklemeniz gerekebilir.`,
          }
        : {
            kind: "ok" as const,
            text: `Sayılar tutuyor — ${dSum.toLocaleString("tr-TR")} ton, toplam üretiminizle eşleşiyor.`,
          };

  return (
    <div
      className={`${jetbrains.variable} mx-auto max-w-5xl px-5 py-10 sm:px-6`}
      style={{ background: T.paper, color: T.ink }}
    >
      {sinifNotu && (
        <div
          className="mb-6 rounded-[10px] border-l-[3px] px-4 py-3 text-sm font-semibold"
          style={{ background: T.amberWash, color: "#5C4310", borderColor: "#946A1E" }}
        >
          {sinifNotu}
        </div>
      )}
      {resumeBanner && (
        <div
          className="mb-6 flex items-center gap-2.5 rounded-[10px] px-4 py-3 text-sm"
          style={{ background: T.oliveWash, color: T.oliveDeep }}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: T.olive }} />
          <span className="font-semibold">Taslağınız kaydedildi — kaldığınız yerden devam ediyorsunuz.</span>
          <button type="button" className="ml-auto text-xs underline" onClick={() => setResumeBanner(false)}>
            Gizle
          </button>
        </div>
      )}

      <header className="border-b pb-6" style={{ borderColor: T.line }}>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: T.ink }}>
          {sector.name} — {sector.tier === "A" ? "SKDM çalışma dosyası" : "Tedarikçi veri dosyası (ISO 14067)"}
        </h1>
        {sector.tier !== "A" && (
          <p
            className="mt-3 max-w-2xl rounded-[10px] px-4 py-2.5 text-sm font-semibold"
            style={{ background: T.skyWash, color: T.sky }}
          >
            Bu sektör SKDM kapsamında değildir. Çıktınız bir SKDM raporu olmayacak; alıcınızın
            Kapsam 3 hesabına girdi sağlayan, ISO 14067 mantığında bir tedarikçi veri dosyası olacaktır.
            Adımlar ve kalite kontrolleri aynıdır.
          </p>
        )}
      </header>

      {/* Adım izi — konuşma gibi, teknik çubuk değil */}
      <nav className="mt-6" aria-label="Sihirbaz adımları">
        <div className="flex gap-1.5">
          {STEPS.map((s) => (
            <button
              key={s.n}
              type="button"
              onClick={() => setStep(s.n)}
              aria-label={s.label}
              title={s.label}
              className="h-[5px] flex-1 rounded-full transition-colors"
              style={{
                background: s.n < step ? T.olive : s.n === step ? T.clay : T.line,
              }}
            />
          ))}
        </div>
        <p className="mt-2.5 text-[13px]" style={{ color: T.mute }}>
          <b style={{ color: T.ink }}>{STEPS[step].label}</b> · {step + 1} / {STEPS.length}
        </p>
      </nav>

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="space-y-4">
          {step === 0 && (
            <section className={cardCls} style={cardStyle}>
              <StepHead
                eyebrow="İlk soru"
                title="Alıcınız size ne iletti?"
                desc="Hesaplama yapmayacağız — sizden ne istendiğini anlayıp doğru sırayla ilerleyeceğiz."
              />
              <div className="grid gap-3 sm:grid-cols-3">
                {TRIAGE.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setTriage(o)}
                    className="rounded-2xl border-2 px-4 py-4 text-left text-base font-bold transition-all shadow-sm"
                    style={{
                      borderColor: triage === o ? T.olive : T.line,
                      background: triage === o ? T.oliveWash : T.card,
                      color: T.ink,
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {triage && (
                <p
                  className="mt-4 rounded-2xl p-4 text-base font-medium leading-relaxed border border-brand-800/20"
                  style={{ background: T.oliveWash, color: T.oliveDeep }}
                >
                  {triage === "Hiçbir şey" || triage === "Bilmiyorum"
                    ? "Sorun değil. Önce ürününüzün kapsamda olup olmadığını kontrol ederiz; istenecek verileri adım adım birlikte çıkarırız."
                    : "Tamam. İstenen verileri birlikte çıkaralım — sonraki adımlarda ilgili alanlar sırayla önünüze gelecek."}
                </p>
              )}
              <NavRow step={0} onNext={() => setStep(1)} />
            </section>
          )}

          {step === 1 && (
            <section className={`${cardCls} space-y-3`} style={cardStyle}>
              <StepHead
                eyebrow="Önce sizi tanıyalım"
                title="Firmanız ve tesisiniz"
                desc="Bu bilgiler dosyanın kimlik sayfasını oluşturur — alıcınız ve doğrulayıcı sizi bu isimle tanıyacak."
              />
              {layerFieldIds("katman1").map((id) => {
                const cfg = getField(id);
                if (!cfg) return null;
                return (
                  <FieldHelp
                    key={id}
                    id={id}
                    cfg={cfg}
                    value={fieldValues[id] ?? ""}
                    onChange={setField}
                    skipped={skipped.includes(id)}
                    onSkip={(fid) => setSkipped((s) => (s.includes(fid) ? s : [...s, fid]))}
                  />
                );
              })}
              <NavRow step={1} onBack={() => setStep(0)} onNext={() => setStep(2)} />
            </section>
          )}

          {step === 2 && (
            <section className={cardCls} style={cardStyle}>
              <StepHead
                eyebrow="Ürününüz"
                title="Ne üretip satıyorsunuz?"
                desc="Her ürün grubunu bir kez ekleyin. CN kodunu bilmiyorsanız ana sayfadaki aramayı kullanın; teyidi alıcınızla yapın."
              />
              <div className="mt-3">
                <GoodsRegister
                  goods={goods}
                  onChange={setGoods}
                  onAdd={() => {
                    const n = goodsN + 1;
                    setGoodsN(n);
                    setGoods((g) => [...g, { id: `G${n}`, category: "", cn: "", route: "" }]);
                  }}
                />
              </div>
              <NavRow step={2} onBack={() => setStep(1)} onNext={() => setStep(3)} />
            </section>
          )}

          {step === 3 && (
            <section className={cardCls} style={cardStyle}>
              <StepHead
                eyebrow="Üretim hattınız"
                title="Ürün hangi adımlardan geçiyor?"
                desc="Erimeden paketlemeye kadar her üretim adımını ekleyin. Hangi adım hangi ürünü besliyor, onu işaretleyeceksiniz."
              />
              <div className="mt-3">
                <ProcessRegister
                  processes={processes}
                  goods={goods}
                  onChange={setProcesses}
                  onAdd={() => {
                    if (processes.length >= MAX_PROCESSES) return;
                    const n = Math.min(MAX_PROCESSES, procN + 1);
                    setProcN(n);
                    setProcesses((p) => [...p, { id: `P${n}`, name: "", included: [] }]);
                  }}
                />
              </div>
              <NavRow step={3} onBack={() => setStep(2)} onNext={() => setStep(4)} />
            </section>
          )}

          {step === 4 && (
            <section className={cardCls} style={cardStyle}>
              <StepHead
                eyebrow="Enerjinizi konuşalım"
                title="Fabrikanız neyle çalışıyor?"
                desc="Doğalgaz, kok, elektrik — hangisini kullanıyorsanız birer birer ekleyin. Her biri için faturadaki sayıyı girmeniz yeterli; hesabı biz yaparız."
              />
              <div className="mt-3">
                <StreamRegister
                  streams={streams}
                  processes={processes}
                  onChange={setStreams}
                  onAdd={() =>
                    setStreams((s) => [
                      ...s,
                      {
                        method: "Combustion",
                        name: "",
                        ad: 0,
                        unit: "t",
                        ncv: "",
                        processId: processes[0]?.id || "",
                      },
                    ])
                  }
                />
              </div>
              <NavRow step={4} onBack={() => setStep(3)} onNext={() => setStep(5)} />
            </section>
          )}

          {step === 5 && (
            <section className={`${cardCls} space-y-3`} style={cardStyle}>
              <StepHead
                eyebrow="Üretim miktarınız"
                title="Bu dönem ne kadar ürettiniz, nereye gitti?"
                desc="İhracata giden, fabrika içinde kullanılan ve stokta kalan miktarların toplamı, toplam üretiminize eşit çıkmalı. Tutmazsa size söyleriz, birlikte buluruz."
              />
              {(
                [
                  ["dTotal", dA, setDA],
                  ["dMarket", dB, setDB],
                  ["dInternal", dC, setDC],
                  ["dNonCbam", dD, setDD],
                ] as const
              ).map(([id, val, setVal]) => {
                const cfg = getField(id);
                if (!cfg) return null;
                return (
                  <FieldHelp
                    key={id}
                    id={id}
                    cfg={cfg}
                    value={String(val || "")}
                    onChange={(_, v) => setVal(Number(v) || 0)}
                  />
                );
              })}
              <div
                className="rounded-[10px] px-4 py-3 text-sm font-semibold"
                style={{
                  background:
                    dMessage.kind === "ok" ? T.oliveWash : dMessage.kind === "no" ? T.clayWash : T.line,
                  color:
                    dMessage.kind === "ok" ? T.oliveDeep : dMessage.kind === "no" ? T.clay : T.mute,
                }}
              >
                {dMessage.kind === "ok" ? "✓ " : ""}{dMessage.text}
              </div>
              <NavRow step={5} onBack={() => setStep(4)} onNext={() => setStep(6)} />
            </section>
          )}

          {step === 6 && (
            <section className={cardCls} style={cardStyle}>
              <StepHead
                eyebrow="Dışarıdan aldıklarınız"
                title="Hurda kullanıyorsanız bu bölüm sizin için kısa"
                desc="Hurda kapsam dışıdır. Burada yalnızca varsa ferro-alaşım, DRI/HBI gibi kapsam içi girdileri kaydedeceğiz — yoksa boş geçebilirsiniz."
              />
              <div className="mt-3">
                <PrecRegister
                  precs={precs}
                  onChange={setPrecs}
                  onAdd={() =>
                    setPrecs((p) => [
                      ...p,
                      {
                        name: "",
                        total: 0,
                        internal: 0,
                        other: 0,
                        source: "Çoklu tesis (ağırlıklı ort.)",
                        see: 0,
                      },
                    ])
                  }
                />
              </div>
              <div
                className="mt-3 rounded-[10px] px-4 py-3 text-sm font-semibold"
                style={{
                  background: eFinding ? T.clayWash : precs.some((p) => p.total > 0) ? T.oliveWash : T.line,
                  color: eFinding ? T.clay : precs.some((p) => p.total > 0) ? T.oliveDeep : T.mute,
                }}
              >
                {eFinding
                  ? "Bir satırda rakamlar tutmuyor — her hammadde için (fabrika içi + diğer) toplamı, girdiğiniz toplam miktara eşit olmalı."
                  : precs.some((p) => p.total > 0)
                    ? "✓ Hammadde kayıtlarınız tutarlı."
                    : "Hammadde eklerseniz tutarlılığı burada otomatik kontrol edeceğiz."}
              </div>
              <NavRow step={6} onBack={() => setStep(5)} onNext={() => setStep(7)} />
            </section>
          )}

          {step === 7 && (
            <section className={`${cardCls} space-y-3`} style={cardStyle}>
              <StepHead
                eyebrow="Bağımsız göz"
                title="Dosyanızı kim doğrulayacak?"
                desc="Kesin dönemde dosyanızı akredite bir doğrulayıcı inceler. Henüz anlaşmadıysanız sorun değil — 'henüz atanmadı' demeniz bu aşamada yeterli."
              />
              <label
                className="flex items-center gap-3 rounded-[10px] border-[1.5px] bg-white px-4 py-3 text-sm font-semibold"
                style={{ borderColor: T.line, color: T.ink }}
              >
                <input
                  type="checkbox"
                  checked={noVerifier}
                  onChange={(e) => setNoVerifier(e.target.checked)}
                />
                Doğrulayıcı henüz atanmadı
              </label>
              {!noVerifier &&
                layerFieldIds("katman7").map((id) => {
                  const cfg = getField(id);
                  if (!cfg) return null;
                  return (
                    <FieldHelp
                      key={id}
                      id={id}
                      cfg={cfg}
                      value={fieldValues[id] ?? ""}
                      onChange={setField}
                    />
                  );
                })}
              <NavRow step={7} onBack={() => setStep(6)} onNext={() => setStep(8)} />
            </section>
          )}

          {step === 8 && (
            <section className={`${cardCls} space-y-3`} style={cardStyle}>
              <StepHead
                eyebrow="Maliyet tarafı"
                title="Bu ürün için başka yerde karbon bedeli ödendi mi?"
                desc="Örneğin Türkiye'de bir karbon fiyatı ödediyseniz burada bildirirsiniz; alıcınızın sertifika yükümlülüğünden düşülür. Ödemediyseniz alanları boş bırakın."
              />
              {layerFieldIds("katman8").map((id) => {
                const cfg = getField(id);
                if (!cfg) return null;
                return (
                  <FieldHelp
                    key={id}
                    id={id}
                    cfg={cfg}
                    value={fieldValues[id] ?? ""}
                    onChange={setField}
                  />
                );
              })}
              <NavRow step={8} onBack={() => setStep(7)} onNext={() => setStep(9)} />
            </section>
          )}

          {step === 9 && (
            <section className={cardCls} style={cardStyle}>
              <StepHead
                eyebrow="Elinizdekiler"
                title="Hangi belgelerle kanıtlayabilirsiniz?"
                desc="Doğrulayıcı her sayı için bir kanıt görmek isteyecek. Elinizde olanları işaretleyin; olmayanları birlikte planlarız."
              />
              <ul className="mt-3 space-y-2.5">
                {DOC_CHECKS.map((d) => (
                  <li
                    key={d.name}
                    className="rounded-[10px] border-[1.5px] px-4 py-3 text-sm"
                    style={{
                      borderColor: d.ok ? T.olive : T.clay,
                      background: d.ok ? T.oliveWash : T.clayWash,
                    }}
                  >
                    <b style={{ color: T.ink }}>{d.name}</b>
                    <div className="mt-0.5 text-xs" style={{ color: T.inkSoft }}>
                      {d.ok ? "✓ " : ""}{d.note}
                    </div>
                  </li>
                ))}
              </ul>
              <NavRow
                step={9}
                onBack={() => setStep(8)}
                onNext={() => setStep(10)}
                nextLabel="Özete geçelim →"
              />
            </section>
          )}

          {step === 10 && (
            <section
              className="space-y-6 rounded-3xl p-7 sm:p-9 text-white shadow-2xl border-2 border-brand-500/40 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1b2e11 0%, #284419 50%, #15250c 100%)",
              }}
            >
              {/* ZEMİN ZARİF IŞILTI */}
              <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"
              />

              <StepHeadDark
                eyebrow="Son Adım — Mühürleme & Denetime Hazırlık"
                title="Dosyanızı kilitleyip denetime hazır paketinizi üretin"
              />

              <EstimatedCostCard
                inputs={costInputs}
                computedCostEur={displayCostEur}
                etsQuarter={quarter}
                etsPrice={ETS_PRICE_QUARTERLY[quarter]}
              />

              {missing.length > 0 && (
                <div className="rounded-2xl bg-white p-5 text-ink-900 shadow-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <b className="text-sm sm:text-base font-bold text-ink-900">
                      Mühürlemeden önce şunlar tamamlanmalı:
                    </b>
                  </div>
                  <ul className="space-y-2">
                    {missing.map((m, i) => (
                      <li
                        key={m.name + i}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl p-3 text-xs sm:text-sm font-medium"
                        style={{ background: T.amberWash, color: "#5C4310" }}
                      >
                        <span>
                          {i + 1}. {m.name}
                        </span>
                        {m.copy ? (
                          <button
                            type="button"
                            className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold shadow-sm hover:bg-neutral-50 transition"
                            style={{ border: `1px solid ${T.line}`, color: T.oliveDeep }}
                            onClick={async () => {
                              await navigator.clipboard.writeText(m.copy!);
                            }}
                          >
                            Talep metnini kopyala
                          </button>
                        ) : (
                          <span className="text-xs font-bold" style={{ color: T.oliveDeep }}>{m.action}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {dFinding && (
                <p className="rounded-2xl p-4 text-sm sm:text-base font-semibold" style={{ background: T.clayWash, color: T.clay }}>
                  Üretim miktarları henüz tutmuyor — mühürlemeden önce 5. adıma dönüp sayıları denkleştirmeniz gerek.
                </p>
              )}
              {eFinding && (
                <p className="rounded-2xl p-4 text-sm sm:text-base font-semibold" style={{ background: T.clayWash, color: T.clay }}>
                  Hammadde kayıtlarında tutarsızlık var — mühürlemeden önce 6. adımı gözden geçirin.
                </p>
              )}
              {registerFindings
                .filter((f) => f.severity === "blocking")
                .map((f) => (
                  <p
                    key={f.code}
                    className="rounded-2xl p-4 text-sm sm:text-base font-semibold"
                    style={{ background: T.clayWash, color: T.clay }}
                  >
                    {f.message}
                  </p>
                ))}
              {qc
                .filter((f) => f.severity === "blocking" || f.severity === "warning")
                .map((f) => (
                  <p
                    key={f.code}
                    className="rounded-2xl p-4 text-sm sm:text-base font-semibold"
                    style={{ background: T.clayWash, color: T.clay }}
                  >
                    {f.message}
                  </p>
                ))}

              {/* MÜHÜRLEME — parıltılı vurgu */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={sealBlocked}
                  onClick={handleSeal}
                  className="muhur-cta group relative flex w-full min-h-[72px] sm:min-h-[84px] items-center justify-between gap-4 overflow-hidden rounded-2xl px-6 sm:px-8 py-4 text-left disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale disabled:shadow-none"
                >
                  <span className="muhur-cta-shine pointer-events-none" aria-hidden />
                  <div className="relative z-[1] flex min-w-0 items-center gap-4">
                    <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-950 text-brand-500 ring-2 ring-white/35 sm:flex">
                      <span className="text-lg font-black tracking-tight">SHA</span>
                    </span>
                    <div className="space-y-0.5">
                      <div className="text-lg sm:text-2xl font-black text-brand-950 tracking-tight">
                        Dosyayı Mühürle &amp; Paketi İndir
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-brand-900/80">
                        {PLATFORM_STATS.fileCount} dosyalı denetime hazırlık paketi · SHA-256 dijital mühür
                      </div>
                    </div>
                  </div>

                  <div className="relative z-[1] flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl sm:text-3xl font-black text-brand-950 tabular-nums">
                        {PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR")} ₺
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-900">
                        KDV Dahil
                      </div>
                    </div>
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-brand-950 text-brand-500 shadow-md transition-transform group-hover:translate-x-1 group-hover:rotate-[-8deg]">
                      <span className="text-lg sm:text-xl font-black">→</span>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#B9C8A6] border-t border-white/10 pt-4 font-medium">
                <div>✓ {SITE.resealPublicCopy}</div>
                <div>✓ Doğrulayıcı paketi ve alıcı özeti ayrı ayrı üretilir.</div>
              </div>

              {sealedName && <PackageDownloads zipName={sealedName} varyant={sealedVaryant} />}
              <NavRow step={10} onBack={() => setStep(9)} isDark={true} />
            </section>
          )}
        </div>
      </div>
      <SealModal
        open={sealModalOpen}
        sessionId={sessionId}
        sectorSlug={sectorSlug}
        customerEmail={fieldValues.temsilciEmail}
        onClose={() => setSealModalOpen(false)}
        onPaid={(transactionId) => {
          setPaidTxn(transactionId);
          setSealModalOpen(false);
          void performSealA(transactionId);
        }}
      />
    </div>
  );
}

function StepHeadDark({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#C9D6B4" }}>{eyebrow}</div>
      <h2 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-white">{title}</h2>
    </div>
  );
}
