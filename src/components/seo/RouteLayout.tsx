import { RegistryJsonLd } from "./RegistryJsonLd";

/** Indexable sayfada tek @graph. SiteJsonLd ile birlikte kullanılmaz. */
export function RouteLayout({
  route,
  children,
}: {
  route: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <RegistryJsonLd route={route} />
      {children}
    </>
  );
}
