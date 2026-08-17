import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/kayit/",
  title: "Firma Hesabı Oluşturun",
  description: "Mühürlü SKDM dosyalarınızı arşivlemek için firma hesabı oluşturun.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
