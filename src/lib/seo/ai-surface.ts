/**
 * V8 AI surface helpers — HTML ve generator aynı path kuralını kullanır.
 */
export function markdownPathForRoute(route: string): string {
  if (route === "/") return "/index.md";
  const r = route.endsWith("/") ? route : `${route}/`;
  return `${r}index.md`;
}

export function markdownAbsoluteUrl(origin: string, route: string): string {
  return `${origin.replace(/\/$/, "")}${markdownPathForRoute(route)}`;
}
