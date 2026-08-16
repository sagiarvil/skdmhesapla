import type { Metadata } from "next";
import { ShieldCheck, Lock } from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";

import { LEGAL_ENTITY } from "@/lib/skdm/constants";

export const metadata: Metadata = {
  title: "KVKK & Gizlilik Aydınlatma Metni — SKDMHesapla",
  description: "6698 sayılı KVKK kapsamında kişisel veri işleme, saklama ve gizlilik ilkelerimiz.",
};

export default function KvkkAydinlatmaPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f8f9fa] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            6698 Sayılı KVKK &amp; GDPR Uyumluluğu
          </span>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">KVKK Aydınlatma Metni</h1>
          <p className="text-base font-semibold text-ink-700 sm:text-lg">
            Kişisel ve ticari verilerinizin korunması ve işlenmesi prensipleri.
          </p>
        </div>

        <DisclaimerBanner />

        <div className="rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl sm:p-9 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-brand-800" />
            <h2 className="text-2xl font-black text-ink-900">Veri Sorumlusu &amp; Gizlilik</h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
            <p>
              <strong>Veri Sorumlusu:</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) ve Avrupa Birliği Genel Veri Koruma Tüzüğü (&ldquo;GDPR&rdquo;) uyarınca veri sorumlusu <strong>{LEGAL_ENTITY.companyName}</strong> (VKN: {LEGAL_ENTITY.vkn}) olup, başvurularınızı <a href={`mailto:${LEGAL_ENTITY.supportEmail}`} className="text-brand-800 font-bold hover:underline">{LEGAL_ENTITY.supportEmail}</a> adresine iletebilirsiniz.
            </p>
            <p>
              <strong>1. İşlenen Veriler:</strong> Hesaplama sürecinde girilen tesis unvanı, iletişim bilgileri, yakıt tüketimleri ve üretim miktarları yalnızca talep ettiğiniz denetime hazırlık dosyasının üretilmesi ve SHA-256 doğrulama kaydının tutulması amacıyla işlenir.
            </p>
            <p>
              <strong>2. Verilerin Saklanması &amp; Altyapı:</strong> Verileriniz üçüncü şahıslara veya reklam ağlarına satılmaz. Üretilen mühürlü dosyalarınız şifrelenmiş sunucularımızda ({LEGAL_ENTITY.serverLocation}) güvenle muhafaza edilir.
            </p>
            <p>
              <strong>3. Haklarınız:</strong> KVKK m. 11 kapsamındaki haklarınızı kullanmak üzere dilediğiniz zaman <a href={`mailto:${LEGAL_ENTITY.supportEmail}`} className="text-brand-800 font-bold hover:underline">{LEGAL_ENTITY.supportEmail}</a> üzerinden yazılı talepte bulunabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
