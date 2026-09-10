import type { Metadata } from "next";
import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Scale,
  Ship,
  ShieldCheck,
} from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { MaritimeHeroBackgroundDrawing } from "@/components/maritime/MaritimeHeroBackgroundDrawing";
import { MaritimeHeroVisual } from "@/components/maritime/MaritimeHeroVisual";
import { MaritimeWaveDivider } from "@/components/maritime/MaritimeWaveDivider";
import { MaritimeLanding } from "@/components/maritime/MaritimeLanding";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/",
  title: "AB Denizcilik Karbon Rejimi: EU ETS, FuelEU ve THETIS-MRV Uyum Portalı | SKDMHesapla",
  description:
    "Türkiye-AB seferlerinde shipping company, armatör ve ISM/DOC şirketleri için EU MRV, EU ETS ve FuelEU Maritime kapsam, hesaplama, kanıt kontrolü ve 1 gemi + 1 raporlama yılı için 399 USD doğrulamaya hazırlık çalışma paketi.",
});

const quickLinks = [
  ["EU ETS Denizcilik", "/denizcilik/eu-ets/"],
  ["EU MRV / THETIS", "/denizcilik/eu-mrv/"],
  ["FuelEU Maritime", "/denizcilik/fueleu/"],
  ["Ücretsiz kapsam kontrolü", "/denizcilik/kapsam-kontrolu/"],
] as const;

export default function DenizcilikPage() {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <RegistryJsonLd route="/denizcilik/" />

      <section className="relative overflow-hidden border-b border-sky-950/40 bg-gradient-to-b from-[#020b14] via-[#05192d] to-[#082942] pb-0 pt-12 text-white sm:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.25),transparent_70%)]"
        />
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-20 left-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <MaritimeHeroBackgroundDrawing />

        <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-sky-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-cyan-300 shadow-md backdrop-blur-sm">
            <Anchor className="h-3.5 w-3.5 text-cyan-400" />
            <span>AB Denizcilik Karbon Rejimi · 2026 ETS tam phase-in · FuelEU Maritime</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            AB Denizcilik Karbon Rejimi:{" "}
            <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              EU ETS, FuelEU ve THETIS-MRV
            </span>{" "}
            Uyum Portalı
          </h1>

          <div className="mt-6 max-w-3xl rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-[#071e33]/95 via-[#092944]/85 to-[#04121f]/90 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-400 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
                Mevzuat çerçevesi ve rol sınırı
              </span>
              <span className="font-mono text-[11px] font-bold tracking-wider text-cyan-200/90">
                EU MRV · EU ETS · FuelEU Maritime
              </span>
            </div>
            <p className="mt-2.5 text-sm font-medium leading-relaxed text-sky-100/95 sm:text-base">
              SKDMHesapla; gemi, sefer, yakıt, BDN ve kanıt verilerini düzenler; kapsam ve hesaplama izini oluşturur ve çalışma paketini bağımsız doğrulamaya hazırlar. Resmî doğrulama akredite verifier tarafından, EUA teslimi ve resmî kayıt işlemleri ilgili AB sistemlerinde yürütülür.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-cyan-300">MRV kapsamı</span>
              <strong className="mt-1 block text-sm font-black text-white">Gemi + sefer + aktivite</strong>
              <span className="block text-[10px] text-slate-300">CO₂ · CH₄ · N₂O</span>
            </div>
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-950/40 p-3 backdrop-blur-sm">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-emerald-300">2026 ETS</span>
              <strong className="mt-1 block text-sm font-black text-emerald-200">%100 phase-in</strong>
              <span className="block text-[10px] text-emerald-300/80">Coğrafi kapsam ayrıca uygulanır</span>
            </div>
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/40 p-3 backdrop-blur-sm">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-cyan-300">FuelEU</span>
              <strong className="mt-1 block text-sm font-black text-cyan-200">WtW GHG yoğunluğu</strong>
              <span className="block text-[10px] text-cyan-300/80">Yakıt ve enerji kanıtı</span>
            </div>
            <div className="rounded-xl border border-sky-400/20 bg-sky-950/40 p-3 backdrop-blur-sm">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-sky-300">Hazırlık kapısı</span>
              <strong className="mt-1 block text-sm font-black text-sky-200">Verifier-ready</strong>
              <span className="block text-[10px] text-sky-300/80">Verifier görüşü değildir</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="rounded-2xl border-2 border-cyan-400/40 bg-gradient-to-br from-[#061d31]/95 to-[#041525]/95 p-5 text-white shadow-xl">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-400 px-2.5 py-0.5 text-[11px] font-black uppercase text-slate-950">
                <Ship className="h-3.5 w-3.5" /> Armatör / Shipping Company / ISM Company
              </div>
              <h2 className="mt-3 text-lg font-black text-white">1 gemi + 1 raporlama yılı: 399 USD</h2>
              <p className="mt-2 text-sm leading-relaxed text-sky-100/90">
                EU MRV, EU ETS ve FuelEU Maritime için kapsam, hesaplama, kanıt zinciri ve doğrulamaya hazırlık çalışma alanını tek akışta yönetin.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/denizcilik/dosya-hazirla/" className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300">
                  Çalışmayı başlat <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/denizcilik/kapsam-kontrolu/" className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20">
                  Ücretsiz kapsam kontrolü
                </Link>
              </div>
            </article>

            <article className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-[#241a06]/95 to-[#171004]/95 p-5 text-white shadow-xl">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-2.5 py-0.5 text-[11px] font-black uppercase text-slate-950">
                <Scale className="h-3.5 w-3.5" /> Türk ihracatçısı / yük sahibi
              </div>
              <h2 className="mt-3 text-lg font-black text-white">Denizcilik maliyeti ile CBAM ürün emisyonunu ayırın.</h2>
              <p className="mt-2 text-sm leading-relaxed text-amber-100/90">
                Navlun ve denizcilik ETS maliyetini, ürünün fabrika çıkışı CBAM gömülü emisyon verisiyle karıştırmadan ayrı iş akışlarında yönetin.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/cbam-hesaplama/" className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-300">
                  Karasal CBAM hesabı <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/denizcilik/" className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white">
                  Denizcilik çalışma alanı
                </Link>
              </div>
            </article>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2 text-xs font-bold" aria-label="Denizcilik hızlı bağlantıları">
            {quickLinks.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-lg border border-sky-400/30 bg-sky-950/60 px-3 py-2 text-sky-200 transition hover:bg-sky-900">
                {label} →
              </Link>
            ))}
          </nav>

          <MaritimeHeroVisual />

          <div className="mx-auto mt-4 max-w-4xl rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-semibold leading-5 text-slate-300">
            <ShieldCheck className="mr-2 inline h-4 w-4 text-cyan-300" />
            ARPA/radar konsolu ürün akışını ve veri ilişkilerini açıklayan etkileşimli demonstrasyondur; canlı AIS, seyir cihazı veya gemi trafik hizmeti değildir.
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3 pb-10">
            <Link href="/denizcilik/dosya-hazirla/" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-black text-slate-950 shadow-lg transition hover:bg-cyan-300">
              <FileCheck2 className="h-4 w-4" /> 399 USD uyum çalışmasını başlat
            </Link>
            <Link href="/denizcilik/kapsam-kontrolu/" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15">
              <CheckCircle2 className="h-4 w-4" /> Önce ücretsiz kapsamı kontrol et
            </Link>
          </div>
        </div>

        <MaritimeWaveDivider />
      </section>

      <div className="[&>section:first-child]:hidden">
        <MaritimeLanding />
      </div>
    </main>
  );
}
