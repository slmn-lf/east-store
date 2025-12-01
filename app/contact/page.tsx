import React from "react";
import { Container, Section } from "@/app/components/layout";
import { ContactInfo } from "@/app/components/sections";
import { ContactForm } from "./contact-form";

/**
 * Contact Page
 * Displays contact information and contact form
 */
export default function ContactPage() {
  return (
    <div className="mt-24 mb-4 mx-4 grow min-h-screen rounded-3xl bg-linear-to-br from-gray-800 to-black overflow-hidden">
      <Section variant="default" spacing="lg">
        <Container>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Punya pertanyaan tentang produk, kolaborasi artwork, atau sekadar
              ingin menyapa? Kami siap mendengar dari Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <React.Suspense
                fallback={
                  <div className="p-8 bg-white/5 border border-white/10 rounded-lg animate-pulse h-96" />
                }
              >
                <ContactInfo />
              </React.Suspense>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
