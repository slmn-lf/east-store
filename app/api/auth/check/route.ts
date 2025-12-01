import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  console.log(
    "[AUTH-CHECK] Token present:",
    !!authToken,
    "Value:",
    authToken?.value
  );

  if (!authToken) {
    console.log("[AUTH-CHECK] FAIL - no token");
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Check if the token matches the expected value
  if (authToken.value === "static_token_value") {
    console.log("[AUTH-CHECK] PASS - token valid");
    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: 1,
          email: "admin@example.com",
          name: "Admin",
          wa_store: null,
        },
      },
      { status: 200 }
    );
  }

  console.log("[AUTH-CHECK] FAIL - token invalid");
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
