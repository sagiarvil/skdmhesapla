import type { Metadata } from "next";
import { MaritimeRegulationPage } from "@/components/maritime/MaritimeRegulationPage";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/eu-ets/",
  title: "EU ETS Denizcilik — EUA Maliyet Maruziyeti",
  description: "Denizcilikte EU ETS kapsamı, 2026 yüzde 100 phase-in, CO2e ve kullanıcı tarafından girilen EUA fiyatıyla maliyet ön tahmini.",
});

export default function EuEtsPage() {
  return <MaritimeRegulationPage
    eyebrow="EU ETS"
    title="EU ETS: emisyon raporunu finansal maliyet maruziyetine çevirin"
    description="2026 emisyonlarından itibaren kapsamdaki denizcilik emisyonları yüzde 100 phase-in seviyesine ulaşır; CH4 ve N2O da CO2e bazında kapsama dahil olur. SKDMHesapla canlı fiyat uydurmaz, kullanıcının girdiği EUA fiyatıyla ön maliyet hesabı yapar."
    whatItDoes={[
      "Gemi tipi, GT ve AB/AEA liman bağlantısıyla ön ETS kapsam kontrolü yapar.",
      "2024 yüzde 40, 2025 yüzde 70, 2026 ve sonrası yüzde 100 phase-in oranını uygular.",
      "Kullanıcı tarafından girilen ETS kapsam emisyonu ve EUA fiyatıyla ön maliyet maruziyetini hesaplar.",
    ]}
    whatItNeeds={[
      "Gemi tipi, GT ve operasyon yılı.",
      "ETS coğrafi kapsamına girdikten sonra kalan doğrulanmış/çalışma CO2e değeri.",
      "Kullanıcının seçtiği veya piyasa kaynağından aldığı EUA fiyatı.",
    ]}
    output={[
      "Muhtemel ETS kapsam kararı.",
      "İlgili yıl phase-in oranı.",
      "EUR bazında tahmini EUA maliyet maruziyeti ve veri uyarıları.",
    ]}
    sourceHref="https://climate.ec.europa.eu/areas-action/transport-decarbonisation/reducing-emissions-shipping-sector_en"
    sourceLabel="Avrupa Komisyonu EU ETS Maritime"
  />;
}
