/** Auto from docs/sayfa-icerik-nasil-calisir.md — Plan 21. */
export type NasilStep = {
  id: string;
  title: string;
  innerVoice?: string;
  bullets: string[];
};

export const NASIL_UST_BANT = {
  badge: "**Mühür öncesi her şey ücretsiz — kart bilgisi istenmez.**",
  body: "Taslak oluşturma, tüm katmanlar, yardım panelleri, rehber ve sözlük tamamen ücretsizdir. Ödeme yalnızca dosyanızı mühürleyip indirirken, tek seferlik 9.900 ₺ (KDV dahil).",
};

export const NASIL_STEPS: NasilStep[] = [
  {
    id: "adim-0",
    title: "ADIM 0 — Triyaj: Ne yapacağımı bilmiyorum",
    innerVoice: "Müşterim benden bir şey istedi ama ne istediğini anlamadım.",
    bullets: [
      "**Ne yaparsınız:** Size ne ulaştığını seçersiniz: e-posta / Excel dosyası / PDF-form / sözlü talep / hiçbir şey / bilmiyorum.",
      "**Ne kazanırsınız:** Sistem, elinizdeki talebe göre sizi doğru katmanlara yönlendirir; gereksiz hiçbir soru sorulmaz.",
      "**Süre:** 2 dakika.",
    ],
  },
  {
    id: "adim-1",
    title: "ADIM 1 — Firma ve dönem: Bu bilgiyi nereden bulacağım?",
    innerVoice: "UNLOCODE nedir, benimki ne?",
    bullets: [
      "**Ne yaparsınız:** Firma unvanı, tesis adı ve adresi, beyan dönemi. Her alanın yanındaki `(?)` paneli belgeyi kimin vereceğini söyler.",
      "**Ne kazanırsınız:** Dosyanızın resmi kimliği kurulur.",
      "**Süre:** 3 dakika.",
    ],
  },
  {
    id: "adim-2",
    title: "ADIM 2 — Mal kategorileri: Doğru şeyi mi seçiyorum?",
    innerVoice: "GTİP kodumu bilmiyorum ki.",
    bullets: [
      '**Ne yaparsınız:** Arama kutusuna ürününüzü yazarsınız; sistem CN kodunu önerir.',
      "**Ne kazanırsınız:** Dosyanızın hangi resmi kategorilere girdiği kesinleşir.",
      "**Süre:** 2 dakika.",
    ],
  },
  {
    id: "adim-3",
    title: "ADIM 3 — Üretim süreçleri: Fabrikayı nasıl anlatacağım?",
    bullets: [
      "**Ne yaparsınız:** Her ürün için üretim hattını basitçe tanımlarsınız; ara ürün bir yere satılıyor bir yere işleniyorsa sistem bunu otomatik iki sürece ayırır (bubble approach).",
      "**Süre:** 4 dakika.",
    ],
  },
  {
    id: "adim-4",
    title: "ADIM 4 — Kaynak akışları: Faturalarım yeterli mi?",
    bullets: [
      "**Ne yaparsınız:** Doğalgaz, elektrik, yakıt tüketimlerinizi fatura değerleriyle girersiniz.",
      "**Süre:** 5 dakika (faturalar elinizdeyse).",
    ],
  },
  {
    id: "adim-5",
    title: "ADIM 5 — Üretim seviyesi: Rakamlar tutuyor mu?",
    bullets: [
      '**Ne yaparsınız:** Dönemlik üretim miktarını ve dağılımını girersiniz; sistem toplamı canlı denetler (a = b+c+d). Tutmazsa kırmızı değil, **sarı** uyarı: "gözden geçirin".',
      "**Süre:** 3 dakika.",
    ],
  },
  {
    id: "adim-6",
    title: "ADIM 6 — Öncül maddeler: Bunu kimden isteyeceğim?",
    bullets: [
      '**Ne yaparsınız:** Hammadde girdilerinizi seçersiniz; tedarikçiden veri gerekiyorsa "Talep oluştur" butonu hazır e-posta metnini panonuza kopyalar.',
      "**Süre:** 3 dakika + tedarikçi cevabı (sistem beklerken taslağınızı saklar).",
    ],
  },
  {
    id: "adim-7",
    title: "ADIM 7 — Doğrulayıcı: Denetçi bulmam gerekir mi?",
    bullets: [
      '**Ne yaparsınız:** Varsa doğrulayıcınızı girersiniz; yoksa "henüz yok" dersiniz — sistem bunu dosyaya not düşer, engellemez.',
      "**Süre:** 1 dakika.",
    ],
  },
  {
    id: "adim-8",
    title: "ADIM 8 — Karbon fiyatlandırması: Türkiye'de karbon bedeli ödüyor muyuz?",
    bullets: [
      '**Ne yaparsınız:** Varsa ulusal karbon fiyatı/ETS kapsamını işaretlersiniz; çoğu Türk üretici için cevap "yok" — tek dokunuş.',
      "**Süre:** 1 dakika.",
    ],
  },
  {
    id: "adim-9",
    title: "ADIM 9 — Belgeler: Bir şey eksik mi?",
    bullets: [
      '**Ne yaparsınız:** Fatura, sayaç okuma, tedarikçi yazısı gibi kanıtları listelersiniz; "Şu anda eksik" paneli her an günceldir.',
      "**Süre:** 3 dakika.",
    ],
  },
  {
    id: "adim-10",
    title: "ADIM 10 — Nihai inceleme ve mühür: Bitirdim mi?",
    bullets: [
      "**Ne yaparsınız:** Hazırlık skoru %100'e ulaşınca mühürleme açılır; tek seferlik 9.900 ₺ ödeme sonrası 6 dosyalık mühürlü paket iner.",
      "**Süre:** 2 dakika.",
    ],
  },
];

export const NASIL_ALT_BANT = [
  "Kaldığınız yerden devam: taslak her 10 saniyede saklanır, tarayıcı kapansa bile.",
  "Yanlış yapmaktan korkmayın: sistem eksikleri sarıyla gösterir; onaylı dil: eksik, tamamlanmadı, gözden geçirin.",
  "Toplam süre: ortalama 20–30 dakika (belgeler elinizdeyse).",
];
