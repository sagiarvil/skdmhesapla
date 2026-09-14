"use client";

import React, { useState } from "react";
import { submitPartnerLead } from "@/lib/firebase/lead-service";

interface EnterpriseConsultingProps {
  sectorName: string;
  sectorSlug: string;
  displayCostEur: number;
  sessionId: string;
}

export function EnterpriseConsultingSection({
  sectorName,
  sectorSlug,
  displayCostEur,
  sessionId,
}: EnterpriseConsultingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<string>("akredite-dogrulama");
  const [kvkkConsent, setKvkkConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formattedCost = displayCostEur ? displayCostEur.toLocaleString("tr-TR") : "0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!companyName.trim() || !contactName.trim() || !workEmail.trim() || !phone.trim()) {
      setErrorMessage("Lütfen tüm zorunlu alanları eksiksiz doldurunuz.");
      return;
    }

    if (!kvkkConsent) {
      setErrorMessage("Devam etmek için KVKK ve veri işleme metnini onaylamanız gerekmektedir.");
      return;
    }

    setLoading(true);

    try {
      const generatedRef = `SKDM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
      setRefId(generatedRef);

      const result = await submitPartnerLead({
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        workEmail: workEmail.trim(),
        phone: phone.trim(),
        companyType: "karbon-cbam",
        clientScale: "6_20",
        mainNeed: `[${sectorName}] ${serviceType} - Tahmini Karbon Maliyeti: €${formattedCost}`,
        metadata: {
          sessionId,
          sectorSlug,
          sectorName,
          displayCostEur,
          serviceType,
          leadRef: generatedRef,
          sourcePage: "wizard_summary_step_14",
        },
      });

      if (result.success || result.offlineFallback) {
        setSubmitted(true);
      } else {
        setErrorMessage(result.errorMessage || "Talep iletilirken bir sorun oluştu. Lütfen WhatsApp üzerinden doğrudan iletişime geçiniz.");
      }
    } catch (err: any) {
      console.error("Lead submission error:", err);
      // Fallback to submitted state with local reference so user is not blocked
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const waMessage = encodeURIComponent(
    `Merhaba, skdmhesapla.com kurumsal danışmanlık masası için yazıyorum.\n\n` +
      `Firma: ${companyName || "[Firma Adı]"}\n` +
      `Yetkili: ${contactName || "[Yetkili]"}\n` +
      `Sektör: ${sectorName}\n` +
      `Tahmini Sertifika Maliyeti: €${formattedCost}\n` +
      `Talep Türü: ${serviceType}\n` +
      (refId ? `Talep No: #${refId}\n` : "") +
      `\nResmi AB SKDM beyanname hazırlığı ve akredite doğrulayıcı süreçleri için teklif almak istiyoruz.`
  );

  return (
    <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/90 via-[#0f2316] to-[#0a1810] p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden backdrop-blur-md">
      {/* Arka plan parlama efekti */}
      <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {!isOpen && !submitted ? (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Kurumsal Danışmanlık &amp; Akredite Doğrulayıcı Masası
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Hesaplanan verileriniz için akredite doğrulama ve anahtar teslim beyanname desteği
            </h3>
            <p className="text-sm text-emerald-200/80 leading-relaxed font-medium">
              Tesis emisyonlarınızı uzman denetçilerimizle inceliyor; AB ithalatçınıza sunulacak resmi SKDM (CBAM) beyannamesini, GTİP katsayı analizini ve azaltım yol haritasını hazırlıyoruz.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-4 text-sm font-black text-brand-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition-all active:scale-95"
            >
              <span>📋</span>
              <span>Kurumsal Teklif Formunu Aç</span>
            </button>
            <a
              href={`https://wa.me/905320000000?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-white/5 px-5 py-4 text-sm font-bold text-emerald-200 hover:bg-white/10 transition-all active:scale-95"
            >
              <span>💬</span>
              <span>Hemen WhatsApp'tan Sorun</span>
            </a>
          </div>
        </div>
      ) : submitted ? (
        <div className="space-y-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-2xl">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Talebiniz Başarıyla Alındı</div>
              <h4 className="text-xl sm:text-2xl font-black text-white">Referans No: #{refId}</h4>
            </div>
          </div>

          <p className="text-sm text-emerald-200/90 leading-relaxed">
            Sayın <strong>{contactName}</strong>, <strong>{companyName}</strong> firması adına ilettiğiniz {sectorName} sektörü karbon raporlama ve doğrulama talebiniz uzman teknik masamıza ulaştı. Kıdemli SKDM denetçimiz 2 saat içinde tarafınızla irtibata geçecektir.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={`https://wa.me/905320000000?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-black text-brand-950 shadow-lg hover:bg-emerald-400 transition-all"
            >
              <span>💬</span>
              <span>Beklemeden WhatsApp ile Ön Görüşme Başlat</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setIsOpen(false);
              }}
              className="w-full sm:w-auto rounded-2xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-bold text-white/80 hover:bg-white/10 transition-all"
            >
              Kapat
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">B2B Kurumsal Talep</div>
              <h4 className="text-xl font-extrabold text-white">Resmi SKDM Beyanname ve Doğrulama Teklifi</h4>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white text-xl p-1"
            >
              ✕
            </button>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-red-900/50 border border-red-500/60 p-3.5 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div className="space-y-1.5">
              <label className="text-emerald-200 font-bold">Firma Ticari Unvanı *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Örn: ABC Demir Çelik San. A.Ş."
                className="w-full rounded-xl border border-emerald-500/40 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-emerald-200 font-bold">Yetkili Ad Soyad &amp; Unvan *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Örn: Mehmet Yılmaz (İhracat Müdürü)"
                className="w-full rounded-xl border border-emerald-500/40 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-emerald-200 font-bold">Kurumsal E-posta *</label>
              <input
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="Örn: mehmet@firma.com"
                className="w-full rounded-xl border border-emerald-500/40 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-emerald-200 font-bold">Telefon / WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Örn: +90 532 000 0000"
                className="w-full rounded-xl border border-emerald-500/40 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-emerald-200 font-bold">Talep Edilen Hizmet Kapsamı</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: "akredite-dogrulama", label: "Akredite Doğrulayıcı Desteği" },
                { id: "beyanname-hazirlik", label: "AB İthalatçı Beyanname Paketi" },
                { id: "karbon-azaltim", label: "Emisyon Azaltım & Dekarbonizasyon" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setServiceType(opt.id)}
                  className={`rounded-xl border p-3 text-left text-xs font-bold transition-all ${
                    serviceType === opt.id
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                      : "border-white/10 bg-black/20 text-white/70 hover:bg-white/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 text-xs text-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-neutral-400">Hesaplanan Sektör:</span>{" "}
              <strong className="text-white">{sectorName}</strong>
            </div>
            <div>
              <span className="text-neutral-400">Tahmini Maliyet:</span>{" "}
              <strong className="text-emerald-400">€{formattedCost}</strong>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-white/70">
            <input
              type="checkbox"
              id="skdm-kvkk"
              checked={kvkkConsent}
              onChange={(e) => setKvkkConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-emerald-500 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
            />
            <label htmlFor="skdm-kvkk" className="cursor-pointer leading-relaxed">
              Verilerimin SKDM/CBAM danışmanlık teklifi ve teknik inceleme kapsamında işlenmesini, tarafımla e-posta ve telefon üzerinden iletişime geçilmesini kabul ediyorum (KVKK Aydınlatma Metni).
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white/80 hover:bg-white/10 transition-all"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-7 py-3.5 text-sm font-black text-brand-950 shadow-lg hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-brand-950 border-t-transparent rounded-full animate-spin" />
                  <span>İletiliyor...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Resmi Teklif Talebini Gönder</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
