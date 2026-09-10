# SKDMHesapla — Hesaplama Metodolojileri ve Formül Mimarisi (Methodology Sub-graph)

> **Semantik Kimlik (RDF Entity):**
> - Özne (Subject): https://skdmhesapla.com/metodoloji/#article
> - Normatif Dayanak (Normative Basis): AB 2023/956, AB 2025/2547, ISO 14064-1, ISO 14067
> - Sistem Sınırı (System Boundary): Beşikten-kapıya (Cradle-to-Gate), Tesis ve Üretim Süreci
> - Uygulama Dönemi (Application Period): 2026 Kesin Dönem (Definitive Period)

## 1. Özgül Gömülü Emisyon (SEE - Specific Embedded Emissions)
AB CBAM kesin döneminde birim ürün başına gömülü emisyon (tCO2e / ton ürün) şu bileşenlerden oluşur:

$$\text{SEE} = \text{SEE}_{\text{dir}} + \text{SEE}_{\text{indir}} + \text{SEE}_{\text{prec}}$$

- **SEE_dir (Doğrudan Emisyonlar):** Tesis sınırları içinde yakıt yakma, kalsinasyon veya kimyasal proses kaynaklı emisyonlar (Kapsam 1).
- **SEE_indir (Dolaylı Emisyonlar):** Üretim sürecinde tüketilen şebeke veya otoprodüktör elektriği kaynaklı emisyonlar (Kapsam 2). Demir-çelik, alüminyum ve hidrojen sektörlerinde dolaylı emisyonlar CBAM kapsamı dışındadır (özel kurallar hariç); çimento ve gübrede zorunludur.
- **SEE_prec (Öncül Madde Emisyonları):** Ürünün üretiminde girdi olarak kullanılan ve kendisi de CBAM kapsamında olan maddelerin getirdiği emisyonlar (Kapsam 3 - Gömülü tedarikçi emisyonları).

## 2. Neden Varsayılan ve Genel LCA Değerleri Reddedilir?
Geçiş döneminde (2023-2025) izin verilen varsayılan (default) değer kullanımı, 2026 kesin dönemiyle birlikte sıkı kurallara bağlanmıştır:
- Genel veya ulusal LCA veri tabanı ortalamaları kabul edilmez.
- Tesisin gerçek faaliyet verileri (fatura, sayaç, kütle dengesi, laboratuvar analizleri) bulunmak zorundadır.
- Girdi verisi eksikse veya kanıtlanamıyorsa hesap motoru "mühürlü teslim" durumuna geçişi kilitler.

## 3. 50 Ton De Minimis Muafiyeti Kuralı
- Eşik kuralı: İlgili takvim yılında AB ithalatçısının tüm tedarikçilerden yaptığı toplam CBAM ithalatının kütlesel olarak 50 tonun altında kalması durumudur.
- Elektrik ve hidrojen sektörleri de minimis muafiyetine tabi değildir.
- Türk ihracatçının tek başına 50 ton altında ürün göndermesi muafiyet garantisi sağlamaz; belirleyici eksen AB ithalatçısının yıllık konsolide CBAM toplamıdır.

## 4. Kriptografik Paket Mühürleme (SHA-256)
Hesaplama tamamlandığında üretilen 12 dosyalık paket (hesap izi, kanıt matrisi, girdi envanteri, Communication Template Excel çıktısı, yönetici özeti vb.) SHA-256 algoritmasıyla özetlenir. Paketin herhangi bir dosyasında tek bir karakter değişirse mühür doğrulaması başarısız olur.
