"use strict";

/**
 * Maritime Enterprise Persistence V2
 * Server-authoritative, schema-preserving store for the full preparation-file model.
 * Client may submit domain input only. It cannot set tenant ownership, RBAC role, revision,
 * ruleset, hashes, audit events, lock state, version identity or server timestamps.
 */
const crypto = require("node:crypto");
const { onRequest } = require("firebase-functions/v2/https");
const { getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

if (!getApps().length) initializeApp();
const db = getFirestore();

const SCHEMA_VERSION = "maritime-enterprise-v2";
const RULESET_ID = "eu-maritime-2026-09-04";
const MAX_BODY_BYTES = 5 * 1024 * 1024;
const MAX_VOYAGES = 5000;
const MAX_FUELS = 1000;
const MAX_EVIDENCE = 250;
const MAX_STRING = 12000;
const ROLES = new Set(["owner", "admin", "compliance_manager", "editor", "viewer"]);
const READ_ROLES = new Set(ROLES);
const WRITE_ROLES = new Set(["owner", "admin", "compliance_manager", "editor"]);
const LOCK_ROLES = new Set(["owner", "admin", "compliance_manager"]);
const ADMIN_ROLES = new Set(["owner", "admin"]);
const DANGEROUS_KEYS = new Set(["__proto__", "prototype", "constructor"]);
const REQUIRED_EVIDENCE = ["monitoring-plan", "voyage-list", "data-gaps", "logbook", "bdn", "fuel-certificates", "distance-time", "factors"];

const RETENTION_POLICY = Object.freeze({
  version: "maritime-retention-v2",
  fuelEuMinimumYears: 5,
  fuelEuLegalBasis: "Commission Implementing Regulation (EU) 2024/2027 Article 11(5); Regulation (EU) 2023/1805 Article 7(4)",
  mrvLegalBasis: "Commission Delegated Regulation (EU) 2023/2917 Article 10(5): MARPOL/SOLAS retention periods",
  automaticPurge: false,
  legalHoldSupported: true,
});

function nowIso() { return new Date().toISOString(); }
function hashText(v) { return crypto.createHash("sha256").update(String(v)).digest("hex"); }
function randomId(prefix) { return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`; }
function safeId(v, fallback = "") { const s = String(v || "").replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 120); return s || fallback; }
function stable(v) {
  if (Array.isArray(v)) return v.map(stable);
  if (v && typeof v === "object") return Object.keys(v).sort().reduce((o,k) => { o[k] = stable(v[k]); return o; }, {});
  return v;
}
function canonicalHash(v) { return hashText(JSON.stringify(stable(v))); }
function httpError(status, code, message, extra) { const e = new Error(message); e.http = status; e.code = code; Object.assign(e, extra || {}); return e; }
function fail(res, err) { res.status(Number(err?.http) || 500).json({ ok:false, code:err?.code || "MARITIME_INTERNAL", message:err?.message || "Sunucu hatası", ...(err?.missing ? {missing:err.missing}:{}), ...(err?.currentRevision != null ? {currentRevision:err.currentRevision}:{}) }); }

function sanitize(value, depth = 0) {
  if (depth > 10) throw httpError(400, "DATA_DEPTH", "Veri yapısı izin verilen derinliği aşıyor");
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.trim().slice(0, MAX_STRING);
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (Array.isArray(value)) return value.map(x => sanitize(x, depth + 1));
  if (typeof value === "object") {
    const out = {};
    let count = 0;
    for (const [key, item] of Object.entries(value)) {
      if (DANGEROUS_KEYS.has(key)) continue;
      if (++count > 300) throw httpError(400, "OBJECT_KEYS", "Bir veri nesnesi çok fazla alan içeriyor");
      out[String(key).slice(0, 160)] = sanitize(item, depth + 1);
    }
    return out;
  }
  return null;
}

function normalizeFile(raw) {
  const rawBytes = Buffer.byteLength(JSON.stringify(raw || {}));
  if (rawBytes > MAX_BODY_BYTES) throw httpError(413, "PAYLOAD_TOO_LARGE", "Çalışma dosyası 5 MB senkronizasyon sınırını aşıyor");
  const clean = sanitize(raw || {});
  const year = Math.trunc(Number(clean.reportingYear));
  if (!Number.isInteger(year) || year < 2024 || year > 2100) throw httpError(400, "YEAR_INVALID", "Geçerli raporlama yılı gerekli");
  if (!clean.company || typeof clean.company !== "object" || !clean.ship || typeof clean.ship !== "object" || !clean.monitoring || typeof clean.monitoring !== "object") throw httpError(400, "CORE_INVALID", "Şirket, gemi ve Monitoring Plan nesneleri zorunlu");
  if (!Array.isArray(clean.voyages) || !Array.isArray(clean.fuels)) throw httpError(400, "ROWS_INVALID", "Voyage ve fuel kayıtları dizi olmalı");
  if (clean.voyages.length > MAX_VOYAGES || clean.fuels.length > MAX_FUELS) throw httpError(413, "ROW_LIMIT", "Voyage/fuel kayıt sayısı güvenli işlem sınırını aşıyor");
  clean.evidence = clean.evidence && typeof clean.evidence === "object" && !Array.isArray(clean.evidence) ? clean.evidence : {};
  clean.evidenceReferences = clean.evidenceReferences && typeof clean.evidenceReferences === "object" && !Array.isArray(clean.evidenceReferences) ? clean.evidenceReferences : {};
  if (Object.keys(clean.evidence).length > MAX_EVIDENCE || Object.keys(clean.evidenceReferences).length > MAX_EVIDENCE) throw httpError(413, "EVIDENCE_LIMIT", "Kanıt anahtarı sayısı sınırı aşıyor");
  clean.reportingYear = year;
  clean.voyages = clean.voyages.map((row, i) => ({ ...row, id: safeId(row?.id, `voyage-${i+1}`), orderIndex: i }));
  clean.fuels = clean.fuels.map((row, i) => ({ ...row, id: safeId(row?.id, `fuel-${i+1}`), orderIndex: i }));
  return clean;
}

async function requireUser(req) {
  const h = String(req.get("authorization") || "");
  const m = /^Bearer\s+(.+)$/i.exec(h);
  if (!m) throw httpError(401, "AUTH_REQUIRED", "Denizcilik çalışma dosyası için üye girişi gerekli");
  try {
    const d = await getAuth().verifyIdToken(m[1].trim(), true);
    if (d.firebase?.sign_in_provider === "anonymous") throw httpError(401, "REGISTERED_USER_REQUIRED", "Kayıtlı kullanıcı hesabı gerekli");
    return { uid:d.uid, email:d.email || null, name:d.name || null };
  } catch (e) {
    if (e?.http) throw e;
    throw httpError(401, "AUTH_INVALID", "Kimlik doğrulaması geçersiz veya süresi dolmuş");
  }
}

const companyRef = id => db.collection("companies").doc(id);
const memberRef = (cid, uid) => companyRef(cid).collection("members").doc(uid);
const fleetRef = (cid, fid) => companyRef(cid).collection("maritimeFleets").doc(fid);
const homeRef = uid => db.collection("maritimeUserHomes").doc(uid);
const shipRef = ctx => fleetRef(ctx.companyId, ctx.fleetId).collection("ships").doc(ctx.shipId);
const yearRef = ctx => shipRef(ctx).collection("reportingYears").doc(String(ctx.year));

async function ensureWorkspace(user) {
  const hRef = homeRef(user.uid);
  const existing = await hRef.get();
  if (existing.exists) return existing.data();
  const companyId = `mco_${hashText(user.uid).slice(0,24)}`;
  const fleetId = "primary";
  const ts = nowIso();
  await db.runTransaction(async tx => {
    const h = await tx.get(hRef);
    if (h.exists) return;
    tx.set(companyRef(companyId), {
      schemaVersion:SCHEMA_VERSION, name:user.name || "Denizcilik Çalışma Alanı", ownerId:user.uid, members:[user.uid], status:"active",
      retentionPolicy:RETENTION_POLICY, createdAt:ts, createdBy:user.uid, updatedAt:ts, updatedBy:user.uid,
    }, {merge:true});
    tx.set(memberRef(companyId,user.uid), {uid:user.uid,role:"owner",active:true,createdAt:ts,createdBy:user.uid,updatedAt:ts,updatedBy:user.uid});
    tx.set(fleetRef(companyId,fleetId), {schemaVersion:SCHEMA_VERSION,name:"Ana Filo",status:"active",createdAt:ts,createdBy:user.uid,updatedAt:ts,updatedBy:user.uid},{merge:true});
    tx.set(hRef,{schemaVersion:SCHEMA_VERSION,companyId,fleetId,createdAt:ts,updatedAt:ts});
  });
  return (await hRef.get()).data();
}
async function roleFor(cid,uid) {
  const m=await memberRef(cid,uid).get();
  if(m.exists && m.data().active!==false && ROLES.has(m.data().role)) return m.data().role;
  const c=await companyRef(cid).get();
  if(c.exists && c.data().ownerId===uid) return "owner";
  return null;
}
async function authorize(cid,uid,allowed) { const role=await roleFor(cid,uid); if(!role || !allowed.has(role)) throw httpError(403,"RBAC_DENIED","Bu çalışma alanına erişim yetkiniz yok"); return role; }

async function createFile(user,year) {
  const home=await ensureWorkspace(user); await authorize(home.companyId,user.uid,WRITE_ROLES);
  const y=Math.trunc(Number(year)||2026); if(y<2024||y>2100) throw httpError(400,"YEAR_INVALID","Geçerli raporlama yılı gerekli");
  const sRef=fleetRef(home.companyId,home.fleetId).collection("ships").doc();
  const ctx={companyId:home.companyId,fleetId:home.fleetId,shipId:sRef.id,year:y}; const ts=nowIso(); const batch=db.batch();
  batch.set(sRef,{schemaVersion:SCHEMA_VERSION,status:"active",createdAt:ts,createdBy:user.uid,updatedAt:ts,updatedBy:user.uid,currentReportingYear:y});
  batch.set(yearRef(ctx),{schemaVersion:SCHEMA_VERSION,rulesetId:RULESET_ID,reportingYear:y,status:"draft",revision:0,legalHold:false,retentionPolicy:RETENTION_POLICY,createdAt:ts,createdBy:user.uid,updatedAt:ts,updatedBy:user.uid});
  batch.set(homeRef(user.uid),{...ctx,updatedAt:ts},{merge:true}); await batch.commit(); return ctx;
}
async function currentContext(user,year=2026) { const home=await ensureWorkspace(user); if(home.shipId&&home.year){const ctx={companyId:home.companyId,fleetId:home.fleetId,shipId:home.shipId,year:Number(home.year)};await authorize(ctx.companyId,user.uid,READ_ROLES);return ctx;} return createFile(user,year); }
function contextFrom(home,input={}) { const c=input.context||{}; return {companyId:safeId(c.companyId||home.companyId),fleetId:safeId(c.fleetId||home.fleetId),shipId:safeId(c.shipId||home.shipId),year:Math.trunc(Number(c.year||home.year||0))}; }

function stripMeta(doc) { const p={...(doc.payload||{})}; delete p.orderIndex; return p; }
async function hydrate(ctx) {
  const ySnap=await yearRef(ctx).get(); if(!ySnap.exists) return null; const y=ySnap.data();
  if(!y.activeSyncId) return {context:ctx,revision:Number(y.revision||0),status:y.status||"draft",file:null,dataHash:y.dataHash||null,rulesetId:y.rulesetId||RULESET_ID};
  const [v,f,e]=await Promise.all([
    yearRef(ctx).collection("voyages").where("syncId","==",y.activeSyncId).get(),
    yearRef(ctx).collection("fuels").where("syncId","==",y.activeSyncId).get(),
    yearRef(ctx).collection("evidence").where("syncId","==",y.activeSyncId).get(),
  ]);
  const voyages=v.docs.map(d=>d.data()).sort((a,b)=>a.orderIndex-b.orderIndex).map(stripMeta);
  const fuels=f.docs.map(d=>d.data()).sort((a,b)=>a.orderIndex-b.orderIndex).map(stripMeta);
  const evidence={}; const evidenceReferences={};
  e.docs.forEach(d=>{const x=d.data();evidence[x.key]=x.present===true;if(x.reference) evidenceReferences[x.key]=x.reference;});
  return {context:ctx,revision:Number(y.revision||0),status:y.status||"draft",dataHash:y.dataHash||null,rulesetId:y.rulesetId||RULESET_ID,lockedAt:y.lockedAt||null,lastSnapshotHash:y.lastSnapshotHash||null,file:{reportingYear:Number(y.reportingYear),company:y.companySnapshot||{},verifier:y.verifierSnapshot||{},ship:y.shipSnapshot||{},monitoring:y.monitoring||{},voyages,fuels,ice:y.ice||{},flexibility:y.flexibility||{},evidence,evidenceReferences}};
}

async function syncFile(user,ctx,rawFile,expectedRevision) {
  const role=await authorize(ctx.companyId,user.uid,WRITE_ROLES); const file=normalizeFile(rawFile);
  if(file.reportingYear!==Number(ctx.year)) throw httpError(409,"YEAR_MISMATCH","Raporlama yılı aktif dosyayla eşleşmiyor");
  const yRef=yearRef(ctx); const currentSnap=await yRef.get(); if(!currentSnap.exists) throw httpError(404,"FILE_NOT_FOUND","Raporlama dosyası bulunamadı");
  const current=currentSnap.data(); if(current.status==="locked") throw httpError(423,"FILE_LOCKED","Dosya kilitli; değişiklik için yeni/superseding çalışma açılmalıdır");
  const dataHash=canonicalHash({schemaVersion:SCHEMA_VERSION,rulesetId:RULESET_ID,file});
  if(current.dataHash===dataHash) return {unchanged:true,revision:Number(current.revision||0),dataHash,status:current.status||"draft"};
  if(expectedRevision!=null && Number(expectedRevision)!==Number(current.revision||0)) throw httpError(409,"REVISION_CONFLICT","Dosya başka bir oturumda değişti; sunucu sürümü yeniden yüklenmeli",{currentRevision:Number(current.revision||0)});
  const syncId=randomId("sync"), ts=nowIso(); const writer=db.bulkWriter();
  for(const [i,row] of file.voyages.entries()) { const payload={...row}; delete payload.orderIndex; writer.create(yRef.collection("voyages").doc(`${syncId}_${hashText(row.id).slice(0,20)}`),{syncId,orderIndex:i,sourceId:row.id,payload,recordHash:canonicalHash(payload),createdAt:ts,createdBy:user.uid,immutable:true}); }
  for(const [i,row] of file.fuels.entries()) { const payload={...row}; delete payload.orderIndex; writer.create(yRef.collection("fuels").doc(`${syncId}_${hashText(row.id).slice(0,20)}`),{syncId,orderIndex:i,sourceId:row.id,payload,recordHash:canonicalHash(payload),createdAt:ts,createdBy:user.uid,immutable:true}); }
  let i=0; for(const [key,present] of Object.entries(file.evidence||{})){const k=safeId(key,`evidence-${i}`);const reference=String(file.evidenceReferences?.[key]||"").slice(0,MAX_STRING);writer.create(yRef.collection("evidence").doc(`${syncId}_${hashText(k).slice(0,20)}`),{syncId,orderIndex:i++,key:k,present:present===true,reference,recordHash:canonicalHash({k,present,reference}),createdAt:ts,createdBy:user.uid,immutable:true});}
  await writer.close();
  let revision=0;
  await db.runTransaction(async tx=>{
    const liveSnap=await tx.get(yRef); const live=liveSnap.data()||{};
    if(live.status==="locked") throw httpError(423,"FILE_LOCKED","Dosya senkronizasyon sırasında kilitlendi");
    if(expectedRevision!=null && Number(live.revision||0)!==Number(expectedRevision)) throw httpError(409,"REVISION_CONFLICT","Eşzamanlı değişiklik algılandı",{currentRevision:Number(live.revision||0)});
    revision=Number(live.revision||0)+1; const auditId=randomId("audit");
    const core={schemaVersion:SCHEMA_VERSION,rulesetId:RULESET_ID,reportingYear:file.reportingYear,companySnapshot:file.company||{},verifierSnapshot:file.verifier||{},shipSnapshot:file.ship||{},monitoring:file.monitoring||{},ice:file.ice||{},flexibility:file.flexibility||{},activeSyncId:syncId,dataHash,revision,status:"draft",rowCounts:{voyages:file.voyages.length,fuels:file.fuels.length,evidence:Object.keys(file.evidence||{}).length},retentionPolicy:RETENTION_POLICY,updatedAt:ts,updatedBy:user.uid};
    tx.set(yRef,core,{merge:true}); tx.set(shipRef(ctx),{...(file.ship||{}),schemaVersion:SCHEMA_VERSION,status:"active",currentReportingYear:file.reportingYear,updatedAt:ts,updatedBy:user.uid},{merge:true});
    tx.set(yRef.collection("versions").doc(syncId),{versionId:syncId,type:"autosave",immutable:true,schemaVersion:SCHEMA_VERSION,rulesetId:RULESET_ID,revision,dataHash,activeSyncId:syncId,companySnapshot:file.company||{},verifierSnapshot:file.verifier||{},shipSnapshot:file.ship||{},monitoring:file.monitoring||{},ice:file.ice||{},flexibility:file.flexibility||{},rowCounts:core.rowCounts,createdAt:ts,createdBy:user.uid});
    tx.set(yRef.collection("auditEvents").doc(auditId),{eventId:auditId,action:"FILE_SYNC",actorUid:user.uid,actorRole:role,at:ts,fromRevision:Number(live.revision||0),toRevision:revision,beforeHash:live.dataHash||null,afterHash:dataHash,rulesetId:RULESET_ID,syncId,immutable:true});
  });
  return {unchanged:false,revision,dataHash,status:"draft",syncId};
}

function readiness(file) {
  const missing=[]; const req=(ok,label)=>{if(!ok)missing.push(label);}; const c=file.company||{},s=file.ship||{},m=file.monitoring||{};
  req(c.companyName,"Shipping company adı");req(c.imoCompanyNumber,"IMO Unique Company & Registered Owner ID");req(c.registeredOwnerName,"Registered owner adı");
  if(c.role!=="gemi-sahibi")req(c.formalMandateReference,"Formal mandate/delegation referansı");
  req(s.shipName,"Gemi adı");req(s.imoNumber,"IMO ship identification number");req(s.portOfRegistry,"Port of registry");req(s.flagState,"Flag State");req(Number(s.grossTonnage)>0,"Gross Tonnage");
  req(m.monitoringPlanVersion,"Monitoring Plan version");req(m.monitoringPlanReferenceDate,"Monitoring Plan reference date");req(m.fuelMonitoringMethod,"Fuel monitoring method");req(m.dataGapMethod,"Data-gap method");req(Array.isArray(m.emissionSources)&&m.emissionSources.length>0,"Emission sources listesi");
  req(file.voyages?.length>0,"Voyage register");req(file.fuels?.length>0,"Fuel/energy register");
  (file.voyages||[]).forEach((v,i)=>{req(v.departurePort&&v.arrivalPort,`Sefer ${i+1}: limanlar`);req(v.departureAt&&v.arrivalAt,`Sefer ${i+1}: tarih/saat`);if(v.dataGap)req(v.dataGapReason,`Sefer ${i+1}: data-gap gerekçesi`);});
  (file.fuels||[]).forEach((f,i)=>{req(f.fuelType,`Yakıt ${i+1}: tür`);req(f.bdnReference||Number(f.opsElectricityKwh)>0,`Yakıt ${i+1}: BDN/electricity reference`);req(Number(f.energyMj)>0,`Yakıt ${i+1}: energy MJ`);req(f.measurementMethod,`Yakıt ${i+1}: measurement method`);req(f.factorSourceReference,`Yakıt ${i+1}: factor source`);});
  REQUIRED_EVIDENCE.forEach(k=>req(file.evidence?.[k]===true,`Kanıt: ${k}`)); return {ready:missing.length===0,missing};
}

async function checkpoint(user,ctx,lock) {
  const role=await authorize(ctx.companyId,user.uid,lock?LOCK_ROLES:WRITE_ROLES); const h=await hydrate(ctx);
  if(!h?.file)throw httpError(409,"NO_DATA","Kaydedilmiş çalışma verisi bulunamadı"); if(h.status==="locked")throw httpError(423,"FILE_LOCKED","Dosya zaten kilitli");
  const gate=readiness(h.file); if(lock&&!gate.ready)throw httpError(422,"READINESS_BLOCKED","Kritik hazırlık alanları tamamlanmadan dosya kilitlenemez",{missing:gate.missing});
  const versionId=randomId(lock?"lock":"checkpoint"),ts=nowIso();
  const snapshotHash=canonicalHash({product:"SKDMhesapla Maritime Carbon Compliance Preparation File",schemaVersion:SCHEMA_VERSION,rulesetId:RULESET_ID,sourceRevision:h.revision,sourceHash:h.dataHash,file:h.file,type:lock?"locked-preparation":"checkpoint"});
  await db.runTransaction(async tx=>{const yRef=yearRef(ctx),ys=await tx.get(yRef),d=ys.data()||{};if(d.status==="locked")throw httpError(423,"FILE_LOCKED","Dosya kilitli");const auditId=randomId("audit");tx.set(yRef.collection("versions").doc(versionId),{versionId,type:lock?"locked-preparation":"checkpoint",immutable:true,schemaVersion:SCHEMA_VERSION,rulesetId:RULESET_ID,snapshotHash,sourceHash:h.dataHash,sourceRevision:h.revision,activeSyncId:d.activeSyncId,companySnapshot:h.file.company||{},verifierSnapshot:h.file.verifier||{},shipSnapshot:h.file.ship||{},monitoring:h.file.monitoring||{},ice:h.file.ice||{},flexibility:h.file.flexibility||{},rowCounts:d.rowCounts||{},readiness:gate,createdAt:ts,createdBy:user.uid});tx.set(yRef.collection("auditEvents").doc(auditId),{eventId:auditId,action:lock?"FILE_LOCKED_PREPARATION":"CHECKPOINT_CREATED",actorUid:user.uid,actorRole:role,at:ts,revision:h.revision,dataHash:h.dataHash,snapshotHash,rulesetId:RULESET_ID,immutable:true});tx.set(yRef,{lastSnapshotVersion:versionId,lastSnapshotHash:snapshotHash,...(lock?{status:"locked",lockedAt:ts,lockedBy:user.uid,lockedPreparationHash:snapshotHash}:{}),updatedAt:ts,updatedBy:user.uid},{merge:true});});
  return {versionId,snapshotHash,readiness:gate,status:lock?"locked":h.status};
}

async function listVersions(user,ctx){await authorize(ctx.companyId,user.uid,READ_ROLES);const s=await yearRef(ctx).collection("versions").orderBy("createdAt","desc").limit(100).get();return s.docs.map(d=>d.data());}
async function listAudit(user,ctx){await authorize(ctx.companyId,user.uid,READ_ROLES);const s=await yearRef(ctx).collection("auditEvents").orderBy("at","desc").limit(200).get();return s.docs.map(d=>d.data());}
async function members(user,cid){await authorize(cid,user.uid,ADMIN_ROLES);const s=await companyRef(cid).collection("members").get();return s.docs.map(d=>d.data());}
async function upsertMember(user,cid,body){const actorRole=await authorize(cid,user.uid,ADMIN_ROLES);const uid=String(body.uid||"").slice(0,128),role=String(body.role||"");if(!uid||!ROLES.has(role)||role==="owner")throw httpError(400,"MEMBER_INVALID","Geçerli uid ve owner dışı rol gerekli");const ts=nowIso();await memberRef(cid,uid).set({uid,role,active:body.active!==false,createdAt:ts,createdBy:user.uid,updatedAt:ts,updatedBy:user.uid},{merge:true});await companyRef(cid).collection("auditEvents").doc(randomId("audit")).set({action:"MEMBER_UPSERT",actorUid:user.uid,actorRole,targetUid:uid,role,active:body.active!==false,at:ts,immutable:true});return{uid,role,active:body.active!==false};}

exports.maritimeApi = onRequest({region:"europe-west3",cors:true,memory:"512MiB",timeoutSeconds:120,maxInstances:20},async(req,res)=>{
  if(req.method==="OPTIONS"){res.status(204).send("");return;}
  try{
    const user=await requireUser(req);const path=String(req.path||"").replace(/^\/api\/maritime/,"").replace(/\/+$/,"")||"/";const home=await ensureWorkspace(user);
    if(path==="/health"&&req.method==="GET"){res.json({ok:true,service:"maritime-enterprise-backend",schemaVersion:SCHEMA_VERSION,rulesetId:RULESET_ID});return;}
    if(path==="/workspace"&&req.method==="GET"){const ctx=await currentContext(user,Number(req.query.year)||2026),role=await authorize(ctx.companyId,user.uid,READ_ROLES);res.json({ok:true,context:ctx,role,fileState:await hydrate(ctx),retentionPolicy:RETENTION_POLICY});return;}
    if(path==="/files"&&req.method==="POST"){const ctx=await createFile(user,req.body?.year||2026);res.status(201).json({ok:true,context:ctx,revision:0});return;}
    if(path==="/file"&&req.method==="GET"){const ctx=contextFrom(home,{context:{companyId:req.query.companyId,fleetId:req.query.fleetId,shipId:req.query.shipId,year:req.query.year}});if(!ctx.shipId||!ctx.year)throw httpError(404,"NO_ACTIVE_FILE","Aktif dosya bulunamadı");await authorize(ctx.companyId,user.uid,READ_ROLES);res.json({ok:true,...(await hydrate(ctx))});return;}
    if(path==="/file"&&req.method==="PUT"){const ctx=contextFrom(home,req.body||{});if(!ctx.shipId||!ctx.year)throw httpError(400,"CONTEXT_REQUIRED","Dosya context zorunlu");const r=await syncFile(user,ctx,req.body?.file||{},req.body?.expectedRevision);await homeRef(user.uid).set({...ctx,updatedAt:nowIso()},{merge:true});res.json({ok:true,context:ctx,...r});return;}
    if(path==="/checkpoint"&&req.method==="POST"){const ctx=contextFrom(home,req.body||{});res.json({ok:true,...(await checkpoint(user,ctx,false))});return;}
    if(path==="/lock"&&req.method==="POST"){const ctx=contextFrom(home,req.body||{});res.json({ok:true,...(await checkpoint(user,ctx,true))});return;}
    if(path==="/versions"&&req.method==="GET"){const ctx=contextFrom(home,{context:{companyId:req.query.companyId,fleetId:req.query.fleetId,shipId:req.query.shipId,year:req.query.year}});res.json({ok:true,versions:await listVersions(user,ctx)});return;}
    if(path==="/audit"&&req.method==="GET"){const ctx=contextFrom(home,{context:{companyId:req.query.companyId,fleetId:req.query.fleetId,shipId:req.query.shipId,year:req.query.year}});res.json({ok:true,events:await listAudit(user,ctx)});return;}
    if(path==="/members"&&req.method==="GET"){res.json({ok:true,members:await members(user,home.companyId)});return;}
    if(path==="/members"&&req.method==="POST"){res.json({ok:true,member:await upsertMember(user,home.companyId,req.body||{})});return;}
    throw httpError(404,"NOT_FOUND","Maritime API endpoint bulunamadı");
  }catch(e){console.error("maritimeApi",e);fail(res,e);}
});

module.exports._test={sanitize,normalizeFile,canonicalHash,readiness,RETENTION_POLICY,RULESET_ID,SCHEMA_VERSION};
