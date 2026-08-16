import type { Metadata } from "next";
import Link from "next/link";
import {
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Building2,
  Package,
  BatteryCharging,
  TreePine,
  Sparkles,
  Layers,
} from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";

export const metadata: Metadata = {
  title: "AB Tedarikçi Veri Merkezi — SKDM Kapsamı Dışındaki Sektörler İçin Rehber",
  description:
    "SKDM zorunlu kapsamında değilsiniz ama AB'li alıcınız karbon/tesis verisi mi istiyor? CSRD Kapsam 3, PPWR Ambalaj, Pil Tüzüğü ve EUDR için standart tedarikçi veri çerçevesi.",
};

const PILAR_SEKTORLER = [
  {
    slug: "csrd-kapsam-3",
    title: "CSRD Kapsam 3 Tedarikçi Verisi",
    reg: "AB Kurumsal Sürdürülebilirlik Raporlama Direktifi (CSRD)",
    desc: "Büyük AB firmalarına parça, yarı mamul veya hammadde satan Türk üreticiler için Kapsam 3 emisyon veri paylaşım çerçevesi ve ISO 14067 metodolojisi.",
    badge: "En Yüksek Talep",
    icon: Building2,
  },
  {
    slug: "ppwr-ambalaj",
    title: "PPWR 2025/40 Ambalaj Tüzüğü",
    reg: "AB Ambalaj ve Ambalaj Atıkları Tüzüğü (PPWR)",
    desc: "Plastik, oluklu mukavva, metal ve cam ambalaj üreticileri için geri dönüştürülmüş içerik, ambalaj karbon ayak izi ve geri dönüştürülebilirlik veri beyanı.",
    badge: "Yürürlükte",
    icon: Package,
  },
  {
    slug: "pil-tuzugu",
    title: "Pil ve Batarya Tüzüğü 2023/1542",
    reg: "AB Yeni Pil ve Akümülatör Düzenlemesi",
    desc: "Endüstriyel bataryalar, elektrikli araç pilleri ve SLI akü üreticileri için yaşam döngüsü karbon ayak izi beyanı ve dijital batarya pasaportu verisi.",
    badge: "Zorunlu Faz Başladı",
    icon: BatteryCharging,
  },
  {
    slug: "eudr-ormansizlasma",
    title: "EUDR 2023/1115 Ormansızlaşma Tüzüğü",
    reg: "AB Ormansızlaşmanın Önlenmesi Tüzüğü",
    desc: "Ahşap, mobilya, kâğıt, kauçuk, soya ve kakao tedarikçileri için parsel bazlı coğrafi konum (poligon/koordinat) ve ormansızlaşma teyit dosyası.",
    badge: "Kritik Süreç",
    icon: TreePine,
  },
];

const BEKLEMEDEKI_SEKTORLER = [
  { name: "Tekstil ve Hazır Giyim", reg: "ESPR / Dijital Ürün Pasaportu (DPP)", status: "Hazırlanıyor" },
  { name: "Plastik ve Polimerler", reg: "REACH & Döngüsel Ekonomi Eylem Planı", status: "Hazırlanıyor" },
  { name: "Kimya ve Petrokimya", reg: "CSS (Sürdürülebilirlik için Kimyasallar)", status: "Hazırlanıyor" },
  { name: "Otomotiv Yan Sanayi", reg: "Catena-X & ISO 14067 Tedarikçi Standardı", status: "Hazırlanıyor" },
  { name: "Beyaz Eşya ve Elektronik", reg: "Eko-Tasarım (ESPR) & Enerji Etiketleme", status: "Hazırlanıyor" },
  { name: "Mobilya ve Ağaç İşleri", reg: "DPP & Sürdürülebilir Ürün İnisiyatifi", status: "Hazırlanıyor" },
];

export default function TedarikciVerisiHubPage() {
  return (
    <div className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-12 px-5 sm:px-6">
        <GeriLink />

        {/* HERO / BAŞLIK */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <Sparkles className="h-4 w-4" />
            <span>Kademe B — AB Tedarik Zinciri Uyumluluk Merkezi</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">
            SKDM Kapsamında Değilsiniz Ama Alıcınız Veri İstiyor
          </h1>
          <p className="text-base font-semibold leading-relaxed text-ink-700 sm:text-xl max-w-3xl">
            Demir-çelik, alüminyum, çimento veya gübre üreticisi olmayabilirsiniz. Ancak AB&apos;li alıcınız CSRD, PPWR, Pil Tüzüğü veya EUDR gereğince sizden doğrulanabilir karbon ve tesis verisi talep edebilir. Bu çıktılar <strong>SKDM raporu değil</strong>; uluslararası standartlarda bir <strong>tedarikçi veri dosyasıdır</strong>.
          </p>
        </div>

        {/* 4 BÜYÜK PİLLAR SEKTÖR KARTLARI */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-line pb-3">
            <h2 className="text-2xl font-black text-ink-900">Öncelikli Düzenlemeler &amp; Sektör Rehberleri</h2>
            <span className="text-xs font-bold text-brand-800">4 Temel Mevzuat</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {PILAR_SEKTORLER.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.slug}
                  href={`/tedarikci-verisi/${item.slug}/`}
                  className="group relative flex flex-col justify-between rounded-3xl border-2 border-line bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-2xl bg-brand-100 p-3.5 text-brand-900 group-hover:bg-brand-500 group-hover:text-brand-950 transition-colors">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="rounded-full bg-brand-800/10 px-3 py-1 text-xs font-extrabold text-brand-900 border border-brand-800/20">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-brand-800">
                        {item.reg}
                      </div>
                      <h3 className="mt-1 text-xl font-black text-ink-900 group-hover:text-brand-800 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm font-medium leading-relaxed text-ink-700">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 pt-4 border-t border-line text-sm font-black text-brand-800 group-hover:text-brand-950 transition-colors">
                    <span>Rehberi ve Veri Çerçevesini İncele</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* METODOLOJİ VE ÇERÇEVE */}
        <div className="rounded-3xl border-2 border-brand-800/30 bg-brand-950 p-8 text-white shadow-2xl space-y-6">
          <div className="flex items-center gap-3 text-brand-500 font-bold text-sm">
            <ShieldCheck className="h-6 w-6 text-accent-green shrink-0" />
            <span>ISO 14067 &amp; GHG Protocol Uyumlu 10 Katmanlı Disiplin</span>
          </div>

          <h2 className="text-2xl font-black text-white sm:text-3xl">
            Tedarikçi Veri Dosyasında Neler Yer Alır?
          </h2>

          <p className="text-brand-mist text-base leading-relaxed max-w-2xl font-medium">
            Alıcınızın sürdürülebilirlik denetçisine doğrudan sunabileceği, izlenebilir ve fatura dayanaklı 10 katmanlı teknik veri dökümü:
          </p>

          <div className="grid gap-4 sm:grid-cols-3 pt-2 text-sm">
            <div className="rounded-2xl bg-brand-900/80 p-4 border border-brand-500/30 space-y-1">
              <div className="font-black text-brand-500">1. Tesis &amp; Sınır Kimliği</div>
              <div className="text-xs text-brand-tint">UNLOCODE, koordinat ve organizasyonel sınır tanımı.</div>
            </div>
            <div className="rounded-2xl bg-brand-900/80 p-4 border border-brand-500/30 space-y-1">
              <div className="font-black text-brand-500">2. Kaynak Akışları</div>
              <div className="text-xs text-brand-tint">Doğalgaz, elektrik, proses yakıtları ve NCV değerleri.</div>
            </div>
            <div className="rounded-2xl bg-brand-900/80 p-4 border border-brand-500/30 space-y-1">
              <div className="font-black text-brand-500">3. Dijital Doğrulama</div>
              <div className="text-xs text-brand-tint">SHA-256 mühürlü manifesto ve hesaplama izi JSON.</div>
            </div>
          </div>
        </div>

        {/* BEKLEMEDEKİ DİĞER SEKTÖRLER TABLOSU */}
        <div className="space-y-4 rounded-3xl border-2 border-line bg-white p-7 shadow-sm">
          <h3 className="text-xl font-black text-ink-900">Diğer AB Tedarik Zinciri Düzenlemeleri</h3>
          <p className="text-sm text-ink-600 font-medium">
            Aşağıdaki sektörler için veri çerçeveleri kademeli olarak açılmaktadır:
          </p>

          <div className="divide-y divide-line">
            {BEKLEMEDEKI_SEKTORLER.map((s) => (
              <div key={s.name} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                <div>
                  <div className="font-bold text-ink-900">{s.name}</div>
                  <div className="text-xs text-ink-600 font-mono">{s.reg}</div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 w-fit">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ALT CTA */}
        <div className="rounded-3xl border-2 border-brand-500 bg-brand-100/70 p-8 text-center shadow-lg space-y-4">
          <h2 className="text-2xl font-black text-brand-950">Alıcınız Veri Dosyası mı Talep Etti?</h2>
          <p className="text-ink-700 text-base max-w-xl mx-auto font-medium">
            Sektörünüzü seçerek 10 katmanlı veri hazırlama sihirbazını hemen ücretsiz başlatabilirsiniz.
          </p>
          <div>
            <Link
              href="/basla/"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-brand-500 px-8 text-lg font-black text-brand-950 hover:bg-brand-400 transition shadow-md"
            >
              <span>Tedarikçi Veri Dosyasını Başlat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
