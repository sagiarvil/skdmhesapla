"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";
import { trUpper } from "@/lib/skdm/tr-locale";
import { CalculationProvenance } from "@/components/credential/CalculationProvenance";
import { PCF_SEALED_PACKAGE_FILES } from "@/lib/pcf/package-manifest";

type PaketSonuc = {
  durum: "kayitli" | "format_disi" | "kayit_yok" | null;
  paketTuru?: "pcf" | "cbam";
  paketId?: string;
  hash?: string;
  tarih?: string;
  engineVersion?: string | null;
  methodologyVersion?: string | null;
  factorRegistryVersion?: string | null;
  reportStatus?: string | null;
  dosyalar?: string[];
};

export function DogrulaConsole() {
  const [sorgu, setSorgu] = useState("");
  const [sonuc, setSonuc] = useState<PaketSonuc>({ durum: null });
  const [busy, setBusy] = useState(false);

  async function dogrula(e: React.FormEvent) {
    e.preventDefault();
    const val = sorgu.trim();
    if (!val) return;

    const isPcfId = /^PCF-SEAL-\d{8}-[A-F0-9]+$/i.test(val);
    const isSealId = /^SEAL-\d+-[A-F0-9]+$/i.test(val);
    const isSha256 = /^(sha256:)?[a-f0-9]{64}$/i.test(val);

    if (!isPcfId && !isSealId && !isSha256) {
      setSonuc({ durum: "format_disi" });
      return;
    }

    setBusy(true);
    try {
      const q = isSha256
        ? `hash=${encodeURIComponent(val)}`
        : `packageId=${encodeURIComponent(trUpper(val))}`;
      const res = await fetch(`/api/packages?${q}`);
      if (res.status === 404) {
        setSonuc({ durum: "kayit_yok", paketId: isSha256 ? undefined : trUpper(val) });
        return;
      }
      if (!res.ok) {
        setSonuc({ durum: "kayit_yok" });
        return;
      }
      const body = await res.json();
      setSonuc({
        durum: "kayitli",
        paketTuru: body.packageKind === "pcf" ? "pcf" : "cbam",
        paketId: body.packageId,
        hash: body.masterHash,
        tarih: body.createdAt
          ? new Date(body.createdAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })
          : undefined,
        engineVersion: body.engineVersion,
        methodologyVersion: body.methodologyVersion,
        factorRegistryVersion: body.factorRegistryVersion,
        reportStatus: body.reportStatus,
        dosyalar: Array.isArray(body.files) && body.files.length
          ? body.files
          : body.packageKind === "pcf"
            ? PCF_SEALED_PACKAGE_FILES.map((f) => f.filename)
            : undefined,
      });
    } catch {
      setSonuc({ durum: "kayit_yok" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#e5ecf6] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-10 px-5 sm:px-6">
        <GeriLink />

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Kriptografik Doğrulama Konsolu
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-[40px] md:text-[44px]">Mühürlü Paket Doğrulama</h1>
          <p className="text-base font-normal leading-relaxed text-ink-700 sm:text-[18px]">
            SKDMHesapla tarafından üretilen mühürlü paketlerin SHA-256 master imzasını
            kayıt defterinden teyit edebilirsiniz. Bu ekran akredite doğrulama veya gümrük kararı değildir.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-brand-800/25 bg-white p-6 shadow-xl sm:p-8 space-y-6">
          <form onSubmit={(e) => void dogrula(e)} className="space-y-4">
            <label htmlFor="dogrula-input" className="block text-base font-bold text-ink-900">
              Paket Numarası (SEAL-... / PCF-SEAL-...) veya SHA-256 Master Hash:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="dogrula-input"
                type="text"
                value={sorgu}
                onChange={(e) => setSorgu(e.target.value)}
                placeholder="Örnek: PCF-SEAL-20260817-AB12CD34 veya sha256:..."
                className="flex-1 appearance-none rounded-2xl border-2 border-brand-800/30 bg-[#f8fbf9] px-4 py-3.5 font-mono text-base font-bold text-ink-900 shadow-none outline-none ring-0 focus:border-brand-800 focus:bg-white"
                style={{ outline: "none", boxShadow: "none" }}
              />
              <button
                type="submit"
                disabled={busy}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-brand-500 px-8 text-base font-black text-brand-950 hover:bg-brand-400 shadow-md transition disabled:opacity-40"
              >
                <span>{busy ? "Sorgulanıyor…" : "Doğrula"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {sonuc.durum === "kayitli" && (
            <div className="space-y-4 rounded-2xl border-2 border-accent-green/40 bg-accent-green/10 p-6">
              <div className="flex items-center gap-2.5 text-accent-green font-black text-lg">
                <CheckCircle2 className="h-6 w-6" />
                <span>Kayıt bulundu — master hash defterde mevcut</span>
              </div>
              <div className="space-y-2 text-sm text-ink-900 font-medium">
                <div>
                  <strong>Paket türü:</strong>{" "}
                  {sonuc.paketTuru === "pcf" ? "Ürün Karbon Ayak İzi Paketi" : "SKDM / CBAM Mühürlü Paket"}
                </div>
                <div><strong>Paket Numarası:</strong> <span className="font-mono font-bold">{sonuc.paketId}</span></div>
                {sonuc.reportStatus && (
                  <div>
                    <strong>Rapor durumu:</strong>{" "}
                    {sonuc.reportStatus === "buyer_ready" ? "Buyer-ready (iç kalite kapısı)" : sonuc.reportStatus === "estimated" ? "Estimated" : sonuc.reportStatus}
                  </div>
                )}
                {sonuc.engineVersion && <div><strong>Motor:</strong> {sonuc.engineVersion}</div>}
                {sonuc.methodologyVersion && <div><strong>Metodoloji:</strong> {sonuc.methodologyVersion}</div>}
                {sonuc.factorRegistryVersion && <div><strong>Faktör kütüğü:</strong> {sonuc.factorRegistryVersion}</div>}
                <div><strong>Master İmzası:</strong> <span className="font-mono text-xs font-bold break-all">{sonuc.hash}</span></div>
                <div><strong>Mühür tarihi:</strong> <span>{sonuc.tarih}</span></div>
              </div>
              {sonuc.paketTuru === "pcf" && (
                <p className="text-xs font-medium text-ink-700">
                  Bu teyit dosya bütünlüğünü gösterir. Akredite doğrulama görüşü, ISO sertifikası, gümrük kararı veya CBAM beyanı değildir.
                </p>
              )}
              {sonuc.dosyalar && sonuc.dosyalar.length > 0 && (
                <div className="border-t border-accent-green/20 pt-4">
                  <div className="text-sm font-bold text-ink-900">Paketteki dosyalar:</div>
                  <ul className="mt-2 grid sm:grid-cols-2 gap-1.5 text-xs text-ink-700 font-mono font-medium">
                    {sonuc.dosyalar.map((f) => (
                      <li key={f} className="flex items-center gap-1.5">
                        <span className="text-accent-green font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sonuc.paketId && (
                <div className="pt-4 border-t border-accent-green/20">
                  <CalculationProvenance calculationId={sonuc.paketId} sha256={sonuc.hash} />
                </div>
              )}
            </div>
          )}

          {sonuc.durum === "kayit_yok" && (
            <div className="flex items-center gap-3 rounded-2xl border-2 border-amber-400/40 bg-amber-50 p-5 text-sm font-bold text-ink-900">
              <AlertCircle className="h-6 w-6 text-amber-700 shrink-0" />
              <span>
                Bu numara veya hash defterde bulunamadı. ZIP içindeki 07-BUTUNLUK-MANIFESTOSU.json ile karşılaştırın.
              </span>
            </div>
          )}

          {sonuc.durum === "format_disi" && (
            <div className="flex items-center gap-3 rounded-2xl border-2 border-amber-400/40 bg-amber-50 p-5 text-sm font-bold text-ink-900">
              <AlertCircle className="h-6 w-6 text-amber-700 shrink-0" />
              <span>
                Format tanınmadı. SEAL-... / PCF-SEAL-... paket numarası veya 64 karakterli SHA-256 özeti girin.
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
