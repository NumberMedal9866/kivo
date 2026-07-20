import type { Locale } from "@/config/brand";

/**
 * Central registry for product imagery. Real renders/photos are not
 * available yet — every entry currently falls back to a polished SVG/CSS
 * placeholder composition. To replace an image, drop the file at `src`
 * (under /public) and it is picked up automatically by <ProductMedia>.
 * Full instructions: docs/MEDIA_REPLACEMENT_GUIDE.md.
 */
export type MediaEntry = {
  id: string;
  /** Path under /public where the real asset is expected. */
  src: string;
  alt: Record<Locale, string>;
  /** width/height of the intended asset — reserved to avoid layout shift. */
  width: number;
  height: number;
  /** Guidance for the person producing the real asset. */
  focalPoint: string;
  section: string;
  transparentPreferred: boolean;
  /** Placeholder art direction until the real asset exists. */
  placeholder: "kiosk" | "scene" | "closeup" | "diagram";
  /** Optional smaller variant for mobile. */
  mobileSrc?: string;
};

export const media = {
  "hero-kiosk-front": {
    id: "hero-kiosk-front",
    src: "/images/hero-kiosk-front.png",
    alt: {
      ru: "Киоск самообслуживания kiyo: белый корпус, чёрная рамка экрана и платёжный терминал",
      uz: "kiyo o‘z-o‘ziga xizmat kioski: oq korpus, qora ekran romkasi va to‘lov terminali",
      en: "kiyo self-service kiosk with a white body, black display bezel and payment terminal",
    },
    width: 495,
    height: 1324,
    focalPoint: "Full front view, screen centered, slight left offset for floating UI card",
    section: "Home hero",
    transparentPreferred: true,
    placeholder: "kiosk",
  },
  "kiosk-in-coffee-shop": {
    id: "kiosk-in-coffee-shop",
    src: "/images/kiosk-in-coffee-shop.webp",
    alt: {
      ru: "Киоск kiyo в интерьере кофейни",
      uz: "Qahvaxona interyeridagi kiyo kioski",
      en: "kiyo kiosk in a coffee shop interior",
    },
    width: 1600,
    height: 1200,
    focalPoint: "Kiosk at right third, warm café environment, guest interacting",
    section: "Product page — design",
    transparentPreferred: false,
    placeholder: "scene",
  },
  "kiosk-fast-food-counter": {
    id: "kiosk-fast-food-counter",
    src: "/images/kiosk-fast-food-counter.webp",
    alt: {
      ru: "Киоски kiyo рядом со стойкой выдачи фастфуда",
      uz: "Fastfud peshtaxtasi yonidagi kiyo kiosklari",
      en: "kiyo kiosks next to a fast-food pickup counter",
    },
    width: 1600,
    height: 1200,
    focalPoint: "Two kiosks in a row, counter in background, peak-hour energy",
    section: "Problem/solution section",
    transparentPreferred: false,
    placeholder: "scene",
  },
  "payment-terminal-closeup": {
    id: "payment-terminal-closeup",
    src: "/images/payment-terminal-closeup.webp",
    alt: {
      ru: "Крупный план платёжного терминала киоска kiyo",
      uz: "kiyo kioski to‘lov terminalining yaqin plandagi ko‘rinishi",
      en: "Close-up of the kiyo kiosk payment terminal",
    },
    width: 1200,
    height: 900,
    focalPoint: "Terminal and card tap area, shallow depth of field",
    section: "Product page — hardware",
    transparentPreferred: false,
    placeholder: "closeup",
  },
  "kiosk-interface-menu": {
    id: "kiosk-interface-menu",
    src: "/images/kiosk-interface-menu.webp",
    alt: {
      ru: "Экран киоска kiyo с меню и категориями",
      uz: "Menyu va kategoriyalar ko‘rsatilgan kiyo kioski ekrani",
      en: "kiyo kiosk screen showing menu categories and items",
    },
    width: 1080,
    height: 1680,
    focalPoint: "Straight-on screen capture, menu grid visible",
    section: "Product page — interface",
    transparentPreferred: false,
    placeholder: "kiosk",
  },
  "kiosk-interface-language": {
    id: "kiosk-interface-language",
    src: "/images/kiosk-interface-language.webp",
    alt: {
      ru: "Выбор языка на экране киоска kiyo: узбекский, русский, английский",
      uz: "kiyo kioski ekranida til tanlash: o‘zbek, rus, ingliz",
      en: "Language selection on the kiyo kiosk screen: Uzbek, Russian, English",
    },
    width: 1080,
    height: 1680,
    focalPoint: "Language switch UI prominent at top",
    section: "Benefits — multilingual",
    transparentPreferred: false,
    placeholder: "kiosk",
  },
  "installation-team": {
    id: "installation-team",
    src: "/images/installation-team.webp",
    alt: {
      ru: "Специалисты kiyo устанавливают киоск в заведении",
      uz: "kiyo mutaxassislari zavedeniyada kioskni o‘rnatmoqda",
      en: "kiyo technicians installing a kiosk on site",
    },
    width: 1600,
    height: 1200,
    focalPoint: "Two technicians, kiosk mid-installation, venue visible",
    section: "Implementation page",
    transparentPreferred: false,
    placeholder: "scene",
  },
  "multi-location-diagram": {
    id: "multi-location-diagram",
    src: "/images/multi-location-diagram.webp",
    alt: {
      ru: "Схема централизованного управления меню для нескольких филиалов",
      uz: "Bir nechta filial uchun markazlashgan menyu boshqaruvi sxemasi",
      en: "Diagram of centralized menu management across several locations",
    },
    width: 1600,
    height: 1000,
    focalPoint: "Hub-and-spoke diagram, central menu node",
    section: "Integrations page",
    transparentPreferred: true,
    placeholder: "diagram",
  },
  "hero-kiosk-detail": {
    id: "hero-kiosk-detail",
    src: "/images/hero-kiosk-detail.webp",
    alt: {
      ru: "Деталь корпуса киоска kiyo с монограммой",
      uz: "Monogramma tushirilgan kiyo kioski korpusining detali",
      en: "Detail of the kiyo kiosk body with the monogram",
    },
    width: 1200,
    height: 900,
    focalPoint: "Macro shot of body edge and monogram",
    section: "Product page — design detail",
    transparentPreferred: false,
    placeholder: "closeup",
  },
} as const satisfies Record<string, MediaEntry>;

export type MediaId = keyof typeof media;
