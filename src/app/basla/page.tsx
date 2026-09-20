import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { BaslaPage } from "@/components/basla/BaslaPage";

/**
 * GATE-R (RM-006): /basla/ kendi metadata'sına sahiptir — anasayfa
 * metadata'sını (canonical "/") miras almaz.
 */
export const metadata: Metadata = pageMetadata({
  path: "/basla/",
  title: "SKDM GTİP Kapsam Kontrolü ve Sorgulama — 8 Haneli CN Kodu",
  description:
    "Ürün adı hukuki kapsam kararı değildir. 8 haneli GTİP veya CN kodunuzu girin; ürününüzün CBAM / SKDM kapsamında olup olmadığını anında sorgulayın.",
});

export default function BaslaRoute() {
  return <BaslaPage />;
}
