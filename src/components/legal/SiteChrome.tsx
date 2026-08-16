"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { CiftDalga } from "@/components/brand/CiftDalga";
import { MarkaLogo } from "@/components/brand/MarkaLogo";
import { GeriLink } from "@/components/nav/GeriLink";

const DISCLAIMER =
  "SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır.";

const LEGAL = [
  { href: "/dogrula/", label: "🛡️ Doğrula" },
  { href: "/fiyatlandirma/", label: "Fiyatlandırma" },
  { href: "/kullanim-kosullari/", label: "Kullanım Koşulları" },
  { href: "/kvkk-aydinlatma/", label: "KVKK" },
  { href: "/iade-politikasi/", label: "İade" },
  { href: "/iletisim/", label: "İletişim" },
] as const;

const NAV = [
  { href: "/nasil-calisir/", label: "Nasıl Çalışır" },
  { href: "/rehber/", label: "Rehber" },
  { href: "/sozluk/", label: "Sözlük" },
  { href: "/fiyatlandirma/", label: "Fiyatlandırma" },
] as const;

const KADEME_A_SEKTORLER = [
  { href: "/hesapla/demir-celik/", label: "Demir & Çelik" },
  { href: "/hesapla/aluminyum/", label: "Alüminyum" },
  { href: "/hesapla/cimento/", label: "Çimento" },
  { href: "/hesapla/gubre/", label: "Gübre" },
  { href: "/hesapla/elektrik/", label: "Elektrik" },
  { href: "/hesapla/hidrojen/", label: "Hidrojen" },
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
            Hemen Hesapla
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
              Hemen Hesapla
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

  // Alt sayfalarda: Tek satırlık ince, pro-premium kompakt footer
  if (!isHome) {
    return (
      <footer className="border-t border-brand-800/40 bg-brand-950 py-4 text-brand-tint">
        <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-3 px-5 text-xs sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-white">SKDMHesapla</span>
            <span className="text-brand-tint/60">·</span>
            <span className="text-brand-tint/80">© {new Date().getFullYear()} Barış Bağırlar (VKN 25403091318)</span>
          </div>

          <nav aria-label="Hukuki linkler" className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
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

  // Ana sayfada: Dengeli, zengin, 4 sütunlu profesyonel kurumsal footer
  return (
    <footer className="pasaport-zemin-koyu relative isolate bg-brand-950 text-white">
      <div className="relative z-[2] -mt-1">
        <CiftDalga yon="yukari" dolguSinif="text-brand-950" sinifAdi="h-10 sm:h-12" />
      </div>

      <div className="mx-auto max-w-container px-5 pt-8 pb-10 sm:px-6">
        {/* 4 Kolonlu Zengin Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 pb-8 border-b border-brand-800/40">
          {/* Kolon 1: Marka ve Güven */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <MarkaLogo varyant="footer" className="h-10 w-10" />
              <span className="text-2xl font-black text-white">SKDMHesapla</span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-brand-mist/90 max-w-sm">
              AB Sınırda Karbon Düzenleme Mekanizması (CBAM) kesin dönem emisyon hesaplama, maliyet simülasyonu ve mühürlü denetim paketi platformu.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-brand-500/30 bg-brand-900/60 px-3 py-1.5 text-xs font-semibold text-brand-500">
              <ShieldCheck className="h-4 w-4 text-accent-green" />
              <span>AB 2023/956 &amp; IR 2025/2547 Uyumlu</span>
            </div>
          </div>

          {/* Kolon 2: Kademe A Sektörler */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Kademe A Sektörler
            </h3>
            <ul className="space-y-2 text-sm font-medium text-brand-tint">
              {KADEME_A_SEKTORLER.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-white transition flex items-center gap-1.5">
                    <span className="text-brand-500 text-xs">›</span>
                    <span>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolon 3: Kaynaklar & Araçlar */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Kaynaklar &amp; Araçlar
            </h3>
            <ul className="space-y-2 text-sm font-medium text-brand-tint">
              <li>
                <Link href="/dogrula/" className="hover:text-white transition flex items-center gap-1.5 font-bold text-brand-500">
                  <span>🛡️ Mühür Doğrulama</span>
                </Link>
              </li>
              <li>
                <Link href="/basla/" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="text-brand-500 text-xs">›</span>
                  <span>Sektör &amp; GTİP Seçimi</span>
                </Link>
              </li>
              <li>
                <Link href="/nasil-calisir/" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="text-brand-500 text-xs">›</span>
                  <span>Nasıl Çalışır?</span>
                </Link>
              </li>
              <li>
                <Link href="/rehber/" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="text-brand-500 text-xs">›</span>
                  <span>SKDM Rehberi 2026</span>
                </Link>
              </li>
              <li>
                <Link href="/sozluk/" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="text-brand-500 text-xs">›</span>
                  <span>SKDM Sözlüğü (v3)</span>
                </Link>
              </li>
              <li>
                <Link href="/fiyatlandirma/" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="text-brand-500 text-xs">›</span>
                  <span>Fiyatlandırma &amp; Paket</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolon 4: Kurumsal & Güvenlik */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Kurumsal
            </h3>
            <ul className="space-y-2 text-sm font-medium text-brand-tint">
              <li>
                <Link href="/kullanim-kosullari/" className="hover:text-white transition">
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link href="/kvkk-aydinlatma/" className="hover:text-white transition">
                  KVKK Aydınlatma
                </Link>
              </li>
              <li>
                <Link href="/iade-politikasi/" className="hover:text-white transition">
                  İade Politikası
                </Link>
              </li>
              <li>
                <Link href="/iletisim/" className="hover:text-white transition">
                  İletişim &amp; Destek
                </Link>
              </li>
            </ul>
            <div className="pt-2 text-xs text-brand-mist/80 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-accent-green shrink-0" />
              <span>256-Bit SSL Güvenli Altyapı</span>
            </div>
          </div>
        </div>

        {/* Alt Şerit: Telif ve Bildirim */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-tint/80">
          <p className="max-w-xl text-center sm:text-left leading-relaxed">
            {DISCLAIMER}
          </p>
          <p className="shrink-0 text-center sm:text-right">
            © {new Date().getFullYear()} SKDMHesapla · Barış Bağırlar (VKN 25403091318)
          </p>
        </div>
      </div>
    </footer>
  );
}

export function DisclaimerBanner() {
  return (
    <div className="rounded-2xl border-2 border-line bg-brand-100/70 p-4 text-xs font-semibold text-ink-900 shadow-sm sm:text-sm leading-relaxed">
      <strong>Hukuki Bildirim:</strong> {DISCLAIMER}
    </div>
  );
}
