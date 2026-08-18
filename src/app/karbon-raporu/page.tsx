import type { Metadata } from "next";
import { Suspense } from "react";
import { PcfWizard } from "@/components/pcf/PcfWizard";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { pageMetadata } from "@/lib/skdm/seo";
import { PCF_SEALED_PACKAGE_FILE_COUNT } from "@/lib/pcf/package-manifest";

export const metadata: Metadata = pageMetadata({
  path: "/karbon-raporu/",
  title: "Ürün Karbon Ayak İzi Raporu Hazırla | SKDMHesapla",
  description: "AB müşterinize gönderebileceğiniz kaynakları izlenebilir ürün karbon ayak izi raporunu üretim verilerinizle hazırlayın.",
});

export default function KarbonRaporuPage() {
  return (
    <>
      <RegistryJsonLd route="/karbon-raporu/" />
      <div className="pasaport-zemin-acik min-h-screen bg-brand-50">
        <div className="mx-auto max-w-5xl space-y-6 px-5 py-8 sm:px-6 sm:py-12">
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-800">Ürün karbon ayak izi</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Ürün karbon ayak izi raporunu üretim verilerinizle hazırlayın.
            </h1>
            <p className="max-w-3xl text-base font-medium leading-relaxed text-ink-700">
              AB müşterinize gönderebileceğiniz kaynakları izlenebilir ürün karbon ayak izi (PCF) çalışmasını,
              fabrikanızdaki gerçek verilerle oluşturun. Emisyon faktörlerini, kaynak künyelerini ve kalite durumunu sistem yönetir.
            </p>
          </header>

          <section className="rounded-3xl border-2 border-brand-800/20 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-ink-900">Nasıl çalışır?</h2>
            <ul className="mt-4 space-y-3 text-sm font-medium leading-relaxed text-ink-700">
              <li>✓ Mevzuat seçmeniz gerekmez; genel bir LCA emisyon faktörü girmezsiniz.</li>
              <li>✓ Kaynağı, kapsamı veya tazeliği net olmayan faktör kullanılırsa sistem sonuç üretmez.</li>
              <li>✓ Tedarikçinizden EPD/PCF varsa ilgili malzeme satırına ekleyebilirsiniz.</li>
              <li>✓ Sonuç alıcıya gönderilebilir {PCF_SEALED_PACKAGE_FILE_COUNT} dosyalık mühürlü paket olarak sunulur.</li>
            </ul>
          </section>

          <section className="rounded-3xl border-2 border-line bg-white p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-ink-900">Kapsam ve sınır</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-ink-700">
              Bu çalışma SKDM (CBAM) beyanı değildir. Ürün karbon ayak izi; ISO 14067 ve PACT metodolojilerini referans alan,
              cradle-to-gate sistem sınırında, faaliyet verileri ve izlenebilir emisyon faktörleriyle hesaplanır.
              Çıktı bağımsız doğrulama görüşü, ISO sertifikası, gümrük kararı veya CBAM beyanı anlamına gelmez.
              SKDM kapsam kararı ürünün CN/GTİP koduna göre yapılır; bu çalışma CBAM hesaplaması üretmez.
            </p>
            <p className="mt-4 text-sm font-medium leading-relaxed text-ink-700">
              İlgili: <a className="font-bold text-brand-900 underline" href="/metodoloji/">Metodoloji</a>{" · "}
              <a className="font-bold text-brand-900 underline" href="/dogrula/">Paket doğrulama</a>{" · "}
              <a className="font-bold text-brand-900 underline" href="/basla/">SKDM kapsam rehberi</a>
            </p>
          </section>

          <Suspense fallback={<div className="rounded-3xl border border-line bg-white p-8 font-semibold text-ink-700">Karbon raporu çalışma alanı hazırlanıyor…</div>}>
            <PcfWizard />
          </Suspense>
        </div>
      </div>
    </>
  );
}
