import type { Metadata } from "next";
import { DelegationForm } from "@/components/delegation/DelegationForm";

export const metadata: Metadata = {
  title: "Veri Talebi | SKDMHesapla",
  description:
    "Çalışma dosyanız için istenen tek bilgiyi paylaşın — hesap açmanıza gerek yoktur.",
  robots: { index: false, follow: false },
};

export default function VeriTalebiPage() {
  return (
    <main className="pasaport-zemin-acik flex min-h-screen items-center justify-center bg-[#f7f9f5] px-5 py-12 sm:px-6">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            SKDMHesapla · Veri Talebi
          </span>
          <h2 className="mt-1 text-lg font-extrabold text-ink-900">
            Bir dosya sahibi sizden bilgi istedi
          </h2>
        </div>
        <DelegationForm />
        
      </div>
    </main>
  );
}
