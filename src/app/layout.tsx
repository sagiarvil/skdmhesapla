import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./pasaport-zemin.css";
import { SiteFooter, SiteHeader } from "@/components/legal/SiteChrome";
import { AuthProvider } from "@/lib/firebase/auth-context";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";
import { OG_IMAGE, SITE_ORIGIN, pageMetadata } from "@/lib/skdm/seo";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const home = pageMetadata({
  path: "/",
  title: "SKDMHesapla — AB SKDM Sertifika Maliyeti Hesaplayıcı",
  description:
    "Ürününüzü yazın veya sektörünüzü seçin, adımları tamamlayın; denetime hazırlık dosyanızı ve tahmini SKDM sertifika maliyetini üretin.",
});

export const metadata: Metadata = {
  ...home,
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: typeof home.title === "string" ? home.title : "SKDMHesapla",
    template: `%s | ${LEGAL_ENTITY.brandName}`,
  },
  openGraph: {
    ...home.openGraph,
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/logo/skdm-logo-statik.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={manrope.variable}>
      <body className={`${manrope.className} min-h-screen antialiased`}>
        <SiteJsonLd />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          İçeriğe atla
        </a>
        <AuthProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
