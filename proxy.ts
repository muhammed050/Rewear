import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
export async function proxy(req: NextRequest) {
  let response = NextResponse.next({ request: req });
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    return response;
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (values) => {
          values.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({ request: req });
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  await client.auth.getUser();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = {
  matcher: [
    "/home/:path*",
    "/closet/:path*",
    "/outfits/:path*",
    "/settings/:path*",
    "/api/:path*",
    "/admin/:path*",
  ],
};
