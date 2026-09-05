"use client";

import { useEffect, useMemo, useState } from "react";
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

export function MaritimeReportSwitcher() {
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<MaritimeReportSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user || user.isAnonymous) return;
    let live = true;
    void listMaritimeFiles()
      .then((x) => { if (live) setReports(x.reports || []); })
      .catch(() => { if (live) setReports([]); });
    return () => { live = false; };
  }, [loading, user]);

  const active = useMemo(() => reports.find((x) => x.active) || null, [reports]);
  if (!user || user.isAnonymous || reports.length < 2) return null;

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

  return <section className="border-b border-line bg-[#eef3e8] px-4 py-3 print:hidden">
    <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900"><FileStack className="h-5 w-5"/></div>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[.14em] text-brand-800">Denizcilik raporları</p>
          <p className="truncate text-sm font-black text-ink-900">{active ? `${active.shipName} · ${active.reportingYear}` : `${reports.length} rapor`}</p>
          <p className="text-[11px] font-semibold text-ink-500">{note || `${reports.length} sunucu raporu · seçim öncesi aktif taslak revision kontrollü kaydedilir.`}</p>
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        {busy && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-800"/>}
        <select
          aria-label="Denizcilik raporu seç"
          value={active?.context.shipId || ""}
          onChange={(event) => void change(event.target.value)}
          disabled={busy}
          className="min-h-11 min-w-0 rounded-xl border border-line bg-white px-3 text-sm font-black text-ink-900 disabled:opacity-50 sm:min-w-[320px]"
        >
          {reports.map((report) => <option key={`${report.context.shipId}-${report.reportingYear}`} value={report.context.shipId}>
            {report.shipName} · {report.reportingYear} · {report.status === "locked" ? "Kilitli" : `Rev ${report.revision}`}
          </option>)}
        </select>
        {active?.status === "locked" ? <LockKeyhole className="h-4 w-4 shrink-0 text-ink-500"/> : <RefreshCw className="h-4 w-4 shrink-0 text-ink-500"/>}
      </div>
    </div>
  </section>;
}
