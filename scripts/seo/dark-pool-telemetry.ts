import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");

export interface TelemetryReport {
  vector1_queryFanout: boolean;
  vector2_citationVolatility: boolean;
  vector3_crawlerPolicy: boolean;
  vector4_renderRetrievalGap: boolean;
  vector5_entityDrift: boolean;
  vector6_agentActionFriction: boolean;
  violations: string[];
}

export function runDarkPoolTelemetry(): TelemetryReport {
  console.log("\n🔭 [DARK-POOL-TELEMETRY] 6-Area Black-Box & Dark Pool Audit Starting...");
  const violations: string[] = [];

  // ==========================================
  // Vector 1: Query Fanout Coverage
  // ==========================================
  console.log("  → Checking Vector 1: Query Fanout Coverage...");
  const partnerMdPath = path.join(ROOT, "public/llms/pages/partner-network.md");
  const buyerMdPath = path.join(ROOT, "public/llms/pages/eu-importers.md");

  if (!fs.existsSync(partnerMdPath)) {
    violations.push("[V1 FANOUT] public/llms/pages/partner-network.md missing");
  } else {
    const partnerContent = fs.readFileSync(partnerMdPath, "utf8");
    const requiredPartnerTopics = [
      "Customs Brokers",
      "Non-Poaching",
      "Communication Template",
      "Verifier Dossier",
      "precursor",
      "kütle dengesi",
      "2025/2547",
    ];
    for (const topic of requiredPartnerTopics) {
      if (!partnerContent.toLowerCase().includes(topic.toLowerCase())) {
        violations.push(`[V1 FANOUT] partner-network.md missing sub-query fanout topic: "${topic}"`);
      }
    }
  }

  if (!fs.existsSync(buyerMdPath)) {
    violations.push("[V1 FANOUT] public/llms/pages/eu-importers.md missing");
  } else {
    const buyerContent = fs.readFileSync(buyerMdPath, "utf8");
    const requiredBuyerTopics = [
      "CN 7308",
      "CN 7318",
      "CN 7610",
      "mass-balance",
      "Communication Template",
      "Regulation (EU) 2023/956",
      "Implementing Regulation (EU) 2025/2547",
      "50-tonne",
    ];
    for (const topic of requiredBuyerTopics) {
      if (!buyerContent.toLowerCase().includes(topic.toLowerCase())) {
        violations.push(`[V1 FANOUT] eu-importers.md missing sub-query fanout topic: "${topic}"`);
      }
    }
  }

  // ==========================================
  // Vector 2: Citation Volatility Elimination
  // ==========================================
  console.log("  → Checking Vector 2: Citation Volatility Elimination (Numerical & Factual Density)...");
  if (fs.existsSync(partnerMdPath) && fs.existsSync(buyerMdPath)) {
    const combined = fs.readFileSync(partnerMdPath, "utf8") + " " + fs.readFileSync(buyerMdPath, "utf8");
    const requiredFactualAnchors = [
      "2023/956",
      "2025/2547",
      "2025/2083",
      "SHA-256",
    ];
    for (const anchor of requiredFactualAnchors) {
      if (!combined.includes(anchor)) {
        violations.push(`[V2 CITATION] Missing deterministic factual anchor in deep surfaces: "${anchor}"`);
      }
    }
    if (
      !combined.includes("0.01%") &&
      !combined.includes("0,01%") &&
      !combined.includes("0.01\\%") &&
      !combined.includes("0,01\\%")
    ) {
      violations.push('[V2 CITATION] Missing mass-balance tolerance (0.01% / 0,01%) in deep surfaces');
    }
  }

  // ==========================================
  // Vector 3: Crawler Policy Divergence
  // ==========================================
  console.log("  → Checking Vector 3: Crawler Policy Divergence (Robots & Edge Routing)...");
  const robotsPath = path.join(ROOT, "public/robots.txt");
  if (!fs.existsSync(robotsPath)) {
    violations.push("[V3 CRAWLER] public/robots.txt missing");
  } else {
    const robots = fs.readFileSync(robotsPath, "utf8");
    const requiredSearchBots = [
      "Googlebot",
      "Bingbot",
      "OAI-SearchBot",
      "Claude-SearchBot",
      "PerplexityBot",
    ];
    for (const bot of requiredSearchBots) {
      if (!robots.includes(`User-agent: ${bot}`)) {
        violations.push(`[V3 CRAWLER] robots.txt missing explicit declaration for search crawler: ${bot}`);
      }
    }
    if (robots.includes("Disallow: /_next/")) {
      violations.push("[V3 CRAWLER] robots.txt contains forbidden Disallow: /_next/ rule");
    }
  }

  // ==========================================
  // Vector 4: Render-Retrieval Gap (14KB AST Budget)
  // ==========================================
  console.log("  → Checking Vector 4: Render-Retrieval Gap (14.336-byte AST Window)...");
  if (fs.existsSync(OUT_DIR)) {
    const testPages = ["partner-network/index.html", "eu-importers/index.html"];
    for (const relPage of testPages) {
      const fullPath = path.join(OUT_DIR, relPage);
      if (fs.existsSync(fullPath)) {
        const rawHtml = fs.readFileSync(fullPath, "utf8");
        const initialWindow = rawHtml.slice(0, 14336);

        if (!initialWindow.includes("<h1")) {
          violations.push(`[V4 RENDER-GAP] ${relPage}: <h1> tag missing from first 14.336 bytes`);
        }
        if (!initialWindow.includes("application/ld+json")) {
          violations.push(`[V4 RENDER-GAP] ${relPage}: JSON-LD @graph missing from first 14.336 bytes`);
        }
        if (!initialWindow.includes('rel="canonical"')) {
          violations.push(`[V4 RENDER-GAP] ${relPage}: Canonical link missing from first 14.336 bytes`);
        }
      }
    }
  }

  // ==========================================
  // Vector 5: Entity Identity Drift
  // ==========================================
  console.log("  → Checking Vector 5: Entity Identity Drift (Wikidata QID Grounding)...");
  const jsonLdSourcePath = path.join(ROOT, "src/lib/seo/jsonld.ts");
  if (!fs.existsSync(jsonLdSourcePath)) {
    violations.push("[V5 ENTITY] src/lib/seo/jsonld.ts missing");
  } else {
    const jsonLdCode = fs.readFileSync(jsonLdSourcePath, "utf8");
    const requiredQids = [
      "Q114092496", // CBAM
      "Q105658602", // EU ETS
      "Q118228308", // FuelEU Maritime
    ];
    for (const qid of requiredQids) {
      if (!jsonLdCode.includes(qid)) {
        violations.push(`[V5 ENTITY] jsonld.ts missing Wikidata consensus anchor: ${qid}`);
      }
    }
  }

  // ==========================================
  // Vector 6: Agent Action Friction
  // ==========================================
  console.log("  → Checking Vector 6: Agent Action Friction (Agent Card & OpenAPI Contracts)...");
  const agentCardPath = path.join(ROOT, "public/.well-known/agent-card.json");
  const openApiPath = path.join(ROOT, "public/openapi.json");

  if (!fs.existsSync(agentCardPath)) {
    violations.push("[V6 AGENT] public/.well-known/agent-card.json missing");
  } else {
    try {
      const card = JSON.parse(fs.readFileSync(agentCardPath, "utf8"));
      if (card["@context"] !== "https://agent-protocol.org/v1" || card["@type"] !== "AgentCard") {
        violations.push("[V6 AGENT] agent-card.json does not conform to Agent Protocol v1.0 standard");
      }
      const caps = Object.keys(card.capabilities || {});
      if (caps.length < 3) {
        violations.push(`[V6 AGENT] agent-card.json specifies only ${caps.length} capabilities, minimum 3 required`);
      }
    } catch (e) {
      violations.push(`[V6 AGENT] agent-card.json JSON parse error: ${String(e)}`);
    }
  }

  if (!fs.existsSync(openApiPath)) {
    violations.push("[V6 AGENT] public/openapi.json missing");
  } else {
    try {
      const openapi = JSON.parse(fs.readFileSync(openApiPath, "utf8"));
      if (!openapi.openapi || !openapi.paths || Object.keys(openapi.paths).length < 2) {
        violations.push("[V6 AGENT] openapi.json incomplete, missing API paths or valid spec version");
      }
    } catch (e) {
      violations.push(`[V6 AGENT] openapi.json JSON parse error: ${String(e)}`);
    }
  }

  // Final Summary
  const passed = violations.length === 0;
  if (passed) {
    console.log("✅ [DARK-POOL-TELEMETRY] All 6 Black-Box Vectors 100% STABLE and VERIFIED.");
  } else {
    console.error("❌ [DARK-POOL-TELEMETRY] Violations detected:");
    for (const v of violations) console.error(`   - ${v}`);
  }

  return {
    vector1_queryFanout: !violations.some((v) => v.startsWith("[V1")),
    vector2_citationVolatility: !violations.some((v) => v.startsWith("[V2")),
    vector3_crawlerPolicy: !violations.some((v) => v.startsWith("[V3")),
    vector4_renderRetrievalGap: !violations.some((v) => v.startsWith("[V4")),
    vector5_entityDrift: !violations.some((v) => v.startsWith("[V5")),
    vector6_agentActionFriction: !violations.some((v) => v.startsWith("[V6")),
    violations,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runDarkPoolTelemetry();
  if (result.violations.length > 0) {
    process.exit(1);
  }
}
