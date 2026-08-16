import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./pasaport-zemin.css";
import { SiteFooter, SiteHeader } from "@/components/legal/SiteChrome";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SKDMHesapla — AB SKDM Sertifika Maliyeti Hesaplayıcı",
    template: "%s | SKDMHesapla",
  },
  description:
    "Ürününüzü yazın veya sektörünüzü seçin, adımları tamamlayın; denetime hazırlık dosyanızı ve tahmini SKDM sertifika maliyetini üretin.",
  icons: {
    icon: "/logo/skdm-logo-statik.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={manrope.variable}>
      <body className={`${manrope.className} min-h-screen antialiased`}>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
