import type { PaymentStatusResponse } from "./seal-entitlement";

export async function fetchPaymentStatus(
  transactionId: string,
  sessionId: string,
): Promise<PaymentStatusResponse> {
  const q = new URLSearchParams({ transactionId, sessionId });
  const res = await fetch(`/api/orders/status?${q.toString()}`);
  if (!res.ok) return { status: "pending" };
  const body = (await res.json()) as PaymentStatusResponse;
  if (!body || typeof body.status !== "string") return { status: "pending" };
  return body;
}

export async function waitForPaymentCompleted(args: {
  transactionId: string;
  sessionId: string;
  attempts?: number;
  delayMs?: number;
}): Promise<PaymentStatusResponse> {
  const attempts = args.attempts ?? 15;
  const delayMs = args.delayMs ?? 2000;
  let last: PaymentStatusResponse = { status: "pending" };
  for (let i = 0; i < attempts; i++) {
    last = await fetchPaymentStatus(args.transactionId, args.sessionId);
    if (last.status === "completed" || last.status === "rejected") return last;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return last;
}
