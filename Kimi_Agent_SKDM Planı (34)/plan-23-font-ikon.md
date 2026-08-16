# PLAN 23 — cimpactpro Tipografi, Ölçek ve İkon Sistemi (birebir)

> Araştırma kanıtı: cimpactpro.com → ana font **Manrope** (Google Fonts, 200–800),
> gövde 16–18px, hero başlık 48px; ikonlar **Phosphor Light / Remix Icon** (premium
> ince çizgi). Aşağıdaki 4 adım bunu birebir kurar. 15 dakika sürer.

## 1) Font: Inter → Manrope → `src/app/layout.tsx`

Dosyanın tamamını bununla değiştirin (değişken adı korundu, başka hiçbir dosya
etkilenmez):

```tsx
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./pasaport-zemin.css";
import { SiteFooter, SiteHeader } from "@/components/legal/SiteChrome";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SKDMHesapla — AB SKDM Sertifika Maliyeti Hesaplayıcı",
    template: "%s | SKDMHesapla",
  },
  description:
    "Ürününüzü yazın veya sektörünüzü seçin, adımları tamamlayın; denetime hazırlık dosyanızı ve tahmini SKDM sertifika maliyetini üretin.",
  icons: {
    icon: "/logo/skdm-logo-statik.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={manrope.variable}>
      <body className={`${manrope.className} min-h-screen antialiased`}>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

## 2) Ölçek: cimpactpro tipografi skalası → `src/app/globals.css` sonuna ekleyin

```css
/* PLAN 23 — cimpactpro ölçeği */
html { font-size: 17px; }
body { font-size: 17px; line-height: 1.65; }
h1 { font-size: clamp(32px, 4.5vw, 48px); line-height: 1.15; letter-spacing: -0.01em; }
h2 { font-size: clamp(26px, 3vw, 36px); line-height: 1.25; }
h3 { font-size: 22px; line-height: 1.35; }
p, li { line-height: 1.65; }
.container, .max-w-container { max-width: 1200px; }
```

## 3) Premium ikonlar: Lucide → Phosphor

```
npm i @phosphor-icons/react
```

Sonra ikon eşlemesi (lucide adı → phosphor adı), sektör kartlarında kullanılanlar:

| Eski (lucide) | Yeni (@phosphor-icons/react) |
|---|---|
| Battery | BatteryHigh |
| Boxes | Package |
| Car | Car |
| Factory | Factory |
| FileText | FileText |
| FlaskConical | Flask |
| Leaf | Leaf |
| Package | Package |
| Ship | Ship |
| Sofa | Armchair |
| Shirt | TShirt |
| Layers | Stack |
| Cpu | Cpu |
| Droplets | Drop |

Kullanım tarzı (premium görünümün sırrı `weight="duotone"` + hafif renk):

```tsx
import { Factory } from "@phosphor-icons/react";
<Factory size={22} weight="duotone" className="text-brand-800" aria-hidden />
```

Güncellenmiş `/basla/` dosyası bu ikonlarla birlikte `yeni-basla-page-v2.tsx`
olarak ayrıca teslim edildi — doğrudan `src/app/basla/page.tsx` yerine kullanın.

## 4) Doğrulama

```
npm run typecheck && npm run build && firebase deploy --only hosting:skdmhesapla
git add -A && git commit -m "Manrope + cimpactpro olcegi + Phosphor ikonlar" && git push origin main
```

Kanıt: ana sayfa ekranında Manrope farkı (yuvarlak, premium duruş), sektör
kartlarında duotone ikonlar, gövde metni 17px.
