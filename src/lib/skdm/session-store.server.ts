/**
 * Functions-only type surface for package-seal.ts.
 * tsconfig.functions-skdm-core.json resolves *.server.ts first so the
 * server package builder never pulls localStorage/Firebase browser code.
 */
export type GoodRow = { id: string; category: string; cn: string; route: string };
export type ProcessRow = { id: string; name: string; included: string[] };
export type StreamRow = {
  method: string;
  name: string;
  ad: number;
  unit: string;
  ncv: string;
  processId?: string;
};
export type PrecRow = {
  name: string;
  total: number;
  internal: number;
  other: number;
  source: string;
  see: number;
};
