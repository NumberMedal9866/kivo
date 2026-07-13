import { cn } from "@/lib/utils";

/**
 * Editorial section intro: small uppercase kicker, large headline,
 * optional lead paragraph. Keeps typographic hierarchy consistent.
 */
export function SectionHeading({
  kicker,
  heading,
  lead,
  align = "left",
  className,
  headingId,
}: {
  kicker?: string;
  heading: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  headingId?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {kicker ? (
        <p className="mb-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-brand">
          {kicker}
        </p>
      ) : null}
      <h2 id={headingId} className="text-headline text-balance text-ink">
        {heading}
      </h2>
      {lead ? <p className="mt-5 text-lead text-pretty text-ink-soft">{lead}</p> : null}
    </div>
  );
}
