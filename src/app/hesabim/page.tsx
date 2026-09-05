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
  Ship,
  Anchor,
  Compass,
  Fuel,
  FileText,
} from "lucide-react";
import { calculateSkdmLiability } from "@/lib/skdm/calculator";
import { createSealedAuditPackage } from "@/lib/skdm/package-seal";
import { PLATFORM_STATS } from "@/lib/skdm/constants";
import { SEALED_PACKAGE_FILES } from "@/lib/skdm/package-manifest";
import { KopyalaButonu } from "@/components/ui/KopyalaButonu";
import { PUBLIC_EXAMPLE_PACKAGES } from "@/lib/skdm/public-example-packages";
import { buildTestSeedHistory } from "@/lib/skdm/test-user-packages";
import {
  buildTestMaritimeSeedHistory,
  downloadTestMaritimeZip,
  downloadTestMaritimeFile,
  type TestMaritimeSeedHistoryItem,
} from "@/lib/maritime/test-user-dossiers";


function triggerBrowserDownload(
  bytes: Uint8Array,
  filename: string,
  mimeType: string
) {
  const safeBytes = new Uint8Array(bytes);
  const blob = new Blob([safeBytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function HesabimPage() {
  const router = useRouter();
  const { user, profile, loading, history, logout, updateCompanyDetails } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [vkn, setVkn] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Denizcilik Karbon Uyumu Durumları
  const [activeTab, setActiveTab] = useState<"cbam" | "maritime">("cbam");
  const [maritimeHistory, setMaritimeHistory] = useState<TestMaritimeSeedHistoryItem[]>([]);
  const [maritimeExpandedId, setMaritimeExpandedId] = useState<string | null>(null);

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

  useEffect(() => {
    let initialMaritime: TestMaritimeSeedHistoryItem[] = [];
    if (user?.email === "teb232@gmail.com" || user?.email?.includes("teb")) {
      initialMaritime = buildTestMaritimeSeedHistory();
    }
    try {
      const storageKey = user?.uid ? `maritime_history_${user.uid}` : "maritime_history_anonymous";
      const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (saved) {
        const parsed = JSON.parse(saved) as TestMaritimeSeedHistoryItem[];
        const combined = [...parsed, ...initialMaritime.filter((m) => !parsed.some((p) => p.packageId === m.packageId))];
        setMaritimeHistory(combined);
      } else {
        setMaritimeHistory(initialMaritime);
      }
    } catch {
      setMaritimeHistory(initialMaritime);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#denizcilik") {
      setActiveTab("maritime");
    }
  }, []);

  const handleDownloadMaritimeZip = (item: TestMaritimeSeedHistoryItem) => {
    try {
      const ok = downloadTestMaritimeZip(item.packageId);
      if (ok) {
        notify(`${item.shipName} Mühürlü Denizcilik Paketi (.ZIP) başarıyla indirildi.`);
      } else {
        notify("Paket bulunamadı.");
      }
    } catch (err) {
      console.error(err);
      notify("İndirme sırasında bir hata oluştu.");
    }
  };

  const handleDownloadMaritimeFile = (item: TestMaritimeSeedHistoryItem, filename: string) => {
    try {
      const ok = downloadTestMaritimeFile(item.packageId, filename);
      if (ok) {
        notify(`${filename} başarıyla indirildi.`);
      } else {
        notify("Dosya bulunamadı.");
      }
    } catch (err) {
      console.error(err);
      notify("Dosya indirme hatası.");
    }
  };

  const slugToSectorId = (slug: string) => {
    if (slug === "aluminyum") return "aluminum";
    if (slug === "cimento") return "cement";
    return "iron-steel";
  };

  const handleDownloadZip = (item: SealedHistoryItem) => {
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
            cn: item.sectorSlug === "aluminyum" ? "7601 10 10" : "7208 39 00",
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
          vFirma: profile?.companyName || "Beyan Edilmiş Tesis",
          vkn: profile?.vkn || "",
          tesisAdiEN: "Declared Facility",
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

  const handleDownloadFile = (_packageId: string, _filename: string) => {
    notify("Tekil dosya indirme sunucu paket altyapısına taşınıyor. ZIP paketini kullanın.");
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
  const effectiveCbamHistory = history.length > 0 ? history : (user?.email === "teb232@gmail.com" || user?.email?.includes("teb") ? buildTestSeedHistory() : []);

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
                <span>{PLATFORM_STATS.fileCount} parçalı mühür garantisi</span>
              </h3>
              <p className="text-xs font-medium leading-relaxed text-brand-950">
                Mühürlediğiniz tüm denetime hazırlık paketleri, {PLATFORM_STATS.fileCount} dosya + SHA-256
                bütünlük izi ile arşivlenir. Dilediğiniz zaman paketinizi yeniden indirebilir ve alıcınızla
                paylaşabilirsiniz.
              </p>
            </div>
          </div>

          {/* SAĞ SÜTUN: MÜHÜRLÜ DOSYALAR & ARŞİV */}
          <div className="lg:col-span-2 space-y-6" id="dosyalarim">
            <div className="rounded-3xl border-2 border-line bg-white p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold text-ink-900">
                    {activeTab === "cbam" ? "Mühürlü SKDM Dosyalarım" : "Denizcilik Karbon Uyum Dosyalarım"}
                  </h2>
                  <p className="text-xs text-ink-600 font-medium">
                    {activeTab === "cbam"
                      ? `SHA-256 dijital imzalı denetime hazırlık paketleriniz (${effectiveCbamHistory.length} dosya)`
                      : `EU ETS, FuelEU Maritime ve EMSA THETIS-MRV denetim paketleriniz (${maritimeHistory.length} gemi / dosya)`}
                  </p>
                </div>

                {/* Sekme Butonları */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("cbam")}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      activeTab === "cbam"
                        ? "bg-brand-900 text-white shadow-xs"
                        : "border border-line bg-white text-ink-700 hover:bg-neutral-50"
                    }`}
                  >
                    <Building className="h-3.5 w-3.5" />
                    <span>SKDM / CBAM ({effectiveCbamHistory.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("maritime")}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      activeTab === "maritime"
                        ? "bg-sky-950 text-white shadow-xs"
                        : "border border-line bg-white text-sky-950 hover:bg-sky-50"
                    }`}
                  >
                    <Ship className="h-3.5 w-3.5 text-sky-400" />
                    <span>Denizcilik ({maritimeHistory.length})</span>
                  </button>
                </div>
              </div>

              {activeTab === "cbam" ? (
                effectiveCbamHistory.length === 0 ? (
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
                    {effectiveCbamHistory.map((item) => (
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
                            <KopyalaButonu deger={item.packageId} label="Paket numarası" />
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
                            <div className="font-mono text-[11px] text-ink-800 truncate inline-flex items-center gap-1.5 w-full" title={item.masterHash}>
                              <span className="truncate">{item.masterHash || "sha256:doğrulanmış"}</span>
                              {item.masterHash && <KopyalaButonu deger={item.masterHash} label="Master SHA-256 imzası" />}
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
                              {(() => {
                                const list = SEALED_PACKAGE_FILES.map((f) => f.filename);
                                return list.map((fname) => {
                                  const meta = SEALED_PACKAGE_FILES.find((f) => f.filename === fname);
                                  return (
                                    <li
                                      key={fname}
                                      className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs"
                                    >
                                      <span className="min-w-0">
                                        <span className="block font-mono font-semibold text-ink-800 truncate">
                                          {fname}
                                        </span>
                                        {meta && (
                                          <span className="block text-[11px] text-ink-500 truncate">
                                            {meta.label}
                                          </span>
                                        )}
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
                                  );
                                });
                              })()}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* DENİZCİLİK SEKMESİ (EU ETS & FuelEU) */
                maritimeHistory.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-line bg-neutral-50/70 p-10 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-800">
                      <Ship className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-ink-900">Henüz Denizcilik Uyum Dosyanız Yok</h3>
                      <p className="text-sm text-ink-600 max-w-md mx-auto">
                        5.000 GT ve üzeri gemileriniz için AB Direktifi 2023/957 (EU ETS) ve AB Tüzüğü 2023/1805 (FuelEU Maritime)
                        uyum hazırlık paketinizi oluşturabilirsiniz.
                      </p>
                    </div>
                    <Link
                      href="/denizcilik/dosya-hazirla/"
                      className="inline-flex items-center gap-2 rounded-2xl bg-sky-900 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-sky-800 transition"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Denizcilik Dosyası Hazırla (599 USD)</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {maritimeHistory.map((item) => (
                      <div
                        key={item.packageId}
                        className="group rounded-2xl border-2 border-sky-800/30 bg-white p-5 shadow-sm transition-all hover:border-sky-700 hover:shadow-md space-y-4"
                      >
                        {/* Başlık ve Gemi Kimliği */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-mono text-sm font-extrabold text-sky-950">
                              {item.packageId}
                            </span>
                            <KopyalaButonu deger={item.packageId} label="Paket numarası" />
                            <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 text-xs font-black text-sky-950">
                              {item.shipName} (IMO: {item.imoNumber})
                            </span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                              {item.grossTonnage.toLocaleString("tr-TR")} GT · Bayrak: {item.flagState}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-ink-500">
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-900">
                              ✓ 599 USD Ödendi · Denetime Hazır
                            </span>
                            <span className="text-[11px] text-ink-500">
                              {item.sealedAt ? new Date(item.sealedAt).toLocaleDateString("tr-TR") : "Güncel"}
                            </span>
                          </div>
                        </div>

                        {/* 4 Anahtar KPI Kartı (2x2) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* 1. EU ETS EUA */}
                          <div className="rounded-xl bg-gradient-to-br from-amber-50/70 to-neutral-50 p-3 space-y-1 border border-amber-200/50">
                            <div className="text-amber-950 font-bold flex items-center gap-1">
                              <Euro className="h-3.5 w-3.5 text-amber-800" />
                              <span>EU ETS Teslimat Yükümlülüğü (%70)</span>
                            </div>
                            <div className="font-mono text-base font-extrabold text-amber-950">
                              {item.surrenderEua.toLocaleString("tr-TR")} EUA (~€{item.estimatedEtsCostEur.toLocaleString("tr-TR")})
                            </div>
                            <div className="text-[11px] text-ink-600">
                              Sefer: {item.routeSummary} · {item.annualVoyages} Sefer/Yıl
                            </div>
                          </div>

                          {/* 2. FuelEU Maritime */}
                          <div className="rounded-xl bg-gradient-to-br from-emerald-50/70 to-neutral-50 p-3 space-y-1 border border-emerald-200/50">
                            <div className="text-emerald-950 font-bold flex items-center gap-1">
                              <Fuel className="h-3.5 w-3.5 text-emerald-800" />
                              <span>FuelEU Maritime Yoğunluğu</span>
                            </div>
                            <div className="font-mono text-base font-extrabold text-emerald-950">
                              {item.actualGhgIntensity} gCO₂eq/MJ
                            </div>
                            <div className="text-[11px] text-emerald-900 font-semibold">
                              Hedef: {item.fuelEuTargetIntensity} · {item.isFuelEuCompliant ? "0 EUR Ceza (Uyumlu)" : "Ceza Riski"}
                            </div>
                          </div>

                          {/* 3. Atanan Otorite */}
                          <div className="rounded-xl bg-neutral-50 p-3 space-y-1">
                            <div className="text-ink-600 font-semibold flex items-center gap-1">
                              <Building className="h-3.5 w-3.5 text-ink-700" />
                              <span>Atanan AB Yönetici Otoritesi</span>
                            </div>
                            <div className="font-bold text-ink-900 text-xs truncate">
                              {item.administeringAuthority}
                            </div>
                            <div className="text-[11px] text-ink-500">
                              İşletmeci: {item.companyName}
                            </div>
                          </div>

                          {/* 4. Akredite Doğrulayıcı & SHA-256 */}
                          <div className="rounded-xl bg-neutral-50 p-3 space-y-1">
                            <div className="text-ink-600 font-semibold flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5 text-ink-700" />
                              <span>Akredite Doğrulayıcı &amp; İmza</span>
                            </div>
                            <div className="font-bold text-ink-900 text-xs truncate">
                              {item.verifierName}
                            </div>
                            <div className="font-mono text-[11px] text-ink-700 truncate inline-flex items-center gap-1 w-full" title={item.masterHash}>
                              <span className="truncate">{item.masterHash}</span>
                              <KopyalaButonu deger={item.masterHash} label="Kök SHA-256 imzası" />
                            </div>
                          </div>
                        </div>

                        {/* Alt Butonlar ve İndirmeler */}
                        <div className="flex flex-col gap-3 pt-1">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="text-xs text-ink-600 font-medium">
                              ✓ 6 Dosyalı Mühürlü Denizcilik Paketi (PDF TR &amp; EN, THETIS XML, FuelEU JSON, Sefer CSV, Manifesto)
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setMaritimeExpandedId(maritimeExpandedId === item.packageId ? null : item.packageId)
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-line bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-ink-800 hover:bg-neutral-50 transition"
                              >
                                <FileCheck className="h-4 w-4 text-sky-800" />
                                <span>
                                  {maritimeExpandedId === item.packageId ? "Dosyaları Gizle" : "Tekil Dosyalar (6)"}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadMaritimeZip(item)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-sky-950 transition active:scale-95"
                              >
                                <Download className="h-4 w-4" />
                                <span>Mühürlü Paketi İndir (.ZIP)</span>
                              </button>
                            </div>
                          </div>

                          {/* 6 Tekil Dosya Listesi */}
                          {maritimeExpandedId === item.packageId && (
                            <ul className="rounded-xl border border-sky-800/20 bg-sky-50/40 divide-y divide-sky-800/10">
                              {[
                                {
                                  name: `${item.shipName.replace(/[^a-zA-Z0-9]/g, "_")}_EU_Uyum_Raporu_${item.reportingYear}_TR.pdf`,
                                  label: "Pro Uyum Raporu (TR PDF) — Türkçe Genişletilmiş Denetim Raporu",
                                  icon: FileText,
                                },
                                {
                                  name: `${item.shipName.replace(/[^a-zA-Z0-9]/g, "_")}_EU_Compliance_Report_${item.reportingYear}_EN.pdf`,
                                  label: "Compliance Dossier (EN PDF) — Official English Auditor Package",
                                  icon: FileText,
                                },
                                {
                                  name: `THETIS_MRV_${item.imoNumber}_${item.reportingYear}.xml`,
                                  label: "THETIS-MRV Part B-C XML — EMSA IR 2023/2449 Şeması v2",
                                  icon: FileCheck,
                                },
                                {
                                  name: `FUELEU_MARITIME_${item.imoNumber}_${item.reportingYear}.json`,
                                  label: "FuelEU Maritime JSON — IR 2024/2027 Uyum Bakiyesi ve Enerji Dengesi",
                                  icon: Fuel,
                                },
                                {
                                  name: `SEFER_VE_BDN_KUTUGU_${item.imoNumber}_${item.reportingYear}.csv`,
                                  label: "Sefer & BDN Kütüğü (CSV) — RFC 4180 UTF-8 BOM Liman ve Bunker Çizelgesi",
                                  icon: Compass,
                                },
                                {
                                  name: `BUTUNLUK_MANIFESTOSU_${item.imoNumber}_${item.reportingYear}.json`,
                                  label: "Bütünlük Manifestosu (JSON) — SHA-256 Kriptografik Kök İmzaları",
                                  icon: ShieldCheck,
                                },
                              ].map((f) => {
                                const IconComponent = f.icon;
                                return (
                                  <li
                                    key={f.name}
                                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs hover:bg-sky-100/40 transition"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <IconComponent className="h-4 w-4 text-sky-800 shrink-0" />
                                      <div className="min-w-0">
                                        <span className="block font-mono font-semibold text-ink-900 truncate">
                                          {f.name}
                                        </span>
                                        <span className="block text-[11px] text-ink-600 truncate">
                                          {f.label}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadMaritimeFile(item, f.name)}
                                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white border border-line px-2.5 py-1.5 font-bold text-sky-900 hover:bg-sky-50 transition shadow-2xs"
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                      <span>İndir</span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

        {/* PUBLIC / SANITIZED EXAMPLES — kullanıcı geçmişinden tamamen ayrıdır */}
        <section className="mx-auto max-w-5xl px-5 sm:px-6 mt-10">
          <div className="rounded-3xl border-2 border-line bg-white p-6 sm:p-7 shadow-sm">
            <div className="mb-6">
              <div className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-900">
                Örnek Veri
              </div>

              <h2 className="mt-3 text-xl font-extrabold text-ink-900">
                Örnek Paketler
              </h2>

              <p className="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-ink-600">
                Bunlar hesabınıza ait kayıtlar değildir. Sistemin çalışma mantığını
                göstermek amacıyla hazırlanmış sentetik ve sadeleştirilmiş örneklerdir.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {PUBLIC_EXAMPLE_PACKAGES.map((example) => (
                <div
                  key={example.id}
                  className="flex flex-col rounded-2xl border border-line bg-[#f8fbf9] p-5"
                >
                  <div className="text-xs font-black uppercase tracking-wide text-brand-800">
                    Örnek Paket
                  </div>

                  <h3 className="mt-2 text-base font-extrabold text-ink-900">
                    {example.title}
                  </h3>

                  <div className="mt-1 text-xs font-bold text-ink-600">
                    {example.sector} · {example.scenario}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-ink-700">
                    {example.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {example.coverage.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs font-semibold text-ink-700"
                      >
                        <span aria-hidden="true">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/basla/"
                    className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-xl border-2 border-brand-800 px-4 text-sm font-bold text-brand-800 transition hover:bg-brand-50"
                  >
                    Benzer Çalışma Başlat
                  </Link>

                  <p className="mt-3 text-center text-[11px] font-semibold text-ink-500">
                    Sentetik örnek · gerçek müşteri veya hesaplama verisi içermez
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

    </article>
  );
}
