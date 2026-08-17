"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { cancelStableScroll, consumeQueuedFieldScroll, stableScrollTo, stableScrollToField } from "@/lib/ui/stable-scroll";

type Props = {
  activeKey: string | number;
  children: ReactNode;
  behavior?: "auto" | "smooth";
  focus?: boolean;
  skipInitial?: boolean;
  className?: string;
};

export function FlowViewport({
  activeKey,
  children,
  behavior = "smooth",
  focus = true,
  skipInitial = true,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      if (skipInitial) return;
    }

    const queued = consumeQueuedFieldScroll();
    if (queued) {
      void stableScrollToField(queued.fieldId, queued.options);
    } else if (ref.current) {
      void stableScrollTo(ref.current, {
        behavior,
        focus,
      });
    } else {
      return;
    }

    return () => {
      cancelStableScroll();
    };
  }, [activeKey, behavior, focus, skipInitial]);

  return (
    <div
      ref={ref}
      data-flow-viewport
      data-scroll-target
      data-controlled-scroll-root
      tabIndex={-1}
      className={className}
    >
      {children}
    </div>
  );
}
