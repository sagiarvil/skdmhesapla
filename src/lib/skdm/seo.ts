/**
 * Site SEO — tek kaynak (canonical, Open Graph, Twitter, JSON-LD).
 */
import type { Metadata } from "next";
import { LEGAL_ENTITY, PERSON_ENTITY, PLATFORM_STATS } from "./constants";

export const SITE_ORIGIN = "https://skdmhesapla.com" as const;

/** Paylaşım görseli (mutlak URL Metadata API ile birleşir). */
export const OG_IMAGE_PATH = "/desen/hero-illus-bayrak-A-temiz.png" as const;
export const OG_IMAGE = {
  url: OG_IMAGE_PATH,
  width: 1536,
  height: 976,
  alt: `${LEGAL_ENTITY.brandName} — SKDM / CBAM denetime hazırlık`,
} as const;

export type PageSeoInput = {
  /** Kök-relative path, trailing slash ile: "/rehber/" */
  path: string;
  title: string;
  description: string;
  noIndex?: boolean;
};

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${p}`;
}

/** Sayfa metadata — canonical + OG + Twitter tek çağrıda. */
export function pageMetadata({ path, title, description, noIndex }: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      siteName: LEGAL_ENTITY.brandName,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_ORIGIN}/hakkinda/#baris-bagirlar`,
    name: PERSON_ENTITY.name,
    jobTitle: PERSON_ENTITY.jobTitle,
    image: absoluteUrl(PERSON_ENTITY.imagePath),
    url: `${SITE_ORIGIN}/hakkinda/`,
    sameAs: [...PERSON_ENTITY.sameAs],
    worksFor: {
      "@type": "Organization",
      name: LEGAL_ENTITY.companyName,
      url: SITE_ORIGIN,
    },
    affiliation: PERSON_ENTITY.affiliation.map((a) => ({
      "@type": "Organization",
      name: a.name,
      ...("url" in a && a.url ? { url: a.url } : {}),
    })),
    knowsAbout: [...PERSON_ENTITY.knowsAbout],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: LEGAL_ENTITY.brandName,
    legalName: LEGAL_ENTITY.companyName,
    url: SITE_ORIGIN,
    logo: absoluteUrl("/logo/skdm-logo-statik.png"),
    email: LEGAL_ENTITY.supportEmail,
    taxID: LEGAL_ENTITY.vkn,
    description: LEGAL_ENTITY.disclaimer,
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
      addressLocality: LEGAL_ENTITY.address,
    },
    employee: { "@id": `${SITE_ORIGIN}/hakkinda/#baris-bagirlar` },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: LEGAL_ENTITY.brandName,
    url: SITE_ORIGIN,
    description:
      "Türk ihracatçılar için SKDM (CBAM) denetime hazırlık dosyası ve sertifika maliyeti projeksiyonu.",
    inLanguage: "tr-TR",
    publisher: {
      "@type": "Organization",
      name: LEGAL_ENTITY.companyName,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_ORIGIN}/basla/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: LEGAL_ENTITY.brandName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_ORIGIN,
    description:
      "Self-servis SKDM/CBAM denetime hazırlık ve sertifika maliyeti hesaplama yazılımı.",
    offers: {
      "@type": "Offer",
      price: "9900",
      priceCurrency: "TRY",
      description: "Mühürlü denetime hazırlık paketi (tek fiyat)",
    },
    featureList: [
      `${PLATFORM_STATS.sectorCount} sektör`,
      `${PLATFORM_STATS.fileCount} parçalı mühürlü paket`,
      `${PLATFORM_STATS.stepCount} adımlı sihirbaz`,
    ],
    author: { "@id": `${SITE_ORIGIN}/hakkinda/#baris-bagirlar` },
  };
}
