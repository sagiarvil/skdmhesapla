import { ArrowRight, Radar, ShieldCheck } from "lucide-react";

export function RegulatoryUpdatesHome() {
  return (
    <section
      className="border-b border-line bg-[#f8faf7] py-10 sm:py-14"
      aria-labelledby="regulatory-home-title"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border-2 border-brand-800/15 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-[#f7faf5] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-brand-900">
                <Radar className="h-3.5 w-3.5" />
                SKDM Mevzuat Radarı
              </div>

              <h2
                id="regulatory-home-title"
                className="mt-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl"
              >
                AB SKDM mevzuatını sürekli izliyoruz.
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-ink-700 sm:text-base">
                Uygulama tüzükleri, varsayılan değerler, benchmarklar, doğrulama ve akreditasyon kuralları,
                Komisyon rehberleri ile CBAM Registry/O3CI süreçlerindeki yeni ve değişen hükümleri takip ediyor;
                yalnızca dosyanızı veya hesabınızı etkileyen gelişmeleri yayımlıyoruz.
              </p>

              <div className="mt-4 inline-flex items-start gap-2 text-xs font-semibold leading-relaxed text-ink-600 sm:text-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                <span>Her değişiklik resmî kaynak, uygulama tarihi ve Türk ihracatçıya etkisiyle birlikte sınıflandırılır.</span>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href="https://skdmhesapla.com/mevzuat-guncellemeleri/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-900 px-6 text-sm font-black text-white shadow-md transition hover:bg-brand-800 sm:text-base"
              >
                Mevzuat güncellemelerini incele
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
