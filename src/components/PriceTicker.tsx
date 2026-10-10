  type Product = {
          id: string | number;
          nameBn: string;
          today: number;
          unit: string;
          categoryIcon?: string;
          change: {
            dir: "up" | "down" | "same";
            pct: number;
          };
      };

  const API_URL = "https://openapi.programming-hero.com/api/bazardor";

  async function getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_URL}/products`, {
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        console.error("Price ticker API request failed:", res.status);
        return [];
      }

      const result = await res.json();

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.data)
            ? result.data.data
            : [];

      return data;
    } catch (error) {
      console.error("Failed to fetch ticker products:", error);
      return [];
    }
  }

  function formatBanglaNumber(value: number) {
    return new Intl.NumberFormat("bn-BD", {
      maximumFractionDigits: 1,
    }).format(value);
  }

  function formatUnit(unit: string) {
    const units: Record<string, string> = {
      kg: "কেজি",
      liter: "লিটার",
      litre: "লিটার",
      dozen: "ডজন",
      piece: "টি",
      pcs: "টি",
    };

    return units[unit?.toLowerCase()] ?? unit;
  }

  export default async function PriceTicker() {
    const products = await getProducts();

    if (products.length === 0) {
      return null;
    }

    // Duplicate products to create a continuous ticker loop.
    const tickerProducts = [...products, ...products];

    return (
      <section
        aria-label="আজকের বাজারদর"
        className="overflow-hidden border-y border-gray-200 bg-[#f8faf8]"
      >
        <div className="ticker-track flex w-max items-center">
          {tickerProducts.map((product, index) => {
            const isUp = product.change?.dir === "up";
            const isDown = product.change?.dir === "down";
            const change = Number(product.change?.pct ?? 0);

            return (
              <div
                key={`${product.id}-${index}`}
                className="flex shrink-0 items-center gap-2 px-5 py-3 text-sm"
              >
                <span className="text-base text-green-700">
                  {product.categoryIcon || "🛒"}
                </span>

                <span className="font-medium text-gray-800">
                  {product.nameBn}
                </span>

                <span className="font-bold text-gray-950">
                  ৳{formatBanglaNumber(Number(product.today))}
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
                  {formatBanglaNumber(Math.abs(change))}%
                </span>

                <span className="ml-3 text-green-300">•</span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
