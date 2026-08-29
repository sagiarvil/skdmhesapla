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
  Sparkles,
  HelpCircle,
  Check,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
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
    "SKDMHesapla teknik destek masası, kurumsal lisanslama, işletme künyesi, veri güvenliği ve resmi iletişim kanalları. Türk ihracatçısı için doğrudan kurumsal destek.",
});

const SUPPORT_PRINCIPLES = [
  {
    title: "Yazılı & Kayıtlı İletişim",
    desc: "Tüm teknik ve metodolojik sorularınız, denetim izlenebilirliği için yazılı kayıt altına alınır ve arşivlenir.",
    icon: FileCheck2,
  },
  {
    title: "2–4 Saat Yanıt SLA'sı",
    desc: "Hafta içi 09:00–18:00 saatleri arasındaki teknik destek talepleri ortalama 2–4 iş saatinde yanıtlanır.",
    icon: Clock,
  },
  {
    title: "Mühür & Yeniden Üretim",
    desc: "Aynı çalışma dosyasında veri düzeltmeleri ve yeniden mühürlemeler tamamen ücretsiz olarak gerçekleştirilir.",
    icon: ShieldCheck,
  },
  {
    title: "Veri Gizliliği Güvencesi",
    desc: "Tesis emisyon verileriniz ve girdi parametreleriniz üçüncü taraflarla paylaşılmaz veya model eğitiminde kullanılmaz.",
    icon: Lock,
  },
];

export default function IletisimPage() {
  return (
    <article className="pasaport-zemin-acik min-h-screen bg-[#f7f9f5] py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GeriLink />

        {/* Executive Hero Banner */}
        <header className="relative mt-6 overflow-hidden rounded-3xl border-2 border-brand-800/25 bg-gradient-to-br from-brand-950 via-brand-900 to-[#12210b] p-7 text-white shadow-2xl sm:p-10 lg:p-12">
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
          />

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-500 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5" /> Resmî Şirket Kimliği &amp; Destek Merkezi
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Destek Masası Aktif (09:00 – 18:00)
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              İletişim &amp; Kurumsal Destek
            </h1>

            <p className="max-w-2xl text-base font-medium leading-relaxed text-brand-tint/90 sm:text-lg">
              Türk sanayi tesisleri, ihracatçılar ve CBAM yetkili beyan sahipleri için doğrudan teknik yardım, metodoloji danışma, kurumsal lisanslama ve şeffaf işletme kanalları.
            </p>

            {/* Live Trust Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-white/90 backdrop-blur-sm">
                <Clock className="h-4 w-4 text-brand-500" />
                <span>Ortalama 2–4 İş Saati SLA</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-white/90 backdrop-blur-sm">
                <Server className="h-4 w-4 text-brand-500" />
                <span>Frankfurt (AB) Egemen Sunucu</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-white/90 backdrop-blur-sm">
                <Shield className="h-4 w-4 text-brand-500" />
                <span>SHA-256 Mühür Standartları</span>
              </div>
            </div>
          </div>
        </header>

        {/* Primary Contact Channels (3 Luxury Elite Cards) */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Doğrudan İletişim Kanalları">
          {/* Channel 1: Technical & Methodology */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-brand-800/20 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-800/40 hover:shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-800 to-brand-500" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-brand-50 border border-brand-800/15 text-brand-900 shadow-sm">
                  <Headphones className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-brand-900">
                  Öncelikli Masa
                </span>
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-800">Teknik Destek &amp; Metodoloji</span>
                <h2 className="mt-1 text-xl font-black text-ink-900">Hesaplama ve Formül Masası</h2>
              </div>
              <p className="text-xs font-medium leading-relaxed text-ink-600">
                GTİP / CN çözünürlüğü, öncül (precursor) emisyon hesabı, 10 Ağustos düzeltilmiş varsayılan değerler (EU 2026/1740) ve çalışma dosyası kontrolleri.
              </p>
            </div>
            <div className="mt-7 border-t border-line pt-4 space-y-2.5">
              <a
                href={`mailto:${LEGAL_ENTITY.supportEmail}?subject=SKDM%20Teknik%20ve%20Metodoloji%20Destek%20Talebi`}
                className="inline-flex w-full items-center justify-between rounded-xl bg-brand-900 px-4 py-3 text-xs font-black text-white hover:bg-brand-800 transition shadow-sm"
              >
                <span>{LEGAL_ENTITY.supportEmail}</span>
                <ArrowRight className="h-4 w-4 text-brand-500" />
              </a>
              <p className="text-[11px] text-center font-semibold text-ink-500">Hafta içi ortalama 2–4 iş saatinde uzman yanıtı</p>
            </div>
          </div>

          {/* Channel 2: Corporate & Multi-Facility */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-600 to-sky-400" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 shadow-sm">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-sky-900">
                  B2B Entegrasyon
                </span>
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-800">Kurumsal &amp; Lisanslama</span>
                <h2 className="mt-1 text-xl font-black text-ink-900">Grup Şirketleri &amp; Tedarikçi</h2>
              </div>
              <p className="text-xs font-medium leading-relaxed text-ink-600">
                Çoklu tesis yönetimi, tedarik zinciri (Scope 3) veri toplama paketleri, kurumsal faturalandırma ve resmi iş birliği talepleri.
              </p>
            </div>
            <div className="mt-7 border-t border-line pt-4 space-y-2.5">
              <a
                href="mailto:info@cimetricaone.com?subject=SKDM%20Kurumsal%20ve%20Lisanslama%20Talebi"
                className="inline-flex w-full items-center justify-between rounded-xl border border-sky-300/80 bg-[#f8fbff] px-4 py-3 text-xs font-black text-sky-950 hover:bg-sky-50 transition shadow-sm"
              >
                <span>info@cimetricaone.com</span>
                <ArrowRight className="h-4 w-4 text-sky-700" />
              </a>
              <p className="text-[11px] text-center font-semibold text-ink-500">Aynı iş günü içinde resmi yazılı geri dönüş</p>
            </div>
          </div>

          {/* Channel 3: Seal & Verification */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-900">
                  7/24 Self-Servis
                </span>
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Mühür &amp; Doğrulama</span>
                <h2 className="mt-1 text-xl font-black text-ink-900">Dosya Doğrulama &amp; Verifier</h2>
              </div>
              <p className="text-xs font-medium leading-relaxed text-ink-600">
                SHA-256 mühürlü arşiv paketlerinin kriptografik doğrulanması ve 24–28 Ağustos Komisyon prosedürü uyarınca doğrulayıcı hazırlığı.
              </p>
            </div>
            <div className="mt-7 border-t border-line pt-4 space-y-2.5">
              <Link
                href="/dogrula/"
                className="inline-flex w-full items-center justify-between rounded-xl bg-brand-500 px-4 py-3 text-xs font-black text-brand-950 hover:bg-brand-400 transition shadow-sm"
              >
                <span>Mühür Doğrulama Portalı</span>
                <ArrowRight className="h-4 w-4 text-brand-950" />
              </Link>
              <p className="text-[11px] text-center font-semibold text-ink-500">7/24 anlık kriptografik SHA-256 kontrolü</p>
            </div>
          </div>
        </section>

        {/* Main Grid: Left Interactive Terminal (7 cols) + Right Trust & Transparency Vault (5 cols) */}
        <section className="mt-12 grid gap-8 lg:grid-cols-12" aria-label="Destek Formu ve İşletme Bilgileri">
          {/* Left Column: Interactive Support Terminal */}
          <div className="lg:col-span-7">
            <ContactFormClient />
          </div>

          {/* Right Column: Legal Entity, Infrastructure & Methodology Authority */}
          <div className="space-y-6 lg:col-span-5">
            {/* Entity Transparency Vault Card */}
            <div className="overflow-hidden rounded-3xl border-2 border-brand-800/20 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-900">
                  <Building2 className="h-4 w-4 text-brand-800" /> İşletme Künyesi &amp; Yasal Şeffaflık
                </div>
                <span className="rounded bg-brand-100 px-2 py-0.5 text-[10px] font-black text-brand-900">
                  GATE-F UYUMLU
                </span>
              </div>

              <div className="mt-5 space-y-4 text-sm font-medium text-ink-700">
                <div className="rounded-2xl border border-line bg-[#fafbfa] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">Yasal İşletme Unvanı</p>
                  <p className="mt-1 text-lg font-black text-ink-900">{LEGAL_ENTITY.companyName}</p>
                  <p className="mt-0.5 text-xs text-ink-600">Türkiye Cumhuriyeti mevzuatına kayıtlı işletme</p>
                </div>

                <div className="rounded-2xl border border-line bg-[#fafbfa] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">İşletmeci Merkezi &amp; Kamuya Açık Adres</p>
                  <div className="mt-1.5 flex items-start gap-2 text-ink-900 font-bold text-sm">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-800 mt-0.5" />
                    <span>{LEGAL_ENTITY.address}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-ink-500 font-medium">Hukuki Merkez: {LEGAL_ENTITY.operatorLocation}</p>
                </div>

                <div className="rounded-2xl border border-brand-800/15 bg-brand-50/70 p-4 text-xs leading-relaxed text-ink-700 space-y-1">
                  <p className="font-black text-brand-950">Yasal Kimlik &amp; Fatura Açıklaması:</p>
                  <p>{LEGAL_ENTITY.publicLegalIdentityNote}</p>
                </div>
              </div>
            </div>

            {/* Infrastructure, Hosting & Data Sovereignty Card */}
            <div className="overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-900">
                  <Server className="h-4 w-4 text-brand-800" /> Altyapı, Barındırma ve Egemenlik
                </div>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-900">
                  AB BÖLGESİ
                </span>
              </div>

              <div className="mt-5 space-y-4 text-xs font-medium text-ink-700 leading-relaxed">
                <div>
                  <p className="font-black text-ink-900 text-sm">Veri Merkezi Konumu:</p>
                  <p className="mt-1 text-ink-700">{LEGAL_ENTITY.hostingDetail}</p>
                </div>

                <div className="border-t border-line pt-3">
                  <p className="font-black text-ink-900 text-sm">Kriptografik Güvenlik &amp; Mühür Bütünlüğü:</p>
                  <p className="mt-1 text-ink-700">
                    Üretilen Kademe A paketleri 12 dosya ve SHA-256 kriptografik parmak izi ile mühürlenir. İthalatçı ve denetçi dosyanın değişmediğini kriptografik olarak teyit edebilir.
                  </p>
                </div>

                <div className="border-t border-line pt-3">
                  <p className="font-black text-ink-900 text-sm">Ücretsiz Yeniden Mühürleme Garantisi:</p>
                  <p className="mt-1 text-ink-700">{SITE.resealPublicCopy}</p>
                </div>
              </div>
            </div>

            {/* Methodology Responsibility & E-E-A-T Showcase */}
            <div className="overflow-hidden rounded-3xl border-2 border-brand-800/20 bg-gradient-to-br from-brand-50 via-white to-emerald-50/50 p-7 shadow-sm">
              <div className="flex items-center justify-between border-b border-brand-800/15 pb-4">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-950">
                  <Award className="h-4 w-4 text-brand-800" /> Metodoloji Sorumluluğu &amp; Yetkinlik
                </span>
                <span className="rounded-full bg-brand-800 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                  ISO 14064-1
                </span>
              </div>

              <div className="mt-5 flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PERSON_ENTITY.imagePath}
                  alt={PERSON_ENTITY.name}
                  width={72}
                  height={72}
                  className="h-18 w-18 shrink-0 rounded-2xl border-2 border-brand-800/25 object-cover shadow-md"
                />
                <div className="space-y-1">
                  <p className="text-base font-black text-ink-900">{PERSON_ENTITY.name}</p>
                  <p className="text-xs font-bold text-brand-900 leading-snug">{PERSON_ENTITY.jobTitle}</p>
                  <p className="text-[11px] text-ink-600 font-medium">Gaziantep Üniversitesi / GSO-MEM · TARIMKON Danışma Kurulu</p>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium leading-relaxed text-ink-700">
                SKDMHesapla hesaplama motoru ve formül mantığı, ISO 14064-1 Kapsam 1–2–3 sera gazı emisyon hesaplama eğitimi sahibi metodoloji sorumlusunun gözetiminde geliştirilmektedir.
              </p>

              <div className="mt-4 pt-3 border-t border-brand-800/15">
                <Link
                  href="/uzmanlik/baris-bagirlar/"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-brand-900 hover:text-brand-700 underline underline-offset-4"
                >
                  Metodoloji Sorumlusu Profilini &amp; Belgelerini İncele <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Support Commitments & Service Principles */}
        <section className="mt-14" aria-labelledby="principles-title">
          <div className="border-b border-line pb-4">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">
              Hizmet Standartlarımız
            </span>
            <h2 id="principles-title" className="mt-1 text-2xl font-black tracking-tight text-ink-900">
              Kurumsal Destek İlkelerimiz
            </h2>
            <p className="mt-1 text-sm font-medium text-ink-600">
              İhracatçılarımıza sunduğumuz tüm teknik ve kurumsal destek süreçleri aşağıdaki prensiplerle yürütülür:
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORT_PRINCIPLES.map((p) => {
              const IconComp = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border border-line bg-white p-5 shadow-sm space-y-2.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-black text-ink-900">{p.title}</h3>
                  <p className="text-xs font-medium leading-relaxed text-ink-600">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Executive Bento Resolution Hub (4 Cards) */}
        <section className="mt-14" aria-labelledby="quick-help-title">
          <div className="border-b border-line pb-4">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">
              Hızlı Çözüm Merkezi
            </span>
            <h2 id="quick-help-title" className="mt-1 text-2xl font-black tracking-tight text-ink-900">
              Sıkça Başvurulan Self-Servis Portallar
            </h2>
            <p className="mt-1 text-sm font-medium text-ink-600">
              Talebiniz aşağıdaki konulardan biriyle ilgiliyse, doğrudan ilgili self-servis modülü kullanabilirsiniz:
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Action 1 */}
            <Link
              href="/basla/"
              className="group flex flex-col justify-between rounded-2xl border-2 border-line bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-800/40 hover:shadow-md"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-900 group-hover:scale-105 transition">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="mt-3.5 text-base font-black text-ink-900">GTİP ile Kapsam Kontrolü</h3>
                <p className="mt-1.5 text-xs font-medium text-ink-600 leading-relaxed">
                  Ürününüzün 6 sektör ve 569 CN kodu kapsamında olup olmadığını 10 saniyede ücretsiz sorgulayın.
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 group-hover:text-brand-700">
                Kapsamı Kontrol Et <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Action 2 */}
            <Link
              href="/dogrula/"
              className="group flex flex-col justify-between rounded-2xl border-2 border-line bg-white p-6 shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:shadow-md"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 group-hover:scale-105 transition">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <h3 className="mt-3.5 text-base font-black text-ink-900">Mühür Doğrulama Portalı</h3>
                <p className="mt-1.5 text-xs font-medium text-ink-600 leading-relaxed">
                  Size sunulan veya ürettiğiniz SKDM dosyasının SHA-256 hash kodunu anında karşılaştırıp teyit edin.
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 group-hover:text-brand-700">
                Mühürü Doğrula <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Action 3 */}
            <Link
              href="/cbam-dogrulama/"
              className="group flex flex-col justify-between rounded-2xl border-2 border-line bg-white p-6 shadow-sm transition-all duration-200 hover:border-sky-500/40 hover:shadow-md"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-900 group-hover:scale-105 transition">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-3.5 text-base font-black text-ink-900">CBAM Doğrulama Rehberi</h3>
                <p className="mt-1.5 text-xs font-medium text-ink-600 leading-relaxed">
                  24–28 Ağustos Komisyon verifier ve 1 Eylül Registry erişim prosedürünün dosyanıza etkisini öğrenin.
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 group-hover:text-brand-700">
                Rehberi İncele <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Action 4 */}
            <Link
              href="/metodoloji/"
              className="group flex flex-col justify-between rounded-2xl border-2 border-line bg-white p-6 shadow-sm transition-all duration-200 hover:border-amber-500/40 hover:shadow-md"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-900 group-hover:scale-105 transition">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <h3 className="mt-3.5 text-base font-black text-ink-900">Metodoloji ve Formüller</h3>
                <p className="mt-1.5 text-xs font-medium text-ink-600 leading-relaxed">
                  (AB) 2023/956 ve (AB) 2025/2547 tüzüklerine dayalı emisyon sınırları ve hesaplama mantığı.
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 group-hover:text-brand-700">
                Metodolojiyi Gör <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>

        {/* Legal Disclaimer Banner */}
        <footer className="mt-14 space-y-4 border-t border-line pt-8">
          <DisclaimerBanner />
          <p className="text-center text-xs font-medium text-ink-500">
            {LEGAL_ENTITY.copyrightFull} · {LEGAL_ENTITY.publicLegalIdentityNote}
          </p>
        </footer>
      </div>
    </article>
  );
}


