import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { DogrulaConsole } from "@/components/credential/DogrulaConsole";

/**
 * GATE-R (RM-006): /dogrula/ anasayfanın metadata'sını miras almaz —
 * kendi canonical (/dogrula/), title, description ve og:url'ine sahiptir.
 */
export const metadata: Metadata = pageMetadata({
  path: "/dogrula/",
  title: "Mühür doğrula",
  description:
    "Mühürlü SKDM paketinin SHA-256 master imzasını kayıt defterinden teyit edin — akredite doğrulama değil, dosya bütünlük doğrulaması.",
});

export default function DogrulaPage() {
  return <DogrulaConsole />;
}
