import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MARITIME_COMPARISON } from "@/data/maritime/content";

const columns = ["Karar alanı", "CBAM / SKDM", "EU MRV", "EU ETS", "FuelEU"] as const;

export function MaritimeComparison() {
  return (
    <section className="border-b border-line bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Karar tablosu</span>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Hangi hizmet size gerekiyor?</h2>
          <p className="mt-3 text-sm font-medium leading-7 text-ink-700 sm:text-base">
            Bu bölüm 21st.dev karşılaştırma yaklaşımıyla kurgulandı: kullanıcıyı metin okumaya zorlamadan doğru ürün hattına ayırır.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-white shadow-xl">
          <div className="grid grid-cols-5 bg-[#071812] text-white">
            {columns.map((column) => (
              <div key={column} className="border-r border-white/10 px-4 py-4 text-xs font-black uppercase tracking-[0.08em] last:border-r-0 sm:text-sm">
                {column}
              </div>
            ))}
          </div>
          {MARITIME_COMPARISON.map((row) => (
            <div key={row[0]} className="grid grid-cols-5 border-t border-line text-sm">
              {row.map((cell, index) => (
                <div key={`${row[0]}-${index}`} className={index === 0 ? "bg-brand-50 px-4 py-4 font-black text-brand-950" : "px-4 py-4 font-semibold leading-6 text-ink-800"}>
                  {index > 0 && <CheckCircle2 className="mb-2 h-4 w-4 text-brand-700" />}
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-brand-800/15 bg-brand-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h3 className="text-xl font-black text-brand-950">Sütununuz net değilse kapsam kontrolüyle başlayın.</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink-700">Rol, gemi GT bilgisi, AB liman uğrağı ve CBAM yük potansiyeli birlikte değerlendirilir.</p>
          </div>
          <Link href="/denizcilik/kapsam-kontrolu/" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950 shadow-lg sm:mt-0">
            Kapsamı kontrol et <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
