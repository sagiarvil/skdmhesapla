import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowRight, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";

export const metadata: Metadata = {
  title: "CSRD Kapsam 3 Tedarikçi Emisyon Verisi — AB İhracatçısı Rehberi",
  description:
    "Büyük AB müşterilerinize parça, hammadde veya yarı mamul satarken istenen CSRD Kapsam 3 tedarikçi karbon ayak izi verisi ve ISO 14067 paylaşım standartları.",
};

export default function CsrdKapsam3Page() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10 px-5 sm:px-6">
        <GeriLink />

        {/* BAŞLIK */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <Building2 className="h-4 w-4" />
            <span>AB Kurumsal Sürdürülebilirlik Direktifi (CSRD / ESRS E1)</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">
            CSRD Kapsam 3: Alıcınız Neden Karbon Verinizi İstiyor?
          </h1>
          <p className="text-base font-semibold leading-relaxed text-ink-700 sm:text-xl">
            Avrupa Birliği&apos;ndeki büyük kurumsal alıcılar (50.000&apos;den fazla şirket), CSRD direktifi kapsamında tüm değer zincirlerindeki Kapsam 3 (Scope 3) emisyonlarını bağımsız denetimden geçmiş biçimde raporlamak zorundadır.
          </p>
        </div>

        {/* SENARYO VE İŞLEYİŞ */}
        <div className="space-y-6 rounded-3xl border-2 border-line bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black text-ink-900">Türk Tedarikçisi İçin Senaryo</h2>
          
          <div className="space-y-4 text-base text-ink-700 font-medium leading-relaxed">
            <p>
              Otomotiv, beyaz eşya, makine, plastik, tekstil veya ambalaj sektöründe faaliyet gösteren bir Türk üreticiyseniz ve AB&apos;ye doğrudan veya dolaylı ihracat yapıyorsanız, müşterinizden bir <strong>&ldquo;Tedarikçi Karbon Anketi&rdquo;</strong> veya <strong>&ldquo;ESG Veri Talebi&rdquo;</strong> almanız kaçınılmazdır.
            </p>
            <p>
              Müşteriniz bu veriyi alamazsa, sektör ortalaması olan yüksek varsayılan katsayıları kullanır; bu durum alıcının sürdürülebilirlik hedeflerini bozar ve sizi tedarikçi listesinde riskli konuma düşürür.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-500/30 bg-brand-100/60 p-5 space-y-2">
            <div className="font-black text-brand-950 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent-green" />
              <span>İstenen Temel Metrikler:</span>
            </div>
            <ul className="list-disc pl-5 text-sm text-ink-900 space-y-1 font-semibold">
              <li>Ürün Başına Beşik-Kapı (Cradle-to-Gate) Karbon Ayak İzi (kg CO₂e / birim veya ton)</li>
              <li>Tesisin Kapsam 1 (Doğalgaz/Yakıt) ve Kapsam 2 (Şebeke Elektriği) Tüketim Kayıtları</li>
              <li>Kullanılan birincil elektrik emisyon faktörü ve yenilenebilir enerji sertifikaları (I-REC)</li>
              <li>Fatura dayanaklı faaliyet verisi ve izleme metodolojisi (ISO 14067 / GHG Protocol)</li>
            </ul>
          </div>
        </div>

        {/* 10 KATMANLI ÇÖZÜM */}
        <div className="space-y-6 rounded-3xl border-2 border-brand-800/30 bg-brand-950 p-8 text-white shadow-xl">
          <h2 className="text-2xl font-black text-white">SKDMHesapla ile Nasıl Hazırlanır?</h2>
          <p className="text-brand-mist text-base leading-relaxed font-medium">
            Platformumuz, CSRD Kapsam 3 taleplerine yanıt vermek üzere aynı 10 katmanlı doğrulama disiplinini uygular. Çıktı bir SKDM raporu değil; alıcınızın sürdürülebilirlik ekibine teslim edebileceğiniz <strong>mühürlü tedarikçi veri dosyasıdır</strong>.
          </p>
          <div className="pt-2">
            <Link
              href="/basla/"
              className="inline-flex min-h-[50px] items-center gap-2 rounded-2xl bg-brand-500 px-7 text-base font-black text-brand-950 hover:bg-brand-400 transition"
            >
              <span>CSRD Tedarikçi Dosyası Başlat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
