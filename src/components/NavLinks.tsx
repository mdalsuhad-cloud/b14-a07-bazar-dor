
import Link from "next/link";

type Category = {
  id: string | number;
  slug: string;
  icon?: string | null;
  nameBn?: string;
  name?: string;
};

type CategoryResponse = Category[] | {
  data?: Category[] | { data?: Category[] };
};

const NavLinks = async () => {
  let navs: Category[] = [];

  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/categories",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error("Categories API request failed");
    }

    const result: CategoryResponse = await res.json();

    if (Array.isArray(result)) {
      navs = result;
    } else if (Array.isArray(result.data)) {
      navs = result.data;
    } else if (Array.isArray(result.data?.data)) {
      navs = result.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return (
    <nav
      aria-label="পণ্যের ক্যাটাগরি"
      className="bg-[#f8faf8] border-y border-gray-200 rounded-b-lg"
    >
      <div className="mx-auto max-w-7xl px-5 flex min-w-max items-center gap-5 py-3 ">
        {navs.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="whitespace-nowrap text-sm font-medium text-gray-600 transition-colors hover:text-green-600"
          >
            {category.icon} {category.nameBn ?? category.name ?? category.slug}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavLinks;
