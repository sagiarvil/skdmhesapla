"use client";

import { useRouter } from "next/navigation";

/** G-24 genişletme: tüm modül/içerik sayfalarında görünür geri. */
export function GeriLink({
  sinifAdi = "",
  compact = false,
}: {
  sinifAdi?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Geri"
      className={
        compact
          ? `inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl border border-white/12 text-[15px] font-semibold text-brand-tint transition hover:bg-white/[0.06] hover:text-white ${sinifAdi}`
          : `inline-flex min-h-touch items-center gap-1 text-sm font-medium text-brand-800 underline-offset-2 hover:underline ${sinifAdi}`
      }
    >
      {compact ? <span aria-hidden>←</span> : "← Geri"}
    </button>
  );
}
