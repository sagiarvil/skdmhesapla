#!/usr/bin/env node

import { spawn } from "node:child_process";

const steps = [
  { name: "1/8 Release Gate V8 (SSOT + mevzuat zinciri + güvenlik)", cmd: "npm", args: ["run", "release:gate:v8"] },
  { name: "2/8 CI Linter Kontrolü (SEO + sözleşme kontrolleri)", cmd: "npm", args: ["run", "lint:ci"] },
  { name: "3/8 Tip Kontrolü (Typecheck)", cmd: "npm", args: ["run", "typecheck"] },
  { name: "4/8 SKDM motor + CN mutabakat + regresyon", cmd: "npm", args: ["run", "test:engine"] },
  { name: "5/8 Next.js Taze Üretim Derlemesi (Build -> out/)", cmd: "npm", args: ["run", "build"] },
  { name: "6/8 GEO / ChatGPT Full Audit", cmd: "npm", args: ["run", "geo:full-audit"] },
  {
    name: "7/8 Firebase Canlıya Dağıtım (yalnız hosting:skdmhesapla)",
    cmd: "npx",
    args: ["firebase-tools", "deploy", "--only", "hosting:skdmhesapla"]
  },
  {
    name: "8/8 Canlı Kalite ve Sayfa Doğrulaması (Quality Gates)",
    cmd: "node",
    args: ["scripts/quality-gates.mjs"],
    env: { ...process.env, BASE_URL: "https://skdmhesapla.com" }
  }
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

async function runStep(step, totalStart) {
  const stepStart = Date.now();
  let frameIdx = 0;

  process.stdout.write(`\n\x1b[1;34m▶ [BAŞLADI]\x1b[0m \x1b[1m${step.name}\x1b[0m\n`);

  return new Promise((resolve, reject) => {
    const child = spawn(step.cmd, step.args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: step.env || process.env
    });

    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (d) => { stdoutData += d.toString(); });
    child.stderr.on("data", (d) => { stderrData += d.toString(); });

    const timer = setInterval(() => {
      const stepSec = Math.floor((Date.now() - stepStart) / 1000);
      const totalSec = Math.floor((Date.now() - totalStart) / 1000);
      const spinner = frames[frameIdx % frames.length];
      frameIdx++;

      process.stdout.write(
        `\r\x1b[36m${spinner} Çalışıyor... \x1b[1;33m[Adım: ${formatTime(stepSec)}]\x1b[0m \x1b[90m(Toplam: ${formatTime(totalSec)})\x1b[0m  `
      );
    }, 100);

    child.on("close", (code) => {
      clearInterval(timer);
      const stepSec = Math.floor((Date.now() - stepStart) / 1000);
      process.stdout.write("\r\x1b[K");

      if (code === 0) {
        console.log(`\x1b[1;32m✔ [TAMAMLANDI]\x1b[0m \x1b[1m${step.name}\x1b[0m \x1b[32m(${formatTime(stepSec)})\x1b[0m`);
        resolve();
      } else {
        console.log(`\x1b[1;31m✖ [HATA - Kod: ${code}]\x1b[0m \x1b[1m${step.name}\x1b[0m \x1b[31m(${formatTime(stepSec)})\x1b[0m`);
        if (stdoutData || stderrData) {
          console.log("\n\x1b[31m--- Hata Detayı ---\x1b[0m");
          if (stdoutData.trim()) {
            console.log("\x1b[33m[STDOUT]\x1b[0m");
            console.log(stdoutData.trim());
          }
          if (stderrData.trim()) {
            console.log("\n\x1b[33m[STDERR]\x1b[0m");
            console.log(stderrData.trim());
          }
          console.log("\x1b[31m--------------------\x1b[0m\n");
        }
        reject(new Error(`Adım başarısız: ${step.name}`));
      }
    });
  });
}

async function main() {
  console.clear();
  console.log("\x1b[1;36m╔════════════════════════════════════════════════════════════════╗\x1b[0m");
  console.log("\x1b[1;36m║   SKDMHesapla.com — Kontrollü Production Hosting Deploy       ║\x1b[0m");
  console.log("\x1b[1;36m╚════════════════════════════════════════════════════════════════╝\x1b[0m");

  const totalStart = Date.now();

  try {
    for (const step of steps) {
      await runStep(step, totalStart);
    }

    const totalSec = Math.floor((Date.now() - totalStart) / 1000);
    console.log("\n\x1b[1;32m════════════════════════════════════════════════════════════════\x1b[0m");
    console.log("\x1b[1;32m🎉 HOSTING DEPLOY VE CANLI KONTROLLER TAMAMLANDI!\x1b[0m");
    console.log(`\x1b[1;33m⏱  Toplam Geçen Süre: ${formatTime(totalSec)} (${totalSec} saniye)\x1b[0m`);
    console.log("\x1b[1;36m🌐 Canlı Adres: https://skdmhesapla.com\x1b[0m");
    console.log("\x1b[1;32m════════════════════════════════════════════════════════════════\x1b[0m\n");
  } catch (err) {
    console.error(`\n\x1b[1;31m⛔ Süreç durduruldu: ${err.message}\x1b[0m\n`);
    process.exit(1);
  }
}

main();
