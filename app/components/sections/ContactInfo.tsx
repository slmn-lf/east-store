import React from "react";
import { Card } from "@/app/components/ui";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { getAllContentSettings } from "@/app/admin/settings/actions";

export const ContactInfo: React.FC = async () => {
  const settings = await getAllContentSettings();
  const contactSettings = settings.contact || {};

  return (
    <Card variant="glass" className="p-8 space-y-8 h-full">
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">
          {contactSettings.contacttitle || "Contact Information"}
        </h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">
                {contactSettings.contactlocation || "Our Location"}
              </h4>
              {contactSettings.contactcity ? (
                <p className="text-gray-400">{contactSettings.contactcity}</p>
              ) : (
                <p className="text-gray-400">
                  Jl. Fashion No. 123
                  <br />
                  Jakarta Selatan, Indonesia
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Email Us</h4>
              {contactSettings.contactemail ? (
                <p className="text-gray-400">{contactSettings.contactemail}</p>
              ) : (
                <p className="text-gray-400">
                  hello@eaststore.com
                  <br />
                  support@eaststore.com
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Call Us</h4>
              {contactSettings.contactphone ? (
                <p className="text-gray-400">{contactSettings.contactphone}</p>
              ) : (
                <p className="text-gray-400">
                  +62 812 3456 7890
                  <br />
                  Mon - Fri, 9am - 5pm
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Working Hours</h4>
              {contactSettings.contacthours ? (
                <p className="text-gray-400">{contactSettings.contacthours}</p>
              ) : (
                <p className="text-gray-400">
                  Monday - Friday: 09:00 - 17:00
                  <br />
                  Saturday - Sunday: Closed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
