export type FieldRequired = "zorunlu" | "opsiyonel" | "gerekebilir";

export type FieldConfig = {
  title: string;
  required: FieldRequired;
  why: string;
  whatIsIt: string;
  whereToFind: string[];
  whoHasIt: string;
  howToEnter: string;
  consequence: string;
  delegationTemplate: string;
  type?: "text" | "number" | "date" | "select";
  default?: string | number;
  options?: [string, string][];
  anomaly?: { threshold: number; msg: string } | null;
};

export type ColumnHelp = {
  title: string;
  content: string;
};

export type FieldHelpDb = {
  fields: Record<string, FieldConfig>;
  columns: Record<string, ColumnHelp>;
  layers: Record<string, string[]>;
};
