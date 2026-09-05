"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, FileCheck2, FileUp, Hash, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { loadMaritimeWorkspace, type MaritimeFileState, type MaritimeWorkspaceContext } from "@/lib/maritime/backend-client";
import {
  downloadMaritimeEvidence,
  listMaritimeEvidence,
  uploadMaritimeEvidence,
  verifyMaritimeEvidence,
  type MaritimeEvidenceDocument,
  type MaritimeEvidenceList,
  type MaritimeEvidenceRegistryItem,
} from "@/lib/maritime/evidence-client";

const SUPPORT_LABELS: Record<string, string> = {
  "mrv-monitoring": "EU MRV · Monitoring Plan",
  "mrv-activity-data": "EU MRV · voyage/activity data",
  "mrv-data-gap": "EU MRV · data-gap/surrogate data",
  "mrv-fuel-consumption": "EU MRV · fuel consumption",
  "mrv-emission-factor": "EU MRV · emission factor",
  "mrv-measurement": "EU MRV · measurement/calibration",
  "mrv-emissions": "EU MRV · reported emissions",
  "mrv-responsibility": "EU MRV · company responsibility",
  "ets-geographic-scope": "EU ETS · geographic scope",
  "ets-emissions": "EU ETS · EUA/emissions calculation",
  "ets-responsibility": "EU ETS · company responsibility",
  "fueleu-monitoring": "FuelEU · Monitoring Plan",
  "fueleu-voyage-scope": "FuelEU · voyage/port-call scope",
  "fueleu-data-gap": "FuelEU · data-gap/surrogate energy",
  "fueleu-fuel-energy": "FuelEU · fuel/energy input",
  "fueleu-fuel-factor": "FuelEU · fuel factor/sustainability",
  "fueleu-ghg-intensity": "FuelEU · GHG intensity",
  "fueleu-ops": "FuelEU · OPS/electricity",
  "fueleu-ice-exclusion": "FuelEU · ice exclusion",
  "fueleu-measurement": "FuelEU · measurement/calibration",
  "verifier-data-flow": "Verifier · IT/data-flow control",
  "verifier-handoff": "Verifier · handoff/review package",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function contextYear() {
  if (typeof window === "undefined") return 2026;
  const q = new URLSearchParams(window.location.search);
  return Number(q.get("year")) || 2026;
}

function publishCoverage(list: MaritimeEvidenceList) {
  window.dispatchEvent(new CustomEvent("maritime-evidence-coverage", {
    detail: {
      coverage: list.coverage,
      references: Object.fromEntries(
        list.registry.map((entry) => {
          const latest = list.documents.find((doc) => doc.documentType === entry.key);
          return [entry.key, latest ? `${latest.evidenceId} · sha256:${latest.sha256}` : ""];
        }),
      ),
      manifestHash: list.manifestHash,
      chainHead: list.chainHead,
    },
  }));
}

export function MaritimeEvidenceVault() {
  const [context, setContext] = useState<MaritimeWorkspaceContext | null>(null);
  const [fileState, setFileState] = useState<MaritimeFileState | null>(null);
  const [list, setList] = useState<MaritimeEvidenceList | null>(null);
  const [selectedType, setSelectedType] = useState("monitoring-plan");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentDate, setDocumentDate] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceReference, setSourceReference] = useState("");
  const [notes, setNotes] = useState("");
  const [supports, setSupports] = useState<string[]>([]);
  const [linkedVoyageIds, setLinkedVoyageIds] = useState<string[]>([]);
  const [linkedFuelIds, setLinkedFuelIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const registry = list?.registry || [];
  const selectedRegistry = registry.find((item) => item.key === selectedType) || null;

  const refresh = async (ctx = context) => {
    if (!ctx) return;
    const fresh = await listMaritimeEvidence(ctx);
    setList(fresh);
    publishCoverage(fresh);
  };

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        setLoading(true);
        const workspace = await loadMaritimeWorkspace(contextYear());
        if (cancelled) return;
        setContext(workspace.context);
        setFileState(workspace.fileState);
        const evidence = await listMaritimeEvidence(workspace.context);
        if (cancelled) return;
        setList(evidence);
        publishCoverage(evidence);
        const first = evidence.registry[0];
        if (first) {
          setSelectedType(first.key);
          setSupports(first.defaultSupports);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Kanıt kasası açılamadı.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void boot();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedRegistry) return;
    setSupports(selectedRegistry.defaultSupports);
    setLinkedVoyageIds([]);
    setLinkedFuelIds([]);
  }, [selectedRegistry?.key]);

  const voyageOptions = fileState?.file?.voyages || [];
  const fuelOptions = fileState?.file?.fuels || [];
  const docsByType = useMemo(() => {
    const map = new Map<string, MaritimeEvidenceDocument[]>();
    for (const doc of list?.documents || []) {
      const rows = map.get(doc.documentType) || [];
      rows.push(doc);
      map.set(doc.documentType, rows);
    }
    return map;
  }, [list]);

  const toggle = (current: string[], value: string, checked: boolean) => checked
    ? [...new Set([...current, value])]
    : current.filter((x) => x !== value);

  const upload = async () => {
    if (!context || !selectedFile || !documentDate || !sourceName.trim() || supports.length === 0) {
      setError("Dosya, belge tarihi, kaynak ve desteklenen hesaplama/veri zinciri zorunludur.");
      return;
    }
    setError(null);
    setMessage(null);
    setUploading(true);
    setProgress(0);
    try {
      const evidence = await uploadMaritimeEvidence(context, selectedFile, {
        documentType: selectedType,
        documentDate,
        sourceName: sourceName.trim(),
        sourceReference: sourceReference.trim(),
        notes: notes.trim(),
        supports,
        linkedVoyageIds,
        linkedFuelIds,
      }, setProgress);
      setMessage(`Belge değişmez kanıt zincirine alındı · sha256 ${evidence.sha256.slice(0, 16)}…`);
      setSelectedFile(null);
      setDocumentDate("");
      setSourceReference("");
      setNotes("");
      setLinkedVoyageIds([]);
      setLinkedFuelIds([]);
      await refresh(context);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Belge yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  const verify = async (doc: MaritimeEvidenceDocument) => {
    if (!context) return;
    setVerifyingId(doc.evidenceId);
    setError(null);
    try {
      const result = await verifyMaritimeEvidence(context, doc.evidenceId);
      setMessage(`Bütünlük doğrulandı · sha256 ${result.sha256.slice(0, 16)}…`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bütünlük doğrulaması başarısız.");
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) {
    return <div className="rounded-2xl border border-line bg-[#f8faf6] p-6 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-800"/><p className="mt-3 text-sm font-black">Kanıt kasası ve hash zinciri yükleniyor…</p></div>;
  }

  return <div className="space-y-6">
    {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">{error}</div>}
    {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{message}</div>}

    <div className="rounded-2xl border border-brand-900/15 bg-[#f8faf6] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-brand-800">Immutable evidence vault</p>
          <h3 className="mt-1 text-xl font-black">Belgenin kendisini yükleyin; checkbox kanıt değildir.</h3>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-ink-600">Her belge sunucuda parçalara ayrılarak alınır, her parça SHA-256 ile doğrulanır, nihai dosya server-side tekrar birleştirilir ve SHA-256 + Storage checksum + tarih + kaynak + mevzuat türü + desteklediği hesaplama kayıtlarıyla değişmez zincire bağlanır.</p>
        </div>
        {list && <div className="rounded-xl border border-line bg-white px-4 py-3 text-right"><p className="text-[10px] font-black uppercase tracking-wider text-ink-500">Evidence manifest</p><p className="mt-1 font-mono text-xs font-bold">{list.manifestHash.slice(0, 16)}…</p><p className="mt-1 text-[10px] text-ink-500">{list.documents.length} belge</p></div>}
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      {registry.map((item) => {
        const count = Number(list?.coverage[item.key] || 0);
        return <button key={item.key} type="button" onClick={() => setSelectedType(item.key)} className={`rounded-2xl border p-4 text-left transition ${selectedType === item.key ? "border-brand-900 bg-brand-100/60" : "border-line bg-white"}`}>
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black">{item.label}</p><p className="mt-1 text-[11px] font-semibold leading-5 text-ink-600">{item.legalBasis.join(" · ")}</p></div>{count > 0 ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black text-emerald-800"><CheckCircle2 className="h-3 w-3"/>{count}</span> : <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">AÇIK</span>}</div>
        </button>;
      })}
    </div>

    <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-900"><FileUp className="h-5 w-5"/></span><div><p className="text-xs font-black uppercase tracking-wider text-brand-800">Yeni kanıt</p><h3 className="font-black">{selectedRegistry?.label || "Belge"}</h3></div></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-black sm:col-span-2">Dosya<input type="file" accept=".pdf,.txt,.log,.csv,.xml,.jpg,.jpeg,.png,.xlsx,.xls,.docx" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="mt-2 block w-full rounded-xl border border-line bg-[#f8faf6] p-3 text-sm font-semibold" /></label>
        <label className="text-sm font-black">Belge tarihi<input type="date" value={documentDate} onChange={(e) => setDocumentDate(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-line bg-[#f8faf6] px-3 font-semibold" /></label>
        <label className="text-sm font-black">Kaynak / düzenleyen<input value={sourceName} onChange={(e) => setSourceName(e.target.value)} placeholder="Bunker supplier, ship logbook, verifier, cihaz üreticisi…" className="mt-2 min-h-11 w-full rounded-xl border border-line bg-[#f8faf6] px-3 font-semibold" /></label>
        <label className="text-sm font-black sm:col-span-2">Kaynak belge referansı<input value={sourceReference} onChange={(e) => setSourceReference(e.target.value)} placeholder="BDN no, certificate no, logbook page, Monitoring Plan version…" className="mt-2 min-h-11 w-full rounded-xl border border-line bg-[#f8faf6] px-3 font-semibold" /></label>
        <label className="text-sm font-black sm:col-span-2">Not / açıklama<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-line bg-[#f8faf6] p-3 font-semibold" /></label>
      </div>

      <div className="mt-5">
        <p className="text-sm font-black">Hangi hesaplama / veri zincirini destekliyor?</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(SUPPORT_LABELS).map(([key, label]) => <label key={key} className="flex items-start gap-2 rounded-xl border border-line bg-[#f8faf6] p-3 text-xs font-bold"><input type="checkbox" checked={supports.includes(key)} onChange={(e) => setSupports((s) => toggle(s, key, e.target.checked))} className="mt-0.5"/><span>{label}</span></label>)}</div>
      </div>

      {voyageOptions.length > 0 && <div className="mt-5"><p className="text-sm font-black">Bağlı sefer kayıtları</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{voyageOptions.map((voyage, i) => <label key={voyage.id} className="flex items-start gap-2 rounded-xl border border-line bg-[#f8faf6] p-3 text-xs font-bold"><input type="checkbox" checked={linkedVoyageIds.includes(voyage.id)} onChange={(e) => setLinkedVoyageIds((s) => toggle(s, voyage.id, e.target.checked))}/><span>Sefer {i + 1} · {voyage.departurePort || "?"} → {voyage.arrivalPort || "?"}</span></label>)}</div></div>}
      {fuelOptions.length > 0 && <div className="mt-5"><p className="text-sm font-black">Bağlı yakıt / enerji kayıtları</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{fuelOptions.map((fuel, i) => <label key={fuel.id} className="flex items-start gap-2 rounded-xl border border-line bg-[#f8faf6] p-3 text-xs font-bold"><input type="checkbox" checked={linkedFuelIds.includes(fuel.id)} onChange={(e) => setLinkedFuelIds((s) => toggle(s, fuel.id, e.target.checked))}/><span>Yakıt {i + 1} · {fuel.fuelType || "?"} · BDN {fuel.bdnReference || "-"}</span></label>)}</div></div>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => void upload()} disabled={uploading || !selectedFile} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-900 px-5 text-sm font-black text-white disabled:opacity-40">{uploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <FileUp className="h-4 w-4"/>}{uploading ? `Yükleniyor · %${progress}` : "Belgeyi kanıt zincirine al"}</button>
        {uploading && <div className="min-w-48 flex-1"><div className="h-2 overflow-hidden rounded-full bg-brand-100"><div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }}/></div></div>}
      </div>
    </div>

    <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-800"/><div><p className="text-xs font-black uppercase tracking-wider text-brand-800">Chain of custody</p><h3 className="font-black">Yüklenen değişmez kanıtlar</h3></div></div><button type="button" onClick={() => void refresh()} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line px-3 text-xs font-black"><RefreshCw className="h-3.5 w-3.5"/>Yenile</button></div>
      <div className="mt-4 space-y-3">{(list?.documents || []).length === 0 ? <p className="rounded-xl bg-[#f8faf6] p-4 text-sm font-semibold text-ink-600">Henüz binary kanıt yüklenmedi.</p> : (list?.documents || []).map((doc) => <div key={doc.evidenceId} className="rounded-2xl border border-line bg-[#f8faf6] p-4">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-black">{doc.documentLabel}</p><p className="mt-1 text-xs font-semibold text-ink-600">{doc.originalName} · {formatBytes(doc.size)} · {doc.documentDate} · {doc.sourceName}</p><p className="mt-2 break-all font-mono text-[11px] font-bold text-ink-700"><Hash className="mr-1 inline h-3 w-3"/>sha256:{doc.sha256}</p><p className="mt-1 break-all font-mono text-[10px] text-ink-500">chain:{doc.evidenceChainHash}</p></div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-800"><FileCheck2 className="h-3 w-3"/>VERIFIED AT INGEST</span></div>
        <div className="mt-3 flex flex-wrap gap-2">{doc.supports.map((support) => <span key={support} className="rounded-full border border-line bg-white px-2 py-1 text-[10px] font-bold">{SUPPORT_LABELS[support] || support}</span>)}</div>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => void verify(doc)} disabled={verifyingId === doc.evidenceId} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-brand-900 px-3 text-xs font-black text-brand-900">{verifyingId === doc.evidenceId ? <Loader2 className="h-3.5 w-3.5 animate-spin"/> : <ShieldCheck className="h-3.5 w-3.5"/>}Hash'i yeniden doğrula</button><button type="button" onClick={() => context && void downloadMaritimeEvidence(context, doc)} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-xs font-black"><Download className="h-3.5 w-3.5"/>Yetkili indir</button></div>
      </div>)}</div>
    </div>
  </div>;
}
