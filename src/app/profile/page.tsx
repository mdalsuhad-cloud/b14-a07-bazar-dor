
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("Rezwan Ahmed");
  const [savedName, setSavedName] = useState("Rezwan Ahmed");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("আপনার নাম লিখুন।");
      return;
    }

    setSavedName(trimmedName);
    setName(trimmedName);
    setMessage("আপনার নাম সফলভাবে আপডেট হয়েছে।");
  };

  const handleSignOut = () => {
    const confirmed = window.confirm(
      "আপনি কি নিশ্চিত যে সাইন আউট করতে চান?"
    );

    if (confirmed) {
      // এখানে authentication system-এর signOut function যুক্ত করো।
      window.location.href = "/signin";
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f8f3] px-5 py-6 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#202820]">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও আপডেট করুন।
          </p>
        </div>

        {/* User Card */}
        <section className="rounded-2xl border border-[#dfe8df] bg-white px-5 py-5 shadow-sm md:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Image */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#eef2ee]">
                <Image
                  src="/profile.jpg"
                  alt="Profile picture"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-lg font-semibold text-[#202820]">
                  {savedName}
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  rezwanahmed@gmail.com
                </p>

                <span className="mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-[#079447]">
                  সাধারণ সদস্য
                </span>
              </div>
            </div>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-lg border border-[#dc7777] px-4 py-2 text-sm font-semibold text-[#d85d5d] transition hover:bg-[#fff5f5] sm:w-auto"
            >
              ↪️ সাইন আউট
            </button>
          </div>
        </section>

        {/* Information Card */}
        <section className="mt-5 rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-sm md:p-7">
          <h2 className="mb-6 text-base font-bold text-[#303630]">
            ব্যক্তিগত তথ্য
          </h2>

          <form onSubmit={handleUpdate}>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#3c433c]"
              >
                নাম
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setMessage("");
                  setError("");
                }}
                placeholder="আপনার নাম লিখুন"
                required
                maxLength={100}
                className="h-10 w-full rounded-lg border border-[#dfe5df] bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#079447] focus:ring-2 focus:ring-[#079447]/10"
              />
            </div>

            {/* Email */}
            <div className="mt-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#3c433c]"
              >
                ইমেইল
              </label>

              <input
                id="email"
                type="email"
                value="rezwanahmed@gmail.com"
                readOnly
                className="h-10 w-full cursor-not-allowed rounded-lg border border-[#dfe5df] bg-gray-50 px-3 text-sm text-gray-500 outline-none"
              />

              <p className="mt-1 text-xs text-gray-400">
                ইমেইল পরিবর্তন করা যাবে না।
              </p>
            </div>

            {/* Feedback */}
            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="mt-4 text-sm text-[#079447]">
                {message}
              </p>
            )}

            {/* Update Button */}
            <button
              type="submit"
              className="mt-5 h-10 w-full rounded-lg bg-[#079447] text-sm font-semibold text-white shadow-sm transition hover:bg-[#067d3d] active:scale-[0.99]"
            >
              তথ্য আপডেট করুন
            </button>
          </form>
        </section>

        {/* Back Home */}
        <Link
          href="/"
          className="mt-5 inline-block text-sm text-gray-500 transition hover:text-[#079447]"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
