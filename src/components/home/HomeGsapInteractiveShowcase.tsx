'use client';

import React from 'react';
import { SpotlightCard } from '@/components/react-bits';
import { Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { LayeredHeading } from '@/components/ui/LayeredHeading';

export function HomeGsapInteractiveShowcase() {
  const capabilities = [
    {
      title: '72-73 Demir & Çelik',
      code: 'CN 7208 / 7214',
      badge: 'Doğrudan + Dolaylı',
      desc: 'Sinter, pik demir, DRI ve ark ocaklı tesis emisyon sınırları; hurda girdi faktörleri ve elektrot payı.',
      href: '/hesapla/demir-celik/',
      color: 'rgba(20, 105, 75, 0.2)',
    },
    {
      title: '76 Alüminyum & Ekstrüzyon',
      code: 'CN 7604 / 7606',
      badge: 'Ek-II Elektrik Muafiyeti',
      desc: 'Külçe, profil, folyo ve biyet hatlarında öncül madde zinciri ve Türkiye elektrik şebeke faktörü muafiyeti.',
      href: '/hesapla/aluminyum/',
      color: 'rgba(8, 145, 178, 0.2)',
    },
    {
      title: '2523 Çimento & Klinker',
      code: 'CN 2523.10 / 2523.29',
      badge: 'Yüksek Emisyon Payı',
      desc: 'Kalsinasyon prosesi ve klinker oranı; akredite doğrulayıcıya hazır resmi Communication Template çıktısı.',
      href: '/hesapla/cimento/',
      color: 'rgba(217, 119, 6, 0.2)',
    },
  ];

  return (
    <section className="border-b border-line bg-gradient-to-b from-[#f8faf7] to-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-800/20 bg-white px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-900 shadow-xs mb-3">
            <Zap className="h-3.5 w-3.5 text-brand-700" />
            Canlı Sektör Karar Motorları
          </div>
          <LayeredHeading
            watermark="Sektörler."
            title="Fabrikanız İçin Kesin Dönem Hesaplama Mimarisi"
            description="AB 2025/2547 metodolojisi ve doğrulanmış öncül madde katsayılarıyla tesis verinizi anında mühürlü rapora dönüştürün:"
          />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <SpotlightCard
              key={cap.title}
              spotlightColor={cap.color}
              className="flex flex-col justify-between p-5 rounded-2xl border-2 border-brand-800/15 bg-white transition-all hover:border-brand-800/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-ink-600 mb-2">
                  <span className="font-mono font-bold">{cap.code}</span>
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-900">
                    {cap.badge}
                  </span>
                </div>
                <h3 className="text-lg font-black text-ink-900">{cap.title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-ink-700">
                  {cap.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={cap.href}
                  className="inline-flex items-center gap-1 text-xs font-black text-brand-800 hover:text-brand-900 transition"
                >
                  Hesaplama Modelini Aç <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  2026 Uyumlu
                </span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
