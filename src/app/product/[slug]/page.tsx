
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "../../../data/products";

type ProductDetail = {
  slug: string;
  nameBn: string;
  unit: string;
  emoji: string;
  price: number;
  changePercent: number;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug) as
    | ProductDetail
    | undefined;

  if (!product) notFound();

  const price = new Intl.NumberFormat("bn-BD").format(product.price);
  const change = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(Math.abs(product.changePercent));
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <Link href="/#সব-পণ্য" className="text-green-700 hover:underline">
        ← সব পণ্যে ফিরে যান
      </Link>

      <div className="mt-6 rounded-3xl border bg-white p-8 shadow-sm sm:p-12">
        <div className="flex h-40 items-center justify-center rounded-2xl bg-green-50">
          <span className="text-8xl">{product.emoji}</span>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          {product.nameBn}
        </h1>

        <p className="mt-2 text-gray-500">{product.unit}</p>

        <p className="mt-6 text-sm text-gray-500">আজকের দাম</p>
        <p className="mt-1 text-3xl font-extrabold text-green-700">
          {price} টাকা
        </p>

        <p className="mt-4 text-gray-600">
          দামের পরিবর্তন: {product.changePercent > 0
            ? `▲ ${change}%`
            : product.changePercent < 0
              ? `▼ ${change}%`
              : "— ০%"}
        </p>
      </div>
    </main>
  );
}