  export type Category = {
    id?: string;
    slug: string;
    nameBn?: string;
    title?: string;
    name?: string;
    icon?: string;
  };

  export type Product = {
    id: string | number;
    slug?: string;
    name?: string;
    nameBn?: string;
    title?: string;

    category?:
      | string
      | {
          slug?: string;
          nameBn?: string;
          name?: string;
        };

    categorySlug?: string;

    unit?: string;
    unitBn?: string;
    image?: string;
    emoji?: string;
    icon?: string;

    price?: number | string;
    currentPrice?: number | string;
    minPrice?: number | string;
    maxPrice?: number | string;
    averagePrice?: number | string;

    priceChange?: number | string;
    change?: number | string | { pct?: number | string };
    changePercent?: number | string;

    description?: string;
    summary?: string;

    markets?: Array<{
      name?: string;
      bazar?: string;
      price?: number | string;
      unit?: string;
    }>;

    [key: string]: unknown;
  };

  // বাংলা সংখ্যা ইংরেজি সংখ্যায় রূপান্তর
  export function normalizeNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    const normalized = String(value)
      .replace(/[০-৯]/g, (digit) =>
        String("০১২৩৪৫৬৭৮৯".indexOf(digit))
      )
      .replace(/,/g, "")
      .replace(/٫/g, ".")
      .replace(/%/g, "")
      .trim();

    if (!normalized) return null;

    const number = Number(normalized);

    return Number.isFinite(number) ? number : null;
  }

  // পণ্যের দাম পরিবর্তনের হার বের করা
  export function productChange(p: Product): number | null {
    const change = p.change;

    const value =
      p.changePercent ??
      p.priceChange ??
      (typeof change === "object" && change !== null
        ? change.pct
        : change);

    return normalizeNumber(value);
  }

  // পণ্যের নাম বের করা
  export function productName(p: Product): string {
    return p.nameBn ?? p.name ?? p.title ?? "নাম নেই";
  }

  // পণ্যের বর্তমান দাম বের করা
  export function productPrice(p: Product): number | null {
    return normalizeNumber(
      p.currentPrice ??
        p.averagePrice ??
        p.price ??
        p.minPrice
    );
  }

  // ক্যাটাগরির নাম বের করা
  export function categoryName(c: Category): string {
    return c.nameBn ?? c.name ?? c.title ?? c.slug;
  }

  // API response থেকে array বের করা
  function extractArray<T>(data: unknown): T[] {
    if (Array.isArray(data)) {
      return data as T[];
    }

    if (typeof data === "object" && data !== null) {
      const response = data as Record<string, unknown>;

      if (Array.isArray(response.data)) {
        return response.data as T[];
      }

      if (Array.isArray(response.products)) {
        return response.products as T[];
      }

      if (Array.isArray(response.categories)) {
        return response.categories as T[];
      }
    }

    return [];
  }

  // API থেকে JSON আনা
  async function fetchJson(url: string): Promise<unknown> {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // সব পণ্য আনা
  export async function getProducts(): Promise<Product[]> {
    const url =
      process.env.BAZARDOR_PRODUCTS_API ??
      "https://api.api-store.workers.dev/api/bazardor/products";

    const data = await fetchJson(url);

    return extractArray<Product>(data);
  }

  // সব ক্যাটাগরি আনা
  export async function getCategories(): Promise<Category[]> {
    const url =
      process.env.BAZARDOR_CATEGORIES_API ??
      "https://api.api-store.workers.dev/api/bazardor/categories";

    const data = await fetchJson(url);

    return extractArray<Category>(data);
  }