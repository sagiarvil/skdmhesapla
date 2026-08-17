import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/kayit/",
  title: "Kayıt",
  description: "SKDMHesapla hesap oluşturma",
  noIndex: true,
});

export default function KayitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
