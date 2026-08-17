/**
 * Belirsiz ürün sınıflandırma sihirbazı — etkileşimli akışlar.
 * Gümrük kararı değildir; CN adayı + SKDM kapsam yönü üretir.
 */

export type VerdictTip = "in" | "out" | "split";

export type SihirbazCta = {
  label: string;
  kind: "olive" | "ghost";
  href?: string;
  action?: "copy-gumruk" | "copy-uretim" | "save";
};

export type SihirbazVerdict = {
  tip: VerdictTip;
  baslik: string;
  metin: string;
  facts: [string, string][];
  ctas: SihirbazCta[];
};

export type SihirbazOpt = { id: string; label: string; sub: string };

export type SihirbazSoru = {
  id: string;
  numLabel: string;
  title: string;
  hint: string;
  options: SihirbazOpt[];
  idkLabel: string;
};

export type SihirbazAkis = {
  lexiconId: string;
  whyTitle: string;
  whyBody: string;
  defTr: string;
  cnHintCode: string;
  cnHintLabel: string;
  questions: SihirbazSoru[];
  gumrukMetni: string;
  uretimMetni: string;
};

export const CAM_BALKON_AKIS: SihirbazAkis = {
  lexiconId: "AMB-001",
  whyTitle: "Bu ürün için doğrudan hesaplamaya geçemiyoruz — ve bu sizin lehinize.",
  whyBody:
    "Cam balkonda alüminyum profil SKDM kapsamında, cam değil. Yanlış sınıflandırma yaparsanız camın ağırlığını da beyan eder, alıcınıza gereğinden fazla maliyet çıkarırsınız. 3 soruda netleştirelim.",
  defTr:
    "Ticari isim; alüminyum taşıyıcı sistem + emniyet/yalıtım camı kombinasyonunu ifade edebilir.",
  cnHintCode: "7610",
  cnHintLabel: "alüminyum yapılar ve aksamı",
  gumrukMetni:
    "Merhaba, AB SKDM (CBAM) hazırlığı için ihracat faturamızdaki cam balkon kaleminin GTİP/CN teyidine ihtiyacımız var. Fatura açıklaması komple sistem mi, yalnız cam mı, yoksa yalnız profil mi? Kesin teyidi gümrük beyannamesi ve fatura ile yapacağız.",
  uretimMetni:
    "2026 SKDM çalışması için cam balkon sistemindeki alüminyum profilin net ağırlığına (cam, conta, aksesuar ve ambalaj hariç) ihtiyacımız var. Profil metrajı × birim ağırlık kaydınız varsa paylaşır mısınız?",
  questions: [
    {
      id: "q1",
      numLabel: "Soru 1 / 3",
      title: "Faturanızda ne yazıyor?",
      hint: "İhracat faturanızdaki kalem açıklamasına bakın — sınıflandırmayı belirleyen asıl belge budur.",
      idkLabel: "Faturaya şu an bakamıyorum",
      options: [
        {
          id: "sistem",
          label: "Komple sistem",
          sub: '"Cam balkon sistemi", "katlanır cam sistem" gibi tek kalem',
        },
        {
          id: "cam",
          label: "Sadece cam",
          sub: "Temperli/lamine cam, profil ayrı veya hiç yok",
        },
        {
          id: "profil",
          label: "Sadece profil",
          sub: "Alüminyum profil/çerçeve, cam ayrı fatura",
        },
      ],
    },
    {
      id: "q2",
      numLabel: "Soru 2 / 3",
      title: "Taşıyıcı çerçeve hangi malzemeden?",
      hint: "Bu, hangi SKDM sektörüne gireceğinizi belirler — alüminyum ve çelik farklı hesaplanır.",
      idkLabel: "Emin değilim",
      options: [
        { id: "alu", label: "Alüminyum", sub: "En yaygın — CN 7610" },
        { id: "celik", label: "Çelik", sub: "CN 7308 — demir-çelik sektörü" },
        { id: "pvc", label: "PVC / plastik", sub: "SKDM kapsamı dışı" },
      ],
    },
    {
      id: "q3",
      numLabel: "Soru 3 / 3",
      title: "Alüminyum profilin net ağırlığını biliyor musunuz?",
      hint: "Sadece metal kısım beyan edilecek — camın ağırlığı hesaba girmez. Bu ayrımı yapmak size doğrudan maliyet farkı olarak döner.",
      idkLabel: "Bunu üretimden sormam gerek",
      options: [
        {
          id: "var",
          label: "Evet, üretim kaydında var",
          sub: "Profil metrajı × birim ağırlık",
        },
        {
          id: "yok",
          label: "Hayır, ayrılmamış",
          sub: "Sistem toplam ağırlığı olarak tutuluyor",
        },
      ],
    },
  ],
};

const AKISLAR: Record<string, SihirbazAkis> = {
  [CAM_BALKON_AKIS.lexiconId]: CAM_BALKON_AKIS,
};

export function sihirbazAkisi(lexiconId: string): SihirbazAkis | null {
  return AKISLAR[lexiconId] || null;
}

/** Erken çıkış veya son karar. null = sonraki soruya geç. */
export function cozSiniflandirma(
  lexiconId: string,
  answers: Record<string, string>
): SihirbazVerdict | null {
  if (lexiconId !== "AMB-001") return null;

  if (answers.q1 === "cam") {
    return {
      tip: "out",
      baslik: "Bu ürün SKDM kapsamında görünmüyor",
      metin:
        "Faturanızda yalnızca cam varsa, ürün cam eşya olarak sınıflandırılır (CN 70. fasıl) ve SKDM kapsamına girmez. Bu ürün için veri paketi hazırlamanıza gerek yok.",
      facts: [
        [
          "Ne yapmalısınız",
          "Bu ürün için işlem gerekmez. Alıcınız yine de veri isterse, kapsam dışı olduğunu bildiren kısa bir not iletebilirsiniz.",
        ],
      ],
      ctas: [],
    };
  }

  if (answers.q2 === "pvc") {
    return {
      tip: "out",
      baslik: "Bu ürün SKDM kapsamında görünmüyor",
      metin:
        "PVC/plastik taşıyıcı sistemler SKDM kapsamındaki 6 sektör ailesinde yer almaz.",
      facts: [["Ne yapmalısınız", "Bu ürün için işlem gerekmez."]],
      ctas: [],
    };
  }

  if (!answers.q1 || !answers.q2 || !answers.q3) return null;

  const celik = answers.q2 === "celik";
  const sektor = celik ? "Demir & Çelik" : "Alüminyum";
  const cn = celik ? "7308" : "7610";
  const href = celik ? "/hesapla/demir-celik/" : "/hesapla/aluminyum/";
  const karma = answers.q1 === "sistem";
  const metalAd = celik ? "çelik" : "alüminyum";

  if (karma && answers.q3 === "yok") {
    return {
      tip: "split",
      baslik: "Kapsamdasınız — ama önce bir ayrım yapmalıyız",
      metin: `Ürününüz ${sektor} sektöründe, CN ${cn}. Ancak komple sistem sattığınız için, camın ağırlığını beyan etmemeniz gerekiyor — sadece metal kısım SKDM'ye tabi.`,
      facts: [
        ["Sektör", `${sektor} · CN ${cn}`],
        ["Beyan edilecek", `Yalnızca ${metalAd} profilin net ağırlığı`],
        ["Beyan edilmeyecek", "Cam, conta, aksesuar, ambalaj"],
        ["Eksik olan", "Profilin net ağırlığı henüz ayrılmamış"],
      ],
      ctas: [
        { label: "Üretimden profil ağırlığını iste", kind: "olive", action: "copy-uretim" },
        { label: "Hesaplamaya geç — ağırlığı sonra gir", kind: "ghost", href },
      ],
    };
  }

  return {
    tip: "in",
    baslik: "Kapsamdasınız, hesaplamaya geçebiliriz",
    metin:
      `Ürününüz ${sektor} sektöründe, CN ${cn}.` +
      (karma
        ? ` Komple sistem sattığınız için yalnızca ${metalAd} profilin ağırlığını beyan edeceğiz — cam hesaba girmiyor.`
        : " Tek malzemeli ürün olduğu için tüm net ağırlık beyan edilecek."),
    facts: [
      ["Sektör", `${sektor} · CN ${cn}`],
      ["Beyan edilecek", karma ? `Yalnızca ${metalAd} profil net ağırlığı` : "Ürünün net ağırlığı"],
      ["Emisyon kapsamı", "Yalnızca doğrudan (Kapsam 1) — Annex II"],
    ],
    ctas: [{ label: "Hesaplamaya geç →", kind: "olive", href }],
  };
}
