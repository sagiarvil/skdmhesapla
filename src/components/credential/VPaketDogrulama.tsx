"use client";

/**
 * /v/{paketNo} — Mühür bütünlük sayfası (client katmanı).
 *
 * NEDEN VAR: Bu adres mühürlü PDF'lerin içine BASILI. Kapsamlı Durum
 * Raporu'nun son sayfasında "Yetkinliği ve doküman bütünlüğünü doğrula"
 * satırında geçiyor. Mühürlü paket değiştirilemez, dolayısıyla bu adres
 * teslim edilmiş her dosyanın içinde dondurulmuş durumda.
 *
 * Daha önce bu adres 404 dönüyordu (yalnızca demo statik sayfası vardı).
 * Bir doğrulayıcı linke tıklayıp 404 gördüğünde "sayfa yapım aşamasında"
 * değil "bu mühür sahte" sonucunu çıkarırdı. Şimdi sayfa, istemci
 * tarafında /api/packages üzerinden kayıt defterini sorgular; bulunamasa
 * bile açıklayıcı ekran gösterir — 404 DEĞİL.
 *
 * GİZLİLİK KURALI: Bu sayfa herkese açık bir linkten gelir. Emisyon
 * rakamı, maliyet, VKN, yetkili adı, e-posta, tesis adresi BURAYA
 * KONULAMAZ. Yalnızca bütünlük kanıtı gösterilir.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";
import { KopyalaButonu } from "@/components/ui/KopyalaButonu";
import { trUpper } from "@/lib/skdm/tr-locale";
import { buildTestSeedHistory } from "@/lib/skdm/test-user-packages";
import { SCOPE_DISCLAIMER } from "@/lib/skdm/credential";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";

type SorguSonucu = {
  durum: "yukleniyor" | "kayitli" | "bulunamadi";
  paketId?: string;
  hash?: string;
  tarih?: string;
  motorSurumu?: string | null;
  metodolojiSurumu?: string | null;
  rulesetSurumu?: string | null;
  dosyalar?: string[];
  demo?: boolean;
};

function paketNoPathname(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean).pop() ?? "";
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function VPaketDogrulama() {
  const pathname = usePathname();
  const paketNo = useMemo(() => paketNoPathname(pathname), [pathname]);

  const [sonuc, setSonuc] = useState<SorguSonucu>({ durum: "yukleniyor" });

  useEffect(() => {
    let iptal = false;

    async function sorgula() {
      const temiz = paketNo.trim();
      if (!temiz) {
        setSonuc({ durum: "bulunamadi" });
        return;
      }
      try {
        const res = await fetch(
          `/api/packages?packageId=${encodeURIComponent(trUpper(temiz))}`
        );
        if (iptal) return;
        if (res.status === 404) {
          const demo = findDemoSeedMatch(temiz);
          if (demo) {
            setSonuc({
              durum: "kayitli",
              paketId: demo.packageId,
              hash: demo.masterHash,
              tarih: demo.sealedAt,
              dosyalar: undefined,
              demo: true,
            });
          } else {
            setSonuc({ durum: "bulunamadi" });
          }
          return;
        }
        if (!res.ok) {
          setSonuc({ durum: "bulunamadi" });
          return;
        }
        const body = await res.json();
        setSonuc({
          durum: "kayitli",
          paketId: body.packageId,
          hash: body.masterHash,
          tarih: body.createdAt ?? undefined,
          motorSurumu: body.engineVersion ?? null,
          metodolojiSurumu: body.methodologyVersion ?? null,
          rulesetSurumu: body.factorRegistryVersion ?? null,
          dosyalar: Array.isArray(body.files) && body.files.length ? body.files : undefined,
        });
      } catch {
        if (!iptal) setSonuc({ durum: "bulunamadi" });
      }
    }

    void sorgula();
    return () => {
      iptal = true;
    };
  }, [paketNo]);

  function findDemoSeedMatch(val: string): ReturnType<typeof buildTestSeedHistory>[number] | null {
    const temiz = val.trim();
    const h = temiz.startsWith("sha256:") ? temiz : `sha256:${temiz}`;
    const seed = buildTestSeedHistory();
    return (
      seed.find((s) => s.packageId === trUpper(temiz)) ||
      seed.find((s) => s.masterHash.toLowerCase() === h.toLowerCase()) ||
      null
    );
  }

  if (sonuc.durum === "yukleniyor") {
    return (
      <main className="pasaport-zemin-yogun min-h-screen bg-[#faf8f3] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink />
          <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-line bg-white p-10 text-center shadow-xs">
            <Loader2 className="h-8 w-8 animate-spin text-brand-800" />
            <p className="text-sm font-bold text-ink-700">
              <code className="font-mono break-all">{paketNo}</code> numaralı paketin kayıt defteri sorgulanıyor…
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (sonuc.durum === "bulunamadi") {
    return <BulunamadiEkrani paketNo={paketNo} />;
  }

  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#faf8f3] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />

        <header className="rounded-3xl border-2 border-emerald-300/80 bg-emerald-50/70 p-6 sm:p-8 space-y-4 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-2xl shadow-sm">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              Kriptografik bütünlük kaydı
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 break-all">
              {sonuc.paketId}
            </h1>
            <p className="text-sm font-medium text-emerald-900">
              {sonuc.demo
                ? "Bu paket numarası deterministik üretimle doğrulandı — kayıt defterinde canlı kayıt değildir."
                : "Bu paket numarası kayıt defterinde bulundu. Aşağıdaki değerler mühürleme anında hesaplanmıştır."}
            </p>
          </div>
        </header>

        {sonuc.demo && (
          <aside className="rounded-2xl border border-brand-800/20 bg-white p-4 text-xs font-semibold text-ink-700 space-y-1">
            <p className="font-bold text-ink-900">Demo paket doğrulaması</p>
            <p>
              Bu, teb232 demo hesabının deterministik olarak üretilmiş test paketidir; canlı kayıt
              defterinde yer almaz. Hash, aynı girdilerle her ortamda birebir aynı üretilir — bu
              karşılaştırma mühürlü paketin içeriğiyle uyumunu gösterir.
            </p>
          </aside>
        )}

        <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-black text-ink-900 border-b border-line pb-3">
            Mühür özeti
          </h2>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Mühürleme zamanı</dt>
              <dd className="font-bold text-ink-900">
                {sonuc.tarih
                  ? new Date(sonuc.tarih).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Istanbul" })
                  : "—"}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Hesaplama motoru</dt>
              <dd className="font-bold text-ink-900">{sonuc.motorSurumu ?? "—"}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Mevzuat sürümü</dt>
              <dd className="font-bold text-ink-900">{sonuc.rulesetSurumu ?? "—"}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Metodoloji sürümü</dt>
              <dd className="font-bold text-ink-900">{sonuc.metodolojiSurumu ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-black text-ink-900 border-b border-line pb-3">Master imza</h2>
          <p className="text-sm font-medium text-ink-700">
            Elinizdeki ZIP arşivinin manifest dosyasındaki imza, aşağıdaki değerle birebir aynı olmalıdır.
          </p>
          <p className="flex items-start gap-2 rounded-2xl bg-[#f8fbf9] border border-line px-4 py-3">
            <code className="font-mono text-xs font-bold text-ink-900 break-all" translate="no">
              {sonuc.hash}
            </code>
            <KopyalaButonu deger={sonuc.hash || ""} label="SHA-256 master hash" />
          </p>
        </section>

        {sonuc.dosyalar && sonuc.dosyalar.length > 0 && (
          <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-black text-ink-900 border-b border-line pb-3">Paketteki dosyalar</h2>
            <p className="text-sm font-medium text-ink-700">
              Pakete dahil edilen dosyaların listesi. Her dosyanın özetini kendi kopyanızda
              hesaplayıp manifest ile karşılaştırabilirsiniz.
            </p>
            <ul className="grid sm:grid-cols-2 gap-1.5 text-xs text-ink-700 font-mono font-medium">
              {sonuc.dosyalar.map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-2xl border border-line bg-white p-4 text-xs font-medium text-ink-600 space-y-1">
          <p className="font-bold text-ink-900">Bu sayfa ne yapar, ne yapmaz:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Yapar:</strong> Bu paket numarasının SKDMHesapla tarafından üretildiğini ve dosyaların mühürleme anındaki özetlerini gösterir.</li>
            <li><strong>Yapmaz:</strong> Akredite doğrulama görüşü vermez, gümrük kararı üretmez, girilen verilerin doğruluğunu teyit etmez.</li>
          </ul>
          <p>{SCOPE_DISCLAIMER}</p>
        </section>

        <footer className="space-y-3 text-center">
          <p className="text-sm font-medium text-ink-700">
            Başka bir paketi sorgulamak için{" "}
            <Link href="/dogrula/" className="text-brand-900 underline underline-offset-4">
              Mühür Doğrulama Konsolu
            </Link>
            &apos;nu kullanın.
          </p>
          <p className="text-center text-xs font-medium text-ink-500">{LEGAL_ENTITY.copyrightFull}</p>
        </footer>
      </div>
    </article>
  );
}

function BulunamadiEkrani({ paketNo }: { paketNo: string }) {
  return (
    <main className="pasaport-zemin-yogun min-h-screen bg-[#faf8f3] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
        <GeriLink />
        <div className="rounded-3xl border-2 border-amber-400/40 bg-amber-50 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-800 font-black text-lg">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <span>Bu numarayla eşleşen mühür bulunamadı</span>
          </div>
          <p className="rounded-xl bg-white/70 border border-amber-400/30 px-3 py-2 text-xs font-semibold text-ink-700 break-all">
            <code translate="no">{paketNo}</code> kayıt defterinde yer almıyor.
          </p>
        </div>

        <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-black text-ink-900">Bundan sonra ne yapabilirsiniz</h2>
          <ul className="list-disc list-inside space-y-2 text-sm font-medium text-ink-700">
            <li>
              Paket numarasını harf harf kontrol edin — büyük/küçük harf ve tire konumu önemlidir
              (örnek biçim: <code className="font-mono">SEAL-2026-DC-7782</code>).
            </li>
            <li>
              Numara yerine master SHA-256 imzasıyla arama yapmayı deneyin:{" "}
              <Link href="/dogrula/" className="text-brand-900 underline underline-offset-4">
                Mühür Doğrulama Konsolu
              </Link>
              .
            </li>
            <li>
              Paketi size gönderen firmadan numarayı teyit edin. Bulunamayan bir numara, paketin
              SKDMHesapla tarafından üretilmediği anlamına gelebilir.
            </li>
          </ul>
        </section>

        <footer className="text-center text-xs font-medium text-ink-500">
          <p>{LEGAL_ENTITY.copyrightFull}</p>
        </footer>
      </div>
    </main>
  );
}
