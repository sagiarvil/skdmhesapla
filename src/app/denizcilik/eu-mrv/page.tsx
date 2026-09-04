import type { Metadata } from "next";
import { MaritimeRegulationPage } from "@/components/maritime/MaritimeRegulationPage";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({ path: "/denizcilik/eu-mrv/", title: "EU MRV Denizcilik — Kapsam ve Veri Hazırlığı", description: "EU MRV kapsamında gemi/rota ön kontrolü, monitoring plan, voyage-fuel verisi ve doğrulamaya hazırlık için SKDMHesapla denizcilik modülü." });

export default function EuMrvPage() {
  return <MaritimeRegulationPage eyebrow="EU MRV" title="EU MRV: önce hangi geminin hangi veriyi raporlaması gerektiğini netleştirin" description="MRV, denizcilik emisyon verisinin izlenmesi, raporlanması ve doğrulanması için temel veri omurgasıdır. SKDMHesapla bu omurgayı kapsam ön değerlendirmesi ve kanıt hazırlığı seviyesinde düzenler." whatItDoes={["Gemi tipi, GT ve liman bağlantısıyla ön kapsam kontrolü yapar.", "2025'ten itibaren 400-4.999 GT general cargo ve offshore genişlemesini ayrı değerlendirir.", "CO2 yanında CH4 ve N2O raporlama veri ihtiyacını görünür kılar."]} whatItNeeds={["IMO / gemi kimliği, gemi tipi ve gross tonnage.", "AB/AEA liman çağrıları ve sefer kayıtları.", "Yakıt tüketimi, BDN/noon/voyage kayıtları ve monitoring plan kanıtları."]} output={["Muhtemel kapsam / kapsam dışı / manuel inceleme kararı.", "Eksik veri ve belge listesi.", "Verifier incelemesine hazırlanabilecek izlenebilir kanıt yapısı."]} sourceHref="https://www.emsa.europa.eu/reducing-emissions/mrv-changes/faq-mrv-changes.html" sourceLabel="EMSA MRV resmî rehberi" />;
}
