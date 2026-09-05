/**
 * EU Denizcilik Karbon Uyumu — Firestore Veri Erişim Katmanı
 * Şirket → Filo → Gemi → Raporlama Yılı → Sefer → Yakıt → Kanıt hiyerarşisi
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";
import type {
  MaritimeCompany,
  Vessel,
  Voyage,
  FuelConsumption,
  EvidenceDocument,
  AuditLogEntry,
  ReportingYearStatus,
} from "./types";

export async function saveMaritimeCompany(company: MaritimeCompany): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, "maritime_companies", company.id);
  await setDoc(ref, {
    ...company,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function getMaritimeCompany(companyId: string): Promise<MaritimeCompany | null> {
  const db = getFirestoreDb();
  const ref = doc(db, "maritime_companies", companyId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as MaritimeCompany;
}

export async function saveVessel(vessel: Vessel): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, "maritime_companies", vessel.companyId, "vessels", vessel.id);
  await setDoc(ref, vessel, { merge: true });
}

export async function getVessel(companyId: string, vesselId: string): Promise<Vessel | null> {
  const db = getFirestoreDb();
  const ref = doc(db, "maritime_companies", companyId, "vessels", vesselId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as Vessel;
}

export async function saveVoyage(
  companyId: string,
  vesselId: string,
  year: number,
  voyage: Voyage
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(
    db,
    "maritime_companies",
    companyId,
    "vessels",
    vesselId,
    "reporting_years",
    String(year),
    "voyages",
    voyage.id
  );
  await setDoc(ref, voyage, { merge: true });
}

export async function getVoyagesForYear(
  companyId: string,
  vesselId: string,
  year: number
): Promise<Voyage[]> {
  const db = getFirestoreDb();
  const ref = collection(
    db,
    "maritime_companies",
    companyId,
    "vessels",
    vesselId,
    "reporting_years",
    String(year),
    "voyages"
  );
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as Voyage);
}

export async function saveFuelConsumption(
  companyId: string,
  vesselId: string,
  year: number,
  fuel: FuelConsumption
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(
    db,
    "maritime_companies",
    companyId,
    "vessels",
    vesselId,
    "reporting_years",
    String(year),
    "fuel_consumptions",
    fuel.id
  );
  await setDoc(ref, fuel, { merge: true });
}

export async function getFuelConsumptionsForYear(
  companyId: string,
  vesselId: string,
  year: number
): Promise<FuelConsumption[]> {
  const db = getFirestoreDb();
  const ref = collection(
    db,
    "maritime_companies",
    companyId,
    "vessels",
    vesselId,
    "reporting_years",
    String(year),
    "fuel_consumptions"
  );
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as FuelConsumption);
}

export async function saveEvidenceDocument(
  companyId: string,
  vesselId: string,
  year: number,
  evidence: EvidenceDocument
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(
    db,
    "maritime_companies",
    companyId,
    "vessels",
    vesselId,
    "reporting_years",
    String(year),
    "evidences",
    evidence.id
  );
  await setDoc(ref, evidence, { merge: true });
}

export async function getEvidencesForYear(
  companyId: string,
  vesselId: string,
  year: number
): Promise<EvidenceDocument[]> {
  const db = getFirestoreDb();
  const ref = collection(
    db,
    "maritime_companies",
    companyId,
    "vessels",
    vesselId,
    "reporting_years",
    String(year),
    "evidences"
  );
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as EvidenceDocument);
}

export async function recordMaritimeAuditLog(
  companyId: string,
  vesselId: string,
  year: number,
  log: AuditLogEntry
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(
    db,
    "maritime_companies",
    companyId,
    "vessels",
    vesselId,
    "reporting_years",
    String(year),
    "audit_logs",
    log.id
  );
  await setDoc(ref, {
    ...log,
    createdAt: new Date().toISOString(),
  });
}

export async function updateReportingYearStatus(
  companyId: string,
  vesselId: string,
  year: number,
  status: ReportingYearStatus,
  auditHash?: string
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(
    db,
    "maritime_companies",
    companyId,
    "vessels",
    vesselId,
    "reporting_years",
    String(year)
  );
  await setDoc(
    ref,
    {
      status,
      ...(auditHash ? { auditHash } : {}),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
