import type { Metadata } from "next";
import { ShieldCheck, Sparkles } from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — SKDMHesapla",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <Sparkles className="h-4 w-4" />
            <span>Kişisel Verilerin Korunması</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">KVKK Aydınlatma Metni</h1>
          <p className="text-base font-semibold text-ink-700 sm:text-lg">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki haklarınız ve veri işleme politikamız.
          </p>
        </div>

        <DisclaimerBanner />

        <div className="rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl sm:p-9 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-brand-800" />
            <h2 className="text-2xl font-black text-ink-900">Veri Sorumlusu ve Haklarınız</h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
            <p>
              <strong>Veri Sorumlusu:</strong> Barış Bağırlar (VKN 25403091318), Levent Mah. Cömert Sok. No:1 Beşiktaş / İstanbul.
            </p>
            <p>
              <strong>İşlenen Veri Kategorileri:</strong> Yetkili kişi iletişim bilgileri (ad, soyad, e-posta, telefon), kurumsal tesis bilgileri, emisyon hesaplama faaliyet verileri ve faturalandırma/ödeme kayıtları.
            </p>
            <p>
              <strong>İşleme Amaçları ve Hukuki Sebep:</strong> Hizmet sözleşmesinin ifası, hesaplama paketinin SHA-256 bütünlük doğrulamasıyla teslimi, e-fatura düzenlenmesi ve müşteri destek süreçlerinin yürütülmesi.
            </p>
            <p>
              <strong>Veri Saklama ve Güvenlik:</strong> Verileriniz Google Cloud / Firebase (Europe-West3 / Frankfurt) sunucularında 256-bit şifrelenmiş olarak güvenle muhafaza edilir.
            </p>
            <p>
              <strong>İlgili Kişi Hakları (KVKK m. 11):</strong> Verilerinizin işlenip işlenmediğini öğrenme, silinmesini veya düzeltilmesini talep etme haklarınızı <a href="mailto:destek@skdmhesapla.com" className="text-brand-800 font-bold hover:underline">destek@skdmhesapla.com</a> adresine başvurarak kullanabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
