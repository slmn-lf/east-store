"use client";

import React, { useState } from "react";
import { Button, Input, Textarea } from "@/app/components/ui";
import { Card } from "@/app/components/ui";

interface RegistrationFormProps {
  productName: string;
  productId: string;
}

const SIZES = [
  { value: "xs", label: "Extra Small (XS)" },
  { value: "s", label: "Small (S)" },
  { value: "m", label: "Medium (M)" },
  { value: "l", label: "Large (L)" },
  { value: "xl", label: "Extra Large (XL)" },
  { value: "xxl", label: "2XL" },
  { value: "xxxl", label: "3XL" },
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  productName,
  productId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    whatsapp: "",
    alamat: "",
    ukuran: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format WhatsApp number
      let whatsappNumber = formData.whatsapp.replace(/\D/g, "");
      if (!whatsappNumber.startsWith("62")) {
        if (whatsappNumber.startsWith("0")) {
          whatsappNumber = "62" + whatsappNumber.slice(1);
        } else {
          whatsappNumber = "62" + whatsappNumber;
        }
      }

      const message = `Halo, saya ingin memesan ${productName}%0A%0ADetal Pemesanan:%0A- Nama: ${formData.nama}%0A- Alamat: ${formData.alamat}%0A- Ukuran: ${formData.ukuran}%0A%0ATerima kasih.`;

      // Open WhatsApp
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

      setSubmitted(true);
      setFormData({ nama: "", whatsapp: "", alamat: "", ukuran: "" });

      // Reset submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="glass" className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Daftar Pesanan</h2>

      {submitted && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
          ✓ Terima kasih! Anda akan dialihkan ke WhatsApp untuk menyelesaikan
          pemesanan.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama */}
        <div>
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Nama Lengkap <span className="text-red-400">*</span>
          </label>
          <Input
            id="nama"
            name="nama"
            type="text"
            placeholder="Masukkan nama Anda"
            value={formData.nama}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label
            htmlFor="whatsapp"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Nomor WhatsApp <span className="text-red-400">*</span>
          </label>
          <Input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            placeholder="08xxxxxxxxxx atau +62xxxxxxxxxx"
            value={formData.whatsapp}
            onChange={handleChange}
            required
            className="w-full"
          />
          <p className="text-xs text-gray-400 mt-1">
            Format: 08xxxxxxxxxx atau +62xxxxxxxxxx
          </p>
        </div>

        {/* Alamat */}
        <div>
          <label
            htmlFor="alamat"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Alamat Lengkap <span className="text-red-400">*</span>
          </label>
          <Textarea
            id="alamat"
            name="alamat"
            placeholder="Masukkan alamat pengiriman Anda"
            value={formData.alamat}
            onChange={handleChange}
            required
            className="w-full min-h-24"
          />
        </div>

        {/* Ukuran */}
        <div>
          <label
            htmlFor="ukuran"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Pilih Ukuran <span className="text-red-400">*</span>
          </label>
          <select
            id="ukuran"
            name="ukuran"
            value={formData.ukuran}
            onChange={handleChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">-- Pilih Ukuran --</option>
            {SIZES.map((size) => (
              <option
                key={size.value}
                value={size.label}
                className="bg-gray-800 text-white"
              >
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Lanjut ke WhatsApp"}
        </Button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4">
        Anda akan dialihkan ke WhatsApp untuk menyelesaikan pemesanan
      </p>
    </Card>
  );
};

RegistrationForm.displayName = "RegistrationForm";
