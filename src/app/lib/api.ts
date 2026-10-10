export function productChange(p: Product): number | null {
  const change = p.change;

  const value =
    p.changePercent ??
    p.priceChange ??
    (typeof change === "object" && change !== null
      ? change.pct
      : change);

  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = String(value)
    .replace(/[০-৯]/g, (d) =>
      String("০১২৩৪৫৬৭৮৯".indexOf(d))
    )
    .replace("%", "")
    .trim();

  const n = Number(normalized);

  return Number.isFinite(n) ? n : null;
}