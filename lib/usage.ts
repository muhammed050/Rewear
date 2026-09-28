import "server-only";
import { adminDb } from "./supabase";
import { limits } from "./config";
export async function hasEntitlement(userId: string) {
  const { data, error } = await adminDb()
    .from("entitlements")
    .select("expires_at")
    .eq("user_id", userId)
    .eq("key", "rewear_plus")
    .eq("status", "active");
  if (error) throw error;
  return (data || []).some(
    (e) => e.expires_at && new Date(e.expires_at) > new Date(),
  );
}
export async function planLimits(userId: string) {
  return limits[(await hasEntitlement(userId)) ? "plus" : "free"];
}
export async function reserve(
  subject: string,
  feature: string,
  limit: number,
  period = new Date().toISOString().slice(0, 7),
) {
  const { data, error } = await adminDb().rpc("consume_usage", {
    p_subject: subject,
    p_feature: feature,
    p_period: period,
    p_limit: limit,
  });
  if (error) throw error;
  if (!data) throw new Error("LIMIT");
  return async () => {
    await adminDb().rpc("release_usage", {
      p_subject: subject,
      p_feature: feature,
      p_period: period,
    });
  };
}
