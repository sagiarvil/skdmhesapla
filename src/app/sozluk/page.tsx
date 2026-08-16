import type { Metadata } from "next";
import Link from "next/link";
import { BookMarked, Sparkles } from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";
import IcerikArama from "@/components/IcerikArama";

export const metadata: Metadata = {
  title: "SKDM Sözlüğü 2026 — CBAM Terimleri, İngilizce-Türkçe Karşılıkları ve Anlamları",
  description:
    "CBAM/SKDM mevzuatında geçen tüm terimlerin 40-60 kelimelik net ve sabit tanımları: embedded emissions, default values, bubble approach, precursor, declarant ve kontrol denkliği.",
};

export default function SozlukPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10 px-5 sm:px-6">
        <GeriLink />
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <BookMarked className="h-4 w-4" />
            <span>Tek Doğruluk Kaynağı &amp; Referans Kütüphanesi</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">
            SKDM Sözlüğü (v3)
          </h1>
          <p className="text-base font-semibold leading-relaxed text-ink-700 sm:text-xl">
            Her terimin 40–60 kelimelik sabit tanımı, resmi mevzuat karşılığı ve kullanım yeri.
            Süreç ve karar ağacı için:{" "}
            <Link href="/rehber/" className="font-bold text-brand-800 underline">
              SKDM Rehberi
            </Link>
            .
          </p>
        </div>

        <IcerikArama hedefId="sozluk-govde" />

        <div id="sozluk-govde" className="space-y-12">
          {/* BÖLÜM 1: İNGİLİZCE -> TÜRKÇE TAM KARŞILIKLAR */}
          <section data-ara="bölüm 1 ingilizce türkçe tam karşılıklar cbam embedded emissions see direct indirect actual default values goods simple complex precursor bubble approach carbon leakage">
            <div className="border-b-2 border-line pb-3">
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">
                BÖLÜM 1 — İngilizce &rarr; Türkçe Tam Karşılıklar
              </h2>
              <p className="mt-1 text-sm font-medium text-ink-600">
                AB resmi metinlerinde, Communication Template şablonunda ve teknik dokümanlarda geçen terimler.
              </p>
            </div>

            <div className="mt-8 space-y-8">
              {/* 1.1 Temel Kavramlar */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-brand-900 uppercase tracking-wider">
                  Temel Kavramlar
                </h3>

                <section
                  id="cbam"
                  data-ara="cbam carbon border adjustment mechanism sınırda karbon düzenleme mekanizması skdm"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">
                    CBAM (Carbon Border Adjustment Mechanism) &rarr; Sınırda Karbon Düzenleme Mekanizması (SKDM)
                  </dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    AB&apos;ye ithal edilen belirli ürünlerin üretimindeki karbon emisyonunu fiyatlayan yasal düzenleme.
                    <span className="mt-2 block text-xs font-bold text-brand-800 bg-brand-100/60 p-2.5 rounded-xl border border-brand-500/20">
                      Kullanım Yeri: AB resmi metinlerinde &ldquo;CBAM&rdquo;, kullanıcı metinlerinde &ldquo;SKDM&rdquo;.
                    </span>
                  </dd>
                </section>

                <section
                  id="embedded-emissions"
                  data-ara="embedded emissions gömülü emisyon sera gazı toplam"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">
                    Embedded emissions &rarr; Gömülü emisyon
                  </dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Bir ürünün ham maddesinden nihai haline kadar üretimi sırasında açığa çıkan toplam sera gazı emisyonu (tCO₂e).
                    <span className="mt-2 block text-xs font-bold text-brand-800 bg-brand-100/60 p-2.5 rounded-xl border border-brand-500/20">
                      Kullanım Yeri: Alıcınızın istediği temel veri; şablonlarda &ldquo;gömülü emisyon&rdquo; olarak geçer.
                    </span>
                  </dd>
                </section>

                <section
                  id="see"
                  data-ara="see specific embedded emissions spesifik gömülü emisyon ton başına sertifika maliyeti"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">
                    SEE (Specific Embedded Emissions) &rarr; Spesifik gömülü emisyon
                  </dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Üretilen ürünün birim tonu başına düşen emisyon miktarı (tCO₂e/ton).
                    <span className="mt-2 block text-xs font-bold text-brand-800 bg-brand-100/60 p-2.5 rounded-xl border border-brand-500/20">
                      Kullanım Yeri: Sertifika maliyeti bu değer üzerinden hesaplanır; Communication Template özeti ve sihirbaz çıktısının temelidir.
                    </span>
                  </dd>
                </section>

                <section
                  id="direct-emissions"
                  data-ara="direct emissions doğrudan emisyon kapsam 1 yakıt kimyasal süreç"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">
                    Direct emissions &rarr; Doğrudan emisyon (Kapsam 1)
                  </dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Tesis sınırları içinde yakılan yakıtlar veya kimyasal süreçlerden doğrudan bacadan salınan emisyonlar.
                    <span className="mt-2 block text-xs font-bold text-brand-800 bg-brand-100/60 p-2.5 rounded-xl border border-brand-500/20">
                      Kullanım Yeri: Demir-çelik ve alüminyum için (Annex II) sertifika yalnızca doğrudan emisyona bağlıdır.
                    </span>
                  </dd>
                </section>

                <section
                  id="indirect-emissions"
                  data-ara="indirect emissions dolaylı emisyon elektrik kapsam 2 çimento gübre annex ii"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">
                    Indirect emissions &rarr; Dolaylı emisyon (Kapsam 2)
                  </dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Üretim sırasında tüketilen şebeke elektriğinin üretilmesinden kaynaklanan emisyonlar.
                    <span className="mt-2 block text-xs font-bold text-brand-800 bg-brand-100/60 p-2.5 rounded-xl border border-brand-500/20">
                      Kullanım Yeri: Çimento ve gübre sektörlerinde sertifika maliyetine eklenir; demir-çelik ve alüminyumda bilgi amaçlıdır.
                    </span>
                  </dd>
                </section>

                <section
                  id="actual-emissions"
                  data-ara="actual emissions gerçek ölçülmüş emisyon tesis verisi actual vs default"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">
                    Actual emissions &rarr; Gerçek (ölçülmüş) emisyon
                  </dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Tesisinizin fiili yakıt, elektrik ve üretim verilerine dayanan gerçek emisyon değeri.
                    <span className="mt-2 block text-xs font-bold text-brand-800 bg-brand-100/60 p-2.5 rounded-xl border border-brand-500/20">
                      Kullanım Yeri: Varsayılan değerler yerine bunu kullanmak alıcınızın sertifika maliyetini ciddi oranda düşürür.
                    </span>
                  </dd>
                </section>

                <section
                  id="default-values"
                  data-ara="default values varsayılan değerler yüksek ab ceza pahalı sertifika"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">
                    Default values &rarr; Varsayılan değerler
                  </dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Üreticiden gerçek veri gelmediğinde AB&apos;nin uyguladığı ve genellikle sektörün en yüksek kirletici yüzdeliğini yansıtan emisyon katsayıları.
                    <span className="mt-2 block text-xs font-bold text-brand-800 bg-brand-100/60 p-2.5 rounded-xl border border-brand-500/20">
                      Kullanım Yeri: Kesin dönemde bu değerlerle beyan alıcınız için çok yüksek maliyet doğurur.
                    </span>
                  </dd>
                </section>
              </div>

              {/* 1.2 Ürün ve Malzeme Kavramları */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-brand-900 uppercase tracking-wider">
                  Ürün ve Malzeme Kavramları
                </h3>

                <section
                  id="goods"
                  data-ara="goods mallar ürünler g1 g10 şablon"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Goods &rarr; Mallar / Ürünler</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    SKDM kapsamındaki 8 haneli CN koduna sahip ticari ürünler. Şablonda G.1–G.10 katmanında tanımlanır.
                  </dd>
                </section>

                <section
                  id="simple-goods"
                  data-ara="simple goods basit mallar öncü maddesiz"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Simple goods &rarr; Basit mallar</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Üretiminde kendisi de SKDM kapsamında olan başka bir öncü madde (precursor) kullanılmayan ürünler. Yalnızca doğrudan ve dolaylı emisyonu hesaplanır.
                  </dd>
                </section>

                <section
                  id="complex-goods"
                  data-ara="complex goods bileşik mallar öncü maddeli e_purchprec"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Complex goods &rarr; Bileşik (karmaşık) mallar</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Üretiminde kendisi de SKDM kapsamında olan öncül maddeler kullanılan ürünler (ör. klinkerden çimento, amonyaktan gübre, kütükten profil).
                  </dd>
                </section>

                <section
                  id="precursor"
                  data-ara="precursor öncü madde girdi amonyak hurda dri e_purchprec see"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Precursor &rarr; Öncü madde</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Bileşik bir malın üretiminde hammadde olarak tüketilen ve kendi gömülü emisyonu nihai ürüne aktarılan girdi (E_PurchPrec katmanı).
                  </dd>
                </section>

                <section
                  id="bubble-approach"
                  data-ara="bubble approach kapsül yaklaşımı çoklu akış gübre çelik"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Bubble approach &rarr; Bubble approach (Kapsül yaklaşımı)</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Tesis içinde üretilen bir ara ürünün tamamı tek bir nihai ürüne gitmiyorsa (örneğin amonyağın bir kısmı satılıyor, bir kısmı nitrik aside gidiyorsa) her rotayı bağımsız bir üretim süreci olarak modelleme kuralı.
                  </dd>
                </section>

                <section
                  id="carbon-leakage"
                  data-ara="carbon leakage karbon kaçağı ab dışı mevzuat"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Carbon leakage &rarr; Karbon kaçağı</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    AB firmalarının karbon maliyetlerinden kaçınmak için üretimlerini karbon vergisi olmayan ülkelere kaydırması riski; SKDM bu kaçışı engellemek için yürürlüğe konmuştur.
                  </dd>
                </section>
              </div>

              {/* 1.3 Taraflar ve Roller */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-brand-900 uppercase tracking-wider">
                  Taraflar ve Roller
                </h3>

                <section
                  id="operator"
                  data-ara="operator operatör tesis işletmecisi firma siz"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Operator &rarr; Operatör (Tesis işletmecisi)</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Ürünü fiilen üreten sanayi tesisi veya tüzel kişilik (yani siz). Verinin doğruluğundan sorumludur.
                  </dd>
                </section>

                <section
                  id="installation"
                  data-ara="installation tesis unlocode koordinat a_instdata"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Installation &rarr; Tesis</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Üretimin gerçekleştiği coğrafi ve teknik birim. A_InstData katmanında UNLOCODE ve koordinatlarıyla tanımlanır.
                  </dd>
                </section>

                <section
                  id="declarant"
                  data-ara="declarant authorised declarant yetkili beyan sahibi alıcı ithalatçı registry"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">(Authorised CBAM) Declarant &rarr; Yetkili beyan sahibi</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    AB CBAM Registry sisteminde beyan yapma yetkisi olan AB tarafı; genellikle alıcınızdır. Resmi yasal beyan sorumluluğu ondadır.
                  </dd>
                </section>

                <section
                  id="importer"
                  data-ara="importer ithalatçı alıcı triyaj sertifika bedeli"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Importer &rarr; İthalatçı / Alıcı</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Ürününüzü AB gümrüğünden geçiren firma; CBAM sertifikasını bizzat satın alan taraftır.
                  </dd>
                </section>

                <section
                  id="accredited-verifier"
                  data-ara="accredited verifier akredite doğrulayıcı denetim bağımsız kuruluş"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Accredited verifier &rarr; Akredite doğrulayıcı</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Tesis emisyon verilerini denetleyen bağımsız ve AB tanınırlıklı kuruluş. Mühürlü paketimizdeki doğrulayıcı çalışma alanını denetler.
                  </dd>
                </section>
              </div>

              {/* 1.4 Hesaplama ve Süreç Terimleri */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-brand-900 uppercase tracking-wider">
                  Hesaplama ve Süreç Terimleri
                </h3>

                <section
                  id="activity-data"
                  data-ara="activity data faaliyet verisi m3 mwh ton b_eminst"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Activity data &rarr; Faaliyet verisi</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Döneme ait ölçülen miktar: yakılan doğalgaz (m³), tüketilen elektrik (MWh), üretilen ürün (ton). B_EmInst katmanında girilir.
                  </dd>
                </section>

                <section
                  id="emission-factor"
                  data-ara="emission factor emisyon faktörü katsayı co2e b_eminst"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Emission factor &rarr; Emisyon faktörü</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Bir birim faaliyetin kaç ton CO₂e açığa çıkardığını gösteren resmi katsayı (tCO₂e/TJ veya tCO₂e/t).
                  </dd>
                </section>

                <section
                  id="ncv"
                  data-ara="ncv net calorific value alt ısıl değer net kalorifik değer yakıt b_eminst"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">NCV (Net Calorific Value) &rarr; Net kalorifik değer (Alt ısıl değer)</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Birim yakıtın sağladığı net enerji miktarı (MJ/m³, TJ/t vb.). Yakıt faaliyet verisini enerjiye çevirmek için zorunludur.
                  </dd>
                </section>

                <section
                  id="source-stream"
                  data-ara="source stream kaynak akışı b_eminst doğalgaz kok hat"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Source stream &rarr; Kaynak akışı</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Emisyona yol açan tekil bir yakıt, hammadde veya baca akışı (B_EmInst katmanının satır birimidir).
                  </dd>
                </section>

                <section
                  id="kontrol-denkligi"
                  data-ara="control equation üretim dengesi kontrol denkliği a=b+c+d d_processes"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Control equation &rarr; Kontrol denkliği (a = b+c+d)</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Üretilen toplam miktarın (a); satışa giden (b) + tesis-içi tüketilen (c) + stok değişimi (d) toplamına eşit olması zorunluluğu. D_Processes katmanında denetlenir.
                  </dd>
                </section>
              </div>

              {/* 1.5 Sertifika ve Maliyet Terimleri */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-brand-900 uppercase tracking-wider">
                  Sertifika ve Maliyet Terimleri
                </h3>

                <section
                  id="cbam-certificate"
                  data-ara="cbam certificate sertifika maliyet ets fiyatı şubat 2027"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">CBAM certificate &rarr; CBAM sertifikası</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Gömülü emisyon başına alıcının satın aldığı resmi bedel belgesi. İlk satışlar Şubat 2027&apos;de başlayacaktır.
                  </dd>
                </section>

                <section
                  id="cbam-factor"
                  data-ara="cbam factor cbam faktörü ücretsiz tahsis azaltma katsayısı 2026 2.5 2034 100"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">CBAM factor &rarr; CBAM faktörü</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Ücretsiz tahsisin kademeli azaltılmasını yansıtan katsayı: 2026&apos;da %2,5 ile başlar, 2034&apos;te %100&apos;e ulaşır.
                  </dd>
                </section>

                <section
                  id="carbon-price-paid"
                  data-ara="carbon price paid ödenmiş karbon bedeli mahsup tr ets türkiye pilot sıfır"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">Carbon price paid &rarr; Ödenmiş karbon bedeli (Mahsup)</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Ürünün menşe ülkesinde fiilen ödenmiş karbon fiyatı; AB sertifika bedelinden düşülür. TR-ETS 2026 pilot döneminde tahsisler ücretsiz olduğu için Türkiye üreticileri için bu değer şu an 0&apos;dır.
                  </dd>
                </section>

                <section
                  id="de-minimis"
                  data-ara="de minimis 50 ton eşik muafiyet omnibus 2025/2083 elektrik hidrojen hariç"
                  className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
                >
                  <dt className="text-xl font-black text-ink-900">De minimis &rarr; De minimis (50 ton muafiyet eşiği)</dt>
                  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                    Alıcının bir takvim yılındaki toplam AB kapsam-içi ithalatı 50 tonun altındaysa yükümlülük doğmaz; elektrik ve hidrojen hariçtir (Omnibus 2025/2083).
                  </dd>
                </section>
              </div>
            </div>
          </section>

          {/* BÖLÜM 2: UYGULAMA VE ŞABLON TERİMLERİ */}
          <section data-ara="bölüm 2 uygulama platform şablon terimleri a_instdata amber b_eminst cn kodu d_processes e_purchprec fieldhelp mühür qc ruleset shuffled order triyaj">
            <div className="border-b-2 border-line pb-3">
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">
                BÖLÜM 2 — Platform ve Şablon Terimleri
              </h2>
              <p className="mt-1 text-sm font-medium text-ink-600">
                10 katmanlı hesaplama arayüzünde ve mühürlü denetim paketinde kullanılan teknik adlar.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <section
                id="a-instdata"
                data-ara="a_instdata tesis bilgi katmanı unlocode koordinat"
                className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
              >
                <dt className="text-xl font-black text-ink-900">A_InstData (Tesis Bilgi Katmanı)</dt>
                <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                  Tesis unvanı, adresi, UNLOCODE ve koordinatlarının girildiği 1. katman.
                </dd>
              </section>

              <section
                id="b-eminst"
                data-ara="b_eminst emisyon katmanı kaynak akışı 29 satır ncv faaliyet verisi"
                className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
              >
                <dt className="text-xl font-black text-ink-900">B_EmInst (Emisyon Katmanı)</dt>
                <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                  Kaynak akışlarının (yakıt, elektrik, kütle dengesi vb.) satır satır tanımlandığı 4. katman.
                </dd>
              </section>

              <section
                id="d-processes"
                data-ara="d_processes süreç özeti kontrol denkliği a=b+c+d"
                className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
              >
                <dt className="text-xl font-black text-ink-900">D_Processes (Süreç Özeti)</dt>
                <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                  Üretim seviyelerinin ve a = b+c+d kontrol denkliğinin sağlandığı 5. katman.
                </dd>
              </section>

              <section
                id="e-purchprec"
                data-ara="e_purchprec öncü madde katmanı girdi hurda dri see"
                className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
              >
                <dt className="text-xl font-black text-ink-900">E_PurchPrec (Öncü Madde Katmanı)</dt>
                <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                  Satın alınan öncül maddelerin gömülü emisyonlarının hesaplandığı 6. katman.
                </dd>
              </section>

              <section
                id="muhur"
                data-ara="mühür sha-256 dijital onay doğrulama 6 dosya zip"
                className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all"
              >
                <dt className="text-xl font-black text-ink-900">Mühür (SHA-256 Dijital Master İmza)</dt>
                <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
                  6 resmi dosyadan oluşan denetim paketinin bayt bütünlüğünü kilitleyen ve /dogrula/ sayfasından teyit edilebilen kriptografik imza.
                </dd>
              </section>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
