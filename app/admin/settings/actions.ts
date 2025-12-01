"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

interface ContentSettings {
  section: string;
  // Hero fields
  heroTitle?: string;
  heroDescription?: string;
  heroCta1?: string;
  heroCta1Link?: string;
  heroCta2?: string;
  heroCta2Link?: string;
  heroImage?: string;
  // How to order fields
  howtitle?: string;
  howdescription?: string;
  howstep1title?: string;
  howstep1desc?: string;
  howstep2title?: string;
  howstep2desc?: string;
  howstep3title?: string;
  howstep3desc?: string;
  // About fields
  abouttitle?: string;
  aboutsubtitle?: string;
  aboutcontent?: string;
  aboutfeature1title?: string;
  aboutfeature1desc?: string;
  aboutfeature2title?: string;
  aboutfeature2desc?: string;
  aboutfeature3title?: string;
  aboutfeature3desc?: string;
  // Contact fields
  contacttitle?: string;
  contactdescription?: string;
  contactlocation?: string;
  contactcity?: string;
  contactemail?: string;
  contactphone?: string;
  contacthours?: string;
  // Footer fields
  footerTitle?: string;
  footerDescription?: string;
  footerAddress?: string;
  footerCity?: string;
  footerEmail?: string;
  footerPhone?: string;
  footerInstagram?: string;
  footerCopyright?: string;
}

interface UpdateSettingsState {
  success: boolean;
  message: string;
}

export async function updateContentSettings(
  prevState: UpdateSettingsState | undefined,
  formData: FormData
): Promise<UpdateSettingsState> {
  try {
    const section = formData.get("section") as string;

    // Collect all form data
    const settings: ContentSettings = { section };

    // Get all form fields
    for (const [key, value] of formData.entries()) {
      if (key !== "section" && typeof value === "string") {
        settings[key as keyof ContentSettings] = value;
      }
    }

    // Validate based on section
    if (!section) {
      return {
        success: false,
        message: "Bagian tidak valid.",
      };
    }

    // Check required fields based on section
    if (section === "hero") {
      if (!settings.heroTitle?.trim()) {
        return {
          success: false,
          message: "Judul utama wajib diisi.",
        };
      }
    } else if (section === "howtorder") {
      if (!settings.howtitle?.trim()) {
        return {
          success: false,
          message: "Judul bagian wajib diisi.",
        };
      }
    } else if (section === "about") {
      if (!settings.abouttitle?.trim()) {
        return {
          success: false,
          message: "Judul bagian wajib diisi.",
        };
      }
    } else if (section === "contact") {
      if (!settings.contacttitle?.trim() || !settings.contactemail?.trim()) {
        return {
          success: false,
          message: "Judul dan email wajib diisi.",
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(settings.contactemail)) {
        return {
          success: false,
          message: "Format email tidak valid.",
        };
      }
    } else if (section === "footer") {
      if (!settings.footerTitle?.trim()) {
        return {
          success: false,
          message: "Judul brand wajib diisi.",
        };
      }
    }

    // Store settings in database
    const settingsJson = JSON.stringify(settings);
    const settingsKey = `content_settings_${section}`;

    console.log(`💾 Menyimpan settings untuk section: ${section}`);
    console.log(`🔑 Key: ${settingsKey}`);
    console.log(`📝 Data: ${settingsJson.substring(0, 100)}...`);

    const result = await prisma.setting.upsert({
      where: { key: settingsKey },
      update: { value: settingsJson },
      create: { key: settingsKey, value: settingsJson },
    });

    console.log(`✅ Berhasil disimpan. Updated: ${result.updated_at}`);

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    // Tambahan revalidate untuk semua halaman yang menggunakan footer
    if (section === "footer") {
      revalidatePath("/", "layout");
      console.log("✅ Revalidated footer for all layouts");
    }

    return {
      success: true,
      message: `${section.charAt(0).toUpperCase() + section.slice(1)} berhasil disimpan!`,
    };
  } catch (error) {
    console.error("Error updating settings:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menyimpan. Silakan coba lagi.",
    };
  }
}

export async function getContentSettings(section: string) {
  try {
    const settingsKey = `content_settings_${section}`;
    console.log(`📖 Mengambil settings untuk: ${settingsKey}`);

    const setting = await prisma.setting.findUnique({
      where: { key: settingsKey },
    });

    if (!setting) {
      console.log(`⚠️  Tidak ada data untuk: ${settingsKey}`);
      return {};
    }

    const parsed = JSON.parse(setting.value) as ContentSettings;
    console.log(`✅ Berhasil ambil data ${settingsKey}:`, Object.keys(parsed));

    return parsed;
  } catch (error) {
    console.error("Error getting content settings:", error);
    return {};
  }
}

export async function getAllContentSettings() {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { startsWith: "content_settings_" } },
    });

    const result: Record<string, ContentSettings> = {};

    settings.forEach((setting: { key: string; value: string }) => {
      const section = setting.key.replace("content_settings_", "");
      result[section] = JSON.parse(setting.value);
    });

    return result;
  } catch (error) {
    console.error("Error getting all settings:", error);
    return {};
  }
}

export async function uploadImageToCloudinary(file: File) {
  try {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    const formData = new FormData();
    formData.append("file", dataURI);
    formData.append("upload_preset", "eaststore");
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Image uploaded to Cloudinary: ${data.secure_url}`);

    return {
      success: true,
      url: data.secure_url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      url: null,
    };
  }
}
