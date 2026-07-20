/**
 * Industry evidence entries shown in the "Why self-ordering works" section.
 *
 * IMPORTANT EDITORIAL RULES (see the section itself for the on-page
 * disclaimer):
 * - These are EXTERNAL benchmarks, never kiyo results.
 * - Do not strip context: combined digital-channel figures must stay
 *   labeled as combined figures.
 * - Localized wording lives in messages/<locale>.json under `evidence.items`,
 *   keyed by the ids below. This file holds the structural data (source
 *   URLs, publication anchors) so entries can be swapped in one place.
 */
export type EvidenceEntry = {
  id: "technomic" | "shakeshack" | "arcos" | "mcdonalds";
  sourceUrl: string;
};

export const evidence: EvidenceEntry[] = [
  {
    id: "technomic",
    sourceUrl:
      "https://www.investopedia.com/why-ordering-food-at-a-kiosk-can-be-smooth-easy-and-more-expensive-than-you-realize-11716597",
  },
  {
    id: "shakeshack",
    sourceUrl:
      "https://www.sec.gov/Archives/edgar/data/1620533/000162053318000015/shak-20171227_10k.htm",
  },
  {
    id: "arcos",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/1508478/000095010326004386/dp243886_6k.htm",
  },
  {
    id: "mcdonalds",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/63908/000006390823000012/mcd-20221231.htm",
  },
];
