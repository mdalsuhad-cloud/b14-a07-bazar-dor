
import { products } from "../data/products";

function formatBanglaNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
}

function formatUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "টি",
  };

  return units[unit] ?? unit;
}

export default function PriceTicker() {
  const tickerProducts = [...products, ...products];

  return (
    <section
      aria-label="আজকের বাজারদর"
      className="overflow-hidden border-y border-green-200 bg-green-50"
    >
      <div className="ticker-track flex w-max items-center">
        {tickerProducts.map((product, index) => {
          const isUp = product.change.dir === "up";
          const isDown = product.change.dir === "down";

          return (
            <div
              key={`${product.id}-${index}`}
              className="flex shrink-0 items-center gap-2 px-5 py-3 text-sm"
            >
              <span className="text-green-700">
                {product.categoryIcon || "category"}
              </span>

              <span className="font-medium text-gray-800">
                {product.nameBn}
              </span>

              <span className="font-bold text-gray-950">
                ৳{formatBanglaNumber(product.today)}
              </span>

              <span className="text-gray-500">
                /{formatUnit(product.unit)}
              </span>

              <span
                className={
                  isUp
                    ? "font-semibold text-red-600"
                    : isDown
                      ? "font-semibold text-green-700"
                      : "font-medium text-gray-500"
                }
              >
                {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                {formatBanglaNumber(Math.abs(product.change.pct))}%
              </span>

              <span className="ml-3 text-green-300">•</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}