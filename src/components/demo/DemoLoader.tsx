"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { DemoLang } from "@/content/demo-menu";

const KioskDemo = dynamic(() => import("./KioskDemo").then((m) => m.KioskDemo), {
  ssr: false,
  loading: () => <DemoSkeleton />,
});

/**
 * Defers loading the interactive demo bundle until the section approaches
 * the viewport, keeping it out of the critical path.
 */
export function DemoLoader({ initialLang, label }: { initialLang: DemoLang; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {near ? <KioskDemo initialLang={initialLang} label={label} /> : <DemoSkeleton />}
    </div>
  );
}

function DemoSkeleton() {
  return (
    <div className="theme-light mx-auto w-full max-w-95 rounded-[1.8rem] bg-kiosk-bezel p-3 shadow-kiosk">
      <div className="flex h-152 flex-col items-center justify-center gap-3 rounded-[1.1rem] bg-bg">
        <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-line border-t-brand" />
      </div>
    </div>
  );
}
