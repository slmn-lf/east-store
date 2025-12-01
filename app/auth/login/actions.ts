"use server";

import { cookies } from "next/headers";

export async function login(prevState: any, formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  console.log("[LOGIN] Attempt with:", { username, password });

  // Hardcoded credentials as requested
  if (username === "admin" && password === "password123") {
    console.log("[LOGIN] Credentials MATCH - setting cookie");
    // Set a simple cookie to indicate authentication
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "static_token_value", {
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    });

    console.log("[LOGIN] Cookie set successfully");
    return { success: true };
  }

  console.log("[LOGIN] Credentials INVALID");
  return {
    error: "Invalid username or password",
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return { success: true };
}
