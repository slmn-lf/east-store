"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../auth/login/actions";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  activeUsers: number;
  revenue: number;
}

interface Preorder {
  id: number;
  customer_name: string;
  customer_phone: string;
  product_id: number | null;
  size: string;
  quantity: number;
  total_price: number;
  status: "unconfirmed" | "confirmed";
  created_at: string;
  product?: {
    title: string;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    activeUsers: 0,
    revenue: 0,
  });
  const [recentPreorders, setRecentPreorders] = useState<Preorder[]>([]);

  useEffect(() => {
    // Just fetch the data, don't do auth check
    // Middleware already protected this route
    const fetchData = async () => {
      try {
        console.log("[ADMIN] Fetching dashboard data");

        // Fetch dashboard stats
        const statsResponse = await fetch("/api/admin/stats", {
          credentials: "include",
        });
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          console.log("[ADMIN] Stats loaded:", data);
          setStats(data);
        }

        // Fetch recent preorders
        const preordersResponse = await fetch("/api/preorder", {
          credentials: "include",
        });
        if (preordersResponse.ok) {
          const preordersDataResponse = await preordersResponse.json();
          console.log("[ADMIN] Preorders API response:", preordersDataResponse);

          // The API returns data in a 'data' property
          const preordersData = preordersDataResponse.data || [];
          console.log("[ADMIN] Preorders loaded:", preordersData.length);
          // Get only unconfirmed preorders (5 most recent)
          const unconfirmedPreorders = preordersData
            .filter((p: Preorder) => p.status === "unconfirmed")
            .slice(0, 5);
          setRecentPreorders(unconfirmedPreorders);
        } else {
          console.error(
            "[ADMIN] Failed to fetch preorders:",
            preordersResponse.status
          );
        }

        setIsLoading(false);
      } catch (error) {
        console.error("[ADMIN] Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array - only run on mount

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const markAsRead = async (preorderId: number) => {
    try {
      console.log("[ADMIN] Marking preorder as read:", preorderId);

      const response = await fetch(`/api/preorder/${preorderId}/mark-read`, {
        method: "PATCH",
        credentials: "include",
      });

      if (response.ok) {
        console.log("[ADMIN] Preorder marked as read successfully");
        // Remove from recent preorders list
        setRecentPreorders((prev) => prev.filter((p) => p.id !== preorderId));
      } else {
        console.error("[ADMIN] Failed to mark as read:", response.status);
      }
    } catch (error) {
      console.error("[ADMIN] Error marking as read:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800">
      {/* Mobile Navigation */}
      <AdminMobileNav onLogout={handleLogout} title="EastStore" />

      {/* Desktop Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Desktop Header */}
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        onLogout={handleLogout}
        title="Dashboard"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Products */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.totalProducts.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center backdrop-blur-md border border-amber-400/30">
                  <svg
                    className="w-6 h-6 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.totalOrders.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center backdrop-blur-md border border-blue-400/30">
                  <svg
                    className="w-6 h-6 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center backdrop-blur-md border border-green-400/30">
                  <svg
                    className="w-6 h-6 text-green-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Revenue</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    Rp {stats.revenue.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center backdrop-blur-md border border-purple-400/30">
                  <svg
                    className="w-6 h-6 text-purple-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Preorders Section */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-4 md:p-8 shadow-lg">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                Recent Preorders
              </h2>

              {recentPreorders.length > 0 ? (
                <div className="space-y-2 md:space-y-4">
                  {recentPreorders.map((preorder) => (
                    <div
                      key={preorder.id}
                      className="backdrop-blur-md bg-white/5 rounded-lg border border-white/10 p-3 md:p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                            <p className="font-semibold text-white text-sm md:text-base truncate">
                              {preorder.customer_name}
                            </p>
                            <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0">
                              {preorder.status}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-400 mb-1 truncate">
                            {preorder.product?.title || "Product"}
                          </p>
                          <div className="flex flex-wrap gap-2 md:gap-6 text-xs md:text-sm text-gray-400">
                            <span className="whitespace-nowrap">
                              Size: {preorder.size}
                            </span>
                            <span className="whitespace-nowrap">
                              Qty: {preorder.quantity}
                            </span>
                            <span className="whitespace-nowrap">
                              Rp {preorder.total_price.toLocaleString("id-ID")}
                            </span>
                            <span className="text-gray-500 whitespace-nowrap">
                              {new Date(preorder.created_at).toLocaleDateString(
                                "id-ID",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => markAsRead(preorder.id)}
                          className="w-full md:w-auto px-3 md:px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 font-medium text-xs md:text-sm transition-all"
                        >
                          Mark as Read
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm md:text-base">
                    No recent preorders
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
