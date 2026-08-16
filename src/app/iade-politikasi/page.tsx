import type { Metadata } from "next";
import { RefreshCw, Scale } from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";

export const metadata: Metadata = {
  title: "İade ve İptal Politikası — SKDMHesapla",
  description: "Dijital hizmet ve mühürlü paket teslimatına ilişkin iade ve iptal şartları.",
};

export default function IadePolitikasiPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Hukuki Şartlar &amp; Tüketici Hakları
          </span>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">İade ve İptal Politikası</h1>
          <p className="text-base font-semibold text-ink-700 sm:text-lg">
            Dijital içerik teslimatı ve hizmet politikamız.
          </p>
        </div>

        <DisclaimerBanner />

        <div className="rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl sm:p-9 space-y-6">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-brand-800" />
            <h2 className="text-2xl font-black text-ink-900">Dijital Ürün İade Şartları</h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
            <p>
              SKDMHesapla üzerinde hesaplama, veri girişi, kalite kontrolleri ve maliyet önizlemeleri
              tamamen ücretsizdir. Kullanıcılarımız dosyalarını hiçbir bedel ödemeden diledikleri kadar test edebilirler.
            </p>
            <p>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesinin (ğ) bendi uyarınca,
              <strong>elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara (mühürlü ZIP paketi) ilişkin sözleşmelerde cayma hakkı kullanılamaz.</strong>
            </p>
            <p>
              Mühürleme sonrası teslim edilen dosyalarda herhangi bir teknik aksaklık yaşanması durumunda, 14 gün içerisinde{" "}
              <a href="mailto:destek@skdmhesapla.com" className="text-brand-800 font-bold hover:underline">destek@skdmhesapla.com</a>{" "}
              üzerinden teknik destek talep edebilir, ücretsiz yeniden üretim hakkından yararlanabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
