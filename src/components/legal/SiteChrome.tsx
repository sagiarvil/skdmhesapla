"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MarkaLogo } from "@/components/brand/MarkaLogo";
import { GeriLink } from "@/components/nav/GeriLink";

import { LEGAL_ENTITY, SITE_NAV_LINKS, SITE_LEGAL_LINKS } from "@/lib/skdm/constants";

const DISCLAIMER = LEGAL_ENTITY.disclaimer;
const LEGAL = SITE_LEGAL_LINKS;
const NAV = SITE_NAV_LINKS;

import { useAuth } from "@/lib/firebase/auth-context";
import { User, LogOut, FileText, ChevronDown } from "lucide-react";

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
  const { user, profile, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserDropdown(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Kullanıcı";

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

        <nav className="hidden items-center gap-5 md:flex" aria-label="Ana">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={navClass(pathname === item.href)}>
              {item.label}
            </Link>
          ))}

          {/* KULLANICI GİRİŞ / HESAP ALANI */}
          {user && !user.isAnonymous ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdown((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-800/60 px-3.5 py-1.5 text-sm font-bold text-white hover:bg-brand-800 transition"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-black text-brand-950">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{displayName}</span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-white p-2 text-ink-900 shadow-2xl z-50">
                  <div className="border-b border-line px-3 py-2">
                    <div className="text-xs font-semibold text-ink-600">Giriş Yapıldı</div>
                    <div className="truncate text-sm font-bold text-ink-900">{user.email}</div>
                  </div>
                  <Link
                    href="/hesabim/"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-brand-100/60 transition"
                  >
                    <User className="h-4 w-4 text-brand-800" />
                    <span>Hesap Paneli</span>
                  </Link>
                  <Link
                    href="/hesabim/#dosyalarim"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-brand-100/60 transition"
                  >
                    <FileText className="h-4 w-4 text-brand-800" />
                    <span>Mühürlü Dosyalarım</span>
                  </Link>
                  {profile?.role === "admin" && (
                    <Link
                      href="/admin/"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
                    >
                      <User className="h-4 w-4 text-purple-700" />
                      <span>Yönetim Paneli</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/giris/"
              className="inline-flex min-h-ctl items-center rounded-ctl border border-brand-tint/40 px-3.5 text-sm font-bold text-white hover:bg-brand-800 transition"
            >
              Giriş Yap
            </Link>
          )}

          <Link
            href="/basla/"
            className="inline-flex min-h-ctl items-center rounded-ctl bg-brand-500 px-4 text-sm font-bold text-brand-900 hover:bg-brand-400 shadow-sm transition"
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
          className="fixed inset-0 z-50 flex flex-col bg-brand-900 px-5 pt-20 md:hidden overflow-y-auto"
        >
          {/* Mobil Kullanıcı Kartı */}
          {user && !user.isAnonymous ? (
            <div className="rounded-2xl border border-brand-500/30 bg-brand-800/60 p-4 mb-4 text-white">
              <div className="text-xs text-brand-tint">Giriş Yapılan Hesap:</div>
              <div className="text-base font-bold truncate">{displayName} ({user.email})</div>
              <div className="mt-3 flex gap-2">
                <Link
                  href="/hesabim/"
                  className="flex-1 rounded-xl bg-brand-500 py-2 text-center text-xs font-bold text-brand-950"
                >
                  Hesap Paneli
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-xl border border-rose-400/50 bg-rose-500/20 px-3 py-2 text-xs font-bold text-rose-200"
                >
                  Çıkış
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <Link
                href="/giris/"
                className="flex items-center justify-center rounded-2xl border border-brand-tint/40 bg-brand-800/40 py-3 text-sm font-bold text-white"
              >
                Giriş Yap / Kayıt Ol
              </Link>
            </div>
          )}

          <nav className="flex flex-col gap-2 py-4" aria-label="Mobil">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navClass(pathname === item.href)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/basla/"
              className="mt-3 flex min-h-ctl items-center justify-center rounded-ctl bg-brand-500 px-4 text-sm font-bold text-brand-900"
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
            <span className="font-bold text-white">{LEGAL_ENTITY.brandName}</span>
            <span className="text-brand-tint/60">·</span>
            <span className="text-brand-tint/80">{LEGAL_ENTITY.copyrightShort}</span>
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
          <span className="text-lg font-bold text-white">{LEGAL_ENTITY.brandName}</span>
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
          {LEGAL_ENTITY.copyrightFull}
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
