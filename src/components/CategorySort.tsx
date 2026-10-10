    "use client";

    import { useMemo, useState } from "react";

    type Product = {
    id: string | number;
    nameBn?: string;
    name?: string;
    title?: string;
    image?: string;
    emoji?: string;
    categoryIcon?: string;
    price?: number | string;
    currentPrice?: number | string;
    today?: number | string;
    unit?: string;
    category?: string | { slug?: string; id?: string };
    categorySlug?: string;
    slug?: string;
    };

    type Category = {
    id?: string;
    slug: string;
    nameBn?: string;
    name?: string;
    icon?: string;
    };

    type Props = {
    products: Product[];
    categories: Category[];
    };

    

    function getPrice(product: Product): number | null {
    const raw = product.currentPrice ?? product.today ?? product.price;

    if (raw === undefined || raw === null || raw === "") return null;

    const normalized = String(raw)
        .replace(/[০-৯]/g, (digit) =>
        String("০১২৩৪৫৬৭৮৯".indexOf(digit))
        )
        .replace(/,/g, "")
        .replace(/[^\d.-]/g, "");

    const value = Number(normalized);

    return Number.isFinite(value) ? value : null;
    }

    function getName(product: Product): string {
    return product.nameBn ?? product.name ?? product.title ?? "পণ্যের নাম নেই";
    }

    function formatPrice(value: number | null): string {
    if (value === null) return "দাম পাওয়া যায়নি";

    return new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2,
    }).format(value);
    }

    function getProductIcon(
    product: Product,
    categories: Category[]
    ): string {
    const categorySlug =
        typeof product.category === "string"
        ? product.category
        : product.category?.slug ??
            product.category?.id ??
            product.categorySlug ??
            "";

    const category = categories.find(
        (item) =>
        item.slug === categorySlug ||
        item.id === categorySlug
    );

    return (
        product.emoji ??
        product.categoryIcon ??
        category?.icon ??
        "🛒"
    );
    }

    export default function CategorySort({
    products,
    categories,
    }: Props) {
    const [sortBy, setSortBy] = useState("default");

    const sortedProducts = useMemo(() => {
        const result = [...products];

        switch (sortBy) {
        case "price-low":
            return result.sort((a, b) => {
            const priceA = getPrice(a);
            const priceB = getPrice(b);

            if (priceA === null) return priceB === null ? 0 : 1;
            if (priceB === null) return -1;

            return priceA - priceB;
            });

        case "price-high":
            return result.sort((a, b) => {
            const priceA = getPrice(a);
            const priceB = getPrice(b);

            if (priceA === null) return priceB === null ? 0 : 1;
            if (priceB === null) return -1;

            return priceB - priceA;
            });

        default:
            return result;
        }
    }, [products, sortBy]);

    return (
        <section>
        {/* Sort control */}
        <div className="mb-5 flex items-center justify-end rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
            <label
                htmlFor="sort-products"
                className="whitespace-nowrap text-sm font-medium text-gray-700"
            >
                সাজান:
            </label>

            <select
                id="sort-products"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="max-w-[230px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
                <option value="default">ডিফল্ট</option>
                <option value="price-low">দাম: কম থেকে বেশি</option>
                <option value="price-high">দাম: বেশি থেকে কম</option>
            </select>
            </div>
        </div>

        <p className="mb-2 ml-4 text-sm text-gray-600">
            মোট{" "}
            <span className="font-bold text-gray-900">
            {new Intl.NumberFormat("bn-BD").format(products.length)}
            </span>{" "}
            টি পণ্য দেখানো হচ্ছে।
        </p>

        {/* Product grid */}
        {sortedProducts.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">
                এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
            </p>
            </div>
        ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sortedProducts.map((product) => {
                const name = getName(product);
                const price = getPrice(product);
                const icon = getProductIcon(product, categories);

                return (
                <article
                    key={product.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
                >
                    {product.image? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={product.image}
                        alt={name}
                        className="mb-3 h-32 w-full rounded-lg object-contain"
                    />

                    ) : (
                    <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-green-50 text-4xl">
                        {icon}
                    </div>
                    
                    )}
                        {product.unit && (
                    <p className="mt-1 text-xs text-gray-500">
                        প্রতি {product.unit}
                    </p>
                    )}
                    <h2 className="font-semibold text-gray-900">
                    {name}
                    </h2>

                    <p className="mt-2 text-lg font-bold text-green-700">
                    {price === null
                        ? formatPrice(price)
                        : `৳${formatPrice(price)}`}
                    </p>
                </article>
                );
            })}
            </div>
        )}
        </section>
    );
    }
