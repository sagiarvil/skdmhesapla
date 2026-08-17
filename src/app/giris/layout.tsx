import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/giris/",
  title: "Giriş",
  description: "SKDMHesapla hesap girişi",
  noIndex: true,
});

export default function GirisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
