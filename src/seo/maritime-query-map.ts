/**
 * SSOT: Denizcilik Arama Sorguları, Niyet, Persona ve Sayfa Sahipliği Haritası
 * 
 * KURAL:
 * 1. "Yüksek hacimli arama" gibi kanıtsız hacim iddiaları YASAKTIR.
 * 2. Search Console veya Google Keyword Planner verisi olmayan sorgular SEARCH_CANDIDATE
 *    ve searchVolume: "UNKNOWN" olarak işaretlenir.
 * 3. Her sorgunun tek bir owner route'u vardır.
 * 4. İhracatçı ve Armatör personaları ayrılmıştır; asla aynı sayfada niyet çakışması yaşatılmaz.
 */

export type MaritimePersona = "armator" | "ihracatci" | "broker_forwarder";
export type MaritimeIntentType = "informational" | "commercial" | "transactional";
export type QueryCandidateStatus = "SEARCH_CANDIDATE" | "VERIFIED";

export interface MaritimeQueryMapping {
  query: string;
  status: QueryCandidateStatus;
  searchVolume: number | "UNKNOWN";
  intentType: MaritimeIntentType;
  persona: MaritimePersona;
  customerProblem: string;
  plainTurkishAnswer: string;
  ownerRoute: string;
  primaryContentBlock: string;
  primaryCta: {
    label: string;
    href: string;
  };
}

export const MARITIME_QUERY_MAP: MaritimeQueryMapping[] = [
  // 1. HUB: Genel Denizcilik & Persona Ayrımı (/denizcilik)
  {
    query: "denizcilik karbon düzenlemeleri",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "informational",
    persona: "armator",
    customerProblem: "Denizcilik sektöründeki AB karbon kurallarının hangileri beni bağlar, hangileri yük sahibini bağlar?",
    plainTurkishAnswer:
      "Avrupa Birliği deniz taşımacılığında iki ana rejim uygular: AB Emisyon Ticaret Sistemi (EU ETS) ve Denizcilik Yakıt Standardı (FuelEU Maritime). Her iki rejimde de yasal yükümlü gemi işletmecisidir (DoC / ISM Company). İhracatçı ise yalnızca navlun faturasındaki karbon ek bedelini karşılar.",
    ownerRoute: "/denizcilik",
    primaryContentBlock: "hero_persona_gate",
    primaryCta: {
      label: "Armatör Uyum Dosyası Hazırla",
      href: "/denizcilik/dosya-hazirla",
    },
  },
  {
    query: "gemi karbon vergisi nedir",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "informational",
    persona: "armator",
    customerProblem: "Gemi karbon vergisi diye bir vergi mi çıktı, yoksa bu bir emisyon piyasası mı?",
    plainTurkishAnswer:
      "Sektörde 'karbon vergisi' olarak anılan yükümlülük, teknik olarak bir gümrük vergisi değil; Avrupa Karbon Piyasası Emisyon Tahsisat Sistemi'dir (EU ETS Maritime). Geminin sefer başına saldığı sera gazı miktarı karşılığında piyasadan karbon tahsisatı (EUA) satın alınıp AB makamına teslim edilmesi gerekir.",
    ownerRoute: "/denizcilik",
    primaryContentBlock: "terminology_clarification",
    primaryCta: {
      label: "EU ETS Hesaplama Aracına Git",
      href: "/denizcilik/eu-ets",
    },
  },

  // 2. EU ETS MARITIME: Karbon Tahsisatı, Phase-In ve Sorumluluk (/denizcilik/eu-ets)
  {
    query: "eu ets denizcilik",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "commercial",
    persona: "armator",
    customerProblem: "Türkiye-Avrupa seferlerimde kaç adet EUA tahsisatı teslim etmek zorundayım?",
    plainTurkishAnswer:
      "Direktif 2003/87/EC (Direktif (AB) 2023/959 tadili) uyarınca, Türkiye limanları ile AB limanları arasındaki seferlerde doğrulanmış emisyonların %50'si için EUA teslimi yapılır. 2026 yılı itibarıyla aşamalı geçiş sona ermiş olup teslim yükümlülüğü %100 oranındadır.",
    ownerRoute: "/denizcilik/eu-ets",
    primaryContentBlock: "ets_phase_in_table",
    primaryCta: {
      label: "Sefer Başına EUA Hesapla",
      href: "/denizcilik/gemi-karbon-hesaplama",
    },
  },
  {
    query: "gemi ets teslim yükümlülüğü 2026",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "informational",
    persona: "armator",
    customerProblem: "2026 yılında EU ETS teslim oranım nedir ve hangi gazlar eklendi?",
    plainTurkishAnswer:
      "1 Ocak 2026 itibarıyla teslim oranı %100'dür. 2024 (%40) ve 2025 (%70) geçiş katsayıları sona ermiştir. Ayrıca 2026 itibarıyla karbondioksit (CO₂) yanında metan (CH₄) ve diazot monoksit (N₂O) sera gazları da kapsama girmiştir.",
    ownerRoute: "/denizcilik/eu-ets",
    primaryContentBlock: "ets_2026_scope",
    primaryCta: {
      label: "ETS Rapor Dosyası Oluştur",
      href: "/denizcilik/dosya-hazirla",
    },
  },
  {
    query: "eu ets gemi 50 kuralı",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "informational",
    persona: "armator",
    customerProblem: "Türkiye'den kalkan bir geminin emisyonlarının ne kadarı AB ETS'ye tabidir?",
    plainTurkishAnswer:
      "AB dışı bir liman (örn. Ambarlı, Mersin, Nemrut) ile bir AB limanı (örn. Cenova, Valencia, Pire) arasındaki tek yönlü seferlerde ve AB limanındaki liman içi bekleme/operasyon emisyonlarında kural şudur: Seyir emisyonunun %50'si, AB liman içi emisyonunun ise %100'ü ETS kapsamındadır.",
    ownerRoute: "/denizcilik/eu-ets",
    primaryContentBlock: "ets_geographic_scope",
    primaryCta: {
      label: "Liman Koridoru Simülasyonu Yap",
      href: "/denizcilik/gemi-karbon-hesaplama",
    },
  },

  // 3. FUELEU MARITIME: Yakıt Yoğunluğu, Uyum Dengesi ve Ceza (/denizcilik/fueleu-maritime)
  {
    query: "fueleu maritime nedir",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "informational",
    persona: "armator",
    customerProblem: "FuelEU Maritime armatörden tam olarak ne talep ediyor?",
    plainTurkishAnswer:
      "Tüzük (AB) 2023/1805 (FuelEU Maritime), 5.000 GT üzeri gemilerin tükettiği yakıtın Well-to-Wake sera gazı yoğunluğunun referans değere (91.16 gCO₂eq/MJ) kıyasla 2025'te %2, 2030'da %6 oranında azaltılmasını şart koşar. Limit aşımında ton eşdeğeri başına 2.400 EUR ceza tahakkuk eder.",
    ownerRoute: "/denizcilik/fueleu-maritime",
    primaryContentBlock: "fueleu_ghg_intensity_limits",
    primaryCta: {
      label: "Uyum Dengesi (CB) Hesapla",
      href: "/denizcilik/gemi-karbon-hesaplama",
    },
  },
  {
    query: "fueleu maritime ceza hesaplama",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "commercial",
    persona: "armator",
    customerProblem: "FuelEU yoğunluk limitini aşarsam ne kadar ceza öderim?",
    plainTurkishAnswer:
      "FuelEU cezası, negatif uyum dengesinin (Compliance Balance < 0) VLSFO enerji denkliğine (41.000 MJ/t) bölünmesi ve ton başına 2.400 EUR yasal ceza katsayısıyla çarpılmasıyla hesaplanır. Ayrıca art arda gelen yıllarda ceza çarpanı 1 + (yıl-1)/10 oranında artar.",
    ownerRoute: "/denizcilik/fueleu-maritime",
    primaryContentBlock: "fueleu_penalty_formula",
    primaryCta: {
      label: "FuelEU Ceza Simülasyonu",
      href: "/denizcilik/fueleu-maritime#ceza-motoru",
    },
  },
  {
    query: "fueleu banking borrowing kuralları",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "informational",
    persona: "armator",
    customerProblem: "FuelEU fazlalığımı bir sonraki yıla devredebilir miyim (bank) veya borçlanabilir miyim (borrow)?",
    plainTurkishAnswer:
      "Evet. Tüzük (AB) 2023/1805 Madde 20 uyarınca pozitif uyum dengesi akredite doğrulayıcı onayıyla gelecek yıla devredilebilir (banking). Madde 21 uyarınca ise azami %2 limitinde ve bir sonraki yıl 1.1 çarpanla ödenmek üzere borçlanma (borrowing) yapılabilir.",
    ownerRoute: "/denizcilik/fueleu-maritime",
    primaryContentBlock: "fueleu_flexibility_mechanisms",
    primaryCta: {
      label: "FuelEU Raporu Hazırla",
      href: "/denizcilik/dosya-hazirla",
    },
  },

  // 4. MRV & THETIS: Emisyon Takip, XML ve Doğrulama Hazırlığı (/denizcilik/mrv-thetis)
  {
    query: "thetis mrv xml raporu",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "commercial",
    persona: "armator",
    customerProblem: "EMSA THETIS-MRV portalına yüklenecek XML dosyasını nasıl hatasız hazırlarım?",
    plainTurkishAnswer:
      "Tüzük (AB) 2015/757 uyarınca yıllık emisyon raporları ve izleme planları EMSA THETIS-MRV sistemine yüklenir. Platformumuz sefer kütükleri ve BDN verilerinizi THETIS-MRV destekli XML formatında derleyerek akredite doğrulayıcının incelemesine sıfır veri eksiğiyle sunulmasını sağlar.",
    ownerRoute: "/denizcilik/mrv-thetis",
    primaryContentBlock: "mrv_thetis_xml_pipeline",
    primaryCta: {
      label: "THETIS-MRV XML Paketi Üret",
      href: "/denizcilik/dosya-hazirla",
    },
  },
  {
    query: "400 4999 gt mrv zorunluluğu",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "informational",
    persona: "armator",
    customerProblem: "5.000 GT altındaki koster veya genel kargo gemim emisyon raporlamak zorunda mı?",
    plainTurkishAnswer:
      "Tüzük (AB) 2023/957 ile yapılan düzenleme uyarınca, 1 Ocak 2025'ten itibaren 400 ile 4.999 GT arasındaki genel kargo ve 400 GT üzeri offshore gemileri EU MRV emisyon izleme ve raporlama kapsamına alınmıştır. Bu gemiler için henüz EU ETS tahsisat teslimi zorunlu olmasa da MRV raporlama zorunludur.",
    ownerRoute: "/denizcilik/mrv-thetis",
    primaryContentBlock: "mrv_tonnage_scope_400_5000",
    primaryCta: {
      label: "MRV Kapsamını Kontrol Et",
      href: "/denizcilik/mrv-thetis#kapsam",
    },
  },
  {
    query: "gemi emisyon izleme planı",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "informational",
    persona: "armator",
    customerProblem: "Gemi izleme planında (Monitoring Plan) hangi yakıt ve ölçüm yöntemleri bulunmalıdır?",
    plainTurkishAnswer:
      "MRV ve FuelEU için izleme planı; BDN mutabakatı (Yöntem A), tank sondajı (Yöntem B) veya akışölçer (Yöntem C) ölçüm prosedürlerini, belirsizlik paylarını ve veri boşluğu yedekleme planlarını eksiksiz içermelidir.",
    ownerRoute: "/denizcilik/mrv-thetis",
    primaryContentBlock: "monitoring_plan_components",
    primaryCta: {
      label: "İzleme Planı Modülünü İncele",
      href: "/denizcilik/dosya-hazirla",
    },
  },

  // 5. NAVLUN & İHRACATÇI: ETS Navlun Sürşarjı ve CBAM Sınırı (/denizcilik/ets-navlun-sursarji)
  {
    query: "ets navlun sürşarjı",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "commercial",
    persona: "ihracatci",
    customerProblem: "Armatörün navlun faturama eklediği 'ETS surcharge' yasal mı ve tutarı doğru mu?",
    plainTurkishAnswer:
      "Armatörlerin AB ETS kapsamındaki karbon maliyetlerini navlun faturasına 'ETS ek ücreti' olarak yansıtması ticari bir uygulamadır. Ancak bu bedel seferin rota uzunluğuna, geminin verimliliğine ve güncel EUA piyasa fiyatına orantılı olmalıdır.",
    ownerRoute: "/denizcilik/ets-navlun-sursarji",
    primaryContentBlock: "surcharge_calculator_exporter",
    primaryCta: {
      label: "Konteyner Başına ETS Payı Hesapla",
      href: "/denizcilik/ets-navlun-sursarji#hesaplayici",
    },
  },
  {
    query: "navlun cbam e dahil mi",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "informational",
    persona: "ihracatci",
    customerProblem: "Gemi nakliye emisyonlarını CBAM beyanıma (SEE) eklemek zorunda mıyım?",
    plainTurkishAnswer:
      "HAYIR. AB Tüzüğü 2023/956 ve Kesin Dönem Uygulama Tüzüğü (AB) 2025/2547 uyarınca CBAM sistem sınırı fabrika kapısında (ex-works) biter. Deniz taşımacılığı emisyonları armatörün EU ETS sorumluluğundadır; CBAM ürün gömülü emisyon formülüne DAHİL EDİLEMEZ.",
    ownerRoute: "/denizcilik/ets-navlun-sursarji",
    primaryContentBlock: "cbam_vs_maritime_boundary",
    primaryCta: {
      label: "CBAM Fabrika Kapısı Hesaplama",
      href: "/cbam-hesaplama",
    },
  },

  // 6. İŞLEMSEL HESAPLAYICI (/denizcilik/gemi-karbon-hesaplama)
  {
    query: "gemi karbon hesaplama",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "transactional",
    persona: "armator",
    customerProblem: "Sefer başına yakıt tüketimimden EU ETS ve FuelEU maliyetimi anında hesaplamak istiyorum.",
    plainTurkishAnswer:
      "Kalkış/varış limanınızı, yakıt türünüzü (VLSFO, MGO, LNG, Biyoyakıt) ve miktarını girerek; 2026 %100 ETS teslim yükümlülüğünüzü ve FuelEU uyum dengesini (Compliance Balance) anında hesaplayabilirsiniz.",
    ownerRoute: "/denizcilik/gemi-karbon-hesaplama",
    primaryContentBlock: "maritime_calculator_engine",
    primaryCta: {
      label: "Tam Denetim Dosyası Oluştur",
      href: "/denizcilik/dosya-hazirla",
    },
  },

  // 7. DOSYA HAZIRLAMA (599 USD) (/denizcilik/dosya-hazirla)
  {
    query: "denizcilik karbon uyum dosyası hazırla",
    status: "SEARCH_CANDIDATE",
    searchVolume: "UNKNOWN",
    intentType: "transactional",
    persona: "armator",
    customerProblem: "Akredite doğrulayıcı denetimine gireceğim; sefer, BDN ve THETIS verilerimi içeren eksiksiz dosya paketine ihtiyacım var.",
    plainTurkishAnswer:
      "Gemi sefer ve BDN kayıtlarınızı girerek; 9 yasal klasör, THETIS-MRV destekli XML, FuelEU Madde 15 uyum kütüğü ve SHA-256 kriptografik bütünlük özetinden oluşan 32 modüllük doğrulama hazırlık dosyanızı anında oluşturabilirsiniz.",
    ownerRoute: "/denizcilik/dosya-hazirla",
    primaryContentBlock: "dossier_generator_form",
    primaryCta: {
      label: "Dosya Hazırlığı Başlat (599 USD)",
      href: "/denizcilik/dosya-hazirla",
    },
  },
];

/**
 * Belirli bir route'a ait sorguları döndürür
 */
export function getQueriesForRoute(route: string): MaritimeQueryMapping[] {
  const norm = route === "/" ? "/" : route.replace(/\/$/, "");
  return MARITIME_QUERY_MAP.filter((q) => {
    const qNorm = q.ownerRoute === "/" ? "/" : q.ownerRoute.replace(/\/$/, "");
    return qNorm === norm;
  });
}
