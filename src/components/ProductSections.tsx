  import Link from "next/link";

  type Product = {
    id: string | number;
    slug: string;
    nameBn: string;
    unit: string;
    today: number;
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

      if (!res.ok) return [];

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
      console.error("Failed to load products:", error);
      return [];
    }
  }

  const formatBn = (value: number) =>
    new Intl.NumberFormat("bn-BD", {
      maximumFractionDigits: 1,
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

    return units[unit.toLowerCase()] || `প্রতি ${unit}`;
  }

  function ProductCard({ product }: { product: Product }) {
    const change = product.change?.pct ?? 0;
    const isUp = product.change?.dir === "up";
    const isDown = product.change?.dir === "down";

    const badgeColor = isUp
      ? "bg-red-100 text-red-700"
      : isDown
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-600";

    const symbol = isUp ? "▲" : isDown ? "▼" : "—";

    return (
      <Link
        href={`/product/${product.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
      >
    
          {/* Product icon, name and unit */}
          <div className="mb-4 flex min-h-28 items-center gap-4 p-4">
          
            <span
              className="shrink-0 text-5xl rounded-xl bg-gray-100"
              aria-hidden="true"
            >
              {product.categoryIcon || "🛒"}
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {product.nameBn}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {getUnit(product.unit)}
              </p>
            </div>
          </div>

          

        <div className="mt-auto pt-5">
          <p className="text-sm text-gray-500">আজকের দাম</p>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xl font-extrabold text-gray-900">
              ৳{formatBn(product.today)}
            </p>

            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeColor}`}>
              {symbol} {formatBn(Math.abs(change))}%
            </span>
          </div>
        </div>
      </Link>
    );
  }

  function ProductGroup({
    title,
    subtitle,
    items,
    marker,
  }: {
    title: string;
    subtitle: string;
    items: Product[];
    marker?: string;
  }) {
    return (
      <section className="border-b border-gray-100 py-8 last:border-b-0">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {marker && `${marker} `}
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            {subtitle}
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-500">
            এই বিভাগে কোনো পণ্য নেই।
          </p>
        )}
      </section>
    );
  }

  export default async function ProductSections() {
    const products = await getProducts();

    const risers = products
      .filter((product) => product.change?.dir === "up")
      .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
      .slice(0, 6);

    const fallers = products
      .filter((product) => product.change?.dir === "down")
      .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
      .slice(0, 6);

    return (
      <main className="mx-auto max-w-7xl px-5 py-8">
        <ProductGroup
          title="আজ দাম বেড়েছে"
          subtitle=""
          marker="▲"
          items={risers}
        />

        <ProductGroup
          title="আজ দাম কমেছে"
          subtitle=""
          marker="▼"
          items={fallers}
        />

        <div id="সব-পণ্য" className="scroll-mt-6">
          <ProductGroup
            title="সব পণ্য"
            subtitle={`মোট ${formatBn(products.length)} টি পণ্য দেখানো হচ্ছে`}
            items={products}
          />
        </div>
      </main>
    );
  }
