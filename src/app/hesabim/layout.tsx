import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/hesabim/",
  title: "Hesabım — Mühürlü Dosya Arşivi",
  description: "Mühürlü denetime hazırlık paketlerinizi görüntüleyin ve indirin.",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
