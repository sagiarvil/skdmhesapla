"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  FileCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Info,
  Layers,
  Mail,
  Menu,
  Quote,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Tag,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  SOZLUK_KATEGORILERI,
  SOZLUK_TERIMLERI_FINAL,
  type SozlukTerim,
} from "@/lib/skdm/content/sozluk";

interface Props {
  leafIds: string[];
}

export function SozlukIndexClient({ leafIds }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<"relevance" | "alpha" | "category">("relevance");
  const [activeLanguage, setActiveLanguage] = useState<"all" | "en" | "tr">("all");
  const [activeType, setActiveType] = useState<"all" | "deep">("all");
  const [includePatents, setIncludePatents] = useState(false);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [savedTerms, setSavedTerms] = useState<Record<string, boolean>>({});
  const [citingTermId, setCitingTermId] = useState<string | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const leafIdSet = useMemo(() => new Set(leafIds), [leafIds]);

  const filteredTerms = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase("tr");

    return SOZLUK_TERIMLERI_FINAL.filter((t) => {
      // Category filter
      if (activeCategory !== "all" && t.kategori !== activeCategory) {
        return false;
      }

      // Detailed page filter (activeType)
      if (activeType === "deep" && !leafIdSet.has(t.id)) {
        return false;
      }

      // Language filter
      if (activeLanguage === "en" && !t.en) {
        return false;
      }
      if (activeLanguage === "tr" && !t.tr) {
        return false;
      }

      // Search query
      if (q) {
        const matchesEn = t.en?.toLocaleLowerCase("tr").includes(q);
        const matchesTr = t.tr.toLocaleLowerCase("tr").includes(q);
        const matchesTanim = t.tanim.toLocaleLowerCase("tr").includes(q);
        const matchesNerede = t.nerede.toLocaleLowerCase("tr").includes(q);
        const matchesId = t.id.toLocaleLowerCase("tr").includes(q);
        return matchesEn || matchesTr || matchesTanim || matchesNerede || matchesId;
      }

      return true;
    }).sort((a, b) => {
      if (activeSort === "alpha") {
        return (a.en || a.tr).localeCompare(b.en || b.tr, "tr");
      }
      if (activeSort === "category") {
        return a.kategori.localeCompare(b.kategori, "tr");
      }
      // default / relevance
      return 0;
    });
  }, [searchQuery, activeCategory, activeSort, activeLanguage, activeType, leafIdSet]);

  const toggleSave = (id: string) => {
    setSavedTerms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(id);
    setTimeout(() => setCopiedCitation(null), 2000);
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveSort("relevance");
    setActiveLanguage("all");
    setActiveType("all");
    setIncludePatents(false);
    setIncludeCitations(true);
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    activeCategory !== "all" ||
    activeSort !== "relevance" ||
    activeLanguage !== "all" ||
    activeType !== "all" ||
    includePatents;

  const citingTerm = SOZLUK_TERIMLERI_FINAL.find((t) => t.id === citingTermId);

  return (
    <div className="min-h-screen bg-white font-sans text-[#202124] antialiased">
      {/* Google Scholar Top Header */}
      <header className="border-b border-[#ebebeb] bg-[#f8f9fa] px-4 py-2.5 sm:px-8 sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2.5">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMenuDrawerOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full p-2 text-[#5f6368] hover:bg-[#e8eaed] transition focus:outline-none"
              aria-label="Ana menüyü aç"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <a
              href="/"
              className="flex shrink-0 items-center gap-1.5 text-[22px] tracking-tight hover:opacity-90 transition font-normal"
              title="SKDMHesapla Ana Sayfasına Dön"
            >
              <span className="font-medium text-[#4285f4]">SKDM</span>
              <span className="text-[#5f6368]">Sözlük</span>
            </a>

            {/* Search Input Bar */}
            <div className="relative max-w-[650px] flex-1">
              <div className="flex h-[42px] items-center rounded-full border border-[#dfe1e5] bg-white shadow-xs focus-within:border-transparent focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#1a73e8] hover:shadow-xs transition">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Terim ara (ör. embedded emissions, default values, de minimis)..."
                  className="w-full rounded-l-full py-2 pl-4 pr-2 text-[14px] text-[#202124] placeholder:text-[#80868b] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 text-[#70757a] hover:text-[#202124]"
                    aria-label="Aramayı temizle"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  className="flex h-[42px] w-[46px] items-center justify-center rounded-r-full bg-[#1a73e8] text-white hover:bg-[#1557b0] transition"
                  aria-label="Ara"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sub-tabs under search bar */}
          <div className="flex items-center gap-6 overflow-x-auto text-[13px] font-normal text-[#5f6368] pl-12 sm:pl-[180px]">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setActiveType("all");
              }}
              className={`pb-1 border-b-2 transition whitespace-nowrap ${
                activeCategory === "all"
                  ? "border-[#1a73e8] font-medium text-[#1a73e8]"
                  : "border-transparent hover:text-[#202124]"
              }`}
            >
              Tüm Terimler ({SOZLUK_TERIMLERI_FINAL.length})
            </button>
            {SOZLUK_KATEGORILERI.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => {
                  setActiveCategory(k.id);
                  setActiveType("all");
                }}
                className={`pb-1 border-b-2 transition whitespace-nowrap ${
                  activeCategory === k.id
                    ? "border-[#1a73e8] font-medium text-[#1a73e8]"
                    : "border-transparent hover:text-[#202124]"
                }`}
              >
                {k.ad}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Slide-out Hamburger Navigation Drawer */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in"
            onClick={() => setMenuDrawerOpen(false)}
          />

          <div className="relative z-10 flex h-full w-[300px] flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b border-[#ebebeb] px-5 py-4 bg-[#f8f9fa]">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-[#1a73e8]" />
                <span className="text-[18px] font-normal tracking-tight">
                  <span className="font-medium text-[#4285f4]">SKDM</span> <span className="text-[#5f6368]">Akademik</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMenuDrawerOpen(false)}
                className="rounded-full p-1.5 text-[#5f6368] hover:bg-[#e8eaed] transition"
                aria-label="Menüyü kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 text-[14px] text-[#3c4043] space-y-1">
              <a
                href="/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 hover:bg-[#f1f3f4] text-[#202124] font-medium transition"
              >
                <Home className="h-4 w-4 text-[#5f6368]" />
                <span>Ana Sayfa</span>
              </a>

              <a
                href="/basla/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 bg-[#e8f0fe] text-[#1a73e8] font-semibold hover:bg-[#d2e3fc] transition"
              >
                <Zap className="h-4 w-4 text-[#1a73e8]" />
                <span>SKDM Hesaplayıcı (Hemen Başla)</span>
              </a>

              <div className="border-t border-[#ebebeb] my-2" />

              <div className="px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#70757a]">
                Platform Modülleri
              </div>

              <a
                href="/nasil-calisir/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <HelpCircle className="h-4 w-4 text-[#5f6368]" />
                <span>Nasıl Çalışır?</span>
              </a>

              <a
                href="/metodoloji/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <Scale className="h-4 w-4 text-[#5f6368]" />
                <span>Metodoloji</span>
              </a>

              <a
                href="/rehber/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <BookOpen className="h-4 w-4 text-[#5f6368]" />
                <span>İhracatçı Rehberi</span>
              </a>

              <a
                href="/sozluk/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 bg-[#f1f3f4] font-medium text-[#202124] transition"
              >
                <FileText className="h-4 w-4 text-[#1a73e8]" />
                <span>SKDM Sözlüğü</span>
              </a>

              <a
                href="/mevzuat-guncellemeleri/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <Layers className="h-4 w-4 text-[#5f6368]" />
                <span>Mevzuat Güncellemeleri</span>
              </a>

              <a
                href="/tedarikci-verisi/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <Users className="h-4 w-4 text-[#5f6368]" />
                <span>Tedarikçi Veri Merkezi</span>
              </a>

              <a
                href="/fiyatlandirma/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <Tag className="h-4 w-4 text-[#5f6368]" />
                <span>Fiyatlandırma &amp; Paketler</span>
              </a>

              <a
                href="/dogrula/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <FileCheck className="h-4 w-4 text-[#5f6368]" />
                <span>Mühür Doğrulama</span>
              </a>

              <div className="border-t border-[#ebebeb] my-2" />

              <div className="px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#70757a]">
                Mevzuat &amp; İletişim
              </div>

              <a
                href="/mevzuat/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <ShieldCheck className="h-4 w-4 text-[#5f6368]" />
                <span>Resmî Mevzuat Haritası</span>
              </a>

              <a
                href="/hakkinda/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <Info className="h-4 w-4 text-[#5f6368]" />
                <span>Hakkında</span>
              </a>

              <a
                href="/iletisim/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <Mail className="h-4 w-4 text-[#5f6368]" />
                <span>İletişim</span>
              </a>
            </nav>

            <div className="border-t border-[#ebebeb] p-4 bg-[#f8f9fa]">
              <a
                href="/giris/"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#dadce0] bg-white py-2 text-xs font-semibold text-[#202124] hover:bg-[#f1f3f4] transition shadow-2xs"
              >
                <User className="h-3.5 w-3.5" />
                <span>Üye Girişi / Dosyalarım</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-8 sm:py-5">
        {/* Mobile Filter Toggle */}
        <div className="mb-4 flex items-center justify-between lg:hidden border-b border-[#ebebeb] pb-2">
          <span className="text-[12px] text-[#70757a]">
            Yaklaşık {filteredTerms.length} sonuç bulundu
          </span>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="inline-flex items-center gap-1.5 rounded border border-[#dadce0] bg-white px-2.5 py-1 text-[12px] font-medium text-[#3c4043] shadow-2xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Kategoriler &amp; Filtreler
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[180px_1fr]">
          {/* Left Sidebar (Google Scholar Exact Left Rail with red active links) */}
          <aside
            className={`text-[13px] text-[#202124] ${
              mobileSidebarOpen ? "block" : "hidden"
            } lg:block select-none`}
          >
            {/* Section 1: Kategoriler */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeCategory === "all" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Tüm kategoriler
              </button>
              {SOZLUK_KATEGORILERI.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setActiveCategory(k.id)}
                  className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                    activeCategory === k.id ? "text-[#c53929] font-normal" : "text-[#202124]"
                  }`}
                >
                  {k.ad}
                </button>
              ))}
            </div>

            <div className="border-t border-[#ebebeb] my-3" />

            {/* Section 2: Sıralama */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveSort("relevance")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeSort === "relevance" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Alakaya göre sırala
              </button>
              <button
                type="button"
                onClick={() => setActiveSort("alpha")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeSort === "alpha" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Alfabetik sırala
              </button>
            </div>

            <div className="border-t border-[#ebebeb] my-3" />

            {/* Section 3: Dil / Kapsam */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveLanguage("all")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeLanguage === "all" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Herhangi bir dil
              </button>
              <button
                type="button"
                onClick={() => setActiveLanguage("tr")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeLanguage === "tr" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Yalnızca Türkçe
              </button>
              <button
                type="button"
                onClick={() => setActiveLanguage("en")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeLanguage === "en" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                İngilizce karşılığı olanlar
              </button>
            </div>

            <div className="border-t border-[#ebebeb] my-3" />

            {/* Section 4: Türler */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveType("all")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeType === "all" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Tüm terimler
              </button>
              <button
                type="button"
                onClick={() => setActiveType("deep")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeType === "deep" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Detaylı sayfaları olanlar
              </button>
            </div>

            <div className="border-t border-[#ebebeb] my-3" />

            {/* Section 5: Checkbox'lar */}
            <div className="space-y-1.5 pt-0.5 text-[13px] text-[#202124]">
              <label className="flex items-center gap-2 cursor-pointer leading-[20px]">
                <input
                  type="checkbox"
                  checked={includePatents}
                  onChange={(e) => setIncludePatents(e.target.checked)}
                  className="h-3.5 w-3.5 rounded-xs border-[#70757a] text-[#1a73e8] focus:ring-0 cursor-pointer"
                />
                <span>patentleri içer</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer leading-[20px]">
                <input
                  type="checkbox"
                  checked={includeCitations}
                  onChange={(e) => setIncludeCitations(e.target.checked)}
                  className="h-3.5 w-3.5 rounded-xs border-[#70757a] text-[#1a73e8] focus:ring-0 cursor-pointer"
                />
                <span>alıntıları</span>
              </label>
            </div>

            {isFiltered && (
              <div className="border-t border-[#ebebeb] pt-3 mt-3">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 text-[12px] text-[#c53929] hover:underline cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" /> Filtreleri temizle
                </button>
              </div>
            )}
          </aside>

          {/* Right Main Content */}
          <main className="min-w-0 max-w-[850px] space-y-6">
            {/* Scholar Stats Line */}
            <div className="text-[12px] text-[#70757a]">
              Yaklaşık <strong className="font-medium text-[#202124]">{filteredTerms.length}</strong> sonuç bulundu{" "}
              <span>(0,02 sn)</span>
            </div>

            {/* Empty State */}
            {filteredTerms.length === 0 && (
              <div className="rounded border border-[#dadce0] bg-white p-6 text-sm text-[#3c4043]">
                <p className="font-medium">Aramanızla eşleşen hiçbir sözlük terimi bulunamadı.</p>
                <div className="mt-3 text-[12px] text-[#70757a] space-y-1">
                  <p>Öneriler:</p>
                  <p>• Kelimelerin yazılışını kontrol edin.</p>
                  <p>• Sol menüden &ldquo;Tüm kategoriler&rdquo; seçeneğini deneyin.</p>
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-[#1a0dab] hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Tüm filtreleri temizle
                </button>
              </div>
            )}

            {/* Scholar Entry Items */}
            <div className="space-y-6">
              {filteredTerms.map((t) => {
                const isSaved = !!savedTerms[t.id];
                const hasLeaf = leafIdSet.has(t.id);
                const katObj = SOZLUK_KATEGORILERI.find((k) => k.id === t.kategori);

                return (
                  <article id={t.id} key={t.id} className="scroll-mt-16 text-[13px] leading-[19px]">
                    {/* Top Row: Title + Right Category Link */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h2 className="text-[17px] sm:text-[18px] leading-[22px]">
                        <span className="mr-1.5 text-[13px] font-bold text-[#5f6368]">
                          [{t.en ? "TERİM" : "KAVRAM"}]
                        </span>
                        {hasLeaf ? (
                          <Link
                            href={`/sozluk/${t.id}/`}
                            className="font-normal text-[#1a0dab] hover:underline visited:text-[#609]"
                          >
                            {t.en ? `${t.en} (${t.tr})` : t.tr}
                          </Link>
                        ) : (
                          <a
                            href={`#${t.id}`}
                            className="font-normal text-[#1a0dab] hover:underline visited:text-[#609]"
                          >
                            {t.en ? `${t.en} → ${t.tr}` : t.tr}
                          </a>
                        )}
                      </h2>

                      {/* Right side tag */}
                      <span className="shrink-0 text-[13px] text-[#1a0dab] hover:underline flex items-center gap-1">
                        <span className="font-bold text-[#5f6368]">[SÖZLÜK]</span> {katObj?.ad || t.kategori}
                      </span>
                    </div>

                    {/* Green metadata row */}
                    <div className="mt-0.5 text-[13px] text-[#006621] leading-[18px]">
                      <span className="font-normal">Kategori: {katObj?.ad}</span>
                      <span className="text-[#70757a]"> - </span>
                      <span>Kullanım Yeri: {t.nerede}</span>
                      <span className="text-[#70757a]"> - </span>
                      <span className="text-[#5f6368]">SKDMHesapla Resmi Terimler</span>
                    </div>

                    {/* Definition snippet */}
                    <div className="mt-1.5 text-[13px] text-[#4d5156] leading-[20px]">
                      {t.tanim}
                    </div>

                    {/* Exporter Note Callout */}
                    <div className="my-2 rounded-r border-l-3 border-[#1a73e8] bg-[#f8fafd] p-2.5 text-[13px] text-[#202124]">
                      <div className="font-medium text-[#1a73e8]">
                        Mevzuat ve Kullanım Kılavuzu:
                      </div>
                      <p className="mt-0.5 text-[#3c4043] leading-[19px]">
                        {t.nerede}
                      </p>
                      {hasLeaf && (
                        <div className="mt-1.5 text-[12px]">
                          <Link
                            href={`/sozluk/${t.id}/`}
                            className="font-bold text-[#1a0dab] hover:underline"
                          >
                            Detaylı mevzuat sınırları ve örnek vaka analizi →
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Action Bottom Row */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#70757a]">
                      {/* Save / Star */}
                      <button
                        type="button"
                        onClick={() => toggleSave(t.id)}
                        className={`inline-flex items-center gap-1 hover:text-[#202124] transition cursor-pointer ${
                          isSaved ? "font-bold text-[#f29900]" : ""
                        }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${isSaved ? "fill-[#f29900]" : ""}`} />
                        {isSaved ? "Kaydedildi" : "Kaydet"}
                      </button>

                      {/* Cite / Alıntı Yap */}
                      {includeCitations && (
                        <button
                          type="button"
                          onClick={() => setCitingTermId(citingTermId === t.id ? null : t.id)}
                          className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline cursor-pointer"
                        >
                          <Quote className="h-3 w-3" />
                          Alıntı yap
                        </button>
                      )}

                      {/* Related term link */}
                      {hasLeaf && (
                        <Link
                          href={`/sozluk/${t.id}/`}
                          className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline"
                        >
                          İlgili maddeler
                        </Link>
                      )}

                      <a
                        href="/rehber/"
                        className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline"
                      >
                        Rehberde incele
                      </a>
                    </div>

                    {/* Citation Modal / Inline Panel */}
                    {citingTermId === t.id && citingTerm && (
                      <div className="mt-3 rounded border border-[#dadce0] bg-[#f8f9fa] p-4 text-[12px] text-[#202124] shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#ebebeb] pb-2 font-bold">
                          <span>Alıntı Formatı (SKDM Terminoloji):</span>
                          <button
                            type="button"
                            onClick={() => setCitingTermId(null)}
                            className="text-[#70757a] hover:text-[#202124]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 space-y-2">
                          <div className="flex items-start justify-between gap-2 rounded bg-white p-2 border border-[#ebebeb]">
                            <div className="font-mono text-[11px] text-[#3c4043] leading-relaxed select-all">
                              SKDMHesapla. &ldquo;{citingTerm.en || citingTerm.tr}: {citingTerm.tanim.slice(0, 100)}...&rdquo; <em>SKDM Resmi Terminoloji Kütüphanesi</em> (2026). https://skdmhesapla.com/sozluk/{citingTerm.id}/
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(
                                  `SKDMHesapla. "${citingTerm.en || citingTerm.tr}: ${citingTerm.tanim}" SKDM Resmi Terminoloji Kütüphanesi (2026). https://skdmhesapla.com/sozluk/${citingTerm.id}/`,
                                  citingTerm.id
                                )
                              }
                              className="shrink-0 text-[#1a73e8] hover:underline inline-flex items-center gap-1"
                            >
                              {copiedCitation === citingTerm.id ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                  <Check className="h-3 w-3" /> Kopyalandı
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5">
                                  <Copy className="h-3 w-3" /> Kopyala
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Bottom Add Term Box */}
            <div className="mt-12 rounded border border-[#dadce0] bg-[#f8f9fa] p-5 text-[13px] text-[#3c4043]">
              <div className="font-bold text-[#202124]">Aradığınız terim sözlükte yok mu?</div>
              <p className="mt-1 leading-relaxed">
                Alıcınızın yazışmasında geçen veya AB belgelerinde karşılaştığınız ve burada bulamadığınız her terimi{" "}
                <Link href="/iletisim/" className="font-medium text-[#1a0dab] hover:underline">
                  bize iletin
                </Link>
                ; tanımı 48 saat içinde sözlük indeksine eklenir.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
