#!/usr/bin/env node
import fs from "node:fs";
const errors=[];const site=fs.readFileSync("src/lib/skdm/site-config.ts","utf8");
if(!/vkn:\s*""/.test(site))errors.push("SITE.vkn public configte boş değil");
if(!site.includes("publicLegalIdentityNote"))errors.push("public legal identity note eksik");
for(const f of ["src/components/legal/SiteChrome.tsx","src/app/iletisim/page.tsx","src/app/hakkinda/page.tsx","src/app/kvkk-aydinlatma/page.tsx","src/lib/skdm/seo.ts","src/lib/seo/jsonld.ts"]){const s=fs.readFileSync(f,"utf8");if(s.includes("LEGAL_ENTITY.vkn")||s.includes("taxID: LEGAL_ENTITY.vkn"))errors.push(`${f}: public operator ID referansı`)}
if(errors.length){console.error("PUBLIC-IDENTITY-PRIVACY: FAIL");errors.forEach(e=>console.error(` - ${e}`));process.exit(1)}console.log("PUBLIC-IDENTITY-PRIVACY: PASS");
