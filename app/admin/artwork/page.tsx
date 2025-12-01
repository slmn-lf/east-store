"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search, Eye } from "lucide-react";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";

interface Artwork {
  id: number;
  title: string;
  artist: string | null;
  image_url: string | null;
  price_cents: number | null;
  created_at: string;
}

export default function ArtworksPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/artworks");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      setArtworks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    // Handle logout
  };

  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artwork.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false)
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/artworks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setArtworks(artworks.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting artwork:", error);
      alert("Failed to delete artwork");
    }
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
        title="Artworks"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Artworks</h1>
              <p className="text-white/60 mt-2">Manage your artwork gallery</p>
            </div>
            <Link
              href="/admin/artwork/create"
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all"
            >
              <Plus size={20} />
              <span>Add Artwork</span>
            </Link>
          </div>

          {/* Search Section */}
          <div className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-white/40"
                size={20}
              />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/20 bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                      Artist
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredArtworks.map((artwork) => (
                    <tr
                      key={artwork.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {artwork.title}
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {artwork.artist || "-"}
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {new Date(artwork.created_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/artwork/${artwork.id}/view`}
                            className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/artwork/${artwork.id}/edit`}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 transition-all"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(artwork.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {filteredArtworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold">
                      {artwork.title}
                    </h3>
                  </div>
                  <p className="text-white/60 text-sm mb-3">
                    {artwork.artist ? `by ${artwork.artist}` : "No artist"}
                  </p>
                  <div className="text-sm">
                    <p className="text-white/60 text-xs">
                      {new Date(artwork.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/10">
                    <Link
                      href={`/admin/artwork/${artwork.id}/view`}
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 text-sm transition-all"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    <Link
                      href={`/admin/artwork/${artwork.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 text-sm transition-all"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 text-sm transition-all"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredArtworks.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-white/60 text-lg">No artworks found</p>
                  <p className="text-white/40 text-sm mt-1">
                    Try adjusting your search terms
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-white/60 text-sm">
            Showing {filteredArtworks.length} of {artworks.length} artworks
          </div>
        </div>
      </main>
    </div>
  );
}
