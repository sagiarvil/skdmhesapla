"use client";

import { useState } from "react";
import { getColumnHelp } from "@/lib/skdm/fieldhelp";

type Props = {
  columnKey: string;
};

/** Register sütun ? paneli — G-21: getColumnHelp sözlük birincil. */
export function RegisterColumnHelp({ columnKey }: Props) {
  const [open, setOpen] = useState(false);
  const help = getColumnHelp(columnKey);
  if (!help) return null;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="ml-1 text-[10px] font-semibold text-accent-teal underline"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        ?
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 w-64 rounded-ctl border border-line bg-white p-3 text-xs text-ink-900 shadow-card">
          <b>{help.title}</b>
          <div className="mt-1 leading-relaxed">{help.content}</div>
        </div>
      )}
    </div>
  );
}
