"use client";

import { useRouter } from "next/navigation";

/** G-24 genişletme: tüm modül/içerik sayfalarında görünür geri. */
export function GeriLink({ sinifAdi = "" }: { sinifAdi?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`inline-flex min-h-touch items-center gap-1 text-sm font-medium text-brand-800 underline-offset-2 hover:underline ${sinifAdi}`}
    >
      ← Geri
    </button>
  );
}
