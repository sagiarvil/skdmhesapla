/** Auto from docs/sayfa-icerik-rehber.md — Plan 28 Stratejik Görev Ayrımı. */
export type RehberSection = { id?: string; title: string; body: string[]; list?: string[] };

export const REHBER_SECTIONS: RehberSection[] = [
  {
    id: "baslangic-rotasi",
    title: "Önce Buradan Başlayın — Durumunuza Göre Yol Haritası",
    body: [
      "**\"SKDM'yi ilk kez duyuyorum\":** Öncelikli odak noktanız: [SKDM](/sozluk/#cbam) → [Yetkili Beyan Sahibi](/sozluk/#declarant) → Kesin Dönem → [De Minimis](/sozluk/#de-minimis) → [SEE (Spesifik Gömülü Emisyon)](/sozluk/#see) → Sertifika. Bu altı kavram konunun temel çerçevesidir.",
      "**\"Alıcım benden veri istedi, ne yapacağımı bilmiyorum\":** Alıcınız büyük ihtimalle AB CBAM beyanı veya CSRD Kapsam 3 raporu için tedarikçi veri dosyası talep ediyor. Hemen [/basla/](/basla/) sayfasından sektörünüzü seçip ücretsiz sihirbazı başlatabilirsiniz.",
      "**\"Dosyamı hazırlıyorum, formdaki terimleri anlamıyorum\":** Formdaki alanların yanındaki (i) butonları doğrudan [SKDM Sözlüğü](/sozluk/) maddelerine bağlanır: [Faaliyet Verisi](/sozluk/#activity-data), [Emisyon Faktörü](/sozluk/#emission-factor), [NCV](/sozluk/#ncv), [Kaynak Akışı](/sozluk/#source-stream), [Bubble Approach](/sozluk/#bubble-approach) ve [Kontrol Denkliği](/sozluk/#kontrol-denkligi).",
      "**\"Doğrulayıcıyla çalışacağım\":** [Akredite Doğrulayıcı](/sozluk/#accredited-verifier) bağımsız denetim adımlarını yürütür. Mühürlü paketimizdeki *Dogrulayici-Calisma-Alani.xlsx* ve *Hesaplama-Izi.json* denetçiye doğrudan sunulmak üzere üretilir."
    ]
  },
  {
    id: "skdm-nedir",
    title: "BÖLÜM 1 — SKDM nedir? (Herkes için net tanım)",
    body: [
      "Sınırda Karbon Düzenleme Mekanizması (SKDM; AB'deki adıyla [CBAM](/sozluk/#cbam)), Avrupa Birliği'ne ithal edilen belirli ürünlerin üretimi sırasında açığa çıkan sera gazı emisyonlarını fiyatlandıran yasal bir düzenlemedir.",
      "**Neden var?** AB, kendi üreticisine Emisyon Ticaret Sistemi (ETS) ile karbon bedeli uyguluyor. Karbon maliyeti olmayan ülkelerden gelen ürünlerin bu maliyeti taşımadan AB pazarına girmesi [karbon kaçağı](/sozluk/#carbon-leakage) yaratıyordu. SKDM, ithal ürünün karbonuna da bedel getirerek piyasa şartlarını eşitliyor.",
      "**Kim öder?** En yaygın yanlış bilgi burada: **sertifikayı Türk ihracatçı değil, AB'li ithalatçı ([alıcınız](/sozluk/#importer)) satın alır.** Sizin yükümlülüğünüz doğrudan vergi ödemek değil; **doğru, kanıtlanabilir ve akredite denetime hazır [gömülü emisyon verisi](/sozluk/#embedded-emissions) sağlamaktır.** Veri vermezseniz alıcınız [varsayılan değerlerle (default values)](/sozluk/#default-values) beyan yapar — bu değerler genellikle gerçek emisyonunuzdan çok daha yüksektir ve alıcınıza ciddi ek maliyet çıkarır.",
      "**Kısa tarihçe:**"
    ],
    list: [
      "Dönem · Ne oldu",
      "Ekim 2023 – Aralık 2025 · Geçiş dönemi: yalnızca raporlama, ödeme yok",
      "2025 (Omnibus paketi) · (AB) 2025/2083 ile sadeleştirme: 50 ton de minimis, beyan takvimi revizesi",
      "1 Ocak 2026 · **Kesin dönem başladı** — artık gerçek sertifika maliyeti var",
      "Şubat 2027 · Sertifika satışları başlıyor (2026 ithalatı için)",
      "30 Eylül 2027 · 2026 yılına ait ilk yıllık beyanın son günü"
    ]
  },
  {
    id: "kapsam",
    title: "BÖLÜM 2 — Kapsam: Hangi ürünler, hangi kodlar?",
    body: [
      "SKDM kapsamı ürün bazında, **CN kodu** (Gümrük Tarife İstatistik Pozisyonu) ile belirlenir. Altı ana sektör:",
      "**Kapsam belirleme üç soruda:**",
      "1. Ürününüzün CN kodu listede mi? → Değilse SKDM zorunluluğu yok (ama bkz. Bölüm 6, Kademe B).",
      "2. Alıcınızın AB'ye yıllık toplam kapsam-içi ithalatı 50 tonun üzerinde mi? → Altındaysa [de minimis](/sozluk/#de-minimis) muafiyeti doğabilir (demir-çelik, alüminyum, çimento, gübre).",
      "3. Ürün AB'de üretilip geri mi dönüyor? → Bazı geri dönen ürün istisnaları mevcuttur."
    ],
    list: [
      "Sektör · Örnek CN aralıkları · Tipik ürünler",
      "Demir & Çelik · 7201–7229, 7301–7311 · Yarı mamul, inşaat demiri, profil, boru, vida",
      "Alüminyum · 7601–7616 · Külçe, profil, levha, folyo, tel",
      "Çimento · 2523 · Portland çimentosu, klinker, aluminli çimento",
      "Gübre · 2808, 3102–3105 · Nitrik asit, amonyak, üre, NPK",
      "Elektrik · 2716 00 00 · Elektrik enerjisi",
      "Hidrojen · 2804 10 00 · Hidrojen gazı"
    ]
  },
  {
    id: "de-minimis",
    title: "BÖLÜM 3 — De minimis: 50 ton muafiyeti",
    body: [
      "(AB) 2025/2083 Omnibus-I düzenlemesi uyarınca: **alıcınızın bir takvim yılındaki toplam kapsam-içi ithalatı 50 tonun altındaysa**, o yıl için SKDM sertifika satın alma yükümlülüğü doğmaz.",
      "Detaylı yasal tanım ve istisnalar için: [Sözlük: De Minimis](/sozluk/#de-minimis)."
    ],
    list: [
      "Eşik **sevkiyat başına değil, ithalatçının yıllık toplamına** bakar.",
      "Elektrik ve hidrojen bu muafiyetten **hariçtir**.",
      "Alıcınızın toplam ithalatını bilmiyorsanız sistemde \"bilmiyorum\" seçeneği işaretlenir."
    ]
  },
  {
    id: "maliyet-mekanizmasi",
    title: "BÖLÜM 4 — Maliyet mekanizması: Sertifika fiyatı nasıl oluşur?",
    body: [
      "1. **Fiyat kaynağı:** Sertifika fiyatı, AB ETS karbon fiyatının üç aylık ortalamasına bağlanır.",
      "2. **[CBAM Faktörü](/sozluk/#cbam-factor):** 2026'da emisyonların yalnızca **%2,5'i** ücretlendirilir; kademeli olarak 2034'te %100'e ulaşır.",
      "3. **Hesap iskeleti:** Sertifika maliyeti ≈ (gömülü emisyon tCO₂e) × (CBAM faktörü) × (sertifika fiyatı) − ([ödenmiş karbon bedeli](/sozluk/#carbon-price-paid)).",
      "4. **Türkiye Durumu:** TR-ETS pilot döneminde tahsisler ücretsiz olduğu için Türkiye üreticileri için mahsup değeri şu an 0'dır."
    ]
  },
  {
    id: "sablon-anatomisi",
    title: "BÖLÜM 5 — Sizden istenen veri: Resmi şablonun 10 katmanı",
    body: [
      "Alıcınızın size gönderdiği form, AB'nin resmi **Communication Template for Installations** yapısıdır.",
      "Tesis içi çoklu akışları yöneten kurallar için [Bubble Approach](/sozluk/#bubble-approach) maddesine; zorunlu kütle dengesi teyidi için [Kontrol Denkliği (a = b+c+d)](/sozluk/#kontrol-denkligi) maddesine bakın."
    ],
    list: [
      "# · Katman · İçerik · Sizin için anlamı",
      "1 · Tesis kimliği · Unvan, adres, UNLOCODE, koordinat · Firma kayıtlarınızdan",
      "2 · Mal kategorileri (G) · CN kodu bazında ürün grupları · Satış ekibinizden",
      "3 · Üretim süreçleri (P) · Her ürünün üretim hattı, bubble approach · Üretim şefinizden",
      "4 · Kaynak akışları (B) · Yakıt/elektrik tüketimi, NCV, faaliyet verisi · Faturalar + sayaçlar",
      "5 · Üretim seviyesi (D) · Üretim miktarı ve a = b+c+d kontrolü · Üretim raporları",
      "6 · Öncül maddeler (E) · Gömülü emisyonlu girdiler · Tedarikçilerinizden",
      "7 · Doğrulayıcı · Akredite doğrulama kuruluşu bilgisi · Varsa sözleşmeniz",
      "8 · Karbon fiyatlandırması · Üretim ülkesinde ödenen karbon bedeli · Türkiye'de pilot dönem 0",
      "9 · Belgeler ve kalite · Kanıt kayıtları, ölçüm sertifikaları · Arşivinizden",
      "10 · Özet · Ürün bazında SEE (tCO₂e/ton) · Sistem hesaplar"
    ]
  },
  {
    id: "kademe-b",
    title: "BÖLÜM 6 — Kademe B: Zorunlu SKDM dışı ama alıcı talepli sektörler",
    body: [
      "Plastik, kimya, cam, kâğıt, tekstil, batarya, mobilya, otomotiv yan sanayi, makine, beyaz eşya, gıda, lojistik ve yapı malzemeleri sektörleri SKDM'nin zorunlu Kademe A kapsamında değildir.",
      "Bu sektörler için hazırlanan çıktı **SKDM raporu değil**, ISO 14067 ve CSRD Kapsam 3 uyumlu bir **tedarikçi veri dosyasıdır**. Platformumuzda aynı 10 katmanlı kalite kontrolüyle hazırlanır."
    ],
    list: [
      "Düzenleme · Kimi ilgilendirir · Ne ister",
      "CSRD (Kapsam 3) · Büyük AB firmalarına satan herkes · Tedarikçi emisyon verisi",
      "Pil Tüzüğü 2023/1542 · Pil ve batarya içeren ürün üreticileri · Karbon ayak izi beyanı",
      "PPWR 2025/40 · Ambalaj üreticileri · Geri dönüşüm ve ayak izi verisi",
      "EUDR 2023/1115 · Ahşap, tarım ve gıda üreticileri · Ormansızlaşma beyanı",
      "ESPR / DPP · Tekstil, mobilya, elektronik · Dijital ürün pasaportu verisi"
    ]
  },
  {
    id: "dogrulama",
    title: "BÖLÜM 7 — Doğrulama: Denetime hazır olmak ne demek?",
    body: [
      "Kesin dönemde veriler bağımsız [akredite doğrulayıcı](/sozluk/#accredited-verifier) tarafından denetlenir. Doğrulayıcının ilk baktığı unsur kanıt izlenebilirliğidir.",
      "1. **İzlenebilirlik:** Her faaliyet verisinin faturası ve sayaç kaydı olmalıdır.",
      "2. **Tutarlılık:** [Kontrol denkliği](/sozluk/#kontrol-denkligi) (a = b+c+d) matematiksel olarak sağlanmalıdır.",
      "3. **Bütünlük:** Dosyalar [SHA-256 Dijital Mührü](/sozluk/#muhur) ile kilitlenmelidir."
    ]
  }
];
