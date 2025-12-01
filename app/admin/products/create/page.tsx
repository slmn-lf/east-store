"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload } from "lucide-react";
import { logout } from "@/app/auth/login/actions";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

interface ProductForm {
  title: string;
  description: string;
  price_idr: string;
  status: string;
  wa_store: string;
  size_card_template_id: string;
  images: File[];
  features: {
    premium_cotton: {
      enabled: boolean;
      custom_label: string;
      custom_description: string;
    };
    high_quality_plastisol: {
      enabled: boolean;
      custom_label: string;
      custom_description: string;
    };
    nationwide_shipping: {
      enabled: boolean;
      custom_label: string;
      custom_description: string;
    };
    quality_guarantee: {
      enabled: boolean;
      custom_label: string;
      custom_description: string;
    };
  };
}

interface ValidationError {
  field: string;
  message: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [sizeCardTemplates, setSizeCardTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    description: "",
    price_idr: "",
    status: "coming_soon",
    wa_store: "",
    size_card_template_id: "",
    images: [],
    features: {
      premium_cotton: {
        enabled: false,
        custom_label: "",
        custom_description: "",
      },
      high_quality_plastisol: {
        enabled: false,
        custom_label: "",
        custom_description: "",
      },
      nationwide_shipping: {
        enabled: false,
        custom_label: "",
        custom_description: "",
      },
      quality_guarantee: {
        enabled: false,
        custom_label: "",
        custom_description: "",
      },
    },
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchSizeCardTemplates();
  }, []);

  const fetchSizeCardTemplates = async () => {
    try {
      const response = await fetch("/api/size-cards", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch size card templates");
      const data = await response.json();
      setSizeCardTemplates(data);
    } catch (error) {
      console.error("Error fetching size card templates:", error);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];

    if (!formData.title.trim()) {
      errors.push({ field: "title", message: "Product title is required" });
    }

    if (
      !formData.price_idr ||
      isNaN(Number(formData.price_idr)) ||
      Number(formData.price_idr) <= 0
    ) {
      errors.push({ field: "price_idr", message: "Valid price is required" });
    }

    if (!["coming_soon", "pre_order", "close"].includes(formData.status)) {
      errors.push({ field: "status", message: "Valid status is required" });
    }

    if (!user?.id) {
      errors.push({ field: "user", message: "User information is missing" });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("feature_")) {
      // Parse: feature_enabled_featureName or feature_custom_label_featureName
      const parts = name.split("_");
      const isEnabled = parts[1] === "enabled";
      const isLabel = parts[1] === "custom" && parts[2] === "label";
      const isDescription = parts[1] === "custom" && parts[2] === "description";

      // Extract feature name (last parts joined by _)
      let featureKey: string;
      if (isEnabled) {
        featureKey = parts.slice(2).join("_");
      } else if (isLabel) {
        featureKey = parts.slice(3).join("_");
      } else if (isDescription) {
        featureKey = parts.slice(3).join("_");
      } else {
        featureKey = parts.slice(1).join("_");
      }

      // Type assertion untuk feature yang valid
      const validFeatures: (keyof typeof formData.features)[] = [
        "premium_cotton",
        "high_quality_plastisol",
        "nationwide_shipping",
        "quality_guarantee",
      ];

      if (
        validFeatures.includes(featureKey as keyof typeof formData.features)
      ) {
        setFormData((prev) => {
          const feature =
            prev.features[featureKey as keyof typeof prev.features];

          return {
            ...prev,
            features: {
              ...prev.features,
              [featureKey]: {
                enabled: isEnabled
                  ? (e.target as HTMLInputElement).checked
                  : feature.enabled,
                custom_label: isLabel ? value : feature.custom_label,
                custom_description: isDescription
                  ? value
                  : feature.custom_description,
              },
            },
          };
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error for this field when user starts typing
    setValidationErrors((prev) => prev.filter((err) => err.field !== name));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));

    // Generate previews
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then(setImagePreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      alert("User information not found. Please login again.");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrls: string[] = [];

      // Upload all images to Cloudinary
      if (formData.images.length > 0) {
        for (const file of formData.images) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
          }

          const uploadData = await uploadResponse.json();
          imageUrls.push(uploadData.url);
        }
      }

      // Create product dengan user data dari auth
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price_idr: parseInt(formData.price_idr) || 0,
        image_url: imageUrls[0] || null,
        status: formData.status,
        wa_store: formData.wa_store || user.wa_store,
        size_card_template_id: formData.size_card_template_id
          ? parseInt(formData.size_card_template_id)
          : null,
        user_id: user.id,
        features: [
          {
            type: "premium_cotton",
            enabled: formData.features.premium_cotton.enabled,
            custom_label: formData.features.premium_cotton.custom_label,
            custom_description:
              formData.features.premium_cotton.custom_description,
          },
          {
            type: "high_quality_plastisol",
            enabled: formData.features.high_quality_plastisol.enabled,
            custom_label: formData.features.high_quality_plastisol.custom_label,
            custom_description:
              formData.features.high_quality_plastisol.custom_description,
          },
          {
            type: "nationwide_shipping",
            enabled: formData.features.nationwide_shipping.enabled,
            custom_label: formData.features.nationwide_shipping.custom_label,
            custom_description:
              formData.features.nationwide_shipping.custom_description,
          },
          {
            type: "quality_guarantee",
            enabled: formData.features.quality_guarantee.enabled,
            custom_label: formData.features.quality_guarantee.custom_label,
            custom_description:
              formData.features.quality_guarantee.custom_description,
          },
        ],
      };

      console.log("Creating product with data:", productData);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      const createdProduct = await response.json();
      console.log("Product created successfully:", createdProduct);

      // Success - redirect to products page
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
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
        title="Create Product"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6 max-w-4xl">
          {/* Loading State */}
          {isUserLoading && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-white">Loading user information...</p>
              </div>
            </div>
          )}

          {/* User Info Display */}
          {user && !isUserLoading && (
            <div className="backdrop-blur-xl bg-emerald-500/10 rounded-2xl border border-emerald-500/30 p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-sm">Logged in as</p>
                  <p className="text-white font-medium">
                    {user.name || user.email}
                  </p>
                  {user.wa_store && (
                    <p className="text-emerald-300 text-sm mt-1">
                      WhatsApp Store: {user.wa_store}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/products"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="text-white" size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Product</h1>
              <p className="text-white/60 mt-1">
                Add a new product to your store
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Product Images
              </h2>

              <div className="space-y-4">
                {/* Multiple Image Previews */}
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, idx) => (
                      <div
                        key={idx}
                        className="relative w-full h-40 rounded-xl overflow-hidden border border-white/20"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreviews((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="absolute top-2 right-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-lg text-sm transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full h-64 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-white/40 mx-auto mb-2" />
                      <p className="text-white font-medium">Drop images here</p>
                      <p className="text-white/60 text-sm">
                        or click to select (multiple allowed)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Basic Information
              </h2>

              {/* Validation Errors Alert */}
              {validationErrors.length > 0 && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4">
                  <p className="text-red-300 font-medium mb-2">
                    Please fix the following errors:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx} className="text-red-300 text-sm">
                        {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                {/* Product Title */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Product Title *{" "}
                    {validationErrors.find((e) => e.field === "title") && (
                      <span className="text-red-400">
                        -{" "}
                        {
                          validationErrors.find((e) => e.field === "title")
                            ?.message
                        }
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter product title"
                    required
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 transition-all ${
                      validationErrors.find((e) => e.field === "title")
                        ? "border-red-400/50 focus:border-red-400/70"
                        : "border-white/20 focus:border-white/40"
                    }`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Price (IDR) *{" "}
                    {validationErrors.find((e) => e.field === "price_idr") && (
                      <span className="text-red-400">
                        -{" "}
                        {
                          validationErrors.find((e) => e.field === "price_idr")
                            ?.message
                        }
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="price_idr"
                    value={formData.price_idr}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 transition-all ${
                      validationErrors.find((e) => e.field === "price_idr")
                        ? "border-red-400/50 focus:border-red-400/70"
                        : "border-white/20 focus:border-white/40"
                    }`}
                  />
                </div>

                {/* Product Status */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Status{" "}
                    {validationErrors.find((e) => e.field === "status") && (
                      <span className="text-red-400">
                        -{" "}
                        {
                          validationErrors.find((e) => e.field === "status")
                            ?.message
                        }
                      </span>
                    )}
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:bg-white/15 transition-all ${
                      validationErrors.find((e) => e.field === "status")
                        ? "border-red-400/50 focus:border-red-400/70"
                        : "border-white/20 focus:border-white/40"
                    }`}
                  >
                    <option value="coming_soon">Coming Soon</option>
                    <option value="pre_order">Pre-Order</option>
                    <option value="close">Closed</option>
                  </select>
                </div>

                {/* Size Card Template */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Size Card Template
                  </label>
                  {isLoadingTemplates ? (
                    <div className="text-white/60">Loading templates...</div>
                  ) : (
                    <select
                      name="size_card_template_id"
                      value={formData.size_card_template_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:bg-white/15 transition-all"
                    >
                      <option value="">
                        -- Select a size card template (optional) --
                      </option>
                      {sizeCardTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-white/60 text-sm mt-1">
                    Associate a size chart template with this product
                  </p>
                </div>

                {/* WhatsApp Store */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    WhatsApp Toko (Nomor Telepon)
                  </label>
                  <input
                    type="text"
                    name="wa_store"
                    value={formData.wa_store}
                    onChange={handleInputChange}
                    placeholder="e.g., 62812345678 (with country code)"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
                  />
                  <p className="text-white/60 text-sm mt-1">
                    {formData.wa_store
                      ? `Custom WhatsApp: ${formData.wa_store}`
                      : `Default WhatsApp: ${user?.wa_store || "Not set"}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Product Features
              </h2>
              <p className="text-white/60 text-sm mb-6">
                Select and customize features for this product
              </p>

              <div className="space-y-6">
                {/* Premium Cotton 24s */}
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <label className="flex items-center mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="feature_enabled_premium_cotton"
                      checked={formData.features.premium_cotton.enabled}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-white/30 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="ml-3 text-white font-medium">
                      Premium Cotton 24s
                    </span>
                  </label>
                  {formData.features.premium_cotton.enabled && (
                    <div className="space-y-3 ml-8">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Custom Label (optional)
                        </label>
                        <input
                          type="text"
                          name="feature_custom_label_premium_cotton"
                          value={formData.features.premium_cotton.custom_label}
                          onChange={handleInputChange}
                          placeholder="Leave blank for default: Premium Cotton 24s"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Custom Description (optional)
                        </label>
                        <input
                          type="text"
                          name="feature_custom_description_premium_cotton"
                          value={
                            formData.features.premium_cotton.custom_description
                          }
                          onChange={handleInputChange}
                          placeholder="Leave blank for default: High quality cotton material"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* High Quality Plastisol */}
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <label className="flex items-center mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="feature_enabled_high_quality_plastisol"
                      checked={formData.features.high_quality_plastisol.enabled}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-white/30 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="ml-3 text-white font-medium">
                      High Quality Plastisol
                    </span>
                  </label>
                  {formData.features.high_quality_plastisol.enabled && (
                    <div className="space-y-3 ml-8">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Custom Label (optional)
                        </label>
                        <input
                          type="text"
                          name="feature_custom_label_high_quality_plastisol"
                          value={
                            formData.features.high_quality_plastisol
                              .custom_label
                          }
                          onChange={handleInputChange}
                          placeholder="Leave blank for default: High Quality Plastisol"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Custom Description (optional)
                        </label>
                        <input
                          type="text"
                          name="feature_custom_description_high_quality_plastisol"
                          value={
                            formData.features.high_quality_plastisol
                              .custom_description
                          }
                          onChange={handleInputChange}
                          placeholder="Leave blank for default: Professional grade printing"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Nationwide Shipping */}
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <label className="flex items-center mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="feature_enabled_nationwide_shipping"
                      checked={formData.features.nationwide_shipping.enabled}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-white/30 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="ml-3 text-white font-medium">
                      Nationwide Shipping
                    </span>
                  </label>
                  {formData.features.nationwide_shipping.enabled && (
                    <div className="space-y-3 ml-8">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Custom Label (optional)
                        </label>
                        <input
                          type="text"
                          name="feature_custom_label_nationwide_shipping"
                          value={
                            formData.features.nationwide_shipping.custom_label
                          }
                          onChange={handleInputChange}
                          placeholder="Leave blank for default: Nationwide Shipping"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Custom Description (optional)
                        </label>
                        <input
                          type="text"
                          name="feature_custom_description_nationwide_shipping"
                          value={
                            formData.features.nationwide_shipping
                              .custom_description
                          }
                          onChange={handleInputChange}
                          placeholder="Leave blank for default: Available for delivery across the country"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quality Guarantee */}
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <label className="flex items-center mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="feature_enabled_quality_guarantee"
                      checked={formData.features.quality_guarantee.enabled}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-white/30 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="ml-3 text-white font-medium">
                      Quality Guarantee
                    </span>
                  </label>
                  {formData.features.quality_guarantee.enabled && (
                    <div className="space-y-3 ml-8">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Custom Label (optional)
                        </label>
                        <input
                          type="text"
                          name="feature_custom_label_quality_guarantee"
                          value={
                            formData.features.quality_guarantee.custom_label
                          }
                          onChange={handleInputChange}
                          placeholder="Leave blank for default: Quality Guarantee"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Custom Description (optional)
                        </label>
                        <input
                          type="text"
                          name="feature_custom_description_quality_guarantee"
                          value={
                            formData.features.quality_guarantee
                              .custom_description
                          }
                          onChange={handleInputChange}
                          placeholder="Leave blank for default: 100% quality assurance"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse md:flex-row gap-4 md:justify-end">
              <Link
                href="/admin/products"
                className="flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-lg font-medium transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
              >
                {isLoading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
