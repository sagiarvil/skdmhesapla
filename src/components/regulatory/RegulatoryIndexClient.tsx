"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  Copy,
  ExternalLink,
  GraduationCap,
  Layers,
  Menu,
  Quote,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import type {
  RegulatoryPriority,
  RegulatoryProductStatus,
  RegulatorySourceType,
  RegulatoryUpdate,
} from "@/lib/skdm/regulatory-updates";

const dateTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

const detectedTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Istanbul",
});

const sourcePrefixMap: Record<RegulatorySourceType, string> = {
  OFFICIAL_GUIDANCE: "REHBER",
  OFFICIAL_DATASET: "VERİ SETİ",
  OPERATIONAL_MANUAL: "KILAVUZ",
  BINDING_ACT: "TÜZÜK",
};

const productStatusLabels: Record<RegulatoryProductStatus, string> = {
  IMPLEMENTED: "SKDMHesapla'ya işlendi",
  ACTION_REQUIRED: "Ürün kontrolü / aksiyon gerekli",
  MONITORING: "İzlemede",
};

interface Props {
  updates: readonly RegulatoryUpdate[];
}

export function RegulatoryIndexClient({ updates }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDateFilter, setActiveDateFilter] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<"relevance" | "date" | "priority">("relevance");
  const [activeLanguage, setActiveLanguage] = useState<"all" | "tr">("all");
  const [activeType, setActiveType] = useState<"all" | "guidance">("all");
  const [includePatents, setIncludePatents] = useState(false);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [savedSlugs, setSavedSlugs] = useState<Record<string, boolean>>({});
  const [citingSlug, setCitingSlug] = useState<string | null>(null);
  const [expandedModulesSlug, setExpandedModulesSlug] = useState<string | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filtered & Sorted Updates
  const filteredUpdates = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase("tr");

    return [...updates]
      .filter((item) => {
        // Date filter
        if (activeDateFilter === "2026" && !item.officialPublishedAt.startsWith("2026")) {
          return false;
        }
        if (activeDateFilter === "2025" && !item.officialPublishedAt.startsWith("2025")) {
          return false;
        }
        if (activeDateFilter === "2022" && parseInt(item.officialPublishedAt.slice(0, 4), 10) < 2022) {
          return false;
        }

        // Source Type Filter
        if (activeType === "guidance" && item.sourceType !== "OFFICIAL_GUIDANCE") {
          return false;
        }

        // Language Filter (tr filter focuses on turkish exporter impact)
        if (activeLanguage === "tr" && !item.exporterImpact) {
          return false;
        }

        // Search Query
        if (q) {
          const haystack = [
            item.title,
            item.shortTitle,
            item.summary,
            item.exporterImpact,
            item.sourceLabel,
            item.legalBasis || "",
            item.sourceTypeLabel,
            ...item.userActions,
            ...item.affectedModules,
          ]
            .join(" ")
            .toLocaleLowerCase("tr");
          if (!haystack.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (activeSort === "date") {
          return Date.parse(b.officialPublishedAt) - Date.parse(a.officialPublishedAt);
        }
        if (activeSort === "priority") {
          const rank: Record<RegulatoryPriority, number> = { P0: 0, P1: 1, P2: 2 };
          return rank[a.priority] - rank[b.priority];
        }
        // "relevance" / default detection order
        return Date.parse(b.detectedAt) - Date.parse(a.detectedAt);
      });
  }, [
    updates,
    searchQuery,
    activeDateFilter,
    activeSort,
    activeLanguage,
    activeType,
  ]);

  const toggleSave = (slug: string) => {
    setSavedSlugs((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(id);
    setTimeout(() => setCopiedCitation(null), 2000);
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveDateFilter("all");
    setActiveSort("relevance");
    setActiveLanguage("all");
    setActiveType("all");
    setIncludePatents(false);
    setIncludeCitations(true);
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    activeDateFilter !== "all" ||
    activeSort !== "relevance" ||
    activeLanguage !== "all" ||
    activeType !== "all" ||
    includePatents;

  const citingItem = updates.find((u) => u.slug === citingSlug);

  return (
    <div className="min-h-screen bg-white font-sans text-[#202124] antialiased">
      {/* Google Scholar Style Top Header & Navigation Bar */}
      <header className="border-b border-[#ebebeb] bg-[#f8f9fa] px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 sm:flex-row sm:items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:min-w-[180px]">
            <GraduationCap className="h-6 w-6 text-[#1a73e8]" />
            <span className="text-[20px] font-medium tracking-tight text-[#5f6368]">
              <span className="font-semibold text-[#4285f4]">SKDM</span> Akademi
            </span>
          </div>

          {/* Search Box Input Bar */}
          <div className="relative max-w-[650px] flex-1">
            <div className="flex h-[42px] items-center rounded-full border border-[#dfe1e5] bg-white shadow-xs focus-within:border-transparent focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#1a73e8] hover:shadow-xs transition">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mevzuat, rehber, default values veya konu ara..."
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

          {/* Right Header Quick Links */}
          <div className="hidden sm:flex items-center gap-4 text-[13px] font-medium text-[#1a0dab] ml-auto">
            <Link href="/mevzuat/" className="hover:underline">
              Mevzuat Haritası
            </Link>
            <Link href="/metodoloji/" className="hover:underline">
              Metodoloji
            </Link>
            <Link href="/basla/" className="rounded-md bg-[#1a73e8] px-3 py-1.5 text-white hover:bg-[#1557b0] transition font-semibold text-xs">
              Hesaplamayı Başlat
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area: Google Scholar Dimensions (Sidebar + Results) */}
      <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-8 sm:py-5">
        {/* Mobile Filter Toggle */}
        <div className="mb-4 flex items-center justify-between lg:hidden border-b border-[#ebebeb] pb-2">
          <span className="text-[12px] text-[#70757a]">
            Yaklaşık {filteredUpdates.length} sonuç bulundu
          </span>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="inline-flex items-center gap-1.5 rounded border border-[#dadce0] bg-white px-2.5 py-1 text-[12px] font-medium text-[#3c4043] shadow-2xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtreler
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[180px_1fr]">
          {/* Left Sidebar (Google Scholar Exact Left Rail Matching User Reference Image) */}
          <aside
            className={`text-[13px] text-[#202124] ${
              mobileSidebarOpen ? "block" : "hidden"
            } lg:block select-none`}
          >
            {/* Section 1: Zaman Aralığı */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveDateFilter("all")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeDateFilter === "all" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Tüm zamanlar
              </button>
              <button
                type="button"
                onClick={() => setActiveDateFilter("2026")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeDateFilter === "2026" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                2026 yılından beri
              </button>
              <button
                type="button"
                onClick={() => setActiveDateFilter("2025")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeDateFilter === "2025" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                2025 yılından beri
              </button>
              <button
                type="button"
                onClick={() => setActiveDateFilter("2022")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeDateFilter === "2022" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                2022 yılından beri
              </button>
              <button
                type="button"
                onClick={() => setActiveDateFilter("custom")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeDateFilter === "custom" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Özel aralık...
              </button>
            </div>

            <div className="border-t border-[#ebebeb] my-3" />

            {/* Section 2: Sıralama */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveSort("relevance")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeSort === "relevance" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Alakaya göre sırala
              </button>
              <button
                type="button"
                onClick={() => setActiveSort("date")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeSort === "date" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Tarihe göre sırala
              </button>
            </div>

            <div className="border-t border-[#ebebeb] my-3" />

            {/* Section 3: Dil / Kapsam */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveLanguage("all")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeLanguage === "all" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Herhangi bir dil
              </button>
              <button
                type="button"
                onClick={() => setActiveLanguage("tr")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeLanguage === "tr" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Türkçe sayfalarda ara
              </button>
            </div>

            <div className="border-t border-[#ebebeb] my-3" />

            {/* Section 4: Türler */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveType("all")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeType === "all" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Tüm türler
              </button>
              <button
                type="button"
                onClick={() => setActiveType("guidance")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline ${
                  activeType === "guidance" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Makaleleri incele
              </button>
            </div>

            <div className="border-t border-[#ebebeb] my-3" />

            {/* Section 5: Checkbox'lar (User Reference Image Exact Match) */}
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

          {/* Right Main Content: Google Scholar Result Entries */}
          <main className="min-w-0 max-w-[850px] space-y-6">
            {/* Scholar Stats Line */}
            <div className="text-[12px] text-[#70757a]">
              Yaklaşık <strong className="font-medium text-[#202124]">{filteredUpdates.length}</strong> sonuç bulundu{" "}
              <span>(0,03 sn)</span>
            </div>

            {/* Empty State */}
            {filteredUpdates.length === 0 && (
              <div className="rounded border border-[#dadce0] bg-white p-6 text-sm text-[#3c4043]">
                <p className="font-medium">Aramanızla eşleşen hiçbir SKDM mevzuat belgesi bulunamadı.</p>
                <div className="mt-3 text-[12px] text-[#70757a] space-y-1">
                  <p>Öneriler:</p>
                  <p>• Tüm kelimelerin doğru yazıldığından emin olun.</p>
                  <p>• Farklı arama terimleri veya sol menüden &ldquo;Tüm zamanlar&rdquo; seçeneğini deneyin.</p>
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

            {/* Google Scholar Entry Cards */}
            <div className="space-y-6">
              {filteredUpdates.map((item) => {
                const isSaved = !!savedSlugs[item.slug];
                const prefix = sourcePrefixMap[item.sourceType];
                const hostname = new URL(item.sourceUrl).hostname;

                return (
                  <article id={item.slug} key={item.slug} className="scroll-mt-16 text-[13px] leading-[19px]">
                    {/* Top Row: Title + Right Source Link */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h2 className="text-[17px] sm:text-[18px] leading-[22px]">
                        <span className="mr-1.5 text-[13px] font-bold text-[#5f6368]">
                          [{prefix}]
                        </span>
                        <a
                          href={`#${item.slug}`}
                          className="font-normal text-[#1a0dab] hover:underline visited:text-[#609]"
                        >
                          {item.title}
                        </a>
                      </h2>

                      {/* Scholar Right-Hand Direct Resource Link */}
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-[13px] text-[#1a0dab] hover:underline flex items-center gap-1"
                        title={item.sourceLabel}
                      >
                        <span className="font-bold text-[#5f6368]">[{prefix}]</span> {hostname}
                        <ExternalLink className="h-3 w-3 text-[#70757a]" />
                      </a>
                    </div>

                    {/* Google Scholar Green Citation / Metadata Row */}
                    <div className="mt-0.5 text-[13px] text-[#006621] leading-[18px]">
                      <span className="font-normal">{item.sourceLabel}</span>
                      <span className="text-[#70757a]"> - </span>
                      <span>Resmî Yayın: {dateTr.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}</span>
                      <span className="text-[#70757a]"> - </span>
                      <span className="text-[#5f6368]">Tespit: {detectedTr.format(new Date(item.detectedAt))}</span>
                      {item.legalBasis && (
                        <>
                          <span className="text-[#70757a]"> - </span>
                          <span className="text-[#70757a] italic">{item.legalBasis}</span>
                        </>
                      )}
                    </div>

                    {/* Scholar Abstract / Snippet */}
                    <div className="mt-1.5 text-[13px] text-[#4d5156] leading-[20px]">
                      {item.summary}
                    </div>

                    {/* Exporter Impact Callout (Indented block) */}
                    <div className="my-2 rounded-r border-l-3 border-[#1a73e8] bg-[#f8fafd] p-2.5 text-[13px] text-[#202124]">
                      <div className="font-medium text-[#1a73e8]">
                        Türk İhracatçı İçin Etki:
                      </div>
                      <p className="mt-0.5 text-[#3c4043] leading-[19px]">
                        {item.exporterImpact}
                      </p>
                      <div className="mt-1.5 text-[12px] text-[#5f6368]">
                        <strong className="text-[#202124]">Kontrol adımları: </strong>
                        {item.userActions.join(" · ")}
                      </div>
                    </div>

                    {/* Scholar Action Bottom Row (Star, Citation, Related, Search) */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#70757a]">
                      {/* Save / Star */}
                      <button
                        type="button"
                        onClick={() => toggleSave(item.slug)}
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
                          onClick={() => setCitingSlug(citingSlug === item.slug ? null : item.slug)}
                          className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline cursor-pointer"
                        >
                          <Quote className="h-3 w-3" />
                          Alıntı yap
                        </button>
                      )}

                      {/* Priority Pill */}
                      <span
                        className={`rounded px-1.5 py-0.2 text-[11px] font-medium ${
                          item.priority === "P0"
                            ? "bg-red-50 text-red-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {item.priority === "P0" ? "P0 (Yüksek Öncelik)" : "P1 (Operasyonel)"}
                      </span>

                      {/* Status Pill */}
                      <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[11px] font-medium text-emerald-800">
                        {productStatusLabels[item.productStatus]}
                      </span>

                      {/* Affected Modules */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedModulesSlug(expandedModulesSlug === item.slug ? null : item.slug)
                        }
                        className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline cursor-pointer"
                      >
                        <Layers className="h-3 w-3" />
                        İlgili maddeler / modüller ({item.affectedModules.length})
                      </button>

                      {/* Check in Dossier */}
                      <Link
                        href="/basla/"
                        className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline font-medium ml-auto"
                      >
                        Dosyanızda Kontrol Edin <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    {/* Expandable Module Drawer */}
                    {expandedModulesSlug === item.slug && (
                      <div className="mt-2.5 rounded border border-[#dadce0] bg-[#f8f9fa] p-3 text-[12px] space-y-1.5">
                        <div className="font-medium text-[#202124]">Etkilenen SKDMHesapla Motor Modülleri:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.affectedModules.map((mod) => (
                            <span
                              key={mod}
                              className="rounded border border-[#dadce0] bg-white px-2 py-0.5 text-[11px] text-[#3c4043]"
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                        <div className="border-t border-[#e8eaed] pt-1.5 text-[11px] text-[#5f6368]">
                          <strong>Sistem Aksiyonları: </strong>
                          {item.requiredActions.join(" | ")}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Bottom Footer Notice */}
            <div className="border-t border-[#dadce0] pt-4 text-[12px] text-[#70757a] space-y-1">
              <p>
                Bu indeks, Avrupa Komisyonu ve EUR-Lex verilerini Türk CBAM ihracatçıları için sınıflandırır.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[#1a0dab]">
                <Link href="/mevzuat/" className="hover:underline">
                  Resmi Kaynak Haritası
                </Link>
                <Link href="/metodoloji/" className="hover:underline">
                  Metodoloji
                </Link>
                <Link href="/rehber/" className="hover:underline">
                  İhracatçı Rehberi
                </Link>
                <Link href="/basla/" className="hover:underline">
                  Dosya Kontrolü
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Google Scholar Style Citation Modal */}
      {citingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-lg border border-[#dadce0] bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#dadce0] pb-2.5">
              <h3 className="text-[15px] font-medium text-[#202124] flex items-center gap-2">
                <Quote className="h-4 w-4 text-[#1a73e8]" />
                Alıntı yap / Kaynak Göster
              </h3>
              <button
                type="button"
                onClick={() => setCitingSlug(null)}
                className="rounded-full p-1 text-[#70757a] hover:bg-[#f1f3f4] hover:text-[#202124]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Citation Formats (APA, Hukuki Atıf) */}
            <div className="space-y-3 text-[12px]">
              {/* APA */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-medium text-[#5f6368]">
                  <span>APA</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `European Commission. (${citingItem.officialPublishedAt.slice(0, 4)}). ${citingItem.title}. ${citingItem.sourceLabel}. ${citingItem.sourceUrl}`,
                        "apa",
                      )
                    }
                    className="inline-flex items-center gap-1 text-[#1a73e8] hover:underline cursor-pointer"
                  >
                    {copiedCitation === "apa" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    {copiedCitation === "apa" ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
                <div className="rounded bg-[#f8f9fa] p-2.5 font-mono text-[11px] text-[#3c4043] select-all border border-[#ebebeb]">
                  European Commission. ({citingItem.officialPublishedAt.slice(0, 4)}). {citingItem.title}. {citingItem.sourceLabel}.
                </div>
              </div>

              {/* Hukuki / Resmî Atıf */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-medium text-[#5f6368]">
                  <span>Hukuki Atıf (Official Reference)</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `${citingItem.sourceLabel}, "${citingItem.title}", Resmî Yayın: ${citingItem.officialPublishedAt}, Hukuki Dayanak: ${citingItem.legalBasis || "CBAM Tüzüğü"}. Kaynak: ${citingItem.sourceUrl}`,
                        "legal",
                      )
                    }
                    className="inline-flex items-center gap-1 text-[#1a73e8] hover:underline cursor-pointer"
                  >
                    {copiedCitation === "legal" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    {copiedCitation === "legal" ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
                <div className="rounded bg-[#f8f9fa] p-2.5 font-mono text-[11px] text-[#3c4043] select-all border border-[#ebebeb]">
                  {citingItem.sourceLabel}, &ldquo;{citingItem.title}&rdquo;, Resmî Yayın: {citingItem.officialPublishedAt}, Hukuki Dayanak: {citingItem.legalBasis || "CBAM Tüzüğü"}.
                </div>
              </div>
            </div>

            <div className="border-t border-[#dadce0] pt-2.5 flex justify-end">
              <button
                type="button"
                onClick={() => setCitingSlug(null)}
                className="rounded bg-[#1a73e8] px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-[#1557b0] transition cursor-pointer"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
