/**
 * Kademe B/C çıktısı — Tedarikçi Karbon Veri Dosyası (ISO 14067, cradle-to-gate).
 * Şablon: ornek-Tedarikci-Karbon-Veri-Dosyasi.pdf (12 bölüm, 14 sayfa).
 * SKDM raporu değildir; CBAM beyanı değildir.
 */
import crypto from "crypto";
import {
  paginateRichLines,
  richPagesToPdfBytes,
  type PdfLine,
} from "../seal-binary";
import type { GoodRow, PrecRow, StreamRow } from "../session-store";
import type { SectorBenchmark } from "../config";

export const TKD_ENGINE_VERSION = "tierb-calc-v2026.1";
export const TKD_FILENAME = "Tedarikci-Karbon-Veri-Dosyasi.pdf";

export type TkdMenşe = "Birincil" | "Geri dönüşüm";
export type TkdKalite = "A" | "B" | "C" | "D";

export type TkdMalzeme = {
  ad: string;
  miktarKg: number;
  mense: TkdMenşe;
  faktorKgPerTon: number;
  proxy?: boolean;
  proxyNotu?: string;
};

export type TkdAmbalaj = {
  ad: string;
  miktarKg: number;
  mense: TkdMenşe;
  kgCo2e: number;
};

export type TkdYakit = {
  ad: string;
  miktar: number;
  ncv: string;
  ncvVarsayim: boolean;
  kgCo2e: number;
};

export type TkdKanit = {
  elektrikFatura: boolean;
  yakitFatura: boolean;
  uretimKaydi: boolean;
  tedarikciBeyaniAdet: number;
};

export type TkdGirdi = {
  packageId: string;
  timestamp: string;
  packageHash: string;
  firma: string;
  vkn: string;
  tesisAdi: string;
  tesisAdresi: string;
  ulke: string;
  faaliyetAlani: string;
  yetkili: string;
  yetkiliEposta: string;
  alici: string;
  urunAdi: string;
  cnKodu: string;
  fonksiyonelBirim: string;
  netAgirlikKg: number;
  uretimMiktari: number;
  yil: number;
  elektrikKwh: number;
  elektrikFaktorKgPerKwh: number;
  sebekebaglantisi: string;
  yakitlar: TkdYakit[];
  tahsisOrani: number;
  tahsisYontemi: string;
  malzemeler: TkdMalzeme[];
  ambalajlar: TkdAmbalaj[];
  kanit: TkdKanit;
  kaynaklarKullanildi: ("EVCED" | "IPCC" | "DEFRA")[];
};

export type TkdHesap = {
  malzemeAraToplam: number;
  ambalajToplam: number;
  tesisKapsam1: number;
  tesisKapsam2: number;
  kapsam1Birim: number;
  kapsam2Birim: number;
  kapsam3MalzemeBirim: number;
  kapsam3AmbalajBirim: number;
  toplamBirim: number;
  toplamBirimGosterim: number;
  pay1: number;
  pay2: number;
  pay3: number;
  kalite: TkdKalite;
  kaliteMetin: string;
};

const round4 = (n: number) => Math.round(n * 10000) / 10000;
const round3 = (n: number) => Math.round(n * 1000) / 1000;
const round2 = (n: number) => Math.round(n * 100) / 100;
const trNum = (n: number, d = 2) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
const trTarih = (iso: string) =>
  new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const KALITE_METIN: Record<TkdKalite, string> = {
  A: "Tesis enerji ve uretim verileri belgeli + malzemelerin en az yarisi tedarikci verisi",
  B: "Tesis enerji ve uretim verileri belgeli olcum; malzemeler referans veri",
  C: "Tesis verilerinin bir kismi belgeli",
  D: "Kanit belgesi yok; kullanici beyani",
};

const SINIR_SATIRLARI: [string, string, string][] = [
  ["Hammadde cikarimi ve uretimi", "Dahil", "Kapsam 3 -- malzeme faktorleri"],
  ["Hammadde nakliyesi (satis noktasina)", "Dahil", "Malzeme faktorlerinin icinde"],
  ["Tesis ici enerji (yakit)", "Dahil", "Kapsam 1"],
  ["Tesis ici elektrik", "Dahil", "Kapsam 2"],
  ["Ambalaj malzemesi", "Dahil", "Kapsam 3"],
  ["Urunun musteriye nakliyesi", "Haric", "Alici tarafinda raporlanir"],
  ["Kullanim asamasi", "Haric", "Cradle-to-gate disi"],
  ["Omur sonu / atik", "Haric", "Cradle-to-gate disi"],
  ["Kacinilan yuk (avoided burden)", "Haric", "Faktor kaynagi bu yaklasimi kullanmaz"],
];

export function tureKalite(g: TkdGirdi): TkdKalite {
  const enerji = g.kanit.elektrikFatura || g.kanit.yakitFatura;
  const uretim = g.kanit.uretimKaydi;
  if (!enerji && !uretim) return "D";
  if (!enerji || !uretim) return "C";
  const n = g.malzemeler.length;
  if (n > 0 && g.kanit.tedarikciBeyaniAdet * 2 >= n) return "A";
  return "B";
}

export function hesaplaTkd(g: TkdGirdi): TkdHesap {
  const malzemeAraToplam = round3(
    g.malzemeler.reduce((s, m) => s + (m.miktarKg * m.faktorKgPerTon) / 1000, 0)
  );
  const ambalajToplam = round3(g.ambalajlar.reduce((s, a) => s + a.kgCo2e, 0));
  const tesisKapsam2 = round2(g.elektrikKwh * g.elektrikFaktorKgPerKwh);
  const tesisKapsam1 = round2(g.yakitlar.reduce((s, y) => s + y.kgCo2e, 0));
  const bol = g.uretimMiktari > 0 ? g.uretimMiktari : 1;
  const t = g.tahsisOrani;
  const kapsam1Birim = round4((tesisKapsam1 * t) / bol);
  const kapsam2Birim = round4((tesisKapsam2 * t) / bol);
  const kapsam3MalzemeBirim = malzemeAraToplam;
  const kapsam3AmbalajBirim = ambalajToplam;
  const toplamBirim = round4(
    kapsam1Birim + kapsam2Birim + kapsam3MalzemeBirim + kapsam3AmbalajBirim
  );
  const pay1 = toplamBirim > 0 ? round2((kapsam1Birim / toplamBirim) * 100) : 0;
  const pay2 = toplamBirim > 0 ? round2((kapsam2Birim / toplamBirim) * 100) : 0;
  const pay3 = round2(Math.max(0, 100 - pay1 - pay2));
  const kalite = tureKalite(g);
  return {
    malzemeAraToplam,
    ambalajToplam,
    tesisKapsam1,
    tesisKapsam2,
    kapsam1Birim,
    kapsam2Birim,
    kapsam3MalzemeBirim,
    kapsam3AmbalajBirim,
    toplamBirim,
    toplamBirimGosterim: round2(toplamBirim),
    pay1,
    pay2,
    pay3,
    kalite,
    kaliteMetin: KALITE_METIN[kalite],
  };
}

export function tkdCanonicalBytes(g: TkdGirdi): Uint8Array {
  const r = hesaplaTkd(g);
  const payload = JSON.stringify({
    v: TKD_ENGINE_VERSION,
    id: g.packageId,
    ts: g.timestamp,
    firma: g.firma,
    urun: g.urunAdi,
    r,
    malzeme: g.malzemeler,
    ambalaj: g.ambalajlar,
    yakit: g.yakitlar,
    elektrikKwh: g.elektrikKwh,
    elektrikFaktor: g.elektrikFaktorKgPerKwh,
    tahsis: g.tahsisOrani,
    uretim: g.uretimMiktari,
  });
  return new TextEncoder().encode(payload);
}

export function tkdSha256(g: TkdGirdi): string {
  return `sha256:${crypto.createHash("sha256").update(tkdCanonicalBytes(g)).digest("hex")}`;
}

const sec = (text: string): PdfLine => ({ type: "section", text });
const kv = (key: string, val: string): PdfLine => ({ type: "kv", key, val });
const tblH = (...cols: string[]): PdfLine => ({ type: "table-h", cols });
const tblR = (even: boolean, ...cols: string[]): PdfLine => ({
  type: "table-r",
  cols,
  even,
});
const metric = (label: string, value: string): PdfLine => ({ type: "metric", label, value });
const bullet = (text: string): PdfLine => ({ type: "bullet", text });
const note = (text: string): PdfLine => ({ type: "note", text });
const body = (text: string): PdfLine => ({ type: "body", text });
const spacer = (): PdfLine => ({ type: "spacer" });

export function buildTkdLines(g: TkdGirdi): PdfLine[] {
  const r = hesaplaTkd(g);
  const birim = g.fonksiyonelBirim;
  const L: PdfLine[] = [];
  const donem = `01.01.${g.yil} - 31.12.${g.yil}`;

  L.push(
    spacer(),
    metric("Urun Karbon Ayak Izi Beyani -- cradle-to-gate", "Tedarikci Karbon Veri Dosyasi"),
    spacer(),
    metric(`Veri kalitesi: ${r.kalite}`, `${trNum(r.toplamBirimGosterim)} kg CO2e / ${birim}`),
    spacer(),
    kv("Urun", g.urunAdi),
    kv("Tesis", g.tesisAdi),
    kv("Donem", donem),
    kv("Fonksiyonel birim", birim),
    kv("Dosya no", g.packageId),
    spacer(),
    note(g.packageHash),
    spacer(),
    note("Bu dosya uretici beyanidir; bagimsiz dogrulama kurulusu tarafindan dogrulanmamistir. Ayrinti: Bolum 11.")
  );

  L.push(
    spacer(),
    sec("01 - OZET"),
    spacer(),
    tblH("Kapsam", "Kaynak", `kg CO2e / ${birim}`, "Pay"),
    tblR(false, "Kapsam 1 (dogrudan)", "Tesiste yakilan yakit", trNum(r.kapsam1Birim, 4), `%${trNum(r.pay1)}`),
    tblR(true, "Kapsam 2 (elektrik)", "Sebekeden cekilen elektrik", trNum(r.kapsam2Birim, 4), `%${trNum(r.pay2)}`),
    tblR(
      false,
      "Kapsam 3 (yukari akis)",
      "Satin alinan malzeme ve ambalaj",
      trNum(r.kapsam3MalzemeBirim + r.kapsam3AmbalajBirim, 4),
      `%${trNum(r.pay3)}`
    ),
    tblR(true, "TOPLAM", "", trNum(r.toplamBirim, 4), "%100,00"),
    spacer(),
    body(
      `Bu dosya, ${g.firma} tarafindan ${g.tesisAdi} tesisinde uretilen "${g.urunAdi}" urununun ${donem} donemine ait urun karbon ayak izini beyan eder. Hesaplama cradle-to-gate (hammadde cikarimindan fabrika cikisina kadar) sistem sinirinda yapilmistir.`
    ),
    spacer(),
    body(`Veri kalitesi derecesi: ${r.kalite}. ${r.kaliteMetin}.`)
  );

  L.push(
    spacer(),
    sec("02 - FIRMA VE TESIS KIMLIGI"),
    spacer(),
    kv("Isletme unvani", g.firma),
    kv("Vergi kimlik numarasi", g.vkn),
    kv("Tesis adi", g.tesisAdi),
    kv("Tesis adresi", g.tesisAdresi),
    kv("Ulke", g.ulke),
    kv("Faaliyet alani", g.faaliyetAlani),
    kv("Yetkili temsilci", `${g.yetkili} · ${g.yetkiliEposta}`),
    kv("Bu dosyanin hazirlandigi alici", g.alici)
  );

  L.push(
    spacer(),
    sec("03 - URUN TANIMI"),
    spacer(),
    kv("Urun adi", g.urunAdi),
    kv("GTIP / CN kodu", g.cnKodu),
    kv("Fonksiyonel birim", g.fonksiyonelBirim),
    kv("Urun net agirligi", `${trNum(g.netAgirlikKg)} kg`),
    kv("Donem uretim miktari", `${trNum(g.uretimMiktari, 0)} ${g.fonksiyonelBirim.replace(/^1\s+/, "")}`),
    spacer(),
    note("Fonksiyonel birim, tum emisyon sonuclarinin bolundugu referans miktardir. Bu dosyadaki tum degerler yukarida tanimli bir birim urun icindir.")
  );

  L.push(
    spacer(),
    sec("04 - SISTEM SINIRI"),
    spacer(),
    body("Hesaplama cradle-to-gate sistem sinirinda yapilmistir. Asagidaki tablo neyin dahil, neyin haric oldugunu acikca gosterir."),
    spacer(),
    tblH("Asama", "Durum", "Aciklama")
  );
  SINIR_SATIRLARI.forEach((row, i) => L.push(tblR(i % 2 === 0, ...row)));

  L.push(
    spacer(),
    sec("05 - MALZEME KOMPOZISYONU VE EMISYONU"),
    spacer(),
    tblH("Malzeme", "Miktar", "Mense", "Faktor (kg/t)", "kg CO2e")
  );
  if (g.malzemeler.length === 0) L.push(body("(kayit yok)"));
  g.malzemeler.forEach((m, i) => {
    const kg = round4((m.miktarKg * m.faktorKgPerTon) / 1000);
    L.push(
      tblR(
        i % 2 === 0,
        m.proxy ? `${m.ad} *` : m.ad,
        `${trNum(m.miktarKg)} kg`,
        m.mense,
        trNum(m.faktorKgPerTon),
        trNum(kg, 4)
      )
    );
  });
  L.push(tblR(false, "Malzeme ara toplami", "", "", "", trNum(r.malzemeAraToplam, 3)));
  L.push(spacer(), body("Ambalaj"), tblH("Malzeme", "Miktar", "Mense", "kg CO2e"));
  if (g.ambalajlar.length === 0) L.push(body("(kayit yok)"));
  g.ambalajlar.forEach((a, i) =>
    L.push(tblR(i % 2 === 0, a.ad, `${trNum(a.miktarKg)} kg`, a.mense, trNum(a.kgCo2e, 4)))
  );
  const proxyler = g.malzemeler.filter((m) => m.proxy);
  if (proxyler.length > 0) {
    L.push(spacer(), body("* Vekil (proxy) referans veri kullanilan malzemeler:"));
    proxyler.forEach((m) => L.push(note(m.proxyNotu || `${m.ad} -- vekil referans veri.`)));
  }

  L.push(
    spacer(),
    sec("06 - TESIS ENERJISI VE TAHSIS"),
    spacer(),
    body("Elektrik (Kapsam 2)"),
    kv("Tesis donem elektrik tuketimi", `${trNum(g.elektrikKwh, 0)} kWh`),
    kv("Sebeke baglanti tipi", g.sebekebaglantisi),
    kv("Uygulanan emisyon faktoru", `${trNum(g.elektrikFaktorKgPerKwh, 3)} kg CO2e/kWh`),
    kv("Tesis toplam Kapsam 2", `${trNum(r.tesisKapsam2)} kg CO2e`),
    spacer(),
    body("Yakit (Kapsam 1)"),
    tblH("Yakit", "Miktar", "NCV", "kg CO2e")
  );
  if (g.yakitlar.length === 0) L.push(body("(kayit yok)"));
  g.yakitlar.forEach((y, i) =>
    L.push(tblR(i % 2 === 0, y.ad, trNum(y.miktar, 0), y.ncv, trNum(y.kgCo2e)))
  );
  L.push(
    kv("Tesis toplam Kapsam 1", `${trNum(r.tesisKapsam1)} kg CO2e`),
    spacer(),
    body("Tahsis yontemi"),
    body(g.tahsisYontemi),
    spacer(),
    note("Tahsis, tesiste birden fazla urun uretildiginde tesis kaynakli emisyonun ilgili urune dusen payini belirler. Yontem ve gerekcesi yukarida beyan edilmistir.")
  );

  L.push(
    spacer(),
    sec("07 - SONUC TABLOSU"),
    spacer(),
    metric(`kg CO2e / ${birim}`, `${trNum(r.toplamBirimGosterim)}`),
    spacer(),
    tblH("Kalem", `Deger (kg CO2e / ${birim})`),
    tblR(false, "Kapsam 1 -- tesiste yakilan yakit", trNum(r.kapsam1Birim, 4)),
    tblR(true, "Kapsam 2 -- sebeke elektrigi", trNum(r.kapsam2Birim, 4)),
    tblR(false, "Kapsam 3 -- malzeme", trNum(r.kapsam3MalzemeBirim, 3)),
    tblR(true, "Kapsam 3 -- ambalaj", trNum(r.kapsam3AmbalajBirim, 3)),
    tblR(false, "TOPLAM", trNum(r.toplamBirim, 4))
  );

  L.push(
    spacer(),
    sec("08 - VERI KALITESI BEYANI"),
    spacer(),
    kv(`Derece ${r.kalite}`, r.kaliteMetin),
    spacer(),
    tblH("Derece", "Kosul"),
    tblR(false, "A", KALITE_METIN.A),
    tblR(true, "B", KALITE_METIN.B),
    tblR(false, "C", KALITE_METIN.C),
    tblR(true, "D", KALITE_METIN.D),
    spacer(),
    body("Kalem bazli veri kaynagi"),
    tblH("Kalem", "Veri kaynagi"),
    tblR(false, "Elektrik tuketimi", g.kanit.elektrikFatura ? "Fatura/sayac -- belgeli" : "Kullanici beyani"),
    tblR(true, "Yakit tuketimi", g.kanit.yakitFatura ? "Fatura/sayac -- belgeli" : "Kullanici beyani"),
    tblR(false, "Uretim miktari", g.kanit.uretimKaydi ? "Uretim kaydi -- belgeli" : "Kullanici beyani"),
    tblR(true, "Malzeme emisyon faktorleri", "Uluslararasi referans veri (bkz. Bolum 09)"),
    tblR(false, "Elektrik emisyon faktoru", "Turkiye resmi yayini (bkz. Bolum 09)"),
    spacer(),
    body("Dikkate alinmasi gereken notlar")
  );
  const ncvVarsayim = g.yakitlar.filter((y) => y.ncvVarsayim);
  if (ncvVarsayim.length > 0) {
    L.push(
      bullet(
        `${ncvVarsayim[0]!.ad} kalorifik degeri (NCV) faturadan girilmedi; ${ncvVarsayim[0]!.ncv} varsayimi kullanildi. Faturanizdaki degeri girerseniz sonuc kesinlesir.`
      )
    );
  }
  const proxyN = g.malzemeler.filter((m) => m.proxy).length;
  if (proxyN > 0) {
    L.push(
      bullet(
        `${proxyN} malzeme icin vekil (proxy) referans veri kullanildi. Tedarikcinizden urune ozgu karbon verisi alirsaniz dosyaniz guclenir.`
      )
    );
  }
  if (ncvVarsayim.length === 0 && proxyN === 0) {
    L.push(body("Kayda deger varsayim notu bulunmamaktadir."));
  }

  L.push(
    spacer(),
    sec("09 - METODOLOJI VE KAYNAKLAR"),
    spacer(),
    body("Hesaplama, faaliyet verisinin (malzeme miktari, enerji tuketimi) yayimlanmis emisyon faktorleriyle carpilmasi yontemine dayanir. Kullanilan her faktorun kaynagi asagida listelenmistir."),
    spacer(),
    body("Kullanilan kaynaklar")
  );
  if (g.kaynaklarKullanildi.includes("EVCED")) {
    L.push(
      bullet(
        "T.C. Enerji ve Tabii Kaynaklar Bakanligi (EVCED) -- Turkiye Elektrik Uretimi ve Elektrik Tuketim Noktasi Emisyon Faktorleri Bilgi Formu (ETKB-EVCED-FRM-042 Rev.01), veri yili 2023. Lisans: Kamu yayini."
      )
    );
  }
  if (g.kaynaklarKullanildi.includes("IPCC")) {
    L.push(
      bullet(
        "IPCC -- 2006 Guidelines for National GHG Inventories, Vol.2 Ch.1 Table 1.4, veri yili 2006. Lisans: Kamu yayini."
      )
    );
  }
  if (g.kaynaklarKullanildi.includes("DEFRA")) {
    L.push(
      bullet(
        "UK Department for Environment, Food & Rural Affairs (DEFRA/DESNZ) -- Government GHG Conversion Factors for Company Reporting 2025 -- Material use, veri yili 2025. Lisans: Open Government Licence v3.0."
      )
    );
  }
  L.push(
    spacer(),
    body("Kaynak kunyeleri"),
    tblH("Kaynak", "Metodoloji / lisans")
  );
  if (g.kaynaklarKullanildi.includes("EVCED")) {
    L.push(tblR(false, "T.C. Enerji ve Tabii Kaynaklar Bakanligi (EVCED)", "IEA Emisyon Faktorleri 2021 -- Kamu yayini"));
  }
  if (g.kaynaklarKullanildi.includes("IPCC")) {
    L.push(tblR(true, "IPCC", "Varsayilan yakit CO2 emisyon faktorleri -- Kamu yayini"));
  }
  if (g.kaynaklarKullanildi.includes("DEFRA")) {
    L.push(
      tblR(
        false,
        "UK DEFRA/DESNZ",
        "Cradle-to-gate, IPCC AR5 GWP, kacinilan yuk haric -- OGL v3.0"
      )
    );
  }
  L.push(
    spacer(),
    note("Malzeme emisyon faktorleri Birlesik Krallik kamu yayinindan alinmistir ve uluslararasi referans veri niteligindedir; Turkiye uretim kosullarini birebir yansitmayabilir. Elektrik emisyon faktoru Turkiye resmi yayinindan alinmistir ve ulkeye ozgudur.")
  );

  L.push(
    spacer(),
    sec("10 - KANIT BELGELERI"),
    spacer(),
    tblH("Belge turu", "Durum"),
    tblR(false, "Elektrik faturasi / sayac kaydi", g.kanit.elektrikFatura ? "Eklendi" : "Eklenmedi"),
    tblR(true, "Yakit faturasi / sayac kaydi", g.kanit.yakitFatura ? "Eklendi" : "Eklenmedi"),
    tblR(false, "Uretim kaydi", g.kanit.uretimKaydi ? "Eklendi" : "Eklenmedi"),
    tblR(true, "Tedarikci karbon beyani", `${g.kanit.tedarikciBeyaniAdet} adet`),
    spacer(),
    note("Kanit belgeleri bu dosyanin ekinde yer alir. Belge eklenmemis kalemler Bolum 08'de kullanici beyani olarak isaretlenmistir.")
  );

  L.push(
    spacer(),
    sec("11 - BEYAN VE SINIRLAR"),
    spacer(),
    body(
      `Bu dosya, ${g.firma} firmasinin kendi kayitlarina dayanan bir URETICI BEYANIDIR. Bagimsiz bir dogrulama kurulusu tarafindan dogrulanmamistir. Veri kalitesi her kalem icin ayri ayri Bolum 08'de beyan edilmistir. Bagimsiz dogrulama talep edilirse, buradaki kayit yapisi akredite bir dogrulayicinin incelemesine hazirdir.`
    ),
    spacer(),
    body("Bu dosya bir AB Sinirda Karbon Duzenleme Mekanizmasi (CBAM) beyani degildir ve o amacla kullanilamaz."),
    spacer(),
    body("Bu dosya sunlari yapmaz"),
    bullet("Herhangi bir resmi kuruma beyan gondermez."),
    bullet("Akredite dogrulama gorusu icermez."),
    bullet("Gumruk onayi veya tarife siniflandirma karari vermez."),
    bullet("Urunun bir mevzuata uygun oldugunu tasdik etmez."),
    spacer(),
    body("Beyan eden"),
    kv("Isletme", g.firma),
    kv("Yetkili", g.yetkili),
    kv("Tarih", trTarih(g.timestamp))
  );

  L.push(
    spacer(),
    sec("12 - BUTUNLUK VE SURUM"),
    spacer(),
    kv("Dosya numarasi", g.packageId),
    kv("Olusturma zamani", trTarih(g.timestamp)),
    kv("Hesaplama motoru", TKD_ENGINE_VERSION),
    spacer(),
    note(`Butunluk imzasi (SHA-256): ${g.packageHash}`),
    spacer(),
    body("Bu dosyanin icerigi olusturulduktan sonra degistirilemez. Yukaridaki imza degeri ile dosyanin degistirilmedigi bagimsiz olarak dogrulanabilir. Veriler guncellenirse yeni bir surum olusturulur; bu surum bozulmadan arsivde kalir.")
  );

  return L;
}

export function tedarikciKarbonDosyasiPdfBytes(g: TkdGirdi): Uint8Array {
  const pages = paginateRichLines(buildTkdLines(g));
  const r = hesaplaTkd(g);
  const plain = [
    "TEDARIKCI KARBON VERI DOSYASI",
    "Urun Karbon Ayak Izi Beyani -- cradle-to-gate",
    `Paket: ${g.packageId}`,
    `Firma: ${g.firma}`,
    `Urun: ${g.urunAdi}`,
    `Toplam: ${r.toplamBirim} kg CO2e / ${g.fonksiyonelBirim}`,
    `Kalite: ${r.kalite}`,
    `Hash: ${g.packageHash}`,
    "01 OZET",
    "02 FIRMA VE TESIS KIMLIGI",
    "03 URUN TANIMI",
    "04 SISTEM SINIRI",
    "05 MALZEME KOMPOZISYONU VE EMISYONU",
    "06 TESIS ENERJISI VE TAHSIS",
    "07 SONUC TABLOSU",
    "08 VERI KALITESI BEYANI",
    "09 METODOLOJI VE KAYNAKLAR",
    "10 KANIT BELGELERI",
    "11 BEYAN VE SINIRLAR",
    "12 BUTUNLUK VE SURUM",
  ].join("\n");
  return richPagesToPdfBytes(
    pages,
    {
      title: `${g.firma}  |  TEDARIKCI KARBON VERI DOSYASI`,
      footer: `${g.packageId}  |  skdmhesapla.com/dogrula/`,
    },
    plain
  );
}

/** Wizard kayitlarindan TKD girdisi -- eksik alan "Beyan edilmemis"; rakam uydurulmaz. */
export function buildTkdGirdisiFromWizard(opts: {
  sector: SectorBenchmark;
  fieldValues: Record<string, string>;
  goods: GoodRow[];
  streams: StreamRow[];
  precs: PrecRow[];
  uretimMiktari: number;
  timestamp: string;
  packageId: string;
}): TkdGirdi {
  const fv = opts.fieldValues;
  const g0 = opts.goods[0];
  const elektrik = opts.streams.find((s) => /elektrik|kwh|mwh/i.test(`${s.name} ${s.unit}`));
  const yakitlar: TkdYakit[] = opts.streams
    .filter((s) => s !== elektrik)
    .map((s) => ({
      ad: s.name,
      miktar: s.ad,
      ncv: s.ncv && s.ncv !== "-" ? `${s.ncv} MJ` : "Beyan edilmemis",
      ncvVarsayim: !s.ncv || s.ncv === "-",
      kgCo2e: 0,
    }));
  const base: TkdGirdi = {
    packageId: opts.packageId,
    timestamp: opts.timestamp,
    packageHash: "",
    firma: fv.vFirma?.trim() || "Beyan edilmemis isletme",
    vkn: fv.vkn?.trim() || "Beyan edilmemis",
    tesisAdi: fv.tesisAdiEN?.trim() || fv.vFirma?.trim() || opts.sector.name,
    tesisAdresi: fv.adres?.trim() || "Beyan edilmemis",
    ulke: "Turkiye",
    faaliyetAlani: opts.sector.description,
    yetkili: fv.yetkili?.trim() || "Beyan edilmemis",
    yetkiliEposta: fv.eposta?.trim() || "Beyan edilmemis",
    alici: fv.alici?.trim() || "Beyan edilmemis",
    urunAdi: g0?.category || opts.sector.name,
    cnKodu: g0?.cn || opts.sector.cnCodes[0] || "Beyan edilmemis",
    fonksiyonelBirim: `1 ${opts.sector.unit}`,
    netAgirlikKg: Number(fv.netAgirlik) || 0,
    uretimMiktari: opts.uretimMiktari,
    yil: Number(fv.yil) || 2026,
    elektrikKwh: elektrik ? elektrik.ad : 0,
    elektrikFaktorKgPerKwh: Number(fv.elektrikFaktor) || 0,
    sebekebaglantisi: fv.sebeke?.trim() || "Beyan edilmemis",
    yakitlar,
    tahsisOrani: Number(fv.tahsisOrani) || 1,
    tahsisYontemi:
      fv.tahsisYontemi?.trim() ||
      "Tahsis orani kullanici beyanidir; gerekce alana girilmediyse 100% bu urune yazilir.",
    malzemeler: opts.precs.map((p) => ({
      ad: p.name,
      miktarKg: p.total * 1000,
      mense: /geri|hurda|donus/i.test(p.source) ? ("Geri dönüşüm" as const) : ("Birincil" as const),
      faktorKgPerTon: p.see * 1000,
      proxy: !/tedarikci|beyan/i.test(p.source),
    })),
    ambalajlar: [],
    kanit: {
      elektrikFatura: fv.kanitElektrik === "1",
      yakitFatura: fv.kanitYakit === "1",
      uretimKaydi: fv.kanitUretim === "1",
      tedarikciBeyaniAdet: Number(fv.kanitTedarikciAdet) || 0,
    },
    kaynaklarKullanildi: ["EVCED", "IPCC", "DEFRA"],
  };
  return { ...base, packageHash: tkdSha256({ ...base, packageHash: "" }) };
}

/** Ornek PDF (TKD-2026-CB-0431) -- dogrulama fiksturu. */
export function ozCamTkdGirdisi(): TkdGirdi {
  const base: TkdGirdi = {
    packageId: "TKD-2026-CB-0431",
    timestamp: "2026-08-17T08:20:00.000Z",
    packageHash: "",
    firma: "Oz-Cam Yapi Sistemleri San. Tic. Ltd. Sti.",
    vkn: "1234567890",
    tesisAdi: "Gebze Uretim Tesisi",
    tesisAdresi: "GOSB 2. Cadde No:14, Gebze / Kocaeli",
    ulke: "Turkiye",
    faaliyetAlani: "Aluminyum dograma ve cam balkon sistemleri imalati",
    yetkili: "Sukru Gungor",
    yetkiliEposta: "info@cimetricaone.com",
    alici: "Nordbau Handels GmbH",
    urunAdi: "Katlanir cam balkon sistemi",
    cnKodu: "7610 90 90",
    fonksiyonelBirim: "m2",
    netAgirlikKg: 16,
    uretimMiktari: 12000,
    yil: 2026,
    elektrikKwh: 480000,
    elektrikFaktorKgPerKwh: 0.469,
    sebekebaglantisi: "Dagitim hattindan bagli tuketim noktasi",
    yakitlar: [
      {
        ad: "Dogalgaz",
        miktar: 62000,
        ncv: "34,50 MJ (varsayim)",
        ncvVarsayim: true,
        kgCo2e: 119997.9,
      },
    ],
    tahsisOrani: 0.4,
    tahsisYontemi:
      "Tesis emisyonunun %40 kadari bu urune agirlik payina gore tahsis edilmis, sonra 12000 birime bolunmustur.",
    malzemeler: [
      {
        ad: "Aluminyum",
        miktarKg: 4.2,
        mense: "Birincil",
        faktorKgPerTon: 9115.9,
        proxy: true,
        proxyNotu:
          "Aluminyum -- DEFRA aluminyum faktoru kutu/folyo kalemi uzerinden yayimlanir ve sekillendirmeyi (forming) haric tutar. Profil, levha ve ekstrüzyon urunleri icin vekil veri olarak kullanilmistir; sekillendirme enerjisi tesis enerjisi altinda hesaplanir.",
      },
      { ad: "Cam", miktarKg: 11.5, mense: "Birincil", faktorKgPerTon: 1402.77 },
      { ad: "PVC", miktarKg: 0.3, mense: "Birincil", faktorKgPerTon: 2944.76 },
    ],
    ambalajlar: [
      { ad: "Karton / oluklu mukavva", miktarKg: 0.8, mense: "Geri dönüşüm", kgCo2e: 0.8785 },
      { ad: "Plastik film / ambalaj", miktarKg: 0.15, mense: "Birincil", kgCo2e: 0.4375 },
    ],
    kanit: {
      elektrikFatura: true,
      yakitFatura: true,
      uretimKaydi: true,
      tedarikciBeyaniAdet: 0,
    },
    kaynaklarKullanildi: ["EVCED", "IPCC", "DEFRA"],
  };
  return { ...base, packageHash: tkdSha256({ ...base, packageHash: "" }) };
}
