import { SkdmWizard } from "@/components/wizard/SkdmWizard";

const SECTORS = [
  // Kademe A — SKDM zorunlu kapsam
  "demir-celik",
  "aluminyum",
  "cimento",
  "gubre",
  "elektrik",
  "hidrojen",
  // Kademe B/C — tedarikçi veri dosyası (ISO 14067)
  "batarya",
  "ambalaj",
  "gida",
  "lojistik",
  "plastik",
  "kimya",
  "cam",
  "tekstil",
  "makine",
  "otomotiv",
  "elektronik",
  "mobilya",
  "kagit",
  "yapi",
] as const;

export function generateStaticParams() {
  return SECTORS.map((sector) => ({ sector }));
}

export default async function HesaplaSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector } = await params;
  return (
    <div className="pasaport-zemin-acik">
      <SkdmWizard sectorSlug={sector} />
    </div>
  );
}
