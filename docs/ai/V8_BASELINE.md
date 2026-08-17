# V8 PHASE 0 — BASELINE (2026-08-17)

Kaynak: canlı repo `main` @ `513c9ff` ve `data/seo` + `public/` envanteri.

## routes

- SEO registry: `data/seo/registry.json` (V7.1). Indexable owner URL’ler mevcut.
- `/tedarikci-verisi/hazirla/` = REDIRECTED → `/karbon-raporu/` (Plan 35). V8 örnek listedeki hazirla URL’si canlı hedef değildir.

## llms

- `public/llms.txt` manuel/generator karışımı V7 çıktısı.
- GAP-01: blockquote `P3_INTEROPERABILITY_NOT_GOOGLE_RANKING`.
- GAP-02: raw `- https://… — title` listesi.
- GAP-03: `agents1` + `cursor-is-emri` public source map’te.
- GAP-04: training crawler cümlesi llms gövdesinde.
- `public/llm.txt` ikinci dosya (pointer). Hedef: 301 → `/llms.txt`.
- `llms-full.txt` yok.

## robots

- Search allow / training disallow V8 ile zaten uyumlu (`config.crawlerPolicy`).
- SSOT dağınıktı: `config.json` vs üretilmiş `robots.txt`.

## markdown

- Yok. `rel=alternate type=text/markdown` yok.

## schema

- Page-role `@graph` `src/lib/seo/jsonld.ts`.
- FORBIDDEN: FAQPage, HowTo, AggregateRating.
- Speakable/QAPage/Product yoktu; global injection yok.
- `/karbon-raporu/` SoftwareApplication+Offer (mühür fiyatı) — görünür PCF fiyatı değil; V8 fake Offer riski.

## WAF

- Hosting: Firebase Hosting (`skdmhesapla`). Repo içinde Cloudflare WAF/verified-bot kuralı yok.
- UA spoof curl bot kimliği doğrulamaz.

## headers

- `firebase.json`: sitemap + global CSP. Markdown/llms Content-Type ve X-Robots-Tag yoktu.
