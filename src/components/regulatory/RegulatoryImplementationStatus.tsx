import type { RegulatoryUpdate } from "@/lib/skdm/regulatory-updates";

const statusLabel = {
  IMPLEMENTED: "SKDMHesapla'ya işlendi",
  ACTION_REQUIRED: "Ürün kontrolü / aksiyon gerekli",
  MONITORING: "İzlemede",
} as const;

const impactLabel = {
  NONE: "Hesaplama etkisi yok",
  WORKFLOW_ONLY: "Operasyon / workflow etkisi",
  REFERENCE_DATA: "Referans veri / hesap girdisi etkisi",
  METHODOLOGY_REVIEW: "Metodoloji / motor mutabakatı gerekli",
} as const;

const layerLabel = {
  WIRED: "Bağlı",
  PARTIAL: "Kısmi",
  NOT_REQUIRED: "Gerekli değil",
  PENDING: "Bekliyor",
} as const;

export function RegulatoryImplementationStatus({ item }: { item: RegulatoryUpdate }) {
  const implementation = item.implementation;
  const isImplemented = item.productStatus === "IMPLEMENTED";

  return (
    <section className="py-6 sm:py-8" aria-label="Mevzuat uygulama durumu">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className={`rounded-3xl border-2 p-5 sm:p-6 ${isImplemented ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/60"}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-ink-600">SSOT → motor → kullanıcı ekranı → status</p>
              <h2 className="mt-1 text-xl font-black text-ink-900">Uygulama zinciri</h2>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-xs font-black ${isImplemented ? "bg-emerald-700 text-white" : "bg-amber-700 text-white"}`}>
              {statusLabel[item.productStatus]}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/80 bg-white p-4">
              <p className="text-[11px] font-black uppercase tracking-wide text-ink-500">Değişiklik türü</p>
              <p className="mt-1 text-sm font-bold text-ink-900">{impactLabel[implementation.calculationImpact]}</p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white p-4">
              <p className="text-[11px] font-black uppercase tracking-wide text-ink-500">Hesap / motor katmanı</p>
              <p className="mt-1 text-sm font-bold text-ink-900">{layerLabel[implementation.engineState]}</p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white p-4">
              <p className="text-[11px] font-black uppercase tracking-wide text-ink-500">Kullanıcı ekranı</p>
              <p className="mt-1 text-sm font-bold text-ink-900">{layerLabel[implementation.uiState]}</p>
            </div>
          </div>

          {implementation.blockingGaps.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-white p-4">
              <h3 className="text-sm font-black text-amber-900">Kapanmadan IMPLEMENTED olamaz</h3>
              <ul className="mt-2 space-y-2 text-sm font-medium leading-6 text-ink-700">
                {implementation.blockingGaps.map((gap) => <li key={gap}>• {gap}</li>)}
              </ul>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-bold text-emerald-900">
              Bu kayıt için tanımlı uygulama kanıtları tamamlandı; bloklayıcı açık madde bulunmuyor.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
