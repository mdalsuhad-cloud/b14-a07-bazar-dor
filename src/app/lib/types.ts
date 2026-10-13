export type Category = { id?: string; slug: string; nameBn?: string; title?: string; name?: string; icon?: string };
export type Product = {
  id: string | number; slug?: string; name?: string; nameBn?: string; title?: string;
  category?: string | { slug?: string; nameBn?: string; name?: string }; categorySlug?: string;
  unit?: string; unitBn?: string; image?: string; emoji?: string; icon?: string;
  price?: number | string; currentPrice?: number | string; minPrice?: number | string; maxPrice?: number | string; averagePrice?: number | string;
  priceChange?: number | string; change?: number | string; changePercent?: number | string; description?: string; summary?: string;
  markets?: Array<{ name?: string; bazar?: string; price?: number | string; unit?: string }>;
  [key: string]: unknown;
};
