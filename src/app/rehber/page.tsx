import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { RehberIndexClient } from "@/components/rehber/RehberIndexClient";

export const metadata: Metadata = pageMetadata({
  path: "/rehber/",
  title: "SKDM Rehberi 2026 — Karar Ağacı, Uygulama ve Kapsam Kılavuzu",
  description:
    "SKDM nedir, kimler kapsamda, 10 katmanlı resmi şablon yapısı, sertifika fiyat takvimi, varsayılan değerler, cezalar, TR-ETS mahsup ve 2028 kapsam genişlemesi.",
});

export default function RehberPage() {
  return (
    <>
      <RegistryJsonLd route="/rehber/" />
      <RehberIndexClient />
    </>
  );
}
