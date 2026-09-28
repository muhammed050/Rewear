import { NextResponse } from "next/server";
import { identity, adminDb } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
export async function GET() {
  try {
    const { client, user } = await identity();
    const tables = [
      "closet_items",
      "outfits",
      "recreations",
      "collections",
      "wear_history",
      "profiles",
      "subscriptions",
      "shared_results",
    ];
    const result: Record<string, unknown> = {
      exported_at: new Date().toISOString(),
    };
    for (const table of tables) {
      const { data, error } = await client
        .from(table)
        .select("*")
        .eq(table === "profiles" ? "id" : "user_id", user.id);
      if (error) throw error;
      result[table] = data;
    }
    return NextResponse.json(result, {
      headers: {
        "Content-Disposition": 'attachment; filename="rewear-data.json"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return fail(e);
  }
}
export async function DELETE(req: Request) {
  try {
    checkOrigin(req);
    const { client, user } = await identity();
    const body = await req.json();
    if (body.confirm !== "DELETE") throw new Error("INVALID");
    const { data: subs } = await client
      .from("subscriptions")
      .select("id")
      .in("status", ["active", "trialing", "past_due"])
      .eq("cancel_at_period_end", false);
    if (subs?.length)
      return NextResponse.json(
        {
          error:
            "Please cancel renewal in Manage Membership before deleting your account.",
        },
        { status: 409 },
      );
    for (const bucket of ["closet-private", "inspiration-private", "avatars"]) {
      for (;;) {
        const { data, error } = await adminDb()
          .storage.from(bucket)
          .list(user.id, { limit: 100 });
        if (error) throw error;
        if (!data?.length) break;
        const removal = await adminDb()
          .storage.from(bucket)
          .remove(data.map((f) => `${user.id}/${f.name}`));
        if (removal.error) throw removal.error;
      }
    }
    const { error } = await adminDb().auth.admin.deleteUser(user.id);
    if (error) throw error;
    await client.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
