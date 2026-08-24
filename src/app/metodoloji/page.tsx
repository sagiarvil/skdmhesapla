import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { MetodolojiIndexClient } from "@/components/metodoloji/MetodolojiIndexClient";
import { VerificationGuidanceNotice } from "@/components/regulatory/VerificationGuidanceNotice";

export const metadata: Metadata = pageMetadata({
  path: "/metodoloji/",
  title: "SKDMHesapla CBAM Hesaplama Metodolojisi | Kaynaklı & İzlenebilir",
  description:
    "SKDMHesapla'nın AB Sınırda Karbon Düzenleme Mekanizması (CBAM) emisyon hesaplama metodolojisi, kaynakları, veri kalite kontrolleri ve versiyonlandırma altyapısı.",
});

export default function MetodolojiPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-6">
        <VerificationGuidanceNotice />
      </div>
      <MetodolojiIndexClient />
    </>
  );
}
