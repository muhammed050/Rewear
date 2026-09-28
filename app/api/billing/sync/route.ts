import { NextResponse } from "next/server";
import { identity, adminDb } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
import { syncMembership, whop, planId } from "@/lib/whop";
import { reserve } from "@/lib/usage";
export const maxDuration = 120;
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const { client, user } = await identity();
    await reserve(
      user.id,
      "billing-sync",
      6,
      new Date().toISOString().slice(0, 13),
    );
    const { data, error } = await client
      .from("subscriptions")
      .select("provider_membership_id");
    if (error) throw error;
    const ids = new Set((data || []).map((s) => s.provider_membership_id));
    // Recover an initial purchase whose webhook was missed; never match by an unverified email.
    const { data: sessions, error: sessionError } = await adminDb()
      .from("checkout_sessions")
      .select("created_at,plan_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (sessionError) throw sessionError;
    if (sessions?.length) {
      for (const plan of new Set(sessions.map((s) => s.plan_id))) {
        if (![planId("monthly"), planId("annual")].includes(plan)) continue;
        const earliest = sessions
          .filter((s) => s.plan_id === plan)
          .map((s) => s.created_at)
          .sort()[0];
        let page = await whop().memberships.list({
          plan_id: plan,
          created_after: new Date(
            new Date(earliest).getTime() - 60000,
          ).toISOString(),
          first: 100,
        });
        for (let n = 0; n < 5; n++) {
          for (const membership of page.data) {
            if (membership.metadata?.rewear_user_id === user.id)
              ids.add(membership.id);
          }
          if (!page.hasNextPage()) break;
          page = await page.getNextPage();
        }
      }
    }
    let verified = 0;
    for (const id of ids)
      if (
        await syncMembership(
          id,
          `sync:${crypto.randomUUID()}`,
          "manual.sync",
          "sync",
        )
      )
        verified++;
    return NextResponse.json({
      ok: true,
      message: verified
        ? "Membership checked."
        : "No verified membership yet. If you just paid, allow a moment for confirmation.",
    });
  } catch (e) {
    return fail(e);
  }
}
