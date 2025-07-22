import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/layout/PageLoader"; // Import the loader
import { Suspense } from "react"; // Import Suspense

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wanzami - Watch Movies & Series Online",
  description: "Your favorite place to watch the latest movies, series, and exclusive content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {/* Wrap PageLoader in Suspense */}
        <Suspense>
          <PageLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
