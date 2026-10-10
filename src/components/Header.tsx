"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [today] = useState(() =>
    new Intl.DateTimeFormat("bn-BD", {
      dateStyle: "full",
      timeZone: "Asia/Dhaka",
    }).format(new Date())
  );

  return (
    <header className="bg-[#f8faf8] border-y border-gray-200">
      <div className="mx-auto flex max-w-7xl  items-center justify-between px-5 py-3">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl bg-green-600 p-2 shadow-sm">
            <Image
              src="/images/logo-icon.png"
              alt="বাজার দর Logo"
              width={35}
              height={35}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              বাজার দর
            </h1>
            <p className="text-xs text-gray-500">
              {today || "তারিখ লোড হচ্ছে..."}
            </p>
          </div>
        </Link>

        {/* Sign In / Sign Up */}
        <div className="flex items-center gap-2">
          <Link
            href="/signin"
            className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            সাইন আপ
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;