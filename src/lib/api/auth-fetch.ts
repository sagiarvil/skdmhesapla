import { ensureAnonymousUser } from "@/lib/firebase/client";

/**
 * Bearer ID token ile kimlik doğrulamalı fetch.
 * Owner kimliği istemci gövdesinde asla taşınmaz; yalnızca token'dan türetilir.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const user = await ensureAnonymousUser();
  const token = await user.getIdToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
