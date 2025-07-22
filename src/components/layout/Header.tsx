import Link from "next/link";
import Image from "next/image";
import { Search, Bell } from "lucide-react";
import { getUserSession } from "@/lib/auth";
import MobileNav from "./MobileNav";
import UserNav from "./UserNav";

// The Header is an async Server Component
const Header = async () => {
  const { isLoggedIn } = await getUserSession();

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/discover", label: "Discover" },
    { href: "/releases", label: "Movie Release" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold flex items-center space-x-2">
              <Image src="/images/logo.png" alt="Wanzami Logo" width={32} height={32} />
              <span className="hidden sm:inline font-bold text-xl">Wanzami</span>
            </Link>
            <nav className="hidden lg:flex items-center space-x-6 text-gray-300">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white transition-colors duration-200 text-sm font-medium">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white">
              <Search size={20} />
            </button>
            <button className="text-gray-300 hover:text-white">
              <Bell size={20} />
            </button>
            
            {isLoggedIn ? (
              <UserNav />
            ) : (
              <Link href="/login" className="hidden lg:block bg-theme-orange text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
                Login
              </Link>
            )}
            
            <MobileNav navLinks={navLinks} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;