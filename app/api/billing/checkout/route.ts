import { NextResponse } from "next/server";
import { z } from "zod";
import { identity, adminDb } from "@/lib/supabase";
import { checkOrigin, fail } from "@/lib/http";
import { whop, planId, claim } from "@/lib/whop";
import { appUrl } from "@/lib/config";
import { reserve } from "@/lib/usage";
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const { user } = await identity();
    await reserve(
      user.id,
      "checkout",
      8,
      new Date().toISOString().slice(0, 13),
    );
    const body = z
      .object({
        plan: z.enum(["monthly", "annual"]),
        affiliate: z.string().max(100).optional(),
        attribution: z
          .object({
            utm_source: z.string().max(200).optional(),
            utm_medium: z.string().max(200).optional(),
            utm_campaign: z.string().max(200).optional(),
            utm_content: z.string().max(200).optional(),
            utm_term: z.string().max(200).optional(),
          })
          .optional(),
      })
      .parse(await req.json());
    const id = planId(body.plan);
    if (!id) throw new Error("SETUP_REQUIRED");
    const nonce = crypto.randomUUID();
    const session = await whop().checkoutConfigurations.create({
      plan_id: id,
      mode: "payment",
      affiliate_code: body.affiliate,
      redirect_url: `${appUrl}/settings/billing`,
      metadata: {
        rewear_user_id: user.id,
        internal_plan: body.plan,
        rewear_nonce: nonce,
        rewear_claim: claim(user.id, nonce, id),
        ...body.attribution,
      },
    });
    const { error } = await adminDb()
      .from("checkout_sessions")
      .insert({
        id: session.id,
        user_id: user.id,
        plan_id: id,
        attribution: body.attribution || {},
      });
    if (error) throw error;
    return NextResponse.json({ sessionId: session.id, email: user.email });
  } catch (e) {
    return fail(e);
  }
}
