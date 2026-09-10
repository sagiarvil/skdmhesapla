import Link from "next/link";
import { CBAM_VERIFICATION_WORKFLOW } from "@/lib/skdm/verification-workflow";

export function VerificationGuidanceNotice({ compact = false }: { compact?: boolean }) {
  const workflow = CBAM_VERIFICATION_WORKFLOW;

  return (
    <aside
      className="rounded-2xl border border-[#d9e3cf] bg-[#f5f8f1] p-4 sm:p-5"
      aria-label="1 Eylül 2026 State-of-play CBAM doğrulama ve Registry erişim prosedürü güncellemesi"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#4e5f35]">
        <span>1 Eylül 2026</span>
        <span aria-hidden>•</span>
        <span>European Commission / DG TAXUD</span>
        <span aria-hidden>•</span>
        <span>Workflow v{workflow.version}</span>
      </div>
      <h2 className="mt-2 text-lg font-extrabold tracking-tight text-[#202124] sm:text-xl">
        CBAM doğrulayıcı (State-of-play) ve Registry erişim prosedürü netleşti
      </h2>
      <p className="mt-2 text-sm font-medium leading-6 text-[#4d5156] sm:text-base">
        Doğrulayıcı önce ilgili Ulusal Akreditasyon Kuruluşundan (NAB) CBAM akreditasyonu alır.
        1 Eylül 2026 itibarıyla akredite doğrulayıcılar O3CI portalı üzerinden NCA'ya kayıt başvurusu yapar.
        Komisyon, akredite doğrulayıcı listesini ilgili CBAM sayfasında yayımlayacaktır.
      </p>
      {!compact && (
        <ol className="mt-3 space-y-2 text-sm leading-6 text-[#3c4043]">
          {workflow.flow.map((step, index) => (
            <li key={step}><b>{index + 1}.</b> {step}</li>
          ))}
        </ol>
      )}
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#3c4043]">
        <li><b>1 Eylül 2026:</b> İlk doğrulayıcıların akredite olması ve O3CI portalından Registry kayıt/erişim sürecinin resmen başlaması.</li>
        <li><b>İki aylık süre:</b> {workflow.verifierRegistrationDeadlineRule} Registry’ye kaydolmalıdır.</li>
        <li><b>Ocak 2027:</b> Doğrulayıcılar operatör verilerini ve kanıtlarını inceleyerek CBAM Registry üzerinden verification report düzenlemeye başlar.</li>
        {!compact && <li><b>21 Ağustos 2026:</b> CBAM Registry – User manual – Declarants portal güncel operasyonel referans olarak yayımlanmıştır.</li>}
      </ul>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <p className="rounded-xl bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#5f6368]">
          <b>Hesaplama etkisi: YOK.</b> {workflow.calculationImpactNote}
        </p>
        <p className="rounded-xl bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#5f6368]">
          <b>Default values:</b> {workflow.defaultValuesStatus}
        </p>
      </div>
      <p className="mt-2 text-xs font-semibold leading-5 text-[#5f6368]">{workflow.productBoundary}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
        <a href={workflow.guidanceSourceUrl} target="_blank" rel="noreferrer" className="text-[#355f2d] underline underline-offset-4">
          24 Ağustos resmî rehberi
        </a>
        <a href={workflow.registrySourceUrl} target="_blank" rel="noreferrer" className="text-[#355f2d] underline underline-offset-4">
          CBAM Registry / 21 Ağustos manual
        </a>
        <a
          href="/mevzuat-guncellemeleri/cbam-verifier-registry-erisim-proseduru-1-eylul-2026/"
          className="text-[#355f2d] underline underline-offset-4"
        >
          1 Eylül prosedür detayı
        </a>
      </div>
    </aside>
  );
}
