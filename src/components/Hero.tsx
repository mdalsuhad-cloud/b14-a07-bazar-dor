
"use client";

import Image from "next/image";

export default function Hero() {
  const today = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <section className="overflow-hidden bg-green-50">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">


       
        <div>
          <p className="mb-4 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
            {today}
          </p>

          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            সব পণ্য দেখুন
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Right image */}

        <div className="relative mx-auto w-full max-w-xl">
          <Image
            src="/images/bazar-hero.png"
            alt="তাজা শাকসবজি ও নিত্যপ্রয়োজনীয় পণ্যের বাজার"
            width={700}
            height={520}
            priority
            className="h-auto w-full rounded-3xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
