import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/giris/",
  title: "Giriş Yap — Firma Hesabı",
  description: "SKDMHesapla firma hesabınıza e-posta veya Google ile giriş yapın.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
