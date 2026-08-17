import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/hesabim/",
  title: "Hesabım",
  description: "SKDMHesapla hesap",
  noIndex: true,
});

export default function HesabimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
