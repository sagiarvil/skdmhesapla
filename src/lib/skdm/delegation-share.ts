/**
 * Veri talebi (delegasyon) paylaşımı — gerçek backend köprüsü.
 *
 * Sihirbazdaki tek alan için paylaşılabilir link oluşturur; linki açan kişi
 * yalnızca o tek alanı doldurur ve değer oturum taslağına işlenir.
 * Tüm yazma işlemleri admin SDK üzerinden `/api/veri-talebi/*` ile yapılır;
 * istemci Firestore'a doğrudan yazmaz.
 */

export type VeriTalebiShare = {
  token: string;
  fieldId: string;
  fieldTitle: string;
  why: string;
  howToEnter: string;
  required: string;
  inputType: string;
  used: boolean;
  submittedAt: string | null;
  sectorSlug: string | null;
};

export type CreateDelegationShareInput = {
  sessionId: string;
  sectorSlug: string;
  fieldId: string;
  fieldTitle: string;
  why: string;
  howToEnter: string;
  required: string;
  inputType: string;
};

export type DelegationShareResult =
  | { ok: true; token: string; url: string }
  | { ok: false; message: string };

export type GetDelegationShareResult =
  | { ok: true; share: VeriTalebiShare }
  | { ok: false; message: string };

export type SubmitDelegationValueResult =
  | { ok: true; fieldId: string; fieldTitle: string }
  | { ok: false; message: string };

async function parseJson<T>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    return { ok: false, message: "Sunucu yanıtı okunamadı" } as T;
  }
}

/** Yeni bir tek-alan delegasyon linki oluşturur. */
export async function createDelegationShare(
  input: CreateDelegationShareInput
): Promise<DelegationShareResult> {
  const res = await fetch("/api/veri-talebi/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<DelegationShareResult>(res);
}

/** Linki açan sayfa için paylaşım kaydını okur (yalnız görüntüleme alanları). */
export async function getDelegationShare(token: string): Promise<GetDelegationShareResult> {
  const res = await fetch(`/api/veri-talebi/share?token=${encodeURIComponent(token)}`);
  return parseJson<GetDelegationShareResult>(res);
}

/** Delege edilen kişinin gönderdiği değeri oturum taslağına işler. */
export async function submitDelegationValue(
  token: string,
  value: string
): Promise<SubmitDelegationValueResult> {
  const res = await fetch("/api/veri-talebi/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, value }),
  });
  return parseJson<SubmitDelegationValueResult>(res);
}
