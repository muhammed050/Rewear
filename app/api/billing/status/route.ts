import { NextResponse } from "next/server";
import { identity } from "@/lib/supabase";
import { hasEntitlement } from "@/lib/usage";
import { fail } from "@/lib/http";
export async function GET() {
  try {
    const { client, user } = await identity();
    const { data } = await client
      .from("subscriptions")
      .select("plan_key,status,current_period_end,cancel_at_period_end")
      .order("last_verified_at", { ascending: false });
    return NextResponse.json({
      plus: await hasEntitlement(user.id),
      subscriptions: data || [],
    });
  } catch (e) {
    return fail(e);
  }
}
