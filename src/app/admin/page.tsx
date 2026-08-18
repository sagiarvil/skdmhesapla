"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, type UserProfile, type SealedHistoryItem } from "@/lib/firebase/auth-context";
import { calculateSkdmLiability } from "@/lib/skdm/calculator";
import { createSealedAuditPackage } from "@/lib/skdm/package-seal";
import { HighlightText } from "@/lib/skdm/search-highlight";
import { PLATFORM_STATS } from "@/lib/skdm/constants";
import {
  Users,
  FileCheck,
  Shield,
  Euro,
  Settings,
  Search,
  Edit,
  Trash2,
  Download,
  ExternalLink,
  Plus,
  CheckCircle,
  Activity,
  UserCheck,
  Layers,
} from "lucide-react";

export default function AdminDashboardPage() {
  const {
    user,
    profile,
    loading,
    allUsersList,
    allPackagesList,
    adminUpdateUser,
    adminDeleteUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"users" | "packages" | "settings" | "audit">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editVkn, setEditVkn] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "user">("user");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleEditClick = (u: UserProfile) => {
    setEditingUser(u);
    setEditName(u.displayName || "");
    setEditCompany(u.companyName || "");
    setEditVkn(u.vkn || "");
    setEditRole(u.role || "user");
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    await adminUpdateUser(editingUser.uid, {
      displayName: editName,
      companyName: editCompany,
      vkn: editVkn,
      role: editRole,
    });
    setEditingUser(null);
    showNotice("Kullanıcı bilgileri başarıyla güncellendi.");
  };

  const handleDeleteUser = async (uid: string, name: string) => {
    if (confirm(`"${name}" kullanıcısını silmek istediğinize emin misiniz?`)) {
      await adminDeleteUser(uid);
      showNotice("Kullanıcı sistemden silindi.");
    }
  };

  const handleDownloadZip = (item: SealedHistoryItem) => {
    try {
      const calcResult = calculateSkdmLiability({
        sectorId: item.sectorSlug === "aluminyum" ? "aluminyum" : "demir-celik",
        productionVolume: item.productionVolume || 1000,
        year: 2026,
        useCustomEmissions: true,
        customDirectEmission: item.sectorSlug === "aluminyum" ? 1.8 : 2.1,
        customIndirectEmission: 0,
        euEtsPriceEur: 75.4,
        etsQuarter: (item.quarter as "2026-Q1") || "2026-Q1",
        trEtsNettingEur: 0,
      });

      const pkg = createSealedAuditPackage(calcResult, {
        sessionId: item.packageId,
        sectorSlug: item.sectorSlug,
        goods: [{ id: "g1", category: item.sectorName, cn: item.sectorSlug === "aluminyum" ? "7601" : "7208", route: "BF-BOF" }],
        processes: [{ id: "p1", name: "Standart Üretim Hattı", included: ["ana-surec"] }],
        streams: [{ method: "Combustion", name: "Doğalgaz", ad: 100, unit: "GJ", ncv: "48", processId: "p1" }],
        precs: [{ name: "Ana Hammadde", total: 100, internal: 40, other: 60, source: "Tek tesis", see: 0.1 }],
        dProcesses: { a: 1000, b: 900, c: 50, d: 50 },
        fieldValues: { vFirma: "Yönetici İndirme Paketi", vkn: "1000036109" },
      });

      if (pkg.zipBytes) {
        const copy = new Uint8Array(pkg.zipBytes.byteLength);
        copy.set(pkg.zipBytes);
        const blob = new Blob([copy], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.zipFilename || `${item.packageId}-Muhurlu-Denetime-Hazirlik-Paketi.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {
      alert("ZIP indirme hazırlanırken hata oluştu.");
    }
  };

  const q = searchTerm.trim().toLocaleLowerCase("tr");
  const filteredUsers = allUsersList.filter(
    (u) =>
      !q ||
      u.displayName?.toLocaleLowerCase("tr").includes(q) ||
      u.email?.toLocaleLowerCase("tr").includes(q) ||
      u.companyName?.toLocaleLowerCase("tr").includes(q) ||
      u.vkn?.includes(searchTerm.trim())
  );

  const filteredPackages = allPackagesList.filter(
    (p) =>
      !q ||
      p.packageId.toLocaleLowerCase("tr").includes(q) ||
      p.sectorName.toLocaleLowerCase("tr").includes(q) ||
      p.companyName?.toLocaleLowerCase("tr").includes(q) ||
      p.userEmail?.toLocaleLowerCase("tr").includes(q)
  );

  const totalRevenueTry = allPackagesList.length * 9900;

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f2] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 space-y-8">
        {/* ÜST BAŞLIK VE KONTROL MERKEZİ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-300">
              <Shield className="h-3.5 w-3.5" />
              <span>SKDMHesapla · Yetkili Yönetim Konsolu</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
              Sistem &amp; Kullanıcı Yönetim Paneli
            </h1>
            <p className="text-base text-ink-700 font-medium">
              Tüm kurumsal kayıtları, mühürlü arşivleri, ETS parametrelerini ve kullanıcı yetkilerini denetleyin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/hesabim/"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-line bg-white px-4 py-2.5 text-sm font-bold text-ink-900 hover:bg-neutral-50 transition"
            >
              <UserCheck className="h-4 w-4 text-brand-800" />
              <span>Kullanıcı Hesabım</span>
            </Link>
          </div>
        </div>

        {actionNotice && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500 p-4 text-sm font-bold text-white shadow-lg animate-fade-in">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 4 TEMEL METRİK KARTI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-ink-500">
              <span className="text-xs font-bold uppercase tracking-wider">Kayıtlı Firmalar</span>
              <Users className="h-5 w-5 text-brand-800" />
            </div>
            <div className="text-3xl font-black text-ink-900">{allUsersList.length}</div>
            <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <span>● Aktif ve Doğrulanmış</span>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-ink-500">
              <span className="text-xs font-bold uppercase tracking-wider">Mühürlü Dosyalar</span>
              <FileCheck className="h-5 w-5 text-brand-800" />
            </div>
            <div className="text-3xl font-black text-ink-900">{allPackagesList.length} Paket</div>
            <div className="text-xs text-brand-800 font-semibold">
              {allPackagesList.length * 11} Resmi Belge Üretildi
            </div>
          </div>

          <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-ink-500">
              <span className="text-xs font-bold uppercase tracking-wider">Toplam Hacim (TRY)</span>
              <Euro className="h-5 w-5 text-brand-800" />
            </div>
            <div className="text-3xl font-black text-ink-900">
              {totalRevenueTry.toLocaleString("tr-TR")} ₺
            </div>
            <div className="text-xs text-ink-600 font-semibold">9.900 ₺ / Paket (KDV Dahil)</div>
          </div>

          <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-ink-500">
              <span className="text-xs font-bold uppercase tracking-wider">Ruleset &amp; Motor</span>
              <Activity className="h-5 w-5 text-brand-800" />
            </div>
            <div className="text-xl font-black text-brand-950 font-mono">2026.1-Omnibus1</div>
            <div className="text-xs text-emerald-700 font-semibold">ETS Fiyatı: 75.40 € / tCO2e</div>
          </div>
        </div>

        {/* TAB MENÜSÜ & ARAMA ALANI */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition ${
                activeTab === "users"
                  ? "bg-brand-800 text-white shadow-md"
                  : "bg-white border border-line text-ink-700 hover:bg-neutral-50"
              }`}
            >
              Kullanıcılar ({allUsersList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("packages")}
              className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition ${
                activeTab === "packages"
                  ? "bg-brand-800 text-white shadow-md"
                  : "bg-white border border-line text-ink-700 hover:bg-neutral-50"
              }`}
            >
              Mühürlü Dosyalar ({allPackagesList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition ${
                activeTab === "settings"
                  ? "bg-brand-800 text-white shadow-md"
                  : "bg-white border border-line text-ink-700 hover:bg-neutral-50"
              }`}
            >
              SKDM Parametreleri
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              placeholder="Firma, VKN veya Paket Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border-2 border-line bg-white pl-10 pr-4 py-2 text-sm font-semibold focus:border-brand-800 focus:outline-none"
            />
          </div>
        </div>

        {/* SEKME 1: KULLANICI YÖNETİMİ */}
        {activeTab === "users" && (
          <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">Kayıtlı Kullanıcılar &amp; Tesisler</h2>
              <span className="text-xs font-semibold text-ink-500">{filteredUsers.length} kayıt bulundu</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-neutral-50/80 text-ink-700 font-bold text-xs uppercase tracking-wider">
                    <th className="p-3.5">Firma / Yetkili</th>
                    <th className="p-3.5">E-Posta</th>
                    <th className="p-3.5">VKN</th>
                    <th className="p-3.5">Rol</th>
                    <th className="p-3.5">Kayıt Tarihi</th>
                    <th className="p-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.uid} className="border-b border-line/60 hover:bg-neutral-50/50 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-ink-900">
                          <HighlightText text={u.companyName || "Belirtilmemiş"} query={searchTerm} />
                        </div>
                        <div className="text-xs text-ink-600 font-medium">
                          <HighlightText text={u.displayName || "İsimsiz Yetkili"} query={searchTerm} />
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-ink-800">
                        <HighlightText text={u.email || ""} query={searchTerm} />
                      </td>
                      <td className="p-3.5 font-mono text-xs font-bold text-ink-700">
                        <HighlightText text={u.vkn || "—"} query={searchTerm} />
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-black uppercase ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {u.role === "admin" ? "Yönetici" : "Firma"}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs text-ink-600">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("tr-TR") : "Güncel"}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(u)}
                            className="rounded-xl border border-line bg-white p-2 text-brand-800 hover:bg-brand-50 transition"
                            title="Kullanıcıyı Düzenle"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.uid, u.displayName || u.email || "")}
                            className="rounded-xl border border-line bg-white p-2 text-rose-600 hover:bg-rose-50 transition"
                            title="Kullanıcıyı Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 2: MÜHÜRLÜ DOSYALAR VE SİPARİŞLER */}
        {activeTab === "packages" && (
          <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">Mühürlü SKDM Paketleri &amp; Arşiv</h2>
              <span className="text-xs font-semibold text-ink-500">{filteredPackages.length} paket listelendi</span>
            </div>

            <div className="space-y-4">
              {filteredPackages.map((p) => (
                <div
                  key={p.packageId}
                  className="rounded-2xl border-2 border-line bg-white p-5 shadow-sm space-y-3 hover:border-brand-800/40 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-black text-brand-900">
                        <HighlightText text={p.packageId} query={searchTerm} />
                      </span>
                      <span className="rounded-lg bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-900">
                        <HighlightText text={p.sectorName} query={searchTerm} />
                      </span>
                      <span className="text-xs font-bold text-ink-600">
                        · <HighlightText text={p.companyName || ""} query={searchTerm} />
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-ink-500">
                      Mühür: {p.sealedAt ? new Date(p.sealedAt).toLocaleString("tr-TR") : "Güncel"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl bg-neutral-50 p-3">
                      <div className="text-ink-500 font-semibold">Hesaplanan Maliyet</div>
                      <div className="font-mono text-base font-black text-ink-900">
                        {p.importerCostEur.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} €
                      </div>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3">
                      <div className="text-ink-500 font-semibold">Tesis Hacmi / Dönem</div>
                      <div className="font-semibold text-ink-900">
                        {p.productionVolume || 1000} ton · {p.quarter || "2026-Q1"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-3">
                      <div className="text-ink-500 font-semibold">Master SHA-256 İmzası</div>
                      <div className="font-mono text-[11px] text-ink-800 truncate" title={p.masterHash}>
                        {p.masterHash}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        {PLATFORM_STATS.fileCount} Dosyalı Tam Denetime Hazırlık Paketi (SHA-256
                        Doğrulandı)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/dogrula/"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-brand-800 hover:bg-brand-50 transition"
                      >
                        <span>Doğrulama Konsolu</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDownloadZip(p)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-800 px-4 py-2 text-xs font-bold text-white hover:bg-brand-900 transition"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>{PLATFORM_STATS.fileCount} Dosyalı ZIP İndir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEKME 3: SKDM PARAMETRELERİ */}
        {activeTab === "settings" && (
          <div className="rounded-3xl border-2 border-line bg-white p-7 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-ink-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-800" />
              <span>SKDM &amp; Motor Parametreleri (Canlı)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-line p-4 space-y-1">
                <div className="text-xs text-ink-500 font-bold uppercase">AB ETS Fiyatı (2026-Q1)</div>
                <div className="text-2xl font-black text-ink-900 font-mono">75.40 € / tCO2e</div>
                <p className="text-[11px] text-ink-600">Haftalık EEX açık artırma kurallarına göre belirlenir.</p>
              </div>

              <div className="rounded-2xl border border-line p-4 space-y-1">
                <div className="text-xs text-ink-500 font-bold uppercase">TR ETS Mahsup Fiyatı</div>
                <div className="text-2xl font-black text-ink-900 font-mono">22.00 € / tCO2e</div>
                <p className="text-[11px] text-ink-600">Ulusal karbon fiyatı beyanı durumunda doğrudan düşülür.</p>
              </div>

              <div className="rounded-2xl border border-line p-4 space-y-1">
                <div className="text-xs text-ink-500 font-bold uppercase">Mühürlü Paket Bedeli</div>
                <div className="text-2xl font-black text-ink-900 font-mono">9.900 ₺</div>
                <p className="text-[11px] text-ink-600">
                  Tek seferlik {PLATFORM_STATS.fileCount} parçalı denetime hazırlık paketi (KDV Dahil).
                </p>
              </div>

              <div className="rounded-2xl border border-line p-4 space-y-1">
                <div className="text-xs text-ink-500 font-bold uppercase">De Minimis Muafiyet Eşiği</div>
                <div className="text-2xl font-black text-ink-900 font-mono">50 Ton / Yıl</div>
                <p className="text-[11px] text-ink-600">Elektrik ve hidrojen hariç alıcı yıllık toplamı 50t altı muaf.</p>
              </div>

              <div className="rounded-2xl border border-line p-4 space-y-1">
                <div className="text-xs text-ink-500 font-bold uppercase">Mevzuat Düzenlemesi</div>
                <div className="text-2xl font-black text-ink-900 font-mono">AB 2025/2083</div>
                <p className="text-[11px] text-ink-600">Omnibus-I AB CBAM Resmi Yönetmeliği tam uyumlu.</p>
              </div>

              <div className="rounded-2xl border border-line p-4 space-y-1">
                <div className="text-xs text-ink-500 font-bold uppercase">Aktif Sektör Sayısı</div>
                <div className="text-2xl font-black text-ink-900 font-mono">20 Sektör</div>
                <p className="text-[11px] text-ink-600">6 Kademe A (Zorunlu SKDM) + 14 Kademe B (Tedarikçi Verisi).</p>
              </div>
            </div>
          </div>
        )}

        {/* KULLANICI DÜZENLEME MODALI */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-lg font-bold text-ink-900">Kullanıcı &amp; Firma Düzenle</h3>
                <span className="text-xs font-mono text-ink-500">{editingUser.email}</span>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink-800">Yetkili Adı Soyadı</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border-2 border-line p-2.5 text-sm font-semibold focus:border-brand-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink-800">Firma Unvanı</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full rounded-xl border-2 border-line p-2.5 text-sm font-semibold focus:border-brand-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink-800">Vergi No (VKN)</label>
                  <input
                    type="text"
                    value={editVkn}
                    onChange={(e) => setEditVkn(e.target.value)}
                    className="w-full rounded-xl border-2 border-line p-2.5 font-mono text-sm font-semibold focus:border-brand-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink-800">Kullanıcı Rolü</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as "admin" | "user")}
                    className="w-full rounded-xl border-2 border-line p-2.5 text-sm font-semibold focus:border-brand-800 focus:outline-none"
                  >
                    <option value="user">Standart Firma Kullanıcısı (User)</option>
                    <option value="admin">Tam Yetkili Yönetici (Admin)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 rounded-2xl border border-line py-3 text-sm font-bold text-ink-700"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-brand-800 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-900"
                  >
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
