"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MarkaLogo } from "@/components/brand/MarkaLogo";
import { GeriLink } from "@/components/nav/GeriLink";

const DISCLAIMER =
  "SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır.";

const LEGAL = [
  { href: "/dogrula/", label: "Mühür Doğrulama" },
  { href: "/tedarikci-verisi/", label: "Tedarikçi Verisi" },
  { href: "/fiyatlandirma/", label: "Fiyatlandırma" },
  { href: "/kullanim-kosullari/", label: "Kullanım Koşulları" },
  { href: "/kvkk-aydinlatma/", label: "KVKK" },
  { href: "/iade-politikasi/", label: "İade" },
  { href: "/iletisim/", label: "İletişim" },
] as const;

const NAV = [
  { href: "/nasil-calisir/", label: "Nasıl Çalışır" },
  { href: "/rehber/", label: "Rehber" },
  { href: "/tedarikci-verisi/", label: "Tedarikçi Verisi" },
  { href: "/sozluk/", label: "Sözlük" },
  { href: "/dogrula/", label: "Doğrula" },
  { href: "/fiyatlandirma/", label: "Fiyatlandırma" },
] as const;

function navClass(active: boolean) {
  return [
    "inline-flex min-h-touch items-center border-b-2 text-sm font-semibold transition-colors",
    active
      ? "border-brand-500 text-white"
      : "border-transparent text-brand-tint hover:text-white",
  ].join(" ");
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-0 bg-brand-900 header-hairline ${
        scrolled ? "shadow-header" : ""
      }`}
    >
      <div className="mx-auto flex h-20 max-w-container items-center justify-between gap-4 px-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {pathname !== "/" && (
            <GeriLink sinifAdi="text-brand-tint hover:text-white" />
          )}
          <Link href="/" className="flex min-h-touch items-center gap-3">
            <span className="inline-block h-14 w-14 shrink-0">
              <MarkaLogo varyant="header" className="h-14 w-14" />
            </span>
            <span className="text-xl font-bold tracking-tight text-white">SKDMHesapla</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Ana">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={navClass(pathname === item.href)}>
              {item.label}
            </Link>
          ))}
          <Link
            href="/basla/"
            className="inline-flex min-h-ctl items-center rounded-ctl bg-brand-500 px-4 text-sm font-bold text-brand-900 hover:bg-brand-400 shadow-sm"
          >
            Hemen Başla
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-ctl border border-brand-tint/40 px-3 text-sm font-semibold text-brand-tint md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobil-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "Kapat" : "Menü"}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobil-menu"
          className="fixed inset-0 z-50 flex flex-col bg-brand-900 px-5 pt-20 md:hidden"
        >
          <nav className="flex flex-col gap-2 py-6" aria-label="Mobil">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-ctl border-b-2 px-1 py-3 text-lg font-semibold ${
                  pathname === item.href
                    ? "border-brand-500 text-white"
                    : "border-transparent text-brand-tint"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/basla/"
              className="mt-4 inline-flex min-h-ctl items-center justify-center rounded-ctl bg-brand-500 px-4 text-base font-bold text-brand-900"
            >
              Hemen Başla
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (!isHome) {
    return (
      <footer className="border-t border-brand-800/40 bg-brand-950 py-4 text-brand-tint">
        <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-3 px-5 text-xs sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-white">SKDMHesapla</span>
            <span className="text-brand-tint/60">·</span>
            <span className="text-brand-tint/80">© {new Date().getFullYear()} Barış Bağırlar (VKN 25403091318)</span>
          </div>

          <nav aria-label="Hukuki linkler" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {LEGAL.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-brand-tint/80 hover:text-white transition underline-offset-2 hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-0 border-t border-brand-800/40 bg-brand-900">
      <div className="mx-auto max-w-container space-y-6 px-5 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <MarkaLogo varyant="footer" className="h-10 w-10" />
          <span className="text-lg font-bold text-white">SKDMHesapla</span>
        </div>
        <nav aria-label="Hukuki sayfalar" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-brand-tint font-medium">
          {LEGAL.map((l) => (
            <Link key={l.href} href={l.href} className="underline-offset-2 hover:text-white hover:underline transition">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="max-w-3xl text-xs leading-relaxed text-brand-tint/90">{DISCLAIMER}</p>
        <p className="text-xs text-brand-tint/80 border-t border-brand-800/60 pt-4">
          © {new Date().getFullYear()} SKDMHesapla · Barış Bağırlar · VKN 25403091318
        </p>
      </div>
    </footer>
  );
}

export function DisclaimerBanner() {
  return (
    <div className="rounded-card border-2 border-line bg-brand-100/70 p-4 text-xs font-medium text-ink-900 shadow-sm sm:text-sm leading-relaxed">
      <strong>Hukuki Bildirim:</strong> {DISCLAIMER}
    </div>
  );
}
