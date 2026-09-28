import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
export function configured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
export async function db() {
  if (!configured()) throw new Error("SETUP_REQUIRED");
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (values) => {
          try {
            values.forEach(({ name, value, options }) =>
              jar.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}
export function adminDb() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("SETUP_REQUIRED");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
}
export async function identity() {
  const client = await db();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const { data, error } = await client
    .from("profiles")
    .select("suspended")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  if (data?.suspended) throw new Error("FORBIDDEN");
  return { client, user };
}
