"use client";

import { useEffect } from "react";
import { track } from "@/lib/skdm/analytics";

export function EuImporterPageTracker() {
  useEffect(() => {
    track("eu_importer_page_view");

    // IntersectionObserver for workflow view
    const workflowSection = document.getElementById("how-it-works");
    if (!workflowSection) return;

    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired) {
            fired = true;
            track("eu_importer_workflow_view");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(workflowSection);
    return () => observer.disconnect();
  }, []);

  return null;
}

export function EuImporterCtaButton({
  href = "#start-collection",
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
      onClick={() => track("eu_importer_primary_cta_click")}
      className={className}
    >
      {children}
    </a>
  );
}
