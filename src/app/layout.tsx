import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./pasaport-zemin.css";
import SiteFooter from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AuthProvider } from "@/lib/firebase/auth-context";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  themeColor: "#1b4d3e",
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
};

export const metadata: Metadata = {
  ...home,
  metadataBase: new URL(SITE_ORIGIN),
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  verification: {
    google: "hHOqzegtPyCoOBnGz5ZssESJyJfrSdjK7qDBH8WxVYI",
    other: { "msvalidate.01": "C97289CA0F699D6B9053113A5E8FAD2A" },
  },
  other: { "msvalidate.01": "C97289CA0F699D6B9053113A5E8FAD2A" },
  title: {
    default: typeof home.title === "string" ? home.title : "SKDMHesapla",
    template: `%s | ${LEGAL_ENTITY.brandName}`,
  },
  openGraph: { ...home.openGraph, images: [OG_IMAGE] },
  icons: { icon: "/logo/skdm-logo-statik.png", apple: "/logo/skdm-logo-statik.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SKDMHesapla",
  },
};

import Script from "next/script";
import { RouteChrome } from "@/components/RouteChrome";
import { MandateSchema } from "@/components/MandateSchema";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={manrope.variable}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="alternate" type="application/rss+xml" title="RSS" href="https://skdmhesapla.com/feed.xml" />
        <link rel="alternate" type="application/rss+xml" title="Mobil RSS" href="https://skdmhesapla.com/mobile/feed.xml" />
        <link rel="describedby" href="https://skdmhesapla.com/llms.txt" />
        <link rel="alternate" type="text/markdown" href="https://skdmhesapla.com/index.md" />
        <MandateSchema />

      </head>
      <body className={`${manrope.className} min-h-screen antialiased`}>
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <AuthProvider>
          <RouteChrome>{children}</RouteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
