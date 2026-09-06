"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileStack, Loader2, LockKeyhole, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  activateMaritimeFile,
  listMaritimeFiles,
  reloadMaritimeFile,
  saveMaritimeFile,
  MaritimeBackendError,
  type MaritimeReportSummary,
} from "@/lib/maritime/backend-client";
import type { MaritimePreparationFile } from "@/lib/maritime/types";

const RECOVERY_KEY = "skdmhesapla-maritime-preparation-v2";
const TEB232_EMAIL = "teb232@gmail.com";

export function MaritimeReportSwitcher() {
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<MaritimeReportSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    if (loading || !user || user.isAnonymous) return;
    setLoadingReports(true);
    setLoadError(null);
    try {
      const response = await listMaritimeFiles();
      setReports(response.reports || []);
    } catch (error) {
      setReports([]);
      setLoadError(error instanceof Error ? error.message : "Denizcilik raporları sunucudan alınamadı.");
    } finally {
      setLoadingReports(false);
    }
  }, [loading, user]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const active = useMemo(() => reports.find((x) => x.active) || null, [reports]);
  const isTeb232 = String(user?.email || "").toLowerCase() === TEB232_EMAIL;
  const scenarioReports = useMemo(
    () => reports.filter((report) => /^SCN\s+\d+/i.test(String(report.demoScenario || report.shipName || ""))),
    [reports],
  );

  if (!user || user.isAnonymous) return null;

  const persistRecoveryDraft = async (report: MaritimeReportSummary) => {
    if (report.status === "locked") return;
    const raw = window.localStorage.getItem(RECOVERY_KEY);
    if (!raw) return;
    const file = JSON.parse(raw) as MaritimePreparationFile;
    if (Number(file.reportingYear) !== report.reportingYear) return;

    const latest = await reloadMaritimeFile(report.context);
    try {
      await saveMaritimeFile(report.context, file, latest.revision);
    } catch (error) {
      if (!(error instanceof MaritimeBackendError) || error.code !== "REVISION_CONFLICT") throw error;
      const retry = await reloadMaritimeFile(report.context);
      await saveMaritimeFile(report.context, file, retry.revision);
    }
  };

  const change = async (shipId: string) => {
    const target = reports.find((x) => x.context.shipId === shipId);
    if (!target || target.active || busy) return;
    setBusy(true);
    setNote("Aktif rapordaki son değişiklikler sunucuya sabitleniyor…");
    try {
      if (active) await persistRecoveryDraft(active);
      setNote("Rapor değiştiriliyor…");
      await activateMaritimeFile(target.context);
      window.localStorage.removeItem(RECOVERY_KEY);
      const url = new URL(window.location.href);
      url.searchParams.set("year", String(target.reportingYear));
      window.location.assign(url.toString());
    } catch (error) {
      setBusy(false);
      setNote(error instanceof Error ? error.message : "Rapor değiştirilemedi.");
    }
  };

  if (reports.length < 2 && !isTeb232 && !loadError) return null;

  return <section className="border-b border-line bg-[#eef3e8] px-4 py-3 print:hidden">
    <div className="mx-auto max-w-7xl rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900"><FileStack className="h-5 w-5"/></div>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[.14em] text-brand-800">Denizcilik raporları</p>
            <p className="truncate text-sm font-black text-ink-900">{active ? `${active.shipName} · ${active.reportingYear}` : `${reports.length} rapor`}</p>
            <p className="text-[11px] font-semibold text-ink-500">
              {loadError || note || `${reports.length} sunucu raporu${isTeb232 ? ` · ${scenarioReports.length} regresyon senaryosu` : ""} · seçim öncesi aktif taslak revision kontrollü kaydedilir.`}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          {(busy || loadingReports) && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-800"/>}
          {reports.length > 0 && <select
            aria-label="Denizcilik raporu seç"
            value={active?.context.shipId || ""}
            onChange={(event) => void change(event.target.value)}
            disabled={busy || loadingReports}
            className="min-h-11 min-w-0 rounded-xl border border-line bg-white px-3 text-sm font-black text-ink-900 disabled:opacity-50 sm:min-w-[320px]"
          >
            {reports.map((report) => <option key={`${report.context.shipId}-${report.reportingYear}`} value={report.context.shipId}>
              {report.shipName} · {report.reportingYear} · {report.status === "locked" ? "Kilitli" : `Rev ${report.revision}`}
            </option>)}
          </select>}
          <button
            type="button"
            onClick={() => void loadReports()}
            disabled={busy || loadingReports}
            aria-label="Denizcilik raporlarını yenile"
            title="Sunucu raporlarını yenile"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-ink-600 hover:bg-brand-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loadingReports ? "animate-spin" : ""}`}/>
          </button>
          {active?.status === "locked" && <LockKeyhole className="h-4 w-4 shrink-0 text-ink-500"/>}
        </div>
      </div>

      {isTeb232 && <div className="mt-4 border-t border-line pt-4" data-testid="teb232-regression-scenarios">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[.12em] text-ink-800">TEB232 test senaryoları</p>
            <p className="mt-0.5 text-[11px] font-semibold text-ink-500">Sunucu tarafından dönen BLOCK regresyon kayıtları burada açık şekilde listelenir.</p>
          </div>
          <span className="rounded-full border border-line bg-[#f7f9f5] px-3 py-1 text-xs font-black text-ink-700">{scenarioReports.length} / 9 senaryo</span>
        </div>

        {scenarioReports.length > 0 ? <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {scenarioReports.map((report) => {
            const label = String(report.demoScenario || report.shipName);
            const selected = report.active;
            return <button
              type="button"
              key={`scenario-${report.context.shipId}-${report.reportingYear}`}
              onClick={() => void change(report.context.shipId)}
              disabled={busy || loadingReports || selected}
              className={`min-h-[72px] rounded-xl border px-3 py-2 text-left transition ${selected ? "border-brand-800 bg-brand-50" : "border-line bg-[#fbfcfa] hover:border-brand-300 hover:bg-brand-50/60"} disabled:cursor-default`}
            >
              <span className="block text-xs font-black leading-5 text-ink-900">{label}</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[.08em] text-rose-700">BLOCK · {report.reportingYear} · {report.status === "locked" ? "Kilitli" : `Rev ${report.revision}`}</span>
            </button>;
          })}
        </div> : <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">
          TEB232 hesabına bağlı senaryo listesi bu oturumda sunucudan dönmedi. Yukarıdaki yenile düğmesi `/api/maritime/files` listesini yeniden çağırır.
        </div>}
      </div>}
    </div>
  </section>;
}
