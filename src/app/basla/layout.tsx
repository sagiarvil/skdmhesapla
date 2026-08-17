import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/basla/",
  title: "Hesaplamaya Başla — GTİP ve Sektör Seçimi",
  description:
    "Ürününüzü yazın veya sektör seçin; SKDM denetime hazırlık sihirbazını ücretsiz başlatın.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
