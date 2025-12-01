"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/config/constants";
import { cn } from "@/lib/utils/cn";

/**
 * Navbar Component
 * Responsive navigation bar with mobile menu
 */
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-[5px] text-neutral-400 m-4 rounded-2xl z-50 border border-gray-300/10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex gap-4 items-center hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.svg"
            width={40}
            height={40}
            alt="East Store"
            priority
          />
          <span className="hidden md:block bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent font-bold text-2xl">
            East Store.
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-all",
                isActive(item.href)
                  ? "text-white font-semibold"
                  : "hover:text-white hover:underline"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 pt-4 border-t border-gray-300/10">
          <div className="flex flex-col space-y-3 px-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-all",
                  isActive(item.href)
                    ? "text-white font-semibold"
                    : "text-neutral-400 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

Navbar.displayName = "Navbar";
