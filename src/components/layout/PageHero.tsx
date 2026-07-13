import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

/** Shared intro band for detail pages — dark chapter, matching the hero. */
export function PageHero({
  kicker,
  title,
  lead,
  path,
  breadcrumbLabel,
}: {
  kicker: string;
  title: string;
  lead: string;
  path: string;
  breadcrumbLabel: string;
}) {
  return (
    <div className="chapter-dark">
      <Container className="relative pb-16 pt-28 md:pb-20 md:pt-36">
        <Breadcrumbs current={breadcrumbLabel} path={path} dark />
        <p className="mt-8 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-brand-bright">
          {kicker}
        </p>
        <h1 className="mt-3 max-w-3xl text-headline text-balance text-white">{title}</h1>
        <p className="mt-5 max-w-2xl text-lead text-pretty text-white/60">{lead}</p>
      </Container>
    </div>
  );
}
