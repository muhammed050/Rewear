import type { Garment, ClosetItem } from "./schemas";
const norm = (s: string) => s.toLowerCase().trim();
const families = [
  ["cream", "ivory", "white", "off-white"],
  ["brown", "tan", "camel", "beige"],
  ["blue", "navy", "denim"],
  ["red", "burgundy", "cherry"],
];
export function matchScore(a: Garment, b: Garment) {
  if (a.category !== b.category) return 0;
  const color =
    norm(a.primary_color) === norm(b.primary_color)
      ? 25
      : families.some(
            (f) =>
              f.includes(norm(a.primary_color)) &&
              f.includes(norm(b.primary_color)),
          )
        ? 15
        : 0;
  return (
    45 +
    color +
    (a.fit === b.fit ? 10 : 0) +
    (a.pattern === b.pattern ? 10 : 0) +
    (a.style_tags.some((t) => b.style_tags.map(norm).includes(norm(t)))
      ? 5
      : 0) +
    (a.season.some((t) => b.season.includes(t)) ? 5 : 0)
  );
}
export function matchCloset(
  items: Garment[],
  closet: ClosetItem[],
  version = 0,
) {
  const used = new Set<string>();
  return items.map((source) => {
    const candidates = closet
      .filter((c) => !used.has(c.id))
      .map((item) => ({ item, score: matchScore(source, item) }))
      .filter((c) => c.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    const match = candidates.length
      ? candidates[version % candidates.length]
      : null;
    if (match) used.add(match.item.id);
    return { source, candidates, match };
  });
}
