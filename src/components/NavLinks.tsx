import Link from "next/link";



const NavLinks = async () => {
let navs: Category[] = [];

try {
const res = await fetch(
"https://api.abcz.workers.dev/api/bazardor/categories",
);




const result = await res.json();

// API response থেকে category array বের করা
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
            
         <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-3">
            {navs.map((n) => (
        <Link
                key={n.id}
                href={`/category/${n.slug}`}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-green-600"
                >
                {n.icon} {n.nameBn} 
        </Link>
        ))}
             </div>
        
        );
        };

export default NavLinks;
