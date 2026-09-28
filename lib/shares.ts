import "server-only";
import { adminDb, configured } from "./supabase";
export async function publicResult(token: string) {
  if (!/^[a-f0-9]{48}$/.test(token) || !configured()) return null;
  const { data, error } = await adminDb()
    .from("shared_results")
    .select("public_data,expires_at")
    .eq("public_token", token)
    .eq("is_active", true)
    .maybeSingle();
  if (
    error ||
    !data ||
    (data.expires_at && new Date(data.expires_at) < new Date())
  )
    return null;
  return data.public_data as {
    score: number;
    aesthetic: string[];
    items: { category: string; color: string; owned: boolean }[];
  };
}
