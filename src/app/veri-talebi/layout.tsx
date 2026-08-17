import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tek Alanlı Veri Talebi | SKDMHesapla",
  robots: { index: false, follow: false },
};

export default function VeriTalebiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
