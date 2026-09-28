import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { adminDb } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
import { syncMembership } from "@/lib/whop";
export async function GET() {
  try {
    await requireAdmin();
    const tables = [
      "profiles",
      "recreations",
      "subscriptions",
      "ai_usage",
      "reports",
      "shared_results",
      "admin_audit_logs",
      "analytics_events",
      "feature_flags",
      "app_settings",
    ] as const;
    const entries = await Promise.all(
      tables.map(async (table) => {
        const q =
          table === "feature_flags" || table === "app_settings"
            ? adminDb().from(table).select("*")
            : adminDb()
                .from(table)
                .select("*", { count: "exact" })
                .order(
                  table === "subscriptions" ? "last_verified_at" : "created_at",
                  { ascending: false },
                )
                .limit(50);
        const { data, error, count } = await q;
        if (error) throw error;
        return [table, { rows: data, count }] as const;
      }),
    );
    return NextResponse.json(Object.fromEntries(entries));
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const actor = await requireAdmin();
    const b = z
      .object({
        action: z.enum([
          "suspend",
          "unsuspend",
          "revoke_share",
          "sync",
          "grant",
          "revoke",
          "flag",
          "pricing",
        ]),
        id: z.string().min(1).max(150),
        enabled: z.boolean().optional(),
        days: z.number().int().min(1).max(90).optional(),
        monthly: z.number().min(1).max(1000).optional(),
        annual: z.number().min(1).max(10000).optional(),
      })
      .parse(await req.json());
    const db = adminDb();
    let error: unknown;
    if (b.action === "suspend" || b.action === "unsuspend")
      ({ error } = await db
        .from("profiles")
        .update({ suspended: b.action === "suspend" })
        .eq("id", z.uuid().parse(b.id)));
    if (b.action === "revoke_share")
      ({ error } = await db
        .from("shared_results")
        .update({ is_active: false })
        .eq("id", z.uuid().parse(b.id)));
    if (b.action === "sync")
      await syncMembership(
        b.id,
        `admin:${crypto.randomUUID()}`,
        "admin.sync",
        "admin",
      );
    if (b.action === "grant")
      ({ error } = await db
        .from("entitlements")
        .upsert(
          {
            user_id: z.uuid().parse(b.id),
            key: "rewear_plus",
            source: "admin",
            status: "active",
            expires_at: new Date(
              Date.now() + (b.days || 7) * 86400000,
            ).toISOString(),
          },
          { onConflict: "user_id,key,source" },
        ));
    if (b.action === "revoke")
      ({ error } = await db
        .from("entitlements")
        .update({ status: "inactive" })
        .eq("user_id", z.uuid().parse(b.id))
        .eq("source", "admin"));
    if (b.action === "flag")
      ({ error } = await db
        .from("feature_flags")
        .update({ enabled: !!b.enabled })
        .eq("key", b.id));
    if (b.action === "pricing") {
      if (!b.monthly || !b.annual) throw new Error("INVALID");
      ({ error } = await db
        .from("app_settings")
        .update({
          value: { monthly: b.monthly, annual: b.annual, currency: "USD" },
        })
        .eq("key", "pricing"));
    }
    if (error) throw error;
    const audit = await db
      .from("admin_audit_logs")
      .insert({ actor_id: actor.id, action: b.action, target_id: b.id });
    if (audit.error) throw audit.error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
