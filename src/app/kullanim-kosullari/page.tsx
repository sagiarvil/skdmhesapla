import type { Metadata } from "next";
import { FileText, Sparkles } from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — SKDMHesapla",
  description: "SKDMHesapla self-servis B2B yazılımı kullanım şartları ve yasal çerçeve.",
};

export default function KullanimKosullariPage() {
  const fiyat = PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR");

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <Sparkles className="h-4 w-4" />
            <span>Yasal Sözleşme</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">Kullanım Koşulları</h1>
          <p className="text-base font-semibold text-ink-700 sm:text-lg">
            Hizmetlerimizin kullanımına ilişkin hak ve yükümlülükler.
          </p>
        </div>

        <DisclaimerBanner />

        <div className="rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl sm:p-9 space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-brand-800" />
            <h2 className="text-2xl font-black text-ink-900">Hizmet Kapsamı ve Hukuki Sorumluluk</h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
            <p>
              SKDMHesapla, sanayi tesislerinin AB Sınırda Karbon Düzenleme Mekanizması (CBAM) ve ilgili
              tüzükler (AB 2023/956, AB 2025/2083, IR 2025/2547) uyarınca emisyon hesaplama ve denetime hazırlık
              dosyası oluşturmasını sağlayan self-servis B2B dijital yazılımdır.
            </p>
            <p>
              Sistem tarafından sağlanan çıktılar ve hesaplama modelleri bilgilendirme ve denetime ön-hazırlık niteliğindedir.
              Akredite doğrulama görüşü veya gümrük onay belgesi teşkil etmez. Resmi SKDM beyanı AB CBAM Registry üzerinden
              yetkili beyan sahibi (ithalatçınız) tarafından gerçekleştirilir.
            </p>
            <p>
              Mühürleme öncesi tüm aşamalar, veri girişleri ve maliyet simülasyonları tamamen ücretsizdir.
              Yalnızca nihai SHA-256 dijital mühürlü 6 dosyalık paket tesliminde tek seferlik ve KDV dahil{" "}
              <strong className="font-mono font-bold text-ink-900">{fiyat} ₺</strong> hizmet bedeli tahsil edilir.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
