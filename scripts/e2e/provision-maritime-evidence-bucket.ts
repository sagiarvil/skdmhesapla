import { createRequire } from "node:module";

const requireFromFunctions = createRequire(new URL("../../functions/package.json", import.meta.url));
const { GoogleAuth } = requireFromFunctions("google-auth-library");

const PROJECT_ID = "carbon-web-1265b";
const BUCKET = "carbon-web-1265b.firebasestorage.app";
const LOCATION = "EU";
const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON required");
const credentials = JSON.parse(raw);
if (!credentials.client_email || !credentials.private_key) throw new Error("service account credentials incomplete");

const auth = new GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
const client = await auth.getClient();
const tokenResponse = await client.getAccessToken();
const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
if (!token) throw new Error("Unable to mint Google Cloud access token");

const headers = { authorization: `Bearer ${token}`, "content-type": "application/json" };
const getUrl = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(BUCKET)}?projection=full`;
let existing = await fetch(getUrl, { headers: { authorization: `Bearer ${token}` } });
if (existing.status === 404) {
  const createUrl = `https://storage.googleapis.com/storage/v1/b?project=${encodeURIComponent(PROJECT_ID)}&projection=full`;
  const created = await fetch(createUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: BUCKET,
      location: LOCATION,
      storageClass: "STANDARD",
      iamConfiguration: { uniformBucketLevelAccess: { enabled: true } },
      labels: { workload: "maritime-evidence", managedby: "skdmhesapla" },
    }),
  });
  const text = await created.text();
  if (!created.ok && created.status !== 409) throw new Error(`Bucket create failed HTTP ${created.status}: ${text.slice(0, 1200)}`);
  console.log(created.status === 409 ? `BUCKET ALREADY CREATED ${BUCKET}` : `BUCKET CREATED ${BUCKET} location=${LOCATION}`);
} else if (!existing.ok) {
  throw new Error(`Bucket lookup failed HTTP ${existing.status}: ${(await existing.text()).slice(0, 1200)}`);
} else {
  const body = await existing.json();
  console.log(`BUCKET EXISTS ${BUCKET} location=${body.location || "unknown"}`);
}

existing = await fetch(getUrl, { headers: { authorization: `Bearer ${token}` } });
if (!existing.ok) throw new Error(`Bucket verification failed HTTP ${existing.status}: ${(await existing.text()).slice(0, 1200)}`);
const meta = await existing.json();
if (meta.name !== BUCKET) throw new Error("Bucket verification name mismatch");
console.log(`MARITIME EVIDENCE BUCKET READY name=${meta.name} location=${meta.location || "unknown"} storageClass=${meta.storageClass || "unknown"}`);
