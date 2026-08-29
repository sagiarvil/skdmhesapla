"use client";

import { useState } from "react";
import { Send, CheckCircle2, Copy, Check, MessageSquare, AlertCircle, ShieldCheck } from "lucide-react";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";

const TOPICS = [
  { id: "hesaplama-metodoloji", label: "Hesaplama & Metodoloji Desteği", email: LEGAL_ENTITY.supportEmail },
  { id: "gtip-kapsam", label: "GTİP / Kapsam Tespiti", email: LEGAL_ENTITY.supportEmail },
  { id: "dogrulama-hazirlik", label: "Doğrulamaya Hazırlık & Kanıt Paketi", email: LEGAL_ENTITY.supportEmail },
  { id: "kurumsal-lisans", label: "Kurumsal Lisanslama & Çoklu Tesis", email: "info@cimetricaone.com" },
  { id: "fatura-odeme-muhur", label: "Fatura, Ödeme ve Mühür Desteği", email: LEGAL_ENTITY.supportEmail },
  { id: "diger", label: "Diğer / Genel Bilgi", email: "info@cimetricaone.com" },
] as const;

export function ContactFormClient() {
  const [topic, setTopic] = useState<string>("hesaplama-metodoloji");
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
    const subject = encodeURIComponent(`[SKDM Destek] ${selectedTopic.label} — ${company || name || "Talep"}`);
    const bodyContent = [
      `Konu: ${selectedTopic.label}`,
      `Ad Soyad: ${name}`,
      `Kurumsal E-Posta: ${email}`,
      `Şirket / Tesis: ${company || "-"}`,
      `Telefon: ${phone || "-"}`,
      "",
      "Mesaj / Talep:",
      message,
      "",
      "---",
      "Bu talep skdmhesapla.com iletişim merkezi üzerinden oluşturulmuştur.",
    ].join("\n");
    const body = encodeURIComponent(bodyContent);
    return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  }

  function handleCopy() {
    const text = [
      `Konu: ${selectedTopic.label}`,
      `Hedef E-Posta: ${targetEmail}`,
      `Ad Soyad: ${name}`,
      `Kurumsal E-Posta: ${email}`,
      `Şirket / Tesis: ${company || "-"}`,
      `Telefon: ${phone || "-"}`,
      "",
      "Mesaj:",
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
    <div className="rounded-3xl border-2 border-brand-800/20 bg-white p-6 shadow-xl sm:p-8 lg:p-9">
      <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-900">
            <MessageSquare className="h-3.5 w-3.5" /> Doğrudan Destek Masası
          </span>
          <h2 className="mt-2 text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
            Talebinizi İletin
          </h2>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-[11px] font-bold text-ink-500">Ortalama Yanıt Süresi</p>
          <p className="text-sm font-black text-emerald-700">2–4 İş Saati</p>
        </div>
      </div>

      {submitted ? (
        <div className="mt-6 space-y-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-emerald-950">Talebiniz Hazırlandı</h3>
              <p className="text-sm font-medium leading-relaxed text-emerald-900/90">
                E-posta istemciniz otomatik olarak açıldı. Açılmadıysa aşağıdaki butonları kullanarak doğrudan gönderebilir veya metni kopyalayabilirsiniz.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-300/60 bg-white p-4 text-xs font-medium text-ink-800 space-y-2">
            <div className="flex justify-between text-[11px] text-ink-500 font-bold border-b border-line pb-1.5">
              <span>Hedef Adres: <b>{targetEmail}</b></span>
              <span>Konu: <b>{selectedTopic.label}</b></span>
            </div>
            <p className="text-ink-700">
              Gönderen: <strong>{name}</strong> ({email}) {company ? `· ${company}` : ""}
            </p>
            <p className="line-clamp-3 text-ink-600 whitespace-pre-wrap italic">
              &quot;{message}&quot;
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={buildMailtoUrl()}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-900 px-5 text-xs font-black text-white hover:bg-brand-800 shadow-sm transition"
            >
              <Send className="h-4 w-4" /> E-Postayı Aç ve Gönder
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-800/20 bg-white px-5 text-xs font-black text-brand-900 hover:bg-brand-50 transition"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "Metin Kopyalandı" : "Talebi Kopyala"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setMessage("");
              }}
              className="inline-flex min-h-11 items-center px-4 text-xs font-bold text-ink-600 hover:text-ink-900"
            >
              Yeni Talep Oluştur
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-900">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
              Destek / Başvuru Konusu <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {TOPICS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTopic(t.id)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-bold transition ${
                    topic === t.id
                      ? "border-brand-800 bg-brand-50 text-brand-950 ring-1 ring-brand-800"
                      : "border-line bg-[#fbfdfb] text-ink-700 hover:border-brand-800/30 hover:bg-white"
                  }`}
                >
                  <span>{t.label}</span>
                  {topic === t.id && <Check className="h-4 w-4 shrink-0 text-brand-800" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Ad Soyad <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn. Ahmet Yılmaz"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Kurumsal E-Posta <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ad.soyad@sirketiniz.com"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-company" className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Şirket / Tesis Unvanı
              </label>
              <input
                id="contact-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Örn. ABC Çelik San. A.Ş."
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>

            <div>
              <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Telefon Numarası <span className="text-ink-400 text-[10px] lowercase">(isteğe bağlı)</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 5XX XXX XX XX"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-ink-700">
              Mesajınız / Destek Talebiniz <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sorunuzu, GTİP numaranızı veya destek talebinizi ayrıntılarıyla açıklayınız..."
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="contact-kvkk"
              type="checkbox"
              checked={kvkkAccepted}
              onChange={(e) => setKvkkAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-line text-brand-800 focus:ring-brand-800"
            />
            <label htmlFor="contact-kvkk" className="text-xs font-medium leading-relaxed text-ink-600">
              Paylaştığım bilgilerin <a href="/kvkk-aydinlatma/" target="_blank" className="font-bold text-brand-900 underline">KVKK Aydınlatma Metni</a> kapsamında talebimin yanıtlanması amacıyla işlenmesini kabul ediyorum.
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-7 text-sm font-black text-brand-950 shadow-md transition hover:bg-brand-400"
            >
              <Send className="h-4 w-4" /> Talebi Gönder
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verileriniz güvenle iletilir, 3. taraflarla paylaşılmaz.</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
