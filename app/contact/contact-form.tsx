"use client";

import React, { useState } from "react";
import { Button, Input, Textarea, Card } from "@/app/components/ui";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Pesan berhasil dikirim! Kami akan segera menghubungi Anda.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="default" className="p-8 bg-white/5 border-white/10">
      <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            name="firstName"
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="bg-black/20 border-white/10 text-white"
          />
          <Input
            name="lastName"
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="bg-black/20 border-white/10 text-white"
          />
        </div>

        <Input
          name="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-black/20 border-white/10 text-white"
        />

        <Input
          name="subject"
          label="Subject"
          placeholder="How can we help?"
          value={formData.subject}
          onChange={handleChange}
          required
          className="bg-black/20 border-white/10 text-white"
        />

        <Textarea
          name="message"
          label="Message"
          placeholder="Tell us more about your inquiry..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="bg-black/20 border-white/10 text-white"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          Send Message
        </Button>
      </form>
    </Card>
  );
}
