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
  methodology,
  primaryCredential,
  GROUND_TRUTH_CLAIM,
  SCOPE_DISCLAIMER,
} from "@/lib/skdm/credential";
import { PLATFORM_STATS } from "@/lib/skdm/constants";

export interface MetodolojiBolum {
  id: string;
  no: number;
  baslik: string;
  kategori: "temel" | "emisyon" | "veri" | "guvence";
  kategoriAdi: string;
  ozet: string;
  metin: string;
  mevzuatRef?: string;
  formuller?: string[];
  maddeler?: string[];
  resmiKaynakUrl?: string;
  resmiKaynakAdi?: string;
}

const BOLUMLER: MetodolojiBolum[] = [
  {
    id: "amaci",
    no: 1,
    baslik: "Metodolojinin Amacı ve Kapsamı",
    kategori: "temel",
    kategoriAdi: "Temel İlkeler",
    ozet: "SKDMHesapla metodolojisinin temel amacı, AB CBAM mevzuatına tabi Türk ihracatçıların gömülü emisyonlarını deterministik, izlenebilir ve denetime hazır hesaplamaktır.",
    metin: "SKDMHesapla metodolojisinin temel amacı, AB CBAM mevzuatına tabi Türk ihracatçıların üretim süreçlerine ait gömülü emisyonları (Embedded Emissions) deterministik, kaynaklı, izlenebilir ve üçüncü taraf denetçilerce doğrulamaya hazır biçimde hesaplamaktır. Sonucu gizli bir kapalı kutu olarak sunmak yerine, tüm varsayımları ve kaynakları kullanıcıya gösterir.",
    mevzuatRef: "Art. 1 & Annex IV of Regulation (EU) 2023/956",
  },
  {
    id: "duzenleyici-dayanak",
    no: 2,
    baslik: "Düzenleyici Dayanak ve AB Mevzuat Hiyerarşisi",
    kategori: "temel",
    kategoriAdi: "Temel İlkeler",
    ozet: "(EU) 2023/956 Ana Tüzüğü, (EU) 2025/2083 Omnibus değişiklikleri ve (EU) 2025/2547 Kesin Dönem Uygulama Tüzüğü esas alınır.",
    metin: "Hesaplama motorumuz aşağıdaki AB mevzuat hükümleri ile birebir uyumlu olarak kurgulanmıştır:",
    maddeler: [
      "(EU) 2023/956 Tüzüğü: AB Sınırda Karbon Düzenleme Mekanizması Ana Tüzüğü.",
      "(EU) 2025/2083 Tüzüğü: CBAM sadeleştirme değişiklikleri (Omnibus).",
      "(EU) 2025/2547 Uygulama Yönetmeliği: Kesin dönem emisyon izleme, hesaplama ve raporlama kuralları.",
      "(EU) 2023/1773 Uygulama Yönetmeliği: Yalnızca tarihsel geçiş dönemi referansı olarak değerlendirilir.",
      "AB Komisyonu Tesis Rehberi (Guidance for Installation Operators): Sektörel sınır belirleme kuralları.",
    ],
    mevzuatRef: "OJ L, 2025/2547, 22.12.2025",
    resmiKaynakUrl: "https://eur-lex.europa.eu/eli/reg_impl/2025/2547/oj",
    resmiKaynakAdi: "EUR-Lex (EU) 2025/2547",
  },
  {
    id: "system-boundaries",
    no: 3,
    baslik: "Sistem Sınırları (Gate-to-Gate Yaklaşımı)",
    kategori: "temel",
    kategoriAdi: "Temel İlkeler",
    ozet: "Tesis girişinden tesis çıkışına (Gate-to-Gate) kuralı geçerlidir. Tesis içi yakıt, elektrik ve prekürsör kullanımı sınır dahilindedir.",
    metin: "Hesaplama sistem sınırları 'Gate-to-Gate' (Tesis Girişinden Tesis Çıkışına) yaklaşımını esas alır. Tesis içerisine giren ham maddelerin, yakıtların, elektriğin ve ara girdilerin tesis kapısından çıkış ürünü haline gelene kadarki sera gazı etkisi kapsanır. Nakliye veya tesis dışı kullanım hariç tutulur.",
    mevzuatRef: "IR 2025/2547 Annex II, Section 2",
  },
  {
    id: "installation",
    no: 4,
    baslik: "Tesis (Installation) ve Kütle Dengesi Kavramı",
    kategori: "temel",
    kategoriAdi: "Temel İlkeler",
    ozet: "Tesis, üretim faaliyetlerinin gerçekleştirildiği fiziki ve teknik ünitedir. Kütle ve enerji dengesi tesis bazında ayrıştırılır.",
    metin: "Tesis, üretim faaliyetlerinin gerçekleştirildiği fiziki ve teknik ünite olarak tanımlanır. Tek bir tesis içerisinde birden fazla CBAM ürünü veya üretim süreci yer alabilir. SKDMHesapla, tesis bazında kütle ve enerji dengesini ayrıştırır.",
    mevzuatRef: "Regulation (EU) 2023/956 Art. 3(14)",
  },
  {
    id: "production-process",
    no: 5,
    baslik: "Üretim Süreci (Production Process) Sınırları",
    kategori: "temel",
    kategoriAdi: "Temel İlkeler",
    ozet: "Her GTİP bir üretim süreciyle eşleştirilir. AB kuralı gereği tek bir CN kodu iki ayrı üretim sürecine bölünemez.",
    metin: "Her bir GTİP (CN) kodu bir üretim süreci ile ilişkilendirilir. AB CBAM tüzüğü gereğince bir CN kodu iki ayrı üretim sürecine bölünemez. Sistem bu fiziksel kısıtı veri girişinde otomatik denetler.",
    mevzuatRef: "IR 2025/2547 Article 4 & 5",
  },
  {
    id: "direct-emissions",
    no: 6,
    baslik: "Doğrudan Emisyonlar (Direct Emissions - Scope 1)",
    kategori: "emisyon",
    kategoriAdi: "Emisyon Hesaplama",
    ozet: "Yakıt yakılması ve proses reaksiyonlarından doğan sera gazları yakıt miktarı ve emisyon faktörüyle t CO₂e olarak hesaplanır.",
    metin: "Tesis sınırları dâhilinde yakıt yakılması (doğal gaz, kömür, motorin vb.) ve proses tepkimeleri sonucu açığa çıkan emisyonları ifade eder. Yakıt miktarı ve yakıt emisyon faktörü üzerinden t CO₂e olarak hesaplanır.",
    formuller: ["Doğrudan Emisyon = Yakıt Tüketimi (GJ veya Ton) × Emisyon Faktörü (t CO₂e/GJ) × Oksidasyon Faktörü"],
    mevzuatRef: "IR 2025/2547 Annex II Section 3",
  },
  {
    id: "indirect-emissions",
    no: 7,
    baslik: "Dolaylı Emisyonlar (Indirect Emissions - Elektrik & Isı)",
    kategori: "emisyon",
    kategoriAdi: "Emisyon Hesaplama",
    ozet: "Satın alınan şebeke elektriği, buhar, ısı ve soğutma enerjisinden kaynaklanan Kapsam 2 emisyonları kapsar.",
    metin: "Üretim sürecinde dışarıdan satın alınan ve tüketilen elektrik, buhar, ısı ve soğutma enerjisinden kaynaklanan emisyonlardır. Elektrik tüketimi kWh / MWh bazında ölçülür.",
    mevzuatRef: "IR 2025/2547 Annex II Section 4",
  },
  {
    id: "electricity",
    no: 8,
    baslik: "Elektrik Emisyon Metodolojisi & Şebeke Faktörleri",
    kategori: "emisyon",
    kategoriAdi: "Emisyon Hesaplama",
    ozet: "Şebeke faktörü (Grid factor), PPA ikili anlaşması veya doğrudan bağlı üretim tesisi emisyon faktörü uygulanır.",
    metin: "Elektrik emisyonları, şebeke emisyon faktörü (grid factor) veya PPA (İkili Anlaşma) / yenilenebilir enerji sertifikalı gerçek emisyon faktörleri kullanılarak t CO₂ / MWh bazında hesaplanır.",
    formuller: ["Dolaylı Elektrik Emisyonu = Tüketilen Elektrik (MWh) × Şebeke/PPA Emisyon Faktörü (t CO₂/MWh)"],
    mevzuatRef: "Annex IV, Paragraph 4.3 of Regulation 2023/956",
  },
  {
    id: "precursors",
    no: 9,
    baslik: "Gömülü Ara Girdiler (Precursors) ve Zincir Kuralı",
    kategori: "emisyon",
    kategoriAdi: "Emisyon Hesaplama",
    ozet: "Karmaşık mallarda hammadde olarak giren klinker, ham çelik, ham alüminyum gibi ara girdilerin getirdiği emisyonlardır.",
    metin: "Karmaşık malların (örneğin cıvata, vida veya işlenmiş alüminyum profiller) üretiminde kullanılan ham çelik, ham alüminyum veya klinker gibi CBAM kapsamındaki ara girdilerin bünyesinde getirdiği emisyonlardır.",
    mevzuatRef: "IR 2025/2547 Annex II Section 5",
  },
  {
    id: "embedded-emissions",
    no: 10,
    baslik: "Spesifik Gömülü Emisyon (Specific Embedded Emissions - SEE)",
    kategori: "emisyon",
    kategoriAdi: "Emisyon Hesaplama",
    ozet: "Birim ton ürün başına düşen toplam doğrudan, dolaylı ve prekürsör emisyon yoğunluğudur (t CO₂e / ton ürün).",
    metin: "Üretilen birim ton ürün başına düşen emisyon miktarını ifade eder (t CO₂e / ton ürün). Hesaplama formülü:",
    formuller: ["SEE = (Doğrudan Emisyonlar + Dolaylı Emisyonlar + Prekürsör Emisyonları) / Toplam Üretim Miktarı (Ton)"],
    mevzuatRef: "Regulation (EU) 2023/956 Annex IV",
  },
  {
    id: "actual-data",
    no: 11,
    baslik: "Gerçek Veri (Actual Data) Önceliği ve Kanıt Kütüğü",
    kategori: "veri",
    kategoriAdi: "Veri ve Kalite Yönetimi",
    ozet: "Fatura, sayaç, kantar ve laboratuvar ölçümlerine dayanan gerçek veriler birincil kabul edilir.",
    metin: "AB CBAM rejiminin nihai uygulamasında tesise ait gerçek ölçüm verileri zorunludur. SKDMHesapla öncelikli olarak ihracatçının sayaç, fatura ve irsaliye bazlı gerçek verilerini işler.",
    mevzuatRef: "Article 7 & Annex III of IR 2025/2547",
  },
  {
    id: "default-values",
    no: 12,
    baslik: "Varsayılan Değerler (Default Values) ve Mark-up Kuralları",
    kategori: "veri",
    kategoriAdi: "Veri ve Kalite Yönetimi",
    ozet: "Gerçek verinin temin edilemediği durumlarda Komisyon'un yayımladığı ülke veya bölge varsayılan değerleri uygulanır.",
    metin: "Gerçek verinin temin edilemediği durumlarda AB Komisyonu tarafından yayımlanan sektörel varsayılan değerler kullanılır. Ancak varsayılan değer kullanılan alanlar mühürleme raporunda gerekçelendirilmek zorundadır.",
    mevzuatRef: "Commission Default Values Dataset (2025/2026)",
  },
  {
    id: "emission-factors",
    no: 13,
    baslik: "Emisyon Faktörü Veri Tabanı Kaynakları",
    kategori: "veri",
    kategoriAdi: "Veri ve Kalite Yönetimi",
    ozet: "IPCC 2006/2019, TEİAŞ Türkiye Şebeke Faktörü, EPDK, Ecoinvent ve AB JRC veri tabanları kullanılır.",
    metin: "Sistemimiz IPCC, Turstat, EPDK, TEİAŞ ve AB JRC veri tabanlarındaki güncel kütle/enerji emisyon faktörlerini kullanır. Emisyon faktör seti versiyonlanmıştır.",
    mevzuatRef: "IPCC Guidelines for GHG Inventories & TEİAŞ 2025/2026",
  },
  {
    id: "qc",
    no: 14,
    baslik: "10 Katmanlı Veri Kalite Kontrolü (Quality Control - QC)",
    kategori: "veri",
    kategoriAdi: "Veri ve Kalite Yönetimi",
    ozet: "Fiziksel tutarsızlıklar, anormal katsayılar ve eksik parametreler algoritma tarafından otomatik denetlenir.",
    metin: "Sihirbaz ekranında girilen veriler anlık olarak 10 katmanlı kalite kontrol algoritması (QC) tarafından taranır. Fiziksel tutarsızlıklar, aşırı yüksek/düşük birim değerler anında kullanıcıya bildirilir.",
    mevzuatRef: "ISO 14064-1:2018 Quality Management",
  },
  {
    id: "allocation",
    no: 15,
    baslik: "Tahsis (Allocation) ve Kütle Payı Metodolojisi",
    kategori: "veri",
    kategoriAdi: "Veri ve Kalite Yönetimi",
    ozet: "Ortak tesislerde veya ortak kazan kullanımında emisyonlar kütlesel üretim payına göre dağıtılır.",
    metin: "Ortak tesis alanlarında veya ortak yakıt kullanımında emisyonların üretilen ürünler arasındaki dağıtımı kütlesel üretim oranları (kütle payı) esas alınarak yapılır.",
    formuller: ["Tahsis Oranı (%) = Ürünün Kütlesi (Ton) / Tesis Toplam Üretim Kütlesi (Ton)"],
    mevzuatRef: "IR 2025/2547 Annex II Section 6",
  },
  {
    id: "readiness",
    no: 16,
    baslik: "Denetime Hazırlık ve Bağımsız Doğrulama Uyumu",
    kategori: "guvence",
    kategoriAdi: "Güvence ve Sorumluluk",
    ozet: "Çıktılar akredite bağımsız doğrulayıcıların inceleme formatına ve AB Communication Template tablosuna tam uygundur.",
    metin: `SKDMHesapla çıktısı olan ${PLATFORM_STATS.fileCount} parçalı paket, akredite bağımsız doğrulayıcı kurumların talep ettiği veri yapısına birebir uygun şekilde dizayn edilmiştir.`,
    mevzuatRef: "Accreditation Regulation (EU) 2018/2067 & CBAM Verification Rules",
  },
  {
    id: "iso-link",
    no: 17,
    baslik: "ISO 14064-1 & ISO 14067 Metodolojik Standart Uyumu",
    kategori: "guvence",
    kategoriAdi: "Güvence ve Sorumluluk",
    ozet: "Platform kuralları ISO 14064-1 sera gazı hesaplama eğitimi sahibi ürün sorumlusu gözetiminde geliştirilir.",
    metin: `${GROUND_TRUTH_CLAIM} Ürün sorumlumuz ${primaryCredential.holder.name}, ${primaryCredential.credential.name} belgesi sahibidir.`,
    mevzuatRef: "ISO 14064-1:2018 & ISO 14067:2018 Standards",
  },
  {
    id: "not-done",
    no: 18,
    baslik: "Platform Sınırları ve Hizmet Kapsamı Beyanı",
    kategori: "guvence",
    kategoriAdi: "Güvence ve Sorumluluk",
    ozet: "Platform self-servis çalışma dosyası hazırlar; akredite doğrulama görüşü veya gümrük garantisi satmaz.",
    metin: SCOPE_DISCLAIMER,
    mevzuatRef: "Legal Disclaimer & Service Terms",
  },
];

export function MetodolojiIndexClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<"no" | "alpha">("no");
  const [activeLanguage, setActiveLanguage] = useState<"all" | "tr">("all");
  const [activeType, setActiveType] = useState<"all" | "formula">("all");
  const [includePatents, setIncludePatents] = useState(false);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [savedSections, setSavedSections] = useState<Record<string, boolean>>({});
  const [citingSectionId, setCitingSectionId] = useState<string | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase("tr");

    return BOLUMLER.filter((b) => {
      // Category filter
      if (activeCategory !== "all" && b.kategori !== activeCategory) {
        return false;
      }

      // Formula filter
      if (activeType === "formula" && (!b.formuller || b.formuller.length === 0)) {
        return false;
      }

      // Search query
      if (q) {
        const matchesBaslik = b.baslik.toLocaleLowerCase("tr").includes(q);
        const matchesOzet = b.ozet.toLocaleLowerCase("tr").includes(q);
        const matchesMetin = b.metin.toLocaleLowerCase("tr").includes(q);
        const matchesMevzuat = b.mevzuatRef?.toLocaleLowerCase("tr").includes(q);
        const matchesKat = b.kategoriAdi.toLocaleLowerCase("tr").includes(q);
        return matchesBaslik || matchesOzet || matchesMetin || matchesMevzuat || matchesKat;
      }

      return true;
    }).sort((a, b) => {
      if (activeSort === "alpha") {
        return a.baslik.localeCompare(b.baslik, "tr");
      }
      return a.no - b.no;
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

  const citingItem = BOLUMLER.find((b) => b.id === citingSectionId);

  return (
    <div className="pasaport-zemin-acik min-h-screen bg-[#f0f4f8] font-sans text-[#202124] antialiased">
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
                <span className="text-[#5f6368]">Metodoloji</span>
              </a>
              <h1 className="sr-only">Hesaplama metodolojisi ve sınırlar</h1>
            </div>

            {/* Search Input Bar */}
            <div className="relative max-w-[650px] flex-1">
              <div className="flex h-[42px] items-center rounded-full border border-[#dfe1e5] bg-white shadow-xs focus-within:border-transparent focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#1a73e8] hover:shadow-xs transition">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Metodoloji maddesi ara (ör. gate-to-gate, direct emissions, SEE, allocation)..."
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
              Tüm Metodoloji ({BOLUMLER.length} Madde)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("temel");
                setActiveType("all");
              }}
              className={`pb-1 border-b-2 transition whitespace-nowrap ${
                activeCategory === "temel"
                  ? "border-[#1a73e8] font-medium text-[#1a73e8]"
                  : "border-transparent hover:text-[#202124]"
              }`}
            >
              Temel İlkeler &amp; Sınırlar
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("emisyon");
                setActiveType("all");
              }}
              className={`pb-1 border-b-2 transition whitespace-nowrap ${
                activeCategory === "emisyon"
                  ? "border-[#1a73e8] font-medium text-[#1a73e8]"
                  : "border-transparent hover:text-[#202124]"
              }`}
            >
              Emisyon Hesaplama Kuralları
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("veri");
                setActiveType("all");
              }}
              className={`pb-1 border-b-2 transition whitespace-nowrap ${
                activeCategory === "veri"
                  ? "border-[#1a73e8] font-medium text-[#1a73e8]"
                  : "border-transparent hover:text-[#202124]"
              }`}
            >
              Veri &amp; Kalite Yönetimi (QC)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("guvence");
                setActiveType("all");
              }}
              className={`pb-1 border-b-2 transition whitespace-nowrap ${
                activeCategory === "guvence"
                  ? "border-[#1a73e8] font-medium text-[#1a73e8]"
                  : "border-transparent hover:text-[#202124]"
              }`}
            >
              Güvence &amp; ISO 14064-1
            </button>
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
                className="flex items-center gap-3.5 rounded-lg px-3.5 py-2 bg-[#f1f3f4] font-medium text-[#202124] transition"
              >
                <Scale className="h-4 w-4 text-[#1a73e8]" />
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
            Yaklaşık {filteredSections.length} metodoloji maddesi
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
                Tüm başlıklar
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("temel")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeCategory === "temel" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Temel ilkeler
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("emisyon")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeCategory === "emisyon" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Emisyon hesaplama
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("veri")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeCategory === "veri" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Veri kalitesi (QC)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("guvence")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeCategory === "guvence" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                ISO 14064-1 güvence
              </button>
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
                Madde sırasına göre
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
                Türkçe metinler
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
                Tüm maddeler
              </button>
              <button
                type="button"
                onClick={() => setActiveType("formula")}
                className={`block w-full text-left py-0.5 leading-[22px] hover:underline cursor-pointer ${
                  activeType === "formula" ? "text-[#c53929] font-normal" : "text-[#202124]"
                }`}
              >
                Formül içeren maddeler
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
            {/* Scholar Stats Line & Metadata Provenance */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#70757a] border-b border-[#ebebeb] pb-2">
              <div>
                Yaklaşık <strong className="font-medium text-[#202124]">{filteredSections.length}</strong> metodoloji maddesi{" "}
                <span>(Motor Sürümü: {methodology.calculationEngineVersion})</span>
              </div>
              <div className="text-[11px] text-[#5f6368]">
                Sorumlu: <strong className="text-[#202124]">{methodology.owner}</strong> (ISO 14064-1)
              </div>
            </div>

            {/* Direct Answer Box (Google Scholar Featured Snippet) */}
            <div className="rounded border border-[#dadce0] bg-[#f8fafd] p-4 text-[13px] text-[#202124]">
              <div className="font-bold text-[#1a73e8] flex items-center gap-1.5">
                <Scale className="h-4 w-4" />
                <span>CBAM Metodolojisi Nedir? (Gate-to-Gate Standardı)</span>
              </div>
              <p className="mt-1.5 text-[#3c4043] leading-relaxed">
                CBAM metodolojisi, AB sınırlarına giren belirli ithal ürünlerin üretim aşamasındaki doğrudan ve dolaylı gömülü karbon emisyonlarının nasıl hesaplanacağını belirleyen resmi kurallar bütünüdür. Bu hesaplamalar, AB Komisyonu&apos;nun (EU) 2025/2547 Uygulama Tüzüğü&apos;nde detaylandırılan gate-to-gate (tesis sınırları) yaklaşımıyla gerçekleştirilir.
              </p>
              <div className="mt-2 text-[11px] text-[#5f6368] flex items-center gap-1">
                <span>Resmî Dayanak: </span>
                <a
                  href="https://eur-lex.europa.eu/eli/reg_impl/2025/2547/oj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a0dab] hover:underline inline-flex items-center gap-0.5"
                >
                  Commission Implementing Regulation (EU) 2025/2547 <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Empty State */}
            {filteredSections.length === 0 && (
              <div className="rounded border border-[#dadce0] bg-white p-6 text-sm text-[#3c4043]">
                <p className="font-medium">Aramanızla eşleşen hiçbir metodoloji maddesi bulunamadı.</p>
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
              {filteredSections.map((item) => {
                const isSaved = !!savedSections[item.id];

                return (
                  <article id={item.id} key={item.id} className="scroll-mt-16 text-[13px] leading-[19px]">
                    {/* Top Row: Title + Right Ref */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h2 className="text-[17px] sm:text-[18px] leading-[22px]">
                        <span className="mr-1.5 text-[13px] font-bold text-[#5f6368]">
                          [MADDE {String(item.no).padStart(2, "0")}]
                        </span>
                        <a
                          href={`#${item.id}`}
                          className="font-normal text-[#1a0dab] hover:underline visited:text-[#609]"
                        >
                          {item.baslik}
                        </a>
                      </h2>

                      {item.resmiKaynakUrl ? (
                        <a
                          href={item.resmiKaynakUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-[13px] text-[#1a0dab] hover:underline flex items-center gap-1"
                        >
                          <span className="font-bold text-[#5f6368]">[KAYNAK]</span> {item.resmiKaynakAdi || "EUR-Lex"}
                          <ExternalLink className="h-3 w-3 text-[#70757a]" />
                        </a>
                      ) : (
                        <span className="shrink-0 text-[12px] font-mono text-[#5f6368]">
                          {item.mevzuatRef || "SKDM-METODOLOJİ"}
                        </span>
                      )}
                    </div>

                    {/* Green metadata row */}
                    <div className="mt-0.5 text-[13px] text-[#006621] leading-[18px]">
                      <span className="font-normal">Kategori: {item.kategoriAdi}</span>
                      <span className="text-[#70757a]"> - </span>
                      <span>Sürüm: {methodology.version}</span>
                      <span className="text-[#70757a]"> - </span>
                      <span className="text-[#5f6368]">Snapshot: {methodology.regulatorySnapshot}</span>
                      {item.mevzuatRef && (
                        <>
                          <span className="text-[#70757a]"> - </span>
                          <span className="text-[#70757a] italic">{item.mevzuatRef}</span>
                        </>
                      )}
                    </div>

                    {/* Content text */}
                    <div className="mt-1.5 text-[13px] text-[#4d5156] leading-[20px]">
                      {item.metin}
                    </div>

                    {/* Bullet points if any */}
                    {item.maddeler && item.maddeler.length > 0 && (
                      <ul className="my-2 list-disc list-inside space-y-1 text-[12px] text-[#3c4043] pl-2">
                        {item.maddeler.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    )}

                    {/* Formulas if any */}
                    {item.formuller && item.formuller.length > 0 && (
                      <div className="my-2 rounded-r border-l-3 border-[#1a73e8] bg-[#f8fafd] p-2.5 text-[13px] text-[#202124]">
                        <div className="font-medium text-[#1a73e8]">
                          Resmî Hesaplama Formülü:
                        </div>
                        {item.formuller.map((f, idx) => (
                          <code
                            key={idx}
                            className="mt-1 block font-mono text-[11px] sm:text-[12px] font-bold text-[#14361f] bg-white p-1.5 rounded border border-[#ebebeb]"
                          >
                            {f}
                          </code>
                        ))}
                      </div>
                    )}

                    {/* Action Bottom Row */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#70757a]">
                      {/* Save / Star */}
                      <button
                        type="button"
                        onClick={() => toggleSave(item.id)}
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
                          onClick={() => setCitingSectionId(citingSectionId === item.id ? null : item.id)}
                          className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline cursor-pointer"
                        >
                          <Quote className="h-3 w-3" />
                          Alıntı yap
                        </button>
                      )}

                      <Link
                        href="/uzmanlik/baris-bagirlar/"
                        className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline"
                      >
                        Yetkinliği doğrula
                      </Link>

                      <a
                        href="/rehber/"
                        className="inline-flex items-center gap-1 text-[#1a0dab] hover:underline"
                      >
                        Rehberde vaka incelemesi
                      </a>
                    </div>

                    {/* Citation Modal / Inline Panel */}
                    {citingSectionId === item.id && citingItem && (
                      <div className="mt-3 rounded border border-[#dadce0] bg-[#f8f9fa] p-4 text-[12px] text-[#202124] shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#ebebeb] pb-2 font-bold">
                          <span>Alıntı Formatı (SKDM Metodolojik Standart):</span>
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
                              SKDMHesapla Metodoloji Kurulu. &ldquo;Madde {citingItem.no}: {citingItem.baslik}.&rdquo; <em>SKDMHesapla CBAM Hesaplama Metodolojisi Dokümanı</em> v{methodology.version} (2026). https://skdmhesapla.com/metodoloji/#{citingItem.id}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(
                                  `SKDMHesapla Metodoloji Kurulu. "Madde ${citingItem.no}: ${citingItem.baslik}." SKDMHesapla CBAM Hesaplama Metodolojisi Dokümanı v${methodology.version} (2026). https://skdmhesapla.com/metodoloji/#${citingItem.id}`,
                                  citingItem.id
                                )
                              }
                              className="shrink-0 text-[#1a73e8] hover:underline inline-flex items-center gap-1"
                            >
                              {copiedCitation === citingItem.id ? (
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

            {/* Metodoloji Sorumluluğu & Denetçi Notu */}
            <div className="mt-12 rounded border border-[#dadce0] bg-[#f8f9fa] p-5 text-[13px] text-[#3c4043] space-y-2">
              <div className="font-bold text-[#202124]">Metodoloji Sorumluluğu &amp; Teknik Gözetim</div>
              <p className="leading-relaxed">
                {primaryCredential.holder.name} ({primaryCredential.holder.role}) — {primaryCredential.credential.name} ({primaryCredential.credential.issuingOrganization}).
              </p>
              <div className="text-[12px] text-[#5f6368] space-y-1 pt-1 border-t border-[#ebebeb]">
                <p>
                  <strong>(EU) 2025/2547 Uygulama Tüzüğü:</strong> Kabul Tarihi: <strong>10.12.2025</strong> | Resmî Gazete Yayın Tarihi: <strong>22.12.2025</strong> (Yürürlük: 2026 Kesin Dönem).
                </p>
              </div>
              <div className="pt-2 border-t border-[#ebebeb] flex items-center justify-between text-[12px]">
                <span>Mevzuat Referansı: (EU) 2025/2547 &amp; (EU) 2023/956</span>
                <Link
                  href={primaryCredential.holder.profileUrl}
                  className="font-bold text-[#1a0dab] hover:underline"
                >
                  Doğrulanabilir Yetkinlik Profilini İncele →
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
