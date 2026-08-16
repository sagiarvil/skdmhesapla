import Link from "next/link";
import { CiftDalga } from "@/components/brand/CiftDalga";
import GtipArama from "@/components/GtipArama";

// ANA SAYFA v3 — dönüşüm odaklı mimari (deep research 2026 pratikleri)
// Tek sonuç, tek birincil CTA, kanıt → karşılaştırma → fiyat → SSS → kapanış CTA.
// Kademe listeleri ana sayfadan kaldırıldı; keşif /basla/ sayfasında.

const SSS = [
  {
    s: "Ödemeyi ne zaman yapıyorum?",
    c: "Yalnızca dosyanız tamamlanıp mühürleme aşamasına geldiğinizde. Tüm hazırlık adımları, rehber, sözlük ve taslaklar ücretsizdir; kart bilgisi istenmez.",
  },
  {
    s: "Alıcım zaten veri istiyor — bu dosya yeterli mi?",
    c: "Evet. Çıktı, resmi Communication Template dahil 11 dosyalık mühürlü pakettir; alıcınıza doğrudan iletebilirsiniz. Kademe B sektörlerde ISO 14067 çerçevesinde tedarikçi veri dosyası üretilir.",
  },
  {
    s: "GTİP/CN kodumu bilmiyorum, sorun mu?",
    c: "Hayır. Ürününüzün adını yazmanız yeterli; sistem kodu önerir. Nihai teyidi alıcınızla yaparsınız.",
  },
  {
    s: "Danışmanlık almadan gerçekten yapabilir miyim?",
    c: "Sistem bunun için tasarlandı: her alanın yanında 'bu nedir, nereden bulurum, kimden isterim' anlatan ipucu pencereleri var. Eksik kalan belgeyi hazır metinle ilgili kişiye tek tıkla talep edersiniz.",
  },
  {
    s: "Akredite doğrulama yerine mi geçiyor?",
    c: "Hayır ve bunu açıkça söylüyoruz: SKDMHesapla doğrulama görüşü vermez. Dosyanızı doğrulamaya hazır hale getirir; doğrulayıcınızın işini günlerden saatlere indirir.",
  },
] as const;

export default function HomePage() {
  return (
    <div>
      {/* 1. HERO — tek kolon, tek mesaj, tek birincil eylem */}
      <section className="pasaport-zemin-koyu relative isolate overflow-hidden bg-brand-950">
        <div className="relative z-[1] mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center rounded-pill bg-brand-500/15 px-4 py-1.5 text-sm font-semibold text-brand-500">
            Türk ihracatçısı için SKDM / CBAM çözümü
          </span>
          <h1 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl sm:leading-[1.15]">
            Alıcınızın istediği karbon dosyasını kendiniz hazırlayın.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-brand-mist sm:text-lg">
            Danışmana on binlerce lira ödemeden, adım adım yönlendirmeyle, dakikalar içinde.
          </p>

          <div className="mt-2 w-full max-w-xl rounded-card bg-white p-4 text-left shadow-card sm:p-5">
            <GtipArama />
          </div>

          <Link
            href="/basla/"
            className="inline-flex min-h-[52px] items-center rounded-ctl bg-brand-500 px-10 text-lg font-bold text-brand-900 shadow-card transition hover:bg-brand-100"
          >
            Hemen Başla — Ücretsiz
          </Link>
          <p className="text-sm font-semibold text-brand-500">
            Mühür öncesi her şey ücretsiz — kart istenmez.
          </p>
        </div>
        <div className="relative z-[1] mx-auto -mb-2 w-full max-w-4xl px-6 opacity-90">
          <img
            src="/desen/hero-illus-bayrak-A-temiz.png"
            alt="AB ve Türkiye kurdeleleri"
            width={1536}
            height={976}
            decoding="async"
            className="mx-auto h-20 w-auto object-contain sm:h-28"
          />
        </div>
        <div className="relative z-[2]">
          <CiftDalga yon="asagi" dolguSinif="text-white" sinifAdi="h-14 sm:h-16" />
        </div>
      </section>

      {/* 2. NASIL ÇALIŞIR — 3 adım, fiil odaklı */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-container px-5 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">
            Üç adımda dosyanız hazır
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { n: "1", t: "Ürününüzü seçin", d: "GTİP bilmiyorsanız ürün adını yazın — kodu sistem önerir." },
              { n: "2", t: "Adımları izleyin", d: "Her alanda 'bu nedir, kimden isterim' diyen ipucu pencereleri sizi yönlendirir." },
              { n: "3", t: "Mühürleyin ve indirin", d: "Ödeme yalnızca burada: tek fiyat 9.900 ₺. Aynı dosyada düzeltme hep ücretsiz." },
            ].map((a) => (
              <div key={a.n} className="rounded-card border border-line bg-soft-section p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-base font-bold text-brand-900">
                  {a.n}
                </div>
                <div className="mt-3 text-lg font-bold text-ink-900">{a.t}</div>
                <div className="mt-1 text-sm leading-relaxed text-ink-600">{a.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. KARŞILAŞTIRMA — ödeme niyetini artıran bölüm */}
      <section className="pasaport-zemin-acik bg-soft-section py-14 sm:py-20">
        <div className="mx-auto max-w-container px-5 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
              Aynı dosya, üç farklı yol
            </h2>
            <p className="text-base text-ink-600">
              Kararı siz verin — sayılar ortada.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-4xl overflow-x-auto rounded-card border border-line bg-white shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-soft-section text-ink-900">
                  <th className="px-5 py-4 font-semibold"> </th>
                  <th className="px-5 py-4 font-semibold">Danışmanlık firması</th>
                  <th className="px-5 py-4 font-semibold">Yıllık lisanslı CBAM yazılımı</th>
                  <th className="px-5 py-4 font-bold text-brand-800">SKDMHesapla</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-600">
                <tr>
                  <td className="px-5 py-3.5 font-medium text-ink-900">Maliyet</td>
                  <td className="px-5 py-3.5">On binlerce ₺ + dosya başı ücret</td>
                  <td className="px-5 py-3.5">Yıllık ~€1.990'dan başlayan abonelik</td>
                  <td className="px-5 py-3.5 font-bold text-brand-800">9.900 ₺ tek sefer — dosya başına</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-ink-900">Süre</td>
                  <td className="px-5 py-3.5">Haftalar, toplantılar</td>
                  <td className="px-5 py-3.5">Kurulum + eğitim günleri</td>
                  <td className="px-5 py-3.5 font-bold text-brand-800">20–30 dakika, kendi hızınızda</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-ink-900">Düzeltme</td>
                  <td className="px-5 py-3.5">Her revizyon ayrı ücret</td>
                  <td className="px-5 py-3.5">Abonelik devam ettiği sürece</td>
                  <td className="px-5 py-3.5 font-bold text-brand-800">Aynı dosyada sınırsız ücretsiz</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-ink-900">Dil</td>
                  <td className="px-5 py-3.5">Çoğu İngilizce raporlar</td>
                  <td className="px-5 py-3.5">Çoğu İngilizce arayüz</td>
                  <td className="px-5 py-3.5 font-bold text-brand-800">%100 Türkçe, sade dil</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-ink-900">TR-ETS hazırlığı</td>
                  <td className="px-5 py-3.5">Ayrı proje</td>
                  <td className="px-5 py-3.5">AB merkezli araçlarda yok</td>
                  <td className="px-5 py-3.5 font-bold text-brand-800">Aynı veriyle ikinci çıktıya hazır</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-ink-600">
            Türk çeliği zaten dünyanın en temiz çeliklerinden — kanıtlayamazsanız, kirli üretim için
            hesaplanmış varsayılan değerle fiyatlanırsınız. Gerçek veriniz, sizin avantajınızdır.
          </p>
        </div>
      </section>

      {/* 4. GÜVEN ŞERİDİ */}
      <section className="bg-white py-10 sm:py-14">
        <ul className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-3 px-5 sm:px-6">
          {[
            "AB 2023/956 & 2025/2083 uyumlu",
            "Resmi şablon çıktısı dahil 11 dosya",
            "SHA-256 mühür + herkese açık doğrulama",
            "Deterministik hesap motoru",
            "Verileriniz yalnızca sizin dosyanızda",
          ].map((m) => (
            <li
              key={m}
              className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-soft-section px-4 py-2 text-sm text-ink-900"
            >
              <span className="font-bold text-accent-green" aria-hidden>✓</span>
              {m}
            </li>
          ))}
        </ul>
      </section>

      {/* 5. SSS */}
      <section className="pasaport-zemin-acik bg-soft-section py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">
            Aklınıza takılanlar
          </h2>
          <div className="mt-8 space-y-3">
            {SSS.map((q) => (
              <details key={q.s} className="group rounded-card border border-line bg-white p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-ink-900">
                  {q.s}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{q.c}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-ink-600">
            Daha fazlası:{" "}
            <Link href="/rehber/" className="font-semibold text-brand-800 underline">Rehber</Link>
            {" · "}
            <Link href="/sozluk/" className="font-semibold text-brand-800 underline">Sözlük</Link>
            {" · "}
            <Link href="/nasil-calisir/" className="font-semibold text-brand-800 underline">Nasıl Çalışır</Link>
          </p>
        </div>
      </section>

      {/* 6. KAPANIŞ CTA — hero'nun aynası */}
      <section className="pasaport-zemin-koyu bg-brand-950 py-14 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-5 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Alıcınız sormadan dosyanız hazır olsun.
          </h2>
          <Link
            href="/basla/"
            className="inline-flex min-h-[52px] items-center rounded-ctl bg-brand-500 px-10 text-lg font-bold text-brand-900 shadow-card transition hover:bg-brand-100"
          >
            Hemen Başla — Ücretsiz
          </Link>
          <p className="text-sm font-semibold text-brand-500">
            Mühür öncesi her şey ücretsiz — kart istenmez.
          </p>
        </div>
      </section>
    </div>
  );
}
