import Link from "next/link";

const SOURCE_URL =
  "https://taxation-customs.ec.europa.eu/news/european-commission-publishes-guidance-cbam-verifiers-and-accreditation-bodies-2026-08-24_en";

export function VerificationGuidanceNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className="rounded-2xl border border-[#d9e3cf] bg-[#f5f8f1] p-4 sm:p-5"
      aria-label="24 Ağustos 2026 CBAM doğrulama ve akreditasyon güncellemesi"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#4e5f35]">
        <span>24 Ağustos 2026</span>
        <span aria-hidden>•</span>
        <span>European Commission / DG TAXUD</span>
      </div>
      <h2 className="mt-2 text-lg font-extrabold tracking-tight text-[#202124] sm:text-xl">
        CBAM doğrulayıcı ve Registry erişim akışı güncellendi
      </h2>
      <p className="mt-2 text-sm font-medium leading-6 text-[#4d5156] sm:text-base">
        Doğrulayıcı önce ilgili Ulusal Akreditasyon Kuruluşundan CBAM akreditasyonu alır; ardından
        CBAM Registry erişimi için başvurur. Erişim, ilgili Ulusal Yetkili Makamın akreditasyonu
        kontrol etmesinden sonra verilir.
      </p>
      {!compact && (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#3c4043]">
          <li>
            <b>1 Eylül 2026:</b> Akredite doğrulayıcıların Registry kayıt/erişim süreci başlayabilir.
          </li>
          <li>
            <b>İki aylık süre:</b> CBAM akreditasyonunu alan doğrulayıcı, akreditasyon tarihinden
            itibaren iki ay içinde; ancak 1 Eylül 2026’dan önce olmamak üzere Registry’ye kaydolmalıdır.
          </li>
          <li>
            <b>Ocak 2027:</b> Doğrulama raporları CBAM Registry üzerinden düzenlenmeye başlanır;
            ithalatçılar doğrulanmış gerçek emisyon verilerini CBAM beyanlarında kullanabilir.
          </li>
        </ul>
      )}
      <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#5f6368]">
        Bu güncelleme gömülü emisyon formülünü, varsayılan değerleri veya benchmark hesabını değiştirmez.
        SKDMHesapla doğrulayıcı değildir; çalışma alanı doğrulama öncesi veri, kanıt ve hesap izini hazırlar.
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
        <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="text-[#355f2d] underline underline-offset-4">
          Resmî Komisyon kaynağı
        </a>
        <Link
          href="/mevzuat-guncellemeleri/cbam-verification-accreditation-guidance-24-agustos-2026/"
          className="text-[#355f2d] underline underline-offset-4"
        >
          Etki ve yapılacaklar
        </Link>
      </div>
    </aside>
  );
}
