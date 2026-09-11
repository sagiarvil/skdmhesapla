import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/privacy/",
  title: "Gizlilik ve KVKK Politikası (Privacy Policy) — skdmhesapla.com",
  description:
    "skdmhesapla.com Gizlilik Politikası, KVKK aydınlatma bildirimleri, veri güvenliği ve AB GDPR uyumluluk ilkeleri.",
});

const privacyPolicyJsonLd = {
  "@context": "https://schema.org",
  "@type": "PrivacyPolicy",
  "@id": "https://skdmhesapla.com/privacy/#privacypolicy",
  "name": "Gizlilik ve KVKK Politikası",
  "url": "https://skdmhesapla.com/privacy/",
  "datePublished": "2026-01-01",
  "dateModified": "2026-09-11",
  "inLanguage": "tr-TR",
  "publisher": {
    "@type": "Organization",
    "@id": "https://skdmhesapla.com/#organization",
    "name": "skdmhesapla.com",
    "url": "https://skdmhesapla.com/",
    "logo": "https://skdmhesapla.com/logo/skdm-logo-header.svg"
  }
};

export default function PrivacyPage() {
  return (
    <>
      <RegistryJsonLd route="/privacy/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyPolicyJsonLd) }}
      />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink />

          <header className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
              Yasal Uyumluluk &amp; Veri Güvenliği
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-[40px]">
              Gizlilik ve KVKK Politikası (Privacy Policy)
            </h1>
            <p className="text-base font-medium leading-relaxed text-ink-700 sm:text-lg">
              skdmhesapla.com platformu olarak verilerinizin gizliliğine ve güvenliğine en üst düzeyde önem veriyoruz. 6698 sayılı KVKK ve AB Genel Veri Koruma Tüzüğü (GDPR) prensiplerine tam uyum sağlamaktayız.
            </p>
          </header>

          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-ink-900">1. Veri Sorumlusu</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Veri sorumlusu: <strong>{LEGAL_ENTITY.companyName}</strong> ({LEGAL_ENTITY.publicLegalIdentityNote}).
              İşletmeci merkezi: {LEGAL_ENTITY.operatorLocation}.
              Destek ve İletişim: <a href={`mailto:${LEGAL_ENTITY.supportEmail}`} className="font-bold text-brand-800 underline">{LEGAL_ENTITY.supportEmail}</a>.
            </p>
          </section>

          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-ink-900">2. Sunucu Konumu ve Veri Egemenliği</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              Tüm üretim veritabanlarımız ve işleme altyapımız <strong>{LEGAL_ENTITY.serverLocation}</strong> üzerinde barındırılmaktadır. Verileriniz Avrupa Birliği Veri Egemenliği ve KVKK sınır ötesi aktarım kurallarına uygun olarak şifreli (AES-256 / TLS 1.3) biçimde korunur.
            </p>
          </section>

          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-ink-900">3. İşlenen Veriler ve Amaçları</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm font-medium text-ink-700">
              <li><strong>Hesap ve Giriş Bilgileri:</strong> Ad, soyad, iş e-postası, firma unvanı ve vergi numarası (VKN).</li>
              <li><strong>Hesaplama ve Beyan Verileri:</strong> SKDM emisyon katsayıları, üretim miktarları, prekürsör tüketimleri, gemi IMO ve yakıt verileri. Bu veriler yalnızca kullanıcının denetime hazırlık dosyasını üretmek ve doğrulamak amacıyla işlenir.</li>
              <li><strong>Mühür ve Güvenlik İzleri:</strong> SHA-256 sağlama toplamı, kriptografik zaman damgası ve paket doğrulama kayıtları.</li>
            </ul>
          </section>

          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-ink-900">4. İlgili Kişi Hakları ve İletişim</h2>
            <p className="text-sm font-medium leading-relaxed text-ink-700">
              KVKK m.11 ve GDPR m.15-22 uyarınca verilerinize erişme, düzeltilmesini isteme, silinmesini veya anonimleştirilmesini talep etme hakkına sahipsiniz. Tüm talepleriniz için{" "}
              <Link href="/iletisim/" className="font-bold text-brand-800 underline">
                İletişim Masası
              </Link>{" "}
              üzerinden veya doğrudan destek e-posta adresimizden bize ulaşabilirsiniz.
            </p>
            <p className="text-xs text-ink-500 pt-2 border-t border-line">
              Detaylı metinler için ayrıca <Link href="/kvkk-aydinlatma/" className="font-bold text-brand-800 underline">KVKK Aydınlatma Metni</Link> ve <Link href="/kullanim-kosullari/" className="font-bold text-brand-800 underline">Kullanım Koşulları</Link> sayfalarımızı inceleyebilirsiniz.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
