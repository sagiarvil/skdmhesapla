// Script-tarzı test dosyalarını (describe/it kullanmayanları) kendi
// doğal biçimlerinde çalıştırır — gerçek exit code'a göre pass/fail.
// Ayrı dosya olarak var, çünkü package.json içine inline yazıldığında
// kabuk/JSON tırnak çakışması diziyi bozuyordu.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const dosyalar = JSON.parse(
  readFileSync(new URL("./script-test-listesi.json", import.meta.url), "utf-8")
);

let hataliSayisi = 0;
for (const dosya of dosyalar) {
  const calistirici = dosya.endsWith(".ts") ? "npx tsx" : "node";
  console.log(`\n── ${dosya} ──`);
  try {
    execSync(`${calistirici} ${dosya}`, { stdio: "inherit" });
  } catch {
    hataliSayisi += 1;
    console.error(`✗ FAIL: ${dosya}`);
  }
}

console.log(`\n${dosyalar.length - hataliSayisi}/${dosyalar.length} script dosyası geçti.`);
process.exit(hataliSayisi > 0 ? 1 : 0);
