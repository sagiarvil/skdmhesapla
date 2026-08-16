import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";
import GtipArama from "@/components/GtipArama";

export const metadata: Metadata = {
  title: "Hesaplamaya Başla — SKDM Tesis ve Sektör Seçimi",
  description:
    "SKDM Kademe A (zorunlu 6 sektör) veya Kademe B (tedarikçi veri çerçevesi 14 sektör) için sektörünüzü seçin veya GTİP kodunuzla hemen hesaplamaya başlayın.",
};

const KADEME_A_SEKTORLER = [
  { slug: "demir-celik", name: "Demir & Çelik", desc: "İnşaat demiri, profil, sac, boru, bağlantı elemanları (Annex II: yalnız direkt emisyon)" },
  { slug: "aluminyum", name: "Alüminyum", desc: "Külçe, profil, levha, ekstrüzyon (Annex II: yalnız direkt emisyon)" },
  { slug: "cimento", name: "Çimento", desc: "Portland çimentosu, klinker (Direkt + dolaylı emisyon dahil)" },
  { slug: "gubre", name: "Gübre", desc: "Üre, amonyak, nitrik asit, NPK (Direkt + dolaylı emisyon dahil)" },
  { slug: "elektrik", name: "Elektrik", desc: "Sınır ötesi elektrik ticareti (De minimis muafiyeti uygulanmaz)" },
  { slug: "hidrojen", name: "Hidrojen", desc: "Saf ve türev hidrojen üretimi (De minimis muafiyeti uygulanmaz)" },
];

const KADEME_B_SEKTORLER = [
  { slug: "batarya", name: "Batarya & Pil", desc: "AB 2023/1542 Pil Tüzüğü karbon ayak izi beyanı" },
  { slug: "ambalaj", name: "Ambalaj", desc: "PPWR uyumlu geri dönüştürülmüş içerik ve ayak izi" },
  { slug: "tekstil", name: "Tekstil & Konfeksiyon", desc: "Kapsam 3 ve DPP uyumlu ürün karbon ayak izi" },
  { slug: "cam", name: "Cam & Cam Eşya", desc: "Düz cam, şişe, cam ev eşyası tedarikçi verisi" },
  { slug: "plastik", name: "Plastik & Polimer", desc: "Hammadde ve mamul plastik karbon ayak izi" },
  { slug: "makine", name: "Makine & Ekipman", desc: "Endüstriyel makineler ve yedek parçalar" },
  { slug: "otomotiv", name: "Otomotiv Yan Sanayi", desc: "Araç komponentleri ve parça üreticileri" },
  { slug: "mobilya", name: "Mobilya", desc: "Ağaç ve metal mobilya ürün karbon ayak izi" },
  { slug: "kagit", name: "Kağıt & Mukavva", desc: "Oluklu mukavva, koli ve ambalaj kağıdı" },
  { slug: "gida", name: "Gıda & Tarım", desc: "EUDR ormansızlaşma ve ürün karbon verisi" },
  { slug: "lojistik", name: "Uluslararası Lojistik", desc: "Taşımacılık ve tedarik zinciri Kapsam 3" },
  { slug: "kimya", name: "Kimya Sanayi", desc: "Temel kimyasallar ve türev polimerler" },
  { slug: "elektronik", name: "Elektronik", desc: "Elektrikli cihazlar ve komponentler" },
  { slug: "yapi", name: "Yapı Malzemeleri", desc: "Tuğla, kiremit, seramik ve yalıtım" },
];

export default function BaslaPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-10 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <Sparkles className="h-4 w-4" />
            <span>Adım 0 / Sektör Belirleme</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">Hesaplamaya Başlayın</h1>
          <p className="text-base font-semibold leading-relaxed text-ink-700 sm:text-xl">
            Ürününüzün GTİP kodunu arayabilir veya doğrudan sektörünüzü seçerek sihirbazı başlatabilirsiniz.
            Mühürleme öncesi tüm aşamalar ücretsizdir.
          </p>
        </div>

        {/* Lüks Arama Konsolu */}
        <div className="rounded-3xl border-2 border-brand-800/20 bg-white p-6 shadow-xl sm:p-8">
          <GtipArama />
        </div>

        {/* Kademe A & Kademe B Sütunları */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Kademe A */}
          <section className="space-y-5">
            <div className="border-b-2 border-brand-500 pb-3 space-y-1.5">
              <span className="rounded-full bg-brand-500/25 px-3 py-1 text-xs font-black text-brand-950 border border-brand-500/40">
                Kademe A — Zorunlu Kapsam
              </span>
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">SKDM 6 Ana Sektör</h2>
              <p className="text-sm font-medium text-ink-700">
                AB Tüzüğü 2023/956 ve 2025/2083 kapsamındaki yasal zorunlu sektörler.
              </p>
            </div>

            <div className="space-y-4">
              {KADEME_A_SEKTORLER.map((s) => (
                <Link
                  key={s.slug}
                  href={`/hesapla/${s.slug}/`}
                  className="group block rounded-2xl border-2 border-line bg-white p-5 shadow-sm hover:border-brand-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-ink-900 group-hover:text-brand-800">
                      {s.name}
                    </h3>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-900 group-hover:bg-brand-500 transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">{s.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Kademe B */}
          <section className="space-y-5">
            <div className="border-b-2 border-brand-800 pb-3 space-y-1.5">
              <span className="rounded-full bg-brand-800/15 px-3 py-1 text-xs font-black text-brand-900 border border-brand-800/30">
                Kademe B — Tedarikçi Veri Çerçevesi
              </span>
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">14 Ek Sektör</h2>
              <p className="text-sm font-medium text-ink-700">
                Zorunlu SKDM dışı; alıcı talebiyle ISO 14067 tedarikçi veri dosyası.
              </p>
            </div>

            <div className="max-h-[620px] overflow-y-auto space-y-4 pr-2">
              {KADEME_B_SEKTORLER.map((s) => (
                <Link
                  key={s.slug}
                  href={`/hesapla/${s.slug}/`}
                  className="group block rounded-2xl border-2 border-line bg-white p-4 shadow-sm hover:border-brand-800 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-ink-900 group-hover:text-brand-800">
                      {s.name}
                    </h3>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-900 group-hover:bg-brand-800 group-hover:text-white transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-ink-700">{s.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
