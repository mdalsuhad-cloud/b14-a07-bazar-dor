    import Link from "next/link";
    import CategorySort from "@/components/CategorySort";

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
      params: Promise<{ slug: string }>;
    };

    const API_URL = "https://openapi.programming-hero.com/api/bazardor";

    async function request(path: string): Promise<unknown> {
      const res = await fetch(`${API_URL}${path}`, {
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }

      return res.json();
    }

    function unwrapList<T>(value: unknown): T[] {
      let current = value;

      for (let i = 0; i < 4; i++) {
        if (Array.isArray(current)) return current as T[];

        if (!current || typeof current !== "object") return [];

        const obj = current as Record<string, unknown>;
        const next =
          obj.data ??
          obj.products ??
          obj.categories ??
          obj.items ??
          obj.results;

        if (next === undefined) return [];

        current = next;
      }

      return Array.isArray(current) ? (current as T[]) : [];
    }

    async function getProducts(): Promise<Product[]> {
      try {
        return unwrapList<Product>(await request("/products"));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
      }
    }

    async function getCategories(): Promise<Category[]> {
      try {
        return unwrapList<Category>(await request("/categories"));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
      }
    }

    function getCategorySlug(product: Product): string {
      if (typeof product.category === "string") {
        return product.category;
      }

      return (
        product.category?.slug ??
        product.category?.id ??
        product.categorySlug ??
        ""
      );
    }

    export default async function CategoryPage({ params }: Props) {
      const { slug } = await params;

      const [allProducts, categories] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      const category = categories.find(
        (item) => item.slug === slug || item.id === slug
      );

      const products = allProducts.filter(
        (product) => getCategorySlug(product) === slug
      );

      const title = category?.nameBn ?? category?.name ?? slug;

      const formatBn = (value: number) =>
        new Intl.NumberFormat("bn-BD").format(value);

      return (
        <main className="min-h-screen bg-[#f7faf7] px-5 py-8">
          <div className="mx-auto max-w-7xl">


            {/* Category Head*/}
            <header className="mb-7 mt-5 rounded-xl border border-gray-100 bg-white px-5 py-5 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {category?.icon ?? ""} {title}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                মোট {formatBn(products.length)} টি পণ্যের আজকের দাম ও পরিবর্তন
              </p>
            </header>
              
            

            {/* Sort by*/}

            {products.length > 0 ? (
              <CategorySort
                    products={products}
                    categories={categories}
                  />
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                
                <Link
                  href="/"
                  className="mt-4 inline-block text-sm font-medium text-green-700 hover:underline"
                >
                  ← সব পণ্য দেখুন
                </Link>
              </div>
            )}
          </div>
        </main>
      );
    }
