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
import {
  DEFAULT_ETS_QUARTER,
  ETS_PRICE_QUARTERLY,
  PADDLE_SEAL_PRICE_TRY,
  SKDM_SECTORS,
} from "@/lib/skdm/config";
import {
  FIELD_HELP_DB,
  filledFieldRatio,
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
};

/** Prototip stepDefs birebir (ödeme UI yok — mühürleme kalsın). */
const STEPS = [
  { n: 0, label: "Ne isteniyor?", sub: "Triyaj" },
  { n: 1, label: "Firma ve dönem", sub: "A.1+A.2" },
  { n: 2, label: "Mal kategorileri", sub: "A.4(a)" },
  { n: 3, label: "Üretim süreçleri", sub: "A.4(b)" },
  { n: 4, label: "Kaynak akışları", sub: "B_EmInst" },
  { n: 5, label: "Üretim seviyesi", sub: "D_Processes" },
  { n: 6, label: "Öncül maddeler", sub: "E_PurchPrec" },
  { n: 7, label: "Doğrulayıcı", sub: "A.3" },
  { n: 8, label: "Karbon fiyatlandırma", sub: "Ticari" },
  { n: 9, label: "Belgeler", sub: "Kalite kontrolü" },
  { n: 10, label: "Nihai inceleme", sub: "Mühürleme" },
] as const;

const TRIAGE = ["E-posta", "Excel dosyası", "PDF/form", "Sözlü talep", "Hiçbir şey", "Bilmiyorum"] as const;

const DOC_CHECKS = [
  { name: "Elektrik faturası", ok: true, note: "Veri kaynağı olarak kullanılabilir" },
  { name: "ISO 14064 belgesi", ok: false, note: "CBAM doğrulaması yerine geçmez — gözden geçirin" },
  { name: "Üretim Excel'i", ok: true, note: "Hesaplama kaynağı; doğrulamada destek gerekebilir" },
] as const;

function defaultFieldValues(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [id, cfg] of Object.entries(FIELD_HELP_DB.fields)) {
    out[id] = cfg.default !== undefined ? String(cfg.default) : "";
  }
  return out;
}

function NavRow({
  step,
  onBack,
  onNext,
  nextLabel = "Devam",
}: {
  step: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {onBack && (
        <button type="button" className="text-sm underline" onClick={onBack}>
          Geri
        </button>
      )}
      {onNext && (
        <button
          type="button"
          className="inline-flex min-h-ctl items-center rounded-ctl bg-brand-500 px-4 text-sm font-semibold text-brand-900"
          onClick={onNext}
        >
          {nextLabel}
        </button>
      )}
      <span className="self-center text-[10px] text-ink-600">
        Katman {step} / 10
      </span>
    </div>
  );
}

export function SkdmWizard({ sectorSlug }: { sectorSlug: string }) {
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
  const [remoteOk, setRemoteOk] = useState<boolean | null>(null);
  const [sealedName, setSealedName] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const draft = loadSessionDraft(sectorSlug);
    if (!draft) return;
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
  }, [sectorSlug]);

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

  const volume = Math.max(1, Number(fieldValues.tonaj) || 1000);
  const year = Number(fieldValues.yil) || 2026;
  const quarter = DEFAULT_ETS_QUARTER;
  const trNet = Number(fieldValues.mahsup) || 0;
  const sectorBench = SKDM_SECTORS[sectorId] || SKDM_SECTORS["iron-steel"];

  /** Tesis register'ı (B AD+method veya E SEE) → gerçek beyan yolu; aksi mühür %100'e çıkmaz. */
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
  /** A.3 geçiş: "henüz atanmadı" bilinçli beyan = hazırlık kanıtı tamam. */
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

  const trackedIds = [
    ...layerFieldIds("katman1"),
    ...layerFieldIds("katman5"),
    ...layerFieldIds("katman8"),
  ];
  const uiScore = useMemo(() => {
    let score = filledFieldRatio(fieldValues, trackedIds) * 0.45;
    score += Math.min(12, goods.length * 4);
    score += Math.min(10, processes.length * 4);
    score += Math.min(10, streams.length * 3);
    score += Math.min(10, precs.length * 4);
    if (dA > 0 && !dFinding) score += 8;
    if (!eFinding && precs.length > 0) score += 5;
    score += DOC_CHECKS.filter((d) => d.ok).length * 3;
    return Math.min(100, Math.round(score));
  }, [fieldValues, trackedIds, goods, processes, streams, precs, dA, dFinding, eFinding]);

  const missing = useMemo(() => {
    const items: { name: string; action: string; copy?: string }[] = [];
    if (!fieldValues.tesisAdiEN?.trim()) {
      items.push({
        name: "Tesis adı (İngilizce)",
        action: "Talep oluştur (kopyala)",
        copy: getField("tesisAdiEN")?.delegationTemplate,
      });
    }
    if (goods.length === 0) items.push({ name: "Mal kategorisi (G)", action: "Katman 2'de ekleyin" });
    if (processes.length === 0) items.push({ name: "Üretim süreci (P1–P10)", action: "Katman 3'te ekleyin" });
    if (streams.length === 0) items.push({ name: "Kaynak akışı (B_EmInst)", action: "Katman 4'te ekleyin" });
    if (dA <= 0) items.push({ name: "Üretim seviyesi (a)", action: "Üretimden iste" });
    if (dFinding) items.push({ name: "D_Processes denkliği", action: "Gözden geçirin" });
    if (eFinding) items.push({ name: "E_PurchPrec denkliği", action: "Gözden geçirin" });
    for (const f of registerFindings) {
      if (f.severity === "blocking") items.push({ name: f.code, action: "Gözden geçirin" });
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

  const handleSeal = async () => {
    if (sealBlocked) return;
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
      // İndirme yine yapılır; kayıt CF tarafında sonraki denemede tamamlanabilir
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

  const fmt = (n: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <div className={`${jetbrains.variable} mx-auto max-w-container space-y-6 px-5 py-10 sm:px-6`}>
      {resumeBanner && (
        <div className="rounded-ctl border border-brand-500/40 bg-brand-100 px-4 py-3 text-sm text-ink-900">
          Kaldığınız yerden devam ediyorsunuz — taslak otomatik yüklendi.
          <button type="button" className="ml-3 text-xs underline" onClick={() => setResumeBanner(false)}>
            Gizle
          </button>
        </div>
      )}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{sector.name} — SKDM çalışma dosyası</h1>
          <p className="text-sm text-ink-600">{sector.applicableRegulation}</p>
        </div>
        <div className="min-w-[200px] rounded-card border border-line bg-white p-3 shadow-card">
          <div className="flex justify-between text-xs text-ink-600">
            <span>Hazırlık skoru</span>
            <span className="font-mono text-base font-semibold text-brand-800">{uiScore}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${uiScore}%` }} />
          </div>
        </div>
      </header>

      <nav className="flex flex-wrap gap-1.5" aria-label="Sihirbaz adımları">
        {STEPS.map((s) => (
          <button
            key={s.n}
            type="button"
            onClick={() => setStep(s.n)}
            className={`rounded-ctl border px-2 py-1.5 text-left text-[10px] sm:text-xs ${
              step === s.n
                ? "border-brand-500 bg-brand-100 text-ink-900"
                : s.n < step
                  ? "border-brand-800/30 bg-white text-brand-800"
                  : "border-line bg-white text-ink-600"
            }`}
          >
            <span className="font-mono font-bold">{String(s.n).padStart(2, "0")}</span> {s.label}
          </button>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {step === 0 && (
            <section className="rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Alıcınız sizden ne istedi?</h2>
              <p className="mt-1 text-sm text-ink-600">Triyaj — doğru katman sırasını birlikte çıkarırız.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {TRIAGE.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setTriage(o)}
                    className={`rounded-ctl border px-3 py-3 text-sm ${
                      triage === o
                        ? "border-brand-500 bg-brand-100 font-semibold"
                        : "border-line bg-brand-100/30"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {triage && (
                <p className="mt-4 rounded-ctl bg-brand-100 px-3 py-2 text-sm text-ink-900">
                  {triage === "Hiçbir şey" || triage === "Bilmiyorum"
                    ? "Sorun değil — önce ürününüzün SKDM kapsamında olup olmadığını kontrol edip, ne istendiğini birlikte çıkaracağız."
                    : `"${triage}" içinden sizden ne istendiğini birlikte çıkaralım — sonraki katmanlarda ilgili alanlar sırayla önünüze gelecek.`}
                </p>
              )}
              <NavRow step={0} onNext={() => setStep(1)} />
            </section>
          )}

          {step === 1 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-900">Firma ve dönem</h2>
              <p className="text-xs text-ink-600">Resmi şablon: A.1 + A.2</p>
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
            <section className="rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Mal kategorileri (G)</h2>
              <p className="text-xs text-ink-600">Resmi şablon: A.4(a)</p>
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
            <section className="rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Üretim süreçleri (P1–P10)</h2>
              <p className="text-xs text-ink-600">Resmi şablon: A.4(b) — bubble approach</p>
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
            <section className="rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Kaynak akışları</h2>
              <p className="text-xs text-ink-600">Resmi şablon: B_EmInst — Method / AD / NCV</p>
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
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-900">Üretim seviyesi (D_Processes)</h2>
              <p className="text-xs text-ink-600">Resmi şablon: D_Processes (a)-(e)</p>
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
                className={`rounded-ctl border px-3 py-2 text-sm ${
                  dFinding
                    ? "border-accent-yellow bg-accent-yellow/15 text-ink-900"
                    : dA > 0
                      ? "border-accent-green bg-accent-green/10 text-ink-900"
                      : "border-line bg-white text-ink-600"
                }`}
              >
                (e) Kontrol: (b+c+d)={dB + dC + dD} {dFinding ? "≠" : "="} (a)={dA}
                {dFinding ? ` — ${dFinding.message}` : ""}
              </div>
              <NavRow step={5} onBack={() => setStep(4)} onNext={() => setStep(6)} />
            </section>
          )}

          {step === 6 && (
            <section className="rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Öncül maddeler (E_PurchPrec)</h2>
              <p className="text-xs text-ink-600">Resmi şablon: E_PurchPrec (a)-(e)</p>
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
                className={`mt-3 rounded-ctl border px-3 py-2 text-sm ${
                  eFinding
                    ? "border-accent-yellow bg-accent-yellow/15 text-ink-900"
                    : precs.some((p) => p.total > 0)
                      ? "border-accent-green bg-accent-green/10 text-ink-900"
                      : "border-line bg-white text-ink-600"
                }`}
              >
                E kontrol: her satırda (tesis içi + diğer) = toplam
                {eFinding ? ` — ${eFinding.message}` : ""}
              </div>
              <NavRow step={6} onBack={() => setStep(5)} onNext={() => setStep(7)} />
            </section>
          )}

          {step === 7 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-900">Doğrulayıcı bilgisi</h2>
              <p className="text-xs text-ink-600">Resmi şablon: A.3 — geçiş döneminde opsiyonel</p>
              <label className="flex items-center gap-3 rounded-ctl border border-line bg-white px-3 py-2 text-sm">
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
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink-900">Karbon fiyatlandırması</h2>
              <p className="text-xs text-ink-600">Reg. 2023/956 Md. 9</p>
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
            <section className="rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Belgeler ve kalite kontrolü</h2>
              <ul className="mt-3 space-y-2">
                {DOC_CHECKS.map((d) => (
                  <li
                    key={d.name}
                    className={`rounded-ctl border px-3 py-2 text-sm ${
                      d.ok
                        ? "border-accent-green/40 bg-accent-green/10"
                        : "border-accent-yellow bg-accent-yellow/15"
                    }`}
                  >
                    <b>{d.name}</b>
                    <div className="text-xs text-ink-600">
                      {d.ok ? "✓" : "!"} {d.note}
                    </div>
                  </li>
                ))}
              </ul>
              <NavRow
                step={9}
                onBack={() => setStep(8)}
                onNext={() => setStep(10)}
                nextLabel="Nihai incelemeye geç"
              />
            </section>
          )}

          {step === 10 && (
            <section className="space-y-4 rounded-card border border-line border-t-[3px] border-t-brand-500 bg-brand-950 p-6 text-white shadow-card">
              <h2 className="text-lg font-bold">Nihai inceleme ve mühürleme</h2>
              <p className="font-mono text-4xl font-bold text-brand-500">{fmt(result.importerCostEur)}</p>
              <p className="text-sm text-brand-mist">
                ETS {ETS_PRICE_QUARTERLY[quarter]} € · {quarter} · UI skor %{uiScore} · motor hazırlık %
                {result.readinessScore}
              </p>
              {dFinding && (
                <p className="rounded-ctl border border-accent-yellow bg-accent-yellow/20 px-3 py-2 text-xs">
                  Katman 5 kontrol denkliği tamamlanmadı — mühürleme engelli. Gözden geçirin.
                </p>
              )}
              {eFinding && (
                <p className="rounded-ctl border border-accent-yellow bg-accent-yellow/20 px-3 py-2 text-xs">
                  Katman 6 E_PurchPrec denkliği tamamlanmadı — mühürleme engelli. Gözden geçirin.
                </p>
              )}
              {registerFindings
                .filter((f) => f.severity === "blocking")
                .map((f) => (
                  <p
                    key={f.code}
                    className="rounded-ctl border border-accent-yellow bg-accent-yellow/20 px-3 py-2 text-xs"
                  >
                    {f.message}
                  </p>
                ))}
              {qc
                .filter((f) => f.severity === "blocking" || f.severity === "warning")
                .map((f) => (
                  <p
                    key={f.code}
                    className="rounded-ctl border border-accent-yellow bg-accent-yellow/20 px-3 py-2 text-xs"
                  >
                    {f.message}
                  </p>
                ))}
              <button
                type="button"
                disabled={sealBlocked}
                onClick={handleSeal}
                className="inline-flex min-h-ctl items-center rounded-ctl bg-brand-500 px-4 text-sm font-bold text-brand-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Paketi Mühürle — {PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR")} ₺ (KDV dahil)
              </button>
              <p className="text-[11px] text-brand-mist">
                Ödeme entegrasyonu bu planda yok; mühürleme motoru çalışır. Paddle eşitlemesi ayrı iş.
              </p>
              {sealedName && <PackageDownloads zipName={sealedName} />}
              <NavRow step={10} onBack={() => setStep(9)} />
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-card border border-line bg-white p-4 shadow-card">
            <b className="text-sm text-ink-900">Şu anda eksik olanlar</b>
            <ul className="mt-3 space-y-2">
              {missing.length === 0 ? (
                <li className="text-xs text-ink-600">Zorunlu alanlar tamamlandı.</li>
              ) : (
                missing.map((m, i) => (
                  <li
                    key={m.name}
                    className="flex flex-col gap-1 rounded-ctl border border-accent-yellow/30 bg-accent-yellow/10 px-2 py-2 text-xs"
                  >
                    <span>
                      {i + 1}. {m.name}
                    </span>
                    <button
                      type="button"
                      className="self-start rounded-ctl bg-brand-800 px-2 py-1 text-[10px] font-semibold text-white"
                      onClick={async () => {
                        if (m.copy) await navigator.clipboard.writeText(m.copy);
                      }}
                    >
                      {m.copy ? "Talep oluştur (kopyala)" : m.action}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="rounded-card border border-line bg-brand-100 p-4 text-xs text-ink-900">
            <b>Yönetici özeti</b>
            <p className="mt-2 leading-relaxed">
              Adım {step}/10 · skor %{uiScore} · G{goods.length} P{processes.length} B{streams.length} E
              {precs.length}
            </p>
            <p className="mt-1 text-[10px] text-ink-600">
              Taslak 10 sn · localStorage
              {remoteOk === true
                ? " · Firestore skdm_sessions OK"
                : remoteOk === false
                  ? " · Firestore henüz yanıt vermedi (yerel güvende)"
                  : " · uzak senkron bekleniyor"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
