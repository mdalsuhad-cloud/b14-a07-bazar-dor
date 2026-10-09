import type { Category, Product } from "./types";

export const API_BASE = "https://api.abcz.workers.dev/api/bazardor";
async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json() as Promise<T>;
}
// Some APIs return a plain array; others wrap it in { data: [...] }.
function unwrapList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of ["data", "products", "categories", "items", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}
function unwrapOne<T>(value: unknown): T | null {
  if (!value || typeof value !== "object") return (value as T) ?? null;
  const obj = value as Record<string, unknown>;
  for (const key of ["data", "product", "category", "item"]) {
    if (obj[key] && typeof obj[key] === "object") return obj[key] as T;
  }
  return value as T;
}
export async function getProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return unwrapList<Product>(await request<unknown>(`/products${query}`));
}
export async function getProduct(id: string): Promise<Product | null> {
  try { return unwrapOne<Product>(await request<unknown>(`/products/${encodeURIComponent(id)}`)); }
  catch { return null; }
}
export async function getCategories(): Promise<Category[]> {
  return unwrapList<Category>(await request<unknown>("/categories"));
}
export function productName(p: Product) { return String(p.nameBn ?? p.name ?? p.title ?? "পণ্যের নাম নেই"); }
export function productPrice(p: Product): number {
  const value = p.currentPrice ?? p.price ?? p.averagePrice ?? p.minPrice ?? 0;
  const n = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.০-৯]/g, "").replace(/[০-৯]/g, d => String("০১২৩৪৫৬৭৮৯".indexOf(d))));
  return Number.isFinite(n) ? n : 0;
}
export function toBanglaDigits(value: number | string) {
  return String(value).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[Number(d)]);
}
export function money(value: number | string) { return `${toBanglaDigits(Number(value || 0).toLocaleString("en-US"))} টাকা`; }
export function productCategory(p: Product): string {
  if (typeof p.category === "string") return p.category;
  return p.category?.slug ?? p.categorySlug ?? "";
}
export function productChange(p: Product): number | null {
  const v = p.changePercent ?? p.priceChange ?? p.change;
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(v).replace(/[০-৯]/g, d => String("০১২৩৪৫৬৭৮৯".indexOf(d))).replace("%", ""));
  return Number.isFinite(n) ? n : null;
}
