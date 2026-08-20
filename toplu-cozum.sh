#!/usr/bin/env bash
# TOPLU ÇÖZÜM — Firestore kayıt zincirinin son halkası.
#
# BULGU: createSealedAuditPackage client tarafında (SkdmWizard.tsx) çalışıyor.
# functions/index.js sadece skdm_sealed_packages'ı OKUYOR (GET /packages),
# hiçbir yerde YAZMIYOR. pcf_packages için var olan tx.set() deseni
# CBAM/SKDM tarafında hiç kopyalanmamış. Sonuç: gerçek bir müşteri paketini
# mühürlese bile /v/{paketNo} "bulunamadı" gösterir — çökme değil ama
# doğrulama vaadi hiç gerçekleşmez.
#
# ÇÖZÜM: Client, admin Firestore'a DOĞRUDAN yazamaz (güvenlik açığı —
# herkes sahte kayıt enjekte edebilir). Bu yüzden yeni bir POST endpoint
# ekliyoruz: POST /api/packages/register. Yalnızca /api/packages (GET) ile
# aynı PII'siz alanları kabul eder — VKN/maliyet/isim YOK, sadece
# bütünlük kanıtı. Mühürleme bitince client bu endpoint'e tek istek atar.
#
# Kullanım: repo kökünde  bash toplu-cozum.sh
set -euo pipefail

if [ ! -f "functions/index.js" ] || [ ! -f "src/components/wizard/SkdmWizard.tsx" ]; then
  echo "HATA: repo kökünde değilsiniz (functions/index.js veya SkdmWizard.tsx bulunamadı)." >&2
  exit 1
fi

echo "== 1/4: Cloud Function — POST /packages/register ekleniyor =="

python3 - <<'PYEOF'
import re

path = "functions/index.js"
with open(path, "r", encoding="utf-8") as f:
    src = f.read()

anchor = '/* ------------------------------------------------ packages (public) */'
if anchor not in src:
    raise SystemExit("HATA: 'packages (public)' yorum satırı bulunamadı — dosya beklenenden farklı, elle ekleyin.")

if 'skdm_sealed_packages").doc(packageId).set(' in src:
    print("· Kayıt endpoint'i zaten var, atlandı.")
else:
    insert_block = '''/* ------------------------------------------------ packages/register (POST, sunucu-doğrulamalı) */
      // GATE-REG (RM-007): mühürleme client'ta oluşuyor, ama kayıt defteri
      // yazımı burada, sunucuda oluyor. Client'a doğrudan Firestore yazma
      // izni VERİLMEZ (herkes sahte kayıt enjekte edebilir) — bu yüzden
      // client bu endpoint'e istek atar, doğrulama burada yapılır.
      if (
        (path === "/packages/register" || path === "/packages/register/") &&
        req.method === "POST"
      ) {
        const body = req.body || {};
        const packageId = typeof body.packageId === "string" ? body.packageId.trim() : "";
        const masterHash = typeof body.masterHash === "string" ? body.masterHash.trim() : "";
        const files = Array.isArray(body.files) ? body.files.filter((f) => typeof f === "string") : [];

        // Fail-closed: paket kimliği ve imza olmadan kayıt reddedilir.
        if (!packageId || !/^(PCF-)?SEAL-[A-Za-z0-9-]+$/.test(packageId)) {
          res.status(400).json({ error: "Geçersiz packageId formatı." });
          return;
        }
        if (!masterHash || !/^(sha256:)?[0-9a-fA-F]{64}$/.test(masterHash)) {
          res.status(400).json({ error: "Geçersiz masterHash formatı." });
          return;
        }
        if (files.length > 50) {
          res.status(400).json({ error: "Dosya listesi çok uzun." });
          return;
        }

        // GİZLİLİK KURALI (VPaketDogrulama.tsx ile aynı sınır): yalnızca
        // bütünlük kanıtı saklanır — emisyon, maliyet, VKN, isim, e-posta
        // BU KOLEKSİYONA ASLA YAZILMAZ. Body'de böyle alanlar gelse bile
        // burada elenir; yalnızca aşağıdaki whitelist yazılır.
        const docData = {
          packageId,
          masterHash: masterHash.startsWith("sha256:") ? masterHash : `sha256:${masterHash}`,
          engineVersion: typeof body.engineVersion === "string" ? body.engineVersion : null,
          methodologyVersion: typeof body.methodologyVersion === "string" ? body.methodologyVersion : null,
          factorRegistryVersion: typeof body.factorRegistryVersion === "string" ? body.factorRegistryVersion : null,
          files,
          createdAt: new Date().toISOString(),
        };

        try {
          // create() — var olan bir paketId üzerine sessizce yazılamaz;
          // mühürlü paket değiştirilemez ilkesiyle tutarlı (fail-closed).
          await db.collection("skdm_sealed_packages").doc(packageId).create(docData);
          res.status(201).json({ ok: true, packageId });
        } catch (e) {
          if (e && e.code === 6 /* ALREADY_EXISTS */) {
            res.status(409).json({ error: "Bu packageId zaten kayıtlı." });
            return;
          }
          console.error("packages/register hata:", e);
          res.status(500).json({ error: "Kayıt başarısız." });
        }
        return;
      }

      '''
    src = src.replace(anchor, anchor + '\n\n      ' + insert_block, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(src)
    print("✓ POST /packages/register eklendi (functions/index.js)")
PYEOF

echo ""
echo "== 2/4: Client kayıt fonksiyonu yazılıyor =="

mkdir -p src/lib/skdm
cat > src/lib/skdm/sealRegistryClient.ts <<'EOF'
/**
 * GATE-REG (RM-007): mühürleme sonrası kayıt defterine bildirim.
 *
 * createSealedAuditPackage TARAYICIDA çalışır; sonucu hiçbir yere
 * kaydetmez. Bu fonksiyon mühürleme bittiği anda çağrılır, üretilen
 * paketin PII'siz bütünlük özetini POST /api/packages/register'a
 * gönderir. Sunucu (functions/index.js) burada gelen veriyi doğrular
 * ve skdm_sealed_packages koleksiyonuna yazar.
 *
 * Bu çağrı BAŞARISIZ OLSA BİLE mühürleme akışı durmaz — kullanıcı
 * dosyalarını indirmeye devam edebilir. Kayıt hatası sessizce loglanır;
 * /v/{paketNo} sayfası o durumda "bulunamadı" gösterir ama bu, kullanıcı
 * kendi elindeki dosyaları kaybetmesine yol açmaz.
 */

import type { SealedPackageOutput } from "./package-seal";

export async function registerSealedPackage(pkg: SealedPackageOutput): Promise<void> {
  try {
    const res = await fetch("/api/packages/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageId: pkg.packageId,
        masterHash: pkg.masterHash,
        engineVersion: pkg.engineVersion,
        methodologyVersion: pkg.rulesetVersion,
        factorRegistryVersion: pkg.rulesetVersion,
        files: pkg.files.map((f) => f.filename ?? f.name).filter(Boolean),
      }),
    });
    if (!res.ok) {
      console.error("Kayıt defteri bildirimi başarısız:", res.status, await res.text().catch(() => ""));
    }
  } catch (e) {
    console.error("Kayıt defteri bildirimi hatası:", e);
  }
}
EOF
echo "✓ src/lib/skdm/sealRegistryClient.ts yazıldı"

echo ""
echo "== 3/4: SkdmWizard.tsx'e bağlanıyor =="

python3 - <<'PYEOF'
import re

path = "src/components/wizard/SkdmWizard.tsx"
with open(path, "r", encoding="utf-8") as f:
    src = f.read()

import_anchor = 'import { createSealedAuditPackage, type SealedPackageOutput } from "@/lib/skdm/package-seal";'
if import_anchor not in src:
    raise SystemExit("HATA: beklenen import satırı bulunamadı — elle kontrol edin.")

if "registerSealedPackage" not in src:
    src = src.replace(
        import_anchor,
        import_anchor + '\nimport { registerSealedPackage } from "@/lib/skdm/sealRegistryClient";',
        1,
    )

pkg_anchor = "const pkg = createSealedAuditPackage(result, {"
idx = src.find(pkg_anchor)
if idx == -1:
    raise SystemExit("HATA: 'const pkg = createSealedAuditPackage(result, {' bulunamadı.")

# Bloğun kapanışını bul: aynı satırdan başlayarak dengeli parantez takibi.
depth = 0
i = idx
started = False
end_idx = None
while i < len(src):
    ch = src[i]
    if ch == "(":
        depth += 1
        started = True
    elif ch == ")":
        depth -= 1
        if started and depth == 0:
            end_idx = i + 1
            break
    i += 1

if end_idx is None:
    raise SystemExit("HATA: createSealedAuditPackage(...) çağrısının sonu bulunamadı — elle ekleyin.")

# Noktalı virgülü de kapsa.
if end_idx < len(src) and src[end_idx] == ";":
    end_idx += 1

call_snippet = "\n    void registerSealedPackage(pkg);"
if "void registerSealedPackage(pkg)" not in src:
    src = src[:end_idx] + call_snippet + src[end_idx:]
    print("✓ registerSealedPackage(pkg) çağrısı eklendi (SkdmWizard.tsx)")
else:
    print("· Çağrı zaten var, atlandı.")

with open(path, "w", encoding="utf-8") as f:
    f.write(src)
PYEOF

echo ""
echo "== 4/4: Tip kontrolü =="
npx tsc --noEmit
echo "✓ Tip kontrolü geçti"

echo ""
echo "===================================================="
echo "TAMAMLANDI. Deploy etmeden önce:"
echo "  1. cd functions && npm run build 2>/dev/null || true"
echo "  2. firebase deploy --only functions:api"
echo "  3. firebase deploy --only hosting"
echo "  4. Test: gerçek bir dosyayı mühürleyip /v/{paketNo} linkine gidin"
echo "===================================================="
