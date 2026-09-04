import type { Metadata } from "next";
import { MaritimeLanding } from "@/components/maritime/MaritimeLanding";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/",
  title: "Denizcilik Karbon Uyum — EU ETS, MRV ve FuelEU Maritime",
  description:
    "AB limanlarına sefer yapan denizcilik firmaları için EU MRV, EU ETS, FuelEU Maritime kapsam kontrolü, karbon maliyet yönetimi ve CBAM ihracatçı partner masası.",
});

export default function DenizcilikPage() {
  return <MaritimeLanding />;
}
