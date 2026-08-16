import { SkdmWizard } from "@/components/wizard/SkdmWizard";

const SECTORS = ["demir-celik", "aluminyum", "cimento", "gubre", "elektrik", "hidrojen"] as const;

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
