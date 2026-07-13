"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Accessible accordion: real <button> headers, aria-expanded/aria-controls,
 * keyboard operable by default. Content stays in the DOM (server-rendered
 * and crawlable) — only the visual expansion is toggled.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <div className="divide-y divide-line rounded-card border border-line bg-surface">
      {items.map((item) => {
        const open = openId === item.id;
        const headerId = `${baseId}-h-${item.id}`;
        const panelId = `${baseId}-p-${item.id}`;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[1.02rem] font-semibold text-ink transition-colors hover:text-brand sm:px-7"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-transform duration-300",
                    open && "rotate-45 border-brand bg-brand-soft text-brand",
                  )}
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!open}
              className="px-5 pb-6 sm:px-7"
            >
              <p className="max-w-2xl leading-relaxed text-ink-soft">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
