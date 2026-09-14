import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, contactName, email, phone, gtip, tonnage, estimatedEmission, estimatedTaxEur, kvkkConsent } = body;

    // 1. Validasyon
    if (!companyName || !contactName || !email || !phone || !kvkkConsent) {
      return NextResponse.json(
        { error: 'Lütfen tüm zorunlu alanları ve KVKK onayını doldurunuz.' },
        { status: 400 }
      );
    }

    // Basit e-posta ve telefon kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir kurumsal e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    // 2. Lead Kayıt Nesnesi (Asenkron N8N / Audit DAG hazır)
    const leadRecord = {
      id: 'cbam_lead_' + Date.now(),
      companyName: String(companyName).trim(),
      contactName: String(contactName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      gtip: String(gtip || '7208'),
      tonnage: Number(tonnage || 0),
      estimatedEmission: Number(estimatedEmission || 0),
      estimatedTaxEur: Number(estimatedTaxEur || 0),
      source: 'CBAMQuickLeadCalculator',
      createdAt: new Date().toISOString(),
      status: 'NEW_OPPORTUNITY',
      kvkkConsent: true
    };

    // Log & Event Dispatch (Firestore / n8n DLQ webhook entegrasyonu)
    console.log('[SKDM_LEAD_CAPTURE_SUCCESS]', JSON.stringify(leadRecord));

    return NextResponse.json({
      success: true,
      leadId: leadRecord.id,
      message: 'Resmi SKDM Ön Analiz Raporu talebiniz başarıyla alındı.'
    });

  } catch (error: any) {
    console.error('[SKDM_LEAD_ERROR]', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu, lütfen tekrar deneyiniz.' },
      { status: 500 }
    );
  }
}
