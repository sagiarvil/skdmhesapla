import { Suspense } from "react";
import type { Metadata } from "next";
import { SkdmWizard } from "@/components/wizard/SkdmWizard";
import { PcfWizard } from "@/components/pcf/PcfWizard";
import { VerificationGuidanceNotice } from "@/components/regulatory/VerificationGuidanceNotice";
import { pageMetadata } from "@/lib/skdm/seo";
import { CBAM_VERIFICATION_WORKFLOW } from "@/lib/skdm/verification-workflow";
import { SKDM_RULESET_VERSION } from "@/lib/skdm/config";

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

const TIER_A = new Set([
  "demir-celik",
  "aluminyum",
  "cimento",
  "gubre",
  "elektrik",
  "hidrojen",
]);

export function generateStaticParams() {
  return SECTORS.map((sector) => ({ sector }));
}

/** GATE-R (RM-006): dinamik rota da anasayfa metadata'sını miras almaz — canonical kendi yolu. */
export function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  return params.then(({ sector }) =>
    pageMetadata({
      path: `/hesapla/${sector}/`,
      title: `${sector.split("-").join(" ")} SKDM dosyası`,
      description: "Sektörünüze özel SKDM veri girişi, kalite kontrolleri ve mühürlü paket üretimi.",
    })
  );
}

export default async function HesaplaSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector } = await params;
  if (!TIER_A.has(sector)) {
    return (
      <div className="min-h-screen bg-brand-50 py-4 sm:py-8">
        <div className="mx-auto max-w-5xl px-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Ürün karbon ayak izi raporunu üretim verilerinizle hazırlayın.
          </h1>
        </div>
        <Suspense fallback={<div className="mx-auto max-w-5xl px-6 py-16 font-semibold text-ink-700">Karbon raporu çalışma alanı hazırlanıyor…</div>}>
          <PcfWizard sectorSlug={sector} />
        </Suspense>
      </div>
    );
  }

  const regulatoryContext = {
    calculationRulesetVersion: SKDM_RULESET_VERSION,
    verificationWorkflowVersion: CBAM_VERIFICATION_WORKFLOW.version,
    calculationImpact: CBAM_VERIFICATION_WORKFLOW.calculationImpact,
    guidancePublishedAt: CBAM_VERIFICATION_WORKFLOW.sourcePublishedAt,
    registryAccessFrom: CBAM_VERIFICATION_WORKFLOW.registryAccessFrom,
    verificationReportsFrom: CBAM_VERIFICATION_WORKFLOW.verificationReportsFrom,
    declarantsManualPublishedAt: CBAM_VERIFICATION_WORKFLOW.declarantsManualPublishedAt,
  };

  return (
    <div className="pasaport-zemin-acik min-h-screen bg-[#f7f9f5] py-4 sm:py-8">
      <script
        id="skdm-calculation-regulatory-context"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(regulatoryContext) }}
      />
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <VerificationGuidanceNotice compact />
      </div>
      <SkdmWizard sectorSlug={sector} />
    </div>
  );
}
