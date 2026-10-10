
import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import PriceTicker from "../components/PriceTicker";
import NavLinks from "@/components/NavLinks";

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>

        <div className="sticky top-0 z-50 bg-white"></div>
        <div className="sticky top-0 z-50 bg-white">
          <Header />
          <NavLinks />
          <PriceTicker />
          </div>
        <main>{children}</main>

        
      </body>
    </html>
  );
}