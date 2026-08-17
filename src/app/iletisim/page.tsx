import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { Mail, Building2, MapPin, Server } from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";

import { LEGAL_ENTITY } from "@/lib/skdm/constants";

export const metadata: Metadata = pageMetadata({
  path: "/iletisim/",
  title: "İletişim & Şirket Bilgileri — SKDMHesapla",
  description: "Resmi şirket kimliği, iletişim kanalları, VKN ve veri merkezi bilgileri.",
});

export default function IletisimPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f8f9fa] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Resmi Şirket Kimliği &amp; Destek
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-[40px] md:text-[44px]">İletişim</h1>
          <p className="text-base font-normal text-ink-700 sm:text-[18px]">
            Teknik destek, faturalandırma ve resmi işletme bilgileri.
          </p>
        </div>

        <DisclaimerBanner />

        <div className="rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl sm:p-9 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ink-900 sm:text-[24px]">İşletme Künyesi</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-base text-ink-700 font-medium">
              <div className="rounded-2xl border border-line bg-brand-100/40 p-4 space-y-1">
                <div className="flex items-center gap-2 text-brand-800 font-bold">
                  <Building2 className="h-5 w-5" />
                  <span>İşletme Sahibi / Unvan</span>
                </div>
                <div className="text-lg font-black text-ink-900">{LEGAL_ENTITY.companyName}</div>
                <div className="text-xs text-ink-600 font-mono">VKN: {LEGAL_ENTITY.vkn}</div>
              </div>

              <div className="rounded-2xl border border-line bg-brand-100/40 p-4 space-y-1">
                <div className="flex items-center gap-2 text-brand-800 font-bold">
                  <Mail className="h-5 w-5" />
                  <span>E-Posta Desteği</span>
                </div>
                <a href={`mailto:${LEGAL_ENTITY.supportEmail}`} className="text-lg font-black text-brand-800 hover:underline">
                  {LEGAL_ENTITY.supportEmail}
                </a>
                <div className="text-xs text-ink-600">Ortalama yanıt süresi: 4 saat</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-line">
            <h3 className="text-xl font-black text-ink-900">Altyapı ve Veri Güvenliği</h3>
            <div className="rounded-2xl border border-line bg-brand-100/40 p-4 space-y-2 text-sm text-ink-700 font-medium">
              <div className="flex items-center gap-2 font-bold text-ink-900">
                <Server className="h-4 w-4 text-brand-800" />
                <span>Sunucu ve Veri Merkezi Konumu</span>
              </div>
              <p>
                Tüm veri işleme ve mühürlü dosya üretim altyapımız <strong>Frankfurt (Almanya / AB)</strong> veri merkezinde, ISO/IEC 27001 sertifikalı Google Cloud ve Cloudflare kurumsal ağlarında barındırılmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
