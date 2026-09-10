"use client";

import { useEffect } from "react";
import { track } from "@/lib/skdm/analytics";

export function PartnerPageTracker() {
  useEffect(() => {
    track("partner_page_view");

    // IntersectionObserver for comparison view
    const compSection = document.getElementById("partner-comparison");
    if (!compSection) return;

    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired) {
            fired = true;
            track("partner_comparison_view");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(compSection);
    return () => observer.disconnect();
  }, []);

  return null;
}

export function PartnerCtaButton({
  href = "#partner-form",
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={() => track("partner_primary_cta_click")}
      className={className}
    >
      {children}
    </a>
  );
}
