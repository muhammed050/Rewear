import "server-only";
import { WhopClient } from "@whop/sdk";
import { createHmac, timingSafeEqual } from "crypto";
import { adminDb } from "./supabase";
import { membershipAccess } from "./billing-state";
export function whop() {
  if (!process.env.WHOP_API_KEY) throw new Error("SETUP_REQUIRED");
  return new WhopClient({
    token: process.env.WHOP_API_KEY,
    apiVersionDate: "2026-09-23",
  });
}
export function planId(key: string) {
  return key === "annual"
    ? process.env.WHOP_ANNUAL_PLAN_ID
    : process.env.WHOP_MONTHLY_PLAN_ID;
}
export function claim(userId: string, nonce: string, plan: string) {
  if (!process.env.WHOP_WEBHOOK_SECRET) throw new Error("SETUP_REQUIRED");
  return createHmac("sha256", process.env.WHOP_WEBHOOK_SECRET)
    .update(`${userId}:${nonce}:${plan}`)
    .digest("hex");
}
export async function syncMembership(
  id: string,
  event: string,
  type: string,
  hash: string,
) {
  const verified = new Date().toISOString();
  const m = await whop().memberships.retrieve({ id });
  const meta = m.metadata || {};
  const userId = String(meta.rewear_user_id || "");
  const nonce = String(meta.rewear_nonce || "");
  const signature = String(meta.rewear_claim || "");
  if (!userId || !nonce || !signature) return false;
  const expected = claim(userId, nonce, m.plan_id);
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
    return false;
  if (![planId("monthly"), planId("annual")].includes(m.plan_id)) return false;
  const { data: hold } = await adminDb()
    .from("billing_holds")
    .select("membership_id")
    .eq("membership_id", id)
    .eq("active", true)
    .limit(1);
  const active =
    membershipAccess(m.status, m.current_period_end) && !hold?.length;
  const { error } = await adminDb().rpc("apply_membership", {
    p_event: event,
    p_type: type,
    p_hash: hash,
    p_user: userId,
    p_membership: m.id,
    p_plan: m.plan_id,
    p_key: m.plan_id === planId("annual") ? "annual" : "monthly",
    p_status: hold?.length ? "revoked" : m.status,
    p_active: active,
    p_end: m.current_period_end,
    p_cancel: m.cancel_at_period_end,
    p_verified: verified,
  });
  if (error) throw error;
  return true;
}
