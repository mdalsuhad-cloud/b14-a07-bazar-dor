"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "../app/lib/auth-client";
const Header = () => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [today] = useState(() =>
    new Intl.DateTimeFormat("bn-BD", {
      dateStyle: "full",
      timeZone: "Asia/Dhaka",
    }).format(new Date())
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // বাইরে ক্লিক করলে Dropdown বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Better Auth Sign Out
  const handleSignOut = async () => {
    try {
      setSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        alert(error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      setMenuOpen(false);
      router.replace("/signin");
      router.refresh();
    } catch {
      alert("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  };

  const userName = user?.name || "ব্যবহারকারী";
  const userEmail = user?.email || "";
  const userImage = user?.image;

  return (
    <header className="border-y border-gray-200 bg-[#f8faf8]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">

        {/* Logo + Brand + Bangla Date */}
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 items-center justify-center rounded-xl bg-green-600 p-2 shadow-sm">
            <Image
              src="/images/logo-icon.png"
              alt="বাজার দর Logo"
              width={35}
              height={35}
              className="object-contain"
              priority
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-800">
              বাজার দর
            </h1>

            <p className="text-xs text-gray-500">
              {today || "তারিখ লোড হচ্ছে..."}
            </p>
          </div>
        </Link>

        {/* Authentication / User Menu */}
        <div ref={menuRef} className="relative shrink-0">

          {/* Loading Session */}
          {isPending ? (
            <div
              className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"
              aria-label="অ্যাকাউন্ট লোড হচ্ছে"
            />
          ) : user ? (
            <>
              {/* Logged-in User Button */}
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5 transition hover:border-green-500 hover:bg-green-50"
              >
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 font-bold text-green-800">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName}
                      fill
                      sizes="36px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>

                <span className="hidden max-w-32 truncate text-sm font-semibold text-gray-800 sm:block">
                  {userName}
                </span>

                <svg
                  className={`mr-1 h-4 w-4 text-gray-500 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
                >
                  {/* User Details */}
                  <div className="border-b border-gray-100 bg-green-50/70 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-lg font-bold text-green-800">
                        {userImage ? (
                          <Image
                            src={userImage}
                            alt={userName}
                            fill
                            sizes="48px"
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          userName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {userName}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="p-2">
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path
                          strokeLinecap="round"
                          d="M4 21v-2a8 8 0 0 1 16 0v2"
                        />
                      </svg>

                      আমার প্রোফাইল
                    </Link>

                    
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-gray-100 p-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 17l5-5-5-5m5 5H3m9-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"
                        />
                      </svg>

                      {signingOut
                        ? "সাইন আউট হচ্ছে..."
                        : "সাইন আউট"}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Not Logged In */
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="rounded-lg border border-green-700 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50 sm:px-4"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800 sm:px-4"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
