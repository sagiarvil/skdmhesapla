"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Users,
  ShieldCheck,
  Clock,
  Briefcase,
  Layers,
  HelpCircle,
} from "lucide-react";
import { track } from "@/lib/skdm/analytics";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";

const COMPANY_TYPES = [
  { id: "gumruk-musavirligi", label: "Gümrük Müşavirliği" },
  { id: "dis-ticaret", label: "Dış Ticaret Danışmanlığı" },
  { id: "karbon-cbam", label: "Karbon / CBAM Danışmanlığı" },
  { id: "diger", label: "Diğer Hizmet / Danışmanlık" },
] as const;

const CLIENT_SCALES = [
  { id: "1_5", label: "1 – 5 Müşteri" },
  { id: "6_20", label: "6 – 20 Müşteri" },
  { id: "21_50", label: "21 – 50 Müşteri" },
  { id: "50_plus", label: "50+ Müşteri" },
] as const;

export function PartnerLeadForm() {
  const [started, setStarted] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyType, setCompanyType] = useState<string>("gumruk-musavirligi");
  const [clientScale, setClientScale] = useState<string>("1_5");
  const [mainNeed, setMainNeed] = useState("");
  const [consent, setConsent] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetEmail = LEGAL_ENTITY.supportEmail;

  function handleInteraction() {
    if (!started) {
      setStarted(true);
      track("partner_form_start");
    }
  }

  function getSummaryText() {
    const selectedCompany = COMPANY_TYPES.find((t) => t.id === companyType)?.label || companyType;
    const selectedScale = CLIENT_SCALES.find((s) => s.id === clientScale)?.label || clientScale;

    return [
      `=== SKDMHESAPLA PARTNER NETWORK BAŞVURUSU ===`,
      `Tarih: ${new Date().toISOString()}`,
      `Kurum Adı: ${companyName}`,
      `Yetkili Adı: ${contactName}`,
      `Kurumsal E-Posta: ${workEmail}`,
      `Telefon: ${phone || "Belirtilmedi"}`,
      `Faaliyet Türü: ${selectedCompany}`,
      `Tahmini CBAM Müşteri Portföyü: ${selectedScale}`,
      "",
      `=== TEMEL İHTİYAÇ / OPERASYONEL HEDEF ===`,
      mainNeed || "Standart CBAM dosya hazırlık altyapısı incelemesi.",
      "",
      `----------------------------------------`,
      `Bu başvuru skdmhesapla.com/partner-network/ üzerinden güvenli olarak oluşturulmuştur.`,
      `Partner müşteri koruma sözleşmesi: Müşteri ilişkisi partnerde kalır.`,
    ].join("\n");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    track("partner_form_submit", { companyType, clientScale });

    if (!companyName.trim() || !contactName.trim() || !workEmail.trim()) {
      setError("Lütfen kurum adı, yetkili adı ve kurumsal e-posta alanlarını doldurun.");
      return;
    }
    if (!workEmail.includes("@") || !workEmail.includes(".")) {
      setError("Lütfen geçerli bir kurumsal e-posta adresi girin.");
      return;
    }
    if (!consent) {
      setError("Lütfen KVKK Aydınlatma Metni'ni ve işleme koşullarını onaylayın.");
      return;
    }

    setError(null);
    setSubmitted(true);
    track("partner_form_success", { companyType, clientScale });

    const subject = encodeURIComponent(`[SKDM Partner Başvurusu] ${companyName} — ${contactName}`);
    const body = encodeURIComponent(getSummaryText());
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(getSummaryText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  return (
    <div id="partner-form" className="relative overflow-hidden rounded-3xl border-2 border-brand-800/25 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-900 via-brand-500 to-brand-800" />

      {/* Header */}
      <div className="border-b border-line pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-900 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-500 shadow-xs">
            <Briefcase className="h-3.5 w-3.5" /> Partner Başvuru Masası
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-ink-700">
            <Clock className="h-3.5 w-3.5 text-brand-800" />
            <span>Hedef İnceleme: <strong>Aynı İş Günü</strong></span>
          </div>
        </div>
        <h3 className="mt-3 text-2xl font-black text-ink-900 sm:text-3xl">
          Partner Network&apos;e Katılın
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
          Müşteri portföyünüzü devretmeden, kendi unvanınız ve danışmanlık ilişkinizle SKDM/CBAM üretim altyapısını devreye alın.
        </p>
      </div>

      {submitted ? (
        <div className="mt-8 space-y-6 rounded-2xl border-2 border-brand-800/30 bg-gradient-to-br from-brand-100/60 via-white to-brand-100/30 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-900 text-brand-500 shadow-md">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <span className="inline-block rounded-md bg-brand-900 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-500">
                Başvurunuz Alındı
              </span>
              <h4 className="text-xl font-black text-ink-900">
                Teşekkür Ederiz, {contactName}
              </h4>
              <p className="text-sm leading-relaxed text-ink-700">
                Başvurunuz oluşturuldu ve varsayılan e-posta istemciniz açıldı. E-postanın iletildiğinden emin olmak için aşağıdaki başvuru metnini tek tıkla kopyalayıp <strong>{targetEmail}</strong> adresine doğrudan da gönderebilirsiniz.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-4 font-mono text-xs leading-relaxed text-ink-800 whitespace-pre-wrap">
            {getSummaryText()}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-800/30 bg-brand-100 px-4 py-2.5 text-xs font-bold text-brand-950 transition hover:bg-brand-100/80"
            >
              {copied ? <Check className="h-4 w-4 text-brand-800" /> : <Copy className="h-4 w-4" />}
              {copied ? "Panoya Kopyalandı" : "Metni Kopyala"}
            </button>
            <a
              href={`mailto:${targetEmail}?subject=${encodeURIComponent(`[SKDM Partner Başvurusu] ${companyName}`)}&body=${encodeURIComponent(getSummaryText())}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2.5 text-xs font-bold text-brand-500 transition hover:bg-brand-800 hover:text-white"
            >
              <Send className="h-4 w-4" /> E-posta İstemcisini Tekrar Aç
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} onFocus={handleInteraction} className="mt-6 space-y-5">
          {error && (
            <div className="rounded-xl border-2 border-amber-500/40 bg-amber-50/90 p-4 text-xs font-bold text-amber-950">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Kurum / Şirket Unvanı *
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Örn: ABC Gümrük Müşavirliği A.Ş."
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
            <div>
              <label htmlFor="contactName" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Yetkili Adı Soyadı *
              </label>
              <input
                id="contactName"
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Örn: Mehmet Yılmaz"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="workEmail" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Kurumsal E-Posta *
              </label>
              <input
                id="workEmail"
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="ad.soyad@sirketiniz.com"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Telefon Numarası <span className="text-ink-600 font-normal">(İsteğe Bağlı)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 532 000 00 00"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="companyType" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Faaliyet / Şirket Türü *
              </label>
              <select
                id="companyType"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              >
                {COMPANY_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="clientScale" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Tahmini CBAM Müşteri Sayınız *
              </label>
              <select
                id="clientScale"
                value={clientScale}
                onChange={(e) => setClientScale(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              >
                {CLIENT_SCALES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="mainNeed" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
              Temel İhtiyacınız veya Mevcut Tıkanma Noktanız
            </label>
            <textarea
              id="mainNeed"
              rows={3}
              value={mainNeed}
              onChange={(e) => setMainNeed(e.target.value)}
              placeholder="Örn: 10 demir-çelik ihracatçısı müşterimiz var; her biri için ayrı Excel hazırlamak yerine standardize bir üretim ve evidence altyapısı kurmak istiyoruz."
              className="mt-1.5 w-full rounded-xl border border-line bg-white p-3.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
            />
          </div>

          <div className="rounded-xl border border-brand-800/15 bg-brand-50/50 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-brand-800 text-brand-800 focus:ring-brand-800"
              />
              <span className="text-xs leading-relaxed text-ink-700">
                SKDMHesapla Partner Programı kapsamında bilgilerimin değerlendirilmesini, tarafımla iletişime geçilmesini ve{" "}
                <a href="/kvkk-aydinlatma/" target="_blank" className="font-bold text-brand-900 underline">
                  KVKK Aydınlatma Metni
                </a>
                &apos;ni kabul ediyorum. <strong>Müşterilerinize doğrudan pazarlama yapılmaz.</strong>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-900 py-4 px-6 text-sm font-black uppercase tracking-wider text-brand-500 shadow-md transition hover:bg-brand-800 hover:text-white sm:w-auto"
          >
            <Send className="h-4 w-4" /> Partner Başvurusunu Gönder
          </button>
        </form>
      )}
    </div>
  );
}
