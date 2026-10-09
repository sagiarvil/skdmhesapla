import { SeoPageRecord } from './registry.types';

export const SEO_REGISTRY: Record<string, SeoPageRecord> = {
  '/': {
    route: '/',
    locale: 'tr-TR',
    role: 'home',
    indexDirective: 'index, follow',
    canonicalRoute: '/',
    title: 'SKDM Hesaplama & CBAM Karbon Vergi Analiz Platformu | SKDMHesapla',
    metaDescription: 'Türk ihracatçısı ve sanayicisi için AB Sınırda Karbon Düzenleme Mekanizması (SKDM / CBAM) emisyon hesaplama, veri toplama ve denetime hazırlık altyapısı.',
    h1: 'SKDM / CBAM Karbon Emisyonu Hesaplama ve Uyum Altyapısı',
    primaryIntent: 'skdm hesaplama ve cbam uyum platformu',
    primaryEntity: {
      id: 'https://skdmhesapla.com/#organization',
      name: 'SKDMHesapla',
      type: 'Organization',
      sameAs: [
        'https://drfin.com.tr',
        'https://excelarsiv.com',
        'https://karbonfiyat.com',
        'https://inversioncore.com',
        'https://belginkuyumculuk.com',
        'https://saatchi.com.tr',
        'https://dilekceyazdir.com.tr',
        'https://htmlandhtml.com',
        'https://degerlet.com'
      ]
    },
    semanticTriples: [
      {
        subject: 'SKDMHesapla',
        predicate: 'providesService',
        object: 'CBAM Emisyon Hesaplama ve Doğrulama Hazırlığı'
      },
      {
        subject: 'SKDMHesapla',
        predicate: 'compliesWith',
        object: 'EU Regulation 2023/956'
      }
    ],
    heroAnswerEngine: 'SKDMHesapla, Türk imalat sanayisi ve ihracatçıları için AB Sınırda Karbon Düzenleme Mekanizması (CBAM) doğrudan ve dolaylı emisyon hesaplamalarını, precursor veri izlenebilirliğini ve AB ithalatçılarına teslim edilecek XML/Excel rapor setlerini deterministik algoritmalarla eksiksiz hazırlayan dijital denetim çalışma platformudur.',
    publishedAt: '2026-01-01T00:00:00Z',
    modifiedAt: '2026-10-01T00:00:00Z',
    bodyContentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    llmSubGraphRoute: '/llms/pages/home.md',
    mobileSubGraphRoute: '/llms/mobile/home.md',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: 'https://skdmhesapla.com/' }
    ],
    mobile: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, minimum-scale=1, maximum-scale=5',
      primaryAction: 'form',
      bottomNavEnabled: true,
      thumbZonePosition: 'bottom-center',
      touchTargetsValidated: true,
      horizontalScrollFree: true,
      thumbSafeHeroAnswer: true,
      voiceQueryPatterns: [
        'SKDM hesaplama nasıl yapılır?',
        'CBAM karbon vergisi nedir?',
        'AB sınırda karbon düzenlemesi raporu nasıl hazırlanır?'
      ],
      speakableSelectors: [
        '.hero-answer-engine',
        'h1'
      ],
      pwaInstallable: true
    },
    mobileCwvBudget: {
      lcpMs: 1500,
      inpMs: 50,
      cls: 0.01,
      ttfbMs: 100,
      htmlKb: 30
    }
  }
};
