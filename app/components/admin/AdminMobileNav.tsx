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
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-bold bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>

          <Link
            href="/"
            className="px-3 py-2 text-xs font-medium text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg transition-all"
          >
            Go to Site
          </Link>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
            <div className="px-4 py-2 space-y-1 max-h-125 overflow-y-auto">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive(item.href)
                      ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="shrink-0">{item.icon}</div>
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              ))}

              {/* Logout Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 transition-all duration-200 mt-4 border-t border-gray-700 pt-4"
              >
                <LogOut size={20} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40 top-16"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
