import Link from "next/link";
import { Anchor, ArrowRight, CheckCircle2, CircleAlert, FileCheck2, Gauge, Ship, ShieldCheck } from "lucide-react";
import { MaritimeLanding } from "./MaritimeLanding";

function ShipVisual() {
  return (
    <svg viewBox="0 0 720 320" className="tabular-nums h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="hull" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".12" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".32" />
        </linearGradient>
      </defs>
      <path d="M70 211h566l-64 66H172L70 211Z" fill="url(#hull)" />
      <path d="M98 207h486M154 207l30-99h198l36 99M215 108V65h95v43m-47-43V34m0 0 19 17m-19-17-19 17M428 207v-71h106v71M449 136V97h24v39m39 0V82" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 280c92-31 143 31 235 0s143 31 235 0 143 31 202 0" fill="none" stroke="currentColor" strokeWidth="4" opacity=".55" />
      <path d="M10 300c95-22 148 22 242 0s148 22 242 0 148 22 216 0" fill="none" stroke="currentColor" strokeWidth="2" opacity=".25" />
    </svg>
  );
}

const questions = [
  ["Hangi kurala tabiyim?", "EU MRV · EU ETS · FuelEU kapsamını gemi ve rota bazında belirler."],
  ["Ne kadar karbon yükümlülüğüm var?", "ETS kapsam emisyonunu, phase-in'i ve tahmini EUA ihtiyacını hesaplar."],
  ["Hangi belgem eksik?", "BDN, logbook, Monitoring Plan ve verifier kanıtlarını eksik bırakmaz."],
  ["Denetçiye hazır mıyım?", "Kritik veri kapanmadan READY FOR VERIFICATION durumuna geçmez."],
] as const;

export function MaritimeConversionLanding() {
  return (
    <>
      <section className="tabular-nums relative overflow-hidden border-b border-brand-800 bg-[#061712] text-white">
        <div aria-hidden className="tabular-nums absolute inset-0 opacity-[0.10]" style={{ backgroundImage: "url('/desen/guilloche-mesh-koyu.svg')", backgroundSize: "900px" }} />
        <div aria-hidden className="tabular-nums absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-900/70 to-transparent" />

        <div className="tabular-nums relative mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="tabular-nums grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
            <div>
              <div className="tabular-nums inline-flex items-center gap-2 rounded-full border border-brand-500/35 bg-brand-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-brand-500">
                <Anchor className="tabular-nums h-4 w-4" /> AB limanlarına sefer yapan gemi sahipleri ve ISM/DOC şirketleri için
              </div>

              <h1 className="tabular-nums mt-5 max-w-5xl text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl">
                EU MRV, EU ETS ve FuelEU dosyanız denetçiye gitmeden önce burada doğrulamaya hazır hale gelir.
              </h1>

              <p className="tabular-nums mt-6 max-w-4xl text-base font-semibold leading-8 text-slate-200 sm:text-xl">
                SKDMhesapla; geminizin kapsamını belirler, sefer–yakıt–BDN verilerini kontrol eder, EUA yükümlülüğünü ve FuelEU GHG yoğunluğunu hesaplar, eksik kanıtları gösterir ve <strong className="tabular-nums text-white">1 gemi + 1 raporlama yılı</strong> için verifier-ready hazırlık dosyası üretir.
              </p>

              <div className="tabular-nums mt-6 inline-flex items-start gap-3 rounded-2xl border border-accent-yellow/35 bg-accent-yellow/10 px-4 py-3 text-sm font-bold leading-6 text-white">
                <CircleAlert className="tabular-nums mt-0.5 h-5 w-5 shrink-0 text-accent-yellow" />
                <span>Eksik BDN, yanlış rota kapsamı veya tutarsız emisyon verisiyle verifier'a gitmeyin. Sistem kritik eksikleri dosya kapanmadan önce yakalar.</span>
              </div>

              <div className="tabular-nums mt-8 flex flex-wrap gap-3">
                <Link href="/denizcilik/kapsam-kontrolu/" className="tabular-nums inline-flex min-h-14 items-center gap-2 rounded-xl bg-brand-500 px-7 text-base font-black text-brand-950 shadow-xl shadow-black/20 transition hover:-translate-y-0.5">
                  Gemimi ücretsiz kontrol et <ArrowRight className="tabular-nums h-5 w-5" />
                </Link>
                <Link href="/denizcilik/dosya-hazirla/" className="tabular-nums inline-flex min-h-14 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-7 text-base font-black text-white transition hover:bg-white/[0.09]">
                  2026 uyum dosyasını başlat <FileCheck2 className="tabular-nums h-5 w-5" />
                </Link>
              </div>

              <div className="tabular-nums mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-300">
                <span className="tabular-nums inline-flex items-center gap-1.5"><CheckCircle2 className="tabular-nums h-4 w-4 text-brand-500" /> Tam otomasyon</span>
                <span className="tabular-nums inline-flex items-center gap-1.5"><CheckCircle2 className="tabular-nums h-4 w-4 text-brand-500" /> Resmî AB mevzuat izi</span>
                <span className="tabular-nums inline-flex items-center gap-1.5"><CheckCircle2 className="tabular-nums h-4 w-4 text-brand-500" /> Verifier evidence gate</span>
                <span className="tabular-nums inline-flex items-center gap-1.5"><CheckCircle2 className="tabular-nums h-4 w-4 text-brand-500" /> EUA maliyet görünürlüğü</span>
              </div>
            </div>

            <aside className="tabular-nums relative rounded-[2rem] border border-brand-500/20 bg-white/[0.045] p-5 shadow-2xl sm:p-7">
              <div className="tabular-nums flex items-center justify-between gap-4">
                <div>
                  <p className="tabular-nums text-xs font-black uppercase tracking-[.14em] text-brand-500">Maritime Compliance Workbench</p>
                  <p className="tabular-nums mt-1 text-xl font-black">Kapsam → Hesap → Kanıt → Verifier-ready</p>
                </div>
                <span className="tabular-nums flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10 text-brand-500"><Ship className="tabular-nums h-6 w-6" /></span>
              </div>

              <div className="tabular-nums mt-3 text-brand-500"><ShipVisual /></div>

              <div className="tabular-nums grid gap-3 sm:grid-cols-3">
                <div className="tabular-nums rounded-2xl border border-white/10 bg-brand-900/70 p-4"><p className="tabular-nums text-xs font-black text-brand-500">EU MRV</p><p className="tabular-nums mt-1 text-sm font-bold text-white">Emisyon + aktivite + yıllık rapor</p></div>
                <div className="tabular-nums rounded-2xl border border-white/10 bg-brand-900/70 p-4"><p className="tabular-nums text-xs font-black text-brand-500">EU ETS</p><p className="tabular-nums mt-1 text-sm font-bold text-white">EUA yükümlülüğü + € maliyet</p></div>
                <div className="tabular-nums rounded-2xl border border-white/10 bg-brand-900/70 p-4"><p className="tabular-nums text-xs font-black text-brand-500">FuelEU</p><p className="tabular-nums mt-1 text-sm font-bold text-white">WtW GHG yoğunluğu + uyum</p></div>
              </div>

              <div className="tabular-nums mt-4 rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="tabular-nums flex items-center gap-2 text-sm font-black text-white"><ShieldCheck className="tabular-nums h-4 w-4 text-brand-500" /> Hukuki rol sınırı</div>
                <p className="tabular-nums mt-2 text-xs font-semibold leading-5 text-slate-300">SKDMhesapla resmî verifier değildir. Sistem hesaplama, veri kalite kontrolü ve doğrulamaya hazırlık dosyasını oluşturur; bağımsız doğrulama akredite verifier tarafından yürütülür.</p>
              </div>
            </aside>
          </div>

          <div className="tabular-nums mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {questions.map(([title, text], index) => (
              <div key={title} className="tabular-nums rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">
                <div className="tabular-nums flex items-start gap-3">
                  <span className="tabular-nums flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-500">{index === 1 ? <Gauge className="tabular-nums h-4 w-4" /> : index === 3 ? <ShieldCheck className="tabular-nums h-4 w-4" /> : <CheckCircle2 className="tabular-nums h-4 w-4" />}</span>
                  <div><p className="tabular-nums text-sm font-black text-white">{title}</p><p className="tabular-nums mt-1 text-xs font-semibold leading-5 text-slate-300">{text}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="tabular-nums [&>section:first-child]:hidden">
        <MaritimeLanding />
      </div>
    </>
  );
}
