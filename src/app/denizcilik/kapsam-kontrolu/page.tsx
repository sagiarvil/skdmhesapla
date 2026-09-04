import type { Metadata } from "next";
import { MaritimeScopeWizard } from "@/components/maritime/MaritimeScopeWizard";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/kapsam-kontrolu/",
  title: "Denizcilik Kapsam Kontrolü — EU MRV, EU ETS, FuelEU",
  description:
    "Gemi rolü, gross tonnage, AB/EEA liman uğrağı, yakıt ve sefer kayıtlarına göre EU MRV, EU ETS, FuelEU ve CBAM partner potansiyeli ön kontrolü.",
});

export default function DenizcilikKapsamKontroluPage() {
  return <MaritimeScopeWizard />;
}
