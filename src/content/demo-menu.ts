import type { FoodKind } from "@/components/media/FoodIcon";

/**
 * Fictional demo menu for the interactive kiosk demonstration.
 * Entirely made up — not the menu or identity of any real restaurant.
 * The demo has its own language state (independent of the site locale),
 * so every string ships in all three languages.
 */

export type DemoLang = "uz" | "ru" | "en";
export type L10n = Record<DemoLang, string>;

export type DemoModifier = {
  id: string;
  name: L10n;
  price: number;
};

export type DemoItem = {
  id: string;
  category: string;
  name: L10n;
  price: number;
  icon: FoodKind;
  modifiers?: { label: L10n; options: DemoModifier[] };
};

export type DemoCategory = {
  id: string;
  name: L10n;
  icon: FoodKind;
};

export const demoCategories: DemoCategory[] = [
  { id: "mains", name: { uz: "Asosiy taomlar", ru: "Основное", en: "Mains" }, icon: "burger" },
  { id: "coffee", name: { uz: "Qahva", ru: "Кофе", en: "Coffee" }, icon: "coffee" },
  { id: "desserts", name: { uz: "Shirinliklar", ru: "Десерты", en: "Desserts" }, icon: "cake" },
  { id: "drinks", name: { uz: "Ichimliklar", ru: "Напитки", en: "Drinks" }, icon: "drink" },
];

export const demoItems: DemoItem[] = [
  {
    id: "classic-burger",
    category: "mains",
    name: { uz: "Klassik burger", ru: "Классический бургер", en: "Classic burger" },
    price: 42000,
    icon: "burger",
    modifiers: {
      label: { uz: "O‘lchamni tanlang", ru: "Выберите размер", en: "Choose a size" },
      options: [
        {
          id: "single",
          name: { uz: "Bitta kotlet", ru: "Одна котлета", en: "Single patty" },
          price: 0,
        },
        {
          id: "double",
          name: { uz: "Ikkita kotlet", ru: "Двойная котлета", en: "Double patty" },
          price: 14000,
        },
      ],
    },
  },
  {
    id: "chicken-sandwich",
    category: "mains",
    name: { uz: "Tovuqli sendvich", ru: "Сэндвич с курицей", en: "Chicken sandwich" },
    price: 38000,
    icon: "sandwich",
  },
  {
    id: "fries",
    category: "mains",
    name: { uz: "Kartoshka fri", ru: "Картофель фри", en: "French fries" },
    price: 18000,
    icon: "fries",
  },
  {
    id: "cappuccino",
    category: "coffee",
    name: { uz: "Kapuchino", ru: "Капучино", en: "Cappuccino" },
    price: 28000,
    icon: "coffee",
    modifiers: {
      label: { uz: "Hajmni tanlang", ru: "Выберите объём", en: "Choose a size" },
      options: [
        {
          id: "s",
          name: { uz: "Kichik · 250 ml", ru: "Малый · 250 мл", en: "Small · 250 ml" },
          price: 0,
        },
        {
          id: "m",
          name: { uz: "O‘rta · 350 ml", ru: "Средний · 350 мл", en: "Medium · 350 ml" },
          price: 6000,
        },
        {
          id: "l",
          name: { uz: "Katta · 450 ml", ru: "Большой · 450 мл", en: "Large · 450 ml" },
          price: 10000,
        },
      ],
    },
  },
  {
    id: "green-tea",
    category: "coffee",
    name: { uz: "Ko‘k choy", ru: "Зелёный чай", en: "Green tea" },
    price: 12000,
    icon: "tea",
  },
  {
    id: "cheesecake",
    category: "desserts",
    name: { uz: "Chizkeyk", ru: "Чизкейк", en: "Cheesecake" },
    price: 32000,
    icon: "cake",
  },
  {
    id: "donut",
    category: "desserts",
    name: { uz: "Donat", ru: "Пончик", en: "Donut" },
    price: 15000,
    icon: "donut",
  },
  {
    id: "lemonade",
    category: "drinks",
    name: { uz: "Limonad", ru: "Лимонад", en: "Lemonade" },
    price: 16000,
    icon: "drink",
  },
  {
    id: "ice-cream",
    category: "drinks",
    name: { uz: "Muzqaymoq", ru: "Мороженое", en: "Ice cream" },
    price: 14000,
    icon: "icecream",
  },
];

/** Item suggested as a tasteful add-on when the basket lacks a dessert. */
export const upsellItemId = "donut";

export const demoUi = {
  chooseLang: { uz: "Tilni tanlang", ru: "Выберите язык", en: "Choose a language" },
  menuTitle: { uz: "Menyu", ru: "Меню", en: "Menu" },
  add: { uz: "Qo‘shish", ru: "Добавить", en: "Add" },
  basket: { uz: "Savat", ru: "Корзина", en: "Basket" },
  emptyBasket: { uz: "Savat bo‘sh", ru: "Корзина пуста", en: "Your basket is empty" },
  total: { uz: "Jami", ru: "Итого", en: "Total" },
  checkout: { uz: "To‘lovga o‘tish", ru: "К оплате", en: "Checkout" },
  back: { uz: "Orqaga", ru: "Назад", en: "Back" },
  upsellTitle: { uz: "Desert qo‘shasizmi?", ru: "Добавить десерт?", en: "Add a dessert?" },
  upsellYes: { uz: "Ha, qo‘shish", ru: "Да, добавить", en: "Yes, add it" },
  upsellNo: { uz: "Yo‘q, rahmat", ru: "Нет, спасибо", en: "No, thanks" },
  payTitle: {
    uz: "To‘lov usulini tanlang",
    ru: "Выберите способ оплаты",
    en: "Choose a payment method",
  },
  payNote: {
    uz: "Bu namoyish — haqiqiy to‘lov amalga oshirilmaydi",
    ru: "Это демонстрация — реальная оплата не проводится",
    en: "This is a demo — no real payment is processed",
  },
  payButton: { uz: "To‘lash (namoyish)", ru: "Оплатить (демо)", en: "Pay (demo)" },
  processing: { uz: "To‘lov tekshirilmoqda…", ru: "Проверяем оплату…", en: "Confirming payment…" },
  successTitle: { uz: "Buyurtma qabul qilindi!", ru: "Заказ принят!", en: "Order confirmed!" },
  successText: {
    uz: "Buyurtma raqamingiz chekda. Tayyor bo‘lganda ekranda ko‘rasiz.",
    ru: "Номер заказа — на чеке. Когда всё будет готово, он появится на экране выдачи.",
    en: "Your order number is on the receipt. Watch the pickup screen for it.",
  },
  orderNo: { uz: "Buyurtma", ru: "Заказ", en: "Order" },
  newOrder: { uz: "Yangi buyurtma", ru: "Новый заказ", en: "New order" },
  currency: { uz: "so‘m", ru: "сум", en: "UZS" },
  card: { uz: "Karta", ru: "Карта", en: "Card" },
  qr: { uz: "QR to‘lov", ru: "QR-оплата", en: "QR payment" },
} satisfies Record<string, L10n>;

export function formatPrice(value: number, lang: DemoLang): string {
  return `${value.toLocaleString("ru-RU").replace(/,/g, " ")} ${demoUi.currency[lang]}`;
}

export const paymentMarks = ["Click", "Payme", "Uzum", "HUMO", "Uzcard", "Visa", "Mastercard"];
