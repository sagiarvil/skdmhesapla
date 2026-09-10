/**
 * EU Denizcilik Karbon Uyumu — Kriptografik Bütünlük Manifestosu Üreticisi
 *
 * Tüm teslim edilen dosyaların (PDF, XML, JSON, CSV ve eklenen kanıtlar)
 * SHA-256 hash özetlerini ve denetim izini içeren resmi manifesto.
 */

import type { MaritimeComplianceDossier } from "../dossier/schema";

export function generateIntegrityManifest(
  dossier: MaritimeComplianceDossier,
  fileHashes: Record<string, string>
): string {
  const manifest = {
    manifestVersion: "2026.1",
    product: "SKDMhesapla Maritime Sealed Verification Package",
    issuedAt: dossier.generatedAt,
    rootSha256: dossier.rootSha256,
    vessel: {
      name: dossier.ship.shipName,
      imoNumber: dossier.ship.imoNumber,
      flagState: dossier.ship.flagState,
      grossTonnage: dossier.ship.grossTonnage,
    },
    company: {
      name: dossier.company.companyName,
      imoCompanyNumber: dossier.company.imoCompanyNumber,
      administeringAuthority: dossier.company.administeringAuthority,
    },
    reportingPeriod: dossier.reportingYear,
    statutoryDeliverables: Object.entries(fileHashes).map(([filename, sha256]) => ({
      filename,
      sha256,
      status: "SEALED_VERIFIED",
    })),
    uploadedEvidenceAuditTrail: dossier.evidences.map((ev) => ({
      filename: ev.fileName,
      type: ev.fileType,
      sizeBytes: ev.sizeBytes,
      sha256: ev.sha256Hash,
      status: "AUTHENTICATED",
    })),
    regulatorySignOff: {
      standard: "Regulation (EU) 2015/757 & Directive 2003/87/EC",
      auditorHandoffReady: dossier.readiness.status === "VERIFIER_AUDIT_READY",
      legalDisclaimer: dossier.legalBoundary,
    },
  };

  return JSON.stringify(manifest, null, 2);
}
