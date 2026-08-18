"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SECTORS, type SectorId } from "@/lib/skdm/annex-ruleset";
import { routeVerdict, type VerdictRoute } from "@/lib/skdm/resolve-scope";

/**
 * Kapsam triyajı — referans prototipin "GTİP yaz ya da sektör seç" panosu.
 * Sektör tanımları HTML içinde YENİDEN TANIMLANMAZ; `annex-ruleset.ts`'teki
 * SECTORS tek kaynaktır ve kapsam kararı her yolda `resolveScope`/`routeVerdict`
 * üzerinden geçer.
 */

const CARD_ORDER: SectorId[] = [
  "iron-steel",
  "aluminum",
  "cement",
  "fertilizer",
  "hydrogen",
  "electricity",
];

/** Kart başına temsili CN — GATE-7 (RM-007): SECTORS.cardCnHint tek kaynaktır; burada kopya tanım yok. */
const CARD_SUB: Record<SectorId, string> = {
  "iron-steel": "SKDM zorunlu kapsam · yalnız direkt emisyon",
  aluminum: "SKDM zorunlu kapsam · yalnız direkt emisyon",
  cement: "SKDM zorunlu kapsam · direkt + endirekt",
  fertilizer: "SKDM zorunlu kapsam · direkt + endirekt",
  hydrogen: "SKDM zorunlu kapsam · yalnız direkt emisyon",
  electricity: "SKDM zorunlu kapsam · yalnız direkt emisyon",
};

function cnDigits(raw: string): string {
  return (raw ?? "").replace(/[^0-9]/g, "");
}

export function ScopeTriage({
  initialCn,
  defaultSector,
  onInScope,
}: {
  initialCn?: string;
  /** GATE-O (RM-006): URL'de sektör belliyse hüküm doğrudan gösterilir; kartlar ikincil bağlantıya iner. */
  defaultSector?: SectorId;
  onInScope: (route: VerdictRoute) => void;
}) {
  const [cn, setCn] = useState(initialCn ?? "");
  const [pinned, setPinned] = useState<VerdictRoute | null>(() =>
    defaultSector ? routeVerdict(SECTORS[defaultSector].cardCnHint) : null
  );

  useEffect(() => {
    if (!initialCn) return;
    setCn(initialCn);
    setPinned(routeVerdict(initialCn));
  }, [initialCn]);

  const liveRoute = useMemo(() => {
    const n = cnDigits(cn);
    if (n.length < 4) return null;
    return routeVerdict(n);
  }, [cn]);

  const shown = pinned ?? liveRoute;

  const pickSector = (id: SectorId) => {
    setPinned(routeVerdict(SECTORS[id].cardCnHint));
  };

  const reset = () => {
    setPinned(null);
    setCn("");
  };

  const isPreset = defaultSector !== undefined;

  const verdictPane =
    shown && shown.status === "in_scope" && shown.scope.sector ? (
      <VerdictPane route={shown} onContinue={() => onInScope(shown)} />
    ) : null;

  const outOfScopePane =
    shown && shown.status !== "in_scope" ? (
      <div className="rounded-2xl border-2 border-accent-yellow/60 bg-accent-yellow/15 p-5 shadow-sm">
        <h4 className="text-base font-extrabold text-ink-900">{shown.headlineTr}</h4>
        <p className="mt-1 text-sm font-medium leading-relaxed text-ink-700">{shown.bodyTr}</p>
        {shown.bridgeTr && (
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink-600">{shown.bridgeTr}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2.5">
          {shown.ctas.map((c) => (
            <Link
              key={c.href + c.labelTr}
              href={c.href}
              className={
                c.variant === "primary"
                  ? "inline-flex min-h-[42px] items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-black text-brand-950 shadow-sm transition hover:bg-brand-400"
                  : "inline-flex min-h-[42px] items-center rounded-xl border border-brand-800/30 bg-white px-4 py-2 text-sm font-bold text-brand-900 shadow-sm transition hover:bg-brand-100/60"
              }
            >
              {c.labelTr}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-3 text-xs font-bold text-brand-800 underline underline-offset-2 hover:text-brand-950"
        >
          Başka bir GTİP kodu dene
        </button>
      </div>
    ) : null;

  return (
    <div className="space-y-5">
      {verdictPane}
      {outOfScopePane}

      {isPreset ? (
        /* GATE-O: URL'de sektör belliyse kartlar ikincil bir "değiştirmek isterseniz" bloğuna iner. */
        <div className="rounded-2xl border border-line/70 bg-white p-4 shadow-sm">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-500">
            Değiştirmek isterseniz
          </div>
          <input
            type="text"
            value={cn}
            onChange={(e) => {
              setCn(e.target.value);
              setPinned(null);
            }}
            placeholder="GTİP kodunuzu kontrol edin — örn. 7214 20 00"
            className="min-h-[44px] w-full rounded-xl border-2 border-line bg-white px-3.5 text-sm font-semibold text-ink-900 shadow-sm focus:border-brand-800 focus:outline-none"
          />
          <p className="mt-2 text-xs font-medium text-ink-600">
            Faturanızda veya gümrük beyannamenizin 33 numaralı kutusunda yazar. Kapsam kararı yazdığınız koda göre yenilenir.
          </p>
          <Link
            href="/basla/"
            className="mt-3 inline-block text-[13.5px] font-semibold text-brand-800 underline underline-offset-3 hover:text-brand-950"
          >
            Sektörünüzü değiştirmek için baştan başlayın →
          </Link>
        </div>
      ) : (
        <>
          {/* GTİP girdisi */}
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-ink-900">GTİP kodunuz veya ürün adınız</span>
            </div>
            <input
              type="text"
              value={cn}
              onChange={(e) => {
                setCn(e.target.value);
                setPinned(null);
              }}
              placeholder="Örn. 7214 20 00 ya da 'inşaat demiri'"
              className="min-h-[48px] w-full rounded-2xl border-2 border-line bg-white px-4 text-base font-semibold text-ink-900 shadow-sm transition-all focus:border-brand-800 focus:outline-none"
            />
            <p className="mt-2 text-xs font-medium text-ink-600">
              Faturanızda veya gümrük beyannamenizin 33 numaralı kutusunda yazar. Bilmiyorsanız aşağıdan seçebilirsiniz.
            </p>
          </div>

          {/* Sektör kartları */}
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-500">
              Sektörünüzü biliyorsanız doğrudan seçin
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {CARD_ORDER.map((id) => {
                const def = SECTORS[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => pickSector(id)}
                    className="rounded-2xl border-2 border-line bg-white p-4 text-left shadow-sm transition-all hover:border-brand-800 hover:bg-brand-100/40"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-[15px] font-bold text-ink-900">{def.labelTr}</span>
                      <span className="shrink-0 rounded-md border border-brand-800/25 bg-brand-100/70 px-2 py-0.5 font-mono text-[10.5px] font-bold text-brand-900">
                        CN {def.representativeCn}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-ink-600">{CARD_SUB[id]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Link
            href="/rehber/gtip-bulma/"
            className="block text-[13.5px] font-semibold text-brand-800 underline underline-offset-3 hover:text-brand-950"
          >
            Hiçbirini seçemedim, ne yapacağımı bilmiyorum →
          </Link>
        </>
      )}
    </div>
  );
}

/** Kapsam sonucu — direkt/endirekt ayrımı ve yükümlülük sahibi. */
function VerdictPane({ route, onContinue }: { route: VerdictRoute; onContinue: () => void }) {
  const sector = route.scope.sector;
  if (!sector) return null;
  const directOnly = route.scope.annexIIDirectOnly === true;

  return (
    <div className="rounded-2xl border-2 border-brand-800/40 bg-brand-100/50 p-5 shadow-sm">
      <h3 className="text-lg font-extrabold text-ink-900">
        {sector.labelTr}, SKDM kapsamında
      </h3>
      <p className="mt-1 text-sm font-medium leading-relaxed text-ink-700">{route.bodyTr}</p>
      <dl className="mt-3 space-y-0">
        <div className="flex gap-3 border-t border-line/80 py-2 text-[13px]">
          <dt className="w-32 shrink-0 font-bold text-ink-900">Kim ödüyor?</dt>
          <dd className="font-medium text-ink-700">
            Sertifikayı siz değil, AB&apos;li alıcınız satın alıyor. Sizin işiniz doğru veriyi vermek.
          </dd>
        </div>
        <div className="flex gap-3 border-t border-line/80 py-2 text-[13px]">
          <dt className="w-32 shrink-0 font-bold text-ink-900">Emisyon kapsamı</dt>
          <dd className="font-medium text-ink-700">
            {directOnly
              ? "Yalnızca fabrikanızın kendi ürettiği (direkt) emisyon — elektrik faturanız sertifika maliyetine girmiyor."
              : "Hem fabrikanızın kendi ürettiği emisyon hem de tükettiğiniz elektrik hesaba giriyor."}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onContinue}
        className="mt-3 inline-flex min-h-[46px] items-center rounded-xl bg-brand-900 px-5 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-brand-950"
      >
        Dosyamı açmaya başlayayım →
      </button>
    </div>
  );
}
