# SKDMHESAPLA — CURSOR İŞ EMRİ
## Sıralı Uygulama Mandate'i · v2.0-EXECUTABLE

**Bu dosyayı repo köküne koy:** `docs/CURSOR_IS_EMRI.md`
**Okuma sırası:** Bu dosya → `AGENTS.md` → ilgili RM dokümanı
**Kural:** Fazlar sırayla yapılır. Bir faz kabul kriterlerini geçmeden sonrakine geçilmez.

---

# 0. BU EMRİN TEK CÜMLESİ

> Ürün, "10 adımlı SKDM formu" değil; **AB alıcısının talebini okuyan, üreticiyi ihracatçıdan ayıran, eksikleri kritik yola indiren, veriyi doğru kişiden toplayan ve doğrulayıcı geri dönüşüne kadar dosyayı yöneten SKDM çalışma işletim sistemi**dir.

Eski 10 katman **silinmez**. Kullanıcının gördüğü katman "görevler/kişiler/belgeler/eksikler" olur; 10 katman sistemin **arka plandaki resmi veri şeması** olarak kalır (RM-004).

---

# ⛔ FAZ 0 — ACİL: PRODUCTION ŞU AN YANLIŞ HESAP ÜRETİYOR

**Bu faz bugün yapılır. Mimari işine başlamak yasak.**
Gerekçe: mühürlü test paketi (SEAL-2026-DC-7782) analiz edildi; motor müşteriye matematiksel olarak yanlış rakam veriyor. Her yeni mühürleme yanlış dosya üretiyor.

## 0.1 Annex II ihlali — Kapsam 2 hatalı şekilde faturaya giriyor

**Kanıt:** `Hesaplama-Izi.json` → `totalEmissions: 2250` = Kapsam1 (1775) + Kapsam2 (475). Demir-çelik Annex II'de; Kapsam 2 faturaya **girmez**.

**Yapılacak:** `ANNEX_II_SADECE_DIREKT` tek kaynak (`src/lib/skdm/config.ts`); hesap fonksiyonu Kapsam 2'yi Annex II sektörlerinde faturadan çıkarır, raporda bilgi amaçlı gösterir.

**Kabul kriteri:**
- [x] 4 sektörün her biri için birim test: `faturaEdilen === kapsam1`
- [x] Çimento + gübre için: `faturaEdilen === kapsam1 + kapsam2`
- [x] Test aynı senaryoyu (1775 + 475) çalıştırıp **1775** döndürmeli

## 0.2 TR-ETS mahsup alanı, pilot dönemde sıfır olmalı

**Yapılacak:** `resolveTrEtsNettingEur()` — 2026/2027'de zorla 0; UI readonly + sabit açıklama.

**Kabul kriteri:**
- [x] 2026/2027 için girdi ne olursa olsun `etkinMahsup === 0`
- [x] 2028 için kullanıcı değeri geçerli

## 0.3 CN → sektör yönlendirme hatası

**Yapılacak:** `resolveScopeFromCn()` — yönlendirme CN'den; varsayılan demir-çelik yok; belirsiz → sınıflandırma sihirbazı.

**Kabul kriteri:**
- [x] 7610 → `/hesapla/aluminyum/`
- [x] 7308 → `/hesapla/demir-celik/`
- [x] Tanınmayan kod → hiçbir sektöre yönlenmez

## 0.4 Regresyon kapısı

**Yapılacak:** `tests/regression/annex2.spec.ts` — CI gate (`npm run test:regression`).

**Kabul kriteri:**
- [x] `npm test` bu testleri koşuyor
- [ ] CI pipeline'da zorunlu gate (GitHub Actions varsa)

---

# FAZ 1 — TEK GERÇEK KAYNAK NORMALİZASYONU

## 1.1 `site-config.ts` — uygulandı: `src/lib/skdm/site-config.ts`

## 1.2 Scope Registry — `resolve-scope.ts`

## 1.3 Sayfa tutarlılığı — devam eden

---

# FAZ 2–13

Case Graph, Buyer File Intelligence, Producer Routing, Supplier Orchestrator, Delegation Security, Critical Path Engine, Evidence, Calculation+Gate, Communication Template, Mühürleme, Verification Findings, Actual vs Default Intelligence — **sırayla; Faz 0–1 kabul edilmeden başlanmaz.**

---

# PRODUCTION GATE

Bkz. orijinal emir — tüm maddeler ✓ olmadan canlıya alınmaz.

---

# BARIŞ'IN NETLEŞTİRMESİ GEREKEN 3 ŞEY — ÇÖZÜLDÜ (17.08.2026)

1. **Tek doğru yasal unvan:** **CimetricaOne** (VKN: 25403091318)
2. **Tek doğru açık adres:** Kamuya açık sayfalarda `Türkiye` + VKN teyidi; tam sokak adresi e-fatura kaydından — `SITE.address` / `SITE.addressNote`
3. **Tek doğru barındırma beyanı:** Google Cloud Firebase Hosting + Cloud Functions **europe-west3 (Frankfurt, AB)**; Firestore/Storage aynı bölge; CDN Cloudflare — `firebase.json` doğrulandı

---

*Tam metin: v2.0-EXECUTABLE — Faz 0 acil düzeltmeler öncelikli; mimari fazlar sıralı.*
