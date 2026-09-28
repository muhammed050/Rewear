export function membershipAccess(status: string, end: string | null) {
  return (
    ["active", "trialing"].includes(status) &&
    !!end &&
    new Date(end).getTime() > Date.now()
  );
}
export const billingEvents = new Set([
  "membership.activated",
  "membership.deactivated",
  "membership.cancel_at_period_end_changed",
  "membership.trial_ending_soon",
  "payment.succeeded",
  "payment.failed",
  "payment.canceled",
  "payment.requires_action",
  "refund.created",
  "refund.updated",
  "dispute.created",
  "dispute.updated",
]);
