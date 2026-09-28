import "server-only";
import { identity } from "./supabase";
export async function requireAdmin() {
  const { client, user } = await identity();
  const { data, error } = await client
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("FORBIDDEN");
  return user;
}
