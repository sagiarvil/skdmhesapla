import Link from "next/link";
import { ArrowRight, Check, Minus, Ship, ShieldCheck } from "lucide-react";

const rows = [
  ["Ana kullanıcı", "Türk üretici / ihracatçı", "Gemi sahibi / ISM / işletmeci", "Gemi sahibi / ISM / işletmeci", "Gemi sahibi / ISM / işletmeci"],
  ["Kapsam mantığı", "GTİP / CN + ürün", "Gemi tipi + GT + AB/AEA seferi", "Gemi tipi + GT + AB/AEA seferi", "Gemi tipi + GT + AB liman çağrısı"],
  ["Emisyon odağı", "Gömülü emisyon", "CO2, CH4, N2O raporlama", "ETS kapsam CO2e + EUA", "Well-to-Wake GHG yoğunluğu"],
  ["Finansal çıktı", "CBAM maliyet etkisi", "Doğrudan maliyet değil", "EUA maliyet maruziyeti", "Uyum dengesi / olası açık"],
  ["Kanıt yapısı", "Tesis + üretim + kanıt zinciri", "Monitoring Plan + voyage/fuel evidence", "MRV doğrulanmış veri + allowance izi", "FuelEU monitoring + verifier evidence"],
] as const;

const products = ["CBAM / SKDM", "EU MRV", "EU ETS", "FuelEU"] as const;

export function MaritimeComparison() {
  return (
    <section className="border-y border-line bg-[#f7faf8] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-brand-900">
            <Ship className="h-3.5 w-3.5" /> Tek platform, ayrı mevzuat motorları
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Hangi iş için hangi modül gerekir?</h2>
          <p className="mt-3 text-sm font-medium leading-7 text-ink-700 sm:text-base">
            CBAM ile denizcilik kurallarını tek hesap motoruna karıştırmıyoruz. Ortak müşteri, belge ve denetim altyapısı korunurken her mevzuat kendi kapsam ve hesap mantığıyla çalışır.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-black/[0.04]">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#071812] text-white">
                  <th className="w-[190px] px-5 py-5 text-xs font-black uppercase tracking-[0.12em] text-slate-300">Karar alanı</th>
                  {products.map((product, index) => (
                    <th key={product} className="px-5 py-5">
                      <div className="flex items-center gap-2 text-sm font-black sm:text-base">
                        {index === 0 ? <ShieldCheck className="h-4 w-4 text-brand-400" /> : <Ship className="h-4 w-4 text-brand-400" />}
                        {product}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, ...cells], rowIndex) => (
                  <tr key={label} className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#fbfdfb]"}>
                    <th className="border-t border-line px-5 py-4 text-sm font-black text-ink-900">{label}</th>
                    {cells.map((cell, index) => (
                      <td key={`${label}-${index}`} className="border-t border-line px-5 py-4 text-sm font-medium leading-6 text-ink-700">{cell}</td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-brand-50">
                  <th className="border-t border-brand-800/15 px-5 py-5 text-sm font-black text-ink-900">SKDMHesapla içinde</th>
                  <td className="border-t border-brand-800/15 px-5 py-5"><span className="inline-flex items-center gap-2 text-sm font-black text-brand-900"><Check className="h-4 w-4" /> Mevcut ana ürün</span></td>
                  <td className="border-t border-brand-800/15 px-5 py-5"><span className="inline-flex items-center gap-2 text-sm font-black text-brand-900"><Check className="h-4 w-4" /> Denizcilik dikeyi</span></td>
                  <td className="border-t border-brand-800/15 px-5 py-5"><span className="inline-flex items-center gap-2 text-sm font-black text-brand-900"><Check className="h-4 w-4" /> Denizcilik dikeyi</span></td>
                  <td className="border-t border-brand-800/15 px-5 py-5"><span className="inline-flex items-center gap-2 text-sm font-black text-brand-900"><Check className="h-4 w-4" /> Denizcilik dikeyi</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-sm font-black text-ink-900">Hangi sütunda olduğunuzu bilmiyor musunuz?</p>
              <p className="mt-1 text-sm font-medium text-ink-600">2 dakikalık kapsam kontrolü önce doğru mevzuat yolunu seçer.</p>
            </div>
            <Link href="/denizcilik/kapsam-kontrolu/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-black text-white hover:bg-brand-700">
              Denizcilik kapsamını kontrol et <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs font-medium leading-5 text-ink-600">
          <Minus className="mt-0.5 h-4 w-4 shrink-0" />
          Bu karşılaştırma ön yönlendirme içindir; nihai yükümlülük gemi tipi, GT, rota, liman ve istisnalarla birlikte doğrulanır.
        </div>
      </div>
    </section>
  );
}
