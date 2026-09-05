import crypto from "node:crypto";
import { createRequire } from "node:module";

const requireFromFunctions = createRequire(new URL("../../functions/package.json", import.meta.url));
const { initializeApp, cert } = requireFromFunctions("firebase-admin/app");
const { getStorage } = requireFromFunctions("firebase-admin/storage");

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON required");
const serviceAccount = JSON.parse(raw);
const app = initializeApp({ credential: cert(serviceAccount), projectId: "carbon-web-1265b" });
const storage = getStorage(app);
const candidates = ["carbon-web-1265b-maritime-evidence"];
let passed = 0;

for (const bucketName of candidates) {
  const bucket = storage.bucket(bucketName);
  const key = `_e2e-storage-probe/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.txt`;
  try {
    let exists: boolean | string = "unknown";
    try { [exists] = await bucket.exists(); } catch (error: any) { console.log(`BUCKET EXISTS CHECK ${bucketName} code=${error?.code || "n/a"} message=${String(error?.message || error).replace(/\s+/g, " ").slice(0, 400)}`); }
    console.log(`BUCKET ${bucketName} exists=${exists}`);
    await bucket.file(key).save(Buffer.from("teb232-storage-probe", "utf8"), { resumable: false, metadata: { contentType: "text/plain" } });
    const [metadata] = await bucket.file(key).getMetadata();
    const [bytes] = await bucket.file(key).download();
    if (bytes.toString("utf8") !== "teb232-storage-probe") throw new Error("round-trip content mismatch");
    console.log(`WRITE/READ PASS ${bucketName} generation=${metadata.generation || "n/a"} size=${metadata.size || "n/a"}`);
    await bucket.file(key).delete({ ignoreNotFound: true });
    console.log(`DELETE PASS ${bucketName}`);
    passed += 1;
  } catch (error: any) {
    console.log(`PROBE FAIL ${bucketName} code=${error?.code || "n/a"} message=${String(error?.message || error).replace(/\s+/g, " ").slice(0, 700)}`);
  }
}

if (passed < 1) throw new Error("Maritime evidence bucket does not support authenticated write/read/delete");
console.log(`TEB232 STORAGE PROBE PASS candidates=${passed}`);
