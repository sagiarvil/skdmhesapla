import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/v/",
  title: "Doküman doğrulama",
  description: "Mühürlü doküman bütünlük kontrolü",
  noIndex: true,
});

export default function VLayout({ children }: { children: React.ReactNode }) {
  return children;
}
