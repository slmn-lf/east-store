"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  Users,
  ShoppingCart,
  Image as ImageIcon,
  Mail,
  CreditCard,
  Ruler,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface AdminSidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  items?: AdminSidebarItem[];
  isOpen: boolean;
  onToggle: () => void;
}

const defaultItems: AdminSidebarItem[] = [
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

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  items = defaultItems,
  isOpen,
  onToggle,
}) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href) && href !== "/admin";
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-linear-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out z-40 border-r border-gray-700 hidden md:block",
          isOpen ? "w-64" : "w-20"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          {isOpen && (
            <h1 className="text-xl font-bold bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              EastStore
            </h1>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
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
              title={!isOpen ? item.name : ""}
            >
              <div className="shrink-0">{item.icon}</div>
              {isOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">A</span>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};
