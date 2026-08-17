import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { LEGAL_ENTITY, PLATFORM_STATS } from "@/lib/skdm/constants";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/hakkinda/",
  title: "Hakkında — CimetricaOne & SKDMHesapla",
  description:
    "SKDMHesapla, CimetricaOne tarafından geliştirilen self-servis SKDM/CBAM denetime hazırlık yazılımıdır. Yasal kimlik, kapsam ve iletişim bilgileri.",
});

export default function HakkindaPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <header className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Kurumsal kimlik
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-[40px]">
            Hakkında
          </h1>
          <p className="text-base font-medium leading-relaxed text-ink-700 sm:text-lg">
            {LEGAL_ENTITY.brandName}, Türk ihracatçılar için AB SKDM (CBAM) denetime hazırlık
            dosyası üreten self-servis bir yazılımdır.
          </p>
        </header>

        <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-ink-900">İşletmeci</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-ink-500">Ticari unvan</dt>
              <dd className="font-semibold text-ink-900">{LEGAL_ENTITY.companyName}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink-500">VKN</dt>
              <dd className="font-mono font-semibold text-ink-900">{LEGAL_ENTITY.vkn}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink-500">Destek e-posta</dt>
              <dd>
                <a
                  className="font-semibold text-brand-800 underline"
                  href={`mailto:${LEGAL_ENTITY.supportEmail}`}
                >
                  {LEGAL_ENTITY.supportEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-ink-500">Sunucu konumu</dt>
              <dd className="font-semibold text-ink-900">{LEGAL_ENTITY.serverLocation}</dd>
            </div>
          </dl>
        </section>

        <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-ink-900">Ne yapar, ne yapmaz</h2>
          <p className="text-base font-medium leading-relaxed text-ink-700">
            {LEGAL_ENTITY.disclaimer}
          </p>
          <ul className="list-disc space-y-2 pl-5 text-base font-medium text-ink-700">
            <li>{PLATFORM_STATS.sectorCount} sektör için yapılandırılmış veri girişi</li>
            <li>{PLATFORM_STATS.stepCount} adımlı sihirbaz ve kalite kontrolleri</li>
            <li>{PLATFORM_STATS.fileCount} parçalı mühürlü denetime hazırlık paketi</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-ink-900">İletişim ve hukuki</h2>
          <p className="text-base font-medium text-ink-700">
            Destek ve sorularınız için{" "}
            <Link href="/iletisim/" className="font-bold text-brand-800 underline">
              İletişim
            </Link>{" "}
            sayfasını kullanın. Kişisel veriler için{" "}
            <Link href="/kvkk-aydinlatma/" className="font-bold text-brand-800 underline">
              KVKK Aydınlatma
            </Link>
            ; kullanım koşulları için ilgili hukuki sayfalara bakın.
          </p>
        </section>
      </div>
    </article>
  );
}
