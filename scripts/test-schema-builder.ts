import { SEO_REGISTRY } from '../src/seo/registry.ts';
import { buildCompleteJsonLdGraph } from '../src/seo/schema-builder.ts';

const homePage = SEO_REGISTRY['/'];
if (!homePage) {
    console.error("Home page not found in registry");
    process.exit(1);
}

const jsonLd = buildCompleteJsonLdGraph(homePage, 'skdmhesapla.com');
console.log(jsonLd);
