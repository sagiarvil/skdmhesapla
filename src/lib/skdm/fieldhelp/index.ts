import type { FieldHelpDb, ColumnHelp } from "./types";
import raw from "./fields.json";
import { glossaryBlurbForColumn, getGlossaryTerm, COLUMN_GLOSSARY_IDS } from "@/lib/skdm/glossary";

export const FIELD_HELP_DB = raw as unknown as FieldHelpDb;

export function getField(id: string) {
  return FIELD_HELP_DB.fields[id];
}

/**
 * G-21: COLUMN_HELP metni sözlükten birincil gelir; fields.json başlık/iskelet tutar.
 */
export function getColumnHelp(key: string): ColumnHelp | undefined {
  const col = FIELD_HELP_DB.columns[key];
  const glossId = COLUMN_GLOSSARY_IDS[key];
  const term = glossId ? getGlossaryTerm(glossId) : undefined;
  const gloss = glossaryBlurbForColumn(key);
  if (!col && !term) return undefined;
  return {
    title: term?.title || col?.title || key,
    content: gloss
      ? gloss
      : col?.content || "",
  };
}

/** Alan whatIsIt — sözlük eşlemesi varsa tanım oradan. */
export function resolveFieldWhatIsIt(fieldId: string, fallback: string): string {
  const map: Record<string, string> = {
    unlocode: "unlocode",
    cn: "cn_kodu_gtip",
    g_cn: "cn_kodu_gtip",
    see: "see_specific_embedded_emissions",
    ncv: "ncv_net_s_l_deger",
    dTotal: "kontrol_denkligi_a_b_c_d",
    dMarket: "kontrol_denkligi_a_b_c_d",
    dInternal: "kontrol_denkligi_a_b_c_d",
    dNonCbam: "kontrol_denkligi_a_b_c_d",
  };
  const gid = map[fieldId];
  const term = gid ? getGlossaryTerm(gid) : undefined;
  return term?.definition || fallback;
}

export function layerFieldIds(layerKey: string): string[] {
  return FIELD_HELP_DB.layers[layerKey] ?? [];
}

/** Zorunlu alanların doluluk oranı (0–100). */
export function filledFieldRatio(
  values: Record<string, string | number | undefined>,
  fieldIds: string[]
): number {
  const zorunlu = fieldIds.filter((id) => FIELD_HELP_DB.fields[id]?.required === "zorunlu");
  if (zorunlu.length === 0) return 100;
  const filled = zorunlu.filter((id) => {
    const v = values[id];
    return v !== undefined && v !== null && String(v).trim() !== "";
  }).length;
  return Math.round((filled / zorunlu.length) * 100);
}
