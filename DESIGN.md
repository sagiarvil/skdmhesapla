# SKDMHesapla Design System Contract

Version: 1.0.0  
Scope: `skdmhesapla.com` public UI, calculator/workflow screens, evidence/package surfaces, responsive behavior, trust architecture and conversion UX  
Status: mandatory project design contract

## 0. Purpose and authority

This file defines the canonical design behavior for SKDMHesapla. It exists to prevent generic green-SaaS styling, visual drift between regulatory pages and the calculator, weak evidence hierarchy, over-marketing of compliance, and mobile breakage in dense technical flows.

SKDMHesapla is not a generic sustainability landing page. It is a structured CBAM/SKDM calculation, data-readiness and evidence workflow for users who must understand scope, enter operational data, calculate results, inspect controls and prepare a traceable output package.

Priority order:

1. Explicit user-approved product/legal truth.
2. `AGENTS1.md` and binding RM-001…004 rules referenced by the project.
3. This `DESIGN.md`.
4. `docs/tasarim-rehberi.md` and current runtime tokens in `src/app/globals.css`.
5. Current reusable components and workflow implementation.
6. External references such as 21st.dev or high-trust financial/regulatory product sites.

External references are inspiration only. Never copy another product's brand identity, artwork, exact copy, palette or signature composition.

---

## 1. Design thesis

### 1.1 Core idea — Regulatory Evidence Workbench

SKDMHesapla should feel like a modern regulatory evidence workbench:

- technical but understandable;
- serious without feeling bureaucratic;
- evidence-led rather than claim-led;
- deterministic and traceable rather than visually theatrical;
- clearly separated into input, calculation, control, evidence and package stages;
- premium through precision, data hierarchy and auditability.

The user journey should visually reinforce:

`scope -> data readiness -> input -> calculation -> control -> evidence -> package -> next obligation`

Avoid:

`green hero -> sustainability slogans -> generic feature cards -> buy now`

### 1.2 First-screen questions

The interface should help the user answer quickly:

1. Is my product/activity in scope?
2. What data do I need?
3. What will the system calculate?
4. What does the output prove or not prove?
5. What is my next action?

---

## 2. Runtime brand system

The current runtime system in `src/app/globals.css` and `docs/tasarim-rehberi.md` is authoritative for visual tokens.

### 2.1 Core color family

Current brand language:

- `--brand-900`: deep olive;
- `--brand-800`: olive variation;
- `--brand-500`: pistachio/lime primary accent;
- `--brand-100`, `--brand-tint`, `--brand-mist`: light brand surfaces;
- `--accent-teal`: information/link accent;
- `--accent-green`: success/validated state;
- `--accent-yellow`: warning/attention state;
- `--ink-900`, `--ink-700`, `--ink-600`: technical text hierarchy;
- `--bg-base` and soft background system for light content.

Rules:

1. Olive/pistachio is the brand identity; do not replace it with generic ESG green.
2. `brand-500` on dark olive uses dark text where the runtime contrast contract requires it.
3. Accent teal/green/yellow are semantic support colors, not competing brand colors.
4. Warnings use yellow/amber semantics; errors/invalid states require explicit text and accessible contrast.
5. Header/hero/footer dark-olive continuity and guilloche treatment must follow the existing design guide.
6. Do not add random gradients or unrelated climate palettes.

### 2.2 Surfaces

Preferred surface rhythm:

- dark olive for high-authority brand/hero/footer surfaces;
- white for primary work/data surfaces;
- soft green/neutral for grouped explanations;
- evidence and result surfaces distinguished by hierarchy, not by excessive color.

A screen should normally expose no more than three simultaneous surface levels.

---

## 3. Typography and data readability

Current contract:

- body/UI: Inter/system sans through existing project setup;
- body scale approximately 16-17px or higher on mobile;
- technical/identifier values may use JetBrains Mono or the current mono token where useful.

Rules:

- one H1 per route;
- headings are concise and operational;
- long regulation text is broken into readable sections;
- numeric results use tabular alignment where possible;
- units (`tCO2e`, `EUR`, `MWh`, tonnes, CN/GTIP code) are never visually separated from meaning;
- do not shrink technical tables below readable mobile text size.

---

## 4. Brand motif and motion

The existing guilloche / security-document motif is meaningful because it supports the evidence/seal identity. It must remain restrained.

Rules:

1. Use only canonical guilloche assets defined by the project.
2. Do not introduce a second decorative background system.
3. Animated logo behavior follows `docs/tasarim-rehberi.md` and reduced-motion rules.
4. Motion must clarify state or brand presence, never distract from regulatory data.
5. Calculation results and validation states must appear immediately; do not delay them with reveal animation.

---

## 5. Component contract

Before creating a component, inspect `src/components` and extend an existing stable primitive where possible.

Core conceptual components:

- site header / regulatory navigation;
- scope checker;
- CN/GTIP search/selection;
- step progress indicator;
- field-help block;
- input group;
- unit/value pair;
- calculation summary;
- readiness score/status;
- validation/control list;
- evidence/source reference block;
- warning/limitation notice;
- package/seal summary;
- pricing/entitlement block;
- FAQ;
- regulatory update card;
- footer.

A new component should represent a durable workflow concept, not a one-page decoration.

### 5.1 Input group

Every input group must answer:

- what data is requested;
- expected unit/format;
- why the data matters;
- source/example when relevant;
- validation/error state;
- whether it is required or conditional.

FieldHelp is the product's usability layer; do not hide it behind tiny icons when explanation is needed to complete the task.

### 5.2 Calculation result

A result is never just a large number.

Recommended structure:

`result label -> value + unit -> status/context -> source/method note -> next action`

If the result depends on missing or default data, that state must be visible next to the result.

### 5.3 Validation and controls

Validation must use both text and color.

Preferred states:

- complete / validated;
- warning / incomplete;
- blocking error;
- informational / not applicable.

Each blocking or warning state should tell the user what to fix, not just what failed.

### 5.4 Evidence block

Evidence blocks may show:

- official/regulatory reference;
- source data category;
- calculation method;
- timestamp/version;
- SHA-256 seal/package fact when actually produced by the system;
- limitation/interpretation.

Never visually imply that a system-generated seal equals official EU approval or verifier certification.

---

## 6. Trust and conversion architecture

This section adapts high-trust product patterns such as intent routing, evidence ladders and contextual CTAs to SKDMHesapla. It does not copy any fintech or compliance brand.

### 6.1 Intent-first routing

Users may arrive with different questions. Primary discovery may route by outcome, for example:

- `Kapsama giriyor muyum?`;
- `Emisyonu nasıl hesaplarım?`;
- `Hangi verileri hazırlamalıyım?`;
- `Doğrulama için ne gerekir?`;
- `Maliyet etkisini görmek istiyorum`;
- `Rapor/paket hazırlamak istiyorum`.

Rules:

1. Users should not need to know internal module names to start.
2. Intent routes resolve to canonical pages/workflows; no duplicate SEO pages for UI convenience.
3. The main navigation should not expose every regulatory article as a primary item.

### 6.2 Audience routing

Audience labels may be used only when they materially alter guidance, for example producer/manufacturer versus trading company where the product flow already supports that distinction.

Do not duplicate the same content under multiple persona labels.

### 6.3 Evidence ladder

High-intent pages should follow:

`question -> rule/scope -> required data -> calculation/workflow -> controls -> evidence -> limitation -> next step`

Product purchase/entitlement should come after the user understands what the system does and does not do.

### 6.4 Trust density

Trust must be distributed across the workflow:

- scope decision -> official reference nearby;
- emission factor/default -> source/version nearby;
- calculation result -> method/readiness nearby;
- seal/package -> content and limitation nearby;
- pricing -> what is included and delivery/output nearby.

Allowed trust facts are only verifiable facts.

Forbidden:

- `resmi onaylı` unless legally true;
- guaranteed compliance;
- guaranteed verifier acceptance;
- fake customer logos or fake usage counts;
- unsupported market-leader claims;
- fake countdown/scarcity.

### 6.5 Contextual CTA hierarchy

Preferred CTA progression:

- discovery: `Kapsamı Kontrol Et`;
- workflow start: `Hesaplamaya Başla`;
- evidence/readiness: `Hazırlık Durumunu Gör` or current approved equivalent;
- final package/purchase: action that accurately names the deliverable.

One decision block normally has one dominant CTA.

### 6.6 Progressive disclosure

Order:

1. user question/outcome;
2. applicable rule/scope;
3. required inputs;
4. calculation/result;
5. evidence and controls;
6. deeper regulation/method detail;
7. package/pricing/next step.

Do not put regulation citations ahead of basic comprehension when a concise summary can safely precede them.

---

## 7. Workflow archetypes

### 7.1 Home

The home page should act as a CBAM decision router, not a corporate sustainability brochure.

Preferred sequence:

`intent -> scope/value proposition -> how the system works -> real workflow/evidence -> trust/legal boundary -> pricing/next step -> updates/knowledge`

### 7.2 Scope/CN page

Preferred sequence:

1. what the check answers;
2. code/product input;
3. result;
4. why it is in/out of scope;
5. official reference;
6. next action.

Out-of-scope results must not push the user into calculation as if scope were confirmed.

### 7.3 Calculation flow

Preferred sequence:

1. step progress;
2. current step purpose;
3. inputs + FieldHelp;
4. validation;
5. step summary;
6. continue action.

The user should always know where they are, what is missing and what happens next.

### 7.4 Result/readiness page

Preferred sequence:

1. primary result;
2. data readiness/quality context;
3. blocking gaps;
4. control/evidence summary;
5. cost or sensitivity where relevant;
6. downloadable/package action;
7. legal limitation.

### 7.5 Regulatory update page

Updates are decision-support content, not news decoration.

Each update should explain:

- what changed;
- effective/applicable date;
- affected user/data/workflow;
- what must be changed in preparation/calculation;
- source link/reference.

---

## 8. Responsive contract — non-negotiable

Verify edited surfaces at minimum at:

- 320px;
- 360px;
- 375px;
- 390px;
- 430px;
- 768px;
- 1024px;
- 1280px;
- 1440px.

Rules:

- no page-level horizontal overflow;
- forms and step indicators must not exceed the viewport;
- long CN/GTIP codes and official URLs must wrap or live inside deliberate local scroll containers;
- tables may scroll locally, never at page level;
- mobile input controls should have at least 44-48px effective touch height;
- sticky actions must respect viewport edges and safe areas;
- do not hide required validation/evidence fields on mobile;
- guilloche/decorative layers must not enlarge document width.

Do not use global overflow masking as proof of responsive correctness.

---

## 9. Accessibility

Target WCAG 2.2 AA or better.

Required:

- semantic form labels;
- visible `:focus-visible` state;
- keyboard-completable workflow;
- error association with the relevant field;
- color + text for status;
- reduced motion;
- readable contrast;
- no hover-only help that blocks mobile users;
- heading hierarchy and landmarks.

---

## 10. Regulatory content discipline

UI wording must distinguish:

- legal requirement;
- system calculation;
- estimate/scenario;
- user-provided data;
- default/reference data;
- validation/readiness;
- official verification/certification.

Never collapse these into a single `uyumlu` claim.

Prefer precise text such as:

- `Bu veri alanı hesaplama için gerekli.`
- `Bu sonuç mevcut girdilerle hesaplanmıştır.`
- `Doğrulama hazırlığı için eksik veri bulunuyor.`

Avoid:

- `AB onaylı`;
- `uyumu garanti eder`;
- `kesin maliyet` when assumptions remain;
- generic sustainability slogans.

---

## 11. Anti-patterns

Reject:

- generic ESG green gradients;
- leaf/globe decoration unrelated to the workflow;
- dark SaaS dashboards as the default visual language;
- oversized glass cards;
- endless badge rows;
- fake official seals;
- dense regulation text without hierarchy;
- long forms without step context;
- result numbers without unit/source/readiness;
- multiple dominant CTAs in one decision block;
- page-level horizontal scrolling;
- copied competitor palette or illustration style.

---

## 12. External reference policy

21st.dev and high-trust regulated/financial products may inspire:

- comparison layouts;
- stepper composition;
- evidence placement;
- intent navigation;
- pricing/entitlement clarity;
- dense mobile data behavior;
- contextual CTA hierarchy.

They must not become runtime dependencies solely for appearance and must not overwrite SKDMHesapla's olive/pistachio, guilloche and evidence-workbench identity.

---

## 13. Production and protected behavior

Do not weaken calculation, evidence, security, payment, SEO or regulatory guards to pass a visual change.

Before changing shared surfaces:

1. identify all consumers;
2. preserve calculation and data contracts;
3. preserve legal wording boundaries;
4. preserve route/canonical/SEO behavior;
5. preserve payment/entitlement behavior;
6. run the existing release gates.

---

## 14. Required validation

For broad UI work, run the applicable project checks, including at minimum:

```bash
npm run build
npm run typecheck
npm run test:quality
```

When workflow, calculation, evidence or payment behavior is touched, also run the corresponding engine/regression/release commands defined in `package.json`, including the relevant `test:engine`, `test:release:v8`, `release:gate:v8`, security and SEO audits.

A visual change is incomplete if it introduces overflow, clipped inputs, misleading compliance claims, broken FieldHelp, invalid calculation behavior, missing evidence context, payment regressions or SEO drift.

---

## 15. Agent execution prompt

For future UI tasks:

> Read `AGENTS1.md`, `DESIGN.md`, `AGENTS.md`, `docs/tasarim-rehberi.md`, the target page/component and `src/app/globals.css` before editing. Preserve binding RM rules, calculation/data contracts and legal claim boundaries. Treat `DESIGN.md` as the canonical visual/UX contract within that hierarchy. Reuse current components and tokens. Use external references only for information architecture, evidence sequencing, comparison and interaction ideas. Keep SKDMHesapla's regulatory evidence-workbench identity, olive/pistachio palette and canonical guilloche system. Design from 320px through large desktop and keep the page free of horizontal overflow. Run the relevant build, quality, engine, security, SEO and release gates before merge.

---

## 16. Definition of done

A SKDMHesapla visual change is done only when:

- it looks native to SKDMHesapla rather than like an imported SaaS template;
- the current olive/pistachio and guilloche system is respected;
- the workflow stage and missing data are obvious;
- calculation, evidence and legal meanings remain distinct;
- trust is factual and near the relevant decision;
- no unsupported compliance claim is introduced;
- mobile has no page-level horizontal overflow;
- FieldHelp and validation remain usable;
- accessibility fundamentals pass;
- calculation/security/payment/SEO contracts remain intact;
- relevant repository gates pass.
