import type { Metadata } from "next";
import Link from "next/link";
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
    <article className="pasaport-zemin-yogun mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <GeriLink />

      <div>
        <h1 className="font-display text-3xl font-bold text-ink-900">Hesaplamaya Başlayın</h1>
        <p className="mt-2 text-sm text-ink-600">
          Ürününüzün GTİP kodunu arayabilir veya doğrudan sektörünüzü seçerek sihirbazı başlatabilirsiniz.
          Mühürleme öncesi tüm aşamalar ücretsizdir.
        </p>
      </div>

      {/* GTİP Arama Bileşeni */}
      <div className="rounded-card border border-brand-500/30 bg-white p-6 shadow-card">
        <GtipArama />
      </div>

      {/* Kademe A & Kademe B Sütunları */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Kademe A */}
        <section className="space-y-4">
          <div className="border-b border-brand-500 pb-2">
            <span className="rounded-pill bg-brand-500/20 px-2.5 py-0.5 text-xs font-bold text-brand-900">
              Kademe A — Zorunlu Kapsam
            </span>
            <h2 className="mt-2 text-xl font-bold text-ink-900">SKDM 6 Ana Sektör</h2>
            <p className="text-xs text-ink-600">
              AB Tüzüğü 2023/956 ve 2025/2083 kapsamındaki resmi sektörler.
            </p>
          </div>

          <div className="space-y-3">
            {KADEME_A_SEKTORLER.map((s) => (
              <Link
                key={s.slug}
                href={`/hesapla/${s.slug}/`}
                className="group block rounded-card border border-line bg-white p-4 shadow-card hover:border-brand-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ink-900 group-hover:text-brand-800">{s.name}</h3>
                  <span className="text-xs font-semibold text-brand-800">&rarr;</span>
                </div>
                <p className="mt-1 text-xs text-ink-600 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Kademe B */}
        <section className="space-y-4">
          <div className="border-b border-brand-800 pb-2">
            <span className="rounded-pill bg-brand-800/15 px-2.5 py-0.5 text-xs font-bold text-brand-800">
              Kademe B — Tedarikçi Veri Çerçevesi
            </span>
            <h2 className="mt-2 text-xl font-bold text-ink-900">14 Ek Sektör</h2>
            <p className="text-xs text-ink-600">
              Zorunlu SKDM dışı; alıcı talebiyle ISO 14067 tedarikçi veri dosyası.
            </p>
          </div>

          <div className="max-h-[520px] overflow-y-auto space-y-3 pr-1">
            {KADEME_B_SEKTORLER.map((s) => (
              <Link
                key={s.slug}
                href={`/hesapla/${s.slug}/`}
                className="group block rounded-card border border-line bg-white/80 p-3.5 shadow-card hover:border-brand-800 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-ink-900 group-hover:text-brand-800">{s.name}</h3>
                  <span className="text-xs font-semibold text-brand-800">&rarr;</span>
                </div>
                <p className="mt-1 text-[11px] text-ink-600 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
