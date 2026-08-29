import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Building2,
  MapPin,
  Server,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Clock,
  Lock,
  Compass,
  FileSpreadsheet,
  Award,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";
import { ContactFormClient } from "@/components/contact/ContactFormClient";
import { LEGAL_ENTITY, PERSON_ENTITY } from "@/lib/skdm/constants";
import { SITE } from "@/lib/skdm/site-config";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/iletisim/",
  title: "İletişim & Kurumsal Destek Merkezi — SKDMHesapla",
  description:
    "SKDMHesapla teknik destek, kurumsal lisanslama, işletme künyesi, veri güvenliği ve resmi iletişim kanalları. Türk ihracatçısı için doğrudan destek.",
});

export default function IletisimPage() {
  return (
    <article className="pasaport-zemin-acik min-h-screen bg-[#f7f9f5] py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <GeriLink />

        {/* Hero Header */}
        <header className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-800/20 bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-900 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-800" /> Resmî Şirket Kimliği &amp; Destek Merkezi
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
            İletişim &amp; Kurumsal Destek
          </h1>
          <p className="max-w-3xl text-base font-medium leading-relaxed text-ink-700 sm:text-lg">
            Türk sanayi tesisleri, ihracatçılar ve yetkili CBAM beyan sahipleri için doğrudan teknik yardım, metodoloji danışma, kurumsal lisanslama ve işletme şeffaflığı kanalları.
          </p>

          {/* Live Trust Metrics */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-bold text-emerald-950 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Destek Masası Aktif (09:00 – 18:00)
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-brand-800/15 bg-white px-3 py-1.5 text-xs font-bold text-ink-800 shadow-sm">
              <Clock className="h-3.5 w-3.5 text-brand-800" />
              Ortalama 2–4 İş Saati Yanıt SLA
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-brand-800/15 bg-white px-3 py-1.5 text-xs font-bold text-ink-800 shadow-sm">
              <Lock className="h-3.5 w-3.5 text-brand-800" />
              Frankfurt (AB) Güvenli Veri Merkezi
            </div>
          </div>
        </header>

        {/* Primary Contact Channels (3 Luxury Cards) */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Doğrudan İletişim Kanalları">
          {/* Channel 1 */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-brand-800/20 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-900">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-800">Teknik &amp; Metodoloji</span>
                <h2 className="mt-1 text-lg font-black text-ink-900">Hesaplama ve Formül Desteği</h2>
              </div>
              <p className="text-xs font-medium leading-relaxed text-ink-600">
                GTİP / CN çözünürlüğü, öncül (precursor) emisyon hesabı, 10 Ağustos düzeltilmiş veri seti ve çalışma dosyası veri kontrolleri.
              </p>
            </div>
            <div className="mt-6 border-t border-line pt-4 space-y-2">
              <a
                href={`mailto:${LEGAL_ENTITY.supportEmail}?subject=SKDM%20Teknik%20ve%20Metodoloji%20Destek%20Talebi`}
                className="inline-flex w-full items-center justify-between rounded-xl bg-brand-900 px-4 py-2.5 text-xs font-black text-white hover:bg-brand-800 transition"
              >
                <span>{LEGAL_ENTITY.supportEmail}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <p className="text-[11px] text-center font-semibold text-ink-500">Hafta içi ortalama 2–4 saatte dönüş</p>
            </div>
          </div>

          {/* Channel 2 */}
          <div className="flex flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-800">Kurumsal &amp; Lisanslama</span>
                <h2 className="mt-1 text-lg font-black text-ink-900">Grup Şirketleri &amp; Tedarikçi</h2>
              </div>
              <p className="text-xs font-medium leading-relaxed text-ink-600">
                Çoklu tesis yönetimi, tedarik zinciri veri toplama paketleri, kurumsal faturalandırma ve resmi iş birliği talepleri.
              </p>
            </div>
            <div className="mt-6 border-t border-line pt-4 space-y-2">
              <a
                href="mailto:info@cimetricaone.com?subject=SKDM%20Kurumsal%20ve%20Lisanslama%20Talebi"
                className="inline-flex w-full items-center justify-between rounded-xl border border-brand-800/25 bg-[#fbfdfb] px-4 py-2.5 text-xs font-black text-brand-950 hover:bg-brand-50 transition"
              >
                <span>info@cimetricaone.com</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <p className="text-[11px] text-center font-semibold text-ink-500">Aynı iş günü içinde resmi yanıt</p>
            </div>
          </div>

          {/* Channel 3 */}
          <div className="flex flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:shadow-md sm:grid-cols-2 sm:col-span-2 lg:col-span-1 sm:p-7">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Mühür &amp; Doğrulama</span>
                <h2 className="mt-1 text-lg font-black text-ink-900">Dosya Doğrulama &amp; Verifier</h2>
              </div>
              <p className="text-xs font-medium leading-relaxed text-ink-600">
                SHA-256 mühürlü arşiv paketlerinin kriptografik doğrulanması ve bağımsız doğrulayıcı (verifier) öncesi kanıt hazırlığı.
              </p>
            </div>
            <div className="mt-6 border-t border-line pt-4 space-y-2">
              <Link
                href="/dogrula/"
                className="inline-flex w-full items-center justify-between rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-black text-brand-950 hover:bg-brand-400 shadow-sm transition"
              >
                <span>Mühür Doğrulama Portalı</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <p className="text-[11px] text-center font-semibold text-ink-500">7/24 anlık self-servis doğrulama</p>
            </div>
          </div>
        </section>

        {/* Main Grid: Left Form (7 cols) + Right Entity & Security (5 cols) */}
        <section className="mt-10 grid gap-8 lg:grid-cols-12" aria-label="Destek Formu ve İşletme Bilgileri">
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7">
            <ContactFormClient />
          </div>

          {/* Right Column: Legal Entity, Infrastructure & Methodology Authority */}
          <div className="space-y-6 lg:col-span-5">
            {/* Entity Transparency Card */}
            <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-800 border-b border-line pb-3">
                <Building2 className="h-4 w-4" /> İşletme Künyesi &amp; Şeffaflık
              </div>

              <div className="mt-4 space-y-4 text-sm font-medium text-ink-700">
                <div>
                  <p className="text-xs font-bold uppercase text-ink-500">Yasal İşletme Unvanı</p>
                  <p className="mt-1 text-base font-black text-ink-900">{LEGAL_ENTITY.companyName}</p>
                  <p className="mt-0.5 text-xs text-ink-600">Türkiye kayıtlı işletme</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-ink-500">İşletmeci Merkezi &amp; Adres</p>
                  <div className="mt-1 flex items-start gap-2 text-ink-900 font-bold">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-800 mt-0.5" />
                    <span>{LEGAL_ENTITY.address}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-ink-500">Merkez: {LEGAL_ENTITY.operatorLocation}</p>
                </div>

                <div className="rounded-2xl border border-line bg-brand-50/60 p-3.5 text-xs leading-relaxed text-ink-700">
                  <p className="font-bold text-ink-900">Yasal Kimlik &amp; Fatura Bilgisi:</p>
                  <p className="mt-1">{LEGAL_ENTITY.publicLegalIdentityNote}</p>
                </div>
              </div>
            </div>

            {/* Infrastructure & Security Card */}
            <div className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-800 border-b border-line pb-3">
                <Server className="h-4 w-4" /> Altyapı, Barındırma ve Güvenlik
              </div>

              <div className="mt-4 space-y-3.5 text-xs font-medium text-ink-700 leading-relaxed">
                <div>
                  <p className="font-bold text-ink-900">Veri Merkezi Konumu:</p>
                  <p className="mt-0.5 text-ink-700">{LEGAL_ENTITY.hostingDetail}</p>
                </div>

                <div className="border-t border-line pt-3">
                  <p className="font-bold text-ink-900">Kriptografik Güvenlik &amp; Mühür:</p>
                  <p className="mt-0.5 text-ink-700">
                    Üretilen Kademe A paketleri 12 dosya ve SHA-256 kriptografik parmak izi ile mühürlenir.
                  </p>
                </div>

                <div className="border-t border-line pt-3">
                  <p className="font-bold text-ink-900">Ücretsiz Düzeltme Politikası:</p>
                  <p className="mt-0.5 text-ink-700">{SITE.resealPublicCopy}</p>
                </div>
              </div>
            </div>

            {/* Methodology Responsibility Badge */}
            <div className="rounded-3xl border border-brand-800/15 bg-gradient-to-br from-brand-50 via-white to-emerald-50/40 p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-brand-800/10 pb-3">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-900">
                  <Award className="h-4 w-4 text-brand-800" /> Metodoloji Sorumluluğu
                </span>
                <span className="rounded-full bg-brand-800/10 px-2 py-0.5 text-[10px] font-black text-brand-900">
                  ISO 14064-1
                </span>
              </div>

              <div className="mt-4 flex items-start gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PERSON_ENTITY.imagePath}
                  alt={PERSON_ENTITY.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-brand-800/20 object-cover shadow-sm"
                />
                <div className="space-y-1">
                  <p className="text-sm font-black text-ink-900">{PERSON_ENTITY.name}</p>
                  <p className="text-xs font-bold text-brand-900 leading-snug">{PERSON_ENTITY.jobTitle}</p>
                  <p className="text-[11px] text-ink-600 font-medium">Gaziantep Üniv. / GSO-MEM · TARIMKON Danışma Kurulu</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-800/10">
                <Link
                  href="/uzmanlik/baris-bagirlar/"
                  className="inline-flex items-center gap-1 text-xs font-black text-brand-900 hover:text-brand-700 underline underline-offset-4"
                >
                  Metodoloji Sorumlusu Profilini İncele <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Self-Service & Resolution Hub (4 Cards) */}
        <section className="mt-14" aria-labelledby="quick-help-title">
          <div className="border-b border-line pb-4">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">
              Hızlı Çözüm Merkezi
            </span>
            <h2 id="quick-help-title" className="mt-1 text-2xl font-black tracking-tight text-ink-900">
              Sıkça Başvurulan Hızlı İşlemler
            </h2>
            <p className="mt-1 text-sm font-medium text-ink-600">
              Talebiniz aşağıdaki konulardan biriyle ilgiliyse, doğrudan ilgili self-servis modülü kullanabilirsiniz:
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Action 1 */}
            <Link
              href="/basla/"
              className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-brand-800/30 hover:shadow-md"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-900 group-hover:scale-105 transition">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-black text-ink-900">GTİP ile Kapsam Kontrolü</h3>
                <p className="mt-1.5 text-xs font-medium text-ink-600 leading-relaxed">
                  Ürününüzün 6 sektör ve 569 CN kodu kapsamında olup olmadığını 10 saniyede ücretsiz sorgulayın.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 group-hover:text-brand-700">
                Kapsamı Kontrol Et <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Action 2 */}
            <Link
              href="/dogrula/"
              className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-brand-800/30 hover:shadow-md"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 group-hover:scale-105 transition">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-black text-ink-900">Mühür Doğrulama Portalı</h3>
                <p className="mt-1.5 text-xs font-medium text-ink-600 leading-relaxed">
                  Size sunulan veya ürettiğiniz SKDM dosyasının SHA-256 hash kodunu anında karşılaştırıp teyit edin.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 group-hover:text-brand-700">
                Mühürü Doğrula <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Action 3 */}
            <Link
              href="/cbam-dogrulama/"
              className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-brand-800/30 hover:shadow-md"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-900 group-hover:scale-105 transition">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-black text-ink-900">CBAM Doğrulama Rehberi</h3>
                <p className="mt-1.5 text-xs font-medium text-ink-600 leading-relaxed">
                  24–28 Ağustos Komisyon verifier ve 1 Eylül Registry erişim prosedürünün dosyanıza etkisini öğrenin.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 group-hover:text-brand-700">
                Rehberi İncele <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Action 4 */}
            <Link
              href="/metodoloji/"
              className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-brand-800/30 hover:shadow-md"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 group-hover:scale-105 transition">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-black text-ink-900">Metodoloji ve Formüller</h3>
                <p className="mt-1.5 text-xs font-medium text-ink-600 leading-relaxed">
                  (AB) 2023/956 ve (AB) 2025/2547 tüzüklerine dayalı emisyon sınırları ve hesaplama mantığı.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 group-hover:text-brand-700">
                Metodolojiyi Gör <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>

        {/* Legal Disclaimer Banner */}
        <footer className="mt-12 space-y-4 border-t border-line pt-8">
          <DisclaimerBanner />
          <p className="text-center text-xs font-medium text-ink-500">
            {LEGAL_ENTITY.copyrightFull} · {LEGAL_ENTITY.publicLegalIdentityNote}
          </p>
        </footer>
      </div>
    </article>
  );
}

