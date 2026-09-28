import { NextResponse } from "next/server";
import { z } from "zod";
import { identity, adminDb } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
import { appUrl } from "@/lib/config";
export async function GET() {
  try {
    const { client } = await identity();
    const { data, error } = await client
      .from("shared_results")
      .select("id,public_token,is_active,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ shares: data || [] });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const { client, user } = await identity();
    const { recreationId } = z
      .object({ recreationId: z.uuid() })
      .parse(await req.json());
    const { data: r } = await client
      .from("recreations")
      .select("match_score,analysis_json")
      .eq("id", recreationId)
      .single();
    if (!r) throw new Error("FORBIDDEN");
    const publicData = {
      score: r.match_score,
      items: r.analysis_json.matches.map(
        (m: {
          source: { category: string; primary_color: string };
          match: { score: number } | null;
        }) => ({
          category: m.source.category,
          color: m.source.primary_color,
          owned: !!m.match,
        }),
      ),
      aesthetic: r.analysis_json.analysis.aesthetic,
    };
    const { data, error } = await adminDb()
      .from("shared_results")
      .insert({
        user_id: user.id,
        recreation_id: recreationId,
        public_data: publicData,
      })
      .select("public_token")
      .single();
    if (error) throw error;
    return NextResponse.json({ url: `${appUrl}/r/${data.public_token}` });
  } catch (e) {
    return fail(e);
  }
}
export async function DELETE(req: Request) {
  try {
    checkOrigin(req);
    const { user } = await identity();
    const { id } = z.object({ id: z.uuid() }).parse(await req.json());
    const { error } = await adminDb()
      .from("shared_results")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
