// GTİP bilmeyen kullanıcı akışı (Ek G §20). Liste genişletilebilir; yapı sabit.
export interface GtipOneri {
  anahtar: string[];      // küçük harf, Türkçe karakter serbest arama anahtarları
  urunAdi: string;        // kullanıcının gördüğü ad
  cnKodu: string;         // önerilen 8 haneli CN kodu
  sektorSlug: string;     // /hesapla/{sektorSlug}/ hedefi
  kademe: "A" | "B";
}

export const GTIP_VERISI: GtipOneri[] = [
  // KADEME A
  { anahtar: ["inşaat demiri", "insaat demiri", "rebar", "nervürlü demir"], urunAdi: "İnşaat demiri (nervürlü)", cnKodu: "7214 20 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["profil", "kutu profil", "boru profil", "npu", "ipe"], urunAdi: "Çelik profil", cnKodu: "7216 61 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["sac", "rulo sac", "galvaniz sac", "levha"], urunAdi: "Yassı çelik / sac", cnKodu: "7208 39 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["boru", "çelik boru", "celik boru"], urunAdi: "Çelik boru", cnKodu: "7306 30 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["vida", "civata", "somun", "bağlantı elemanı"], urunAdi: "Bağlantı elemanları (vida, civata)", cnKodu: "7318 15 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["külçe alüminyum", "kulce aluminyum", "alüminyum külçe", "ingot"], urunAdi: "Külçe alüminyum", cnKodu: "7601 10 10", sektorSlug: "aluminyum", kademe: "A" },
  { anahtar: ["alüminyum profil", "aluminyum profil", "alüminyum ekstrüzyon"], urunAdi: "Alüminyum profil", cnKodu: "7604 21 00", sektorSlug: "aluminyum", kademe: "A" },
  { anahtar: ["alüminyum levha", "alüminyum sac", "alüminyum folyo"], urunAdi: "Alüminyum levha/folyo", cnKodu: "7606 12 00", sektorSlug: "aluminyum", kademe: "A" },
  { anahtar: ["çimento", "cimento", "portland"], urunAdi: "Portland çimentosu", cnKodu: "2523 29 00", sektorSlug: "cimento", kademe: "A" },
  { anahtar: ["klinker"], urunAdi: "Klinker", cnKodu: "2523 10 00", sektorSlug: "cimento", kademe: "A" },
  { anahtar: ["üre", "ure", "üre gübresi"], urunAdi: "Üre", cnKodu: "3102 10 00", sektorSlug: "gubre", kademe: "A" },
  { anahtar: ["amonyak"], urunAdi: "Amonyak", cnKodu: "2814 10 00", sektorSlug: "gubre", kademe: "A" },
  { anahtar: ["nitrik asit"], urunAdi: "Nitrik asit", cnKodu: "2808 00 00", sektorSlug: "gubre", kademe: "A" },
  { anahtar: ["npk", "kompoze gübre", "karma gübre"], urunAdi: "NPK kompoze gübre", cnKodu: "3105 20 00", sektorSlug: "gubre", kademe: "A" },
  { anahtar: ["hidrojen"], urunAdi: "Hidrojen", cnKodu: "2804 10 00", sektorSlug: "hidrojen", kademe: "A" },
  { anahtar: ["elektrik", "elektrik enerjisi"], urunAdi: "Elektrik enerjisi", cnKodu: "2716 00 00", sektorSlug: "elektrik", kademe: "A" },
  // KADEME B (alıcı talepli — çıktı tedarikçi veri dosyasıdır)
  { anahtar: ["batarya", "pil", "akü", "lityum"], urunAdi: "Batarya / pil", cnKodu: "8507 60 00", sektorSlug: "batarya", kademe: "B" },
  { anahtar: ["ambalaj", "koli", "kutu"], urunAdi: "Ambalaj", cnKodu: "—", sektorSlug: "ambalaj", kademe: "B" },
  { anahtar: ["tekstil", "kumaş", "konfeksiyon", "giyim"], urunAdi: "Tekstil / konfeksiyon", cnKodu: "—", sektorSlug: "tekstil", kademe: "B" },
  { anahtar: ["cam", "düz cam", "cam levha"], urunAdi: "Cam", cnKodu: "—", sektorSlug: "cam", kademe: "B" },
  { anahtar: ["plastik", "polimer", "pet"], urunAdi: "Plastik / polimer", cnKodu: "—", sektorSlug: "plastik", kademe: "B" },
  { anahtar: ["makine", "ekipman", "yedek parça"], urunAdi: "Makine / ekipman", cnKodu: "—", sektorSlug: "makine", kademe: "B" },
  { anahtar: ["otomotiv", "yan sanayi"], urunAdi: "Otomotiv yan sanayi", cnKodu: "—", sektorSlug: "otomotiv", kademe: "B" },
  { anahtar: ["mobilya"], urunAdi: "Mobilya", cnKodu: "—", sektorSlug: "mobilya", kademe: "B" },
  { anahtar: ["kağıt", "kagit", "mukavva", "oluklu"], urunAdi: "Kağıt / oluklu mukavva", cnKodu: "—", sektorSlug: "kagit", kademe: "B" },
  { anahtar: ["gıda", "gida", "tarım", "tarim"], urunAdi: "Gıda & tarım", cnKodu: "—", sektorSlug: "gida", kademe: "B" },
  { anahtar: ["lojistik", "nakliye"], urunAdi: "Uluslararası lojistik", cnKodu: "—", sektorSlug: "lojistik", kademe: "B" },
  { anahtar: ["kimya", "kimyasal"], urunAdi: "Kimya sanayi", cnKodu: "—", sektorSlug: "kimya", kademe: "B" },
  { anahtar: ["elektronik", "elektrikli cihaz"], urunAdi: "Elektronik", cnKodu: "—", sektorSlug: "elektronik", kademe: "B" },
  { anahtar: ["yapı malzemesi", "yapi malzemesi", "tuğla", "seramik"], urunAdi: "Yapı malzemeleri", cnKodu: "—", sektorSlug: "yapi", kademe: "B" },
];

export function gtipAra(sorgu: string): GtipOneri[] {
  const q = sorgu.trim().toLocaleLowerCase("tr");
  if (q.length < 2) return [];
  return GTIP_VERISI.filter((g) =>
    g.anahtar.some((a) => a.includes(q) || q.includes(a)) ||
    g.urunAdi.toLocaleLowerCase("tr").includes(q)
  ).slice(0, 6);
}
