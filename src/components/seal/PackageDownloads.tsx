/** 12 parçalı tam kurumsal denetime hazırlık paketi */
export const SEALED_PACKAGE_FILES = [
  { filename: "Kapsamli-Durum-Raporu.pdf", label: "Kapsamlı Durum Raporu (A'dan Z'ye paket özeti)" },
  { filename: "Denetime-Hazirlik-Dosyasi.pdf", label: "Denetime hazırlık ana dosyası (İdari Kimlik & Yönetici Özeti)" },
  { filename: "Emisyon-Hesaplama-Eki.pdf", label: "Emisyon hesaplama ve yoğunluk eki (Spesifik Emisyonlar)" },
  { filename: "SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx", label: "SKDM İletişim Özeti (Communication Template alan özeti)" },
  { filename: "Izleme-Yontem-Plani.pdf", label: "İzleme ve Metodoloji Planı (MMP / ISO 14064 Uyumlu)" },
  { filename: "Kanit-Kayit-Defteri.xlsx", label: "Faaliyet verisi ve kanıt kayıt defteri (Faturalar & Sayaçlar)" },
  { filename: "Dogrulayici-Calisma-Alani.xlsx", label: "Doğrulayıcı ön-doldurulmuş çalışma alanı (Verifier Worksheet)" },
  { filename: "Oncul-Madde-Tedarikci-Beyani.pdf", label: "Öncül madde (Precursor) tedarikçi beyan ve tespit eki" },
  { filename: "Elektrik-ve-Isi-Denge-Raporu.xlsx", label: "Elektrik ve ısı denge raporu (Energy & Heat Balance)" },
  { filename: "De-Minimis-Muafiyet-Kapsam-Beyani.pdf", label: "De Minimis ve kapsam muafiyet beyannamesi (50t/yıl kuralı)" },
  { filename: "Hesaplama-Izi.json", label: "Deterministik hesaplama izi (Register snapshot gömülü)" },
  { filename: "BUTUNLIK-MANIFESTOSU.json", label: "Bütünlük manifestosu ve SHA-256 dijital mührü" },
] as const;

export function PackageDownloads({ zipName }: { zipName: string }) {
  return (
    <div className="rounded-2xl border border-brand-500/40 bg-brand-900/60 p-4 text-xs text-brand-mist space-y-2">
      <p className="font-bold text-brand-500 text-sm">Mühürlü Paket Başarıyla Üretildi: {zipName}</p>
      <p className="text-xs font-semibold text-white">12 Dosyalı Tam Denetime Hazırlık Paketi:</p>
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
