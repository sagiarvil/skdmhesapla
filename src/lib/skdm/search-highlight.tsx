/**
 * Arama sonucu vurgusu — eşleşen öbek kırmızı mark.
 * Durum rengi değil; yalnızca sorgu eşleşmesi için kullanılır.
 */
import { Fragment, type ReactNode } from "react";

export const SEARCH_HIT_CLASS =
  "rounded-[3px] bg-red-100 px-0.5 font-extrabold text-red-700 underline decoration-red-500/40";

export function splitByQuery(
  text: string,
  query: string
): { text: string; hit: boolean }[] {
  const q = query.trim();
  if (!q || !text) return [{ text, hit: false }];

  const lower = text.toLocaleLowerCase("tr");
  const needle = q.toLocaleLowerCase("tr");
  const parts: { text: string; hit: boolean }[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const idx = lower.indexOf(needle, cursor);
    if (idx === -1) {
      parts.push({ text: text.slice(cursor), hit: false });
      break;
    }
    if (idx > cursor) {
      parts.push({ text: text.slice(cursor, idx), hit: false });
    }
    parts.push({ text: text.slice(idx, idx + needle.length), hit: true });
    cursor = idx + needle.length;
  }

  return parts.length ? parts : [{ text, hit: false }];
}

/** React metin vurgusu */
export function HighlightText({
  text,
  query,
}: {
  text: string;
  query: string;
}): ReactNode {
  const parts = splitByQuery(text, query);
  if (parts.length === 1 && !parts[0]!.hit) return text;

  return parts.map((p, i) =>
    p.hit ? (
      <mark key={i} className={SEARCH_HIT_CLASS} data-ara-hit="1">
        {p.text}
      </mark>
    ) : (
      <Fragment key={i}>{p.text}</Fragment>
    )
  );
}

/** DOM: önceki vurguları kaldır */
export function clearDomHighlights(root: HTMLElement) {
  root.querySelectorAll("mark[data-ara-hit]").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent ?? ""), mark);
    parent.normalize();
  });
}

/** DOM: yaprak metin düğümlerinde sorguyu kırmızı mark ile sar */
export function highlightDomMatches(root: HTMLElement, query: string) {
  clearDomHighlights(root);
  const q = query.trim();
  if (!q) return;

  const needle = q.toLocaleLowerCase("tr");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "MARK") {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const node of textNodes) {
    const raw = node.textContent ?? "";
    const lower = raw.toLocaleLowerCase("tr");
    if (!lower.includes(needle)) continue;

    const frag = document.createDocumentFragment();
    let cursor = 0;
    while (cursor < raw.length) {
      const idx = lower.indexOf(needle, cursor);
      if (idx === -1) {
        frag.appendChild(document.createTextNode(raw.slice(cursor)));
        break;
      }
      if (idx > cursor) {
        frag.appendChild(document.createTextNode(raw.slice(cursor, idx)));
      }
      const mark = document.createElement("mark");
      mark.setAttribute("data-ara-hit", "1");
      mark.className = SEARCH_HIT_CLASS;
      mark.textContent = raw.slice(idx, idx + needle.length);
      frag.appendChild(mark);
      cursor = idx + needle.length;
    }
    node.parentNode?.replaceChild(frag, node);
  }
}
