"use client";

type Props = {
  varyant: "header" | "hero" | "footer";
  className?: string;
};

/** GATE-5 (RM-007): tek statik SVG — tüm varyantlar aynı dosyayı gösterir; GIF kaldırıldı. */
const SRC = {
  header: { src: "/logo/skdm-logo-header.svg", w: 120, h: 120 },
  hero: { src: "/logo/skdm-logo-header.svg", w: 160, h: 160 },
  footer: { src: "/logo/skdm-logo-header.svg", w: 56, h: 56 },
} as const;

/**
 * Header/hero/footer: aynı statik SVG işareti. Animasyon yok — marka her karede aynı,
 * prefers-reduced-motion uyumlu (RM-007 GATE-5).
 */
export function MarkaLogo({ varyant, className = "" }: Props) {
  const meta = SRC[varyant];

  return (
    // eslint-disable-next-line @next/next/no-img-element -- statik SVG <img> ile gösterilir
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
