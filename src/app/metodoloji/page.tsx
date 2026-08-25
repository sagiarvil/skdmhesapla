import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { MetodolojiIndexClient } from "@/components/metodoloji/MetodolojiIndexClient";

export const metadata: Metadata = pageMetadata({
  path: "/metodoloji/",
  title: "SKDMHesapla CBAM Hesaplama Metodolojisi | Kaynaklı & İzlenebilir",
  description:
    "SKDMHesapla'nın AB Sınırda Karbon Düzenleme Mekanizması (CBAM) emisyon hesaplama metodolojisi, kaynakları, veri kalite kontrolleri ve versiyonlandırma altyapısı.",
});

export default function MetodolojiPage() {
  return <MetodolojiIndexClient />;
}
