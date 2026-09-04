import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { MaritimeScopeWizard } from "@/components/maritime/MaritimeScopeWizard";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/kapsam-kontrolu/",
  title: "Denizcilik Kapsam Kontrolü — EU MRV, ETS ve FuelEU",
  description: "Gemi tipi, gross tonnage ve liman bağlantısıyla EU MRV, EU ETS ve FuelEU Maritime ön kapsam kontrolü yapın; ETS maliyet maruziyetini kendi EUA fiyatınızla tahmin edin.",
});

export default function DenizcilikKapsamKontroluPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] text-ink-900">
      <section className="border-b border-line bg-white py-10 sm:py-14"><div className="mx-auto max-w-6xl px-5 sm:px-6"><Link href="/denizcilik/" className="inline-flex items-center gap-2 text-sm font-black text-brand-900"><ArrowLeft className="h-4 w-4" /> Denizcilik ana sayfası</Link><h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">EU MRV + EU ETS + FuelEU kapsamını tek ekranda ön kontrol edin</h1><p className="mt-4 max-w-3xl text-base font-medium leading-8 text-ink-700">Bu ekran karar vermeyi hızlandırır: önce hangi mevzuatın muhtemel olduğunu gösterir, sonra varsa ETS maliyet maruziyetini kullanıcı tarafından girilen fiyatla hesaplar.</p></div></section>
      <section className="py-8 sm:py-12"><div className="mx-auto max-w-6xl px-5 sm:px-6"><MaritimeScopeWizard /></div></section>
      <section className="border-t border-line bg-white py-10"><div className="mx-auto max-w-6xl px-5 sm:px-6"><h2 className="text-xl font-black">Resmî kaynak sınırı</h2><p className="mt-2 max-w-4xl text-sm font-medium leading-7 text-ink-700">Kural motoru ön sınıflandırma yapar; liman tanımı, gemi istisnaları, administering authority ve verifier değerlendirmesi gibi hukuki ayrıntılar işlem tarihinde resmî kaynaklardan yeniden doğrulanmalıdır.</p><div className="mt-5 flex flex-wrap gap-3 text-sm font-black"><a href="https://climate.ec.europa.eu/areas-action/transport-decarbonisation/reducing-emissions-shipping-sector_en" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-brand-900 hover:bg-brand-50">EU ETS / Maritime <ExternalLink className="h-4 w-4" /></a><a href="https://www.emsa.europa.eu/reducing-emissions/mrv-changes/faq-mrv-changes.html" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-brand-900 hover:bg-brand-50">EMSA MRV <ExternalLink className="h-4 w-4" /></a><a href="https://transport.ec.europa.eu/transport-modes/maritime/decarbonising-maritime-transport-fueleu-maritime_en" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-brand-900 hover:bg-brand-50">FuelEU Maritime <ExternalLink className="h-4 w-4" /></a></div></div></section>
    </main>
  );
}
