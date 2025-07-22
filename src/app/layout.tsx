/*
 * FILE: src/app/layout.tsx
 *
 * This is the root layout for the entire application. It sets up the
 * main <html> and <body> tags, loads the 'Inter' font, and applies
 * the base styling from globals.css. All other pages and layouts
 * will be rendered within this file.
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configure the Inter font for the project
const inter = Inter({ subsets: ["latin"] });

// Metadata for SEO
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
        {children}
      </body>
    </html>
  );
}


