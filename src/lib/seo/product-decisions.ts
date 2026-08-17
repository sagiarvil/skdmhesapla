export type ProductDecision = {
  slug: string;
  attributes: { title: string; body: string }[];
  cnNeed: string;
  boundary: string;
  ctaNote: string;
};

export const PRODUCT_DECISIONS: ProductDecision[] = [
  {
    slug: "cam-balkon-skdm-kapsaminda-mi",
    attributes: [
      {
        title: "Taşıyıcı malzeme",
        body: "Alüminyum, çelik veya PVC taşıyıcı farklı CN yolları açar. Ürün adı tek başına yeterli değildir.",
      },
      {
        title: "Fatura GTİP'i",
        body: "İhracat faturası ve gümrük kalemi hangi fasılda yazıyorsa aday sınıflandırma oradan başlar.",
      },
      {
        title: "Cam birimi ayrı mı",
        body: "Yalnız cam (CN 70) faturalanıyorsa Kademe A evrenine girmeyebilir; metal iskelet ayrı kalem olabilir.",
      },
      {
        title: "Tesis üretim süreci",
        body: "Bir CN kodu iki üretim sürecine bölünemez. Montaj ile profil üretimi aynı kodda birleştirilemez.",
      },
    ],
    cnNeed: "Aday yollar örnek: 7610 (alüminyum yapı), 7308 (çelik yapı), 39xx (plastik profil). Kesin kod gümrük sınıfıdır.",
    boundary: "Kapsam dışı sonuç SKDM hesap motoruna sokulmaz. Tedarikçi veri talebi ayrı katmandır.",
    ctaNote: "Kesin hüküm yok. Sonraki adım GTİP/CN kontrolüdür.",
  },
  {
    slug: "celik-profil-skdm-kapsaminda-mi",
    attributes: [
      {
        title: "CN 73xx adayı",
        body: "Çelik profil çoğu zaman 7301–7326 bandında değerlendirilir; fasıl doğrulanmadan hüküm yok.",
      },
      {
        title: "Üretim süreci",
        body: "Hadde, kaynaklı boru veya döküm ayrı süreçlerdir. Bir CN = bir süreç.",
      },
      {
        title: "Kaplama / alaşım",
        body: "Kaplama tek başına kapsam kararı değiştirmez; sınıflandırma ve süreç kaydı gerekir.",
      },
      {
        title: "Fatura tanımı",
        body: "Ticari ad ('çelik profil') CN yerine geçmez. Beyanname kodu esas alınır.",
      },
    ],
    cnNeed: "Demir-çelik ailesi adaydır; doğrulanmış CN yoksa hesap motoruna geçilmez.",
    boundary: "Ürün adıyla 'kesinlikle kapsamdasınız' denmez.",
    ctaNote: "CN/GTİP girin; sonuç kapsam dışıysa sihirbaz SKDM raporu üretmez.",
  },
  {
    slug: "pvc-pencere-skdm-kapsaminda-mi",
    attributes: [
      {
        title: "Profil malzemesi",
        body: "PVC/plastik taşıyıcı Kademe A altı sektör ailesinde yer almaz.",
      },
      {
        title: "Cam ünitesi ayrımı",
        body: "Cam panel ayrı CN 70 kalemi olabilir; bu da SKDM ailesi değildir.",
      },
      {
        title: "Fatura kalemleri",
        body: "Alüminyum veya çelik aksesuar ayrı kalemdeyse o kalem ayrıca CN kontrolüne tabidir.",
      },
      {
        title: "CN 39 vs 76",
        body: "Plastik fasıl ile alüminyum fasıl karıştırılmaz. Karışık setlerde kalem kalem bakılır.",
      },
    ],
    cnNeed: "PVC pencere için otomatik SKDM kapsam hükmü üretilmez. Metal kalem varsa ayrı CN gerekir.",
    boundary: "Kapsam dışı kalem SKDM hesap motoruna bağlanmaz.",
    ctaNote: "Şüphede GTİP kontrolü; kapsam dışıysa tedarikçi veri katmanına bakın.",
  },
];

export function getProductDecision(slug: string) {
  return PRODUCT_DECISIONS.find((p) => p.slug === slug);
}
