"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Global application error:", error);

    // Otomatik kurtarma: İstemci tarafı kod parçacığı (chunk) veya ağ yükleme hatası durumunda
    // kullanıcıyı hata ekranında bırakmadan sayfayı doğrudan tam GET ile yeniler (Enter davranışı).
    const errorMsg = (error?.message || "").toLowerCase();
    const errorName = (error?.name || "").toLowerCase();
    const isChunkOrNavError =
      errorName.includes("chunkloaderror") ||
      errorMsg.includes("chunkloaderror") ||
      errorMsg.includes("failed to fetch") ||
      errorMsg.includes("loading chunk") ||
      errorMsg.includes("dynamically imported module");

    if (isChunkOrNavError && typeof window !== "undefined") {
      window.location.reload();
    }
  }, [error]);

  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sayfa Yüklenemedi | SKDMHesapla</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background-color: #0b1528;
                color: #f8fafc;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .error-box {
                max-width: 480px;
                width: 90%;
                background: #111e38;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 32px 24px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
              }
              .error-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 56px;
                height: 56px;
                background: rgba(245, 158, 11, 0.15);
                color: #fbbf24;
                border-radius: 16px;
                margin-bottom: 20px;
              }
              .error-title {
                font-size: 20px;
                font-weight: 800;
                margin: 0 0 10px 0;
                color: #ffffff;
              }
              .error-desc {
                font-size: 14px;
                color: #94a3b8;
                line-height: 1.6;
                margin: 0 0 24px 0;
              }
              .btn-group {
                display: flex;
                gap: 12px;
                justify-content: center;
                flex-wrap: wrap;
              }
              .btn-primary {
                background: #0ea5e9;
                color: #ffffff;
                font-weight: 700;
                font-size: 14px;
                padding: 12px 20px;
                border-radius: 12px;
                border: none;
                cursor: pointer;
                text-decoration: none;
                transition: background 0.2s;
              }
              .btn-primary:hover {
                background: #0284c7;
              }
              .btn-secondary {
                background: transparent;
                color: #cbd5e1;
                font-weight: 600;
                font-size: 14px;
                padding: 12px 20px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                cursor: pointer;
                text-decoration: none;
                transition: background 0.2s;
              }
              .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.05);
                color: #ffffff;
              }
            `,
          }}
        />
      </head>
      <body>
        <div className="error-box">
          <div className="error-icon">
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="error-title">Sayfa Yüklenirken Bir Sorun Oluştu</h1>
          <p className="error-desc">
            İstenen sayfa yüklenirken geçici bir iletişim sorunu oluştu. Sayfayı doğrudan yenileyerek kesintisiz devam edebilirsiniz.
          </p>
          <div className="btn-group">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                } else {
                  reset();
                }
              }}
            >
              Sayfayı Yenile
            </button>
            <a href="/" className="btn-secondary">
              Ana Sayfa
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
