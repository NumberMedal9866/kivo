import { cn } from "@/lib/utils";

export type FoodKind =
  | "burger"
  | "coffee"
  | "fries"
  | "donut"
  | "drink"
  | "sandwich"
  | "cake"
  | "tea"
  | "icecream"
  | "salad";

/**
 * Flat, geometric placeholder food illustrations used in the kiosk demo and
 * mockups. Intentionally generic — no real restaurant's menu or identity.
 */
export function FoodIcon({ kind, className }: { kind: FoodKind; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-full w-full", className)} aria-hidden="true">
      {ART[kind]}
    </svg>
  );
}

const ART: Record<FoodKind, React.ReactNode> = {
  burger: (
    <g>
      <path d="M12 28c0-9 9-14 20-14s20 5 20 14H12Z" fill="#E8A33D" />
      <circle cx="24" cy="21" r="1.6" fill="#FBEFD9" />
      <circle cx="33" cy="18.5" r="1.6" fill="#FBEFD9" />
      <circle cx="41" cy="21.5" r="1.6" fill="#FBEFD9" />
      <rect x="12" y="30" width="40" height="5" rx="2.5" fill="#7BA05B" />
      <rect x="14" y="36" width="36" height="6" rx="3" fill="#8C5A38" />
      <path d="M12 44h40a0 0 0 0 1 0 0c0 4.4-4 8-9 8H21c-5 0-9-3.6-9-8Z" fill="#E8A33D" />
    </g>
  ),
  coffee: (
    <g>
      <path d="M20 18h24l-2.5 32a4 4 0 0 1-4 3.7h-11a4 4 0 0 1-4-3.7L20 18Z" fill="#F1EBE3" />
      <path d="M21 30h22l-1.2 15H22.2L21 30Z" fill="#8C5A38" />
      <rect x="17" y="13" width="30" height="6" rx="3" fill="#C7BFB3" />
      <path
        d="M28 8c0 2-2 2.5-2 4.5M34 7c0 2-2 2.5-2 4.5"
        stroke="#C7BFB3"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  ),
  fries: (
    <g>
      <path
        d="M22 14l3 18h2l-2-20-3 2ZM31 11v21h2V11h-2ZM42 14l-3 18h-2l2-20 3 2Z"
        fill="#F2C14E"
      />
      <path d="M18 28h28l-3.5 22a4 4 0 0 1-4 3.4h-13a4 4 0 0 1-4-3.4L18 28Z" fill="#C9363E" />
      <path d="M20.5 34h23" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
    </g>
  ),
  donut: (
    <g>
      <circle cx="32" cy="32" r="20" fill="#E8A33D" />
      <path
        d="M12.6 29A20 20 0 0 1 51.5 29c.6 2.6-1.7 4.6-4 3.6-3-1.3-5.5 2-9 1-3.4-1-4.6-2.6-7.5-1.4-3 1.2-4.3 3-7.5 1.7-2.6-1-6-1-8.3-1.6-2-.6-3-1.5-2.6-3.3Z"
        fill="#D96C8A"
      />
      <circle cx="32" cy="34" r="7" fill="var(--color-bg, #F6F7F9)" />
      <path
        d="M22 24l2 2M40 22l-2 2.4M30 18l1 2.4"
        stroke="#FBEFD9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  ),
  drink: (
    <g>
      <path
        d="M21 20h22l-2.2 32a3.6 3.6 0 0 1-3.6 3.4H26.8a3.6 3.6 0 0 1-3.6-3.4L21 20Z"
        fill="#BFD8F5"
      />
      <path d="M22 33h20l-1.2 17H23.2L22 33Z" fill="#E8734A" opacity="0.85" />
      <rect x="18.5" y="15.5" width="27" height="5.5" rx="2.75" fill="#8FA6BE" />
      <path d="M36 15.5 40 6" stroke="#8FA6BE" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  ),
  sandwich: (
    <g>
      <path d="M10 26 32 12l22 14v4H10v-4Z" fill="#E8A33D" />
      <rect x="10" y="31" width="44" height="4" rx="2" fill="#7BA05B" />
      <rect x="12" y="36" width="40" height="5" rx="2.5" fill="#F2C14E" />
      <path d="M10 43h44v3c0 3.3-2.7 6-6 6H16c-3.3 0-6-2.7-6-6v-3Z" fill="#E8A33D" />
    </g>
  ),
  cake: (
    <g>
      <path d="M16 30h32v20a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V30Z" fill="#F1D9C9" />
      <path d="M16 30h32v7c-4 0-4 3-8 3s-4-3-8-3-4 3-8 3-4-3-8-3v-7Z" fill="#D96C8A" />
      <rect x="30.6" y="14" width="2.8" height="9" rx="1.4" fill="#E8734A" />
      <circle cx="32" cy="12" r="2.4" fill="#F2C14E" />
      <path d="M22 44h20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
    </g>
  ),
  tea: (
    <g>
      <path d="M16 24h28v14a12 12 0 0 1-12 12h-4a12 12 0 0 1-12-12V24Z" fill="#F1EBE3" />
      <path d="M44 27h4a6 6 0 0 1 0 12h-4v-4h3.4a2.4 2.4 0 0 0 0-4.8H44V27Z" fill="#F1EBE3" />
      <path
        d="M18 30h24v6a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10v-6Z"
        fill="#7BA05B"
        opacity="0.75"
      />
      <path
        d="M26 12c0 2.4-2.4 3-2.4 5.4M34 10c0 2.4-2.4 3-2.4 5.4"
        stroke="#C7BFB3"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  ),
  icecream: (
    <g>
      <path d="M32 58 21 34h22L32 58Z" fill="#E8A33D" />
      <path d="m24.5 41.5 15-7.5M23 37l17 1M27.5 47.5l9.5-8" stroke="#C77F2C" strokeWidth="1.4" />
      <circle cx="25.5" cy="26" r="8.5" fill="#F1D9C9" />
      <circle cx="38.5" cy="26" r="8.5" fill="#D96C8A" />
      <circle cx="32" cy="19" r="8.5" fill="#8C5A38" />
    </g>
  ),
  salad: (
    <g>
      <path d="M12 32h40a20 20 0 0 1-40 0Z" fill="#F1EBE3" />
      <circle cx="22" cy="28" r="5" fill="#7BA05B" />
      <circle cx="33" cy="25" r="6" fill="#95B972" />
      <circle cx="43" cy="29" r="4.5" fill="#C9363E" />
      <circle cx="37" cy="30" r="3" fill="#F2C14E" />
    </g>
  ),
};
