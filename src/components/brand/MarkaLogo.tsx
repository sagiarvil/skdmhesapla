"use client";

type Props = {
  varyant: "header" | "hero" | "footer";
  className?: string;
};

const SRC = {
  header: { src: "/logo/skdm-logo-header-120.gif", w: 108, h: 108 },
  hero: { src: "/logo/skdm-logo-animasyonlu-240.gif", w: 160, h: 160 },
  footer: { src: "/logo/skdm-logo-statik.png", w: 56, h: 56 },
} as const;

/**
 * Header/hero: her zaman animasyonlu GIF (Mac "Hareketi azalt" dahil).
 * next/image kullanılmaz — static export GIF karelerini dondurur.
 * Footer: statik PNG.
 */
export function MarkaLogo({ varyant, className = "" }: Props) {
  const meta = SRC[varyant];

  return (
    // eslint-disable-next-line @next/next/no-img-element -- GIF animasyonu için next/image yasak
    <img
      src={meta.src}
      alt="SKDMHesapla"
      width={meta.w}
      height={meta.h}
      decoding="async"
      loading={varyant === "hero" ? "lazy" : "eager"}
      fetchPriority={varyant === "header" ? "high" : "auto"}
      className={className}
    />
  );
}
