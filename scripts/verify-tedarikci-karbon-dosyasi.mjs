/**
 * Tedarikçi Karbon Veri Dosyası — ornek-Tedarikci-Karbon-Veri-Dosyasi.pdf (TKD-2026-CB-0431).
 */
import {
  hesaplaTkd,
  ozCamTkdGirdisi,
  tedarikciKarbonDosyasiPdfBytes,
  tureKalite,
} from "../src/lib/skdm/pdf/tedarikciKarbonDosyasi";

const girdi = ozCamTkdGirdisi();
const r = hesaplaTkd(girdi);

const checks = [
  ["kalite B", r.kalite === "B" && tureKalite(girdi) === "B"],
  ["kapsam1 3.9999", Math.abs(r.kapsam1Birim - 3.9999) < 0.00005],
  ["kapsam2 7.504", Math.abs(r.kapsam2Birim - 7.504) < 0.00005],
  ["malzeme 55.302", Math.abs(r.malzemeAraToplam - 55.302) < 0.0005],
  ["ambalaj 1.316", Math.abs(r.kapsam3AmbalajBirim - 1.316) < 0.0005],
  ["toplam 68.1219", Math.abs(r.toplamBirim - 68.1219) < 0.00005],
  ["gosterim 68.12", Math.abs(r.toplamBirimGosterim - 68.12) < 0.005],
  ["tesis K2 225120", Math.abs(r.tesisKapsam2 - 225120) < 0.05],
];

console.log("=== TEDARIKCI KARBON VERI DOSYASI ===");
console.log("kalite:", r.kalite);
console.log("k1:", r.kapsam1Birim, "k2:", r.kapsam2Birim);
console.log("malzeme:", r.malzemeAraToplam, "ambalaj:", r.kapsam3AmbalajBirim);
console.log("toplam:", r.toplamBirim, "gosterim:", r.toplamBirimGosterim);
for (const [name, ok] of checks) {
  if (!ok) {
    console.error(`FAIL ${name}`);
    process.exit(1);
  }
  console.log(`OK ${name}`);
}

const pdf = tedarikciKarbonDosyasiPdfBytes(girdi);
if (pdf[0] !== 0x25 || pdf[1] !== 0x50) {
  console.error("FAIL PDF magic");
  process.exit(1);
}
const utf = Buffer.from(pdf).toString("utf8");
const bolumler = [
  "TEDARIKCI KARBON VERI DOSYASI",
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
  "cradle-to-gate",
  "CBAM",
];
for (const b of bolumler) {
  if (!utf.includes(b)) {
    console.error(`FAIL PDF govde eksik: ${b}`);
    process.exit(1);
  }
}
console.log(`OK PDF (${pdf.length} B) 12 bolum`);
console.log("TEDARIKCI KARBON VERI DOSYASI TEST PASSED");
