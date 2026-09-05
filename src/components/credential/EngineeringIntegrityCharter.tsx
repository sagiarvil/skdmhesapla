import React from "react";
import Link from "next/link";
import {
  Cpu,
  ShieldCheck,
  Binary,
  ArrowRight,
  FileCode2,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import { credential } from "@/lib/skdm/credential";

export function EngineeringIntegrityCharter() {
  return (
    <section
      className="border-b border-line bg-gradient-to-b from-white via-slate-50/50 to-white py-14 sm:py-20"
      aria-labelledby="charter-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Başlık ve Mühendislik Deklarasyonu */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/15 bg-slate-900 px-3.5 py-1 text-xs font-black uppercase tracking-[0.14em] text-white shadow-xs">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            MÜHENDİSLİK TAAHHÜDÜ &amp; METODOLOJİ SÖZLEŞMESİ
          </div>
          <h2
            id="charter-heading"
            className="mt-4 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl"
          >
            Yapay zeka tahmini yok.{" "}
            <span className="text-brand-900">
              Deterministik kural motoru ve açık formül izi.
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-ink-700">
            SKDMHesapla olasılıksal üretim veya yapay zeka serbestliğiyle değil; Avrupa Birliği
            tüzükleri, GHG Protocol ve ISO 14064-1 standartlarına harfiyen bağlı deterministik
            mühendislik modelleriyle çalışır.
          </p>
        </div>

        {/* 3 Ana Mühendislik Sütunu */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Sütun 1: Deterministik Kural Motoru */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs hover:border-brand-800/40 hover:shadow-md transition-all">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-emerald-400 shadow-sm">
                <Binary className="h-6 w-6" />
              </div>
              <span className="mt-4 inline-block text-[11px] font-black uppercase tracking-wider text-slate-500 font-mono">
                SÜTUN 01 · DETERMINISTIC ENGINE
              </span>
              <h3 className="mt-1 text-lg font-black text-ink-900">
                Sıfır Halüsinasyon, %100 Kesin Matematik
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">
                Sistem bir dil modeli (LLM) veya tahmini metin üreticisi değildir. Her hesaplama;
                Tüzük (AB) 2023/956 Ek IV, Uygulama Tüzüğü (AB) 2025/2547 ve EMSA kurallarına göre
                kodlanmış kesin matematiksel fonksiyonlardır. Girdi verisi aynı kaldığı sürece sonuç
                1 bit dahi değişmez.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Her satırın matematiksel ispat kütüğü
              </span>
            </div>
          </div>

          {/* Sütun 2: Kıdemli Mühendislik Gözetimi */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs hover:border-brand-800/40 hover:shadow-md transition-all">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-sm">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <span className="mt-4 inline-block text-[11px] font-black uppercase tracking-wider text-brand-700 font-mono">
                SÜTUN 02 · HUMAN GOVERNANCE
              </span>
              <h3 className="mt-1 text-lg font-black text-ink-900">
                Uzman Mühendislik &amp; Metodoloji Denetimi
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">
                Emisyon faktörleri, kütle-enerji denkliği formülleri ve 10 katmanlı kalite kontrol
                kapıları (QC); {credential.holder.name} ({credential.credential.standard} Metodoloji
                Sorumlusu) koordinasyonunda çevre mühendisliği disipliniyle geliştirilmiştir.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <Link
                href={credential.holder.profileUrl}
                className="inline-flex items-center gap-1.5 text-xs font-black text-brand-900 hover:text-brand-700"
              >
                <span>Uzmanlık künyesini ve sertifikayı incele</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Sütun 3: SHA-256 Kriptografik Mühür */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs hover:border-brand-800/40 hover:shadow-md transition-all">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-900 text-emerald-300 shadow-sm">
                <FileCode2 className="h-6 w-6" />
              </div>
              <span className="mt-4 inline-block text-[11px] font-black uppercase tracking-wider text-emerald-700 font-mono">
                SÜTUN 03 · CRYPTOGRAPHIC AUDIT TRAIL
              </span>
              <h3 className="mt-1 text-lg font-black text-ink-900">
                Değiştirilemez Kriptografik Denetim İzi
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">
                Üretilen resmi Communication Template (Excel), durum raporu (PDF) ve THETIS XML
                çıktıları; tekil SHA-256 hash imzalarıyla kilitlenir. Bağımsız akredite denetçiler
                (DNV, Bureau Veritas vb.), kendilerine sunulan dosyanın bütünlüğünü tek hash ile
                anında doğrular.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Root SHA-256 bütünlük manifestosu
              </span>
            </div>
          </div>
        </div>

        {/* Alt Mühendislik Notu */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-xs font-medium text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              <strong>Mühendislik Standartları:</strong> Regulation (EU) 2023/956 · Commission Implementing Regulation (EU) 2025/2547 · ISO 14064-1:2018 · EMSA THETIS-MRV Schema v2
            </span>
          </div>
          <Link
            href="/metodoloji/"
            className="shrink-0 font-bold text-brand-900 underline hover:text-brand-700"
          >
            25 Maddelik Metodoloji Kütüğünü Gör →
          </Link>
        </div>
      </div>
    </section>
  );
}
