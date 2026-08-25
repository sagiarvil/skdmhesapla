import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { indexableEntries } from "@/lib/seo/registry";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { SozlukIndexClient } from "@/components/sozluk/SozlukIndexClient";

export const metadata: Metadata = pageMetadata({
  path: "/sozluk/",
  title: "SKDM Sözlüğü 2026 — CBAM Terimleri, İngilizce-Türkçe Karşılıkları ve Anlamları",
  description: "CBAM/SKDM mevzuatında geçen tüm terimlerin net tanımları: embedded emissions, default values, mark-up, bubble approach, precursor, declarant, sertifika fiyatı ve kontrol denkliği.",
});

export default function SozlukPage() {
  const leafIds = indexableEntries()
    .map((e) => e.route)
    .filter((r) => r.startsWith("/sozluk/") && r !== "/sozluk/")
    .map((r) => r.replace("/sozluk/", "").replace(/\/$/, ""));

  return (
    <>
      <RegistryJsonLd route="/sozluk/" />
      <h1 className="sr-only">CBAM / SKDM Sözlüğü</h1>
      <SozlukIndexClient leafIds={leafIds} />
    </>
  );
}
