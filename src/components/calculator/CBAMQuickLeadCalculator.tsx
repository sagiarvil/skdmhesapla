"use client";

import React, { useState } from 'react';
import gtipMatrix from '@/data/gtip_lead_matrix.json';

interface LeadData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  kvkkConsent: boolean;
}

export default function CBAMQuickLeadCalculator() {
  const [selectedGtip, setSelectedGtip] = useState<string>('7208');
  const [tonnage, setTonnage] = useState<number>(500);
  const [lead, setLead] = useState<LeadData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    kvkkConsent: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  const activeItem = (gtipMatrix as any)[selectedGtip] || (gtipMatrix as any)['7208'];
  const estimatedEmission = Math.round(tonnage * activeItem.factor);
  const estimatedTaxEur = Math.round(estimatedEmission * activeItem.default_price_eur);

  // Telefon maskeleme
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);
    
    // 05XX XXX XX XX formatı
    let formatted = val;
    if (val.length > 4 && val.length <= 7) {
      formatted = val.slice(0, 4) + ' ' + val.slice(4);
    } else if (val.length > 7 && val.length <= 9) {
      formatted = val.slice(0, 4) + ' ' + val.slice(4, 7) + ' ' + val.slice(7);
    } else if (val.length > 9) {
      formatted = val.slice(0, 4) + ' ' + val.slice(4, 7) + ' ' + val.slice(7, 9) + ' ' + val.slice(9, 11);
    }
    setLead({ ...lead, phone: formatted });
  };

  // Kurumsal e-posta ipucu
  const isFreeMail = /@(gmail|hotmail|yahoo|outlook|yandex)\./i.test(lead.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!lead.companyName || !lead.contactName || !lead.email || !lead.phone) {
      setErrorMsg('Lütfen tüm zorunlu alanları eksiksiz doldurunuz.');
      return;
    }

    if (!lead.kvkkConsent) {
      setErrorMsg('Devam etmek için KVKK Aydınlatma Metnini onaylamanız gerekmektedir.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/leads/cbam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          gtip: selectedGtip,
          tonnage,
          estimatedEmission,
          estimatedTaxEur,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'İşlem sırasında bir hata oluştu.');
      }

      setLeadId(data.leadId);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Sunucuya bağlanırken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto my-14 p-6 sm:p-10 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Arka Plan Glow Efekti */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/30 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          2026 AB SKDM Kurumsal Risk Simülasyonu
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          AB İhracat Karbon Vergisi & Tesis Ön Uyum Motoru
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-3">
          GTİP bazlı doğrulanmış emisyon katsayıları ve 85€/tCO₂e AB ETS gösterge fiyatı ile tahmini maliyet yükünüzü hesaplayın.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sol Kolon: Simülatör Parametreleri */}
        <div className="lg:col-span-6 bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700/80 backdrop-blur-md space-y-6 shadow-lg">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              GTİP / Sektör Sınıfı
            </label>
            <select
              value={selectedGtip}
              onChange={(e) => setSelectedGtip(e.target.value)}
              className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-medium text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            >
              {Object.entries(gtipMatrix).map(([gtip, val]: [string, any]) => (
                <option key={gtip} value={gtip}>
                  {gtip} — {val.name} ({val.sector})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Doğrulanmış AB Varsayılan Faktörü: <strong className="text-emerald-400">{activeItem.factor} tCO₂e/ton</strong>
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Yıllık AB İhracat Tonajı
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="50000"
                  value={tonnage}
                  onChange={(e) => setTonnage(Math.max(10, Number(e.target.value)))}
                  className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-sm text-right font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">Ton</span>
              </div>
            </div>
            <input
              type="range"
              min="50"
              max="10000"
              step="50"
              value={tonnage}
              onChange={(e) => setTonnage(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>50 Ton</span>
              <span>5.000 Ton</span>
              <span>10.000+ Ton</span>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-700/80 space-y-3.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Hesaplanan Gömülü Emisyon:</span>
              <span className="font-bold text-white text-base">{estimatedEmission.toLocaleString('tr-TR')} tCO₂e</span>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent border border-emerald-500/30 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  Tahmini 2026 SKDM Yükü:
                </span>
                <span className="text-[11px] text-slate-400">AB ETS 85€ benchmark üzerinden</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                €{estimatedTaxEur.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Premium Kurumsal Lead Formu */}
        <div className="lg:col-span-6 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-black border border-emerald-500/40 animate-bounce">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Rapor Talebiniz Onaylandı</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                <strong className="text-white">{lead.companyName}</strong> için oluşturulan{' '}
                <span className="text-emerald-400 font-mono">#{leadId}</span> referanslı resmi SKDM Ön Denetim Dosyası, uzman karbon mühendislerimiz tarafından incelenerek iletilecektir.
              </p>
              <div className="pt-4">
                <span className="inline-block px-3 py-1 bg-slate-800 text-[11px] text-slate-300 rounded-lg border border-slate-700">
                  SLA: En geç 1 iş günü içinde yanıt
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📑</span> Tesis Ön SKDM Analiz Raporunu İndir
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Gerçek tesis verilerinizle elektrik muafiyeti, dolaylı emisyon indirimi ve gümrük beyan dosyanızı ücretsiz hazırlayalım.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span> {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Şirket Resmi Ünvanı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kroman Çelik Sanayi A.Ş."
                  value={lead.companyName}
                  onChange={(e) => setLead({ ...lead, companyName: e.target.value })}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Yetkili Adı Soyadı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ad Soyad"
                    value={lead.contactName}
                    onChange={(e) => setLead({ ...lead, contactName: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kurumsal E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ad@sirket.com"
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {isFreeMail && (
                    <p className="text-[10px] text-amber-400 mt-1">
                      ℹ️ Kurumsal analiz için şirket alan adlı e-posta tercih edilir.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0 (5XX) XXX XX XX"
                  value={lead.phone}
                  onChange={handlePhoneChange}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="kvkkConsent"
                  checked={lead.kvkkConsent}
                  onChange={(e) => setLead({ ...lead, kvkkConsent: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="kvkkConsent" className="text-[11px] text-slate-400 cursor-pointer leading-tight">
                  <a href="/kvkk-aydinlatma" target="_blank" className="text-emerald-400 underline hover:text-emerald-300">
                    KVKK Aydınlatma Metnini
                  </a>{' '}
                  okudum. İhracat karbon analizi ve resmi bilgilendirme amacıyla iletişim kurulmasını onaylıyorum.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Rapor Hazırlanıyor...</span>
                  </>
                ) : (
                  <span>Resmi SKDM Ön Analiz Dosyasını İndir →</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
