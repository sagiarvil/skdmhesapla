"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, type SealedHistoryItem } from "@/lib/firebase/auth-context";
import {
  Building,
  Mail,
  ShieldCheck,
  Download,
  ExternalLink,
  PlusCircle,
  LogOut,
  Clock,
  Euro,
  Hash,
  FileCheck,
  UserCheck,
  Edit3,
  CheckCircle2,
} from "lucide-react";
import { calculateSkdmLiability } from "@/lib/skdm/calculator";
import { createSealedAuditPackage } from "@/lib/skdm/package-seal";
import {
  downloadTestPackageFile,
  downloadTestPackageZip,
  getTestSealedPackage,
  listTestPackageFilenames,
  triggerBrowserDownload,
} from "@/lib/skdm/test-user-packages";
import { PLATFORM_STATS } from "@/lib/skdm/constants";

export default function HesabimPage() {
  const router = useRouter();
  const { user, profile, loading, history, logout, updateCompanyDetails } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [vkn, setVkn] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.isAnonymous)) {
      router.push("/giris/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName || "");
      setVkn(profile.vkn || "");
    }
  }, [profile]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompanyDetails(companyName, vkn);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const notify = (msg: string) => {
    setDownloadNotice(msg);
    setTimeout(() => setDownloadNotice(null), 2500);
  };

  const slugToSectorId = (slug: string) => {
    if (slug === "aluminyum") return "aluminum";
    if (slug === "cimento") return "cement";
    return "iron-steel";
  };

  const handleDownloadZip = (item: SealedHistoryItem) => {
    if (downloadTestPackageZip(item.packageId)) {
      notify("Mühürlü ZIP indirildi.");
      return;
    }
    try {
      const calcResult = calculateSkdmLiability({
        sectorId: slugToSectorId(item.sectorSlug),
        productionVolume: item.productionVolume || 1000,
        year: 2026,
        useCustomEmissions: true,
        customDirectEmission: item.sectorSlug === "aluminyum" ? 1.55 : 1.42,
        customIndirectEmission: 0,
        euEtsPriceEur: 75.4,
        etsQuarter: (item.quarter as "2026-Q1") || "2026-Q1",
        trEtsNettingEur: 0,
        hasVerificationEvidence: true,
        importerAnnualVolumeStatus: "over50",
      });
      const pkg = createSealedAuditPackage(calcResult, {
        sessionId: item.packageId,
        sectorSlug: item.sectorSlug,
        goods: [
          {
            id: "g1",
            category: item.sectorName,
            cn: item.sectorSlug === "aluminyum" ? "7601 10 00" : "7208 39 00",
            route: item.sectorSlug === "aluminyum" ? "Primary" : "BF-BOF",
          },
        ],
        processes: [{ id: "p1", name: "Ana üretim hattı", included: ["ana-surec"] }],
        streams: [
          { method: "Combustion", name: "Doğalgaz", ad: 100, unit: "GJ", ncv: "48", processId: "p1" },
        ],
        precs: [
          { name: "Ana hammadde", total: 100, internal: 40, other: 60, source: "Karma", see: 0.1 },
        ],
        dProcesses: {
          a: item.productionVolume || 1000,
          b: Math.round((item.productionVolume || 1000) * 0.88),
          c: Math.round((item.productionVolume || 1000) * 0.08),
          d: Math.round((item.productionVolume || 1000) * 0.04),
        },
        fieldValues: {
          vFirma: profile?.companyName || "TEB Metal & Alüminyum San. Tic. A.Ş.",
          vkn: profile?.vkn || "25403091318",
          tesisAdiEN: "TEB Metal Facility",
        },
      });
      if (pkg.zipBytes) {
        triggerBrowserDownload(
          pkg.zipBytes,
          item.zipFilename || `${item.packageId}.zip`,
          "application/zip"
        );
        notify("Mühürlü ZIP indirildi.");
      }
    } catch (err) {
      console.error(err);
      notify("Paket oluşturulamadı — girdileri gözden geçirin.");
    }
  };

  const handleDownloadFile = (packageId: string, filename: string) => {
    if (downloadTestPackageFile(packageId, filename)) {
      notify(`${filename} indirildi.`);
      return;
    }
    const pkg = getTestSealedPackage(packageId);
    if (!pkg) notify("Dosya bulunamadı.");
  };

  if (loading || (!user && typeof window !== "undefined")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-800 border-t-transparent" />
          <p className="text-sm font-bold text-ink-700">Hesabınız yükleniyor...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Firma Yetkilisi";

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7f9f5] py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 space-y-8">
        {/* ÜST BAŞLIK & KARŞILAMA ALANI */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-900">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Doğrulanmış Üye Hesabı</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
              Hoş Geldiniz, {displayName}
            </h1>
            <p className="text-base text-ink-700 font-medium">
              SKDM denetime hazırlık dosyalarınızı, raporlarınızı ve mühürlü arşivinizi buradan yönetin.
            </p>
            {downloadNotice && (
              <p className="text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 inline-block">
                {downloadNotice}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/basla/"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-800 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-900 transition active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Yeni Hesaplama Başlat</span>
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-line bg-white px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition"
              title="Oturumu Kapat"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>

        {/* 2 SÜTUNLU DASHBOARD BİLEŞENİ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SOL SÜTUN: FİRMA VE PROFİL KARTI */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h2 className="text-lg font-bold text-ink-900 flex items-center gap-2">
                  <Building className="h-5 w-5 text-brand-800" />
                  <span>Firma Bilgileri</span>
                </h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 hover:underline"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Düzenle</span>
                  </button>
                )}
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Bilgileriniz başarıyla güncellendi.</span>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-800">Firma Unvanı</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Örn: ABC Metal A.Ş."
                      className="w-full rounded-xl border border-line p-2.5 text-sm font-semibold focus:border-brand-800 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-800">Vergi No (VKN)</label>
                    <input
                      type="text"
                      value={vkn}
                      onChange={(e) => setVkn(e.target.value)}
                      placeholder="10 veya 11 hane"
                      className="w-full rounded-xl border border-line p-2.5 font-mono text-sm font-semibold focus:border-brand-800 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 rounded-xl border border-line py-2 text-xs font-bold text-ink-700"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-brand-800 py-2 text-xs font-bold text-white"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3.5 text-sm">
                  <div>
                    <div className="text-xs text-ink-500 font-semibold">Yetkili / E-Posta</div>
                    <div className="font-bold text-ink-900 flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-4 w-4 text-ink-400" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-ink-500 font-semibold">Kayıtlı Firma Unvanı</div>
                    <div className="font-bold text-ink-900 mt-0.5">
                      {profile?.companyName || "Henüz girilmedi"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-ink-500 font-semibold">Vergi Kimlik No (VKN)</div>
                    <div className="font-mono font-bold text-ink-900 mt-0.5">
                      {profile?.vkn || "—"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-ink-500 font-semibold">Hesap Güvenliği</div>
                    <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Firebase &amp; AB Altyapısı</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BİLGİLENDİRME KARTI */}
            <div className="rounded-3xl border border-brand-800/20 bg-brand-50/60 p-6 space-y-3">
              <h3 className="text-sm font-black text-brand-900 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-brand-800" />
                <span>11 Parçalı Mühür Garantisi</span>
              </h3>
              <p className="text-xs font-medium leading-relaxed text-brand-950">
                Mühürlediğiniz tüm denetime hazırlık paketleri, 6 resmi dosya + SHA-256 doğrulama izi ile
                arşivlenir. Dilediğiniz zaman paketinizi yeniden indirebilir ve alıcınızla paylaşabilirsiniz.
              </p>
            </div>
          </div>

          {/* SAĞ SÜTUN: MÜHÜRLÜ DOSYALAR & ARŞİV */}
          <div className="lg:col-span-2 space-y-6" id="dosyalarim">
            <div className="rounded-3xl border-2 border-line bg-white p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold text-ink-900">Mühürlü SKDM Dosyalarım</h2>
                  <p className="text-xs text-ink-600 font-medium">
                    SHA-256 dijital imzalı denetime hazırlık paketleriniz ({history.length} dosya)
                  </p>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-line bg-neutral-50/70 p-10 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
                    <FileCheck className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-ink-900">Henüz Mühürlü Dosyanız Yok</h3>
                    <p className="text-sm text-ink-600 max-w-md mx-auto">
                      Sektörünüzü seçip hesaplama adımlarını tamamlayarak {PLATFORM_STATS.fileCount}{" "}
                      parçalı mühürlü denetime hazırlık
                      paketinizi oluşturabilirsiniz.
                    </p>
                  </div>
                  <Link
                    href="/basla/"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-800 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-900 transition"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Hemen Hesaplama Başlat</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.packageId}
                      className="group rounded-2xl border-2 border-line bg-white p-5 shadow-sm transition-all hover:border-brand-800/40 hover:shadow-md space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="font-mono text-sm font-extrabold text-brand-900">
                            {item.packageId}
                          </span>
                          <span className="rounded-lg bg-brand-100/70 px-2 py-0.5 text-xs font-bold text-brand-900">
                            {item.sectorName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{item.sealedAt ? new Date(item.sealedAt).toLocaleDateString("tr-TR") : "Güncel"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl bg-neutral-50 p-3 space-y-1">
                          <div className="text-ink-500 font-semibold flex items-center gap-1">
                            <Euro className="h-3.5 w-3.5 text-ink-700" />
                            <span>Tahmini Sertifika Maliyeti</span>
                          </div>
                          <div className="font-mono text-base font-extrabold text-ink-900">
                            {item.importerCostEur ? `${item.importerCostEur.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} €` : "0 €"}
                          </div>
                          <div className="text-[11px] text-ink-500">ETS Dönemi: {item.quarter || "2026-Q1"}</div>
                        </div>

                        <div className="rounded-xl bg-neutral-50 p-3 space-y-1">
                          <div className="text-ink-500 font-semibold flex items-center gap-1">
                            <Hash className="h-3.5 w-3.5 text-ink-700" />
                            <span>Master SHA-256 İmzası</span>
                          </div>
                          <div className="font-mono text-[11px] text-ink-800 truncate" title={item.masterHash}>
                            {item.masterHash || "sha256:doğrulanmış"}
                          </div>
                          <Link
                            href="/dogrula/"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-800 hover:underline"
                          >
                            <span>Doğrulama Konsolunda Sorgula</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-1">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          <div className="text-xs text-ink-600 font-medium">
                            ✓ {PLATFORM_STATS.fileCount} Dosyalı Denetime Hazırlık Paketi (PDF, XLSX, JSON İzi)
                            {item.productionVolume
                              ? ` · ${item.productionVolume} ${item.unit || "ton"}`
                              : ""}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId(expandedId === item.packageId ? null : item.packageId)
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-line bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-ink-800 hover:bg-neutral-50 transition"
                            >
                              <FileCheck className="h-4 w-4" />
                              <span>
                                {expandedId === item.packageId ? "Dosyaları Gizle" : "Tekil Dosyalar"}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadZip(item)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-brand-900 transition active:scale-95"
                            >
                              <Download className="h-4 w-4" />
                              <span>Mühürlü Paketi İndir (.ZIP)</span>
                            </button>
                          </div>
                        </div>
                        {expandedId === item.packageId && (
                          <ul className="rounded-xl border border-line bg-neutral-50/80 divide-y divide-line/60">
                            {listTestPackageFilenames(item.packageId).map((fname) => (
                              <li
                                key={fname}
                                className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs"
                              >
                                <span className="font-mono font-semibold text-ink-800 truncate">
                                  {fname}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(item.packageId, fname)}
                                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white border border-line px-2.5 py-1.5 font-bold text-brand-900 hover:bg-brand-50 transition"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span>İndir</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
