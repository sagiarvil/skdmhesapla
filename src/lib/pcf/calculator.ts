import { PCF_FACTORS } from "./factors";
import { resolvePcfFactor } from "./factor-resolver";
import { PCF_ENGINE_VERSION, PCF_METHODOLOGY_VERSION, PCF_POLICY } from "./policy";
import { summarizePcfQuality } from "./quality";
import type {
  PcfContribution,
  PcfFactorRecord,
  PcfFinding,
  PcfInput,
  PcfResult,
} from "./types";

const round6 = (n: number) => Math.round((n + Number.EPSILON) * 1_000_000) / 1_000_000;

function requireFiniteNonNegative(value: number, name: string, findings: PcfFinding[]): void {
  if (!Number.isFinite(value) || value < 0) {
    findings.push({ code: "PCF_NUMERIC_INPUT", severity: "blocking", messageTr: `${name} sıfır veya pozitif geçerli bir sayı olmalıdır.` });
  }
}

function validateInput(input: PcfInput): PcfFinding[] {
  const f: PcfFinding[] = [];
  if (!input.reportId.trim()) f.push({ code: "PCF_REPORT_ID", severity: "blocking", messageTr: "Rapor kimliği oluşturulmalıdır." });
  if (!input.companyName.trim()) f.push({ code: "PCF_COMPANY", severity: "blocking", messageTr: "İşletme adı tamamlanmalıdır." });
  if (!input.facilityName.trim()) f.push({ code: "PCF_FACILITY", severity: "blocking", messageTr: "Üretim tesisi adı tamamlanmalıdır." });
  if (!input.productName.trim()) f.push({ code: "PCF_PRODUCT", severity: "blocking", messageTr: "Ürün adı tamamlanmalıdır." });
  if (!input.functionalUnit.trim()) f.push({ code: "PCF_FUNCTIONAL_UNIT", severity: "blocking", messageTr: "Fonksiyonel/deklare birim tamamlanmalıdır." });
  if (input.reportingPeriodEnd < input.reportingPeriodStart) {
    f.push({ code: "PCF_PERIOD", severity: "blocking", messageTr: "Raporlama dönemi tarihleri gözden geçirilmelidir." });
  }
  requireFiniteNonNegative(input.productionQuantityForPeriod, "Dönem üretim miktarı", f);
  if (input.productionQuantityForPeriod <= 0) {
    f.push({ code: "PCF_PRODUCTION_ZERO", severity: "blocking", messageTr: "Dönem üretim miktarı sıfır olamaz." });
  }
  if (!Number.isFinite(input.allocationShare) || input.allocationShare <= 0 || input.allocationShare > 1) {
    f.push({ code: "PCF_ALLOCATION_SHARE", severity: "blocking", messageTr: "Tahsis oranı 0 ile 1 arasında ve sıfırdan büyük olmalıdır." });
  }
  if (!input.allocationMethod.trim()) {
    f.push({ code: "PCF_ALLOCATION_METHOD", severity: "blocking", messageTr: "Tahsis yöntemi ve gerekçesi tamamlanmalıdır." });
  }
  for (const m of [...input.materials, ...input.packaging]) {
    requireFiniteNonNegative(m.quantityKgPerFunctionalUnit, `${m.label} miktarı`, f);
  }
  if (input.electricity) requireFiniteNonNegative(input.electricity.consumptionKwhForPeriod, "Elektrik tüketimi", f);
  for (const fuel of input.fuels) requireFiniteNonNegative(fuel.quantityForPeriod, `${fuel.label} tüketimi`, f);
  return f;
}

export function calculatePcf(
  input: PcfInput,
  registry: readonly PcfFactorRecord[] = PCF_FACTORS,
): PcfResult {
  const inputFindings = validateInput(input);
  if (inputFindings.some((f) => f.severity === "blocking")) {
    return {
      engineVersion: PCF_ENGINE_VERSION,
      methodologyVersion: PCF_METHODOLOGY_VERSION,
      status: "blocked",
      totalKgCo2ePerFunctionalUnit: 0,
      scope1KgCo2ePerFunctionalUnit: 0,
      scope2KgCo2ePerFunctionalUnit: 0,
      upstreamMaterialKgCo2ePerFunctionalUnit: 0,
      packagingKgCo2ePerFunctionalUnit: 0,
      contributions: [],
      findings: inputFindings,
      quality: {
        grade: "DQ4",
        factorProvenanceCoverage: 0,
        proxyContributionRatio: 0,
        genericContributionRatio: 0,
        verifiedSupplierContributionRatio: 0,
        evidenceComplete: false,
      },
      methodologyStatement: PCF_POLICY.methodologyStatement,
    };
  }

  const contributions: PcfContribution[] = [];
  const factorFindings: PcfFinding[] = [];
  let unresolvedCount = 0;
  const asOfIso = input.createdAt;

  const addMaterial = (
    kind: "material" | "packaging",
    m: PcfInput["materials"][number] | PcfInput["packaging"][number],
    category: "upstream_material" | "packaging",
  ) => {
    if (m.quantityKgPerFunctionalUnit === 0) return;
    const resolved = resolvePcfFactor(
      {
        kind,
        materialId: m.materialId,
        geography: input.country,
        asOfIso,
        allowEstimate: true,
        supplierFactor: m.supplierFactor,
      },
      registry,
    );
    if (!resolved.ok) {
      unresolvedCount += 1;
      factorFindings.push({ code: resolved.code, severity: "blocking", messageTr: resolved.messageTr, fieldRef: m.id });
      return;
    }
    if (resolved.factor.activityUnit !== "kg") {
      unresolvedCount += 1;
      factorFindings.push({ code: "PCF_UNIT_MISMATCH", severity: "blocking", messageTr: `${m.label} faktör birimi kg değildir; otomatik dönüşüm yapılmadı.`, fieldRef: m.id });
      return;
    }
    contributions.push({
      id: m.id,
      label: m.label,
      category,
      activityQuantity: m.quantityKgPerFunctionalUnit,
      activityUnit: "kg",
      kgCo2ePerFunctionalUnit: round6(m.quantityKgPerFunctionalUnit * resolved.factor.kgCo2ePerActivityUnit),
      factor: resolved.factor,
    });
  };

  for (const m of input.materials) addMaterial("material", m, "upstream_material");
  for (const p of input.packaging) addMaterial("packaging", p, "packaging");

  if (input.electricity && input.electricity.consumptionKwhForPeriod > 0) {
    const resolved = resolvePcfFactor(
      {
        kind: "electricity",
        materialId: "electricity-grid",
        geography: input.electricity.geography,
        asOfIso,
        allowEstimate: true,
        connectionType: input.electricity.connectionType,
      },
      registry,
    );
    if (!resolved.ok) {
      unresolvedCount += 1;
      factorFindings.push({ code: resolved.code, severity: "blocking", messageTr: resolved.messageTr, fieldRef: "electricity" });
    } else if (resolved.factor.activityUnit !== "kWh") {
      unresolvedCount += 1;
      factorFindings.push({ code: "PCF_ELECTRICITY_UNIT", severity: "blocking", messageTr: "Elektrik faktörü kWh biriminde olmalıdır.", fieldRef: "electricity" });
    } else {
      const kg = (input.electricity.consumptionKwhForPeriod * resolved.factor.kgCo2ePerActivityUnit * input.allocationShare) / input.productionQuantityForPeriod;
      contributions.push({
        id: "electricity",
        label: "Şebeke elektriği",
        category: "scope2",
        activityQuantity: input.electricity.consumptionKwhForPeriod,
        activityUnit: "kWh",
        kgCo2ePerFunctionalUnit: round6(kg),
        factor: resolved.factor,
      });
    }
  }

  for (const fuel of input.fuels) {
    if (fuel.quantityForPeriod === 0) continue;
    const resolved = resolvePcfFactor(
      {
        kind: "fuel",
        materialId: fuel.fuelId,
        geography: fuel.geography,
        asOfIso,
        allowEstimate: true,
      },
      registry,
    );
    if (!resolved.ok) {
      unresolvedCount += 1;
      factorFindings.push({ code: resolved.code, severity: "blocking", messageTr: resolved.messageTr, fieldRef: fuel.id });
      continue;
    }
    if (resolved.factor.activityUnit !== fuel.activityUnit) {
      unresolvedCount += 1;
      factorFindings.push({ code: "PCF_FUEL_UNIT", severity: "blocking", messageTr: `${fuel.label} için tüketim birimi ile faktör birimi eşleşmiyor; sessiz dönüşüm yapılmadı.`, fieldRef: fuel.id });
      continue;
    }
    const kg = (fuel.quantityForPeriod * resolved.factor.kgCo2ePerActivityUnit * input.allocationShare) / input.productionQuantityForPeriod;
    contributions.push({
      id: fuel.id,
      label: fuel.label,
      category: "scope1",
      activityQuantity: fuel.quantityForPeriod,
      activityUnit: fuel.activityUnit,
      kgCo2ePerFunctionalUnit: round6(kg),
      factor: resolved.factor,
    });
  }

  const quality = summarizePcfQuality(contributions, input.evidence, unresolvedCount);
  const findings = [...inputFindings, ...factorFindings, ...quality.findings];
  const sum = (category: PcfContribution["category"]) =>
    round6(contributions.filter((c) => c.category === category).reduce((s, c) => s + c.kgCo2ePerFunctionalUnit, 0));

  const scope1 = sum("scope1");
  const scope2 = sum("scope2");
  const upstream = sum("upstream_material");
  const packaging = sum("packaging");
  const total = round6(scope1 + scope2 + upstream + packaging);

  return {
    engineVersion: PCF_ENGINE_VERSION,
    methodologyVersion: PCF_METHODOLOGY_VERSION,
    status: quality.status,
    totalKgCo2ePerFunctionalUnit: total,
    scope1KgCo2ePerFunctionalUnit: scope1,
    scope2KgCo2ePerFunctionalUnit: scope2,
    upstreamMaterialKgCo2ePerFunctionalUnit: upstream,
    packagingKgCo2ePerFunctionalUnit: packaging,
    contributions,
    findings,
    quality: quality.quality,
    methodologyStatement: PCF_POLICY.methodologyStatement,
  };
}
