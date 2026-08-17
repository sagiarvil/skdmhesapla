import type { Metadata } from "next";
import { Suspense } from "react";
import { PcfWizard } from "@/components/pcf/PcfWizard";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/karbon-raporu/",
  title: "Ürün Karbon Ayak İzi Raporu Hazırla | SKDMHesapla",
  description: "AB müşterinize gönderebileceğiniz kaynakları izlenebilir ürün karbon ayak izi raporunu üretim verilerinizle hazırlayın.",
});

export default function KarbonRaporuPage() {
  return (
    <>
      <RegistryJsonLd route="/karbon-raporu/" />
      <div className="pasaport-zemin-acik min-h-screen bg-brand-50">
      <Suspense fallback={<div className="mx-auto max-w-5xl px-6 py-16 font-semibold text-ink-700">Karbon raporu çalışma alanı hazırlanıyor…</div>}>
        <PcfWizard />
      </Suspense>
      </div>
    </>
  );
}
