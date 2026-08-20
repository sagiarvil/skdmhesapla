"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { JetBrains_Mono } from "next/font/google";
import { FieldHelp } from "@/components/fieldhelp/FieldHelp";
import { GoodsRegister, PrecRegister, ProcessRegister, StreamRegister } from "@/components/wizard/RegisterTables";
import { ScopeTriage } from "@/components/wizard/ScopeTriage";
import { DelegationLinkButton } from "@/components/wizard/DelegationLinkButton";
import { calculateSkdmLiability } from "@/lib/skdm/calculator";
import { trUpper } from "@/lib/skdm/tr-locale";
import { SECTORS as ANNEX_SECTORS, type SectorId } from "@/lib/skdm/annex-ruleset";
import { createSealedAuditPackage, type SealedPackageOutput } from "@/lib/skdm/package-seal";
import { registerSealedPackage } from "@/lib/skdm/sealRegistryClient";
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
  ANNEX_II_SADECE_DIREKT,
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
  checkTaxIdField,
  computeConsistencyScore,
  countQcSeverities,
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
import { routeVerdict, type VerdictRoute } from "@/lib/skdm/resolve-scope";

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono-jb",
  display: "swap",
});

// Gate 7 — RM otorite + resmî şablon + sentetik veri kapıları kapanmadan CBAM seal kapalı.
const CBAM_SEAL_V2_READY = false;

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
  { n: 0, label: "Kapsam" },
  { n: 1, label: "Raporlama dönemi" },
  { n: 2, label: "Firma kimliği" },
  { n: 3, label: "Tesis adresi" },
  { n: 4, label: "İletişim ve faaliyet" },
  { n: 5, label: "Ne satıyorsunuz" },
  { n: 6, label: "Üretim adımları" },
  { n: 7, label: "Enerji ve yakıt" },
  { n: 8, label: "Üretim miktarı" },
  { n: 9, label: "Hammaddeler" },
  { n: 10, label: "Doğrulayıcı" },
  { n: 11, label: "Akreditasyon" },
  { n: 12, label: "Karbon bedeli" },
  { n: 13, label: "Belgeler" },
  { n: 14, label: "Özet ve mühür" },
] as const;

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
  onBack,
  onNext,
  nextLabel = "Devam edelim →",
  isDark = false,
}: {
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
  const annexSector =
    sectorId in ANNEX_SECTORS ? ANNEX_SECTORS[sectorId as keyof typeof ANNEX_SECTORS] : null;
  const annexIIDirectOnly = annexSector?.annexIIDirectOnly ?? null;

  const [sessionId] = useState(() => newSessionId());
  const [createdAt] = useState(() => new Date().toISOString());
  const [step, setStep] = useState(0);
  // GATE-D (RM-006): alıcının yıllık toplam ithalatı — de minimis hükmünün ekseni.
  const [importerVolume, setImporterVolume] = useState<"unknown" | "under50" | "over50">("unknown");
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
  const [sealedPkg, setSealedPkg] = useState<SealedPackageOutput | null>(null);
  const [sealedVaryant, setSealedVaryant] = useState<"skdm" | "tkd">("skdm");
  const [sealModalOpen, setSealModalOpen] = useState(false);
  const [paidTxn, setPaidTxn] = useState<string | null>(null);
  const [scopeRoute, setScopeRoute] = useState<VerdictRoute | null>(null);
  const [scopeInitialCn, setScopeInitialCn] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const draft = loadSessionDraft(sectorSlug);
    if (draft) {
      setStep(draft.step);
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
      if (
        draft.importerAnnualVolumeStatus === "unknown" ||
        draft.importerAnnualVolumeStatus === "under50" ||
        draft.importerAnnualVolumeStatus === "over50"
      ) {
        setImporterVolume(draft.importerAnnualVolumeStatus);
      }
      if (typeof draft.noVerifier === "boolean") {
        setNoVerifier(draft.noVerifier);
      }
      setResumeBanner(true);
    }
    const p = new URLSearchParams(window.location.search);
    const cnParam = p.get("cn");
    if (cnParam) {
      setScopeInitialCn(cnParam);
      const r = routeVerdict(cnParam);
      if (r.status === "in_scope" && r.scope.sector?.slug === sectorSlug) {
        setScopeRoute(r);
      }
    }
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
        importerAnnualVolumeStatus: importerVolume,
        noVerifier,
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
    importerVolume,
    noVerifier,
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
        importerAnnualVolumeStatus: importerVolume,
        etsQuarter: quarter,
        trEtsNettingEur: trNet,
        useCustomEmissions: facilityDeclared,
        customDirectEmission: customDirect,
        customIndirectEmission: customIndirect,
        hasVerificationEvidence: verificationOk,
        streams,
        precursors: precs.map((p) => ({ name: p.name, total: p.total, see: p.see })),
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
      importerVolume,
      streams,
      precs,
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
    importerAnnualVolumeStatus: importerVolume,
    etsQuarter: quarter,
    trEtsNettingEur: trNet,
    useCustomEmissions: facilityDeclared,
    customDirectEmission: customDirect,
    customIndirectEmission: customIndirect,
    hasVerificationEvidence: verificationOk,
    streams,
    precursors: precs.map((p) => ({ name: p.name, total: p.total, see: p.see })),
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
  // GATE-M1 (RM-005) + GATE-1 (RM-007): unvan + işletme türü + VKN biçim/checksum denetimi mühürleme kapısına bağlanır.
  const taxIdFindings = checkTaxIdField(
    fieldValues.tesisAdiTR || fieldValues.vFirma,
    fieldValues.vkn,
    fieldValues.isletmeTuru === "turel" || fieldValues.isletmeTuru === "sahis"
      ? fieldValues.isletmeTuru
      : undefined,
    fieldValues.isletmeTuru
  );
  const qc = [
    ...runSkdmQc({
      productionVolume: volume,
      totalEmissionIntensity: result.totalEmissionIntensity,
      sectorId,
    }),
    ...(dFinding ? [dFinding] : []),
    ...(eFinding ? [eFinding] : []),
    ...registerFindings,
    ...taxIdFindings,
  ];
  const sealBlocked = hasBlockingQc(qc) || result.readinessScore !== 100 || !CBAM_SEAL_V2_READY;
  // GATE-P (RM-006): skor iki bileşene ayrılır — Doluluk (alanlar girildi mi) ve
  // Tutarlılık (mutabakat/QC kontrolleri). Tutarlılık başarısızsa skor %100 olamaz.
  const coverageScore = result.readinessScore;
  const consistencyScore = computeConsistencyScore(qc);
  const displayScore = Math.min(coverageScore, consistencyScore);
  const { warning: warningCount, blocking: blockingCount } = countQcSeverities(qc);
  const sealReady = result.readinessScore === 100 && !hasBlockingQc(qc);

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

  /** Kapsam triyajı çözüldü — sektör URL ile uyuşmuyorsa doğru sektöre yönlendir. */
  const handleScopeIn = (route: VerdictRoute) => {
    const slug = route.scope.sector?.slug;
    if (!slug) return;
    emitFunnelEvent("wizard_scope_resolved", {
      sectorSlug,
      via: route.scope.normalizedCn ? "cn" : "card",
    });
    if (slug !== sectorSlug) {
      const cn = route.scope.normalizedCn;
      window.location.href = `/hesapla/${slug}/` + (cn ? `?cn=${encodeURIComponent(cn)}` : "");
      return;
    }
    setScopeRoute(route);
    setStep(1);
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
    void registerSealedPackage(pkg);
    if (!pkg.zipBytes) return;

    try {
      const res = await fetch("/api/seal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.packageId,
          sessionId,
          orderId: transactionId,
          paddleTransactionId: transactionId,
          packageType: "CBAM_SEAL_PACKAGE_9900",
          workflowType: "cbam",
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
      if (!res.ok) return;
    } catch {
      return;
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
    setSealedPkg(pkg);
  };

  const handleSeal = async () => {
    if (sealBlocked) return;
    emitFunnelEvent("seal_intent", { sectorSlug });

    if (sector.tier !== "A") {
      const packageId = `TKD-${year}-${trUpper(sectorSlug.slice(0, 2))}-${trUpper(sessionId.slice(-4))}`;
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
                eyebrow={sectorId in ANNEX_SECTORS ? "Kapsam sonucu" : "İlk soru"}
                title={
                  sectorId in ANNEX_SECTORS
                    ? `${ANNEX_SECTORS[sectorId as keyof typeof ANNEX_SECTORS].labelTr} — SKDM kapsamındasınız`
                    : "Bu iş sizi ilgilendiriyor mu, önce ona bakalım"
                }
                desc={
                  sectorId in ANNEX_SECTORS
                    ? "Sektörünüz zaten işaretli — kapsam kararı aşağıda. GTİP kodunuzla teyit edebilir veya değiştirmek isterseniz baştan başlayabilirsiniz."
                    : "GTİP kodunuzu yazın ya da durumunuzu seçin — ikisi de olur, hesaplama henüz başlamıyor."
                }
              />
              <ScopeTriage
                initialCn={scopeInitialCn}
                defaultSector={sectorId in ANNEX_SECTORS ? (sectorId as SectorId) : undefined}
                onInScope={handleScopeIn}
              />

              <div className="mt-4 border-t border-line/60 pt-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-500">
                  Alıcınızın yıllık toplam ithalatı hakkında bilginiz var mı?
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { value: "under50", label: "50 ton altı" },
                      { value: "over50", label: "50 ton üstü" },
                      { value: "unknown", label: "Bilmiyorum" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setImporterVolume(o.value)}
                      className="rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all"
                      style={{
                        borderColor: importerVolume === o.value ? T.olive : T.line,
                        background: importerVolume === o.value ? T.oliveWash : T.card,
                        color: T.ink,
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {importerVolume === "unknown" ? (
                  <p
                    className="mt-3 rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed"
                    style={{ background: T.oliveWash, color: T.oliveDeep }}
                  >
                    De minimis muafiyeti (50 ton) alıcının yıllık toplam ithalatına bakar — sizin tonajınıza değil.
                    "Bilmiyorum" seçerseniz durum belirlenemez, hazırlık skorunda eksiklik olarak işlenir ve
                    mühürleme engellenir; alıcınızdan teyit almanızı öneririz.
                  </p>
                ) : (
                  <p
                    className="mt-3 rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed"
                    style={{ background: T.oliveWash, color: T.oliveDeep }}
                  >
                    Teşekkürler. De minimis durumu bu beyana göre hükme bağlanır ve paketteki
                    De-Minimis-Muafiyet-Kapsam-Beyani.pdf dosyasına işlenir.
                  </p>
                )}
              </div>
              <NavRow onNext={scopeRoute ? () => setStep(1) : undefined} />
            </section>
          )}

          {step === 1 && (
            <section className={`${cardCls} space-y-3`} style={cardStyle}>
              <StepHead
                eyebrow="Zaman aralığı"
                title="Bu dosya hangi dönemi kapsıyor?"
                desc="Raporlama döneminiz, dosyanın başlık sayfasına işlenir ve veriler bu aralıkta toplanır."
              />
              {layerFieldIds("katman1-donem").map((id) => {
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
              <NavRow onBack={() => setStep(0)} onNext={() => setStep(2)} />
            </section>
          )}

          {step === 2 && (
            <section className={`${cardCls} space-y-3`} style={cardStyle}>
              <StepHead
                eyebrow="İşletme kimliği"
                title="Hangi işletme adına hazırlıyorsunuz?"
                desc="İşletme türünüz, vergi kimlik numaranızın biçimini belirler — tüzel firma 10 haneli VKN, şahıs firması 11 haneli T.C. kimlik numarası kullanır."
              />
              {layerFieldIds("katman1-firma").map((id) => {
                const cfg = getField(id);
                if (!cfg) return null;
                const bizType = fieldValues.isletmeTuru;
                const vknTitle =
                  id === "vkn"
                    ? bizType === "sahis"
                      ? "T.C. Kimlik No (11 hane)"
                      : bizType === "turel"
                        ? "VKN (10 hane)"
                        : "Vergi Kimlik No"
                    : undefined;
                return (
                  <FieldHelp
                    key={id}
                    id={id}
                    cfg={cfg}
                    value={fieldValues[id] ?? ""}
                    onChange={setField}
                    skipped={skipped.includes(id)}
                    onSkip={(fid) => setSkipped((s) => (s.includes(fid) ? s : [...s, fid]))}
                    titleOverride={vknTitle}
                  />
                );
              })}
              {taxIdFindings.filter((f) => f.code === "TAX_ID_TITLE_TYPE_CONFLICT").length > 0 && (
                <p className="rounded-2xl border border-accent-yellow bg-accent-yellow/20 p-3 text-sm font-semibold text-ink-900">
                  Unvanınızda tüzel kişi ibaresi geçiyor ama şahıs firması seçtiniz. Bunlardan
                  biri yanlış olabilir — kontrol eder misiniz?
                </p>
              )}
              <NavRow onBack={() => setStep(1)} onNext={() => setStep(3)} />
            </section>
          )}

          {step === 3 && (
            <section className={`${cardCls} space-y-3`} style={cardStyle}>
              <StepHead
                eyebrow="Tesis konumu"
                title="Tesisiniz nerede?"
                desc="Adres ve konum bilgileri, doğrulayıcının tesisinizi bulması ve paketteki kimlik sayfası için gereklidir."
              />
              {layerFieldIds("katman1-adres").map((id) => {
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
              <NavRow onBack={() => setStep(2)} onNext={() => setStep(4)} />
            </section>
          )}

          {step === 4 && (
            <section className={`${cardCls} space-y-3`} style={cardStyle}>
              <StepHead
                eyebrow="İletişim ve faaliyet"
                title="Kiminle iletişime geçelim?"
                desc="Yetkili temsilciniz ve ekonomik faaliyet bilgisi, doğrulayıcının sorularını yönelteceği kişiyi belirler."
              />
              {layerFieldIds("katman1-iletisim").map((id) => {
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
              <NavRow onBack={() => setStep(3)} onNext={() => setStep(5)} />
            </section>
          )}

          {step === 5 && (
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
              <NavRow onBack={() => setStep(4)} onNext={() => setStep(6)} />
            </section>
          )}

          {step === 6 && (
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
              <NavRow onBack={() => setStep(5)} onNext={() => setStep(7)} />
            </section>
          )}

          {step === 7 && (
            <section className={cardCls} style={cardStyle}>
              <StepHead
                eyebrow="Enerjinizi konuşalım"
                title="Fabrikanız neyle çalışıyor?"
                desc="Doğalgaz, kok, elektrik — hangisini kullanıyorsanız birer birer ekleyin. Her biri için faturadaki sayıyı girmeniz yeterli; hesabı biz yaparız."
              />
              {annexIIDirectOnly === true && (
                <div
                  className="rounded-[10px] px-4 py-3 text-sm font-semibold"
                  style={{ background: T.oliveWash, color: T.oliveDeep }}
                >
                  Bu sektörde (Annex II) elektrik tüketiminiz sertifika maliyetine girmez —
                  yine de dosyanın tamlığı için ekleyebilirsiniz.
                </div>
              )}
              {annexIIDirectOnly === false && (
                <div
                  className="rounded-[10px] px-4 py-3 text-sm font-semibold"
                  style={{ background: T.skyWash, color: T.sky }}
                >
                  Bu sektörde elektrik tüketimi de sertifika maliyetine girer — elektrik
                  kaydınızı eklemeniz önemli.
                </div>
              )}
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
              <NavRow onBack={() => setStep(6)} onNext={() => setStep(8)} />
            </section>
          )}

          {step === 8 && (
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
                  <div key={id} className="space-y-2">
                    <FieldHelp
                      id={id}
                      cfg={cfg}
                      value={String(val || "")}
                      onChange={(_, v) => setVal(Number(v) || 0)}
                    />
                    {id === "dTotal" && (
                      <DelegationLinkButton
                        sessionId={sessionId}
                        sectorSlug={sectorSlug}
                        fieldId="dTotal"
                        field={cfg}
                        label="Üretimden isteyeceğim — link oluştur, kopyala"
                      />
                    )}
                  </div>
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
              <NavRow onBack={() => setStep(7)} onNext={() => setStep(9)} />
            </section>
          )}

          {step === 9 && (
            <section className={cardCls} style={cardStyle}>
              <StepHead
                eyebrow="Dışarıdan aldıklarınız"
                title={
                  sectorId === "iron-steel" || sectorId === "aluminum"
                    ? "Hurda kullanıyorsanız bu bölüm sizin için kısa"
                    : "Dışarıdan aldığınız hammaddeler"
                }
                desc={
                  sectorId === "iron-steel"
                    ? "Hurda kapsam dışıdır. Burada yalnızca varsa ferro-alaşım, DRI/HBI gibi kapsam içi girdileri kaydedeceğiz — yoksa boş geçebilirsiniz."
                    : "Kapsamdaki her öncül madde için bir satır ekleyin — yoksa boş geçebilirsiniz."
                }
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
              <NavRow onBack={() => setStep(8)} onNext={() => setStep(10)} />
            </section>
          )}

          {step === 10 && (
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
                layerFieldIds("katman7-dogrulayici").map((id) => {
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
              <NavRow onBack={() => setStep(9)} onNext={() => setStep(11)} />
            </section>
          )}

          {step === 11 && (
            <section className={`${cardCls} space-y-3`} style={cardStyle}>
              <StepHead
                eyebrow="Akreditasyon bilgileri"
                title="Doğrulayıcının akreditasyonu nereden?"
                desc="Doğrulayıcının akreditasyon belgesi ve kayıt numarası dosyanın doğrulayıcı sayfasını tamamlar. Henüz bilmiyorsanız ilerleyebilirsiniz."
              />
              {layerFieldIds("katman7-akreditasyon").map((id) => {
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
              <NavRow onBack={() => setStep(10)} onNext={() => setStep(12)} />
            </section>
          )}

          {step === 12 && (
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
              <NavRow onBack={() => setStep(11)} onNext={() => setStep(13)} />
            </section>
          )}

          {step === 13 && (
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
                onBack={() => setStep(12)}
                onNext={() => setStep(14)}
                nextLabel="Özete geçelim →"
              />
            </section>
          )}

          {step === 14 && (
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

              <div className="rounded-2xl bg-white px-5 py-4 text-ink-900 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-ink-900">Hazırlık skoru</span>
                  <span className="text-lg font-black text-ink-900 tabular-nums">
                    %{displayScore}
                    {sealReady && (
                      <span className="ml-2 text-xs font-black text-emerald-700">✓ Mühürlemeye hazır</span>
                    )}
                  </span>
                </div>
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${displayScore}%`,
                      background:
                        sealReady
                          ? "linear-gradient(90deg,#16a34a,#22c55e)"
                          : "linear-gradient(90deg,#946A1E,#BD6A3E)",
                    }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold sm:grid-cols-3">
                  <div className="rounded-lg bg-neutral-100 px-3 py-2">
                    <div className="text-neutral-500">Doluluk</div>
                    <div className="mt-0.5 text-sm font-black text-ink-900 tabular-nums">%{coverageScore}</div>
                  </div>
                  <div className="rounded-lg bg-neutral-100 px-3 py-2">
                    <div className="text-neutral-500">Tutarlılık</div>
                    <div className="mt-0.5 text-sm font-black text-ink-900 tabular-nums">%{consistencyScore}</div>
                  </div>
                  <div className="col-span-2 rounded-lg bg-neutral-100 px-3 py-2 sm:col-span-1">
                    <div className="text-neutral-500">Uyarı</div>
                    <div className="mt-0.5 text-sm font-black text-ink-900 tabular-nums">{warningCount}</div>
                  </div>
                </div>
                <p className="mt-2 text-xs font-medium text-ink-600">
                  Doluluk: alanlar girildi mi. Tutarlılık: mutabakat kontrolleri geçti mi. Bir denklik
                  kontrolü tutmuyorsa doluluk tam olsa bile skor %100&apos;ün altında kalır.
                </p>
              </div>

              {annexIIDirectOnly !== null && (
                <div
                  className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white/90 border border-white/15"
                >
                  {annexIIDirectOnly
                    ? "Bu sektörde yalnızca doğrudan emisyon fiyatlanır — elektrik tüketiminiz sertifika maliyetine girmez."
                    : "Bu sektörde hem doğrudan emisyon hem elektrik tüketimi fiyatlanır."}
                </div>
              )}

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

              {!hasBlockingQc(qc) && result.readinessScore === 100 && !CBAM_SEAL_V2_READY && (
                <p className="rounded-2xl p-4 text-sm sm:text-base font-semibold" style={{ background: T.amberWash, color: "#5C4310" }}>
                  SKDM mühürlü paket üretimi; resmî iletişim şablonu ve hesaplama otoritesi kayıtları tamamlanana kadar geçici olarak kapalıdır. Verileriniz çalışmada saklı kalır; mühürleme açıldığında ödeme ve indirme buradan devam eder.
                </p>
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

              {sealedName && <PackageDownloads zipName={sealedName} varyant={sealedVaryant} pkg={sealedPkg} />}
              <NavRow onBack={() => setStep(13)} isDark={true} />
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
