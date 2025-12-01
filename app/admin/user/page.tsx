"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  AdminHeader,
  AdminSidebar,
  AdminMobileNav,
} from "@/app/components/admin";
import { logout } from "@/app/auth/login/actions";
import { updateCredentials } from "./actions";

export default function UserSettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [state, formAction, isPending] = useActionState(updateCredentials, {
    success: false,
    message: "",
  });

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
  };

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
        title="Pengaturan Pengguna"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6 max-w-4xl">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="text-white" size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Pengaturan Pengguna
              </h1>
              <p className="text-white/60 mt-1">
                Kelola username dan password akun Anda
              </p>
            </div>
          </div>

          {/* Alert Messages */}
          {state?.message && (
            <div
              className={`mb-6 p-4 rounded-lg backdrop-blur-xl border ${
                state.success
                  ? "bg-green-500/20 border-green-400/30"
                  : "bg-red-500/20 border-red-400/30"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  state.success ? "text-green-300" : "text-red-300"
                }`}
              >
                {state.message}
              </p>
            </div>
          )}

          {/* Change Credentials Form */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
            <form action={formAction} className="space-y-6">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Password Saat Ini <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  required
                  placeholder="Masukkan password saat ini"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  disabled={isPending}
                />
                <p className="text-xs text-white/60 mt-1">
                  Wajib diisi untuk keamanan
                </p>
              </div>

              {/* New Username */}
              <div>
                <label
                  htmlFor="newUsername"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Username Baru (Opsional)
                </label>
                <input
                  type="text"
                  id="newUsername"
                  name="newUsername"
                  placeholder="Masukkan username baru"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  disabled={isPending}
                />
                <p className="text-xs text-white/60 mt-1">
                  Hanya huruf, angka, dan underscore. Minimal 3 karakter
                </p>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Password Baru (Opsional)
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Masukkan password baru"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  disabled={isPending}
                />
                <p className="text-xs text-white/60 mt-1">
                  Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Konfirmasi Password Baru (Opsional)
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Ketik ulang password baru"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  disabled={isPending}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-6 py-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200"
                >
                  {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="reset"
                  className="flex-1 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Batal
                </button>
              </div>
            </form>

            {/* Info Box */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="backdrop-blur-xl bg-amber-500/10 border border-amber-400/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-amber-300 mb-2">
                  💡 Tips Keamanan
                </h3>
                <ul className="text-sm text-amber-200 space-y-1">
                  <li>
                    • Gunakan password yang kuat dengan kombinasi huruf, angka,
                    dan simbol
                  </li>
                  <li>
                    • Jangan bagikan password Anda kepada siapa pun termasuk
                    admin
                  </li>
                  <li>
                    • Ubah password secara berkala untuk keamanan maksimal
                  </li>
                  <li>• Gunakan password yang unik dan tidak mudah ditebak</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
