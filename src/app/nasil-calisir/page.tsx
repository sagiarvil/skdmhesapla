import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";
import {
  NASIL_ALT_BANT,
  NASIL_STEPS,
  NASIL_UST_BANT,
} from "@/lib/skdm/content/nasil-calisir";

export const metadata: Metadata = {
  title: "Nasıl Çalışır — SKDM Hesaplama ve Mühürleme Süreci",
  description:
    "SKDMHesapla self-servis yazılımının 10 katmanlı hesaplama, kalite kontrol ve mühürlü dosya üretim adımları.",
};

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-extrabold text-ink-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function NasilCalisirPage() {
  const fiyat = PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR");

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10 px-5 sm:px-6">
        <GeriLink />

        {/* ÜST BAŞLIK */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            10 Katmanlı Teknik İş Akışı
          </span>
          <h1 className="text-3xl font-black tracking-tight text-ink-900 sm:text-5xl">
            SKDMHesapla Nasıl Çalışır?
          </h1>
          <p className="text-lg font-semibold leading-relaxed text-ink-700 sm:text-xl">
            Tesis verilerinizi girin, 10 katmanda otomatik denklik kontrollerini yapın; akredite
            doğrulayıcınız ve AB alıcınız için denetime hazır mühürlü paketinizi üretin.
          </p>
        </div>

        <DisclaimerBanner />

        {/* ÜST BİLGİ KARTI */}
        <div className="rounded-3xl border-2 border-brand-500 bg-white p-6 shadow-xl sm:p-8 space-y-3">
          <div className="flex items-center gap-3 text-brand-900 font-black text-lg sm:text-xl">
            <CheckCircle2 className="h-6 w-6 text-accent-green shrink-0" />
            <RichText text={NASIL_UST_BANT.badge} />
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-ink-700 font-medium pl-9">
            <RichText text={NASIL_UST_BANT.body.replace("9.900", fiyat)} />
          </p>
        </div>

        {/* ADIMLAR LİSTESİ */}
        <div className="space-y-6">
          {NASIL_STEPS.map((s, index) => (
            <section
              key={s.id}
              className="rounded-3xl border-2 border-line bg-white p-6 shadow-md transition-all hover:border-brand-500/50 hover:shadow-lg sm:p-8 space-y-4"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-lg font-black text-brand-950 shadow-sm">
                  {index + 1}
                </span>
                <h2 className="text-2xl font-black text-ink-900">{s.title}</h2>
              </div>

              {s.innerVoice && (
                <div className="rounded-xl border border-brand-800/20 bg-brand-100/50 px-4 py-2 text-sm font-semibold italic text-brand-900">
                  💡 Üretici İç Sesi: {s.innerVoice}
                </div>
              )}

              <ul className="space-y-3 pl-2 text-base sm:text-lg text-ink-700 font-medium">
                {s.bullets.map((b) => (
                  <li key={b.slice(0, 40)} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-800" />
                    <span className="leading-relaxed">
                      <RichText text={b} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* GÜVEN CÜMLELERİ KARTI */}
        <div className="rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-brand-800" />
            <h2 className="text-2xl font-black text-ink-900">Veri Güvenliği ve Doğruluk İlkeleri</h2>
          </div>
          <ul className="space-y-3 text-base sm:text-lg text-ink-700 font-medium">
            {NASIL_ALT_BANT.map((b) => (
              <li key={b.slice(0, 40)} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-green mt-1" />
                <span className="leading-relaxed">
                  <RichText text={b} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ALT CTA */}
        <div className="rounded-3xl border-2 border-brand-500/40 bg-brand-950 p-8 text-center text-white shadow-2xl space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Hesaplamayı Hemen Başlatın
          </h2>
          <p className="max-w-xl mx-auto text-base text-brand-mist font-medium">
            Tüm adımları deneyin, canlı simülasyonu görün. Mühürleme öncesi kart istenmez.
          </p>
          <div>
            <Link
              href="/basla/"
              className="inline-flex min-h-[54px] items-center gap-3 rounded-2xl bg-brand-500 px-8 text-lg font-black text-brand-950 hover:bg-brand-400 shadow-lg transition"
            >
              <span>Sektörünüzü Seçin</span>
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
