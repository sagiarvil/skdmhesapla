import { defineConfig } from "vitest/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * GATE-VT (RM-007): vitest yanlış "FAIL" raporlama düzeltmesi.
 *
 * DİKKAT (bir daha düşülmesin diye kayıt altında): node_modules deseni
 * HER SEVİYEDE dışlanmalı, yalnızca kökü dışlayan dar bir desen
 * yeterli değildir; functions altındaki bir bağımlılığın kendi test
 * dosyası buna takılıp yanlışlıkla FAIL edilmişti.
 *
 * Bu dosyanın önceki bir sürümünde, bu yorum bloğunun içine örnek
 * olarak yazılan bir glob metni, yıldız işaretinin hemen ardından
 * eğik çizgi barındırdığı için yorumu ortasında kapatmış, geri
 * kalan metin kod gibi çalıştırılıp hataya yol açmıştı. Bu yorumda
 * artık öyle bir dizi YOK ve buraya bir daha eklenmeyecek.
 *
 * Script-tarzı dosyalar (describe/it kullanmayan, kendi console.log
 * PASS/FAIL mantığıyla çalışanlar) burada dışlanır; npm run
 * test:scripts ile kendi doğal biçimlerinde ayrıca çalıştırılırlar.
 * Liste elle yazılmaz — scripts/dev/script-test-listesi.json'dan
 * okunur (o dosya otomatik taramayla üretildi ve doğrulandı).
 */

const buDizin = path.dirname(fileURLToPath(import.meta.url));

const scriptTarziDosyalar: string[] = JSON.parse(
  readFileSync(
    path.join(buDizin, "scripts", "dev", "script-test-listesi.json"),
    "utf-8",
  ),
);

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      ...scriptTarziDosyalar,
    ],
  },
});
