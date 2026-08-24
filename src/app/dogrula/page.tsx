import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { DogrulaConsole } from "@/components/credential/DogrulaConsole";
import { VerificationGuidanceNotice } from "@/components/regulatory/VerificationGuidanceNotice";

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
  return (
    <>
      <div className="mx-auto max-w-5xl px-5 pt-6 sm:px-6">
        <VerificationGuidanceNotice compact />
      </div>
      <DogrulaConsole />
    </>
  );
}
