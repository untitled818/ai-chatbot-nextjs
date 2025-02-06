// app/(auth)/[...nextauth]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { POST as AuthPOST, signIn, signOut } from "../../../auth";

export async function POST(request: NextRequest) {
  // 获取请求路径
  const { pathname } = new URL(request.url);
  console.log("NextAuth route hit", pathname);

  if (pathname === "/api/auth/login") {
    try {
      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json({
          code: 400,
          error: "Email and password are required",
        });
      }
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return NextResponse.json({
        code: 0,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error?.code === "credentials" && error.kind === "signIn") {
        return NextResponse.json({ code: 400, message: "credentials error" });
      }
      return NextResponse.json({ code: 500, error: "Internal server error" });
    }
  }
  if (pathname === "/api/auth/logout") {
    await signOut({ redirect: false, redirectTo: "/" });
    const response = NextResponse.json({ code: 0 });
    // response.cookies.delete("next-auth.session-token");
    // response.cookies.delete("next-auth.csrf-token");
    // response.cookies.delete("next-auth.callback-url");
    console.log("response", response);
    return response;
  }
  return AuthPOST(request);
}

export { GET } from "@/app/(auth)/auth";
