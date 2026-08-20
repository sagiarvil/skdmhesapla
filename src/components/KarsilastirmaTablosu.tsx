import styles from "./KarsilastirmaTablosu.module.css";
import { ISLETMECI } from "@/config/isletmeci";

type Secenek = { id: string; baslik: string; altBaslik?: string; oneCikan?: boolean };
type Satir = { kriter: string; degerler: Record<string, string> };

const SECENEKLER: Secenek[] = [
  { id: "danismanlik", baslik: "Dış danışmanlık", altBaslik: "Proje bazlı hizmet" },
  { id: "abonelik", baslik: "Abonelikli yazılım", altBaslik: "Dönemsel lisans" },
  { id: "skdm", baslik: "SKDMHesapla", altBaslik: "Self-servis çalışma", oneCikan: true },
];

const SATIRLAR: Satir[] = [
  { kriter: "Ödeme biçimi", degerler: { danismanlik: "Teklif üzerine, proje bazlı", abonelik: "Dönemsel abonelik", skdm: `${ISLETMECI.muhurFiyatiEtiket} tek seferlik (KDV dahil)` } },
  { kriter: "Başlangıç süresi", degerler: { danismanlik: "Sağlayıcıya göre değişir", abonelik: "Kurulum ve eğitim adımı içerebilir", skdm: "Belgeler hazırsa aynı oturumda ilerlenebilir" } },
  { kriter: "Düzeltme", degerler: { danismanlik: "Sözleşme kapsamına bağlı", abonelik: "Sağlayıcının lisans koşullarına bağlı", skdm: ISLETMECI.yenidenMuhurlemePolitikasi } },
  { kriter: "Arayüz dili", degerler: { danismanlik: "Sağlayıcıya sorulmalıdır", abonelik: "Sağlayıcıya sorulmalıdır", skdm: "Tamamen Türkçe" } },
  { kriter: "Veri konumu", degerler: { danismanlik: "Sağlayıcıya sorulmalıdır", abonelik: "Sağlayıcıya sorulmalıdır", skdm: `${ISLETMECI.sunucuKonumu} sunucu` } },
  { kriter: "Çıktının niteliği", degerler: { danismanlik: "Danışmanlık hizmetinin kapsamına bağlı", abonelik: "Yazılım lisansının kapsamına bağlı", skdm: "Denetime hazırlık çalışma dosyası — doğrulama görüşü veya gümrük onayı değildir" } },
];

export default function KarsilastirmaTablosu() {
  return (
    <section className={styles.bolum} aria-labelledby="karsilastirma-baslik">
      <div className={styles.icerik}>
        <p className={styles.ustEtiket}>Seçenekler</p>
        <h2 id="karsilastirma-baslik" className={styles.baslik}>Üç yolu aynı kriterlerle karşılaştırın.</h2>
        <p className={styles.girisMetni}>Diğer iki sütun belirli bir firmayı değil çalışma biçimini tanımlar. Kesin koşullar ilgili sağlayıcıdan doğrulanmalıdır.</p>
        <div className={styles.tabloSarmal}>
          <table className={styles.tablo}>
            <caption className={styles.gizliBaslik}>SKDM çalışma yollarının kriter bazlı karşılaştırması</caption>
            <thead><tr><th scope="col">Kriter</th>{SECENEKLER.map((s) => <th key={s.id} scope="col" className={s.oneCikan ? styles.oneCikanBaslik : ""}>{s.oneCikan && <span className={styles.rozet}>Bu sayfadaki ürün</span>}<strong>{s.baslik}</strong>{s.altBaslik && <small>{s.altBaslik}</small>}</th>)}</tr></thead>
            <tbody>{SATIRLAR.map((satir) => <tr key={satir.kriter}><th scope="row">{satir.kriter}</th>{SECENEKLER.map((s) => <td key={s.id} data-etiket={s.baslik} className={s.oneCikan ? styles.oneCikanHucre : ""}>{satir.degerler[s.id]}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className={styles.eylem}><a href="/basla/">Hemen başla</a><span>Mühür öncesi hiçbir adımda ücret istenmez.</span></div>
      </div>
    </section>
  );
}
