import { LEGAL_ENTITY, PERSON_ENTITY, PLATFORM_STATS } from "@/lib/skdm/constants";
import { primaryCredential } from "@/lib/skdm/credential";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/skdm/seo";
import { getRegistryEntry } from "./registry";

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const SITE_ID = `${SITE_ORIGIN}/#website`;
const PERSON_ID = `${SITE_ORIGIN}/uzmanlik/baris-bagirlar/#person`;
const ARTICLE_HEADLINE_OVERRIDES: Readonly<Record<string, string>> = { "/nasil-calisir/": "SKDMHesapla Nasıl Çalışır?" };

export function organizationNode() {
  return { "@type": "Organization", "@id": ORG_ID, name: LEGAL_ENTITY.brandName, legalName: LEGAL_ENTITY.companyName, url: SITE_ORIGIN, logo: absoluteUrl("/logo/skdm-logo-statik.png"), email: LEGAL_ENTITY.supportEmail, description: LEGAL_ENTITY.disclaimer, address: { "@type": "PostalAddress", addressCountry: "TR", addressLocality: LEGAL_ENTITY.address }, employee: { "@id": PERSON_ID } };
}
export function websiteNode() { return { "@type": "WebSite", "@id": SITE_ID, name: LEGAL_ENTITY.brandName, url: SITE_ORIGIN, inLanguage: "tr-TR", publisher: { "@id": ORG_ID } }; }
export function personNode() {
  return { "@type": "Person", "@id": PERSON_ID, name: PERSON_ENTITY.name, jobTitle: PERSON_ENTITY.jobTitle, image: absoluteUrl(PERSON_ENTITY.imagePath), url: `${SITE_ORIGIN}/uzmanlik/baris-bagirlar/`, sameAs: [...PERSON_ENTITY.sameAs], worksFor: { "@id": ORG_ID }, knowsAbout: [...PERSON_ENTITY.knowsAbout], hasCredential: { "@type": "EducationalOccupationalCredential", "@id": `${SITE_ORIGIN}/#cred-bb-iso14064-1`, name: primaryCredential.credential.name, credentialCategory: primaryCredential.credential.credentialType, recognizedBy: { "@type": "Organization", name: primaryCredential.credential.issuingOrganization }, competencyRequired: [...primaryCredential.scope], url: absoluteUrl(primaryCredential.credential.verificationUrl), image: absoluteUrl(primaryCredential.credential.certificateAsset) } };
}
function softwareNode() { return { "@type": "SoftwareApplication", "@id": `${SITE_ORIGIN}/#software`, name: LEGAL_ENTITY.brandName, applicationCategory: "BusinessApplication", operatingSystem: "Web", url: SITE_ORIGIN, offers: { "@type": "Offer", price: String(PADDLE_SEAL_PRICE_TRY), priceCurrency: "TRY" }, featureList: [`${PLATFORM_STATS.fileCount} parçalı mühürlü paket`, `${PLATFORM_STATS.stepCount} adımlı sihirbaz`], author: { "@id": PERSON_ID } }; }

function routeLanguage(route: string) { return route === "/eu-importers/" ? "en" : "tr-TR"; }
function breadcrumbs(route: string, title: string) {
  const english = routeLanguage(route) === "en";
  const parts = route.split("/").filter(Boolean);
  const items = [{ "@type": "ListItem", position: 1, name: english ? "Home" : "Ana sayfa", item: `${SITE_ORIGIN}/` }];
  let acc = "";
  parts.forEach((seg, i) => { acc += `/${seg}`; const path = `${acc}/`; items.push({ "@type": "ListItem", position: i + 2, name: i === parts.length - 1 ? title : seg, item: `${SITE_ORIGIN}${path}` }); });
  return { "@type": "BreadcrumbList", "@id": `${SITE_ORIGIN}${route}#breadcrumb`, itemListElement: items };
}

export function buildJsonLdGraph(route: string) {
  const entry = getRegistryEntry(route);
  const graph: Record<string, unknown>[] = [organizationNode(), websiteNode()];
  if (!entry) return graph;
  const canonicalRoute = entry.canonicalRoute || entry.route;
  const pageId = `${SITE_ORIGIN}${canonicalRoute}#webpage`;
  const types = new Set(entry.schemaTypes);
  const language = routeLanguage(entry.route);
  if (types.has("Person") || types.has("ProfilePage")) graph.push(personNode());
  if (types.has("SoftwareApplication") && (entry.route === "/" || entry.route === "/basla/")) graph.push(softwareNode());
  const pageType = types.has("ProfilePage") ? "ProfilePage" : types.has("CollectionPage") ? "CollectionPage" : types.has("Article") ? "Article" : "WebPage";
  const page: Record<string, unknown> = { "@type": pageType, "@id": pageId, url: `${SITE_ORIGIN}${canonicalRoute}`, name: entry.title, headline: ARTICLE_HEADLINE_OVERRIDES[entry.route] ?? entry.h1, description: entry.metaDescription, isPartOf: { "@id": SITE_ID }, about: { "@id": ORG_ID }, inLanguage: language, dateModified: entry.modifiedAt };
  if (pageType === "Article") { page.author = { "@id": PERSON_ID }; graph.push(personNode()); }
  graph.push(page);
  if (types.has("Service")) graph.push({ "@type": "Service", "@id": `${SITE_ORIGIN}${canonicalRoute}#service`, name: entry.h1, description: entry.metaDescription, url: `${SITE_ORIGIN}${canonicalRoute}`, provider: { "@id": ORG_ID }, inLanguage: language, areaServed: entry.route === "/eu-importers/" ? "European Union" : "Türkiye", audience: { "@type": "Audience", audienceType: entry.route === "/eu-importers/" ? "EU importers and CBAM compliance teams" : "Gümrük müşavirleri, dış ticaret ve karbon danışmanları" } });
  if (types.has("BreadcrumbList") && entry.route !== "/") graph.push(breadcrumbs(canonicalRoute, ARTICLE_HEADLINE_OVERRIDES[entry.route] ?? entry.h1));
  return graph;
}

export function jsonLdDocument(route: string) { return { "@context": "https://schema.org", "@graph": buildJsonLdGraph(route) }; }
