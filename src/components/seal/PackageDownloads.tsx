/** Plan 20 — mühür sonrası 6 dosya listesi (ZIP içeriği şeffaflığı). */
export const SEALED_PACKAGE_FILES = [
  { filename: "Denetime-Hazirlik-Dosyasi.pdf", label: "Denetime hazırlık dosyası" },
  { filename: "Emisyon-Hesaplama-Eki.pdf", label: "Emisyon hesaplama eki" },
  { filename: "Kanit-Kayit-Defteri.xlsx", label: "Kanıt kayıt defteri" },
  { filename: "Dogrulayici-Calisma-Alani.xlsx", label: "Doğrulayıcı çalışma alanı" },
  { filename: "Hesaplama-Izi.json", label: "Hesaplama izi (register gömülü)" },
  { filename: "BUTUNLIK-MANIFESTOSU.json", label: "Bütünlük manifestosu (SHA-256)" },
] as const;

export function PackageDownloads({ zipName }: { zipName: string }) {
  return (
    <div className="rounded-ctl border border-brand-500/40 bg-brand-900/40 px-3 py-3 text-xs text-brand-mist">
      <p className="font-semibold text-brand-500">Mühürlü paket indirildi: {zipName}</p>
      <p className="mt-1 text-[11px] opacity-90">ZIP içinde 6 dosya:</p>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        {SEALED_PACKAGE_FILES.map((f) => (
          <li key={f.filename}>
            <span className="font-mono text-[11px] text-white">{f.filename}</span>
            <span className="text-brand-mist"> — {f.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
