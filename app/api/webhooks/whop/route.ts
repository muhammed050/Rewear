import { unwrapWebhook } from "@whop/sdk/helpers";
import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { whop, syncMembership } from "@/lib/whop";
import { billingEvents } from "@/lib/billing-state";
import { adminDb } from "@/lib/supabase";
export const maxDuration = 60;
export async function POST(req: Request) {
  if (!process.env.WHOP_WEBHOOK_SECRET)
    return new Response("Not configured", { status: 503 });
  const raw = await req.text();
  let event;
  try {
    event = z
      .object({
        id: z.string(),
        type: z.string(),
        data: z.record(z.string(), z.unknown()),
      })
      .parse(
        unwrapWebhook(raw, {
          headers: Object.fromEntries(req.headers),
          key: process.env.WHOP_WEBHOOK_SECRET,
        }),
      );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
  try {
    if (!billingEvents.has(event.type))
      return NextResponse.json({ received: true });
    const { data: done, error: readError } = await adminDb()
      .from("billing_webhook_events")
      .select("id")
      .eq("provider_event_id", event.id)
      .maybeSingle();
    if (readError) throw readError;
    if (done) return NextResponse.json({ received: true });
    let membershipId = event.type.startsWith("membership.")
      ? String(event.data.id)
      : (event.data.membership_id as string | undefined);
    if (event.type.startsWith("refund.") || event.type.startsWith("dispute.")) {
      const resource = event.type.startsWith("refund.")
        ? await whop().refunds.retrieve({ id: String(event.data.id) })
        : await whop().disputes.retrieve({ id: String(event.data.id) });
      const paymentId =
        "payment_id" in resource ? resource.payment_id : resource.payment.id;
      const payment = await whop().payments.retrieve({ id: paymentId });
      membershipId = payment.membership_id || undefined;
      if (membershipId) {
        const inactive = ["failed", "canceled", "won"].includes(
          resource.status,
        );
        const { error } = await adminDb()
          .from("billing_holds")
          .upsert({
            id: resource.id,
            membership_id: membershipId,
            active: !inactive,
            reason: event.type,
            updated_at: resource.updated_at,
          });
        if (error) throw error;
      }
    }
    if (membershipId)
      await syncMembership(
        membershipId,
        event.id,
        event.type,
        createHash("sha256").update(raw).digest("hex"),
      );
    return NextResponse.json({ received: true });
  } catch {
    return new Response("Processing failed; retry required", { status: 500 });
  }
}
