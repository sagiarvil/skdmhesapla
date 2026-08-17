import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

type Props = { params: Promise<{ sector: string }> };

const LABELS: Record<string, string> = {
  "demir-celik": "Demir & Çelik",
  aluminyum: "Alüminyum",
  cimento: "Çimento",
  gubre: "Gübre",
  elektrik: "Elektrik",
  hidrojen: "Hidrojen",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector } = await params;
  const label = LABELS[sector] || sector;
  return pageMetadata({
    path: `/hesapla/${sector}/`,
    title: `${label} SKDM Hesaplama Sihirbazı`,
    description: `${label} sektörü için SKDM/CBAM denetime hazırlık sihirbazı — veri girişi, kalite kontrol ve mühürleme.`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
