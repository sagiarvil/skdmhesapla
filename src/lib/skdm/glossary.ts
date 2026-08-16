import glossary from "@/lib/skdm/glossary.json";

export type GlossaryTerm = {
  id: string;
  title: string;
  definition: string;
};

export function getGlossaryTerms(): GlossaryTerm[] {
  return glossary.terms as GlossaryTerm[];
}

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return getGlossaryTerms().find((t) => t.id === id);
}

/** COLUMN_HELP → glossary.id (Plan 21 sayfa-icerik-sozluk.md) */
export const COLUMN_GLOSSARY_IDS: Record<string, string> = {
  p_bubble: "bubble_approach_kapsul_yaklasimi",
  p_name: "a_instdata_tesis_bilgi_katmani",
  b_method: "dogrudan_emisyon",
  b_name: "faaliyet_verisi_activity_data",
  b_ad: "faaliyet_verisi_activity_data",
  b_ncv: "ncv_net_kalorifik_deger",
  b_process: "bubble_approach_kapsul_yaklasimi",
  e_total: "oncu_madde_precursor",
  e_internal: "tesis_ici_tuketim",
  e_other: "oncu_madde_precursor",
  e_see: "see_spesifik_gomulu_emisyon",
  e_source: "oncu_madde_precursor",
  g_cn: "cn_kodu_gti_p",
  g_category: "kademe_a",
  g_route: "bubble_approach_kapsul_yaklasimi",
};

export function glossaryBlurbForColumn(columnKey: string): string | undefined {
  const gid = COLUMN_GLOSSARY_IDS[columnKey];
  return gid ? getGlossaryTerm(gid)?.definition : undefined;
}
