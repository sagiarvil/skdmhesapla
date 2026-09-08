import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2,
  Briefcase,
  Layers,
  FileCheck2,
  Scale,
  Users,
  Calculator,
  FileSpreadsheet,
  Lock,
  ArrowDown,
  Compass,
} from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { PartnerLeadForm } from "@/components/partner/PartnerLeadForm";
import { REG_REF } from "@/lib/skdm/regulatoryRefs";

export const metadata: Metadata = pageMetadata({
  path: "/partner-network/",
  title: "Gümrük Müşavirleri İçin CBAM Partner Network | SKDMHesapla",
  description:
    "Müşterinizi devretmeden kendi CBAM/SKDM çalışmalarınızı üretin. Gümrük müşavirleri, dış ticaret ve karbon danışmanları için SKDMHesapla Partner Network.",
});

const PERSONAS = [
  {
    role: "Gümrük Müşavirleri",
    icon: Building2,
    badge: "Gümrük & Dış Ticaret",
    problem:
      "Müşterinizin CN/GTİP ve AB ihracat sürecini eksiksiz yönetiyorsunuz; ancak gömülü emisyon (SEE), öncül madde kütle dengesi ve CBAM veri üretimi farklı bir teknik mühendislik katmanı yaratıyor.",
    value:
      "Müşteri ilişkinizi devretmeden, mevcut portföyünüze doğrulanabilir SKDM/CBAM dosya hazırlık hizmetini yeni bir gelir ve operasyon kalemi olarak ekleyin.",
    features: [
      "569 CN kodu ve Annex II direkt emisyon sınırları hazır",
      "Resmi AB Communication Template eşleme çıktısı",
      "Müşterinize kendi kurumsal kimliğinizle hizmet üretimi",
    ],
  },
  {
    role: "Dış Ticaret Danışmanları",
    icon: Compass,
    badge: "İhracat Yönetimi",
    problem:
      "AB ihracat sürecini yönetirken üretici fabrika, AB ithalatçısı ve gümrük temsilcisi arasındaki emisyon veri talepleri dağınık e-posta zincirleri ve operasyon yükü yaratıyor.",
    value:
      "Her müşteriniz için sıfırdan sistem kurmak yerine, CBAM veri toplama, kontrol ve dosya hazırlık sürecini tek bir endüstriyel iş akışında standardize edin.",
    features: [
      "Fabrika girdi verileri için hazır FieldHelp rehberliği",
      "İki eksenli veri doluluk ve tutarlılık kalite kontrolü (QC)",
      "AB alıcısının teknik sorgularına hazır kanıt dosyası",
    ],
  },
  {
    role: "Karbon & Sürdürülebilirlik Danışmanları",
    icon: Scale,
    badge: "Mühendislik & Doğrulama",
    problem:
      "Her müşteri için yeniden karmaşık Excel tabloları, kontrol listeleri ve kanıt bağlama yapıları kurgulamak danışmanlık süresini tüketiyor ve ölçeklenmeyi engelliyor.",
    value:
      "Uzmanlığınızı ve stratejik danışmanlık rolünüzü koruyun; tekrar eden hesaplama, katsayı doğrulaması ve şablon doldurma katmanını güvenilir yazılımla sistemleştirin.",
    features: [
      "Tüzük 2025/2547 metodolojisine tam uyumlu hesap motoru",
      "Doğrulayıcı çalışma alanı (Verifier Dossier) hazırlığı",
      "Birden fazla müşteriyi aynı kurallarla tek altyapıda yönetme",
    ],
  },
];

const COMPARISON_ROWS = [
  {
    metric: "Müşteri Veri Toplama",
    manual: "Dağınık e-postalar, kaybolan formlar ve eksik birimler",
    partner: "10 katmanlı yapılandırılmış veri toplama akışı",
  },
  {
    metric: "Hesaplama Altyapısı",
    manual: "Her müşteri için formülü değişebilen özel Excel tabloları",
    partner: "Tüzük referanslı, deterministik ve doğrulanmış hesap motoru",
  },
  {
    metric: "Doğrulama & QC",
    manual: "Gözle kontrol; kütle dengesi ve öncül madde tutarsızlık riski",
    partner: "Otomatik kütle dengesi, D_Processes kontrolü ve hazır QC",
  },
  {
    metric: "Kanıt & Evidence Zinciri",
    manual: "Ayrı klasörlerde dağınık elektrik, yakıt ve fatura PDF'leri",
    partner: "Hesaplama izi ve manifestoya bağlı yapılandırılmış evidence paketi",
  },
  {
    metric: "Resmi Şablon Uyumu",
    manual: "Komisyonun yüzlerce hücreli Communication Template'ini elle doldurma",
    partner: "Resmi Excel bölümlerine doğrudan eşlenmiş çalışma çıktısı",
  },
  {
    metric: "Müşteri İlişkisi Sahipliği",
    manual: "Danışmanlık şirketine yönlendirip müşteriyi kaybetme riski",
    partner: "Müşteri ilişkisi tamamen partnerde kalır; platform teknik altyapıdır",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Partner Müşterisini Açar",
    partnerAction: "Müşteri GTİP kodunu girer, sektör ve tesis sınırlarını belirler.",
    platformAction: "569 CN kodu kurallarını ve sektörel girdi gereksinimlerini otomatik yükler.",
  },
  {
    step: "02",
    title: "Tesis ve Üretim Verisi Toplanır",
    partnerAction: "Müşterinin üretim, yakıt, elektrik ve öncül madde tüketimini sisteme işler.",
    platformAction: "Her alan için FieldHelp hukuki rehberliği ve birim kontrolleri sağlar.",
  },
  {
    step: "03",
    title: "Hesaplama, Validasyon & Readiness",
    partnerAction: "Üretilen spesifik emisyon (SEE) değerlerini ve tutarlılık skorunu inceler.",
    platformAction: "Tüzük 2025/2547 motoruyla doğrudan ve dolaylı emisyonları hesaplar; kütle dengesi QC yapar.",
  },
  {
    step: "04",
    title: "Evidence & Çalışma Dosyası Hazırlanır",
    partnerAction: "Fatura ve tedarikçi beyanlarını yükler, doğrulayıcı çalışma alanını kapatır.",
    platformAction: "Resmi Communication Template eşlemesi, hesap izi ve SHA-256 bütünlük manifestosu üretir.",
  },
  {
    step: "05",
    title: "Partner Çalışmayı Müşterisine Sunar",
    partnerAction: "Hazırlanan eksiksiz SKDM çalışma paketini kendi danışmanlık hizmeti olarak müşterisine teslim eder.",
    platformAction: "Teknik altyapı olarak arkada kalır; müşteriye doğrudan satış veya iletişim yapmaz.",
  },
];

export default function PartnerNetworkPage() {
  return (
    <>
      <RegistryJsonLd route="/partner-network/" />
      <div className="bg-white text-ink-900">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-[#f2f8ed] via-[#f8fbf6] to-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-900 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                SKDMHESAPLA PARTNER NETWORK
              </div>

              <h1 className="mt-6 text-3xl font-black leading-[1.12] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
                Müşterinizi bize vermeyin.
                <span className="mt-2 block text-brand-800">
                  SKDM dosyasını kendi müşteriniz adına siz üretin.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base font-normal leading-relaxed text-ink-700 sm:text-lg">
                Gümrük müşavirleri, dış ticaret danışmanları ve karbon danışmanları için CBAM/SKDM veri, hesaplama, kontrol ve dosya hazırlık altyapısı. Müşteri ilişkisini siz yönetin; teknik üretim sürecini standartlaştırın.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#partner-form"
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-900 px-6 py-4 text-sm font-black uppercase tracking-wider text-brand-500 shadow-md transition hover:bg-brand-800 hover:text-white"
                >
                  Partner Başvurusu <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#nasil-calisir"
                  className="inline-flex items-center gap-2 rounded-2xl border border-brand-800/25 bg-white px-6 py-4 text-sm font-black uppercase tracking-wider text-brand-900 shadow-xs transition hover:bg-brand-50"
                >
                  Partner Modelini İncele <ArrowDown className="h-4 w-4" />
                </a>
              </div>

              {/* 5-SECOND CLARITY BAR */}
              <div className="mt-12 grid grid-cols-2 gap-3 rounded-2xl border border-brand-800/15 bg-white/90 p-4 shadow-sm sm:grid-cols-4 sm:gap-4 text-left">
                <div className="border-r border-line/60 pr-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">KİM İÇİN?</span>
                  <p className="mt-0.5 text-xs font-bold text-ink-900 sm:text-sm">Gümrük Müşaviri &amp; Danışman</p>
                </div>
                <div className="sm:border-r sm:border-line/60 pr-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">NE YAPIYOR?</span>
                  <p className="mt-0.5 text-xs font-bold text-ink-900 sm:text-sm">Müşterisi Adına SKDM Üretimi</p>
                </div>
                <div className="border-r border-line/60 pr-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">NEDEN?</span>
                  <p className="mt-0.5 text-xs font-bold text-ink-900 sm:text-sm">Manuel Operasyonu Standartlaştırma</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">MÜŞTERİ KİMDE?</span>
                  <p className="mt-0.5 text-xs font-bold text-brand-900 sm:text-sm">Yüzde Yüz Partnerde</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BARRIER: MÜŞTERİNİZ SİZİN MÜŞTERİNİZDİR */}
        <section className="border-b border-line bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="rounded-3xl border-2 border-brand-800/20 bg-gradient-to-br from-brand-50/70 via-white to-brand-50/40 p-8 sm:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-brand-800/15 pb-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-800">
                    <ShieldCheck className="h-4 w-4 text-brand-800" /> Güven Sözleşmesi
                  </span>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                    Müşteriniz sizin müşterinizdir.
                  </h2>
                </div>
                <div className="rounded-2xl border border-brand-800/20 bg-white px-4 py-2 text-xs font-bold text-brand-900 shadow-2xs shrink-0">
                  Operasyonel &amp; Ticari Güvence
                </div>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-brand-500 font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-base font-bold text-ink-900">Müşteriye Doğrudan Satış Yok</h3>
                  <p className="text-xs leading-relaxed text-ink-700">
                    Partner aracılığıyla açılan dosyalarda müşteriye doğrudan satış veya alternatif pazarlama yapılmaz.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-brand-500 font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-base font-bold text-ink-900">Müşteri İlişkisi Sizdedir</h3>
                  <p className="text-xs leading-relaxed text-ink-700">
                    Müşterinizle ticari sözleşmeyi, fiyatlandırmayı ve iletişimi siz yönetirsiniz. SKDMHesapla altyapı sağlayıcısıdır.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-brand-500 font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-base font-bold text-ink-900">Teknik Üretim Altyapısı</h3>
                  <p className="text-xs leading-relaxed text-ink-700">
                    Siz müşteri danışmanlığını büyütürken, mevzuat güncellemelerini ve hesap motoru matematiğini biz yönetiriz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PERSONA INTENT ROUTER */}
        <section className="border-b border-line bg-gradient-to-b from-[#f9fbf8] to-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                PORTFÖYÜNÜZE GÖRE ÇÖZÜM
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                Kimin İçin, Hangi Değeri Üretiyoruz?
              </h2>
              <p className="mt-3 text-sm text-ink-700 sm:text-base">
                Farklı mesleki uzmanlıkların ortak ihtiyacı: tekrarlayan manuel hesaplamayı standardize etmek.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {PERSONAS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.role}
                    className="flex flex-col justify-between rounded-3xl border-2 border-brand-800/15 bg-white p-6 sm:p-8 shadow-sm hover:border-brand-800 hover:shadow-lg transition duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-brand-500 shadow-xs">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-black text-ink-900">{item.role}</h3>
                        </div>
                        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-bold text-brand-900 border border-brand-800/20">
                          {item.badge}
                        </span>
                      </div>

                      <div className="mt-5 space-y-4">
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                            Karşılaşılan Tıkanma:
                          </span>
                          <p className="mt-1 text-xs leading-relaxed text-ink-700">
                            {item.problem}
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-brand-800">
                            Sağlanan Değer:
                          </span>
                          <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-900">
                            {item.value}
                          </p>
                        </div>

                        <div className="border-t border-line/60 pt-4">
                          <span className="text-[11px] font-black uppercase tracking-wider text-ink-800">
                            Öne Çıkan Kabiliyetler:
                          </span>
                          <ul className="mt-2 space-y-2 text-xs text-ink-700">
                            {item.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-800" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-line">
                      <a
                        href="#partner-form"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-50 py-2.5 text-xs font-bold text-brand-900 hover:bg-brand-900 hover:text-white transition"
                      >
                        Bu Model İçin Başvurun <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMPARISON SECTION (21ST.DEV PATTERN) */}
        <section className="border-b border-line bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                OPERASYONEL DÖNÜŞÜM
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                Manuel Operasyon vs. Partner Network
              </h2>
              <p className="mt-3 text-sm text-ink-700 sm:text-base">
                Excel ve e-posta tabanlı parçalı süreçleri, doğrulanabilir bir üretim altyapısıyla karşılaştırın.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border-2 border-brand-800/20 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 bg-brand-900 text-white p-4 sm:p-6">
                <div className="border-b border-white/10 pb-3 md:border-b-0 md:border-r md:pr-6 md:pb-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-300">GELENEKSEL YAKLAŞIM</span>
                  <h3 className="mt-1 text-lg font-black">Manuel / Dağınık Operasyon</h3>
                </div>
                <div className="pt-3 md:pt-0 md:pl-6">
                  <span className="text-[11px] font-black uppercase tracking-wider text-brand-400">STANDART ALTYAPI</span>
                  <h3 className="mt-1 text-lg font-black text-brand-500">SKDMHesapla Partner Network</h3>
                </div>
              </div>

              <div className="divide-y divide-line bg-white">
                {COMPARISON_ROWS.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 p-5 sm:p-6 gap-4 sm:gap-6 hover:bg-brand-50/30 transition">
                    <div className="space-y-1.5 md:border-r md:border-line md:pr-6">
                      <span className="text-[11px] font-bold text-ink-600 uppercase tracking-wider">{row.metric}</span>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-700">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                        <span>{row.manual}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 md:pl-6">
                      <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider md:hidden">{row.metric}</span>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-ink-900">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                        <span>{row.partner}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (STEPPER) */}
        <section id="nasil-calisir" className="border-b border-line bg-gradient-to-b from-[#f7fbf3] via-white to-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                5 ADIMDA İŞ AKIŞI
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                Partner Üretim Modeli Nasıl Çalışır?
              </h2>
              <p className="mt-3 text-sm text-ink-700 sm:text-base">
                Partner ne yapar, SKDMHesapla altyapısı ne yapar? Ayrım net, operasyon şeffaf.
              </p>
            </div>

            <div className="mt-14 space-y-6">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="rounded-3xl border-2 border-brand-800/15 bg-white p-6 sm:p-8 shadow-xs hover:border-brand-800 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-900 font-mono text-base font-black text-brand-500 shadow-sm">
                        {step.step}
                      </span>
                      <h3 className="text-xl font-black text-ink-900">{step.title}</h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:w-2/3">
                      <div className="rounded-2xl border border-line bg-brand-50/40 p-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-ink-700">
                          Partner Ne Yapar?
                        </span>
                        <p className="mt-1 text-xs sm:text-sm font-medium text-ink-900">
                          {step.partnerAction}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-brand-800/20 bg-brand-900/[0.04] p-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">
                          SKDMHesapla Ne Yapar?
                        </span>
                        <p className="mt-1 text-xs sm:text-sm font-medium text-brand-950">
                          {step.platformAction}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNER ECONOMICS: MULTI-CLIENT LEVERAGE */}
        <section className="border-b border-line bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="rounded-3xl border-2 border-brand-800/25 bg-gradient-to-br from-brand-900 via-brand-900 to-brand-950 p-8 sm:p-12 text-white shadow-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-800/60 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-400">
                Operasyonel Kaldıraç Mantığı
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl text-white">
                1 Partner → Birden Fazla Müşteri → Tekrarlayan Altyapı
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-100/90 max-w-3xl">
                Sahte ROI veya abartılı kazanç iddiaları yerine gerçek operasyonel matematiğe odaklanın. Bir danışmanlık firması olarak her yeni müşteride Excel şablonlarını sıfırdan kurmak yerine, aynı deterministik motoru kullanarak üretim maliyetinizi sabitler, kapasitenizi katlarsınız.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <div className="text-2xl font-black text-brand-400">Tekil Kurulum</div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200">
                    Sistem işleyişini bir kez kavradıktan sonra tüm müşterilerinizde aynı standart akışı uygularsınız.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <div className="text-2xl font-black text-brand-400">Sıfır Formül Hatası</div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200">
                    Resmi AB kuralları kod seviyesinde doğrulanır; elle yapılan katsayı ve kütle dengesi hataları elenir.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <div className="text-2xl font-black text-brand-400">Doğrulamaya Hazır</div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200">
                    Bağımsız denetçiye (verifier) gidecek kanıt dosyası, izleme planı ve hesap izi otomatik paketlenir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CAPABILITY & LEGAL BOUNDARY */}
        <section className="border-b border-line bg-gradient-to-b from-[#f7fbf3] to-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                HUKUKİ VE TEKNİK SINIRLAR
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                Platform Kabiliyet ve Sınır Beyanı
              </h2>
              <p className="mt-3 text-sm text-ink-700 sm:text-base">
                Hukuki güvenilirlik, sistemin ne yaptığını ve ne yapmadığını şeffafça ortaya koymaktan başlar.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {/* NE YAPAR */}
              <div className="rounded-3xl border-2 border-brand-800/20 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                    <CheckCircle2 className="h-5 w-5 text-brand-800" />
                  </div>
                  <h3 className="text-lg font-black text-ink-900">SKDMHesapla Ne Yapar?</h3>
                </div>
                <ul className="mt-5 space-y-3 text-xs sm:text-sm text-ink-800">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                    <span>569 CN koduna göre yasal kapsamı ve Annex II direkt emisyon sınırlarını çözer.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                    <span>Tüzük (EU) 2025/2547 metodolojisine göre doğrudan ve dolaylı gömülü emisyonları hesaplar.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                    <span>İki eksenli (doluluk + tutarlılık) kalite kontrolü ve denetime hazırlık skoru üretir.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                    <span>Resmi AB Communication Template bölümlerine birebir karşılık gelen eşleme çıktısı üretir.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                    <span>SHA-256 bütünlük manifestosuyla denetime hazırlık dosyasını mühürler.</span>
                  </li>
                </ul>
              </div>

              {/* NE YAPMAZ */}
              <div className="rounded-3xl border-2 border-amber-500/30 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                    <Lock className="h-5 w-5 text-amber-800" />
                  </div>
                  <h3 className="text-lg font-black text-ink-900">SKDMHesapla Ne Yapmaz?</h3>
                </div>
                <ul className="mt-5 space-y-3 text-xs sm:text-sm text-ink-800">
                  <li className="flex items-start gap-2.5">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" />
                    <span><strong>Akredite CBAM doğrulayıcısı değildir:</strong> Sistemin ürettiği dosya doğrulayıcıya sunulacak çalışma matrahıdır; resmi denetim görüşünün yerine geçmez.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" />
                    <span><strong>Avrupa Birliği veya gümrük makamı değildir:</strong> Yetkili makam onayı veya resmi kabul garantisi vermez.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" />
                    <span><strong>Yetkili CBAM beyan sahibi (Authorised Declarant) statüsü sağlamaz:</strong> Bu statü ithalatçıya aittir.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" />
                    <span><strong>Müşterinize rakip olmaz:</strong> Partner müşterisini pazarlama havuzuna almaz, müşteri ilişkisine doğrudan müdahale etmez.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* LEAD CAPTURE SECTION */}
        <section className="border-b border-line bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                BAŞVURU &amp; KATILIM
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                Partner Modeli İçin Bilgi Alın
              </h2>
              <p className="mt-2 text-sm text-ink-700">
                Mevcut müşteri hacminize göre operasyonel kapasite ve partner modelini birlikte planlayalım.
              </p>
            </div>

            <PartnerLeadForm />
          </div>
        </section>

        {/* REGULATORY FOUNDATION */}
        <section className="bg-[#f2f8ed] py-12 text-center border-t border-brand-800/10">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-900">
              Yasal Mevzuat ve Teknik Dayanak
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-ink-700">
              Avrupa Parlamentosu ve Konseyi Tüzüğü (EU) 2023/956 · Komisyon Uygulama Tüzüğü (EU) 2025/2547 Kesin Dönem Metodolojisi · Tüzük (EU) 2025/2083 Omnibus Sadeleştirmesi.
              Bu sayfa ve yazılım altyapısı resmi AB mevzuatı dayanak alınarak hazırlanmıştır.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-brand-900">
              <Link href="/metodoloji/" className="underline hover:text-brand-800">Metodoloji Detayları →</Link>
              <Link href="/kaynak-politikasi/" className="underline hover:text-brand-800">Kaynak Politikası →</Link>
              <Link href="/fiyatlandirma/" className="underline hover:text-brand-800">Fiyatlandırma &amp; Paketler →</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
