#!/usr/bin/env node
/** Geriye dönük alias — SSOT: scripts/seo/generate-assets.mjs */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const r = spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), "seo/generate-assets.mjs")], {
  stdio: "inherit",
});
process.exit(r.status ?? 1);
