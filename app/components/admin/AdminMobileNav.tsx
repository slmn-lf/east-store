"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Settings,
  Users,
  ShoppingCart,
  Image as ImageIcon,
  LogOut,
  Ruler,
  CreditCard,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AdminMobileNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminMobileNavProps {
  items?: AdminMobileNavItem[];
  onLogout: () => void;
  title?: string;
}

const defaultItems: AdminMobileNavItem[] = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
  { name: "Products", href: "/admin/products", icon: <Package size={20} /> },
  {
    name: "Size Cards",
    href: "/admin/size-cards",
    icon: <Ruler size={20} />,
  },
  {
    name: "Artwork",
    href: "/admin/artwork",
    icon: <ImageIcon size={20} />,
  },
  {
    name: "Preorder",
    href: "/admin/preorder",
    icon: <ShoppingCart size={20} />,
  },
  { name: "Payments", href: "/admin/payments", icon: <CreditCard size={20} /> },
  { name: "Mail", href: "/admin/mail", icon: <Mail size={20} /> },
  { name: "User Settings", href: "/admin/user", icon: <Users size={20} /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
];

export const AdminMobileNav: React.FC<AdminMobileNavProps> = ({
  items = defaultItems,
  onLogout,
  title = "Admin",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href) && href !== "/admin";
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-linear-to-r from-gray-900 to-gray-800 text-white border-b border-gray-700 z-50 md:hidden">
        <div className="h-12 md:h-16 px-2 md:px-4 flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-700 rounded transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <h1 className="text-xs md:text-lg font-bold bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent truncate flex-1 mx-2">
            {title}
          </h1>

          <Link
            href="/"
            className="hidden sm:block px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm font-medium text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded transition-all shrink-0"
          >
            Go to Site
          </Link>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <div className="px-2 md:px-4 py-1 space-y-0.5">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded transition-all duration-200 text-xs md:text-sm",
                    isActive(item.href)
                      ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="shrink-0 w-4 h-4 md:w-5 md:h-5">
                    {item.icon}
                  </div>
                  <span className="font-medium truncate">{item.name}</span>
                </Link>
              ))}

              {/* Go to Site Button */}
              <Link
                href="/"
                className="sm:hidden flex items-center gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-200 text-xs md:text-sm font-medium mt-2 border-t border-gray-700 pt-2 md:pt-2.5"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span className="font-medium">Go to Site</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded text-red-300 hover:bg-red-500/20 transition-all duration-200 mt-2 border-t border-gray-700 pt-2 md:pt-2.5 text-xs md:text-sm"
              >
                <LogOut size={16} className="md:w-5 md:h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40 top-12"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
