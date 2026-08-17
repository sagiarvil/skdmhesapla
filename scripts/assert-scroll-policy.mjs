import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src");

const ALLOWED = new Set([
  path.normalize("src/lib/ui/stable-scroll.ts"),
  path.normalize("src/lib/ui/body-scroll-lock.ts"),
]);

const FORBIDDEN = [
  { re: /\bscrollIntoView\s*\(/, label: "scrollIntoView" },
  { re: /\bwindow\.scrollTo\s*\(/, label: "window.scrollTo" },
  { re: /\bwindow\.scrollBy\s*\(/, label: "window.scrollBy" },
  {
    re: /\b(?:document\.)?body\.style\.overflow\s*=/,
    label: "direct body overflow mutation",
  },
  {
    re: /\b(?:document\.)?body\.style\.position\s*=/,
    label: "direct body position mutation",
  },
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) return walk(full);
    if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) return [];

    return [full];
  });
}

const findings = [];

for (const full of walk(ROOT)) {
  const rel = path.normalize(path.relative(process.cwd(), full));
  if (ALLOWED.has(rel)) continue;

  const text = fs.readFileSync(full, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of FORBIDDEN) {
      if (rule.re.test(line)) {
        findings.push(`${rel}:${index + 1} ${rule.label}\n  ${line.trim()}`);
      }
    }
  });
}

if (findings.length) {
  console.error(
    [
      "SCROLL POLICY FAILED",
      "",
      "Doğrudan scroll/body-lock kullanımı merkezi UI katmanı dışında yasaktır.",
      "stableScrollTo / useBodyScrollLock kullanın.",
      "",
      ...findings,
    ].join("\n"),
  );
  process.exit(1);
}

console.log("SCROLL POLICY PASSED");
