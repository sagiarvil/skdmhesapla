export const MARITIME_ROUTES = [
  { href: "/denizcilik/", label: "Denizcilik" },
  { href: "/denizcilik/kapsam-kontrolu/", label: "Kapsam Kontrolü" },
  { href: "/denizcilik/eu-mrv/", label: "EU MRV" },
  { href: "/denizcilik/eu-ets/", label: "EU ETS" },
  { href: "/denizcilik/fueleu/", label: "FuelEU" },
  { href: "/denizcilik/cbam-ihracatci-masasi/", label: "CBAM İhracatçı Masası" },
] as const;

export const MARITIME_VALUE_CARDS = [
  {
    title: "EU MRV kapsam analizi",
    text: "Gemi, sefer, AB/EEA liman uğrağı ve veri kayıtlarının raporlama kapsamına etkisini hızlı görün.",
  },
  {
    title: "EU ETS maliyet yönetimi",
    text: "Sefer bazlı EUA maruziyetini, müşteri/ton/konteyner maliyet kırılımına çevirecek veri zeminini kurun.",
  },
  {
    title: "FuelEU Maritime hazırlığı",
    text: "Yakıt türü, enerji, WtW yoğunluğu ve uyum açığını belge kalitesiyle birlikte izleyin.",
  },
  {
    title: "CBAM ihracatçı kanalı",
    text: "Taşıdığınız CBAM kapsamlı ihracatçıları SKDMhesapla akışına yönlendiren partner masası oluşturun.",
  },
] as const;

export const MARITIME_COMPARISON = [
  ["Hedef firma", "Türk üretici / ihracatçı", "Gemi sahibi / ISM", "Gemi işletmecisi / charterer", "Gemi sahibi / işletmeci"],
  ["Ana karar", "Ürün CBAM kapsamında mı?", "Gemi ve sefer MRV kapsamında mı?", "EUA maliyeti kimde ve ne kadar?", "Yakıt yoğunluğu uyumda mı?"],
  ["Girdi", "GTİP, üretim, enerji, precursor", "Gemi, GT, sefer, liman uğrağı", "Yakıt, rota, scope, faz oranı", "Yakıt, enerji, GHG yoğunluğu"],
  ["Çıktı", "CBAM çalışma dosyası", "MRV veri ve kanıt hazırlığı", "ETS maliyet ve tahsis planı", "FuelEU uyum açığı"],
  ["Gelir modeli", "Rapor / paket", "Ön analiz + yıllık takip", "Maliyet yönetimi", "Yıllık uyum yönetimi"],
] as const;
