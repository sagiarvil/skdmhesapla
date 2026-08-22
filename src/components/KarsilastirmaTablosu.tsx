import Link from "next/link";
import { ArrowRight, CheckCircle2, HelpCircle, ShieldCheck } from "lucide-react";
import { ISLETMECI } from "@/config/isletmeci";

type Secenek = { id: string; baslik: string; altBaslik?: string; oneCikan?: boolean };
type Satir = { kriter: string; aciklama?: string; degerler: Record<string, string> };

const SECENEKLER: Secenek[] = [
  { id: "danismanlik", baslik: "Dış Danışmanlık", altBaslik: "Proje bazlı hizmet" },
  { id: "abonelik", baslik: "Abonelikli Yazılım", altBaslik: "Dönemsel lisans" },
  { id: "skdm", baslik: "SKDMHesapla", altBaslik: "Self-servis çalışma", oneCikan: true },
];

const SATIRLAR: Satir[] = [
  {
    kriter: "Ödeme Biçimi",
    degerler: {
      danismanlik: "Teklif üzerine, proje bazlı",
      abonelik: "Dönemsel abonelik (aylık/yıllık)",
      skdm: `${ISLETMECI.muhurFiyatiEtiket} tek seferlik (KDV dahil)`,
    },
  },
  {
    kriter: "Başlangıç Süresi",
    degerler: {
      danismanlik: "Haftalar / sağlayıcıya göre değişir",
      abonelik: "Kurulum ve eğitim adımı gerektirebilir",
      skdm: "Belgeler hazırsa aynı oturumda tamamlanır",
    },
  },
  {
    kriter: "Düzeltme & Güncelleme",
    degerler: {
      danismanlik: "Sözleşme ve ek fatura kapsamına bağlı",
      abonelik: "Sağlayıcının lisans koşullarına bağlı",
      skdm: "Aynı dosyada ücretsiz yeniden mühürleme",
    },
  },
  {
    kriter: "Arayüz ve Dil",
    degerler: {
      danismanlik: "Sağlayıcıya sorulmalıdır",
      abonelik: "Genellikle İngilizce / karmaşık",
      skdm: "Tamamen Türkçe & adım adım rehberli",
    },
  },
  {
    kriter: "Veri Konumu ve Güvenlik",
    degerler: {
      danismanlik: "Sağlayıcıya sorulmalıdır",
      abonelik: "Sağlayıcıya sorulmalıdır",
      skdm: `${ISLETMECI.sunucuKonumu} güvenli AB sunucusu`,
    },
  },
  {
    kriter: "Çıktının Niteliği",
    degerler: {
      danismanlik: "Danışmanlık hizmetinin kapsamına bağlı",
      abonelik: "Yazılım lisansının kapsamına bağlı",
      skdm: "6 parçalı denetime hazırlık çalışma paketi",
    },
  },
];

export default function KarsilastirmaTablosu() {
  return (
    <section className="border-b border-line bg-gradient-to-b from-white via-[#fbfdfa] to-white py-16 sm:py-24" aria-labelledby="karsilastirma-baslik">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Başlık Alanı */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-900 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            ÇALIŞMA BİÇİMLERİ &amp; MODEL KARŞILAŞTIRMASI
          </div>
          <h2 id="karsilastirma-baslik" className="text-2xl font-black tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
            Üç yolu aynı kriterlerle karşılaştırın.
          </h2>
          <p className="text-sm sm:text-base font-medium leading-relaxed text-ink-700">
            Diğer iki sütun belirli bir firmayı değil genel piyasa çalışma biçimini tanımlar. Kesin koşullar ilgili sağlayıcıdan doğrulanmalıdır.
          </p>
        </div>

        {/* Premium Tablo Konteyneri */}
        <div className="mt-10 overflow-hidden rounded-3xl border-2 border-brand-800/20 bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <caption className="sr-only">SKDM çalışma yollarının kriter bazlı karşılaştırması</caption>
              <thead>
                <tr className="border-b border-line bg-[#f8faf7]">
                  <th scope="col" className="p-5 sm:p-6 text-xs font-mono font-bold uppercase tracking-wider text-ink-500 w-[24%]">
                    Kriter
                  </th>
                  {SECENEKLER.map((s) => (
                    <th
                      key={s.id}
                      scope="col"
                      className={`p-5 sm:p-6 align-bottom ${
                        s.oneCikan
                          ? "bg-brand-950 text-white w-[36%] relative"
                          : "text-ink-900 w-[20%]"
                      }`}
                    >
                      {s.oneCikan && (
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 border border-brand-400/40 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-300">
                          <CheckCircle2 className="h-3 w-3 text-brand-400" />
                          Self-Servis Sistem
                        </div>
                      )}
                      <strong className="block text-lg font-black">{s.baslik}</strong>
                      {s.altBaslik && (
                        <span className={`block text-xs font-medium mt-0.5 ${s.oneCikan ? "text-slate-300" : "text-ink-500"}`}>
                          {s.altBaslik}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SATIRLAR.map((satir, idx) => (
                  <tr
                    key={satir.kriter}
                    className={`transition-colors hover:bg-slate-50/70 ${
                      idx % 2 === 1 ? "bg-[#fcfdfb]" : "bg-white"
                    }`}
                  >
                    <th scope="row" className="p-5 sm:p-6 font-bold text-ink-900 align-top">
                      {satir.kriter}
                    </th>
                    {SECENEKLER.map((s) => (
                      <td
                        key={s.id}
                        data-etiket={s.baslik}
                        className={`p-5 sm:p-6 align-top ${
                          s.oneCikan
                            ? "bg-brand-50/60 font-semibold text-brand-950 border-x-2 border-brand-800/15"
                            : "text-ink-700 font-medium"
                        }`}
                      >
                        {s.oneCikan ? (
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-brand-700 shrink-0 mt-0.5" />
                            <span>{satir.degerler[s.id]}</span>
                          </div>
                        ) : (
                          <span>{satir.degerler[s.id]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablo Altı Premium Eylem ve Güvence Barı */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-brand-800/20 bg-[#f8faf7] p-5 sm:px-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-700">
              <ShieldCheck className="h-5 w-5 text-brand-800 shrink-0" />
              <span>Mühür öncesi hiçbir adımda kart istenmez ve ücret talep edilmez.</span>
            </div>
            <Link
              href="/basla/"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-500 px-7 text-sm font-black text-brand-950 shadow-md hover:bg-brand-400 hover:scale-[1.02] transition shrink-0"
            >
              <span>Hemen Başla — Ücretsiz</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
