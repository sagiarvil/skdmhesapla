/**
 * Site SEO — canonical/OG. Index kararı data/seo/registry.json SSOT.
 */
import type { Metadata } from "next";
import { LEGAL_ENTITY, PERSON_ENTITY, PLATFORM_STATS } from "./constants";
import { methodology, primaryCredential } from "./credential";
import { getRegistryEntry } from "@/lib/seo/registry";

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

/** Sayfa metadata — registry varsa title/description/robots/canonical oradan. */
export function pageMetadata({ path, title, description, noIndex }: PageSeoInput): Metadata {
  const rec = getRegistryEntry(path);
  const resolvedTitle = rec?.title ?? title;
  const resolvedDescription = rec?.metaDescription ?? description;
  const url = absoluteUrl(rec?.canonicalRoute ?? path);
  const stateNoIndex = rec?.state === "PUBLISHED_NOINDEX" || rec?.state === "DRAFT";
  const hide = noIndex || stateNoIndex;
  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: rec?.canonicalRoute ?? path },
    robots: hide
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      siteName: LEGAL_ENTITY.brandName,
      title: resolvedTitle,
      description: resolvedDescription,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [OG_IMAGE.url],
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_ORIGIN}/uzmanlik/baris-bagirlar/#baris-bagirlar`,
    name: PERSON_ENTITY.name,
    jobTitle: PERSON_ENTITY.jobTitle,
    image: absoluteUrl(PERSON_ENTITY.imagePath),
    url: absoluteUrl(PERSON_ENTITY.profileUrl),
    sameAs: [...PERSON_ENTITY.sameAs],
    worksFor: {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: LEGAL_ENTITY.companyName,
      url: SITE_ORIGIN,
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      "@id": `${SITE_ORIGIN}/#cred-bb-iso14064-1`,
      name: primaryCredential.credential.name,
      credentialCategory: "Professional Training / Calculation Competency",
      recognizedBy: {
        "@type": "Organization",
        name: primaryCredential.credential.issuingOrganization,
      },
      competencyRequired: [...primaryCredential.scope],
      url: absoluteUrl(primaryCredential.credential.verificationUrl),
    },
    affiliation: PERSON_ENTITY.affiliation.map((a) => ({
      "@type": "Organization",
      name: a.name,
      ...("url" in a && a.url ? { url: a.url } : {}),
    })),
    knowsAbout: [...PERSON_ENTITY.knowsAbout],
  };
}

export function techArticleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${SITE_ORIGIN}/metodoloji/#article`,
    headline: methodology.title,
    description:
      "SKDMHesapla CBAM hesaplama metodolojisi, kaynak yönetimi, AB mevzuat Snapshot'ı ve hesaplama izlenebilirliği.",
    inLanguage: "tr-TR",
    about: [
      "Carbon Border Adjustment Mechanism",
      "Embedded emissions",
      "Greenhouse gas accounting",
      "ISO 14064-1",
    ],
    author: {
      "@id": `${SITE_ORIGIN}/uzmanlik/baris-bagirlar/#baris-bagirlar`,
    },
    publisher: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
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
    employee: { "@id": `${SITE_ORIGIN}/uzmanlik/baris-bagirlar/#baris-bagirlar` },
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
    author: { "@id": `${SITE_ORIGIN}/uzmanlik/baris-bagirlar/#baris-bagirlar` },
  };
}
