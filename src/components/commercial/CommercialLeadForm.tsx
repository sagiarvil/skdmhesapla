"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "partner" | "eu";
type Locale = "tr" | "en";
type Payload = Record<string, string>;

const TARGET_EMAIL = "info@cimetricaone.com";

function emit(event: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Array<Record<string, string>> };
  w.dataLayer?.push({ event });
  window.dispatchEvent(new CustomEvent("skdm:analytics", { detail: { event } }));
}

export function CommercialViewEvent({ event }: { event: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          emit(event);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [event]);
  return <span ref={ref} aria-hidden="true" className="absolute h-px w-px overflow-hidden" />;
}

export function CommercialEventLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} onClick={() => emit(event)} className={className}>
      {children}
    </a>
  );
}

function fieldClass() {
  return "mt-2 min-h-12 w-full rounded-xl border border-brand-900/20 bg-white px-3.5 py-3 text-sm font-semibold text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-500/30";
}

function copyWithFallback(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
  return Promise.resolve();
}

export function CommercialLeadForm({ variant, locale }: { variant: Variant; locale: Locale }) {
  const english = locale === "en";
  const [data, setData] = useState<Payload>({});
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    emit(variant === "partner" ? "partner_page_view" : "eu_importer_page_view");
  }, [variant]);

  const update = (key: string, value: string) => setData((current) => ({ ...current, [key]: value }));
  const onStart = () => {
    if (started.current) return;
    started.current = true;
    emit(variant === "partner" ? "partner_form_start" : "eu_importer_form_start");
  };

  const required = variant === "partner"
    ? ["companyName", "contactName", "workEmail", "companyType", "estimatedCbamClients", "mainNeed", "consent"]
    : ["companyName", "euCountry", "contactName", "workEmail", "role", "supplierCount", "cbamSectors", "mainChallenge", "consent"];

  const lines = variant === "partner"
    ? [
        ["Şirket", data.companyName],
        ["Yetkili", data.contactName],
        ["Kurumsal e-posta", data.workEmail],
        ["Telefon", data.phone || "-"],
        ["Şirket türü", data.companyType],
        ["Tahmini CBAM müşteri sayısı", data.estimatedCbamClients],
        ["Ana ihtiyaç", data.mainNeed],
      ]
    : [
        ["Company", data.companyName],
        ["EU Member State", data.euCountry],
        ["Contact", data.contactName],
        ["Work email", data.workEmail],
        ["Role", data.role],
        ["Turkish supplier count", data.supplierCount],
        ["CBAM sectors", data.cbamSectors],
        ["Main challenge", data.mainChallenge],
      ];

  const message = lines.map(([label, value]) => `${label}: ${value || "-"}`).join("\n");
  const subject = variant === "partner" ? "SKDMHesapla Partner Network Başvurusu" : "SKDMHesapla EU Buyer Supplier Collection";
  const mailto = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    emit(variant === "partner" ? "partner_form_submit" : "eu_importer_form_submit");
    if (required.some((key) => !data[key]?.trim())) {
      setError(english ? "Please complete all required fields and confirm consent." : "Lütfen zorunlu alanları doldurun ve onay kutusunu işaretleyin.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.workEmail || "")) {
      setError(english ? "Please enter a valid work email address." : "Lütfen geçerli bir kurumsal e-posta adresi girin.");
      return;
    }
    setError("");
    setReady(true);
    emit(variant === "partner" ? "partner_form_success" : "eu_importer_form_success");
    window.location.href = mailto;
  }

  async function copy() {
    await copyWithFallback(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  if (ready) {
    return (
      <div className="rounded-2xl border border-brand-800/25 bg-brand-50 p-6 sm:p-7" role="status">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">
          {english ? "ENQUIRY READY" : "BAŞVURU HAZIR"}
        </p>
        <h3 className="mt-2 text-xl font-black text-brand-950">
          {english ? "Your enquiry email is ready." : "Başvuru e-postanız hazırlandı."}
        </h3>
        <p className="mt-2 text-sm leading-6 text-ink-700">
          {english
            ? "Your email application should now be open. If it did not open, use the buttons below. Target response: same business day."
            : "E-posta uygulamanız açılmadıysa aşağıdaki seçenekleri kullanabilirsiniz. Hedef geri dönüş: aynı iş günü."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={mailto} className="inline-flex min-h-12 items-center rounded-xl bg-brand-900 px-5 text-sm font-black text-white hover:bg-brand-800">
            {english ? "Open email" : "E-postayı aç"}
          </a>
          <button type="button" onClick={copy} className="inline-flex min-h-12 items-center rounded-xl border border-brand-900/25 bg-white px-5 text-sm font-black text-brand-950 hover:bg-brand-50">
            {copied ? (english ? "Copied" : "Kopyalandı") : (english ? "Copy request" : "Başvuruyu kopyala")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} onFocus={onStart} className="space-y-5" noValidate>
      {error ? <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950">{error}</div> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-ink-800">
          {english ? "Company name *" : "Şirket adı *"}
          <input value={data.companyName || ""} onChange={(e) => update("companyName", e.target.value)} autoComplete="organization" className={fieldClass()} />
        </label>
        {variant === "eu" ? (
          <label className="text-sm font-bold text-ink-800">
            EU Member State *
            <input value={data.euCountry || ""} onChange={(e) => update("euCountry", e.target.value)} autoComplete="country-name" className={fieldClass()} />
          </label>
        ) : (
          <label className="text-sm font-bold text-ink-800">
            İletişim kişisi *
            <input value={data.contactName || ""} onChange={(e) => update("contactName", e.target.value)} autoComplete="name" className={fieldClass()} />
          </label>
        )}
        {variant === "eu" ? (
          <label className="text-sm font-bold text-ink-800">
            Contact name *
            <input value={data.contactName || ""} onChange={(e) => update("contactName", e.target.value)} autoComplete="name" className={fieldClass()} />
          </label>
        ) : null}
        <label className="text-sm font-bold text-ink-800">
          {english ? "Work email *" : "Kurumsal e-posta *"}
          <input type="email" value={data.workEmail || ""} onChange={(e) => update("workEmail", e.target.value)} autoComplete="email" className={fieldClass()} />
        </label>
        {variant === "partner" ? (
          <>
            <label className="text-sm font-bold text-ink-800">
              Telefon
              <input value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" className={fieldClass()} />
            </label>
            <label className="text-sm font-bold text-ink-800">
              Şirket türü *
              <select value={data.companyType || ""} onChange={(e) => update("companyType", e.target.value)} className={fieldClass()}>
                <option value="">Seçin</option>
                <option>Gümrük Müşavirliği</option>
                <option>Dış Ticaret Danışmanlığı</option>
                <option>Karbon / CBAM Danışmanlığı</option>
                <option>Diğer</option>
              </select>
            </label>
            <label className="text-sm font-bold text-ink-800">
              Tahmini CBAM müşteri sayısı *
              <select value={data.estimatedCbamClients || ""} onChange={(e) => update("estimatedCbamClients", e.target.value)} className={fieldClass()}>
                <option value="">Seçin</option><option>1–5</option><option>6–20</option><option>21–50</option><option>50+</option>
              </select>
            </label>
          </>
        ) : (
          <>
            <label className="text-sm font-bold text-ink-800">
              Role *
              <input value={data.role || ""} onChange={(e) => update("role", e.target.value)} className={fieldClass()} />
            </label>
            <label className="text-sm font-bold text-ink-800">
              Turkish supplier count *
              <select value={data.supplierCount || ""} onChange={(e) => update("supplierCount", e.target.value)} className={fieldClass()}>
                <option value="">Select</option><option>1–5</option><option>6–20</option><option>21–50</option><option>51+</option>
              </select>
            </label>
            <label className="text-sm font-bold text-ink-800 sm:col-span-2">
              CBAM sectors *
              <input value={data.cbamSectors || ""} onChange={(e) => update("cbamSectors", e.target.value)} placeholder="e.g. iron & steel, aluminium, cement" className={fieldClass()} />
            </label>
          </>
        )}
      </div>
      <label className="block text-sm font-bold text-ink-800">
        {english ? "Main challenge *" : "Ana ihtiyaç *"}
        <textarea rows={4} value={(variant === "eu" ? data.mainChallenge : data.mainNeed) || ""} onChange={(e) => update(variant === "eu" ? "mainChallenge" : "mainNeed", e.target.value)} className={`${fieldClass()} resize-y`} />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-ink-700">
        <input type="checkbox" checked={data.consent === "yes"} onChange={(e) => update("consent", e.target.checked ? "yes" : "")} className="mt-1 h-5 w-5 rounded border-brand-800/30 accent-brand-800" />
        <span>{english ? "I consent to the use of these details to respond to this business enquiry. *" : "Bu bilgilerin iş ortaklığı başvuruma yanıt verilmesi amacıyla kullanılmasını onaylıyorum. *"}</span>
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-900 px-6 text-sm font-black text-white shadow-sm transition hover:bg-brand-800">
          {english ? "Prepare supplier collection enquiry" : "Partner başvurusunu hazırla"}
        </button>
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand-800">
          {english ? "Target response: same business day" : "Hedef geri dönüş: aynı iş günü"}
        </span>
      </div>
    </form>
  );
}
