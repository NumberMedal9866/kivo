import { notFound } from "next/navigation";

/** Catch-all: any unknown path inside a locale renders the localized 404. */
export default function CatchAllPage() {
  notFound();
}
