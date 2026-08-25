import { Suspense } from "react";
import type { Metadata } from "next";
import { SkdmWizard } from "@/components/wizard/SkdmWizard";
import { WizardAutoScroll } from "@/components/wizard/WizardAutoScroll";
import { PcfWizard } from "@/components/pcf/PcfWizard";
import { VerificationGuidanceNotice } from "@/components/regulatory/VerificationGuidanceNotice";
import { pageMetadata } from "@/lib/skdm/seo";
import { CBAM_VERIFICATION_WORKFLOW } from "@/lib/skdm/verification-workflow";
import { CBAM_DEFAULT_VALUES_RULESET } from "@/lib/skdm/default-values-ruleset";
import { CBAM_DEFINITIVE_GUIDANCE } from "@/lib/skdm/definitive-guidance";
import { SKDM_RULESET_VERSION } from "@/lib/skdm/config";
import {
  EUA_MARKET_OBSERVED_AT,
  EUA_MARKET_REFERENCE_CLOSE_EUR,
  EUA_MARKET_REFERENCE_INTRADAY_HIGH_EUR,
  EUA_MARKET_SCENARIOS,
  EUA_MARKET_SCENARIO_VERSION,
} from "@/lib/skdm/market-scenarios";

const SECTORS = [
  "demir-celik",
  "aluminyum",
  "cimento",
  "gubre",
  "elektrik",
  "hidrojen",
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

export function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  return params.then(({ sector }) =>
    pageMetadata({
      path: `/hesapla/${sector}/`,
      title: `${sector.split("-").join(" ")} SKDM dosyası`,
      description: "Sektörünüze özel SKDM veri girişi, kalite kontrolleri ve doğrulamaya hazırlık dosyası oluşturma akışı.",
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
    definitiveGuidanceVersion: CBAM_DEFINITIVE_GUIDANCE.version,
    definitiveGuidancePublishedAt: CBAM_DEFINITIVE_GUIDANCE.publishedAt,
    calculationLegalAuthority: CBAM_DEFINITIVE_GUIDANCE.legalCalculationAuthority,
    freeAllocationLegalAuthority: CBAM_DEFINITIVE_GUIDANCE.legalFreeAllocationAuthority,
    defaultValuesRulesetVersion: CBAM_DEFAULT_VALUES_RULESET.version,
    defaultValuesDatasetPublishedAt: CBAM_DEFAULT_VALUES_RULESET.datasetPublishedAt,
    defaultValuesLegalBasis: `${CBAM_DEFAULT_VALUES_RULESET.baseAct}; ${CBAM_DEFAULT_VALUES_RULESET.correctingAct}`,
    defaultValuesBoundary: CBAM_DEFAULT_VALUES_RULESET.engineBoundary,
    verificationWorkflowVersion: CBAM_VERIFICATION_WORKFLOW.version,
    verificationCalculationImpact: CBAM_VERIFICATION_WORKFLOW.calculationImpact,
    verificationGuidancePublishedAt: CBAM_VERIFICATION_WORKFLOW.sourcePublishedAt,
    registryAccessFrom: CBAM_VERIFICATION_WORKFLOW.registryAccessFrom,
    verificationReportsFrom: CBAM_VERIFICATION_WORKFLOW.verificationReportsFrom,
    declarantsManualPublishedAt: CBAM_VERIFICATION_WORKFLOW.declarantsManualPublishedAt,
    euaMarketScenarioVersion: EUA_MARKET_SCENARIO_VERSION,
    euaMarketObservedAt: EUA_MARKET_OBSERVED_AT,
    euaMarketReferenceCloseEurPerTco2: EUA_MARKET_REFERENCE_CLOSE_EUR,
    euaMarketReferenceIntradayHighEurPerTco2: EUA_MARKET_REFERENCE_INTRADAY_HIGH_EUR,
    euaMarketScenarios: EUA_MARKET_SCENARIOS,
    euaMarketBoundary: "Piyasa duyarlılık göstergesidir; CBAM sertifika fiyatı değildir.",
  };

  const activeRegulatoryLayers = [
    {
      date: "10 Ağu 2026",
      label: "Düzeltilmiş default values",
      detail: `Ruleset ${CBAM_DEFAULT_VALUES_RULESET.version}`,
    },
    {
      date: "14 Ağu 2026",
      label: "Kesin dönem rehberleri",
      detail: `Guidance ${CBAM_DEFINITIVE_GUIDANCE.version}`,
    },
    {
      date: "21 Ağu 2026",
      label: "Declarants Portal manual",
      detail: "Registry operasyon referansı",
    },
    {
      date: "24 Ağu 2026",
      label: "Verification / accreditation",
      detail: `Workflow ${CBAM_VERIFICATION_WORKFLOW.version}`,
    },
  ] as const;

  return (
    <div className="pasaport-zemin-acik min-h-screen bg-[#f7f9f5] py-4 sm:py-8">
      <script
        id="skdm-calculation-regulatory-context"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(regulatoryContext) }}
      />
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="mb-3 rounded-2xl border border-[#d9e3cf] bg-white p-4 shadow-sm" aria-label="Hesaplama motorunda aktif mevzuat katmanları">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#4e5f35]">Aktif mevzuat / ruleset durumu</p>
              <p className="mt-1 text-sm font-semibold text-[#3c4043]">Kademe A hesaplama akışı aşağıdaki güncel resmî katmanlarla sürümlenmiştir.</p>
            </div>
            <span className="rounded-full bg-[#eef5e8] px-3 py-1 text-xs font-black text-[#355f2d]">Calculation {SKDM_RULESET_VERSION}</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {activeRegulatoryLayers.map((item) => (
              <div key={item.date} className="rounded-xl border border-[#e4eadf] bg-[#f9fbf7] px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-wide text-[#667653]">{item.date}</p>
                <p className="mt-1 text-xs font-extrabold text-[#202124]">{item.label}</p>
                <p className="mt-1 text-[11px] font-semibold leading-4 text-[#5f6368]">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] font-semibold leading-5 text-[#5f6368]">
            Not: 24 Ağustos verifier rehberi hesap formülünü değiştirmez. 10 Ağustos corrected default-values katmanı ayrı sürümlenir; resmî ülke + CN/TARIC tablosu ile sektör fallback değerleri aynı veri kaynağı olarak kabul edilmez.
          </p>
        </div>

        <section className="mb-3 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-4 shadow-sm" aria-labelledby="eua-market-scenario-title">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">EU ETS piyasa sinyali · 24 Ağu 2026</p>
              <h2 id="eua-market-scenario-title" className="mt-1 text-base font-black text-[#202124]">EUA €83,80 kapanışla 30 günlük zirveye çıktı; €85 artık merkez piyasa senaryosu.</h2>
              <p className="mt-1.5 text-xs font-semibold leading-5 text-[#5f6368]">
                Gün içi yüksek €84,43/tCO₂. Bu fiyatlar CBAM sertifika fiyatı değildir; yalnız karbon maliyeti duyarlılığını görmek için kullanılır. Nihai CBAM hesabında sertifika fiyatlama metodolojisi, free allocation adjustment ve üçüncü ülkede ödenmiş karbon fiyatı ayrıca uygulanır.
              </p>
            </div>
            <span className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-black text-amber-900">Senaryo v{EUA_MARKET_SCENARIO_VERSION}</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {EUA_MARKET_SCENARIOS.map((scenario) => (
              <div key={scenario.id} className={`rounded-xl border px-3 py-2 ${scenario.id === "central" ? "border-amber-400 bg-amber-100/70" : "border-amber-200 bg-white"}`}>
                <p className="text-[10px] font-black uppercase tracking-wide text-amber-800">{scenario.label}</p>
                <p className="mt-1 text-lg font-black text-[#202124]">€{scenario.priceEurPerTco2}/tCO₂</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] font-semibold leading-5 text-amber-950/75">100 tCO₂ brüt gömülü emisyon için €75 → €85 değişimi, diğer tüm parametreler sabitken brüt piyasa duyarlılığını €1.000 artırır. Bu rakam nihai sertifika yükümlülüğü değildir.</p>
        </section>

        <VerificationGuidanceNotice compact />
      </div>
      <WizardAutoScroll />
      <SkdmWizard sectorSlug={sector} />
    </div>
  );
}
