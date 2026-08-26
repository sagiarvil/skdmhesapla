"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white text-ink-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-line bg-brand-50/40 p-8 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-5">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
          Sayfa yüklenirken bir sorun oluştu
        </h1>
        <p className="mt-3 text-sm font-medium leading-relaxed text-ink-600">
          İstenen sayfa görüntülenirken beklenmeyen bir hata meydana geldi. Sayfayı yenileyebilir veya ana sayfaya dönebilirsiniz.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex w-full sm:w-auto min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-black text-white hover:bg-brand-700 transition"
          >
            <RefreshCw className="h-4 w-4" /> Yeniden Dene
          </button>
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto min-h-11 items-center justify-center gap-2 rounded-xl border border-brand-800/20 bg-white px-5 text-sm font-black text-brand-900 hover:bg-brand-50 transition"
          >
            <Home className="h-4 w-4" /> Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
