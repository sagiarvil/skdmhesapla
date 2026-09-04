import type { Metadata } from "next";
import { MaritimeScopeWizard } from "@/components/maritime/MaritimeScopeWizard";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/kapsam-kontrolu/",
  title: "Otomatik Denizcilik Kapsam Kontrolü — EU MRV, EU ETS, FuelEU",
  description:
    "Gemi, tonaj, rota ve kayıt bilgilerine göre EU MRV, EU ETS ve FuelEU kapsamını sistemin otomatik hesapladığı denizcilik uyum motoru.",
});

export default function DenizcilikKapsamKontroluPage() {
  return <MaritimeScopeWizard />;
}
