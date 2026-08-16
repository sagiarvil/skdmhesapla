import Link from "next/link";
import {
  Battery,
  Boxes,
  Car,
  Factory,
  FileText,
  FlaskConical,
  Leaf,
  Package,
  Ship,
  Sofa,
  Shirt,
  Layers,
  Cpu,
  Droplets,
  type LucideIcon,
} from "lucide-react";
import { CiftDalga } from "@/components/brand/CiftDalga";
import { SKDM_SECTORS, type SectorBenchmark } from "@/lib/skdm/config";

const GUVEN_CHIPLERI = [
  "AB 2023/956 & 2025/2083 uyumlu",
  "Deterministik motor",
  "SHA-256 mühürlü",
] as const;

const TIER_BC_ICONS: Record<string, LucideIcon> = {
  battery: Battery,
  packaging: Package,
  food: Leaf,
  logistics: Ship,
  plastics: Boxes,
  chemicals: FlaskConical,
  glass: Droplets,
  textile: Shirt,
  machinery: Factory,
  automotive: Car,
  electronics: Cpu,
  furniture: Sofa,
  paper: FileText,
  construction: Layers,
};

export default function HomePage() {
  const tierA = Object.values(SKDM_SECTORS).filter((s) => s.tier === "A").slice(0, 6);
  const tierBC = Object.values(SKDM_SECTORS).filter((s) => s.tier === "B" || s.tier === "C");

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="pasaport-zemin-koyu relative flex bg-brand-950 bg-hero-sahne">
            <div className="relative z-[1] mx-auto flex w-full max-w-container flex-col justify-center gap-4 px-5 py-8 sm:gap-5 sm:px-6 sm:py-10 lg:ml-auto lg:mr-0 lg:max-w-[560px] lg:px-10 lg:py-12">
              <span className="inline-flex w-fit items-center rounded-pill bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-500">
                SKDM / CBAM maliyet hesaplayıcı
              </span>
              <p className="inline-flex w-fit max-w-xl items-center rounded-pill border border-brand-500/35 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-500">
                Mühür öncesi her şey ücretsiz — kart istenmez.
              </p>
              <h1 className="max-w-xl text-[26px] font-bold leading-[32px] tracking-[-0.02em] text-white sm:text-[34px] sm:leading-[42px]">
                AB&apos;ye sattığınız ürünün karbon raporunu yardım almadan hazırlayın.
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-brand-mist sm:text-[15px] sm:leading-6">
                CN kodunuzu seçin veya arayın, adımları tamamlayın; alıcınızın üstleneceği tahmini SKDM
                sertifika maliyetini ve denetime hazırlık dosyanızı dakikalar içinde alın.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/basla/"
                  className="inline-flex min-h-ctl items-center rounded-ctl bg-brand-500 px-5 text-sm font-semibold text-brand-900 hover:bg-brand-100 sm:text-base"
                >
                  Hesaplamaya Başla
                </Link>
                <Link
                  href="/nasil-calisir/"
                  className="hero-ghost-border inline-flex min-h-ctl items-center rounded-ctl px-5 text-sm font-semibold text-brand-mist hover:bg-brand-500/10 sm:text-base"
                >
                  Nasıl Çalışır?
                </Link>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {GUVEN_CHIPLERI.map((metin) => (
                  <li
                    key={metin}
                    className="inline-flex items-center gap-1.5 rounded-pill border border-brand-500/20 bg-brand-950/50 px-2.5 py-1 text-[11px] text-brand-mist"
                  >
                    <span className="font-bold text-accent-green" aria-hidden>
                      ✓
                    </span>
                    {metin}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden bg-brand-mist-light sm:min-h-[320px] lg:min-h-full">
            <img
              src="/desen/hero-illus-bayrak-A-fistik.png"
              alt="AB ve Türkiye — kurdele el sıkışma"
              width={1536}
              height={976}
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain object-center"
            />
          </div>
        </div>
        <div className="relative z-[2] -mt-1">
          <CiftDalga yon="asagi" dolguSinif="text-white" sinifAdi="h-16 sm:h-20" />
        </div>
      </section>

      <section className="pasaport-zemin-acik bg-soft-section py-14 sm:py-24">
        <div className="mx-auto max-w-container space-y-8 px-5 sm:px-6">
          <h2 className="text-2xl font-bold text-ink-900 sm:text-[32px] sm:leading-10">
            SKDM doğrudan kapsamı (Kademe A)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tierA.map((s) => (
              <Link
                key={s.id}
                href={`/hesapla/${slugFromSectorId(s.id)}/`}
                className="rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-5 shadow-card transition hover:border-brand-500"
              >
                <div className="font-semibold text-ink-900">{s.name}</div>
                <div className="mt-1 text-sm text-ink-600">CN: {s.cnCodes[0]}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pasaport-zemin-acik bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-container space-y-6 px-5 sm:px-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-[28px]">
              Zorunlu değil ama alıcınız isteyebilir
            </h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Bu 14 sektör için çıktı SKDM raporu değildir. ISO 14067 mantığında tedarikçi veri
              dosyası çerçevesidir — alıcı talebine bağlıdır.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tierBC.map((s) => (
              <KademeBcKart key={s.id} sector={s} />
            ))}
          </div>
          <Link href="/rehber/#kademe-b" className="inline-flex text-sm font-semibold text-brand-800 underline">
            Kademe B/C rehberine git →
          </Link>
        </div>
      </section>
    </div>
  );
}

function KademeBcKart({ sector }: { sector: SectorBenchmark }) {
  const Icon = TIER_BC_ICONS[sector.id] || Package;
  return (
    <Link
      href="/rehber/#kademe-b"
      className="flex gap-3 rounded-card border border-line bg-brand-100/40 p-4 transition hover:border-brand-800"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-800" strokeWidth={1.5} aria-hidden />
      <div>
        <div className="text-sm font-semibold text-ink-900">{sector.name}</div>
        <div className="mt-0.5 text-[11px] text-ink-600">Alıcı talebine bağlı · tedarikçi veri dosyası</div>
      </div>
    </Link>
  );
}

function slugFromSectorId(id: string): string {
  const map: Record<string, string> = {
    "iron-steel": "demir-celik",
    aluminum: "aluminyum",
    cement: "cimento",
    fertilizer: "gubre",
    electricity: "elektrik",
    hydrogen: "hidrojen",
  };
  return map[id] || id;
}
