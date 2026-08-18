import type { Metadata } from "next";
import { VPaketDogrulama } from "@/components/credential/VPaketDogrulama";

/**
 * /v/{paketNo} — Mühür bütünlük sayfası (server katmanı).
 *
 * Sayfa statik export'ta yalnızca bilinen parametreler için üretilir;
 * Firebase Hosting rewrite `/v/**` → `/v/demo/index.html` bilinmeyen
 * paket numaralarını aynı şablona düşürür. Client bileşen gerçek URL
 * segmentini okuyup kayıt defterini sorgular.
 */

export function generateStaticParams() {
  return [{ id: "demo" }, { id: "SEAL-2026-DOĞRULANDI" }];
}

export type VPaketPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: VPaketPageProps): Promise<Metadata> {
  const { id } = await params;
  const temiz = id ? decodeURIComponent(id) : "paket";
  return {
    title: `${temiz.slice(0, 32)} — Mühür bütünlük kaydı | SKDMHesapla`,
    description: "Mühürlü SKDM paketinin SHA-256 bütünlük kaydı ve dosya listesi.",
    alternates: { canonical: `https://skdmhesapla.com/v/${temiz}/` },
    robots: { index: false, follow: true },
  };
}

export default function MuhurBulunlukSayfasi() {
  return <VPaketDogrulama />;
}
