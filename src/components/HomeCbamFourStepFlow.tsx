import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileCheck2,
  FileSpreadsheet,
  Factory,
  Search,
} from "lucide-react";

const steps = [
  {
    no: "01",
    title: "GTİP / CN kapsamını netleştirin",
    text: "Ürün adıyla tahmin etmeyin. 8 haneli CN/GTİP kodunu doğrulayın ve doğru CBAM rotasına geçin.",
    Icon: Search,
    tone: "emerald",
    card: "border-emerald-200 bg-emerald-50/55",
    badge: "border-emerald-200 bg-emerald-100 text-emerald-800",
    titleTone: "text-emerald-800",
    line: "bg-emerald-500",
  },
  {
    no: "02",
    title: "Üretim ve kanıt verisini toplayın",
    text: "Dönem, tesis, süreç, enerji-yakıt, üretim miktarı, precursor ve kanıt kayıtlarını doğru kaynaktan toplayın.",
    Icon: Factory,
    tone: "sky",
    card: "border-sky-200 bg-sky-50/55",
    badge: "border-sky-200 bg-sky-100 text-sky-800",
    titleTone: "text-sky-800",
    line: "bg-sky-500",
  },
  {
    no: "03",
    title: "Emisyonu ve hesap izini oluşturun",
    text: "Doğrudan, uygulanabilir dolaylı ve precursor emisyonlarını kesin dönem metodolojisiyle hesaplayın; her adımı izlenebilir tutun.",
    Icon: FileCheck2,
    tone: "orange",
    card: "border-orange-200 bg-orange-50/55",
    badge: "border-orange-200 bg-orange-100 text-orange-800",
    titleTone: "text-orange-700",
    line: "bg-orange-500",
  },
  {
    no: "04",
    title: "Alıcı ve doğrulayıcı hazırlığını tamamlayın",
    text: "Communication Template, hesaplama eki, kanıt zinciri ve doğrulayıcı çalışma dosyalarını aynı veri zincirinden hazırlayın.",
    Icon: FileSpreadsheet,
    tone: "violet",
    card: "border-violet-200 bg-violet-50/55",
    badge: "border-violet-200 bg-violet-100 text-violet-800",
    titleTone: "text-violet-700",
    line: "bg-violet-500",
  },
] as const;

const outcomes = [
  { no: "01", title: "Kapsam kararı", text: "Doğru GTİP, doğru rota", tone: "text-emerald-800", bg: "bg-emerald-50", ring: "border-emerald-200", line: "bg-emerald-500" },
  { no: "02", title: "Veri zinciri", text: "Kimden ne istenir?", tone: "text-sky-800", bg: "bg-sky-50", ring: "border-sky-200", line: "bg-sky-500" },
  { no: "03", title: "Hesap izi", text: "Kanıtlanabilir çıktı", tone: "text-orange-700", bg: "bg-orange-50", ring: "border-orange-200", line: "bg-orange-500" },
  { no: "04", title: "Teslim hazırlığı", text: "Alıcı ve doğrulayıcıya hazır", tone: "text-violet-700", bg: "bg-violet-50", ring: "border-violet-200", line: "bg-violet-500" },
] as const;

export function HomeCbamFourStepFlow() {
  return (
    <section className="border-b border-line bg-[#fbfcfa] py-12 sm:py-16" aria-labelledby="cbam-four-step-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="overflow-hidden rounded-[32px] border border-[#dfe7dc] bg-gradient-to-br from-white via-white to-[#f5faf3] p-5 shadow-[0_24px_70px_rgba(22,49,35,.08)] sm:p-8 lg:p-10">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-800 sm:text-sm">CBAM RAPORU → 4 ADIMDA HAZIRLIK</p>
            <h2 id="cbam-four-step-title" className="mt-4 max-w-4xl text-3xl font-black leading-[1.08] tracking-tight text-[#10233f] sm:text-5xl">
              “CBAM raporunu gönderin” talebini 4 ana fazda yönetin.
            </h2>
            <p className="mt-4 max-w-4xl text-sm font-medium leading-7 text-[#647067] sm:text-lg">
              İçeride 15 kontrollü mikro adım çalışır; kullanıcı tarafında süreç dört anlaşılır faza ayrılır: kapsam, veri zinciri, hesaplama ve teslim hazırlığı.
            </p>
          </div>

          <div className="mt-9 grid gap-4 xl:grid-cols-[1fr_1.08fr_1fr] xl:items-stretch">
            <div className="grid gap-4">
              {steps.slice(0, 2).map((step) => {
                const Icon = step.Icon;
                return (
                  <article key={step.no} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${step.card}`}>
                    <span className={`absolute inset-y-0 right-0 w-1 ${step.line}`} />
                    <div className="flex items-start gap-4">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-xl font-black shadow-sm ${step.badge}`}>{step.no}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${step.titleTone}`} />
                          <h3 className={`text-base font-black leading-6 sm:text-lg ${step.titleTone}`}>{step.title}</h3>
                        </div>
                        <p className="mt-2 text-sm font-medium leading-6 text-[#59645d]">{step.text}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-[30px] border border-emerald-400/30 bg-gradient-to-br from-[#0f7a45] via-[#0b8b49] to-[#075f37] p-7 text-center text-white shadow-[0_22px_60px_rgba(8,104,58,.24)] sm:p-10">
              <div className="absolute -left-20 top-4 h-56 w-56 rounded-full border border-white/10" />
              <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full border border-white/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.14),transparent_35%)]" />
              <div className="relative">
                <span className="inline-flex rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-black shadow-inner">SKDMHesapla</span>
                <h3 className="mt-6 text-3xl font-black leading-tight sm:text-4xl">Doğrulamaya hazırlık veri zinciri</h3>
                <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-6 text-emerald-50 sm:text-base">
                  GTİP kapsamı · veri ve kanıt · emisyon hesabı · Communication Template ve doğrulayıcı handoff
                </p>
                <div className="mx-auto mt-6 h-px w-16 bg-emerald-200/70" />
                <p className="mt-5 text-xs font-bold leading-5 text-emerald-100">
                  Sistem akredite doğrulama görüşü vermez; alıcı ve bağımsız doğrulayıcı için izlenebilir çalışma dosyasını hazırlar.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {steps.slice(2).map((step) => {
                const Icon = step.Icon;
                return (
                  <article key={step.no} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${step.card}`}>
                    <span className={`absolute inset-y-0 left-0 w-1 ${step.line}`} />
                    <div className="flex items-start gap-4">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-xl font-black shadow-sm ${step.badge}`}>{step.no}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${step.titleTone}`} />
                          <h3 className={`text-base font-black leading-6 sm:text-lg ${step.titleTone}`}>{step.title}</h3>
                        </div>
                        <p className="mt-2 text-sm font-medium leading-6 text-[#59645d]">{step.text}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((item) => (
              <div key={item.no} className={`relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm ${item.ring}`}>
                <span className={`absolute inset-x-0 bottom-0 h-1 ${item.line}`} />
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${item.bg} ${item.ring} ${item.tone}`}><Check className="h-5 w-5" /></span>
                  <div>
                    <p className={`text-sm font-black ${item.tone}`}>{item.no} · {item.title}</p>
                    <p className="mt-1 text-xs font-semibold text-[#69736c]">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-[#e3e9e1] pt-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-3xl border-l-4 border-emerald-400 pl-4 text-sm font-medium leading-6 text-[#5e6962] sm:text-base">
              Dört faz kullanıcıya süreci sade anlatır; hesaplama motoru ve kalite kapıları arka planda bu fazları 15 kontrollü mikro adıma ayırır.
            </p>
            <Link href="/nasil-calisir/" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#0d2340] px-6 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#071a31]">
              CBAM dosya akışını inceleyin <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
