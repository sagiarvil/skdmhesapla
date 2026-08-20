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
        files: pkg.files.map((f) => f.filename).filter(Boolean),
      }),
    });
    if (!res.ok) {
      console.error("Kayıt defteri bildirimi başarısız:", res.status, await res.text().catch(() => ""));
    }
  } catch (e) {
    console.error("Kayıt defteri bildirimi hatası:", e);
  }
}
