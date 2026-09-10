/**
 * EU Denizcilik Karbon Uyumu — Sefer & BDN Denetim Kütüğü CSV Dışa Aktarıcısı
 * Denetçilerin (DNV, BV, RINA, ABS) ham veri inceleme sürecine hazır tablo formatı.
 */

import type { MaritimeComplianceDossier } from "../dossier/schema";

export function generateVoyageBdnCsv(dossier: MaritimeComplianceDossier): string {
  const lines: string[] = [];

  // UTF-8 BOM ekle (Excel'de Türkçe karakterlerin düzgün görünmesi için)
  lines.push("\uFEFF");

  // 1. ÜST BİLGİ
  lines.push(`# SKDMHESAPLA — EU DENİZCİLİK KARBON UYUM DENETİM KÜTÜĞÜ`);
  lines.push(`# Gemi: ${dossier.ship.shipName} | IMO: ${dossier.ship.imoNumber} | Bayrak: ${dossier.ship.flagState}`);
  lines.push(`# Şirket: ${dossier.company.companyName} | IMO Co: ${dossier.company.imoCompanyNumber}`);
  lines.push(`# Raporlama Dönemi: ${dossier.reportingYear} | Atanan AB İdaresi: ${dossier.company.administeringAuthority}`);
  lines.push(`# Kriptografik Kök Mühür: ${dossier.rootSha256}`);
  lines.push("");

  // 2. BÖLÜM 1: SEFER KÜTÜĞÜ (VOYAGE REGISTER)
  lines.push(`=== BÖLÜM 1: SEFER VE LİMAN UĞRAK KÜTÜĞÜ (MRV ANNEX II PART G) ===`);
  lines.push(
    [
      "Sefer No",
      "Kalkış Limanı",
      "Kalkış UN/LOCODE",
      "Kalkış Zamanı (UTC)",
      "Varış Limanı",
      "Varış UN/LOCODE",
      "Varış Zamanı (UTC)",
      "Coğrafi Kapsam",
      "Kapsam Oranı",
      "Mesafe (NM)",
      "Deniz Süresi (Saat)",
      "Rıhtım Süresi (Saat)",
      "Taşınan Yük (Ton)",
      "Taşıma İşi (Ton-NM)",
      "Kapsamdaki CO2 (Ton)",
      "Veri Boşluğu",
    ].join(";")
  );

  for (const v of dossier.voyages) {
    lines.push(
      [
        v.voyageNumber,
        `"${v.departurePort}"`,
        v.departureUnlocode,
        v.departureAt,
        `"${v.arrivalPort}"`,
        v.arrivalUnlocode,
        v.arrivalAt,
        v.scope,
        v.scopeRatio,
        v.distanceNm,
        v.timeAtSeaHours,
        v.timeAtBerthHours,
        v.cargoTonnes,
        v.transportWorkTonneNm,
        v.co2Tonnes,
        v.dataGap ? "EVET" : "HAYIR",
      ].join(";")
    );
  }

  lines.push("");

  // 3. BÖLÜM 2: YAKIT VE ENERJİ TESLİM KÜTÜĞÜ (BDN & ENERGY REGISTER)
  lines.push(`=== BÖLÜM 2: YAKIT VE ENERJİ İKMAL KÜTÜĞÜ (BDN & FUELEU REGISTER) ===`);
  lines.push(
    [
      "Kayıt ID",
      "İkmal Limanı",
      "UN/LOCODE",
      "Yakıt Türü",
      "Tüketici Sistem",
      "BDN / Fatura Ref",
      "Sürdürülebilirlik Sertifikası",
      "Miktar (Ton)",
      "Alt Isıl Değeri (MJ/kg)",
      "Toplam Enerji (MJ)",
      "Rıhtım Enerjisi (MJ)",
      "TtW CO2 Faktörü (tCO2/t)",
      "OPS Elektrik (kWh)",
      "Ölçüm Yöntemi",
    ].join(";")
  );

  for (const f of dossier.fuels) {
    lines.push(
      [
        f.id,
        `"${f.portName || "-"}"`,
        f.portUnlocode || "-",
        f.fuelType,
        `"${f.fuelConsumer}"`,
        f.bdnReference,
        f.sustainabilityCertificate || "STANDART_FOSIL",
        f.quantityTonnes,
        f.lowerCalorificValueMjPerKg,
        f.energyMj,
        f.atBerthEnergyMj,
        f.tankToWakeCo2Factor,
        f.opsElectricityKwh,
        `"${f.measurementMethod}"`,
      ].join(";")
    );
  }

  lines.push("");

  // 4. BÖLÜM 3: KRİPTOGRAFİK KANIT LİSTESİ
  lines.push(`=== BÖLÜM 3: EKLİ KANIT BELGELERİ VE SHA-256 PARMAK İZLERİ ===`);
  lines.push(["Belge Adı", "Belge Türü", "Boyut (Bayt)", "SHA-256 Kriptografik Özeti", "Durum"].join(";"));

  for (const ev of dossier.evidences) {
    lines.push([`"${ev.fileName}"`, ev.fileType, ev.sizeBytes, ev.sha256Hash, ev.status].join(";"));
  }

  return lines.join("\n");
}
