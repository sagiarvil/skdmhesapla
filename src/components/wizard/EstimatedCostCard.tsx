import {
  assessCostReadiness,
  type RequiredCostInputs,
} from "@/lib/calc/dataReadiness";

interface Props {
  inputs: RequiredCostInputs;
  computedCostEur: number | null;
  etsQuarter: string;
  etsPrice: number;
}

export function EstimatedCostCard({ inputs, computedCostEur, etsQuarter, etsPrice }: Props) {
  const readiness = assessCostReadiness(inputs);
  const amount =
    readiness.state === "ready" && computedCostEur !== null && Number.isFinite(computedCostEur)
      ? computedCostEur
      : null;

  if (readiness.state !== "ready" || amount === null) {
    const isPartial = readiness.state === "partial";
    return (
      <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm space-y-1" data-testid="cost-card">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C9D6B4]">
          {isPartial ? "Tahmini Sertifika Maliyeti (eksik veriyle)" : "Tahmini Sertifika Maliyeti"}
        </span>
        <div className="font-mono text-3xl sm:text-5xl font-black text-[#E4ECCF] tracking-tight" data-testid="cost-amount">
          —
        </div>
        <p className="text-xs sm:text-sm text-[#CFDAC0] font-medium pt-1">
          {isPartial
            ? `Henüz eksik: ${readiness.missingFields.join(", ")}. Bu bilgiler tamamlanmadan rakam göstermiyoruz.`
            : "Bu rakamı hesaplayabilmemiz için ürün kategorisi, üretim adımı, enerji/yakıt kaynağı ve toplam üretim miktarına ihtiyacımız var. Adımları tamamladıkça burada güncellenecek."}
        </p>
      </div>
    );
  }

  const formatted = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm space-y-1" data-testid="cost-card">
      <span className="text-xs font-bold uppercase tracking-wider text-[#C9D6B4]">
        Tahmini Sertifika Maliyeti
      </span>
      <div className="font-mono text-3xl sm:text-5xl font-black text-[#E4ECCF] tracking-tight" data-testid="cost-amount">
        {formatted}
      </div>
      <p className="text-xs sm:text-sm text-[#CFDAC0] font-medium pt-1">
        Alıcınızın üstleneceği tahmini sertifika maliyeti · ETS {etsPrice} € ({etsQuarter})
      </p>
    </div>
  );
}
