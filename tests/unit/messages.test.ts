import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import ru from "../../messages/ru.json";
import uz from "../../messages/uz.json";

type Tree = { [key: string]: string | Tree };

function collectKeys(obj: Tree, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null ? collectKeys(value as Tree, path) : [path];
  });
}

describe("translation dictionaries", () => {
  const enKeys = collectKeys(en as Tree).sort();
  const ruKeys = collectKeys(ru as Tree).sort();
  const uzKeys = collectKeys(uz as Tree).sort();

  it("ru has exactly the same keys as en", () => {
    expect(ruKeys).toEqual(enKeys);
  });

  it("uz has exactly the same keys as en", () => {
    expect(uzKeys).toEqual(enKeys);
  });

  it("no empty strings in any dictionary", () => {
    for (const dict of [en, ru, uz] as Tree[]) {
      for (const key of collectKeys(dict)) {
        const value = key
          .split(".")
          .reduce<Tree | string>((acc, part) => (acc as Tree)[part]!, dict);
        expect(typeof value).toBe("string");
        expect((value as string).length).toBeGreaterThan(0);
      }
    }
  });

  it("uz uses proper turned-comma apostrophes, not straight quotes", () => {
    const flat = JSON.stringify(uz);
    expect(flat).toContain("o‘z");
    expect(flat).toContain("O‘zbekiston");
  });

  it("evidence disclaimers exist in all locales", () => {
    for (const dict of [en, ru, uz]) {
      expect(
        (dict as Tree & { evidence: { disclaimer: string } }).evidence.disclaimer.length,
      ).toBeGreaterThan(40);
    }
  });
});
