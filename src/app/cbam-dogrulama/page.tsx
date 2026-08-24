import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { absoluteUrl, pageMetadata } from "@/lib/skdm/seo";
import { VerificationGuidanceNotice } from "@/components/regulatory/VerificationGuidanceNotice";

export const metadata: Metadata = pageMetadata({
  path: "/cbam-dogrulama/",
  title: "CBAM Doğrulama 2026 — Verifier, Akreditasyon ve Registry",
  description:
    "CBAM / SKDM doğrulama süreci: akredite verifier, ulusal akreditasyon kuruluşu, 1 Eylül 2026 Registry erişimi ve Ocak 2027 doğrulama raporu akışı.",
});

export default function CbamDogrulamaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl("/cbam-dogrulama/")}#page`,
    url: absoluteUrl("/cbam-dogrulama/"),
    name: "CBAM Doğrulama 2026 — Verifier, Akreditasyon ve Registry",
    inLanguage: "tr-TR",
    about: ["CBAM verification", "CBAM verifier", "CBAM accreditation", "CBAM Registry"],
  };

  return (
    <main className="min-h-screen bg-white text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-line bg-gradient-to-b from-[#eef5f0] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <ShieldCheck className="h-8 w-8 text-brand-800" />
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">CBAM doğrulama: Türk üretici ne zaman verifier ile çalışır?</h1>
          <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-ink-700">
            Hesaplama ile doğrulama aynı aşama değildir. Önce tesis verisi ve emisyon raporu hazırlanır; kesin dönem doğrulaması CBAM kapsamında akredite bağımsız doğrulayıcı tarafından yürütülür.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <VerificationGuidanceNotice />
        </div>
      </section>

      <section className="border-y border-line bg-[#f7faf6] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <h2 className="text-3xl font-black tracking-tight">Doğrulama öncesinde dosyada ne hazır olmalı?</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              ["İzleme planı", "Kaynak akışlarının, ölçüm yöntemlerinin ve veri kalite yaklaşımının tanımı."],
              ["Üretim süreçleri", "Hangi mal kategorisinin hangi üretim sürecinden çıktığını gösteren izlenebilir kayıt."],
              ["Faaliyet verileri", "Yakıt, elektrik, üretim miktarı ve kullanılan ölçüm/kayıt kaynakları."],
              ["Precursor verileri", "Kapsam içi öncül maddelerin miktarı, kaynağı ve gömülü emisyon bilgisi."],
              ["Hesap izi", "Son SEE sonucuna hangi formül, katsayı ve veri satırlarıyla ulaşıldığını gösteren kayıt."],
              ["Kanıt zinciri", "Fatura, sayaç, laboratuvar, kalibrasyon ve tedarikçi belgelerinin hesap satırlarıyla eşleştirilmesi."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-line bg-white p-5">
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-ink-700">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="rounded-3xl border-2 border-brand-800/15 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black">SKDMHesapla ne yapar, ne yapmaz?</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-ink-700">
              Yazılım veri toplama, hesaplama, denklik kontrolleri, kanıt izi ve doğrulayıcıya hazırlık paketini düzenler. Akreditasyon vermez, verifier atamaz ve akredite doğrulama görüşü üretmez. SHA-256 mühür yalnız dosya bütünlüğünü doğrular.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/cbam-hesaplama/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-black text-white">Hesaplama akışını gör <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/sss/#dogrulama" className="inline-flex min-h-11 items-center rounded-xl border border-brand-800/20 px-5 text-sm font-black text-brand-900">Doğrulama SSS</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
