import Link from "next/link";
import {
  BatteryHigh,
  Package,
  Leaf,
  Boat,
  Flask,
  Drop,
  TShirt,
  Factory,
  Car,
  Cpu,
  Armchair,
  FileText,
  Stack,
  type Icon,
} from "@phosphor-icons/react";
import GtipArama from "@/components/GtipArama";
import { SKDM_SECTORS, type SectorBenchmark } from "@/lib/skdm/config";

// /basla/ v3 — Phosphor duotone premium ikonlar (Plan 23)

const TIER_BC_ICONS: Record<string, Icon> = {
  battery: BatteryHigh,
  packaging: Package,
  food: Leaf,
  lojistik: Boat,
  plastics: Package,
  chemicals: Flask,
  glass: Drop,
  textile: TShirt,
  machinery: Factory,
  automotive: Car,
  electronics: Cpu,
  furniture: Armchair,
  paper: FileText,
  construction: Stack,
};

export default function BaslaPage() {
  const tierA = Object.values(SKDM_SECTORS).filter((s) => s.tier === "A").slice(0, 6);
  const tierBC = Object.values(SKDM_SECTORS).filter((s) => s.tier === "B" || s.tier === "C");

  return (
    <div className="pasaport-zemin-acik bg-soft-section">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="space-y-3 text-center">
          <h1 className="font-extrabold text-ink-900">
            Dosyanızı başlatalım.
          </h1>
          <p className="mx-auto max-w-xl text-ink-600">
            Ürününüzü yazın ya da aşağıdan durumunuzu seçin — gerisini sistem yönlendirir.
            Mühür öncesi her şey ücretsizdir.
          </p>
        </div>

        <div className="mt-8 rounded-card border border-line bg-white p-5 shadow-card sm:p-6">
          <GtipArama />
        </div>

        <div className="my-8 flex items-center gap-4 text-sm text-ink-600">
          <span className="h-px flex-1 bg-line" />
          veya durumunuzu seçin
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold text-ink-900">AB'ye 6 sektörde satıyorum</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              Demir-çelik, alüminyum, çimento, gübre, elektrik veya hidrojen — SKDM sizin için
              zorunlu. Alıcınız verinizi isteyecek.
            </p>
            <ul className="mt-4 space-y-2">
              {tierA.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/hesapla/${slugFromSectorId(s.id)}/`}
                    className="flex items-center justify-between rounded-ctl border border-line px-4 py-3 text-sm font-semibold text-ink-900 transition hover:border-brand-500 hover:bg-brand-100/40"
                  >
                    {s.name}
                    <span className="font-mono text-xs text-ink-600">CN: {s.cnCodes[0]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card border border-line bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold text-ink-900">Alıcım benden karbon verisi istedi</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              Başka bir sektördeyseniz çıktı SKDM raporu değildir; ISO 14067 mantığında tedarikçi
              veri dosyasıdır. Aynı adımlar, aynı kalite kontrolleri.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-2">
              {tierBC.map((s) => (
                <KademeBcSatir key={s.id} sector={s} />
              ))}
            </ul>
          </section>
        </div>

        <p className="mt-8 text-center text-sm text-ink-600">
          Emin değil misiniz?{" "}
          <Link href="/rehber/#kapsam" className="font-semibold text-brand-800 underline">
            3 soruda kapsam kontrolü
          </Link>
          {" — ya da "}
          <Link href="/nasil-calisir/" className="font-semibold text-brand-800 underline">
            önce nasıl çalıştığına bakın
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function KademeBcSatir({ sector }: { sector: SectorBenchmark }) {
  const IconBilesen = TIER_BC_ICONS[sector.id] || Package;
  return (
    <li>
      <Link
        href={`/hesapla/${sector.id}/`}
        className="flex items-center gap-3 rounded-ctl border border-line px-4 py-2.5 text-sm font-medium text-ink-900 transition hover:border-brand-800 hover:bg-brand-100/40"
      >
        <IconBilesen size={20} weight="duotone" className="shrink-0 text-brand-800" aria-hidden />
        {sector.name}
      </Link>
    </li>
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
