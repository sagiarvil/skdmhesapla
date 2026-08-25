/** GATE-F — public legal identity + privacy boundary. */
import { readFileSync } from "node:fs";
import { SITE } from "../src/lib/skdm/site-config";
import { LEGAL_ENTITY } from "../src/lib/skdm/constants";
const failed=[];
const check=(name,ok)=>{console.log(`${ok?"✅":"❌"} ${name}`);if(!ok)failed.push(name)};
check("LEGAL_ENTITY public config zincirinden türer",LEGAL_ENTITY.companyName===SITE.legalName&&LEGAL_ENTITY.operatorLocation===SITE.operatorLocation);
check("İşletmeci merkezi sunucu konumundan ayrıdır",LEGAL_ENTITY.operatorLocation==="Türkiye"&&LEGAL_ENTITY.serverLocation.includes("Frankfurt"));
check("Public config operator kişisel vergi/kimlik numarası taşımaz",SITE.vkn===""&&LEGAL_ENTITY.vkn==="");
check("Public yasal kimlik açıklaması var",Boolean(LEGAL_ENTITY.publicLegalIdentityNote));
for(const f of ["src/components/legal/SiteChrome.tsx","src/app/iletisim/page.tsx","src/app/hakkinda/page.tsx","src/app/kvkk-aydinlatma/page.tsx","src/lib/skdm/seo.ts","src/lib/seo/jsonld.ts"]){const x=readFileSync(f,"utf8");check(`${f} operator ID yayınlamıyor`,!x.includes("LEGAL_ENTITY.vkn")&&!x.includes("taxID: LEGAL_ENTITY.vkn"));}
const chrome=readFileSync("src/components/legal/SiteChrome.tsx","utf8");check("Footer public yasal kimlik notunu kullanır",chrome.includes("LEGAL_ENTITY.publicLegalIdentityNote"));
if(failed.length){console.error(`GATE-F FAIL ${failed.length}`);process.exit(1)}
console.log("GATE-F PASS — işletmeci şeffaflığı korunuyor, kişisel ID public yüzeyde yok");
