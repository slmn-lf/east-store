"use client";
import { Instagram } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { NAV_ITEMS } from "@/config/constants";

interface FooterSettings {
  footerTitle?: string;
  footerDescription?: string;
  footerAddress?: string;
  footerCity?: string;
  footerEmail?: string;
  footerPhone?: string;
  footerInstagram?: string;
  footerCopyright?: string;
}

/**
 * Footer Component
 * Site footer with navigation, contact info, and social links
 * Uses settings from database
 */
export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<FooterSettings>({
    footerTitle: "East Store.",
    footerDescription:
      "Your trusted partner for quality fashion and lifestyle products.",
    footerAddress: "Jl. Fashion No. 123",
    footerCity: "Jakarta, Indonesia",
    footerEmail: "info@eaststore.com",
    footerPhone: "+62 (555) 123-4567",
    footerInstagram: "https://instagram.com/eaststore",
    footerCopyright: "All rights reserved.",
  });

  useEffect(() => {
    const loadFooterSettings = async () => {
      try {
        const response = await fetch("/api/settings?section=footer", {
          cache: "no-store", // Always fetch fresh data
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Footer settings loaded:", data);
          setSettings((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (error) {
        console.error("Error loading footer settings:", error);
      }
    };

    loadFooterSettings();

    // Optionally refresh every 5 seconds to catch updates
    const interval = setInterval(loadFooterSettings, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bottom-0 w-full mt-0 bg-white/10 backdrop-blur-md text-neutral-400 p-4 border-t border-neutral-400/30">
      <div className="hidden md:block max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
          {/* Brand & Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="East Store Logo"
                width={40}
                height={40}
                className="rounded"
              />
              <span className="bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent font-bold text-xl">
                {settings.footerTitle}
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {settings.footerDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-300 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-300 text-lg">Address</h3>
            <address className="text-sm not-italic leading-relaxed">
              {settings.footerAddress}
              <br />
              {settings.footerCity}
              <br />
            </address>
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-300 text-lg">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <Link
                href={
                  settings.footerInstagram || "https://instagram.com/eaststore"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-neutral-500 lg:border-t border-neutral-400/20 pt-3">
        &copy; {new Date().getFullYear()} {settings.footerTitle}{" "}
        {settings.footerCopyright}
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
