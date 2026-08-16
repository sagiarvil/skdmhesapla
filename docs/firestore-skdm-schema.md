# SKDMHesapla.com — Firestore Veritabanı Şema Tasarımı

**Proje:** `carbon-web-1265b`
**Bölge:** `europe-west3` (Frankfurt / Almanya — GDPR / KVKK Veri Egemenliği Uyumlu)
**Tarih:** 16 Ağustos 2026

---

## 1. Koleksiyonlar Hiyerarşisi

### 1.1 `skdm_sessions` (Hesaplama Oturum Kayıtları)
Kullanıcının sihirbaz üzerinde girdiği verileri ve anlık hesaplama sonuçlarını saklar.

```typescript
interface SkdmSessionDoc {
  sessionId: string; // UUID v4
  createdAt: string; // ISO 8601 Timestamp
  updatedAt: string;
  
  // Girdiler
  sectorId: string; // "iron-steel" | "aluminum" | ...
  productionVolume: number;
  year: number; // 2026-2034
  importerAnnualVolumeStatus: "unknown" | "under50" | "over50";
  useCustomEmissions: boolean;
  customDirectEmission?: number;
  customIndirectEmission?: number;
  etsQuarter: string; // "2026-Q1"
  euEtsPriceEur: number;
  trEtsNettingEur: number;
  
  // Çıktılar
  totalEmissions: number;
  liableEmissions: number;
  importerCostEur: number;
  importerCostTry: number;
  isDeMinimisExempt: boolean;
  readinessScore: number; // %0 - %100
  auditHash: string; // sha256:...
  
  status: "draft" | "completed" | "sealed";
}
```

---

### 1.2 `skdm_orders` (Mühürlü Paket Sipariş ve Ödeme Kayıtları)
Paddle Checkout üzerinden alınan mühürlü paket ve yeniden mühürleme siparişlerini tutar.

```typescript
interface SkdmOrderDoc {
  orderId: string; // "ORD-YYYYMMDD-XXXX"
  createdAt: string;
  sessionId: string;
  packageType: "SEAL_PACKAGE_9900" | "RESEAL_PACKAGE_2400";
  amountTry: number; // 9900 veya 2400
  amountEur: number;
  currency: "TRY" | "EUR";
  
  paymentGateway: "Paddle";
  paddleCheckoutId?: string;
  paddleTransactionId?: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  
  customerEmail: string;
  companyTitle?: string;
  taxNumber?: string;
  
  sealedPackageId?: string; // "SEAL-XXXXXXXX"
}
```

---

### 1.3 `skdm_sealed_packages` (Mühürlü Paket Bütünlük Registratörü)
Mühürlenmiş 6 dosyalık denetime hazırlık paketinin SHA-256 bütünlük manifestosunu saklar.

```typescript
interface SkdmSealedPackageDoc {
  packageId: string; // "SEAL-XXXXXXXX"
  createdAt: string;
  expiresAt: string; // 7 gün geçerli imzalı indirme bağlantısı
  sessionId: string;
  orderId: string;
  
  rulesetVersion: string; // "2026.1-Omnibus1"
  engineVersion: string; // "skdm-calc-v2026.1"
  masterHash: string; // sha256:...
  
  files: {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    sha256: string;
    storagePath: string; // gs://carbon-web-1265b.appspot.com/sealed_packages/...
  }[];
  
  manifesto: {
    packageId: string;
    timestamp: string;
    engineVersion: string;
    rulesetVersion: string;
    usedEtsPrice: number;
    etsQuarter: string;
    sectorId: string;
    productionVolume: number;
    filesHashes: Record<string, string>;
    packageSignature: string;
  };
}
```

---

## 2. Dağıtım Scriptleri ve CLI Kullanımı

```bash
# Sadece siteyi Firebase Hosting'e canlıya almak için:
npm run deploy:site

# Sadece hesaplama API ve fonksiyonları canlıya almak için:
npm run deploy:api

# Canlıya dokunmadan önizleme kanalı açmak için:
npm run onizleme
```
