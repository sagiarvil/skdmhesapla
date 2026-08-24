"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Calculator,
  CheckCircle2,
  FileCheck2,
  Network,
  Search,
  ShieldCheck,
  Sliders,
  Users,
} from "lucide-react";
import { track } from "@/lib/skdm/analytics";
import { credential } from "@/lib/skdm/credential";

const CAPABILITIES = [
  {
    icon: Search,
    title: "GTİP / CN kapsam kontrolü",
    text: "Ürün adına göre tahmin yürütmek yerine doğrulanmış CN/GTİP sınıflandırmasını esas alır.",
    tone: "border-sky-200 bg-sky-50/75 text-sky-950",
    iconTone: "bg-sky-100 text-sky-700",
  },
  {
    icon: Sliders,
    title: "Tesis, üretim ve enerji verisi",
    text: "Üretim, yakıt, elektrik ve proses girdilerini aynı çalışma zincirinde toplar; verinin nereden bulunacağını açıklar.",
    tone: "border-emerald-200 bg-emerald-50/75 text-emerald-950",
    iconTone: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Boxes,
    title: "Öncül madde / precursor takibi",
    text: "CBAM kapsamındaki ara girdileri, miktarlarını ve tedarikçi gömülü emisyon bilgisini ürün hesabına bağlar.",
    tone: "border-amber-200 bg-amber-50/80 text-amber-950",
    iconTone: "bg-amber-100 text-amber-700",
  },
  {
    icon: Users,
    title: "Tedarikçi veri koordinasyonu",
    text: "Eksik SEE ve girdi verileri için hangi bilginin kimden isteneceğini gösterir ve veri talebini standardize eder.",
    tone: "border-violet-200 bg-violet-50/80 text-violet-950",
    iconTone: "bg-violet-100 text-violet-700",
  },
  {
    icon: Calculator,
    title: "Gömülü emisyon + maliyet hesabı",
    text: "Doğrudan, dolaylı ve uygulanabilir precursor emisyonlarını hesaplama izinde birleştirir; maliyet senaryosu üretir.",
    tone: "border-rose-200 bg-rose-50/75 text-rose-950",
    iconTone: "bg-rose-100 text-rose-700",
  },
  {
    icon: Network,
    title: "Hesaplama izi ve kanıt zinciri",
    text: "Kullanılan veri, varsayım, kaynak ve hesap adımını birbirine bağlar; sonuçların geriye doğru izlenmesini sağlar.",
    tone: "border-cyan-200 bg-cyan-50/75 text-cyan-950",
    iconTone: "bg-cyan-100 text-cyan-700",
  },
  {
    icon: FileCheck2,
    title: "Alıcı / doğrulayıcı hazırlık paketi",
    text: "Hesap özeti, veri tablosu, kanıt listesi ve çalışma dosyalarını düzenler; denetime hazırlık paketine dönüştürür.",
    tone: "border-indigo-200 bg-indigo-50/75 text-indigo-950",
    iconTone: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: ShieldCheck,
    title: "Kalite kapıları + mühürleme",
    text: "Eksik veya gerekçesiz veriyle mühürlemeyi engeller; tamamlanan paketin bütünlüğünü doğrulanabilir kimlikle korur.",
    tone: "border-lime-200 bg-lime-50/75 text-lime-950",
    iconTone: "bg-lime-100 text-lime-700",
  },
] as const;

export function MethodologyTrustBar() {
  useEffect(() => {
    track("credential_impression", { placement: "homepage_trust_bar" });
  }, []);

  return (
    <>
      <section
        className="w-full border-b border-line bg-gradient-to-r from-[#f4f8f3] via-[#eef6ec] to-[#f4f8f3] py-4 sm:py-5"
        aria-labelledby="methodology-trust-title"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-800 text-white shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span id="methodology-trust-title" className="rounded bg-brand-800/15 px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.14em] text-brand-900">
                    HESAPLAMA METODOLOJİSİ
                  </span>
                  <span className="text-xs font-bold text-ink-600">
                    AB Resmî Tüzüğü (IR 2025/2547) &amp; {credential.credential.standard}
                  </span>
                </div>
                <p className="text-xs font-medium leading-snug text-ink-800 sm:text-[13px]">
                  10 katmanlı veri, hesaplama ve kalite kontrol zinciri; metodoloji sorumlusu gözetiminde geliştirilir.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-line/60 pt-2 sm:gap-3 lg:border-t-0 lg:pt-0">
              <div className="hidden items-center gap-1.5 text-[11px] font-bold text-ink-700 sm:flex">
                {['ISO 14064-1','CBAM 2026','Açık Formül İzi'].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1 rounded-full border border-brand-800/15 bg-white/90 px-2.5 py-1 shadow-2xs">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />{label}
                  </span>
                ))}
              </div>
              <Link
                href={credential.holder.profileUrl}
                onClick={() => track("credential_open", { placement: "homepage_trust_bar" })}
                className="group inline-flex items-center gap-1.5 rounded-xl border border-brand-800/25 bg-white px-3.5 py-1.5 text-xs font-black text-brand-900 shadow-2xs transition hover:bg-brand-800 hover:text-white"
              >
                <span>Yetkinliği ve Kanıtı Doğrula</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-14 sm:py-20" aria-labelledby="capabilities-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-brand-800/20 bg-brand-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-900">
              HESAPLAMADAN DAHA FAZLASI
            </span>
            <h2 id="capabilities-title" className="mt-4 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
              SKDM sürecindeki dağınık veriyi tek çalışma zincirine çevirir.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm font-medium leading-relaxed text-ink-700 sm:text-base">
              GTİP kapsam kararından precursor ve tedarikçi verisine, gömülü emisyon hesabından kanıt izine ve denetime hazırlık paketine kadar kritik adımlar aynı sistemde birbirine bağlanır.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {CAPABILITIES.map(({ icon: Icon, title, text, tone, iconTone }) => (
              <article key={title} className={`rounded-3xl border-2 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${tone}`}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconTone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-black leading-snug">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-3xl border-2 border-brand-800/20 bg-[#071812] p-6 text-white shadow-xl sm:p-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">KARMAŞIK TEDARİK ZİNCİRİ</span>
              <h3 className="mt-2 text-2xl font-black">Precursor verisi “manuel bir not” değil, ayrı hesap katmanıdır.</h3>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-slate-300">
                CBAM kapsamındaki ara girdiler miktar ve tedarikçi SEE bilgisiyle ilişkilendirilir. Veri tedarikçideyse sistem hangi bilginin kimden istenmesi gerektiğini gösterir; gelen veri hesap zincirine taşınır.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link href="/platform-kabiliyetleri/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-black text-emerald-950 transition hover:bg-emerald-200">
                Tüm kabiliyetleri incele <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs font-medium text-slate-400">Akredite doğrulama görüşü veya gümrük onayı değildir.</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
