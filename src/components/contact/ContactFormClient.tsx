"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  Copy,
  Check,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  Clock,
  Sparkles,
  Layers,
  Calculator,
  FileCheck2,
  Building2,
  Receipt,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";

const TOPICS = [
  {
    id: "hesaplama-metodoloji",
    label: "Hesaplama & Metodoloji Desteği",
    description: "GTİP, öncül emisyon, 10 Ağustos default values",
    icon: Calculator,
    email: LEGAL_ENTITY.supportEmail,
    sla: "2–4 İş Saati",
  },
  {
    id: "gtip-kapsam",
    label: "GTİP / Kapsam ve Fasıl Tespiti",
    description: "569 CN kodu, Annex II kapsam analizi",
    icon: Layers,
    email: LEGAL_ENTITY.supportEmail,
    sla: "2–4 İş Saati",
  },
  {
    id: "dogrulama-hazirlik",
    label: "Doğrulamaya Hazırlık & Kanıt Paketi",
    description: "Verifier öncesi veri dosyası ve O3CI",
    icon: FileCheck2,
    email: LEGAL_ENTITY.supportEmail,
    sla: "2–4 İş Saati",
  },
  {
    id: "kurumsal-lisans",
    label: "Kurumsal Lisanslama & Çoklu Tesis",
    description: "Grup şirketleri, tedarikçi entegrasyonu",
    icon: Building2,
    email: "info@cimetricaone.com",
    sla: "Aynı İş Günü",
  },
  {
    id: "fatura-odeme-muhur",
    label: "Fatura, Ödeme ve Mühür Desteği",
    description: "Paddle fatura, sipariş ve mühürlü arşiv",
    icon: Receipt,
    email: LEGAL_ENTITY.supportEmail,
    sla: "2–4 İş Saati",
  },
  {
    id: "diger",
    label: "Diğer / Genel Bilgi Talebi",
    description: "Resmi iş birliği ve genel danışma",
    icon: HelpCircle,
    email: "info@cimetricaone.com",
    sla: "Aynı İş Günü",
  },
] as const;

export function ContactFormClient() {
  const [topic, setTopic] = useState<string>("hesaplama-metodoloji");
  const [priority, setPriority] = useState<"NORMAL" | "HIGH">("NORMAL");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [kvkkAccepted, setKvkkAccepted] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTopic = TOPICS.find((t) => t.id === topic) || TOPICS[0];
  const targetEmail = selectedTopic.email;

  function buildMailtoUrl() {
    const priorityTag = priority === "HIGH" ? "[ACİL/YÜKSEK ÖNCELİK] " : "";
    const subject = encodeURIComponent(
      `${priorityTag}[SKDM Destek] ${selectedTopic.label} — ${company || name || "Talep"}`
    );
    const bodyContent = [
      `=== SKDMHESAPLA KURUMSAL DESTEK TALEBİ ===`,
      `Öncelik Seviyesi: ${priority === "HIGH" ? "YÜKSEK (Acil İnceleme)" : "Normal"}`,
      `Konu: ${selectedTopic.label}`,
      `Hedef Masası: ${targetEmail}`,
      `Talep Eden: ${name}`,
      `Kurumsal E-Posta: ${email}`,
      `Şirket / Tesis: ${company || "Belirtilmedi"}`,
      `Telefon: ${phone || "Belirtilmedi"}`,
      "",
      `=== TALEP / MESAJ DETAYI ===`,
      message,
      "",
      `----------------------------------------`,
      `Bu talep skdmhesapla.com kurumsal destek merkezi üzerinden güvenli olarak oluşturulmuştur.`,
    ].join("\n");

    const body = encodeURIComponent(bodyContent);
    return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  }

  function handleCopy() {
    const priorityTag = priority === "HIGH" ? "[ACİL/YÜKSEK ÖNCELİK] " : "";
    const text = [
      `=== SKDMHESAPLA KURUMSAL DESTEK TALEBİ ===`,
      `Öncelik: ${priority === "HIGH" ? "YÜKSEK (Acil İnceleme)" : "Normal"}`,
      `Konu: ${selectedTopic.label}`,
      `Hedef Masası: ${targetEmail}`,
      `Ad Soyad: ${name}`,
      `Kurumsal E-Posta: ${email}`,
      `Şirket / Tesis: ${company || "-"}`,
      `Telefon: ${phone || "-"}`,
      "",
      `=== MESAJ ===`,
      message,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Lütfen adınız, kurumsal e-postanız ve mesaj alanlarını doldurun.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Lütfen geçerli bir kurumsal e-posta adresi girin.");
      return;
    }
    if (!kvkkAccepted) {
      setError("Lütfen KVKK Aydınlatma Metni'ni kabul edin.");
      return;
    }

    setError(null);
    setSubmitted(true);

    // Otomatik olarak kullanıcının varsayılan e-posta uygulamasını aç
    const mailto = buildMailtoUrl();
    window.location.href = mailto;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-brand-800/25 bg-white p-6 shadow-xl sm:p-8 lg:p-9">
      {/* Decorative luxury hairline accent at top */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-900 via-brand-500 to-emerald-700" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-900 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-brand-500 shadow-sm">
              <MessageSquare className="h-3.5 w-3.5" /> Doğrudan Destek Masası
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Canlı
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
            Talebinizi İletin
          </h2>
          <p className="mt-1 text-xs font-medium text-ink-600">
            Formu doldurarak doğrudan uzman masamıza yönlendirilen resmi talep oluşturabilirsiniz.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-800/15 bg-brand-50/70 p-3 text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-800">Hedef Yanıt SLA</p>
          <p className="text-sm font-black text-brand-950">{selectedTopic.sla}</p>
        </div>
      </div>

      {submitted ? (
        <div className="mt-6 space-y-6 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 p-6 sm:p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                Talep Hazırlandı
              </span>
              <h3 className="text-xl font-black text-emerald-950">Destek E-Postanız Oluşturuldu</h3>
              <p className="text-xs font-medium leading-relaxed text-emerald-900">
                E-posta istemciniz otomatik olarak açıldı. Açılmadıysa aşağıdaki butonları kullanarak doğrudan gönderebilir veya metni kopyalayıp dilediğiniz kanaldan iletebilirsiniz.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-300/80 bg-white p-4.5 text-xs font-medium text-ink-800 space-y-2.5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2 text-[11px] font-bold text-ink-600">
              <span>Hedef Adres: <strong className="text-brand-900 font-black">{targetEmail}</strong></span>
              <span>Konu: <strong className="text-ink-900">{selectedTopic.label}</strong></span>
              {priority === "HIGH" && (
                <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-800">YÜKSEK ÖNCELİK</span>
              )}
            </div>
            <p className="text-ink-700">
              Gönderen: <strong>{name}</strong> ({email}) {company ? `· ${company}` : ""} {phone ? `· Tel: ${phone}` : ""}
            </p>
            <div className="rounded-xl bg-[#f8faf8] p-3 text-ink-700 whitespace-pre-wrap font-mono text-[11px] leading-relaxed border border-line">
              {message}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={buildMailtoUrl()}
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-900 px-6 text-xs font-black text-white hover:bg-brand-800 shadow-md transition"
            >
              <Send className="h-4 w-4 text-brand-500" /> E-Postayı Aç ve Gönder
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-brand-800/25 bg-white px-5 text-xs font-black text-brand-950 hover:bg-brand-50 transition shadow-sm"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-brand-800" />}
              {copied ? "Metin Kopyalandı!" : "Metni Kopyala"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setMessage("");
              }}
              className="inline-flex min-h-12 items-center px-4 text-xs font-bold text-ink-600 hover:text-ink-950"
            >
              Yeni Talep Oluştur
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-900 shadow-sm">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Topic Selector */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-wider text-ink-800">
                1. Başvuru / Destek Konusu <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] font-semibold text-brand-800">Doğru masaya anında yönlendirilir</span>
            </div>
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {TOPICS.map((t) => {
                const IconComponent = t.icon;
                const isSelected = topic === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-150 ${
                      isSelected
                        ? "border-brand-800 bg-gradient-to-br from-brand-50 to-emerald-50/50 ring-2 ring-brand-800 shadow-sm"
                        : "border-line bg-[#fbfdfb] hover:border-brand-800/40 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                            isSelected ? "bg-brand-900 text-brand-500" : "bg-brand-100 text-brand-800 group-hover:bg-brand-200"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black text-ink-900 leading-snug">{t.label}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-brand-800" />}
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-ink-600 pl-9 leading-tight">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields: Name & Email */}
          <div className="space-y-4 pt-2 border-t border-line">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-wider text-ink-800">
                2. İletişim Bilgileriniz
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-ink-500">Öncelik:</span>
                <button
                  type="button"
                  onClick={() => setPriority((p) => (p === "NORMAL" ? "HIGH" : "NORMAL"))}
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-black tracking-wider uppercase transition ${
                    priority === "HIGH"
                      ? "bg-red-600 text-white shadow-sm ring-2 ring-red-400"
                      : "bg-ink-100 text-ink-700 hover:bg-ink-200"
                  }`}
                >
                  {priority === "HIGH" ? "⚡ Yüksek / Acil" : "Normal"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-bold text-ink-700">
                  Ad Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn. Ahmet Yılmaz"
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fcfdfa] px-3.5 py-2.5 text-sm font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/20"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-bold text-ink-700">
                  Kurumsal E-Posta <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ad.soyad@sirketiniz.com"
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fcfdfa] px-3.5 py-2.5 text-sm font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/20"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-company" className="block text-xs font-bold text-ink-700">
                  Şirket / Sanayi Tesisi Unvanı
                </label>
                <input
                  id="contact-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Örn. Anadolu Çelik San. A.Ş."
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fcfdfa] px-3.5 py-2.5 text-sm font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/20"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="block text-xs font-bold text-ink-700">
                  Telefon Numarası <span className="text-ink-400 text-[10px] font-normal">(isteğe bağlı)</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className="mt-1.5 w-full rounded-xl border border-line bg-[#fcfdfa] px-3.5 py-2.5 text-sm font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/20"
                />
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div className="pt-2 border-t border-line">
            <div className="flex items-center justify-between">
              <label htmlFor="contact-message" className="block text-xs font-black uppercase tracking-wider text-ink-800">
                3. Mesajınız / Destek Detayı <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] font-semibold text-ink-500">
                {message.length > 0 ? `${message.length} karakter` : "GTİP veya dosya kodunu ekleyebilirsiniz"}
              </span>
            </div>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sorunuzu, GTİP numaranızı, tesis tipinizi veya mühürlü dosya talebinizi detaylarıyla yazınız..."
              className="mt-2 w-full rounded-xl border border-line bg-[#fcfdfa] p-3.5 text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/20 leading-relaxed"
            />
          </div>

          {/* KVKK Checkbox */}
          <div className="flex items-start gap-3 rounded-xl bg-brand-50/50 p-3.5 border border-brand-800/10">
            <input
              id="contact-kvkk"
              type="checkbox"
              checked={kvkkAccepted}
              onChange={(e) => setKvkkAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-line text-brand-900 focus:ring-brand-800"
            />
            <label htmlFor="contact-kvkk" className="text-xs font-medium leading-relaxed text-ink-700">
              Paylaştığım kurumsal iletişim verilerinin <a href="/kvkk-aydinlatma/" target="_blank" className="font-bold text-brand-900 underline underline-offset-2">KVKK Aydınlatma Metni</a> uyarınca talebimin yanıtlanması ve destek sağlanması amacıyla işlenmesini onaylıyorum.
            </label>
          </div>

          {/* Submit bar */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-8 text-sm font-black text-brand-950 shadow-md transition hover:bg-brand-400"
            >
              <Send className="h-4 w-4 transition group-hover:translate-x-0.5" />
              <span>Talebi Masaya İlet</span>
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verileriniz güvenle işlenir, 3. taraflarla paylaşılmaz.</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
