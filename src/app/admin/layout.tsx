import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/admin/",
  title: "Yönetim",
  description: "SKDMHesapla yönetim",
  noIndex: true,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
