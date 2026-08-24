import styles from "./SiteFooter.module.css";
import { ISLETMECI } from "@/config/isletmeci";

const URUN = [
  ["Platform Kabiliyetleri", "/platform-kabiliyetleri/"], ["Nasıl Çalışır", "/nasil-calisir/"], ["Metodoloji", "/metodoloji/"],
  ["Fiyatlandırma", "/fiyatlandirma/"], ["Tedarikçi Verisi", "/tedarikci-verisi/"], ["Mühür Doğrulama", "/dogrula/"],
] as const;
const KURUMSAL = [
  ["Hakkında", "/hakkinda/"], ["Metodoloji Sorumlusu", "/uzmanlik/baris-bagirlar/"], ["Kullanım Koşulları", "/kullanim-kosullari/"],
  ["KVKK Aydınlatma", "/kvkk-aydinlatma/"], ["İade Politikası", "/iade-politikasi/"], ["İletişim", "/iletisim/"],
] as const;

export default function SiteFooter(){
  return <footer className={styles.altBilgi}>
    <div className={styles.icerik}>
      <div className={styles.ust}>
        <div className={styles.marka}>
          <a className={styles.markaBag} href="/" aria-label={`${ISLETMECI.urunAdi} ana sayfa`}>
            <img className={styles.logo} src="/logo/skdm-logo-header.svg" alt="" width="28" height="28" aria-hidden="true" />
            <span className={styles.markaAd}>{ISLETMECI.urunAdi}</span>
          </a>
          <p className={styles.markaMetin}>Türk ihracatçısı için kapsam, veri toplama, precursor, hesaplama izi ve denetime hazırlık çalışma altyapısı.</p>
          <a className={styles.eposta} href={`mailto:${ISLETMECI.eposta}`}>{ISLETMECI.eposta}</a>
        </div>
        <FooterNav title="Ürün" label="Ürün bağlantıları" items={URUN}/>
        <FooterNav title="Kurumsal ve Yasal" label="Kurumsal ve yasal bağlantılar" items={KURUMSAL}/>
      </div>
      <p className={styles.kapsamNotu}>{ISLETMECI.urunAdi}, akredite doğrulama görüşü veya gümrük onayı vermez; veri toplama, hesaplama, kalite kontrolü ve denetime hazırlık çalışma dosyanızı oluşturan self-servis yazılımdır.</p>
      <div className={styles.yasal}>
        <p className={styles.yasalSatir}>© {new Date().getFullYear()} {ISLETMECI.ticariUnvan}<span className={styles.ayrac}>·</span>{ISLETMECI.vergiEtiketi}: {ISLETMECI.vergiNo}<span className={styles.ayrac}>·</span>{ISLETMECI.adres}</p>
        <p className={styles.yasalNot}>Sunucu konumu: {ISLETMECI.sunucuKonumu} — işletmeci merkezi değildir.</p>
      </div>
    </div>
  </footer>;
}

function FooterNav({title,label,items}:{title:string;label:string;items:readonly (readonly [string,string])[]}){
  return <nav className={styles.sutun} aria-label={label}><h2 className={styles.sutunBaslik}>{title}</h2><ul className={styles.liste}>{items.map(([ad,href])=><li key={href}><a className={styles.bag} href={href}>{ad}</a></li>)}</ul></nav>
}
