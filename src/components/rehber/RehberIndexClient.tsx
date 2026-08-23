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
import { REHBER_SECTIONS_ALL as REHBER_SECTIONS, type RehberSection } from "@/lib/skdm/content/rehber";

/** Markdown linklerini [Metin](URL) ve **kalın** etiketlerini render eder. */
function RichText({ text }: { text: string }) {
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
  const parts = text.split(tokenRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
          const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (match) {
            const [, label, href] = match;
            return (
              <Link
                key={i}
                href={href}
                className="font-bold text-[#1a0dab] hover:underline underline-offset-2 transition-colors"
              >
                {label}
              </Link>
            );
          }
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-[#202124]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function kisaEtiket(title: string): string {
  const parts = title.split(" — ");
  return (parts.length > 1 ? parts[parts.length - 1] : title).trim();
}

function getCategoryForSection(sec: RehberSection): { id: string; ad: string } {
  if (sec.id === "baslangic-rotasi" || sec.id === "skdm-nedir") {
    return { id: "temel", ad: "Temel Tanım & Başlangıç" };
  }
  if (sec.id === "kapsam" || sec.id === "de-minimis" || sec.id === "kademe-b" || sec.id === "genisleme-2028") {
    return { id: "kapsam", ad: "Sektörler, GTİP & Kapsam" };
  }
  if (sec.id === "maliyet-mekanizmasi" || sec.id === "sertifika-takvimi" || sec.id === "mahsup-tr-ets" || sec.id === "varsayilan-degerler") {
    return { id: "maliyet", ad: "Fiyat, Maliyet & Takvim" };
  }
  if (sec.id === "sablon-anatomisi" || sec.id === "dogrulama" || sec.id === "beyan-sahibi" || sec.id === "cezalar" || sec.id === "sss") {
    return { id: "uygulama", ad: "Şablon, Doğrulama & İpuçları" };
  }
  return { id: "diger", ad: "Genel Rehber" };
}

const REHBER_KATEGORILERI = [
  { id: "all", ad: "Tüm Konular" },
  { id: "temel", ad: "Temel Tanım & Başlangıç" },
  { id: "kapsam", ad: "Sektörler, GTİP & Kapsam" },
  { id: "maliyet", ad: "Fiyat, Maliyet & Takvim" },
  { id: "uygulama", ad: "Şablon, Doğrulama & İpuçları" },
];

export function RehberIndexClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<"no" | "alpha">("no");
  const [activeLanguage, setActiveLanguage] = useState<"all" | "tr">("all");
  const [activeType, setActiveType] = useState<"all" | "priority">("all");
  const [includePatents, setIncludePatents] = useState(false);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [savedSections, setSavedSections] = useState<Record<string, boolean>>({});
  const [citingSectionId, setCitingSectionId] = useState<string | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase("tr");

    return REHBER_SECTIONS.filter((sec) => {
      const kat = getCategoryForSection(sec);

      // Category filter
      if (activeCategory !== "all" && kat.id !== activeCategory) {
        return false;
      }

      // Priority filter (activeType)
      if (activeType === "priority" && sec.id !== "baslangic-rotasi" && sec.id !== "skdm-nedir" && sec.id !== "kapsam") {
        return false;
      }

      // Search query
      if (q) {
        const matchesTitle = sec.title.toLocaleLowerCase("tr").includes(q);
        const matchesBody = sec.body.some((b) => b.toLocaleLowerCase("tr").includes(q));
        const matchesList = sec.list?.some((l) => l.toLocaleLowerCase("tr").includes(q)) ?? false;
        const matchesId = sec.id?.toLocaleLowerCase("tr").includes(q) ?? false;
        return matchesTitle || matchesBody || matchesList || matchesId;
      }

      return true;
    }).sort((a, b) => {
      if (activeSort === "alpha") {
        return a.title.localeCompare(b.title, "tr");
      }
      // default section order
      return REHBER_SECTIONS.indexOf(a) - REHBER_SECTIONS.indexOf(b);
    });
  }, [searchQuery, activeCategory, activeSort, activeType]);

  const toggleSave = (id: string) => {
    setSavedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(id);
    setTimeout(() => setCopiedCitation(null), 2000);
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveSort("no");
    setActiveLanguage("all");
    setActiveType("all");
    setIncludePatents(false);
    setIncludeCitations(true);
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    activeCategory !== "all" ||
    activeSort !== "no" ||
    activeLanguage !== "all" ||
    activeType !== "all" ||
    includePatents;

  const citingItem = REHBER_SECTIONS.find((s) => s.id === citingSectionId);

  return (
    <div className="pasaport-zemin-acik min-h-screen bg-[#faf6eb] font-sans text-[#202124] antialiased">
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

            {/* Logo & H1 for Registry Schema Parity */}
            <div className="flex shrink-0 items-center">
              <a
                href="/"
                className="flex items-center gap-1.5 text-[22px] tracking-tight hover:opacity-90 transition font-normal"
                title="SKDMHesapla Ana Sayfasına Dön"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo/skdm-hesapla.gif"
                  alt="SKDMHesapla Logo"
                  className="h-8 w-8 object-contain mr-1.5"
                />
                <span className="font-medium text-[#4285f4]">SKDM</span>
                <span className="text-[#5f6368]">Rehber</span>
              </a>
              <h1 className="sr-only">SKDM rehberi</h1>
            </div>

            {/* Search Input Bar */}
            <div className="relative max-w-[650px] flex-1">
              <div className="flex h-[42px] items-center rounded-full border border-[#dfe1e5] bg-white shadow-xs focus-within:border-transparent focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#1a73e8] hover:shadow-xs transition">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rehberde ara (ör. de minimis, sertifika fiyatı, TR-ETS, 10 katman)..."
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
            {REHBER_KATEGORILERI.map((k) => (
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
                {k.ad} {k.id === "all" ? `(${REHBER_SECTIONS.length})` : ""}
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
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 bg-[#f1f3f4] font-medium text-[#202124] transition"
              >
                <BookOpen className="h-4 w-4 text-[#1a73e8]" />
                <span>İhracatçı Rehberi</span>
              </a>

              <a
                href="/sozluk/"
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 hover:bg-[#f1f3f4] transition"
              >
                <FileText className="h-4 w-4 text-[#5f6368]" />
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
            Yaklaşık {filteredSections.length} rehber bölümü
          </span>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="inline-flex items-center gap-1.5 rounded border border-[#dadce0] bg-white px-2.5 py-1 text-[12px] font-medium text-[#3c4043] shadow-2xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Konular &amp; Filtreler
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[180px_1fr]">
          {/* Left Sidebar (Google Scholar Exact Left Rail with red active links) */}
          <aside
            className={`text-[13px] text-[#202124] ${
              mobileSidebarOpen ? "block" : "hidden"
            } lg:block select-none`}
          >
            {/* Section 1: Konu / Kategori */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeCategory === "all" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Tüm rehber konuları
              </button>
              {REHBER_KATEGORILERI.filter((k) => k.id !== "all").map((k) => (
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
                onClick={() => setActiveSort("no")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeSort === "no" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Bölüm sırasına göre
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
                Türkçe rehber metinleri
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
                Tüm bölümler
              </button>
              <button
                type="button"
                onClick={() => setActiveType("priority")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeType === "priority" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Öncelikli başlangıç rotaları
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
            <div className="text-[12px] text-[#70757a] border-b border-[#ebebeb] pb-2">
              Yaklaşık <strong className="font-medium text-[#202124]">{filteredSections.length}</strong> rehber kılavuzu bulundu{" "}
              <span>(0,02 sn)</span>
            </div>

            {/* Featured Decision Snippet Box */}
            <div className="rounded border border-[#dadce0] bg-[#f8fafd] p-4 text-[13px] text-[#202124]">
              <div className="font-bold text-[#1a73e8] flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>SKDM İhracatçı Karar Kılavuzu (2026 Uygulama)</span>
              </div>
              <p className="mt-1.5 text-[#3c4043] leading-relaxed">
                Bu rehber, Türk ihracatçılarının &ldquo;Alıcım benden ne istiyor ve ben ne yapmalıyım?&rdquo; sorusuna senaryo bazlı rehberlik sunar.
                GTİP sınıflandırmasından 10 katmanlı şablona, de minimis muafiyetinden TR-ETS mahsubuna kadar tüm aşamaları adım adım açıklar.
              </p>
              <div className="mt-2 text-[11px] text-[#5f6368] flex items-center gap-3">
                <Link href="/rehber/gtip-bulma/" className="text-[#1a0dab] hover:underline font-bold">
                  GTİP Bulma Rehberi →
                </Link>
                <span>·</span>
                <Link href="/sozluk/" className="text-[#1a0dab] hover:underline">
                  Resmî Terimler Sözlüğü →
                </Link>
              </div>
            </div>

            {/* Empty State */}
            {filteredSections.length === 0 && (
              <div className="rounded border border-[#dadce0] bg-white p-6 text-sm text-[#3c4043]">
                <p className="font-medium">Aramanızla eşleşen hiçbir rehber konusu bulunamadı.</p>
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
              {filteredSections.map((sec, idx) => {
                const secId = sec.id || `bolum-${idx + 1}`;
                const isSaved = !!savedSections[secId];
                const kat = getCategoryForSection(sec);

                return (
                  <article id={secId} key={secId} className="scroll-mt-16 text-[13px] leading-[19px]">
                    {/* Top Row: Title + Right Category Tag */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h2 className="text-[17px] sm:text-[18px] leading-[22px]">
                        <span className="mr-1.5 text-[13px] font-bold text-[#5f6368]">
                          [{sec.id === "baslangic-rotasi" ? "ÖNCELİK" : `BÖLÜM ${String(idx + 1).padStart(2, "0")}`}]
                        </span>
                        <a
                          href={`#${secId}`}
                          className="font-normal text-[#1a0dab] hover:underline visited:text-[#609]"
                        >
                          {sec.title}
                        </a>
                      </h2>

                      <span className="shrink-0 text-[13px] text-[#1a0dab] hover:underline flex items-center gap-1">
                        <span className="font-bold text-[#5f6368]">[REHBER]</span> {kat.ad}
                      </span>
                    </div>

                    {/* Green metadata row */}
                    <div className="mt-0.5 text-[13px] text-[#006621] leading-[18px]">
                      <span className="font-normal">{kisaEtiket(sec.title)}</span>
                      <span className="text-[#70757a]"> - </span>
                      <span>Kategori: {kat.ad}</span>
                      <span className="text-[#70757a]"> - </span>
                      <span className="text-[#5f6368]">SKDM İhracatçı Uygulama Kılavuzu (2026)</span>
                    </div>

                    {/* Paragraphs */}
                    <div className="mt-2 space-y-2 text-[13px] text-[#4d5156] leading-[20px]">
                      {sec.body.map((p, pIdx) => (
                        <p key={pIdx}>
                          <RichText text={p} />
                        </p>
                      ))}
                    </div>

                    {/* List / Callout if any */}
                    {sec.list && sec.list.length > 0 && (
                      <div className="my-2.5 rounded-r border-l-3 border-[#1a73e8] bg-[#f8fafd] p-3 text-[13px] text-[#202124]">
                        <div className="font-medium text-[#1a73e8] mb-1">
                          Mevzuat Detayları ve Uygulama Adımları:
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-[12px] text-[#3c4043] pl-1">
                          {sec.list.map((item, itemIdx) => (
                            <li key={itemIdx} className="leading-relaxed">
                              <RichText text={item} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Bottom Row */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#70757a]">
                      {/* Save / Star */}
                      <button
                        type="button"
                        onClick={() => toggleSave(secId)}
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
                          onClick={() => setCitingSectionId(citingSectionId === secId ? null : secId)}
                          className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline cursor-pointer"
                        >
                          <Quote className="h-3 w-3" />
                          Alıntı yap
                        </button>
                      )}

                      <Link
                        href="/basla/"
                        className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline"
                      >
                        Hesaplayıcıyı başlat
                      </Link>

                      <Link
                        href="/sozluk/"
                        className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline"
                      >
                        İlgili terimler
                      </Link>
                    </div>

                    {/* Citation Modal / Inline Panel */}
                    {citingSectionId === secId && citingItem && (
                      <div className="mt-3 rounded border border-[#dadce0] bg-[#f8f9fa] p-4 text-[12px] text-[#202124] shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#ebebeb] pb-2 font-bold">
                          <span>Alıntı Formatı (SKDM Rehber):</span>
                          <button
                            type="button"
                            onClick={() => setCitingSectionId(null)}
                            className="text-[#70757a] hover:text-[#202124]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 space-y-2">
                          <div className="flex items-start justify-between gap-2 rounded bg-white p-2 border border-[#ebebeb]">
                            <div className="font-mono text-[11px] text-[#3c4043] leading-relaxed select-all">
                              SKDMHesapla Rehber Masası. &ldquo;{citingItem.title}.&rdquo; <em>SKDM İhracatçı Uygulama Rehberi</em> (2026). https://skdmhesapla.com/rehber/#{citingItem.id || ""}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(
                                  `SKDMHesapla Rehber Masası. "${citingItem.title}." SKDM İhracatçı Uygulama Rehberi (2026). https://skdmhesapla.com/rehber/#${citingItem.id || ""}`,
                                  secId
                                )
                              }
                              className="shrink-0 text-[#1a73e8] hover:underline inline-flex items-center gap-1"
                            >
                              {copiedCitation === secId ? (
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

            {/* Bottom CTA Box */}
            <div className="mt-12 rounded border border-[#dadce0] bg-[#f8f9fa] p-5 text-[13px] text-[#3c4043] space-y-2">
              <div className="font-bold text-[#202124]">Dosyanızı Başlatmaya Hazır mısınız?</div>
              <p className="leading-relaxed">
                Sektörünüzü seçin veya 8 haneli GTİP kodunuzu aratarak 10 katmanlı resmi CBAM çalışma dosyanızı hemen oluşturun. Mühür öncesi tüm adımlar ücretsizdir.
              </p>
              <div className="pt-2 border-t border-[#ebebeb] flex items-center justify-between text-[12px]">
                <span>2026 Kesin Dönem AB Mevzuatı ({REHBER_SECTIONS.length} Bölüm)</span>
                <Link
                  href="/basla/"
                  className="font-bold text-[#1a0dab] hover:underline"
                >
                  Hesaplamayı Başlat →
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
