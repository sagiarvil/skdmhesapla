"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MarkaLogo } from "@/components/brand/MarkaLogo";
import { GeriLink } from "@/components/nav/GeriLink";
import { useAuth } from "@/lib/firebase/auth-context";
import { User, LogOut, FileText, ChevronDown } from "lucide-react";
import {
  LEGAL_ENTITY,
  SITE_NAV_LINKS,
  SITE_LEGAL_LINKS,
  SITE_FOOTER_PRODUCT_LINKS,
} from "@/lib/skdm/constants";

const DISCLAIMER = LEGAL_ENTITY.disclaimer;
const LEGAL = SITE_LEGAL_LINKS;
const NAV = SITE_NAV_LINKS;
const FOOTER_PRODUCT = SITE_FOOTER_PRODUCT_LINKS;

function navClass(active: boolean) {
  return [
    "relative inline-flex h-9 items-center px-1 text-[13px] font-semibold tracking-wide transition-colors",
    active ? "text-white" : "text-brand-tint/85 hover:text-white",
    active
      ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-500"
      : "",
  ].join(" ");
}

function footerLinkClass() {
  return "text-[13px] font-medium text-brand-tint/80 transition hover:text-white";
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

  const displayName =
    profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Kullanıcı";

  return (
    <header
      className={`sticky top-0 z-40 bg-brand-900 header-hairline ${
        scrolled ? "shadow-header" : ""
      }`}
    >
      {/* Üç kolon: marka | nav (orta) | aksiyon — simetrik premium bar */}
      <div className="mx-auto grid h-[4.75rem] max-w-container grid-cols-[1fr_auto] items-center gap-3 px-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5 justify-self-start">
          {pathname !== "/" && (
            <GeriLink sinifAdi="text-brand-tint/80 hover:text-white shrink-0" />
          )}
          <Link href="/" className="group flex min-w-0 items-center gap-2.5">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16">
              <MarkaLogo varyant="header" className="h-14 w-14 sm:h-16 sm:w-16" />
            </span>
            <span className="truncate text-[15px] font-bold tracking-tight text-white sm:text-base">
              SKDMHesapla
            </span>
          </Link>
        </div>

        <nav
          className="hidden items-center justify-center gap-5 lg:gap-6 md:flex"
          aria-label="Ana"
        >
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={navClass(pathname === item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-2 sm:gap-2.5">
          <div className="hidden items-center gap-2 md:flex">
            {user && !user.isAnonymous ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdown((v) => !v)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-[13px] font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500 text-[11px] font-black text-brand-950">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[100px] truncate xl:inline">{displayName}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white p-1.5 text-ink-900 shadow-xl">
                    <div className="border-b border-line px-3 py-2.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-600">
                        Oturum
                      </div>
                      <div className="truncate text-sm font-bold text-ink-900">{user.email}</div>
                    </div>
                    <Link
                      href="/hesabim/"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-brand-100/70"
                    >
                      <User className="h-4 w-4 text-brand-800" />
                      Hesap Paneli
                    </Link>
                    <Link
                      href="/hesabim/#dosyalarim"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-brand-100/70"
                    >
                      <FileText className="h-4 w-4 text-brand-800" />
                      Mühürlü Dosyalarım
                    </Link>
                    {profile?.role === "admin" && (
                      <Link
                        href="/admin/"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-900 hover:bg-brand-100/70"
                      >
                        <User className="h-4 w-4 text-brand-800" />
                        Yönetim Paneli
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ink-700 hover:bg-brand-100/70"
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/giris/"
                className="inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-semibold text-brand-tint/90 transition hover:text-white"
              >
                Giriş
              </Link>
            )}

            <Link
              href="/basla/"
              className="inline-flex h-9 items-center rounded-lg bg-brand-500 px-3.5 text-[13px] font-bold text-brand-900 transition hover:bg-brand-400"
            >
              Hemen Başla
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-white/15 px-3 text-[13px] font-semibold text-brand-tint md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobil-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "Kapat" : "Menü"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobil-menu"
          className="fixed inset-0 z-50 flex flex-col bg-brand-900 px-5 pt-[4.75rem] md:hidden overflow-y-auto"
        >
          {user && !user.isAnonymous ? (
            <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-tint/70">
                Hesap
              </div>
              <div className="mt-1 truncate text-sm font-bold">
                {displayName}
                <span className="font-medium text-brand-tint/70"> · {user.email}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href="/hesabim/"
                  className="flex-1 rounded-lg bg-brand-500 py-2.5 text-center text-xs font-bold text-brand-950"
                >
                  Hesap Paneli
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-lg border border-white/15 px-3 py-2.5 text-xs font-semibold text-brand-tint"
                >
                  Çıkış
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/giris/"
              className="mb-3 flex items-center justify-center rounded-xl border border-white/15 py-3 text-sm font-semibold text-white"
            >
              Giriş Yap / Kayıt Ol
            </Link>
          )}

          <nav className="flex flex-col gap-0.5" aria-label="Mobil">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-3 text-sm font-semibold ${
                  pathname === item.href ? "bg-white/10 text-white" : "text-brand-tint hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/basla/"
              className="mt-3 flex h-11 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-brand-900"
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
  return (
    <footer className="border-t border-white/[0.08] bg-brand-900 text-brand-tint">
      <div className="mx-auto max-w-container px-5 sm:px-6">
        {/* Üst bant — dengeli 3 kolon, sıkı dikey ritim */}
        <div className="grid gap-8 py-7 md:grid-cols-12 md:gap-6 md:py-8">
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <MarkaLogo varyant="footer" className="h-9 w-9" />
              <span className="text-[15px] font-bold tracking-tight text-white">
                {LEGAL_ENTITY.brandName}
              </span>
            </Link>
            <p className="max-w-md text-[12px] leading-relaxed text-brand-tint/75">{DISCLAIMER}</p>
          </div>

          <div className="md:col-span-3">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-tint/55">
              Ürün
            </div>
            <ul className="space-y-2">
              {FOOTER_PRODUCT.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={footerLinkClass()}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-tint/55">
              Destek & Yasal
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-2">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={footerLinkClass()}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Alt bant — simetrik tek satır, ekstra boşluk yok */}
        <div className="flex flex-col gap-2 border-t border-white/[0.08] py-4 text-[12px] text-brand-tint/65 sm:flex-row sm:items-center sm:justify-between">
          <span>{LEGAL_ENTITY.copyrightFull}</span>
          <span className="sm:text-right">
            Destek:{" "}
            <a
              href={`mailto:${LEGAL_ENTITY.supportEmail}`}
              className="font-medium text-brand-tint/85 transition hover:text-white"
            >
              {LEGAL_ENTITY.supportEmail}
            </a>
          </span>
        </div>
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
