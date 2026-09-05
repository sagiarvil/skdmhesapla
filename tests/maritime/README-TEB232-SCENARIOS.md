# TEB232 Maritime Scenario Matrix

Bu test paketi üretim kimlik doğrulamasını bypass etmez ve canlı kullanıcı hesabına veri yazmaz. `teb232@gmail.com` test kimliği altında denizcilik hesap motorunu, kapsam kararlarını ve verifier-readiness kalite kapısını deterministik senaryo verileriyle doğrular.

Kapsanan senaryolar:

1. 2026 / 18.500 GT cargo: EU MRV + EU ETS + FuelEU Maritime kapsamda.
2. 1.200 GT general cargo: MRV kapsamda, ETS/FuelEU kapsam dışı.
3. 8.000 GT offshore: 2026 ETS dışı, 2027 ETS kapsamda.
4. ISM/DOC şirketinde formal mandate yoksa otomatik geçiş engellenir.
5. Eksiksiz dosya %100 internal readiness ve `ready` durumuna ulaşır.
6. Karışık rota coğrafyasında ETS %50/%100 ve FuelEU coğrafi ağırlıkları hesaplanır.
7. BDN/evidence eksikliği verifier-readiness kapısını bloke eder.
8. 2025 ETS hesabında yalnız CO2 ve %70 phase-in uygulanır.

Bu testin geçmesi akredite verifier onayı veya resmî Document of Compliance anlamına gelmez; yalnızca SKDMhesapla iç hesap ve hazırlık motorunun beklenen deterministik davranışını doğrular.
