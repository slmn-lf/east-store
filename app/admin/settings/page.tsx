"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  AdminHeader,
  AdminSidebar,
  AdminMobileNav,
  ImageUpload,
} from "@/app/components/admin";
import { logout } from "@/app/auth/login/actions";
import { useActionState } from "react";
import { updateContentSettings } from "./actions";

type TabType = "hero" | "howtorder" | "about" | "contact" | "footer";

interface SettingsData {
  heroTitle?: string;
  heroDescription?: string;
  heroCta1?: string;
  heroCta1Link?: string;
  heroCta2?: string;
  heroCta2Link?: string;
  heroImage?: string;
  howtitle?: string;
  howdescription?: string;
  howstep1title?: string;
  howstep1desc?: string;
  howstep2title?: string;
  howstep2desc?: string;
  howstep3title?: string;
  howstep3desc?: string;
  abouttitle?: string;
  aboutsubtitle?: string;
  aboutcontent?: string;
  aboutfeature1title?: string;
  aboutfeature1desc?: string;
  aboutfeature2title?: string;
  aboutfeature2desc?: string;
  aboutfeature3title?: string;
  aboutfeature3desc?: string;
  contacttitle?: string;
  contactdescription?: string;
  contactlocation?: string;
  contactcity?: string;
  contactemail?: string;
  contactphone?: string;
  contacthours?: string;
  footerTitle?: string;
  footerDescription?: string;
  footerAddress?: string;
  footerCity?: string;
  footerEmail?: string;
  footerPhone?: string;
  footerInstagram?: string;
  footerCopyright?: string;
}

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [heroData, setHeroData] = useState<SettingsData>({});
  const [howData, setHowData] = useState<SettingsData>({});
  const [aboutData, setAboutData] = useState<SettingsData>({});
  const [contactData, setContactData] = useState<SettingsData>({});
  const [footerData, setFooterData] = useState<SettingsData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");

  const [state, formAction, isPending] = useActionState(updateContentSettings, {
    success: false,
    message: "",
  });

  // Load data from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();

        setHeroData(data.hero || {});
        setHowData(data.howtorder || {});
        setAboutData(data.about || {});
        setContactData(data.contact || {});
        setFooterData(data.footer || {});
        setHeroImageUrl((data.hero as SettingsData)?.heroImage || "/east.png");
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Reload data when form is successfully submitted
  useEffect(() => {
    if (state?.success) {
      // Reload immediately without timeout
      (async () => {
        try {
          const response = await fetch("/api/settings");
          const data = await response.json();

          console.log("Data reloaded from database after save:", {
            hero: data.hero ? Object.keys(data.hero) : "empty",
            how: data.howtorder ? Object.keys(data.howtorder) : "empty",
            about: data.about ? Object.keys(data.about) : "empty",
            contact: data.contact ? Object.keys(data.contact) : "empty",
          });

          // Update all data from database
          setHeroData(data.hero || {});
          setHowData(data.howtorder || {});
          setAboutData(data.about || {});
          setContactData(data.contact || {});
          setFooterData(data.footer || {});

          // Only update heroImageUrl if it came from database (not from pending upload)
          if (data.hero?.heroImage) {
            setHeroImageUrl(data.hero.heroImage);
          }
        } catch (error) {
          console.error("Error reloading settings:", error);
        }
      })();
    }
  }, [state?.success]);

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

  const tabs = [
    { id: "hero", label: "Hero Section", icon: "🏠" },
    { id: "howtorder", label: "Cara Pesan", icon: "📋" },
    { id: "about", label: "Tentang Kami", icon: "ℹ️" },
    { id: "contact", label: "Contact Info", icon: "📧" },
    { id: "footer", label: "Footer", icon: "📄" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>Memuat pengaturan...</p>
        </div>
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
        title="Content Settings"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6 max-w-6xl">
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
                Pengaturan Konten
              </h1>
              <p className="text-white/60 mt-1">
                Kelola semua konten halaman utama dan contact
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

          {/* Tabs */}
          <div className="mb-8 border-b border-white/20 flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-3 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-amber-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-white text-center">
                <div className="mb-4 animate-spin">⏳</div>
                <p>Memuat data...</p>
              </div>
            </div>
          ) : (
            <form key={activeTab} action={formAction} className="space-y-6">
              <input type="hidden" name="section" value={activeTab} />

              {/* Hero Section Tab */}
              {activeTab === "hero" && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Hero Section
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Judul Utama
                      </label>
                      <textarea
                        name="heroTitle"
                        defaultValue={
                          heroData.heroTitle || "Wear Art, Not Just Clothes"
                        }
                        placeholder="Masukkan judul utama..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-24"
                        disabled={isPending}
                      />
                      <p className="text-xs text-white/60 mt-1">
                        Judul utama halaman depan
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        name="heroDescription"
                        defaultValue={
                          heroData.heroDescription ||
                          "Setiap kaos kami adalah kanvas untuk karya seni asli diilustrasikan secara digital, dibuat dengan presisi, dan diproduksi eksklusif dalam sistem pre-order."
                        }
                        placeholder="Masukkan deskripsi..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-24"
                        disabled={isPending}
                      />
                      <p className="text-xs text-white/60 mt-1">
                        Deskripsi singkat di bawah judul
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          CTA Button 1 Text
                        </label>
                        <input
                          type="text"
                          name="heroCta1"
                          defaultValue={
                            heroData.heroCta1 || "Pre Order Tersedia"
                          }
                          placeholder="Contoh: Pre Order Tersedia"
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          disabled={isPending}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          CTA Button 1 Link
                        </label>
                        <input
                          type="text"
                          name="heroCta1Link"
                          defaultValue={heroData.heroCta1Link || "/products"}
                          placeholder="Contoh: /products atau https://..."
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          CTA Button 2 Text
                        </label>
                        <input
                          type="text"
                          name="heroCta2"
                          defaultValue={
                            heroData.heroCta2 || "Kolaborasi Art Work"
                          }
                          placeholder="Contoh: Kolaborasi Art Work"
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          disabled={isPending}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          CTA Button 2 Link
                        </label>
                        <input
                          type="text"
                          name="heroCta2Link"
                          defaultValue={heroData.heroCta2Link || "/artwork"}
                          placeholder="Contoh: /artwork atau https://..."
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Hero Image
                      </label>
                      <input
                        type="hidden"
                        name="heroImage"
                        value={heroImageUrl}
                        id="heroImageInput"
                      />
                      <ImageUpload
                        currentImage={heroImageUrl}
                        onUploadSuccess={(url) => {
                          setHeroImageUrl(url);
                        }}
                        disabled={isPending}
                      />
                      <p className="text-xs text-white/60 mt-3">
                        Upload gambar hero atau masukkan URL secara manual
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* How To Order Tab */}
              {activeTab === "howtorder" && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Cara Pesan
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Judul Bagian
                      </label>
                      <input
                        type="text"
                        name="howtitle"
                        defaultValue={howData.howtitle || "Cara Pesan"}
                        placeholder="Masukkan judul..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        name="howdescription"
                        defaultValue={
                          howData.howdescription ||
                          "Ikuti 3 langkah sederhana untuk mendapatkan kaos edisi terbatas dengan artwork eksklusif."
                        }
                        placeholder="Masukkan deskripsi..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-24"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Langkah 1</h3>
                      <input
                        type="text"
                        name="howstep1title"
                        defaultValue={
                          howData.howstep1title || "Isi Form di Halaman Produk"
                        }
                        placeholder="Judul langkah 1..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <textarea
                        name="howstep1desc"
                        defaultValue={
                          howData.howstep1desc ||
                          "Pilih ukuran dan jumlah, lalu lengkapi data diri (nama, alamat, catatan) melalui form di bawah desain kaos."
                        }
                        placeholder="Deskripsi langkah 1..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-20"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Langkah 2</h3>
                      <input
                        type="text"
                        name="howstep2title"
                        defaultValue={
                          howData.howstep2title || "Kirim via WhatsApp"
                        }
                        placeholder="Judul langkah 2..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <textarea
                        name="howstep2desc"
                        defaultValue={
                          howData.howstep2desc ||
                          "Setelah submit, Anda langsung diarahkan ke WhatsApp dengan pesan otomatis berisi detail pesanan."
                        }
                        placeholder="Deskripsi langkah 2..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-20"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Langkah 3</h3>
                      <input
                        type="text"
                        name="howstep3title"
                        defaultValue={
                          howData.howstep3title || "Pengiriman Serentak"
                        }
                        placeholder="Judul langkah 3..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <textarea
                        name="howstep3desc"
                        defaultValue={
                          howData.howstep3desc ||
                          "Semua pesanan diproduksi dan dikirim bersamaan sesuai jadwal yang telah ditentukan sejak awal."
                        }
                        placeholder="Deskripsi langkah 3..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-20"
                        disabled={isPending}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* About Section Tab */}
              {activeTab === "about" && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Tentang Kami
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Judul Bagian
                      </label>
                      <input
                        type="text"
                        name="abouttitle"
                        defaultValue={aboutData.abouttitle || "Tentang Kami"}
                        placeholder="Masukkan judul..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Subtitle
                      </label>
                      <textarea
                        name="aboutsubtitle"
                        defaultValue={
                          aboutData.aboutsubtitle ||
                          "Brand lokal yang hadir dengan prinsip: limited, intentional, and community-driven."
                        }
                        placeholder="Masukkan subtitle..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-20"
                        disabled={isPending}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Konten Utama
                      </label>
                      <textarea
                        name="aboutcontent"
                        defaultValue={
                          aboutData.aboutcontent ||
                          "Kami percaya, pakaian terbaik bukan yang paling banyak diproduksi tetapi yang paling bermakna. Karena itu, setiap koleksi dirilis dalam sistem pre-order eksklusif."
                        }
                        placeholder="Masukkan konten utama..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-32"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Fitur 1</h3>
                      <input
                        type="text"
                        name="aboutfeature1title"
                        defaultValue={
                          aboutData.aboutfeature1title || "Ramah Lingkungan"
                        }
                        placeholder="Judul fitur..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <textarea
                        name="aboutfeature1desc"
                        defaultValue={
                          aboutData.aboutfeature1desc ||
                          "Zero overproduction. Setiap kaos dibuat hanya untuk yang memesan mengurangi limbah tekstil hingga 95 persen."
                        }
                        placeholder="Deskripsi fitur..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-20"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Fitur 2</h3>
                      <input
                        type="text"
                        name="aboutfeature2title"
                        defaultValue={
                          aboutData.aboutfeature2title || "Kolaborasi Artistik"
                        }
                        placeholder="Judul fitur..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <textarea
                        name="aboutfeature2desc"
                        defaultValue={
                          aboutData.aboutfeature2desc ||
                          "Setiap desain adalah kolaborasi dengan ilustrator dan seniman lokal kamu tidak hanya beli kaos, tapi juga mendukung karya mereka."
                        }
                        placeholder="Deskripsi fitur..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-20"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Fitur 3</h3>
                      <input
                        type="text"
                        name="aboutfeature3title"
                        defaultValue={
                          aboutData.aboutfeature3title || "Komunitas Eksklusif"
                        }
                        placeholder="Judul fitur..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <textarea
                        name="aboutfeature3desc"
                        defaultValue={
                          aboutData.aboutfeature3desc ||
                          "Pemilik koleksi mendapat akses ke grup WhatsApp eksklusif, early access untuk drop berikutnya, dan voting desain baru."
                        }
                        placeholder="Deskripsi fitur..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-20"
                        disabled={isPending}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section Tab */}
              {activeTab === "contact" && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Informasi Kontak
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Judul Halaman
                      </label>
                      <input
                        type="text"
                        name="contacttitle"
                        defaultValue={
                          contactData.contacttitle || "Get in Touch"
                        }
                        placeholder="Masukkan judul..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        name="contactdescription"
                        defaultValue={
                          contactData.contactdescription ||
                          "Punya pertanyaan tentang produk, kolaborasi artwork, atau sekadar ingin menyapa? Kami siap mendengar dari Anda."
                        }
                        placeholder="Masukkan deskripsi..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-24"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Lokasi</h3>
                      <input
                        type="text"
                        name="contactlocation"
                        defaultValue={
                          contactData.contactlocation || "Jl. Fashion No. 123"
                        }
                        placeholder="Jalan..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <input
                        type="text"
                        name="contactcity"
                        defaultValue={
                          contactData.contactcity ||
                          "Jakarta Selatan, Indonesia"
                        }
                        placeholder="Kota..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Kontak</h3>
                      <input
                        type="email"
                        name="contactemail"
                        defaultValue={
                          contactData.contactemail || "info@eaststore.com"
                        }
                        placeholder="Email..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <input
                        type="tel"
                        name="contactphone"
                        defaultValue={
                          contactData.contactphone || "+62 (555) 123-4567"
                        }
                        placeholder="Nomor telepon..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Jam Operasional
                      </label>
                      <input
                        type="text"
                        name="contacthours"
                        defaultValue={
                          contactData.contacthours ||
                          "Senin - Jumat: 09:00 - 17:00 WIB"
                        }
                        placeholder="Jam operasional..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {/* Footer Section Tab */}
              {activeTab === "footer" && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Pengaturan Footer
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Judul Brand
                      </label>
                      <input
                        type="text"
                        name="footerTitle"
                        defaultValue={footerData.footerTitle || "East Store."}
                        placeholder="Masukkan nama brand..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <p className="text-xs text-white/60 mt-1">
                        Nama brand yang ditampilkan di footer
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Deskripsi Brand
                      </label>
                      <textarea
                        name="footerDescription"
                        defaultValue={
                          footerData.footerDescription ||
                          "Your trusted partner for quality fashion and lifestyle products."
                        }
                        placeholder="Masukkan deskripsi brand..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-20"
                        disabled={isPending}
                      />
                      <p className="text-xs text-white/60 mt-1">
                        Deskripsi singkat brand untuk di footer
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-white font-semibold mb-4">Lokasi</h3>
                      <input
                        type="text"
                        name="footerAddress"
                        defaultValue={
                          footerData.footerAddress || "Jl. Fashion No. 123"
                        }
                        placeholder="Alamat jalan..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all mb-3"
                        disabled={isPending}
                      />
                      <input
                        type="text"
                        name="footerCity"
                        defaultValue={
                          footerData.footerCity || "Jakarta, Indonesia"
                        }
                        placeholder="Kota dan negara..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-white font-semibold mb-4">Kontak</h3>
                      <input
                        type="email"
                        name="footerEmail"
                        defaultValue={
                          footerData.footerEmail || "info@eaststore.com"
                        }
                        placeholder="Email..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all mb-3"
                        disabled={isPending}
                      />
                      <input
                        type="tel"
                        name="footerPhone"
                        defaultValue={
                          footerData.footerPhone || "+62 (555) 123-4567"
                        }
                        placeholder="Nomor telepon..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-white font-semibold mb-4">
                        Media Sosial
                      </h3>
                      <input
                        type="url"
                        name="footerInstagram"
                        defaultValue={
                          footerData.footerInstagram ||
                          "https://instagram.com/eaststore"
                        }
                        placeholder="Link Instagram (URL lengkap)..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <p className="text-xs text-white/60 mt-1">
                        Masukkan URL lengkap Instagram
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Teks Copyright
                      </label>
                      <input
                        type="text"
                        name="footerCopyright"
                        defaultValue={
                          footerData.footerCopyright || "All rights reserved."
                        }
                        placeholder="Teks copyright..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        disabled={isPending}
                      />
                      <p className="text-xs text-white/60 mt-1">
                        Tahun akan ditambahkan otomatis di depan teks ini
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
          )}
        </div>
      </main>
    </div>
  );
}
