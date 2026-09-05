# SKDMHesapla.com — Denizcilik Firestore Veri Mimarisi Şeması

**Proje:** `carbon-web-1265b`  
**Bölge:** `europe-west3` (Frankfurt / Almanya — GDPR & KVKK Veri Egemenliği Uyumlu)  
**Mevzuat:** EU MRV Regulation (EU) 2015/757 & 2023/957, EU ETS Directive 2003/87/EC, FuelEU Maritime Regulation (EU) 2023/1805.

---

## 1. Hiyerarşik Koleksiyon Yapısı

```text
maritime_companies/{companyId}
  ├── fleets/{fleetId}
  │     └── vessels/{vesselId}
  │           └── reporting_years/{year}
  │                 ├── voyages/{voyageId}
  │                 ├── fuel_consumptions/{fuelId}
  │                 ├── evidences/{evidenceId}
  │                 └── audit_logs/{logId}
```

---

## 2. Koleksiyon ve Doküman Modelleri

### 2.1 `maritime_companies`
* `companyId`: string (UUID veya IMO Company Number)
* `title`: string (Örn: "Marmara Denizcilik ve Ticaret A.Ş.")
* `imoCompanyNumber`: string (7 haneli IMO şirket sicil no)
* `vkn`: string (Vergi Kimlik Numarası)
* `country`: string (Örn: "TR" / "GR" / "DE")
* `administeringAuthority`: string (AB Yönetici Üye Devleti, örn: "DE", "MT", "GR")
* `mohaAccountId`: string (Union Registry Maritime Operator Holding Account no)
* `createdAt`: ISO 8601 Timestamp
* `updatedAt`: ISO 8601 Timestamp

### 2.2 `vessels`
* `vesselId`: string (Örn: "IMO9876543")
* `companyId`: string
* `fleetId`: string
* `shipName`: string
* `imoNumber`: string (7 haneli IMO gemi no)
* `flagState`: string (Bayrak devleti, örn: "TR", "PA", "LR", "MT")
* `grossTonnage`: number (GT - Brüt tonaj, örn: 15400)
* `shipType`: `"container" | "bulk_carrier" | "general_cargo" | "tanker" | "ro_ro" | "passenger" | "offshore"`
* `iceClass`: `"none" | "IC" | "IB" | "IA" | "IAS"`
* `eediEexi`: number (gCO₂/t·nm)
* `createdAt`: ISO 8601 Timestamp

### 2.3 `reporting_years`
* `year`: number (2024, 2025, 2026...)
* `vesselId`: string
* `companyId`: string
* `status`: `"draft" | "audited" | "locked" | "sealed" | "REGULATORY_REVIEW_REQUIRED"`
* `monitoringPlanRef`: string (Onaylı MP dosya referansı)
* `totalEtsObligationEua`: number (Teslim edilecek EUA adedi)
* `fueleuComplianceBalanceMj`: number (Uyum dengesi - CB)
* `fueleuPenaltyEur`: number (Tahakkuk eden ceza - €)
* `auditHash`: string (SHA-256 mühür hash'i)
* `updatedAt`: ISO 8601 Timestamp

### 2.4 `voyages`
* `voyageId`: string (Örn: "VOY-2025-001")
* `voyageNumber`: string
* `departurePort`: `{ code: string; name: string; country: string; isEuEea: boolean; isTransshipment: boolean }`
* `arrivalPort`: `{ code: string; name: string; country: string; isEuEea: boolean; isTransshipment: boolean }`
* `departureDate`: ISO 8601
* `arrivalDate`: ISO 8601
* `distanceNm`: number (Deniz mili)
* `cargoWeightTonnes`: number
* `teuCount`: number
* `hoursUnderway`: number
* `hoursAtBerth`: number
* `scopeRatio`: number (`1.0` AB içi, `0.5` AB-üçüncü ülke, `0.0` kapsam dışı)
* `exceptionFlags`: string[] (Örn: `["NEIGHBOURING_TRANSSHIPMENT_PORT_EXCLUDED"]`)

### 2.5 `fuel_consumptions`
* `fuelId`: string
* `voyageId`: string
* `fuelType`: `"VLSFO" | "LSMGO" | "HFO" | "LNG_OTTO" | "BIO_DIESEL" | "E_METHANOL" | "OPS"`
* `massTonnes`: number
* `lcvMjPerKg`: number
* `bdnReferenceId`: string
* `evidenceId`: string
* `ghgIntensityWtW`: number (gCO₂eq/MJ)
* `co2FactorTtW`: number (tCO₂/tFuel)

### 2.6 `evidences` (Kriptografik Kanıt Zinciri)
* `evidenceId`: string
* `fileName`: string
* `fileType`: `"BDN" | "LOGBOOK" | "MONITORING_PLAN" | "CALIBRATION_CERT" | "SUSTAINABILITY_CERT" | "OPS_INVOICE"`
* `mimeType`: string
* `sizeBytes`: number
* `sha256Hash`: string (Hex biçiminde 64 karakterli SHA-256)
* `storagePath`: string
* `supportingRecordType`: `"fuel_consumption" | "voyage" | "berth" | "general"`
* `supportingRecordId`: string
* `uploadedAt`: ISO 8601
* `uploadedBy`: string

### 2.7 `audit_logs` (Versiyon ve Denetim İzi)
* `logId`: string
* `entityType`: string
* `entityId`: string
* `action`: `"create" | "update" | "lock" | "seal" | "regulatory_flag"`
* `performedBy`: string
* `timestamp`: ISO 8601
* `changes`: Record<string, { oldVal: any; newVal: any }>
