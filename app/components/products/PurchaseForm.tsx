"use client";

import { useState } from "react";
import { Card } from "@/app/components/ui";
import { ShoppingCart, Send, AlertCircle } from "lucide-react";

interface PurchaseFormProps {
  productId: number;
  productTitle: string;
  productPrice: number;
  waNumber: string;
}

const sizes = ["XS", "S", "M", "L", "XL", "2XL"];

// Helper function to format WhatsApp number (0 -> +62)
const formatWhatsAppNumber = (number: string): string => {
  if (!number) return "";

  // Remove all non-digit characters
  const cleaned = number.replace(/\D/g, "");

  // Replace leading 0 with +62
  if (cleaned.startsWith("0")) {
    return "+62" + cleaned.slice(1);
  }

  // Add +62 if doesn't start with country code
  if (!cleaned.startsWith("62")) {
    return "+62" + cleaned;
  }

  // Already has 62, just add +
  return "+" + cleaned;
};

interface FormError {
  [key: string]: string;
}

export function PurchaseForm({
  productId,
  productTitle,
  productPrice,
  waNumber,
}: PurchaseFormProps) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    size: "M",
    customer_address: "",
    quantity: 1,
  });

  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormError = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Nama harus diisi";
    }
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = "Nomor WhatsApp harus diisi";
    } else if (
      !/^(0|62)[0-9]{9,12}$/.test(formData.customer_phone.replace(/\D/g, ""))
    ) {
      newErrors.customer_phone = "Nomor WhatsApp tidak valid";
    }
    if (!formData.customer_address.trim()) {
      newErrors.customer_address = "Alamat harus diisi";
    }
    if (formData.quantity < 1 || formData.quantity > 100) {
      newErrors.quantity = "Jumlah harus antara 1-100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      // Format customer phone number for API
      const formattedPhoneNumber = formatWhatsAppNumber(
        formData.customer_phone
      );

      // Submit to API
      const response = await fetch("/api/preorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_phone: formattedPhoneNumber,
          customer_address: formData.customer_address,
          product_id: productId,
          size: formData.size,
          quantity: formData.quantity,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal membuat preorder");
      }

      const data = await response.json();

      // Generate WhatsApp message with form data
      const message = `
Halo, saya ingin mengkonfirmasi preorder berikut:

*Produk:* ${productTitle}
*Ukuran:* ${formData.size}
*Jumlah:* ${formData.quantity}x
*Harga Unit:* Rp ${productPrice.toLocaleString("id-ID")}
*Total:* Rp ${(productPrice * formData.quantity).toLocaleString("id-ID")}

*Data Pemesan:*
Nama: ${formData.customer_name}
WhatsApp: ${formData.customer_phone}
Alamat: ${formData.customer_address}

ID Preorder: PRE-${data.preorder.id}
      `.trim();

      // Format WhatsApp number (convert 0 to +62)
      const formattedWaNumber = formatWhatsAppNumber(waNumber);
      const whatsappLink = `https://wa.me/${formattedWaNumber}?text=${encodeURIComponent(message)}`;

      // Show success message
      setSuccessMessage(
        "✅ Preorder berhasil dibuat! Silakan konfirmasi via WhatsApp."
      );

      // Redirect to WhatsApp after 1 second
      setTimeout(() => {
        window.open(whatsappLink, "_blank");
      }, 1000);

      // Reset form
      setTimeout(() => {
        setFormData({
          customer_name: "",
          customer_phone: "",
          size: "M",
          customer_address: "",
          quantity: 1,
        });
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = productPrice * formData.quantity;

  return (
    <Card variant="glass" className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="text-amber-400" size={24} />
        <h2 className="text-2xl font-bold text-white">Form Pemesanan</h2>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-sm">
          {successMessage}
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-red-300 mt-0.5 shrink-0" />
          <p className="text-red-300 text-sm">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nama Pemesan *
          </label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap Anda"
            className={`w-full px-4 py-2.5 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 transition-all ${
              errors.customer_name
                ? "border-red-400/50 focus:border-red-400/70"
                : "border-white/20 focus:border-white/40"
            }`}
          />
          {errors.customer_name && (
            <p className="text-red-400 text-xs mt-1">{errors.customer_name}</p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nomor WhatsApp Aktif *
          </label>
          <input
            type="tel"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
            placeholder="08123456789 atau 628123456789"
            className={`w-full px-4 py-2.5 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 transition-all ${
              errors.customer_phone
                ? "border-red-400/50 focus:border-red-400/70"
                : "border-white/20 focus:border-white/40"
            }`}
          />
          {errors.customer_phone && (
            <p className="text-red-400 text-xs mt-1">{errors.customer_phone}</p>
          )}
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ukuran T-shirt *
          </label>
          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
          >
            {sizes.map((size) => (
              <option key={size} value={size} className="bg-gray-900">
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alamat Lengkap untuk Pengiriman T-shirt *
          </label>
          <textarea
            name="customer_address"
            value={formData.customer_address}
            onChange={handleChange}
            placeholder="Masukkan alamat lengkap (jalan, nomor rumah, kelurahan, kecamatan, kota, provinsi, kode pos)"
            rows={3}
            className={`w-full px-4 py-2.5 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 transition-all resize-none ${
              errors.customer_address
                ? "border-red-400/50 focus:border-red-400/70"
                : "border-white/20 focus:border-white/40"
            }`}
          />
          {errors.customer_address && (
            <p className="text-red-400 text-xs mt-1">
              {errors.customer_address}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Jumlah *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            max="100"
            className={`w-full px-4 py-2.5 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 transition-all ${
              errors.quantity
                ? "border-red-400/50 focus:border-red-400/70"
                : "border-white/20 focus:border-white/40"
            }`}
          />
          {errors.quantity && (
            <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-gray-300 text-sm">
            <span>Harga Unit:</span>
            <span>Rp {productPrice.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-gray-300 text-sm">
            <span>Jumlah:</span>
            <span>{formData.quantity}x</span>
          </div>
          <div className="border-t border-white/10 pt-2 flex justify-between">
            <span className="font-semibold text-white">Total:</span>
            <span className="text-xl font-bold text-amber-400">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Send size={20} />
          {isSubmitting ? "Memproses..." : "Pesan Sekarang"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Data Anda akan disimpan dan dikirimkan ke WhatsApp untuk konfirmasi
        </p>
      </form>
    </Card>
  );
}
