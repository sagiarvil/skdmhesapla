import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import IcerikArama from "@/components/IcerikArama";

export const metadata: Metadata = {
  title: "SKDM Sözlüğü 2026 — CBAM Terimleri, İngilizce-Türkçe Karşılıkları ve Anlamları",
  description:
    "CBAM/SKDM mevzuatında ve yabancı kaynaklarda geçen tüm İngilizce terimlerin Türkçe karşılığı, anlamı ve kullanım yeri: embedded emissions, default values, authorised declarant, monitoring plan ve daha fazlası.",
};

export default function SozlukPage() {
  return (
    <article className="pasaport-zemin-yogun mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <GeriLink />
      <div>
        <h1 className="font-display text-3xl font-bold text-ink-900">
          SKDM Sözlüğü — Tam Başucu Kaynağı (v3)
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Her terim önce günlük dilde açıklanır, sonra resmi karşılığı ve nerede kullanıldığı verilir.
          Arayüzdeki her (i) ipucu penceresi bu sayfadaki tanıma bağlanır. Rehber:{" "}
          <Link href="/rehber/" className="font-semibold text-brand-800 underline">
            /rehber/
          </Link>
        </p>
      </div>

      <IcerikArama hedefId="sozluk-govde" />

      <div id="sozluk-govde" className="space-y-10">
        {/* Durum bazlı yönlendirici */}
        <section
          data-ara="yol haritası durum ilk kez duyuyorum alıcı veri istedi form terimleri doğrulayıcı ingilizce"
          className="rounded-card border border-brand-500/40 bg-brand-500/10 p-5 shadow-card"
        >
          <h2 className="text-lg font-bold text-brand-900">
            Önce buradan başlayın — durumunuza göre yol haritası
          </h2>
          <div className="mt-3 space-y-2 text-sm text-ink-900 leading-relaxed">
            <p>
              <strong>&ldquo;SKDM&apos;yi ilk kez duyuyorum&rdquo;:</strong> SKDM/CBAM &rarr; Alıcı &rarr; Kesin dönem &rarr; De minimis &rarr; SEE &rarr; Sertifika. Bu altı terim konunun %80&apos;idir.
            </p>
            <p>
              <strong>&ldquo;Alıcım benden veri istedi, ne yapacağımı bilmiyorum&rdquo;:</strong> Alıcı &rarr; Tedarikçi veri dosyası &rarr; Resmî şablon &rarr; Gömülü emisyon &rarr; Veri talebi &rarr; Triyaj. Sonra{" "}
              <Link href="/basla/" className="font-semibold text-brand-800 underline">
                /basla/
              </Link>{" "}
              sayfasından dosyanızı başlatın.
            </p>
            <p>
              <strong>&ldquo;Dosyamı hazırlıyorum, formdaki terimleri anlamıyorum&rdquo;:</strong> Faaliyet verisi &rarr; Emisyon faktörü &rarr; NCV &rarr; Kaynak akışı &rarr; Süreç emisyonu &rarr; Öncü madde &rarr; Bubble approach &rarr; Kontrol denkliği. Formda her alanın yanındaki (i) penceresi de buraya bağlanır.
            </p>
            <p>
              <strong>&ldquo;Doğrulayıcıyla çalışacağım&rdquo;:</strong> Akredite doğrulayıcı &rarr; Doğrulama &rarr; İzleme planı &rarr; Emisyon raporu &rarr; Site visit (saha ziyareti) &rarr; Kayıt saklama &rarr; Misstatement.
            </p>
            <p>
              <strong>&ldquo;İngilizce kaynak okuyorum, terimler karışık&rdquo;:</strong> Doğrudan aşağıdaki İngilizce &rarr; Türkçe bölümüne geçin.
            </p>
          </div>
        </section>

        {/* BÖLÜM 1 */}
        <section data-ara="bölüm 1 ingilizce türkçe tam karşılıklar cbam embedded emissions see direct indirect actual default values goods simple complex precursor bubble approach carbon leakage">
          <h2 className="border-b border-line pb-2 text-2xl font-bold text-ink-900">
            BÖLÜM 1 — İngilizce &rarr; Türkçe tam karşılıklar
          </h2>
          <p className="mt-1 text-xs text-ink-600 italic">
            (Yabancı kaynaklarda, AB metinlerinde ve teknik dokümanlarda geçen her terim; Türkçe karşılığı, sade anlamı ve nerede kullanıldığıyla.)
          </p>

          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-brand-900">Temel kavramlar</h3>

              <section
                data-ara="cbam carbon border adjustment mechanism sınırda karbon düzenleme mekanizması skdm"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">
                  CBAM (Carbon Border Adjustment Mechanism) &rarr; Sınırda Karbon Düzenleme Mekanizması (SKDM)
                </dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  AB&apos;ye ithal edilen belirli ürünlerin üretimindeki karbonu fiyatlayan düzenleme.{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: AB resmi metinleri ve teknik dokümanlarda &ldquo;CBAM&rdquo;; kullanıcıya dönük metinlerde &ldquo;SKDM&rdquo;.</em>
                </dd>
              </section>

              <section
                data-ara="embedded emissions gömülü emisyon sera gazı toplam"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">
                  Embedded emissions &rarr; Gömülü emisyon
                </dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Bir ürünün üretimi sırasında açığa çıkan toplam sera gazı emisyonu.{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: Alıcınızın istediği verinin özü budur; formlarda &ldquo;gömülü emisyon&rdquo; olarak geçer.</em>
                </dd>
              </section>

              <section
                data-ara="see specific embedded emissions spesifik gömülü emisyon ton başına sertifika maliyeti"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">
                  SEE (Specific Embedded Emissions) &rarr; Spesifik gömülü emisyon
                </dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Bir ton ürün başına düşen ton CO₂e. SKDM&apos;nin kalbi olan sayı; sertifika maliyeti bununla hesaplanır.{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: Sonuç ekranları ve mühürlü pakette; &ldquo;SEE&rdquo; kısaltması çevrilmez.</em>
                </dd>
              </section>

              <section
                data-ara="direct emissions doğrudan emisyon kapsam 1 yakıt kimyasal süreç"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">
                  Direct emissions &rarr; Doğrudan emisyon
                </dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Tesisinizde yakıt yakılması veya kimyasal süreçlerden çıkan emisyon (kapsam 1).{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: B_EmInst katmanı, kaynak akışı satırları.</em>
                </dd>
              </section>

              <section
                data-ara="indirect emissions dolaylı emisyon elektrik kapsam 2 çimento gübre annex ii"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">
                  Indirect emissions &rarr; Dolaylı emisyon
                </dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Üretimde kullanılan elektriğin üretiminden doğan emisyon (kapsam 2).{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: Şu an yalnız çimento ve gübrede bedele dahil; diğer sektörlerde bildirim amaçlı (Annex II kuralı).</em>
                </dd>
              </section>

              <section
                data-ara="actual emissions gerçek ölçülmüş emisyon tesis verisi actual vs default"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">
                  Actual emissions &rarr; Gerçek (ölçülmüş) emisyon
                </dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Tesisinizin kendi verileriyle hesaplanan emisyon.{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: &ldquo;Actual vs default&rdquo; karşılaştırmasında; varsayılan değerin karşıtı.</em>
                </dd>
              </section>

              <section
                data-ara="default values varsayılan değerler yüksek ab ceza pahalı sertifika"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">
                  Default values &rarr; Varsayılan değerler
                </dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Gerçek veri yoksa uygulanan, kasıtlı yüksek tutulmuş resmi değerler.{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: Beyan ekranları; varsayılan değerle beyan = alıcınız için daha pahalı sertifika demektir.</em>
                </dd>
              </section>

              <section
                data-ara="goods mallar ürünler g1 g10 şablon"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Goods &rarr; Mallar/Ürünler</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  SKDM kapsamındaki ithal ürünler.{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: Şablonun G1–G10 katmanları &ldquo;goods&rdquo; katmanlarıdır.</em>
                </dd>
              </section>

              <section
                data-ara="simple goods basit mallar öncü maddesiz"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Simple goods &rarr; Basit mallar</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Üretiminde SKDM kapsamı öncü madde kullanılmayan ürünler; yalnız kendi sürecinin emisyonu hesaplanır.{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: Süreç tanımında; öncü madde bölümünü atlamanızı sağlar.</em>
                </dd>
              </section>

              <section
                data-ara="complex goods bileşik mallar öncü maddeli e_purchprec"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Complex goods &rarr; Bileşik mallar</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Üretiminde kapsam içi öncü madde kullanılan ürünler; öncünün gömülü emisyonu da hesaba katılır.{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: E_PurchPrec katmanının doldurulma nedenidir.</em>
                </dd>
              </section>

              <section
                data-ara="precursor öncü madde girdi amonyak hurda dri e_purchprec see"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Precursor &rarr; Öncü madde</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Kendi üretiminizde girdi olarak kullandığınız ve kendisi de SKDM kapsamında olan madde (ör. gübre için amonyak).{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: E_PurchPrec katmanı; tedarikçinizden SEE verisi istemeniz gerekir.</em>
                </dd>
              </section>

              <section
                data-ara="bubble approach kapsül yaklaşımı çoklu akış gübre çelik"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Bubble approach &rarr; Bubble approach (kapsül yaklaşımı)</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Bir ara ürünün tamamı tek akışa gitmiyorsa her akışın ayrı üretim süreci sayılması kuralı. Türkçe karşılık icat edilmez.{" "}
                  <em className="text-ink-600 block mt-1">Nerede kullanılır: Gübre/çelik gibi çok akışlı tesislerde süreç tanımında.</em>
                </dd>
              </section>

              <section
                data-ara="carbon leakage karbon kaçağı ab dışı mevzuat"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Carbon leakage &rarr; Karbon kaçağı</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Üretimin karbon maliyeti nedeniyle AB dışına kayması riski; SKDM&apos;nin varlık nedeni.
                </dd>
              </section>
            </div>

            {/* Oyuncular */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-brand-900">Oyuncular</h3>

              <section
                data-ara="operator operatör tesis işletmecisi firma siz"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Operator &rarr; Operatör (tesis işletmecisi)</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Üretim tesisini işleten taraf — sizsiniz. IR 2025/2547 metinlerinde ve formlarda &ldquo;tesis/firma&rdquo; olarak görünür.
                </dd>
              </section>

              <section
                data-ara="installation tesis unlocode koordinat a_instdata"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Installation &rarr; Tesis</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Emisyonların doğduğu fiziksel üretim yeri. A_InstData katmanında UNLOCODE ve koordinatların ait olduğu birim.
                </dd>
              </section>

              <section
                data-ara="declarant authorised declarant yetkili beyan sahibi alıcı ithalatçı registry"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">(Authorised CBAM) Declarant &rarr; Yetkili beyan sahibi</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  CBAM Registry&apos;de beyan yapma yetkisi verilmiş AB tarafı; genellikle alıcınız. Beyan sorumluluğu ondadır.
                </dd>
              </section>

              <section
                data-ara="importer ithalatçı alıcı triyaj sertifika bedeli"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Importer &rarr; İthalatçı / alıcı</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Ürününüzü AB&apos;ye ithal eden firma; sertifikayı o satın alır.
                </dd>
              </section>

              <section
                data-ara="accredited verifier akredite doğrulayıcı denetim bağımsız kuruluş"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Accredited verifier &rarr; Akredite doğrulayıcı</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Verilerinizi denetleyen bağımsız, AB tanınırlıklı kuruluş. Doğrulama bölümü ve A.3 alanlarında yer alır.
                </dd>
              </section>
            </div>

            {/* Hesaplama Terimleri */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-brand-900">Hesaplama ve süreç terimleri</h3>

              <section
                data-ara="activity data faaliyet verisi m3 mwh ton b_eminst"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Activity data &rarr; Faaliyet verisi</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Döneme ait ölçülen miktar: yakılan gaz (m³), tüketilen elektrik (MWh), üretilen ürün (ton).
                </dd>
              </section>

              <section
                data-ara="emission factor emisyon faktörü katsayı co2e b_eminst"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Emission factor &rarr; Emisyon faktörü</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Bir birim faaliyetin kaç ton CO₂e ürettiğini gösteren katsayı. B_EmInst kaynak akışlarında kullanılır.
                </dd>
              </section>

              <section
                data-ara="ncv net calorific value alt ısıl değer net kalorifik değer yakıt b_eminst"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">NCV (Net Calorific Value) &rarr; Net kalorifik değer</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Birim yakıtın sağladığı enerji (MJ/m³ vb.). Faaliyet verisini enerjiye çevirmek için zorunlu alan.
                </dd>
              </section>

              <section
                data-ara="source stream kaynak akışı b_eminst doğalgaz kok hat"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Source stream &rarr; Kaynak akışı</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Emisyona yol açan tek bir yakıt/malzeme akışı. B_EmInst katmanının satır birimidir (en fazla 29 satır).
                </dd>
              </section>

              <section
                data-ara="control equation üretim dengesi kontrol denkliği a=b+c+d d_processes"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Production level / control equation &rarr; Kontrol denkliği (a = b+c+d)</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Üretilen miktarın satışa, tesis-içi tüketime ve stoka giden payların toplamına eşit olması kuralı. D_Processes katmanında kontrol edilir; sağlanmadan mühür engellenir.
                </dd>
              </section>
            </div>

            {/* Sertifika ve Maliyet Terimleri */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-brand-900">Sertifika ve maliyet terimleri</h3>

              <section
                data-ara="cbam certificate sertifika maliyet ets fiyatı şubat 2027"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">CBAM certificate &rarr; CBAM sertifikası</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Gömülü emisyon başına satın alınan bedel belgesi. İlk satışlar Şubat 2027&apos;de başlayacaktır.
                </dd>
              </section>

              <section
                data-ara="cbam factor cbam faktörü ücretsiz tahsis azaltma katsayısı 2026 2.5 2034 100"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">CBAM factor &rarr; CBAM faktörü</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Ücretsiz tahsisin kademeli azaltılmasını yansıtan katsayı: 2026&apos;da %2,5 ile başlar, 2034&apos;te %100&apos;e ulaşır.
                </dd>
              </section>

              <section
                data-ara="carbon price paid ödenmiş karbon bedeli mahsup tr ets türkiye pilot sıfır"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">Carbon price paid &rarr; Ödenmiş karbon bedeli (mahsup)</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Ürünün üretildiği ülkede fiilen ödenmiş karbon fiyatı; sertifika bedelinden düşülür. TR-ETS 2026–2027 pilot döneminde %100 ücretsiz tahsisli olduğu için şu an Türkiye üreticileri için bu değer 0&apos;dır.
                </dd>
              </section>

              <section
                data-ara="de minimis 50 ton eşik muafiyet omnibus 2025/2083 elektrik hidrojen hariç"
                className="rounded-card border border-line bg-white p-4 shadow-card"
              >
                <dt className="font-bold text-ink-900">De minimis &rarr; De minimis (50 ton eşiği)</dt>
                <dd className="mt-1 text-sm text-ink-900 leading-relaxed">
                  Alıcının yıllık toplam kapsam-içi ithalatı 50 tonun altındaysa yükümlülük doğmaz; elektrik ve hidrojen hariçtir. Omnibus 2025/2083 ile getirilmiştir.
                </dd>
              </section>
            </div>
          </div>
        </section>

        {/* BÖLÜM 2 */}
        <section data-ara="bölüm 2 türkçe alfabetik dizin a b c ç d e f g h i k m n o p s ş t u ü v y">
          <h2 className="border-b border-line pb-2 text-2xl font-bold text-ink-900">
            BÖLÜM 2 — Türkçe alfabetik dizin (arayüz terimleri)
          </h2>

          <div className="mt-6 space-y-4">
            <section
              data-ara="a_instdata tesis bilgi katmanı unlocode koordinat"
              className="rounded-card border border-line bg-white p-4 shadow-card"
            >
              <dt className="font-bold text-ink-900">A_InstData (Tesis Bilgi Katmanı)</dt>
              <dd className="mt-1 text-sm text-ink-900">
                Şablonun ilk katmanı; tesis adı, adresi, ülkesi, UNLOCODE, koordinat ve yetkili kişi burada tutulur.
              </dd>
            </section>

            <section
              data-ara="amber uyarı engelleyici olmayan kalite gözden geçirin"
              className="rounded-card border border-line bg-white p-4 shadow-card"
            >
              <dt className="font-bold text-ink-900">Amber uyarı</dt>
              <dd className="mt-1 text-sm text-ink-900">
                Engelleyici olmayan ama gözden geçirilmesi gereken eksik/tutarsız bilgi işareti. Mührü engellemez, kaliteyi artırır.
              </dd>
            </section>

            <section
              data-ara="b_eminst emisyon katmanı kaynak akışı 29 satır ncv faaliyet verisi"
              className="rounded-card border border-line bg-white p-4 shadow-card"
            >
              <dt className="font-bold text-ink-900">B_EmInst (Emisyon Katmanı)</dt>
              <dd className="mt-1 text-sm text-ink-900">
                Kaynak akışı katmanı; en fazla 29 satır. Her satırda yakıt türü, yöntem, faaliyet verisi ve NCV girilir.
              </dd>
            </section>

            <section
              data-ara="cn kodu gtip gümrük tarife 8 hane arama"
              className="rounded-card border border-line bg-white p-4 shadow-card"
            >
              <dt className="font-bold text-ink-900">CN kodu (GTİP)</dt>
              <dd className="mt-1 text-sm text-ink-900">
                SKDM kapsamındaki 8 haneli gümrük kodu.{" "}
                <em>GTİP kodunuzu bilmiyorsanız /basla/ sayfasındaki arama kutusuna ürün adını yazabilirsiniz.</em>
              </dd>
            </section>

            <section
              data-ara="d_processes süreç özeti kontrol denkliği a=b+c+d"
              className="rounded-card border border-line bg-white p-4 shadow-card"
            >
              <dt className="font-bold text-ink-900">D_Processes (Süreç Özeti)</dt>
              <dd className="mt-1 text-sm text-ink-900">
                Toplam üretim dengesi katmanı; a = b+c+d kontrolü burada yapılır.
              </dd>
            </section>

            <section
              data-ara="e_purchprec öncü madde katmanı girdi hurda dri see"
              className="rounded-card border border-line bg-white p-4 shadow-card"
            >
              <dt className="font-bold text-ink-900">E_PurchPrec (Öncü Madde Katmanı)</dt>
              <dd className="mt-1 text-sm text-ink-900">
                Satın aldığınız kapsam-içi öncü maddelerin gömülü emisyonu burada bildirilir. EAF çelik rotasında hurda kapsam dışı olduğu için sadeleşir.
              </dd>
            </section>

            <section
              data-ara="fieldhelp ipucu penceresi bu nedir nereden bulurum kimden isterim"
              className="rounded-card border border-line bg-white p-4 shadow-card"
            >
              <dt className="font-bold text-ink-900">FieldHelp (İpucu Penceresi)</dt>
              <dd className="mt-1 text-sm text-ink-900">
                Her alanın yanındaki (i) butonu; tıklayınca Bu nedir / Nereden bulurum / Kimden isterim / Nasıl girilir / Girilmezse ne olur panellerini açar.
              </dd>
            </section>

            <section
              data-ara="mühür sha-256 dijital onay doğrulama 6 dosya zip"
              className="rounded-card border border-line bg-white p-4 shadow-card"
            >
              <dt className="font-bold text-ink-900">Mühür</dt>
              <dd className="mt-1 text-sm text-ink-900">
                Dosyanın tüm kalite kapılarından geçtiğini kanıtlayan SHA-256 dijital imzalı onay paketi. /dogrula/ sayfasından herkesçe doğrulanabilir.
              </dd>
            </section>
          </div>
        </section>

        {/* BÖLÜM 3 */}
        <section data-ara="bölüm 3 sık karıştırılan çiftler ayrım rehberi doğrudan dolaylı kademe a b geçiş kesin varsayılan gerçek mühür doğrulama skdm tr ets hurda dri">
          <h2 className="border-b border-line pb-2 text-2xl font-bold text-ink-900">
            BÖLÜM 3 — Sık karıştırılan çiftler (ayrım rehberi)
          </h2>

          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-ink-900 leading-relaxed">
            <li>
              <strong>Doğrudan &harr; Dolaylı:</strong> Bacadan çıkan emisyon &harr; elektriğin üretiminden doğan emisyon. Çelikte yalnız ilki fiyatlanır; çimento ve gübrede ikisi de.
            </li>
            <li>
              <strong>Kademe A &harr; Kademe B:</strong> Zorunlu SKDM kapsamı (6 sektör) &harr; alıcı talepli ISO 14067 tedarikçi veri dosyası (14 sektör).
            </li>
            <li>
              <strong>Geçiş dönemi &harr; Kesin dönem:</strong> 2023–2025 bedelsiz raporlama &harr; 2026+ sertifikalı ve doğrulamalı rejim.
            </li>
            <li>
              <strong>Varsayılan değer &harr; Gerçek veri:</strong> Küresel ortalamaya kalibre yüksek değer &harr; tesise özgü ölçüm. EAF&apos;ta genelde avantaj, BF-BOF&apos;ta dezavantaj çıkabilir.
            </li>
            <li>
              <strong>Mühür &harr; Doğrulama:</strong> Yazılımımızın dosya bütünlüğü onayı &harr; akredite kuruluşun mevzuat denetimi. Birincisi ikincisinin yerine geçmez.
            </li>
            <li>
              <strong>SKDM &harr; TR-ETS:</strong> AB&apos;nin sınır düzenlemesi &harr; Türkiye&apos;nin ulusal emisyon ticaret sistemi. Pilot dönemde TR-ETS maliyeti 0&apos;dır.
            </li>
            <li>
              <strong>Hurda &harr; DRI/HBI:</strong> Kapsam dışı girdi &harr; kapsam içi öncü madde. EAF rotasında temel ayrım budur.
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
