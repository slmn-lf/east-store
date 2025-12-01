"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  onLogout: () => void;
  title?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isSidebarOpen,
  onLogout,
  title = "Admin Dashboard",
}) => {
  return (
    <header
      className="fixed top-0 right-0 bg-linear-to-r from-gray-900 to-gray-800 text-white border-b border-gray-700 transition-all duration-300 ease-in-out z-30 hidden md:block"
      style={{
        left: isSidebarOpen ? "256px" : "80px",
      }}
    >
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg transition-all"
          >
            Go to Store
          </Link>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
