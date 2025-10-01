"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

const navigationLinks = [
  { href: "/collections/drinkware", label: "Drinkware" },
  { href: "/collections/serveware", label: "Serveware" },
  { href: "/collections/dining", label: "Dining" },
  { href: "/collections/storage-essentials", label: "Storage Essentials" },
  { href: "/collections", label: "Our Collection" },
  { href: "/pages/about-us", label: "About Us" },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2f411c9e-3aaa-48cc-96c2-28133b118dbc-meviliving-com/assets/images/mevi_png_2-1.png?"
              alt="Mevi Living"
              width={110}
              height={38}
              className="h-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button
              aria-label="Search"
              className="text-foreground hover:text-accent transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="text-foreground hover:text-accent transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="text-foreground hover:text-accent transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="lg:hidden text-foreground hover:text-accent transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-6 space-y-4 border-t border-border">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-foreground hover:text-accent transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}