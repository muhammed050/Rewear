import { NextResponse } from "next/server";
import { z } from "zod";
import { identity, adminDb } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
import { analysisSchema, ClosetItem } from "@/lib/schemas";
import { matchCloset } from "@/lib/matching";
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const { client, user } = await identity();
    const { analysis, version } = z
      .object({
        analysis: analysisSchema,
        version: z.number().int().min(0).max(1000).default(0),
      })
      .parse(await req.json());
    const { data: closet, error: readError } = await client
      .from("closet_items")
      .select("*")
      .limit(10000);
    if (readError) throw readError;
    const matches = matchCloset(
      analysis.items,
      (closet || []) as ClosetItem[],
      version,
    );
    const score = Math.round(
      matches.reduce((sum, m) => sum + (m.match?.score || 0), 0) /
        matches.length,
    );
    const safe = matches.map((m) => ({
      source: m.source,
      match: m.match
        ? { id: m.match.item.id, name: m.match.item.name, score: m.match.score }
        : null,
    }));
    const { data, error } = await adminDb()
      .from("recreations")
      .insert({
        user_id: user.id,
        match_score: score,
        analysis_json: { analysis, matches: safe },
      })
      .select("id")
      .single();
    if (error) throw error;
    return NextResponse.json({ id: data.id, score, matches: safe });
  } catch (e) {
    return fail(e);
  }
}
