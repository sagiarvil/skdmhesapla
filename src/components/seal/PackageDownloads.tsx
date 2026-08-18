/** Mühürlü paket indirme listesi — SSOT: package-manifest.ts (GATE-M4 audience). */
import { useCallback } from "react";
import {
  SEALED_PACKAGE_FILES,
  SEALED_PACKAGE_FILE_COUNT,
  sealedFileCountForAudience,
  type PackageAudience,
} from "@/lib/skdm/package-manifest";
import {
  buildSealedZipForAudience,
  type SealedPackageOutput,
} from "@/lib/skdm/package-seal";
import {
  PCF_SEALED_PACKAGE_FILES,
  PCF_SEALED_PACKAGE_FILE_COUNT,
} from "@/lib/pcf/package-manifest";
import { TKD_FILENAME } from "@/lib/skdm/pdf/tedarikciKarbonDosyasi";

import { CalculationProvenance } from "@/components/credential/CalculationProvenance";
import { KopyalaButonu } from "@/components/ui/KopyalaButonu";

export { SEALED_PACKAGE_FILES, SEALED_PACKAGE_FILE_COUNT };

function downloadZip(pkg: SealedPackageOutput, audience: PackageAudience, suffix: string) {
  const zip =
    audience === "verifier" && pkg.zipBytes
      ? pkg.zipBytes
      : buildSealedZipForAudience(pkg, audience);
  const copy = new Uint8Array(zip.byteLength);
  copy.set(zip);
  const blob = new Blob([copy], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${pkg.packageId}-${suffix}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

export function PackageDownloads({
  zipName,
  varyant = "skdm",
  calculationId,
  sha256,
  pkg,
}: {
  zipName: string;
  varyant?: "skdm" | "tkd" | "pcf";
  calculationId?: string;
  sha256?: string;
  pkg?: SealedPackageOutput | null;
}) {
  const calcId = calculationId || zipName.replace(/\.zip$/i, "");
  const onBuyerDownload = useCallback(() => {
    if (!pkg) return;
    downloadZip(pkg, "buyer", "Alici-Paylasim-Paketi");
  }, [pkg]);
  const onVerifierDownload = useCallback(() => {
    if (!pkg) return;
    downloadZip(pkg, "verifier", "Dogrulayici-Paketi");
  }, [pkg]);

  if (varyant === "tkd") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-500/40 bg-brand-900/60 p-4 text-xs text-brand-mist space-y-2">
          <p className="font-bold text-brand-500 text-sm inline-flex items-center gap-1.5">
            Tedarikçi Karbon Veri Dosyası üretildi: <span className="font-mono text-white">{calcId}</span>
            <KopyalaButonu deger={calcId} label="Paket numarası" />
          </p>
          <p className="text-xs font-semibold text-white">
            ISO 14067 cradle-to-gate üretici beyanı (12 bölüm). SKDM / CBAM beyanı değildir.
          </p>
          <p className="font-mono font-bold text-white">{TKD_FILENAME}</p>
        </div>
        <CalculationProvenance calculationId={calcId} sha256={sha256} />
      </div>
    );
  }

  if (varyant === "pcf") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-500/40 bg-brand-900/60 p-4 text-xs text-brand-mist space-y-2">
          <p className="font-bold text-brand-500 text-sm inline-flex items-center gap-1.5">
            Ürün karbon ayak izi paketi üretildi: <span className="font-mono text-white">{calcId}</span>
            <KopyalaButonu deger={calcId} label="Paket numarası" />
          </p>
          <p className="text-xs font-semibold text-white">
            {PCF_SEALED_PACKAGE_FILE_COUNT} dosyalık mühürlü PCF paketi (CBAM / SKDM beyanı değildir):
          </p>
          <ul className="list-disc space-y-1.5 pl-4 text-xs">
            {PCF_SEALED_PACKAGE_FILES.map((f) => (
              <li key={f.filename}>
                <span className="font-mono font-bold text-white">{f.filename}</span>
                <span className="text-brand-mist"> — {f.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <CalculationProvenance calculationId={calcId} sha256={sha256} />
      </div>
    );
  }

  const verifierOnlyCount =
    SEALED_PACKAGE_FILE_COUNT - sealedFileCountForAudience("buyer");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-500/40 bg-brand-900/60 p-4 text-xs text-brand-mist space-y-2">
        <p className="font-bold text-brand-500 text-sm inline-flex items-center gap-1.5">
          Mühürlü Paket Başarıyla Üretildi: <span className="font-mono text-white">{zipName}</span>
          <KopyalaButonu deger={calcId} label="Paket numarası" />
        </p>
        <p className="text-xs font-semibold text-white">
          {SEALED_PACKAGE_FILE_COUNT} Dosyalı Tam Denetime Hazırlık Paketi:
        </p>
        <ul className="list-disc space-y-1.5 pl-4 text-xs">
          {SEALED_PACKAGE_FILES.map((f) => (
            <li key={f.filename}>
              <span className="font-mono font-bold text-white">{f.filename}</span>
              <span className="text-brand-mist">
                {" "}
                — {f.label}
                {f.audience === "verifier" && (
                  <span className="font-bold text-amber-300"> [yalnızca doğrulayıcı]</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        <p className="pt-1 text-[11px] text-brand-mist">
          Öncül madde tedarikçi beyanı dahil doğrulayıcı belgeleri ({verifierOnlyCount} dosya) alıcı
          paylaşım paketinde yer almaz — gizlilik ayrımı paket motorunda uygulanır.
        </p>
        {pkg && (
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onVerifierDownload}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-bold text-brand-950 transition hover:bg-brand-400"
            >
              Doğrulayıcı / tam paketi indir ({SEALED_PACKAGE_FILE_COUNT} dosya)
            </button>
            <button
              type="button"
              onClick={onBuyerDownload}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.1]"
            >
              Alıcıya gönderim paketini indir ({sealedFileCountForAudience("buyer")} dosya)
            </button>
          </div>
        )}
      </div>

      <CalculationProvenance calculationId={calcId} sha256={sha256} />
    </div>
  );
}
