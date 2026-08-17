/** Mühürlü paket indirme listesi — SSOT: package-manifest.ts */
import {
  SEALED_PACKAGE_FILES,
  SEALED_PACKAGE_FILE_COUNT,
} from "@/lib/skdm/package-manifest";
import { TKD_FILENAME } from "@/lib/skdm/pdf/tedarikciKarbonDosyasi";

export { SEALED_PACKAGE_FILES, SEALED_PACKAGE_FILE_COUNT };

export function PackageDownloads({
  zipName,
  varyant = "skdm",
}: {
  zipName: string;
  varyant?: "skdm" | "tkd";
}) {
  if (varyant === "tkd") {
    return (
      <div className="rounded-2xl border border-brand-500/40 bg-brand-900/60 p-4 text-xs text-brand-mist space-y-2">
        <p className="font-bold text-brand-500 text-sm">Tedarikçi Karbon Veri Dosyası üretildi: {zipName}</p>
        <p className="text-xs font-semibold text-white">
          ISO 14067 cradle-to-gate üretici beyanı (12 bölüm). SKDM / CBAM beyanı değildir.
        </p>
        <p className="font-mono font-bold text-white">{TKD_FILENAME}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-500/40 bg-brand-900/60 p-4 text-xs text-brand-mist space-y-2">
      <p className="font-bold text-brand-500 text-sm">Mühürlü Paket Başarıyla Üretildi: {zipName}</p>
      <p className="text-xs font-semibold text-white">
        {SEALED_PACKAGE_FILE_COUNT} Dosyalı Tam Denetime Hazırlık Paketi:
      </p>
      <ul className="list-disc space-y-1.5 pl-4 text-xs">
        {SEALED_PACKAGE_FILES.map((f) => (
          <li key={f.filename}>
            <span className="font-mono font-bold text-white">{f.filename}</span>
            <span className="text-brand-mist"> — {f.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
