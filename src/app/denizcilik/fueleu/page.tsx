import type { Metadata } from "next";
import { MaritimeRegulationPage } from "@/components/maritime/MaritimeRegulationPage";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({ path: "/denizcilik/fueleu/", title: "FuelEU Maritime — GHG Yoğunluğu ve Veri Hazırlığı", description: "FuelEU Maritime için 5.000 GT üzeri ticari gemilerde kapsam ön kontrolü, Well-to-Wake GHG yoğunluğu veri hazırlığı ve verifier-ready kanıt yapısı." });

export default function FuelEuPage() {
  return <MaritimeRegulationPage eyebrow="FuelEU Maritime" title="FuelEU: yakıtı yalnız ton olarak değil, yaşam döngüsü sera gazı yoğunluğu olarak yönetin" description="FuelEU Maritime 1 Ocak 2025'ten beri uygulanıyor ve yıllık ortalama enerji sera gazı yoğunluğunu kademeli olarak düşürüyor. SKDMHesapla FuelEU hesap mantığını CBAM ve ETS'den ayrı tutar; veri ve kanıt hazırlığını aynı kurumsal çalışma alanında birleştirir." whatItDoes={["AB liman çağrısı ve 5.000 GT sınırı üzerinden ön kapsam kontrolü yapar.", "CO2, CH4 ve N2O'yu Well-to-Wake yaklaşımında veri ihtiyacı olarak ayırır.", "2025 başlangıç hedefi olan yüzde 2 GHG yoğunluk azaltım çerçevesini iş akışına taşır."]} whatItNeeds={["Gemi, liman çağrısı ve operasyon dönemi.", "Yakıt türü, miktarı, enerji içeriği ve ilgili WtT/TtW emisyon faktörleri.", "Monitoring plan, bunker/fuel kanıtları ve verifier referansları."]} output={["Muhtemel kapsam / manuel inceleme sonucu.", "Veri hazırlık ve kanıt eksikleri.", "GHG yoğunluğu, compliance balance ve olası açık için hesaplamaya hazır veri modeli."]} sourceHref="https://transport.ec.europa.eu/transport-modes/maritime/decarbonising-maritime-transport-fueleu-maritime_en" sourceLabel="Avrupa Komisyonu FuelEU Maritime" />;
}
