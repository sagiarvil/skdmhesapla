# Plan 28 — Sihirbaz: İnsan Dili + Claude Teması (Tam Yeniden Yazım)

Karar: Claude'un prototip dilini ve temasını alıyoruz; sizin mimarinizi (10 katman, register'lar,
QC kapıları, FieldHelp beşlisi, mühürleme motoru, taslak kaydı) aynen koruyoruz. Prototipteki kural
ihlalleri (2.400 ₺ metni, 3 sektörlü triyaj, prompt(), emoji) alınmadı.

## Değişen tek dosya

| Verilen dosya | Repodaki hedef |
|---|---|
| `yeni-SkdmWizard-v2.tsx` | `src/components/wizard/SkdmWizard.tsx` (tam değiştir) |

Başka hiçbir dosyaya dokunulmaz: register tabloları, FieldHelp, hesap motoru, mühürleme,
session-store aynen çalışır; tüm prop imzaları korundu.

## Neler değişti

**Dil (tamamı Claude'un tonunda):**
- Adım adları: "Başlangıç / Firma ve tesis / Ne satıyorsunuz / Üretim adımları / Enerji ve yakıt /
  Üretim miktarı / Hammaddeler / Doğrulayıcı / Karbon bedeli / Belgeler / Özet ve mühür"
- "A.4(a)", "B_EmInst", "bubble approach" gibi teknik kodlar arayüzden kaldırıldı (veri modelinde durur).
- Başlıklar konuşma dili: "Fabrikanız neyle çalışıyor?", "Bu dönem ne kadar ürettiniz, nereye gitti?"
- Kontrol mesajı: "X ton'un nereye gittiği belirsiz — ihracat, fabrika içi kullanım veya stok
  kalemlerinden birine eklemeniz gerekebilir." (teknik "(e) Kontrol: (b+c+d)≠(a)" kaldırıldı)
- E_PurchPrec kontrolü de insan diliyle.
- CTA tek dili: "Devam edelim →" / "← Geri" / "Özete geçelim →".
- "Hazırlık skoru" → "Dosyanızın doluluk oranı"; veri yoksa "—" + açıklama.
- Kenar paneli: "Şu anda eksik olanlar" (eylem düğmeleriyle) + "Neredesiniz?" (Firestore/localStorage
  jargonu kaldırıldı → "Taslağınız otomatik kaydediliyor").
- Mühür ekranı: geliştirici notu ("ödeme entegrasyonu bu planda yok") kaldırıldı; yerine
  "aynı dosyada düzeltme ve yeniden mühürleme ücretsizdir" taahhüdü.

**Tema (Claude paleti, sihirbaz kapsamında):**
- Kağıt zemin #FBF9F4, mürekkep #2B2A24, zeytin #4E5F35/#6B7F4A, kil #BD6A3E vurguları.
- Adım izi: teknik numaralı kutular yerine ince renk şeritleri + "Adım · 3 / 11" satırı.
- Renkler sihirbaz bileşenine gömülü (T nesnesi) — global token'lara ve sitenin geri kalanına
  dokunulmuyor; site geneli tema geçişine ayrıca karar verebilirsiniz.

**Korunanlar:**
- Kademe B bandı (ISO 14067 uyarısı), 20 Türkçe slug eşlemesi, skor kapısı (hasRealInput),
  mühürleme + /api/seal akışı, 10 sn otomatik taslak, delegasyon kopyalama düğmeleri.

## Uygulama

1. Dosyayı `src/components/wizard/SkdmWizard.tsx` üzerine kopyala.
2. `npm run build` (tip hatası çıkarsa bana bildirin — prop imzaları korunmuş olmalı).
3. `firebase deploy --only hosting:skdmhesapla`
4. `git add -A && git commit -m "Plan 28: sihirbaz insan dili + tema" && git push`
5. Canlı doğrulama: /hesapla/demir-celik/ → adım şeritleri, kağıt zemin, "Devam edelim →",
   boşken doluluk "—"; /hesapla/batarya/ → ISO 14067 bandı.

## Bilinçli yapılmayanlar

- Alan bazlı delegasyon linki (üretim müdürüne tek-alan linki): backend gerektirir; mevcut
  "Talep metnini kopyala" düğmeleri korundu, link özelliği Paddle sonrası faza bırakıldı.
- Site geneli tema geçişi (ana sayfa, rehber vb. de zeytin paletine): kapsam patlamasını önlemek
  için sihirbazla sınırlı tutuldu; isterseniz Plan 29 olarak token seviyesinde ele alınır.
