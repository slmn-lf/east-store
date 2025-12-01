"use server";

import { revalidatePath } from "next/cache";

// This is a simple in-memory store. In production, use a database.
// For this demo, we're storing credentials in memory (they will reset on server restart)
interface Credentials {
  username: string;
  password: string;
}

// eslint-disable-next-line prefer-const
let credentials: Credentials = {
  username: "admin",
  password: "password123",
};

interface UpdateCredentialsState {
  success: boolean;
  message: string;
}

export async function updateCredentials(
  prevState: UpdateCredentialsState | undefined,
  formData: FormData
): Promise<UpdateCredentialsState> {
  const currentPassword = formData.get("currentPassword") as string;
  const newUsername = formData.get("newUsername") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Verify current password
  if (currentPassword !== credentials.password) {
    return {
      success: false,
      message: "Password saat ini tidak sesuai. Silakan coba lagi.",
    };
  }

  // Track what was changed
  const changes: string[] = [];

  // Update username if provided
  if (newUsername && newUsername.trim()) {
    // Validation
    if (newUsername.length < 3) {
      return {
        success: false,
        message: "Username harus minimal 3 karakter",
      };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      return {
        success: false,
        message: "Username hanya boleh mengandung huruf, angka, dan underscore",
      };
    }

    credentials.username = newUsername;
    changes.push("username");
  }

  // Update password if provided
  if (newPassword && newPassword.trim()) {
    // Validation
    if (newPassword.length < 8) {
      return {
        success: false,
        message: "Password harus minimal 8 karakter",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: "Password baru dan konfirmasi password tidak sesuai",
      };
    }

    // Basic password strength check
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return {
        success: false,
        message:
          "Password harus mengandung huruf besar, huruf kecil, dan angka",
      };
    }

    credentials.password = newPassword;
    changes.push("password");
  }

  // Check if anything was actually changed
  if (changes.length === 0) {
    return {
      success: false,
      message: "Tidak ada yang diubah. Silakan masukkan data baru.",
    };
  }

  // Revalidate the page
  revalidatePath("/admin/user");

  // Success message
  const changedItems = changes.join(" dan ");
  return {
    success: true,
    message: `${changedItems.charAt(0).toUpperCase() + changedItems.slice(1)} berhasil diperbarui!`,
  };
}

export async function getCurrentCredentials() {
  // This function can be used to verify login credentials
  return credentials;
}
