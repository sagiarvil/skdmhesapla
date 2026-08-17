/** Auto from docs/sayfa-icerik-rehber.md — Plan 28 Stratejik Görev Ayrımı. */
import { SITE } from "../site-config";

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
      "Bu sektörler için hazırlanan çıktı **SKDM raporu değil**, ISO 14067 ve CSRD Kapsam 3 uyumlu bir **tedarikçi veri dosyasıdır**. Ayrıntılı düzenleme rehberleri için: [AB Tedarikçi Veri Merkezi](/tedarikci-verisi/)."
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

/** Plan 29 — kesin dönem derinleşme bölümleri */
export const REHBER_SECTIONS_YENI: RehberSection[] = [
  {
    id: "sertifika-takvimi",
    title: "BÖLÜM 8 — Sertifika takvimi: fiyatlar, satış ve teslim tarihleri",
    body: [
      "Sertifika fiyatı AB ETS ihale fiyatlarına bağlıdır ve Komisyon tarafından resmi olarak yayımlanır. **Yayımlanan ilk fiyatlar: 2026 Q1 = 75,36 €/tCO₂e (7 Nisan 2026), Q2 = 75,28 €/tCO₂e (6 Temmuz 2026).** Q3 fiyatı 5 Ekim 2026'da, Q4 fiyatı 4 Ocak 2027'de yayımlanır.",
      "**2026 için fiyat çeyreklik ortalama, 2027'den itibaren haftalık ortalama** olarak hesaplanır. Satın alınan sertifikanın fiyatı sabitlenir; ETS sonradan yükselse de aldığınız sertifika etkilenmez.",
      "Sertifikalar şirketler arasında **alınamaz satılamaz** — ikincil piyasa yoktur. Fazla alınan sertifika ancak yetkili otoriteye, alış fiyatından ve sınırlı oranda geri satılabilir ([geri alım](/sozluk/#repurchase))."
    ],
    list: [
      "Tarih · Ne oluyor",
      "1 Ocak 2026 · Kesin dönem başladı; ithalat mali yükümlülük doğuruyor",
      "31 Mart 2026 · Yetkili beyan sahibi başvurusu için son tarih (bu tarihe kadar başvuran, inceleme sürerken ithalata devam edebildi)",
      "7 Nisan 2026 · İlk resmi fiyat: 75,36 € (Q1 2026)",
      "6 Temmuz 2026 · Q2 2026 fiyatı: 75,28 €",
      "5 Ekim 2026 · Q3 2026 fiyatı yayımlanır",
      "4 Ocak 2027 · Q4 2026 fiyatı yayımlanır",
      "1 Şubat 2027 · Sertifika satışları merkezi platformda açılır",
      "30 Eylül 2027 · İlk yıllık beyan + sertifika teslimi (2026 ithalatı için)",
      "Her çeyrek sonu (2027'den itibaren) · Yıl içi ithalatın en az %50'si kadar sertifika hesapta bulundurulur"
    ]
  },
  {
    id: "beyan-sahibi",
    title: "BÖLÜM 9 — Yetkili beyan sahibi ve Registry: alıcınızın dünyası",
    body: [
      "SKDM yükümlülüğü AB tarafındadır: alıcınız (veya dolaylı gümrük temsilcisi) [yetkili beyan sahibi](/sozluk/#declarant) statüsüne başvurur, [Registry](/sozluk/#registry)'de hesap açar, yıllık beyanı verir ve sertifikaları teslim eder.",
      "**Sizi ilgilendiren kısım:** Registry'de üçüncü ülke üreticileri için ayrı bir bölüm var (Md. 27A). Tesisinizi ve doğrulanmış emisyon verinizi buraya bir kez kaydederek birden çok alıcıyla paylaşabilirsiniz — her alıcıya ayrı Excel gönderme dönemi biter.",
      "**Alıcınızdan ne isteyeceksiniz:** Beyan sahibi başvurusunu yaptı mı? Veriyi Registry üzerinden mi yoksa dosya olarak mı istiyor? Beyan için son iç teslim tarihi nedir? Bu üç sorunun cevabı sizin takviminizi belirler."
    ]
  },
  {
    id: "varsayilan-degerler",
    title: "BÖLÜM 10 — Varsayılan değerler ve mark-up: veri vermezseniz ne olur?",
    body: [
      "Gerçek veri sağlayamazsanız alıcınız, Komisyonun ülke ve ürün bazlı [varsayılan değerlerini](/sozluk/#default-values) kullanmak zorunda kalır. Kesin dönemde bu değerlere artırım uygulanır ([mark-up](/sozluk/#markup)):",
      "**Önemli ayrıntı:** varsayılan değerler geçiş dönemindekilerden farklı ve genelde daha yüksektir (örnek: Çin çelik slab geçişte ~1,89 iken kesin dönemde 3,167 tCO₂e/t). 'Geçiş döneminde böyle beyan ettik' diyen alıcınız 2026'da ciddi farkla karşılaşır.",
      "**Öncül maddede ülke bilinmiyorsa ceza kuralı:** tedarikçinizin üretim ülkesini beyan edemezseniz, o öncül için tanımlı **en yüksek emisyonlu ülkenin** varsayılanı uygulanır. 'Bilmiyorum' en pahalı cevaptır.",
      "Gerçek veriye sonradan geçiş mümkündür: izleme planı + doğrulama raporu tamamsa bir sonraki beyan döneminden itibaren gerçek veri kullanılır; önceki beyanlar geriye dönük değişmez."
    ],
    list: [
      "Yıl · Çelik, çimento, alüminyum, hidrojen · Gübre",
      "2026 · ülke ortalaması +%10 · +%1",
      "2027 · ülke ortalaması +%20 · +%1",
      "2028 ve sonrası · ülke ortalaması +%30 · +%1"
    ]
  },
  {
    id: "cezalar",
    title: "BÖLÜM 11 — Cezalar ve riskler: tablonun tamamı",
    body: [
      "Ceza rejimi alıcınızı bağlar ama faturası size döner: yanlış veya geç veri, alıcınızın ceza riskini büyütür ve ticari ilişkiyi doğrudan zedeler.",
      "1. **Teslim edilmeyen her ton için 100 €** idari ceza + eksik sertifikanın yine de tamamlanması.",
      "2. **Çeyreklik %50 bulundurma** her çeyrekte ayrı denetlenir; yıl sonunda tamamlayacağım demek yetmez.",
      "3. **Hileli veya esaslı yanlış beyan:** yetkili statüsünün iptali, gümrük yaptırımları ve üye devlet hukukuna göre cezai sorumluluk gündeme gelebilir.",
      "4. **İndirim halleri:** 50 ton eşiğinin %10'a kadar aşılması veya doğrulanmış üçüncü taraf hatasından kaynaklanan yanlışlıklarda ceza indirilebilir.",
      "Sizin tarafınızda riski sıfırlayan üç alışkanlık: kanıtı olan veri, tutan kontrol denkliği, mühürlü dosya."
    ]
  },
  {
    id: "mahsup-tr-ets",
    title: "BÖLÜM 12 — Mahsup ve TR-ETS: Türkiye'de ödenen karbon bedeli var mı?",
    body: [
      "Tüzük Md. 9: üretim ülkesinde **fiilen ödenmiş** zorunlu karbon fiyatı, sertifika yükümlülüğünden düşülür.",
      "**Türkiye'nin durumu:** [TR-ETS](/sozluk/#tr-ets) pilot dönemi (2026-2027) çimento, demir-çelik, alüminyum ve gübrede 50.000 tCO₂e üzeri tesisleri kapsar; tahsis %100 bedelsizdir. Yani **fiilen ödenen karbon fiyatı sıfırdır ve mahsup 0 girilir.** Sihirbazın 8. adımında bu alan sabit açıklamayla gösterilir — değiştirmeye çalışmayın.",
      "İleride TR-ETS ücretli tahsise geçerse ve ödeme kanıtlanabilirse mahsup o zaman anlamlı hale gelir; kuralları 2027'de netleşecek."
    ]
  },
  {
    id: "genisleme-2028",
    title: "BÖLÜM 13 — 2028 kapsam genişlemesi: makine ve otomotiv ihracatçısı dikkat",
    body: [
      "Komisyonun Aralık 2025'te kabul ettiği öneri yasalaşırsa, **1 Ocak 2028'den itibaren yaklaşık 180 çelik ve alüminyum ağırlıklı nihai ürün** (makine, araç parçaları, beyaz eşya bileşenleri gibi) SKDM kapsamına girecek.",
      "Bu, bugün Kademe B'de olan bazı sektörlerin 2028'de Kademe A'ya taşınması demektir. Makine, otomotiv yan sanayi ve elektrikli cihaz ihracatçısıysanız tedarikçi veri dosyanızı şimdiden kurmanız, 2028'de zorunlu altyapınızın hazır olmasını sağlar.",
      "Takip etmeniz gereken sinyal: önerinin AB Resmi Gazetesi'nde yayımlanması. Yayımlandığında bu rehber güncellenir."
    ]
  },
  {
    id: "sss",
    title: "BÖLÜM 14 — Sık sorulanlar (kısa cevaplar)",
    body: [
      "**Sertifikayı ben mi alacağım?** Hayır. Sertifikayı AB'li alıcınız alır ve teslim eder; siz doğrulanabilir emisyon verisi sağlarsınız.",
      "**Alıcım 50 tonun altında kalıyorsa?** O yıl için yükümlülük doğmaz (elektrik ve hidrojen hariç). Eşik alıcının yıllık toplamına bakar, tek sevkiyata değil.",
      "**Veri vermezsem ne olur?** Alıcınız varsayılan değer + mark-up ile beyan eder; maliyet genellikle belirgin yükselir ve ticari olarak size yansır.",
      "**Gerçek verim varsayılandan kötüyse?** Olabilir (özellikle entegre BF-BOF rotada). Sistem iki senaryoyu da gösterir; hangi yolun kullanılacağına veriyle karar verilir.",
      "**Alüminyumda elektrik tüketimim maliyeti patlatır mı?** Hayır. Ek II gereği alüminyumda yalnızca doğrudan emisyonlar fiyatlanır; elektrik (dolaylı emisyon) maliyete girmez.",
      "**Hurda kullanıyorum, ne beyan edeceğim?** Hurda kapsam dışıdır (CN 7204) ve sıfır gömülü emisyon sayılır; EAF tesisinde öncül kaydınız çoğu zaman yalnızca ferro-alaşımlardır.",
      "**Doğrulayıcıyı ben mi buluyorum?** Gerçek veri kullanacaksanız evet — akredite bir doğrulayıcıyla sözleşme sizde olur. Varsayılan değerle gidilirse doğrulama gerekmez ama maliyet yükselir.",
      "**ISO 14064 belgem var, yeterli mi?** Hayır. SKDM doğrulaması ayrı bir akreditasyon kapsamıdır; belge destekleyici kanıt olur, ikame olmaz.",
      "**Birden çok AB alıcım var, hepsine ayrı mı dosya?** Registry'nin işletmeci bölümüne (Md. 27A) verinizi bir kez kaydedip tüm alıcılarla paylaşabilirsiniz.",
      "**Sektörüm kapsamda değil ama alıcım veri istiyor?** Bu CSRD/Kapsam 3 talebidir; SKDM raporu değil, ISO 14067 mantığında tedarikçi veri dosyası hazırlanır (Bölüm 6).",
      "**Beyan ne zaman?** İlk yıllık beyan 30 Eylül 2027'de, 2026 ithalatını kapsar. Ama veri toplama ve doğrulama aylar sürer — 2026 içinde hazırlanmak gerekir.",
      "**Mühürlü dosyamı alıcım nasıl doğrular?** Paketteki manifest ve doğrulama belgesiyle /dogrula/ sayfasından SHA-256 eşleştirmesi yapar.",
      "**Dosyamda hata bulunursa?** " + SITE.resealPublicCopy + " Alıcınıza düzeltilmiş paketi iletirsiniz.",
      "**SKDM bir vergi mi?** Hayır — sertifika tabanlı bir fiyatlandırma mekanizmasıdır. Resmi yazışmalarda 'karbon vergisi' ifadesini kullanmayın."
    ]
  }
];

export const REHBER_SECTIONS_ALL: RehberSection[] = [
  ...REHBER_SECTIONS,
  ...REHBER_SECTIONS_YENI,
];
