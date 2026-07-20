"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  demoCategories,
  demoItems,
  demoUi,
  formatPrice,
  paymentMarks,
  upsellItemId,
  type DemoLang,
} from "@/content/demo-menu";
import { FoodIcon } from "@/components/media/FoodIcon";
import { LogoMark } from "@/components/brand/Logo";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Screen = "menu" | "modifiers" | "upsell" | "basket" | "payment" | "processing" | "success";
type BasketLine = { itemId: string; modifierId?: string; qty: number };

export function KioskDemo({ initialLang, label }: { initialLang: DemoLang; label: string }) {
  const [lang, setLang] = useState<DemoLang>(initialLang);
  const [screen, setScreen] = useState<Screen>("menu");
  const [category, setCategory] = useState(demoCategories[0]!.id);
  const [basket, setBasket] = useState<BasketLine[]>([]);
  const [pendingItem, setPendingItem] = useState<string | null>(null);
  const [orderNo] = useState(() => 200 + Math.floor(Math.random() * 700));
  const started = useRef(false);
  const reduced = useReducedMotion();

  const total = useMemo(
    () =>
      basket.reduce((sum, line) => {
        const item = demoItems.find((i) => i.id === line.itemId);
        if (!item) return sum;
        const mod = item.modifiers?.options.find((o) => o.id === line.modifierId);
        return sum + (item.price + (mod?.price ?? 0)) * line.qty;
      }, 0),
    [basket],
  );

  function markStarted() {
    if (!started.current) {
      started.current = true;
      trackEvent("demo_started");
    }
  }

  function addToBasket(itemId: string, modifierId?: string) {
    markStarted();
    setBasket((prev) => {
      const existing = prev.find((l) => l.itemId === itemId && l.modifierId === modifierId);
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { itemId, modifierId, qty: 1 }];
    });
  }

  function onAdd(itemId: string) {
    const item = demoItems.find((i) => i.id === itemId);
    if (item?.modifiers) {
      setPendingItem(itemId);
      setScreen("modifiers");
    } else {
      addToBasket(itemId);
    }
  }

  function onCheckout() {
    const hasDessert = basket.some(
      (l) => demoItems.find((i) => i.id === l.itemId)?.category === "desserts",
    );
    setScreen(hasDessert ? "payment" : "upsell");
  }

  function onPay() {
    setScreen("processing");
    window.setTimeout(
      () => {
        setScreen("success");
        trackEvent("demo_completed");
      },
      reduced ? 300 : 1400,
    );
  }

  function reset() {
    setBasket([]);
    setScreen("menu");
    setCategory(demoCategories[0]!.id);
  }

  const itemCount = basket.reduce((n, l) => n + l.qty, 0);
  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] as const };

  return (
    <div
      role="group"
      aria-label={label}
      // theme-light: the demo shows the real kiosk UI, which is always light.
      className="theme-light mx-auto w-full max-w-95 rounded-[1.8rem] bg-kiosk-bezel p-3 shadow-kiosk"
    >
      <div className="flex h-152 flex-col overflow-hidden rounded-[1.1rem] bg-bg">
        {/* Kiosk screen header */}
        <div className="flex items-center justify-between bg-surface px-4 py-3 shadow-[0_1px_0_var(--color-line)]">
          <LogoMark className="h-6 w-6 text-brand" />
          <div role="group" aria-label={demoUi.chooseLang[lang]} className="flex gap-1">
            {(["uz", "ru", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => {
                  markStarted();
                  setLang(l);
                }}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-extrabold transition-colors",
                  lang === l ? "bg-ink text-white" : "bg-bg text-ink-soft hover:text-ink",
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Screens */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={screen}
              initial={{ opacity: 0, x: reduced ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduced ? 0 : -24 }}
              transition={transition}
              className="absolute inset-0 flex flex-col"
            >
              {screen === "menu" && (
                <MenuScreen
                  lang={lang}
                  category={category}
                  setCategory={setCategory}
                  onAdd={onAdd}
                />
              )}
              {screen === "modifiers" && pendingItem && (
                <ModifierScreen
                  lang={lang}
                  itemId={pendingItem}
                  onBack={() => setScreen("menu")}
                  onPick={(modId) => {
                    addToBasket(pendingItem, modId);
                    setPendingItem(null);
                    setScreen("menu");
                  }}
                />
              )}
              {screen === "upsell" && (
                <UpsellScreen
                  lang={lang}
                  onAccept={() => {
                    addToBasket(upsellItemId);
                    setScreen("payment");
                  }}
                  onDecline={() => setScreen("payment")}
                />
              )}
              {screen === "basket" && (
                <BasketScreen
                  lang={lang}
                  basket={basket}
                  total={total}
                  onBack={() => setScreen("menu")}
                  onCheckout={onCheckout}
                />
              )}
              {screen === "payment" && (
                <PaymentScreen
                  lang={lang}
                  total={total}
                  onPay={onPay}
                  onBack={() => setScreen("basket")}
                />
              )}
              {screen === "processing" && <ProcessingScreen lang={lang} />}
              {screen === "success" && (
                <SuccessScreen lang={lang} orderNo={orderNo} onReset={reset} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Basket bar */}
        {screen === "menu" && (
          <div className="border-t border-line bg-surface p-3">
            <button
              type="button"
              disabled={itemCount === 0}
              onClick={() => setScreen("basket")}
              className="flex h-12 w-full items-center justify-between rounded-full bg-brand px-5 font-bold text-white transition-colors hover:bg-brand-hover disabled:bg-ink/15 disabled:text-ink-soft"
            >
              <span>
                {demoUi.basket[lang]}
                {itemCount > 0 ? ` · ${itemCount}` : ""}
              </span>
              <span>{itemCount > 0 ? formatPrice(total, lang) : ""}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function MenuScreen({
  lang,
  category,
  setCategory,
  onAdd,
}: {
  lang: DemoLang;
  category: string;
  setCategory: (id: string) => void;
  onAdd: (id: string) => void;
}) {
  const items = demoItems.filter((i) => i.category === category);
  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1.5 overflow-x-auto px-4 pt-3 pb-1">
        {demoCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            aria-pressed={category === cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-colors",
              category === cat.id ? "bg-ink text-white" : "bg-surface text-ink-soft hover:text-ink",
            )}
          >
            <span className="h-4.5 w-4.5">
              <FoodIcon kind={cat.icon} />
            </span>
            {cat.name[lang]}
          </button>
        ))}
      </div>
      <div className="grid flex-1 auto-rows-min grid-cols-2 gap-2.5 overflow-y-auto p-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col rounded-2xl bg-surface p-3 shadow-soft">
            <div className="mx-auto h-16 w-16">
              <FoodIcon kind={item.icon} />
            </div>
            <p className="mt-1 line-clamp-2 min-h-10 text-center text-sm font-bold leading-tight text-ink">
              {item.name[lang]}
            </p>
            <p className="text-center text-xs font-semibold text-ink-soft">
              {formatPrice(item.price, lang)}
            </p>
            <button
              type="button"
              onClick={() => onAdd(item.id)}
              className="mt-2 rounded-full bg-brand-soft py-1.5 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              {demoUi.add[lang]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModifierScreen({
  lang,
  itemId,
  onBack,
  onPick,
}: {
  lang: DemoLang;
  itemId: string;
  onBack: () => void;
  onPick: (modifierId: string) => void;
}) {
  const item = demoItems.find((i) => i.id === itemId);
  if (!item?.modifiers) return null;
  return (
    <div className="flex h-full flex-col p-5">
      <BackButton lang={lang} onClick={onBack} />
      <div className="mx-auto mt-2 h-20 w-20">
        <FoodIcon kind={item.icon} />
      </div>
      <h3 className="mt-1 text-center text-lg font-extrabold text-ink">{item.name[lang]}</h3>
      <p className="mt-4 text-sm font-bold text-ink-soft">{item.modifiers.label[lang]}</p>
      <div className="mt-2 space-y-2">
        {item.modifiers.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onPick(opt.id)}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3.5 text-left font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-soft/50"
          >
            <span>{opt.name[lang]}</span>
            <span className="text-sm text-ink-soft">
              {opt.price > 0 ? `+${formatPrice(opt.price, lang)}` : ""}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function UpsellScreen({
  lang,
  onAccept,
  onDecline,
}: {
  lang: DemoLang;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const item = demoItems.find((i) => i.id === upsellItemId)!;
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="h-24 w-24">
        <FoodIcon kind={item.icon} />
      </div>
      <h3 className="mt-4 text-xl font-extrabold text-ink">{demoUi.upsellTitle[lang]}</h3>
      <p className="mt-1 font-semibold text-ink-soft">
        {item.name[lang]} · {formatPrice(item.price, lang)}
      </p>
      <div className="mt-6 flex w-full max-w-60 flex-col gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="rounded-full bg-brand py-3 font-bold text-white transition-colors hover:bg-brand-hover"
        >
          {demoUi.upsellYes[lang]}
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="rounded-full border border-line bg-surface py-3 font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          {demoUi.upsellNo[lang]}
        </button>
      </div>
    </div>
  );
}

function BasketScreen({
  lang,
  basket,
  total,
  onBack,
  onCheckout,
}: {
  lang: DemoLang;
  basket: BasketLine[];
  total: number;
  onBack: () => void;
  onCheckout: () => void;
}) {
  return (
    <div className="flex h-full flex-col p-5">
      <BackButton lang={lang} onClick={onBack} />
      <h3 className="mt-2 text-lg font-extrabold text-ink">{demoUi.basket[lang]}</h3>
      <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
        {basket.length === 0 ? (
          <p className="pt-10 text-center text-ink-soft">{demoUi.emptyBasket[lang]}</p>
        ) : (
          basket.map((line, i) => {
            const item = demoItems.find((it) => it.id === line.itemId)!;
            const mod = item.modifiers?.options.find((o) => o.id === line.modifierId);
            const price = (item.price + (mod?.price ?? 0)) * line.qty;
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft"
              >
                <div className="h-11 w-11 shrink-0">
                  <FoodIcon kind={item.icon} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{item.name[lang]}</p>
                  {mod ? <p className="truncate text-xs text-ink-soft">{mod.name[lang]}</p> : null}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">×{line.qty}</p>
                  <p className="text-xs text-ink-soft">{formatPrice(price, lang)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="border-t border-line pt-3">
        <div className="flex items-center justify-between font-extrabold text-ink">
          <span>{demoUi.total[lang]}</span>
          <span>{formatPrice(total, lang)}</span>
        </div>
        <button
          type="button"
          disabled={basket.length === 0}
          onClick={onCheckout}
          className="mt-3 w-full rounded-full bg-brand py-3 font-bold text-white transition-colors hover:bg-brand-hover disabled:bg-ink/15 disabled:text-ink-soft"
        >
          {demoUi.checkout[lang]}
        </button>
      </div>
    </div>
  );
}

function PaymentScreen({
  lang,
  total,
  onPay,
  onBack,
}: {
  lang: DemoLang;
  total: number;
  onPay: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col p-5">
      <BackButton lang={lang} onClick={onBack} />
      <h3 className="mt-2 text-lg font-extrabold text-ink">{demoUi.payTitle[lang]}</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border-2 border-brand bg-brand-soft/50 p-3 text-center">
          <p className="text-sm font-bold text-ink">{demoUi.card[lang]}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-3 text-center">
          <p className="text-sm font-bold text-ink-soft">{demoUi.qr[lang]}</p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Payment systems">
        {paymentMarks.map((mark) => (
          <li
            key={mark}
            className="rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-bold text-ink-soft"
          >
            {mark}
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-line pt-3">
        <div className="flex items-center justify-between font-extrabold text-ink">
          <span>{demoUi.total[lang]}</span>
          <span>{formatPrice(total, lang)}</span>
        </div>
        <button
          type="button"
          onClick={onPay}
          className="mt-3 w-full rounded-full bg-success py-3 font-bold text-white transition-opacity hover:opacity-90"
        >
          {demoUi.payButton[lang]}
        </button>
        <p className="mt-2 text-center text-[0.68rem] text-ink-soft">{demoUi.payNote[lang]}</p>
      </div>
    </div>
  );
}

function ProcessingScreen({ lang }: { lang: DemoLang }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-brand" />
      <p className="font-semibold text-ink-soft">{demoUi.processing[lang]}</p>
    </div>
  );
}

function SuccessScreen({
  lang,
  orderNo,
  onReset,
}: {
  lang: DemoLang;
  orderNo: number;
  onReset: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center" role="status">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <path
            d="m5 12.5 4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <h3 className="mt-4 text-xl font-extrabold text-ink">{demoUi.successTitle[lang]}</h3>
      <p className="mt-1 rounded-full bg-surface px-4 py-1.5 text-sm font-bold text-ink shadow-soft">
        {demoUi.orderNo[lang]} №{orderNo}
      </p>
      <p className="mt-3 max-w-60 text-sm text-ink-soft">{demoUi.successText[lang]}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-full border border-line bg-surface px-6 py-2.5 font-semibold text-ink transition-colors hover:border-ink/30"
      >
        {demoUi.newOrder[lang]}
      </button>
    </div>
  );
}

function BackButton({ lang, onClick }: { lang: DemoLang; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M13 8H3m0 0 4-4M3 8l4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {demoUi.back[lang]}
    </button>
  );
}
