import type { Metadata } from "next";
import { Mail, Building2, MapPin, Server, Sparkles } from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";

export const metadata: Metadata = {
  title: "İletişim — SKDMHesapla",
  description: "SKDMHesapla işletme ve iletişim bilgileri.",
};

export default function IletisimPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <Sparkles className="h-4 w-4" />
            <span>Kurumsal İletişim</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">İletişim Bilgileri</h1>
          <p className="text-base font-semibold text-ink-700 sm:text-lg">
            Teknik destek, faturalandırma ve kurumsal talepleriniz için bize ulaşabilirsiniz.
          </p>
        </div>

        <DisclaimerBanner />

        <div className="rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl sm:p-9 space-y-6">
          <h2 className="text-2xl font-black text-ink-900">İşletme Künyesi</h2>
          
          <ul className="space-y-4 text-base sm:text-lg text-ink-700 font-medium divide-y divide-line">
            <li className="flex items-center gap-3 pt-2">
              <Building2 className="h-5 w-5 text-brand-800 shrink-0" />
              <div><strong>İşletmeci:</strong> Barış Bağırlar</div>
            </li>
            <li className="flex items-center gap-3 pt-3">
              <Building2 className="h-5 w-5 text-brand-800 shrink-0" />
              <div><strong>Vergi Kimlik No (VKN):</strong> <span className="font-mono font-bold text-ink-900">25403091318</span></div>
            </li>
            <li className="flex items-center gap-3 pt-3">
              <MapPin className="h-5 w-5 text-brand-800 shrink-0" />
              <div><strong>Adres:</strong> Levent Mah. Cömert Sok. No:1, Beşiktaş / İstanbul</div>
            </li>
            <li className="flex items-center gap-3 pt-3">
              <Mail className="h-5 w-5 text-brand-800 shrink-0" />
              <div><strong>E-posta:</strong> <a href="mailto:destek@skdmhesapla.com" className="text-brand-800 font-bold hover:underline">destek@skdmhesapla.com</a></div>
            </li>
            <li className="flex items-center gap-3 pt-3">
              <Server className="h-5 w-5 text-brand-800 shrink-0" />
              <div><strong>Bulut Altyapısı:</strong> Google Firebase (Europe-West3 / Frankfurt)</div>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
