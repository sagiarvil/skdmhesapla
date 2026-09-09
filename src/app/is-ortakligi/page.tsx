import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Factory,
  FileCheck2,
  Globe2,
  Handshake,
  Leaf,
  Play,
  Ship,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";
import { pageMetadata, SITE_ORIGIN } from "@/lib/skdm/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  path: "/is-ortakligi/",
  title: "SKDM / CBAM ve Denizcilik Karbon İş Ortaklığı | SKDMHesapla",
  description:
    "Gümrük müşavirleri, dış ticaret ve sürdürülebilirlik hizmet firmaları için SKDM/CBAM, EU MRV, EU ETS ve FuelEU Maritime teknik hazırlık iş ortaklığı.",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}/is-ortakligi/#webpage`,
      url: `${SITE_ORIGIN}/is-ortakligi/`,
      name: "SKDM / CBAM ve Denizcilik Karbon İş Ortaklığı",
      description:
        "Gümrük müşavirleri, dış ticaret ve sürdürülebilirlik hizmet firmaları için teknik karbon hazırlık iş ortaklığı.",
      inLanguage: "tr-TR",
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      about: ["CBAM", "EU ETS Maritime", "EU MRV", "FuelEU Maritime"],
    },
    {
      "@type": "Service",
      "@id": `${SITE_ORIGIN}/is-ortakligi/#service`,
      name: "SKDMHesapla teknik partner teslim modeli",
      serviceType: "CBAM ve denizcilik karbon veri, hesaplama ve doğrulamaya hazırlık altyapısı",
      provider: { "@id": `${SITE_ORIGIN}/#organization` },
      areaServed: { "@type": "Country", name: "Türkiye" },
      url: `${SITE_ORIGIN}/is-ortakligi/`,
    },
  ],
};

const regulations = [
  [Globe2, "SKDM / CBAM", "Sınırda Karbon Düzenleme Mekanizması"],
  [FileCheck2, "EU ETS", "Avrupa Emisyon Ticaret Sistemi"],
  [Ship, "FuelEU Maritime", "Denizcilikte düşük karbonlu yakıt düzeni"],
  [Leaf, "THETIS-MRV", "AB denizcilik emisyon raporlama sistemi"],
] as const;

const benefits = [
  [BarChart3, "Yeni bir gelir kanalı", "Mevcut müşteri portföyünüzde katma değerli yeni bir hizmet alanı açın."],
  [Users, "Hizmet portföyünüzü genişletin", "SKDM, EU ETS, FuelEU ve THETIS-MRV ihtiyaçlarını aynı müşteri ilişkisinde karşılayın."],
  [Clock3, "Daha hızlı ve güvenilir operasyon", "Teknik çalışma motoru ve standart veri akışıyla üretim süresini kısaltın."],
  [ShieldCheck, "Profesyonel ve markanızla uyumlu teslim", "Rapor, analiz ve çalışma çıktıları tanımlı profesyonel teslim standardında hazırlansın."],
] as const;

const models = [
  {
    icon: Handshake,
    title: "1. Yönlendir ve Kazan",
    text: "Müşterinizi bize yönlendirin; gerçekleşen çalışmalar için ticari paylaşım modelini yazılı olarak birlikte belirleyelim.",
    bullets: ["Sizin için ek teknik operasyon yükü yok", "Hızlı ve kolay başlangıç", "Tekrarlayan işlerde düzenli gelir imkânı"],
  },
  {
    icon: Tags,
    title: "2. Kendi Müşterine Kendi Fiyatınla Sat",
    text: "SKDMHesapla teknik altyapısını kendi hizmet paketiniz ve fiyatlandırmanız içinde müşterinize sunun.",
    bullets: ["Satış fiyatınızı siz belirlersiniz", "Mevcut müşteri ilişkiniz sizde kalır", "Teknik partner bedeli ayrıca netleşir"],
  },
  {
    icon: Users,
    title: "3. Birlikte Proje Yürütelim",
    text: "Daha kapsamlı projelerde birlikte çalışalım; tekliften teslimata kadar rol ve sorumlulukları baştan netleştirelim.",
    bullets: ["Ortak teklif ve proje yapısı", "Teknik ekip desteği", "Büyük ve stratejik müşterilerde birlikte büyüme"],
  },
] as const;

const audiences = [
  [Building2, "Gümrük\nMüşavirleri"],
  [Leaf, "Sürdürülebilirlik\nHizmet Firmaları"],
  [Globe2, "Dış Ticaret\nHizmet Firmaları"],
  [Ship, "Lojistik ve Denizcilik\nHizmet Sağlayıcıları"],
] as const;

const steps = [
  ["1", "Müşteri gelir", "Siz müşterinizi getirirsiniz ya da birlikte belirleriz."],
  ["2", "Kapsam belirlenir", "İhtiyaç analiz edilir, hizmet kapsamı netleştirilir."],
  ["3", "Teklif modeli seçilir", "Size en uygun iş birliği modeli belirlenir."],
  ["4", "Operasyon hazırlanır", "Teknik çalışma süreci yürür, siz bilgilendirilirsiniz."],
  ["5", "Teslim yapılır", "Kararlaştırılmış çalışma çıktıları müşteriye sunulur."],
] as const;

export default function IsOrtakligiPage() {
  return (
    <main id="main" className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.hero}>
        <header className={styles.nav}>
          <div className={`${styles.shell} ${styles.navInner}`}>
            <Link href="/" className={styles.brand} aria-label="SKDMHesapla ana sayfa">
              <Leaf className={styles.brandMark} aria-hidden="true" />
              <span>
                <span className={styles.brandName}>SKDM<span>Hesapla</span></span>
                <span className={styles.brandTag}>Karbon uyumlu ticaret için</span>
              </span>
            </Link>
            <nav className={styles.navLinks} aria-label="İş ortaklığı sayfası menüsü">
              <a href="#modeller">Çözüm Ortaklığı</a>
              <a href="#kapsam">Hizmet Kapsamı</a>
              <a href="#nasil-calisir">Nasıl Çalışır?</a>
              <Link href="/sss/">S.S.S.</Link>
              <Link href="/iletisim/">İletişim</Link>
            </nav>
            <Link href="/iletisim/" className={styles.navButton}>Ortaklık Görüşmesi Talep Et <ArrowRight size={14} /></Link>
          </div>
        </header>

        <div className={`${styles.shell} ${styles.heroBody}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>İş ortaklarımızla daha güçlü bir yeşil ticaret</p>
            <h1 className={styles.heroTitle}>
              Müşterinize karbon uyum hizmeti satın.
              <span className={styles.heroTitleGold}>Operasyonu birlikte kuralım.</span>
            </h1>
            <p className={styles.heroText}>
              SKDMHesapla'nın teknolojisini ve teknik çalışma altyapısını arkanıza alın. Kendi müşterilerinize hizmet verin, gelirinizi artırın. İster yönlendirin, ister kendi fiyatınızla satın, ister birlikte yürütelim.
            </p>
            <div className={styles.heroActions}>
              <Link href="/iletisim/" className={styles.primaryButton}>Ortaklık Görüşmesi Talep Et <ArrowRight size={15} /></Link>
              <a href="#nasil-calisir" className={styles.secondaryButton}>Nasıl Çalışır? <Play size={15} /></a>
            </div>
          </div>
          <div className={styles.heroAside}>Daha temiz<br />Daha uyumlu<br />Daha güçlü<br />İş ortaklıkları</div>
        </div>
      </section>

      <section className={styles.regStrip} aria-label="Hizmet alanları">
        <div className={`${styles.shell} ${styles.regGrid}`}>
          {regulations.map(([Icon, title, text]) => (
            <div className={styles.regItem} key={title}>
              <Icon className={styles.regIcon} aria-hidden="true" />
              <div><div className={styles.regTitle}>{title}</div><div className={styles.regText}>{text}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.white}`}>
        <div className={styles.shell}>
          <div className={styles.benefitHead}>
            <div>
              <p className={styles.sectionLabel}>Neden SKDMHesapla ile iş ortaklığı?</p>
              <h2 className={styles.sectionTitle}>İş ortaklarımız<br />bizimle daha fazlasını başarıyor.</h2>
            </div>
            <p className={styles.sectionIntro}>Sahip olduğumuz teknoloji ve operasyonel altyapı ile iş ortaklarımızın müşterilerine hızlı, doğru ve güvenilir karbon uyum çalışmaları sunmasını destekliyoruz.</p>
          </div>
          <div className={styles.benefitGrid}>
            {benefits.map(([Icon, title, text]) => (
              <article className={styles.benefit} key={title}>
                <Icon className={styles.benefitIcon} aria-hidden="true" />
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="modeller" className={`${styles.section} ${styles.models}`}>
        <div className={styles.shell}>
          <div className={styles.modelsHead}>
            <div><p className={styles.sectionLabel}>İş ortaklığı modelleri</p><h2 className={styles.sectionTitle}>Size en uygun iş birliği modelini seçin.</h2></div>
            <p className={styles.sectionIntro}>Farklı iş yapış şekillerine uygun esnek modeller sunuyoruz. İhtiyacınıza göre birlikte en doğru yapıyı kuralım.</p>
          </div>
          <div className={styles.modelGrid}>
            {models.map(({ icon: Icon, title, text, bullets }) => (
              <article className={styles.modelCard} key={title}>
                <div className={styles.modelTop}>
                  <Icon className={styles.modelIcon} aria-hidden="true" />
                  <div><h3>{title}</h3><p>{text}</p></div>
                </div>
                <ul className={styles.checkList}>
                  {bullets.map((item) => <li key={item}><CheckCircle2 className={styles.check} aria-hidden="true" />{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.audience}>
        <div className={`${styles.shell} ${styles.audienceGrid}`}>
          <div className={styles.audienceLead}><p className={styles.sectionLabel}>Kimler için?</p><h2 className={styles.sectionTitle}>Bu iş birliği,<br />şu profesyoneller için.</h2></div>
          {audiences.map(([Icon, title]) => (
            <div className={styles.audienceItem} key={title}><Icon aria-hidden="true" /><span>{title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</span></div>
          ))}
          <div className={styles.audiencePhoto}><div className={styles.audiencePhotoText}>Daha temiz<br />Daha uyumlu<br />Daha güçlü ticaret</div></div>
        </div>
      </section>

      <section id="kapsam" className={styles.scope}>
        <div className={`${styles.shell} ${styles.scopeGrid}`}>
          <div className={styles.scopeLead}><p className={styles.sectionLabel}>Hizmet kapsamımız</p><h2 className={styles.sectionTitle}>Karada ve denizde<br />aynı teknik disiplin, daha geniş fırsatlar.</h2></div>
          <article className={styles.scopeCard}>
            <div className={styles.scopeCardTitle}><Factory aria-hidden="true" /><div><strong>Karasal Kapsam</strong><span>SKDM / CBAM Çalışmaları</span></div></div>
            <ul className={styles.scopeList}>{["Emisyon hesaplama ve veri analizi","CBAM veri ve rapor hazırlığı","Doğrulamaya hazırlık ve kanıt düzeni"].map((x)=><li key={x}><CheckCircle2 className={styles.check} />{x}</li>)}</ul>
          </article>
          <article className={styles.scopeCard}>
            <div className={styles.scopeCardTitle}><Ship aria-hidden="true" /><div><strong>Denizcilik Kapsamı</strong><span>EU ETS, FuelEU Maritime, THETIS-MRV</span></div></div>
            <ul className={styles.scopeList}>{["Sefer ve yakıt verilerinin analizi","Emisyon raporlama hazırlığı","Verifier-ready teknik çalışma paketi"].map((x)=><li key={x}><CheckCircle2 className={styles.check} />{x}</li>)}</ul>
          </article>
        </div>
      </section>

      <section id="nasil-calisir" className={styles.workflow}>
        <div className={`${styles.shell} ${styles.workflowInner}`}>
          <div><p className={styles.eyebrow}>Nasıl çalışır?</p><h2 className={styles.workflowTitle}>Basit bir süreç,<br />büyük fırsatlar.</h2></div>
          <ol className={styles.steps}>
            {steps.map(([no,title,text]) => <li className={styles.step} key={no}><span className={styles.stepNo}>{no}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`${styles.shell} ${styles.ctaInner}`}>
          <Leaf className={styles.ctaLeaf} aria-hidden="true" />
          <div><div className={styles.ctaSmall}>Birlikte daha büyük bir etki, daha yüksek bir değer.</div><div className={styles.ctaTitle}>Ortaklık ve satış iş birliği için<br />hemen görüşelim.</div></div>
          <Link href="/iletisim/" className={styles.primaryButton}>Ortaklık Görüşmesi Talep Et <ArrowRight size={15} /></Link>
          <div className={styles.ctaBrand}><strong>SKDMHesapla</strong><span>Karbon uyumlu ticaret için</span></div>
        </div>
      </section>

      <footer className={styles.miniFooter}>
        <div className={`${styles.shell} ${styles.miniFooterInner}`}><span><strong>SKDMHesapla</strong> &nbsp; | &nbsp; Türkiye'nin karbon uyum çalışma platformu</span><span>Daha temiz ticaret için. Birlikte.</span></div>
      </footer>
    </main>
  );
}
