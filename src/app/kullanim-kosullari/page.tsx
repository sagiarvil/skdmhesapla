import type { Metadata } from "next";
import { FileText, ShieldAlert } from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";

import { LEGAL_ENTITY } from "@/lib/skdm/constants";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — SKDMHesapla",
  description: "Platform kullanım şartları, sorumluluk sınırları ve self-servis yazılım bildirimleri.",
};

export default function KullanimKosullariPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Hukuki Sözleşmeler &amp; Sorumluluk Çerçevesi
          </span>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">Kullanım Koşulları</h1>
          <p className="text-base font-semibold text-ink-700 sm:text-lg">
            Hizmet şartları, telif hakları ve sorumluluk sınırları.
          </p>
        </div>

        <DisclaimerBanner />

        <div className="rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl sm:p-9 space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-brand-800" />
            <h2 className="text-2xl font-black text-ink-900">Sözleşme Maddeleri</h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
            <p>
              <strong>1. Hizmetin Niteliği:</strong> {LEGAL_ENTITY.brandName}, sanayi tesislerinin Avrupa Birliği CBAM mevzuatına (2023/956 ve 2025/2547) uygun biçimde emisyon hesaplamalarını yapmalarını ve bağımsız denetime hazır paket oluşturmalarını sağlayan bir self-servis yazılımdır.
            </p>
            <p>
              <strong>2. Sorumluluk Sınırı:</strong> Platform, akredite doğrulama kuruluşu veya gümrük idaresi değildir. Hesaplamalar kullanıcı tarafından girilen verilerin doğruluğuna dayanır; platform resmi onay veya gümrük kabul garantisi vermez.
            </p>
            <p>
              <strong>3. Fikri Mülkiyet:</strong> Platform arayüzü, hesaplama motoru algoritmaları ve mühürleme mimarisi {LEGAL_ENTITY.companyName}&apos;a aittir; kopyalanamaz ve tersine mühendislik uygulanamaz.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
