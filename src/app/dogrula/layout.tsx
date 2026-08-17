import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/dogrula/",
  title: "Mühür Doğrulama — SHA-256 Paket Kontrolü",
  description:
    "Mühürlü SKDM denetime hazırlık paketinin bütünlük özetini ve SHA-256 imzasını doğrulayın.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
