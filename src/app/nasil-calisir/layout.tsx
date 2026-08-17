import { RouteLayout } from "@/components/seo/RouteLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RouteLayout route="/nasil-calisir/">{children}</RouteLayout>;
}
