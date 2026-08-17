#!/usr/bin/env node
import { runAiAudit } from "./ai-validators.mjs";
import { runNegativeFixtures } from "./ai-negative.mjs";

const { errors, warnings } = runAiAudit();
for (const w of warnings) console.warn("WARN", w);

const neg = runNegativeFixtures();
const negFail = neg.filter((r) => !r.ok);
for (const r of neg) {
  if (!r.ok) console.error("NEG-MISS", r.id, r.detail || "");
}

if (errors.length) {
  for (const e of errors) console.error("BLOCK", e);
}
if (errors.length || negFail.length) {
  console.error(
    `ai-audit FAIL: ${errors.length} blocking, negative ${neg.length - negFail.length}/${neg.length}`,
  );
  process.exit(1);
}
console.log(`ai-audit: PASS (negative ${neg.length}/${neg.length})`);
