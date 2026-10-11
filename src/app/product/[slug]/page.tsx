import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor";

type MarketPrice = {
  market?: string;
  division?: string;
  location?: string;
  yesterday?: number | string;
  today?: number | string;
  price?: number | string;
  min?: number | string;
  max?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
};

type Product = {
  id: string | number;
  slug: string;
  nameBn: string;
  unit: string;
  today: number | string;
  categoryIcon?: string;
  category?:
    | string
    | {
        nameBn?: string;
        name?: string;
      };
  categoryName?: string;
  yesterday?: number | string;
  previousPrice?: number | string;
  change?: {
    dir: "up" | "down" | "same";
    pct: number | string;
    amount?: number | string;
  };
  markets?: MarketPrice[];
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error("Product API error:", res.status);
      return null;
    }

    const result: unknown = await res.json();

    let products: Product[] = [];

    if (Array.isArray(result)) {
      products = result as Product[];
    } else if (result && typeof result === "object") {
      const data = (result as { data?: unknown }).data;

      if (Array.isArray(data)) {
        products = data as Product[];
      } else if (data && typeof data === "object") {
        const nestedData = (data as { data?: unknown }).data;

        if (Array.isArray(nestedData)) {
          products = nestedData as Product[];
        }
      }
    }

    return (
      products.find(
        (item) => item.slug === slug || String(item.id) === slug
      ) ?? null
    );
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

function toNumber(
  value: number | string | undefined,
  fallback = 0
): number {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const normalized = String(value)
    .replace(/[০-৯]/g, (digit) =>
      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
    )
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  const number = Number(normalized);
  return Number.isFinite(number) ? number : fallback;
}

const formatBn = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);

function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
  };

  return units[unit?.toLowerCase()] || `প্রতি ${unit || "একক"}`;
}

function getCategoryName(product: Product): string {
  if (typeof product.category === "string") {
    return product.category;
  }

  if (product.category?.nameBn) {
    return product.category.nameBn;
  }

  if (product.category?.name) {
    return product.category.name;
  }

  return product.categoryName || "অন্যান্য";
}

function LoadingProduct() {
  return (
    <main className="min-h-screen bg-[#f5f9f5] px-3 py-6 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-[1200px] animate-pulse space-y-4">
        <div className="h-36 rounded-2xl bg-white" />
        <div className="h-40 rounded-2xl bg-white" />
        <div className="h-64 rounded-2xl bg-white" />
      </div>
    </main>
  );
}

async function ProductContent({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const price = toNumber(product.today, Number.NaN);
  const previousPrice = toNumber(
    product.yesterday ?? product.previousPrice,
    Number.NaN
  );

  const changePercent = toNumber(product.change?.pct);
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  const symbol = isUp ? "▲" : isDown ? "▼" : "—";

  const changeColor = isUp
    ? "text-red-600"
    : isDown
      ? "text-green-600"
      : "text-gray-500";

  const categoryName = getCategoryName(product);
  const markets = product.markets ?? [];

  const tableRows: MarketPrice[] =
    markets.length > 0
      ? markets
      : [
          {
            market: "সার্বিক বাজার",
            location: "বাংলাদেশ",
            yesterday: Number.isFinite(previousPrice)
              ? previousPrice
              : undefined,
            today: product.today,
            price: product.today,
          },
        ];

  const marketPrices = tableRows
    .map((item) =>
      toNumber(item.today ?? item.price, Number.NaN)
    )
    .filter((value) => Number.isFinite(value));

  const minPrice = marketPrices.length
    ? Math.min(...marketPrices)
    : price;

  const maxPrice = marketPrices.length
    ? Math.max(...marketPrices)
    : price;

  const averagePrice = marketPrices.length
    ? marketPrices.reduce((sum, value) => sum + value, 0) /
      marketPrices.length
    : price;

  return (
    <main className="min-h-screen bg-[#f5f9f5] px-3 py-6 text-gray-800 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Product head */}
        <article className="rounded-2xl border border-[#e1e9e2] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f1f6f1] text-3xl sm:h-16 sm:w-16 sm:text-4xl">
                {product.categoryIcon || "🛒"}
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  {product.nameBn}
                </h1>

                <p className="mt-1 text-xs text-gray-500">
                  {getUnit(product.unit)}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  ক্যাটাগরি: {categoryName}
                </p>

                <div className={`mt-2 text-sm font-bold ${changeColor}`}>
                  {isUp || isDown ? (
                    <>
                      গতকালের তুলনায় আজ দাম{" "}
                      {formatBn(
                        product.change?.amount !== undefined
                          ? Math.abs(toNumber(product.change.amount))
                          : Number.isFinite(previousPrice)
                            ? Math.abs(price - previousPrice)
                            : 0
                      )}{" "}
                      টাকা {isUp ? "বেড়েছে" : "কমেছে"}।
                    </>
                  ) : (
                    "দামের পরিবর্তনের তথ্য পাওয়া যায়নি।"
                  )}
                </div>
              </div>
            </div>

            {/* Today's price */}
            <div className="w-full rounded-xl bg-[#f4f8f4] px-5 py-4 text-center md:w-[190px]">
              <p className="text-xs text-gray-500">আজকের দাম</p>

              <p className="mt-1 text-2xl font-extrabold text-gray-900">
                {Number.isFinite(price)
                  ? `৳${formatBn(price)}`
                  : "—"}
              </p>

              <p className="text-xs text-gray-500">
                {getUnit(product.unit)}
              </p>

              <p className={`mt-2 text-xs font-bold ${changeColor}`}>
                {symbol} {formatBn(Math.abs(changePercent))}%
              </p>
            </div>
          </div>
        </article>

        {/* Price summary */}
        <section className="mt-4 rounded-2xl border border-[#e1e9e2] bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-bold text-gray-800">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e5ebe5] p-4">
              <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
              <p className="mt-1 text-xl font-extrabold text-green-600">
                {Number.isFinite(minPrice)
                  ? `৳${formatBn(minPrice)}`
                  : "—"}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                সবচেয়ে কম দামের বাজার
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ebe5] p-4">
              <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>
              <p className="mt-1 text-xl font-extrabold text-red-600">
                {Number.isFinite(maxPrice)
                  ? `৳${formatBn(maxPrice)}`
                  : "—"}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                সবচেয়ে বেশি দামের বাজার
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ebe5] p-4">
              <p className="text-xs text-gray-500">গড় দাম</p>
              <p className="mt-1 text-xl font-extrabold text-gray-800">
                {Number.isFinite(averagePrice)
                  ? `৳${formatBn(averagePrice)}`
                  : "—"}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                {getUnit(product.unit)} হিসাবে
              </p>
            </div>
          </div>
        </section>

        {/* Market price table */}
        <section className="mt-4 rounded-2xl border border-[#e1e9e2] bg-white p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-bold text-gray-800">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="overflow-x-auto rounded-xl border border-[#e1e9e2]">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead className="bg-[#f6f9f6]">
                <tr className="border-b border-[#dfe7df] text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">বাজার</th>
                  <th className="px-4 py-3 font-medium">বিভাগ</th>
                  <th className="px-4 py-3 text-right font-medium">
                    সর্বনিম্ন
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    সর্বাধিক
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    গড়
                  </th>
                </tr>
              </thead>

              <tbody>
                {tableRows.map((market, index) => {
                  const min = toNumber(
                    market.min ??
                      market.minPrice ??
                      market.today ??
                      market.price,
                    Number.NaN
                  );

                  const max = toNumber(
                    market.max ??
                      market.maxPrice ??
                      market.today ??
                      market.price,
                    Number.NaN
                  );

                  const average =
                    Number.isFinite(min) && Number.isFinite(max)
                      ? (min + max) / 2
                      : Number.NaN;

                  return (
                    <tr
                      key={`${market.market ?? "market"}-${index}`}
                      className="border-b border-[#e3e9e3] last:border-0 hover:bg-[#f8faf8]"
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {market.market || "—"}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {market.division || market.location || "—"}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-green-700">
                        {Number.isFinite(min)
                          ? `৳${formatBn(min)}`
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-red-600">
                        {Number.isFinite(max)
                          ? `৳${formatBn(max)}`
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        {Number.isFinite(average)
                          ? `৳${formatBn(average)}`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Home page link */}
        <div className="mt-5">
          <Link
            href="/#সব-পণ্য"
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            ← সব পণ্যে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingProduct />}>
      <ProductContent params={params} />
    </Suspense>
  );
}