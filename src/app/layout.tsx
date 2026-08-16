import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./pasaport-zemin.css";
import { SiteFooter, SiteHeader } from "@/components/legal/SiteChrome";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SKDMHesapla — AB SKDM Sertifika Maliyeti Hesaplayıcı",
    template: "%s | SKDMHesapla",
  },
  description:
    "CN kodunuzu veya sektörünüzü seçin, adımları tamamlayın; alıcınızın üstleneceği tahmini SKDM sertifika maliyetini ve denetime hazırlık dosyanızı üretin.",
  icons: {
    icon: "/logo/skdm-logo-statik.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
