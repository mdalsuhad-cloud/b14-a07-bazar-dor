
import Link from "next/link";
import { products } from "../data/products";

const formatBn = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);

// Convert the existing change object into a signed number.
function getSignedChange(product: (typeof products)[number]) {
  if (product.change.dir === "up") return Math.abs(product.change.pct);
  if (product.change.dir === "down") return -Math.abs(product.change.pct);
  return 0;
}

// Convert API-style units into Bangla.
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

function ProductCard({
  product,
}: {
  product: (typeof products)[number];
}) {
  const change = getSignedChange(product);
  const isUp = change > 0;
  const isDown = change < 0;

  const badgeColor = isUp
    ? "bg-green-100 text-green-700"
    : isDown
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-600";

  const symbol = isUp ? "▲" : isDown ? "▼" : "—";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
    >
      {/* Product emoji / illustration */}

      <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-green-50">
        <span className="text-6xl" aria-hidden="true">
          {product.categoryIcon || "🛒"}
        </span>
      </div>


      {/* Product name */}
      <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-green-700">
        {product.nameBn}
      </h3>



      {/* Unit */}
      <p className="mt-1 text-sm text-gray-500">
        {getUnit(product.unit)}
      </p>



      {/* Price and change */}
      <div className="mt-auto pt-5">
        <p className="text-sm text-gray-500">আজকের দাম</p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xl font-extrabold text-gray-900">
            {formatBn(product.today)} টাকা
          </p>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeColor}`}
          >
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
  items: typeof products;
  marker?: string;
}) {
  return (
    <section className="py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {marker && `${marker} `}
            {title}
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-gray-50 p-6 text-gray-500">
          এই বিভাগে কোনো পণ্য নেই।
        </p>
      )}
    </section>
  );
}

export default function ProductSections() {
  // Top 6 products with rising prices
  const risers = [...products]
    .filter((product) => product.change.dir === "up")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  // Top 6 products with falling prices
  const fallers = [...products]
    .filter((product) => product.change.dir === "down")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
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
          subtitle="মোট ৩৩টি পণ্য দেখানো হচ্ছে"
          items={products}
        />
      </div>
    </main>
  );
}