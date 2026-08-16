import Link from "next/link";
import {
  Battery,
  Boxes,
  Car,
  Factory,
  FileText,
  FlaskConical,
  Leaf,
  Package,
  Ship,
  Sofa,
  Shirt,
  Layers,
  Cpu,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { CiftDalga } from "@/components/brand/CiftDalga";
import GtipArama from "@/components/GtipArama";
import { SKDM_SECTORS, type SectorBenchmark } from "@/lib/skdm/config";

const GUVEN_CHIPLERI = [
  { icon: ShieldCheck, metin: "AB 2023/956 & 2025/2083 Tam Uyumlu" },
  { icon: Zap, metin: "Deterministik Hesaplama Motoru" },
  { icon: Lock, metin: "SHA-256 Dijital Mühürlü Paket" },
] as const;

const TIER_BC_ICONS: Record<string, LucideIcon> = {
  battery: Battery,
  packaging: Package,
  food: Leaf,
  logistics: Ship,
  plastics: Boxes,
  chemicals: FlaskConical,
  glass: Droplets,
  textile: Shirt,
  machinery: Factory,
  automotive: Car,
  electronics: Cpu,
  furniture: Sofa,
  paper: FileText,
  construction: Layers,
};

export default function HomePage() {
  const tierA = Object.values(SKDM_SECTORS).filter((s) => s.tier === "A").slice(0, 6);
  const tierBC = Object.values(SKDM_SECTORS).filter((s) => s.tier === "B" || s.tier === "C");

  return (
    <div className="text-ink-900 bg-white">
      {/* HERO — Aydınlık, Ferah, Ultra-Lüks ve Nefes Alan Premium Tasarım */}
      <section className="pasaport-zemin-acik relative isolate overflow-hidden bg-gradient-to-b from-[#f7faf4] via-[#edf4e4] to-white border-b border-line">
        <div className="relative z-[1] mx-auto flex max-w-5xl flex-col items-center gap-7 px-5 py-14 text-center sm:px-6 sm:py-20">
          
          {/* Üst Rozet */}
          <div className="inline-flex items-center gap-2.5 rounded-full border-2 border-brand-800/20 bg-white/80 backdrop-blur px-5 py-2 text-sm font-black text-brand-900 shadow-sm sm:text-base">
            <span className="flex h-3 w-3 rounded-full bg-brand-500 animate-ping" />
            <span>AB SKDM (CBAM) Kesin Dönem Sertifika Maliyeti ve Denetim Dosyası</span>
          </div>

          {/* Ana Başlık — Büyük, Net, Keskin */}
          <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-ink-900 sm:text-6xl sm:leading-[1.1]">
            AB&apos;ye satıyorsanız,
            <br />
            <span className="text-brand-800 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 bg-clip-text text-transparent">
              karbon dosyanız hazır olmalı.
            </span>
          </h1>

          {/* Açıklama — İri ve Son Derece Okunaklı */}
          <p className="max-w-3xl text-lg font-semibold leading-relaxed text-ink-700 sm:text-2xl sm:leading-9">
            Ürününüzü yazın veya sektörünüzü seçin; alıcınızın üstleneceği sertifika maliyetini hesaplayıp denetime hazır resmi dosya paketinizi dakikalar içinde üretin.
          </p>

          {/* Ultra-Lüks Arama Konsolu */}
          <div className="w-full max-w-3xl rounded-3xl border-2 border-brand-800/25 bg-white p-6 text-left shadow-2xl sm:p-8">
            <GtipArama />
          </div>

          {/* Hızlı Aksiyon & Fırsat Rozeti */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/basla/"
              className="inline-flex min-h-[58px] items-center gap-3 rounded-2xl bg-brand-500 px-9 text-lg font-black text-brand-950 shadow-xl transition-all hover:bg-brand-400 hover:scale-[1.02] sm:text-xl"
            >
              <span>Hesaplamaya Hemen Başla</span>
              <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
            </Link>
            <Link
              href="/nasil-calisir/"
              className="inline-flex min-h-[58px] items-center rounded-2xl border-2 border-brand-800/30 bg-white px-7 text-lg font-bold text-ink-900 shadow-md hover:bg-brand-100/50 transition-all"
            >
              Nasıl Çalışır?
            </Link>
          </div>

          {/* Ücretsiz Taahhüdü */}
          <div className="inline-flex items-center gap-3 rounded-full border-2 border-accent-green/40 bg-accent-green/10 px-6 py-2.5 text-sm font-extrabold text-ink-900 shadow-sm sm:text-base">
            <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0" />
            <span>Mühürleme öncesi tüm aşamalar tamamen ücretsizdir — kredi kartı istenmez.</span>
          </div>

          {/* Güven Rozetleri */}
          <ul className="flex flex-wrap justify-center gap-3 pt-3">
            {GUVEN_CHIPLERI.map((item) => (
              <li
                key={item.metin}
                className="inline-flex items-center gap-2.5 rounded-xl border border-line bg-white/90 px-4 py-2 text-xs font-bold text-ink-800 shadow-sm sm:text-sm"
              >
                <item.icon className="h-4 w-4 text-brand-800" />
                <span>{item.metin}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 ADIM ÖZETİ — Ferah ve Belirgin */}
      <section className="bg-white py-14 sm:py-20 border-b border-line">
        <div className="mx-auto max-w-container px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-3xl font-black text-ink-900 sm:text-4xl">3 Basit Adımda Dosyanız Hazır</h2>
            <p className="text-base sm:text-lg text-ink-600 font-medium">Karmaşık danışmanlık süreçlerine gerek kalmadan adım adım ilerleyin.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Ürününüzü Seçin",
                d: "GTİP kodunuzu veya ürün adınızı yazın; sistem kapsamdaki 8 haneli CN kodunu anında önerir.",
              },
              {
                n: "2",
                t: "Verilerinizi Girin",
                d: "10 şeffaf adımda ilerleyin; her alanın yanında resmi açıklamalar ve yol gösterici ipuçları yer alır.",
              },
              {
                n: "3",
                t: "Mühürlü Paketi Alın",
                d: "Doğrulayıcı ve alıcınız için 6 resmi dosya ve SHA-256 imzalı mühürlü paketinizi indirin.",
              },
            ].map((a) => (
              <div
                key={a.n}
                className="rounded-2xl border-2 border-line bg-[#f8fbf9] p-7 shadow-sm hover:border-brand-800/40 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-xl font-black text-brand-950 shadow-md">
                  {a.n}
                </div>
                <h3 className="text-2xl font-black text-ink-900">{a.t}</h3>
                <p className="text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
                  {a.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KADEME A — ZORUNLU KAPSAM (6 SEKTÖR) */}
      <section className="pasaport-zemin-acik bg-[#f3f7f4] py-16 sm:py-24 border-b border-line">
        <div className="mx-auto max-w-container space-y-10 px-5 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <span className="rounded-full bg-brand-500/25 px-4 py-1 text-xs font-black text-brand-950 border border-brand-500/40 uppercase tracking-wide">
              Kademe A — Yasal Zorunlu Kapsam
            </span>
            <h2 className="text-3xl font-black text-ink-900 sm:text-5xl">
              SKDM 6 Çekirdek Sektör
            </h2>
            <p className="text-lg leading-relaxed text-ink-700 font-semibold sm:text-xl">
              AB Tüzüğü 2023/956 kapsamındaki resmi sektörler. Sektörünüzü seçerek hesaplama sihirbazını başlatın.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tierA.map((s) => (
              <Link
                key={s.id}
                href={`/hesapla/${slugFromSectorId(s.id)}/`}
                className="group rounded-2xl border-2 border-line border-t-8 border-t-brand-500 bg-white p-7 shadow-md transition-all hover:-translate-y-1 hover:border-brand-500 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-ink-900 group-hover:text-brand-800">
                    {s.name}
                  </h3>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-900 group-hover:bg-brand-500 transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-3 inline-block rounded-lg bg-brand-100/70 px-3 py-1 font-mono text-sm font-black text-brand-950 border border-brand-500/30">
                  CN: {s.cnCodes[0]}
                </div>
                <p className="mt-4 text-base leading-relaxed text-ink-700 font-medium">
                  {s.description || "Doğrudan gömülü emisyon hesaplama ve denetime hazırlık dosyası."}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KADEME B — TEDARİKÇİ VERİ ÇERÇEVESİ (KADEME A STANDARTLARINDA 14 SEKTÖR) */}
      <section className="pasaport-zemin-acik bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-container space-y-10 px-5 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <span className="rounded-full bg-brand-800/15 px-4 py-1 text-xs font-black text-brand-900 border border-brand-800/30 uppercase tracking-wide">
              Kademe B — Tedarikçi Veri Çerçevesi
            </span>
            <h2 className="text-3xl font-black text-ink-900 sm:text-5xl">
              14 Ek Sektör — Tedarikçi Veri Dosyası
            </h2>
            <p className="text-lg leading-relaxed text-ink-700 font-semibold sm:text-xl">
              Bu 14 sektör için çıktı SKDM raporu değildir; ISO 14067 ve CSRD mantığında tedarikçi veri dosyasıdır.
              Aynı 10 katmanlı doğrulama adımlarıyla hazırlanır.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tierBC.map((s) => {
              const Icon = TIER_BC_ICONS[s.id] || Package;
              return (
                <Link
                  key={s.id}
                  href={`/hesapla/${s.id}/`}
                  className="group rounded-2xl border-2 border-line border-t-8 border-t-brand-800 bg-white p-7 shadow-md transition-all hover:-translate-y-1 hover:border-brand-800 hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-900 shadow-sm">
                        <Icon className="h-6 w-6" strokeWidth={2.2} />
                      </span>
                      <h3 className="text-xl font-black text-ink-900 group-hover:text-brand-800">
                        {s.name}
                      </h3>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-900 group-hover:bg-brand-800 group-hover:text-white transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="rounded-lg bg-brand-100/60 px-3 py-1 text-xs font-black text-brand-900 border border-brand-800/20">
                      ISO 14067 / Kapsam 3
                    </span>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-ink-700 font-medium">
                    {s.description || "Alıcı talepli tedarikçi karbon ayak izi veri dosyası."}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="pt-6 text-center">
            <Link
              href="/rehber/#kademe-b"
              className="inline-flex items-center gap-3 text-lg font-black text-brand-900 hover:text-brand-800 underline underline-offset-4"
            >
              <span>Kademe B Mevzuat ve Kapsam Kılavuzunu İnceleyin</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function slugFromSectorId(id: string): string {
  const map: Record<string, string> = {
    "iron-steel": "demir-celik",
    aluminum: "aluminyum",
    cement: "cimento",
    fertilizer: "gubre",
    electricity: "elektrik",
    hydrogen: "hidrojen",
  };
  return map[id] || id;
}
