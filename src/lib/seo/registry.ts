import registryJson from "../../../data/seo/registry.json";
import type { RegistryEntry } from "./types";

const BY_ROUTE = new Map<string, RegistryEntry>(
  (registryJson.entries as RegistryEntry[]).map((e) => [e.route, e]),
);

export function normalizeRoute(path: string): string {
  if (path === "") return "/";
  let p = path.startsWith("/") ? path : `/${path}`;
  if (p !== "/" && !p.endsWith("/")) p += "/";
  return p;
}

export function getRegistryEntry(path: string): RegistryEntry | undefined {
  return BY_ROUTE.get(normalizeRoute(path));
}

export function requireRegistryEntry(path: string): RegistryEntry {
  const e = getRegistryEntry(path);
  if (!e) throw new Error(`SEO registry'de yok: ${normalizeRoute(path)}`);
  return e;
}

export function indexableEntries(): RegistryEntry[] {
  return (registryJson.entries as RegistryEntry[]).filter((e) => e.state === "PUBLISHED_INDEXABLE");
}

export { registryJson };
