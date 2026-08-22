"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  Filter,
  GraduationCap,
  Layers,
  Menu,
  Quote,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
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
  const [activeSourceType, setActiveSourceType] = useState<string>("all");
  const [activePriority, setActivePriority] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [savedSlugs, setSavedSlugs] = useState<Record<string, boolean>>({});
  const [citingSlug, setCitingSlug] = useState<string | null>(null);
  const [expandedModulesSlug, setExpandedModulesSlug] = useState<string | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Available facet counts
  const sourceTypes = useMemo(() => {
    const map = new Map<string, { type: RegulatorySourceType; label: string; count: number }>();
    for (const item of updates) {
      const cur = map.get(item.sourceType) || {
        type: item.sourceType,
        label: item.sourceTypeLabel,
        count: 0,
      };
      cur.count += 1;
      map.set(item.sourceType, cur);
    }
    return Array.from(map.values());
  }, [updates]);

  // Filtered & Sorted Updates
  const filteredUpdates = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase("tr");

    return [...updates]
      .filter((item) => {
        // Date filter
        if (activeDateFilter === "2026" && !item.officialPublishedAt.startsWith("2026")) {
          return false;
        }
        if (activeDateFilter === "aug2026" && !item.officialPublishedAt.startsWith("2026-08")) {
          return false;
        }

        // Source Type
        if (activeSourceType !== "all" && item.sourceType !== activeSourceType) {
          return false;
        }

        // Priority
        if (activePriority !== "all" && item.priority !== activePriority) {
          return false;
        }

        // Status
        if (activeStatus !== "all" && item.productStatus !== activeStatus) {
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
        // "relevance" / default by detection time
        return Date.parse(b.detectedAt) - Date.parse(a.detectedAt);
      });
  }, [
    updates,
    searchQuery,
    activeDateFilter,
    activeSort,
    activeSourceType,
    activePriority,
    activeStatus,
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
    setActiveSourceType("all");
    setActivePriority("all");
    setActiveStatus("all");
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    activeDateFilter !== "all" ||
    activeSort !== "relevance" ||
    activeSourceType !== "all" ||
    activePriority !== "all" ||
    activeStatus !== "all";

  const citingItem = updates.find((u) => u.slug === citingSlug);

  return (
    <div className="font-sans text-[#202124] antialiased">
      {/* Google Scholar Style Main Search Header */}
      <div className="border-b border-[#dadce0] bg-[#f8f9fa] px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Scholar Logo Style */}
            <div className="flex items-center gap-2 sm:mr-3">
              <GraduationCap className="h-7 w-7 text-[#1a73e8]" />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#4285f4]">
                  SKDM <span className="font-medium text-[#5f6368]">Akademi</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#70757a]">
                  Mevzuat ve Rehber İndeksi
                </span>
              </div>
            </div>

            {/* Scholar Search Input Form */}
            <div className="relative flex-1">
              <div className="flex items-center rounded-full border border-[#dfe1e5] bg-white shadow-sm hover:shadow focus-within:shadow-md focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#1a73e8] transition">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Mevzuat maddesi, rehber (örn. actual values, monitoring), veri seti veya GTİP..."
                  className="w-full rounded-l-full py-2.5 pl-5 pr-3 text-sm text-[#202124] placeholder:text-[#80868b] focus:outline-none"
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
                  className="flex h-10 w-12 items-center justify-center rounded-r-full bg-[#1a73e8] text-white hover:bg-[#1557b0] transition"
                  aria-label="Ara"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Scholar Navigation Sub-tabs */}
          <div className="mt-3 flex items-center gap-6 overflow-x-auto text-xs font-medium text-[#5f6368]">
            <button
              type="button"
              onClick={() => {
                setActiveSourceType("all");
                setActiveDateFilter("all");
              }}
              className={`pb-1 border-b-2 transition ${
                activeSourceType === "all"
                  ? "border-[#1a73e8] font-bold text-[#1a73e8]"
                  : "border-transparent hover:text-[#202124]"
              }`}
            >
              Tüm Mevzuat ve Rehberler
            </button>
            <button
              type="button"
              onClick={() => setActiveSourceType("OFFICIAL_GUIDANCE")}
              className={`pb-1 border-b-2 transition ${
                activeSourceType === "OFFICIAL_GUIDANCE"
                  ? "border-[#1a73e8] font-bold text-[#1a73e8]"
                  : "border-transparent hover:text-[#202124]"
              }`}
            >
              Komisyon Rehberleri (Guidance)
            </button>
            <button
              type="button"
              onClick={() => setActiveSourceType("OFFICIAL_DATASET")}
              className={`pb-1 border-b-2 transition ${
                activeSourceType === "OFFICIAL_DATASET"
                  ? "border-[#1a73e8] font-bold text-[#1a73e8]"
                  : "border-transparent hover:text-[#202124]"
              }`}
            >
              Resmi Veri Setleri (Default Values)
            </button>
            <button
              type="button"
              onClick={() => setActiveSourceType("OPERATIONAL_MANUAL")}
              className={`pb-1 border-b-2 transition ${
                activeSourceType === "OPERATIONAL_MANUAL"
                  ? "border-[#1a73e8] font-bold text-[#1a73e8]"
                  : "border-transparent hover:text-[#202124]"
              }`}
            >
              Registry &amp; Kullanıcı Kılavuzları
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Sidebar + Scholar Results */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Mobile Filter Toggle */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <span className="text-xs text-[#70757a]">
            Yaklaşık {filteredUpdates.length} sonuç bulundu
          </span>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#dadce0] bg-white px-3 py-1.5 text-xs font-semibold text-[#3c4043] shadow-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtreler
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
          {/* Left Sidebar (Google Scholar Classic Left Rail) */}
          <aside
            className={`space-y-6 text-xs text-[#3c4043] ${
              mobileSidebarOpen ? "block" : "hidden"
            } lg:block`}
          >
            {/* Section 1: Zaman Aralığı (Date Filter) */}
            <div className="space-y-1.5">
              <div className="font-bold text-[#202124] mb-1">Zaman aralığı</div>
              <button
                type="button"
                onClick={() => setActiveDateFilter("all")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeDateFilter === "all" ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                }`}
              >
                Her zaman
              </button>
              <button
                type="button"
                onClick={() => setActiveDateFilter("2026")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeDateFilter === "2026" ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                }`}
              >
                2026&apos;dan beri (Kesin Dönem)
              </button>
              <button
                type="button"
                onClick={() => setActiveDateFilter("aug2026")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeDateFilter === "aug2026" ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                }`}
              >
                Ağustos 2026
              </button>
            </div>

            <div className="border-t border-[#ebebeb]" />

            {/* Section 2: Sıralama Ölçütü (Sort Filter) */}
            <div className="space-y-1.5">
              <div className="font-bold text-[#202124] mb-1">Sıralama ölçütü</div>
              <button
                type="button"
                onClick={() => setActiveSort("relevance")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeSort === "relevance" ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                }`}
              >
                Alaka düzeyine göre sırala
              </button>
              <button
                type="button"
                onClick={() => setActiveSort("date")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeSort === "date" ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                }`}
              >
                Yayın tarihine göre sırala
              </button>
              <button
                type="button"
                onClick={() => setActiveSort("priority")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeSort === "priority" ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                }`}
              >
                Öncelik derecesine göre
              </button>
            </div>

            <div className="border-t border-[#ebebeb]" />

            {/* Section 3: Kaynak Türü (Source Type) */}
            <div className="space-y-1.5">
              <div className="font-bold text-[#202124] mb-1">Kaynak türü</div>
              <button
                type="button"
                onClick={() => setActiveSourceType("all")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeSourceType === "all" ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                }`}
              >
                Tüm kaynaklar ({updates.length})
              </button>
              {sourceTypes.map((st) => (
                <button
                  key={st.type}
                  type="button"
                  onClick={() => setActiveSourceType(st.type)}
                  className={`block w-full text-left py-0.5 hover:underline ${
                    activeSourceType === st.type ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                  }`}
                >
                  [{sourcePrefixMap[st.type]}] {st.label} ({st.count})
                </button>
              ))}
            </div>

            <div className="border-t border-[#ebebeb]" />

            {/* Section 4: Öncelik Seviyesi */}
            <div className="space-y-1.5">
              <div className="font-bold text-[#202124] mb-1">Kontrol önceliği</div>
              <button
                type="button"
                onClick={() => setActivePriority("all")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activePriority === "all" ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                }`}
              >
                Tümü
              </button>
              <button
                type="button"
                onClick={() => setActivePriority("P0")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activePriority === "P0" ? "font-bold text-red-700" : "text-[#1a0dab]"
                }`}
              >
                P0 — Yüksek kontrol önceliği
              </button>
              <button
                type="button"
                onClick={() => setActivePriority("P1")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activePriority === "P1" ? "font-bold text-amber-800" : "text-[#1a0dab]"
                }`}
              >
                P1 — Operasyonel kontrol
              </button>
            </div>

            <div className="border-t border-[#ebebeb]" />

            {/* Section 5: Sistem Entegrasyonu */}
            <div className="space-y-1.5">
              <div className="font-bold text-[#202124] mb-1">Sistem durumu</div>
              <button
                type="button"
                onClick={() => setActiveStatus("all")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeStatus === "all" ? "font-bold text-[#202124]" : "text-[#1a0dab]"
                }`}
              >
                Tümü
              </button>
              <button
                type="button"
                onClick={() => setActiveStatus("IMPLEMENTED")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeStatus === "IMPLEMENTED" ? "font-bold text-emerald-800" : "text-[#1a0dab]"
                }`}
              >
                SKDMHesapla&apos;ya işlendi
              </button>
              <button
                type="button"
                onClick={() => setActiveStatus("ACTION_REQUIRED")}
                className={`block w-full text-left py-0.5 hover:underline ${
                  activeStatus === "ACTION_REQUIRED" ? "font-bold text-amber-800" : "text-[#1a0dab]"
                }`}
              >
                Aksiyon / Kontrol gerekli
              </button>
            </div>

            {isFiltered && (
              <div className="border-t border-[#ebebeb] pt-3">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 font-bold text-red-700 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Filtreleri temizle
                </button>
              </div>
            )}

            {/* Scholar Sidebar Bottom Tools */}
            <div className="rounded-xl border border-[#dadce0] bg-[#f8f9fa] p-3 space-y-2 text-[11px]">
              <div className="font-bold text-[#202124] flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#1a73e8]" />
                İndeksleme İlkesi
              </div>
              <p className="text-[#5f6368] leading-relaxed">
                Tüm kayıtlar doğrudan Avrupa Komisyonu ve EUR-Lex kaynaklarına dayanır. Tespit saati ile resmi yayın tarihi ayrıştırılır.
              </p>
            </div>
          </aside>

          {/* Right Main Content (Scholar Results List) */}
          <main className="space-y-6">
            {/* Scholar Results Stats Line */}
            <div className="flex items-center justify-between text-xs text-[#70757a] border-b border-[#ebebeb] pb-2">
              <div>
                Yaklaşık <strong className="text-[#202124]">{filteredUpdates.length}</strong> sonuç bulundu{" "}
                <span className="text-[#9aa0a6]">(0,03 saniye)</span>
              </div>
              {searchQuery && (
                <div className="text-xs text-[#1a73e8]">
                  Sorgu: <strong>&ldquo;{searchQuery}&rdquo;</strong>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredUpdates.length === 0 && (
              <div className="rounded-2xl border border-[#dadce0] bg-white p-8 text-center space-y-3">
                <p className="text-sm text-[#3c4043]">
                  Aramanızla eşleşen hiçbir SKDM mevzuat belgesi bulunamadı.
                </p>
                <div className="text-xs text-[#70757a] space-y-1">
                  <p>Öneriler:</p>
                  <p>• Tüm kelimelerin doğru yazıldığından emin olun.</p>
                  <p>• Farklı veya daha genel arama terimleri deneyin.</p>
                  <p>• Sol menüdeki filtre kısıtlamalarını kaldırın.</p>
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#1a73e8] hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Tüm filtreleri temizle
                </button>
              </div>
            )}

            {/* Google Scholar Entry Cards */}
            <div className="space-y-7">
              {filteredUpdates.map((item) => {
                const isSaved = !!savedSlugs[item.slug];
                const prefix = sourcePrefixMap[item.sourceType];
                const hostname = new URL(item.sourceUrl).hostname;

                return (
                  <article
                    id={item.slug}
                    key={item.slug}
                    className="scroll-mt-20 group relative rounded-xl border border-transparent p-3 sm:p-4 hover:border-[#dadce0] hover:bg-[#fafafa] transition"
                  >
                    {/* Top Row: Title with [TAG] + Floating Source Link on the Right */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h2 className="text-lg sm:text-[19px] leading-snug">
                        <span className="mr-1.5 inline-block rounded bg-[#f1f3f4] px-1.5 py-0.5 text-xs font-bold text-[#5f6368]">
                          [{prefix}]
                        </span>
                        <a
                          href={`#${item.slug}`}
                          className="font-normal text-[#1a0dab] hover:underline visited:text-[#609]"
                        >
                          {item.title}
                        </a>
                      </h2>

                      {/* Scholar Right-Hand Source File Tag (e.g. [PDF] ec.europa.eu) */}
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-xs font-medium text-[#1a0dab] hover:underline flex items-center gap-1"
                        title={item.sourceLabel}
                      >
                        <span className="font-bold text-[#5f6368]">[{prefix}]</span> {hostname}
                        <ExternalLink className="h-3 w-3 text-[#70757a]" />
                      </a>
                    </div>

                    {/* Google Scholar Green Citation / Metadata Row */}
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[#006621]">
                      <span className="font-medium">{item.sourceLabel}</span>
                      <span className="text-[#70757a]">•</span>
                      <span>Resmî Yayın: {dateTr.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}</span>
                      <span className="text-[#70757a]">•</span>
                      <span className="text-[#5f6368]">
                        Tespit: {detectedTr.format(new Date(item.detectedAt))}
                      </span>
                      {item.legalBasis && (
                        <>
                          <span className="text-[#70757a]">•</span>
                          <span className="text-[#70757a] italic">{item.legalBasis}</span>
                        </>
                      )}
                    </div>

                    {/* Scholar Abstract / Snippet */}
                    <div className="mt-2 text-sm text-[#4d5156] leading-relaxed">
                      {item.summary}
                    </div>

                    {/* Exporter Impact Callout (Indented block) */}
                    <div className="mt-3 rounded-lg border-l-3 border-[#1a73e8] bg-[#f8fafd] p-3 text-xs sm:text-sm text-[#202124]">
                      <div className="font-bold text-[#1a73e8] mb-1 flex items-center gap-1.5">
                        <span>💡</span>
                        <span>Türk İhracatçı İçin Etki Analizi:</span>
                      </div>
                      <p className="font-medium text-[#3c4043] leading-relaxed">
                        {item.exporterImpact}
                      </p>

                      <div className="mt-2 border-t border-[#e8eaed] pt-2">
                        <span className="font-bold text-[#202124]">Kontrol adımları: </span>
                        <span className="text-[#4d5156]">{item.userActions.join(" · ")}</span>
                      </div>
                    </div>

                    {/* Scholar Action Bottom Row (Star, Citation, Related, Search) */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#70757a]">
                      {/* Save / Star */}
                      <button
                        type="button"
                        onClick={() => toggleSave(item.slug)}
                        className={`inline-flex items-center gap-1 hover:text-[#202124] transition ${
                          isSaved ? "font-bold text-[#f29900]" : ""
                        }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${isSaved ? "fill-[#f29900]" : ""}`} />
                        {isSaved ? "Kaydedildi" : "Kaydet"}
                      </button>

                      {/* Cite / Alıntı Yap */}
                      <button
                        type="button"
                        onClick={() => setCitingSlug(citingSlug === item.slug ? null : item.slug)}
                        className="inline-flex items-center gap-1 hover:text-[#202124] transition"
                      >
                        <Quote className="h-3.5 w-3.5" />
                        Alıntı yap
                      </button>

                      {/* Priority Tag */}
                      <span
                        className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                          item.priority === "P0"
                            ? "bg-red-50 text-red-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {item.priority === "P0" ? "P0 (Yüksek)" : "P1 (Operasyonel)"}
                      </span>

                      {/* Status Tag */}
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800">
                        {productStatusLabels[item.productStatus]}
                      </span>

                      {/* Affected Modules / Sürümler */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedModulesSlug(expandedModulesSlug === item.slug ? null : item.slug)
                        }
                        className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline"
                      >
                        <Layers className="h-3 w-3" />
                        Etkilenen modüller ({item.affectedModules.length})
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
                      <div className="mt-3 rounded-lg border border-[#dadce0] bg-[#f8f9fa] p-3 text-xs space-y-2">
                        <div className="font-bold text-[#202124]">Etkilenen SKDMHesapla Motor Modülleri:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.affectedModules.map((mod) => (
                            <span
                              key={mod}
                              className="rounded border border-[#dadce0] bg-white px-2 py-0.5 text-[11px] font-medium text-[#3c4043]"
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                        <div className="border-t border-[#e8eaed] pt-2 text-[#5f6368]">
                          <strong>Sistem Aksiyonları: </strong>
                          {item.requiredActions.join(" | ")}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Bottom Scholar Pagination / Disclaimer Notice */}
            <div className="border-t border-[#dadce0] pt-6 text-xs text-[#70757a] space-y-2">
              <p>
                Bu indeks, Avrupa Komisyonu ve EUR-Lex verilerini Türk CBAM ihracatçıları için sınıflandırır. Hukuki bağlayıcılık ilgili tüzük metinlerine aittir.
              </p>
              <div className="flex items-center gap-4 text-[#1a0dab]">
                <Link href="/mevzuat/" className="hover:underline">
                  Resmi Mevzuat Kaynak Haritası
                </Link>
                <Link href="/metodoloji/" className="hover:underline">
                  Hesaplama Metodolojisi
                </Link>
                <Link href="/rehber/" className="hover:underline">
                  İhracatçı Rehberi
                </Link>
                <Link href="/basla/" className="hover:underline">
                  Dosya Kontrolü Başlat
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Google Scholar Style Citation Modal */}
      {citingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl border border-[#dadce0] bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
              <h3 className="text-base font-bold text-[#202124] flex items-center gap-2">
                <Quote className="h-4 w-4 text-[#1a73e8]" />
                Alıntı yap / Kaynak Göster
              </h3>
              <button
                type="button"
                onClick={() => setCitingSlug(null)}
                className="rounded-full p-1 text-[#70757a] hover:bg-[#f1f3f4] hover:text-[#202124]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Citation Formats (APA, MLA, Harvard, Hukuki Atıf) */}
            <div className="space-y-4 text-xs">
              {/* APA */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-[#5f6368]">
                  <span>APA</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `European Commission. (${citingItem.officialPublishedAt.slice(0, 4)}). ${citingItem.title}. ${citingItem.sourceLabel}. ${citingItem.sourceUrl}`,
                        "apa",
                      )
                    }
                    className="inline-flex items-center gap-1 text-[#1a73e8] hover:underline"
                  >
                    {copiedCitation === "apa" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    {copiedCitation === "apa" ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
                <div className="rounded bg-[#f8f9fa] p-2.5 font-mono text-[#3c4043] select-all">
                  European Commission. ({citingItem.officialPublishedAt.slice(0, 4)}). {citingItem.title}. {citingItem.sourceLabel}.
                </div>
              </div>

              {/* Hukuki / Resmî Atıf */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-[#5f6368]">
                  <span>Hukuki Atıf (Official Reference)</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `${citingItem.sourceLabel}, "${citingItem.title}", Resmî Yayın: ${citingItem.officialPublishedAt}, Hukuki Dayanak: ${citingItem.legalBasis || "CBAM Tüzüğü"}. Kaynak: ${citingItem.sourceUrl}`,
                        "legal",
                      )
                    }
                    className="inline-flex items-center gap-1 text-[#1a73e8] hover:underline"
                  >
                    {copiedCitation === "legal" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    {copiedCitation === "legal" ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
                <div className="rounded bg-[#f8f9fa] p-2.5 font-mono text-[#3c4043] select-all">
                  {citingItem.sourceLabel}, &ldquo;{citingItem.title}&rdquo;, Resmî Yayın: {citingItem.officialPublishedAt}, Hukuki Dayanak: {citingItem.legalBasis || "CBAM Tüzüğü"}.
                </div>
              </div>
            </div>

            <div className="border-t border-[#dadce0] pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setCitingSlug(null)}
                className="rounded-lg bg-[#1a73e8] px-4 py-2 text-xs font-bold text-white hover:bg-[#1557b0] transition"
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
