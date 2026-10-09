"use client";

import Image from "next/image";
import { useEffect, useState } from "react";


const Header = () => {
const [today, setToday] = useState("");

useEffect(() => {
const formattedDate = new Intl.DateTimeFormat("bn-BD", {
dateStyle: "full",
timeZone: "Asia/Dhaka",
}).format(new Date());


setToday(formattedDate);


}, []);

return ( <header className="bg-white shadow-sm"> <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
{/* Logo + Brand */} <div className="flex items-center gap-3"> <div className="flex items-center justify-center rounded-xl bg-green-600 p-2 shadow-sm"> <Image
           src="/images/logo-icon.png"
           alt="বাজার দর Logo"
           width={35}
           height={35}
           className="object-contain"
         /> </div>


      <div>
        <h1 className="text-xl font-bold text-gray-800">
          বাজার দর
        </h1>
        <p className="text-xs text-gray-500">
          {today || "তারিখ লোড হচ্ছে..."}
        </p>
      </div>
    </div>

    {/* Sign In / Sign Up */}
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-green-600"
      >
        সাইন ইন
      </button>

      <button
        type="button"
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
      >
        সাইন আপ
      </button>
    </div>
  </div>

 
</header>


);
};

export default Header;
