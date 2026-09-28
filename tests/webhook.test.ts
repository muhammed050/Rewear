import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { unwrapWebhook } from "@whop/sdk/helpers";
const key =
  "ws_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
function signed(payload: string, timestamp: string) {
  const id = "msg_test";
  const signature = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${payload}`)
    .digest("base64");
  return {
    "webhook-id": id,
    "webhook-timestamp": timestamp,
    "webhook-signature": `v1,${signature}`,
  };
}
test("official Whop verifier accepts signed raw bytes and rejects mutation and replay", () => {
  const body = JSON.stringify({
    id: "msg_test",
    type: "membership.activated",
    data: { id: "mem_test" },
  });
  const time = String(Math.floor(Date.now() / 1000));
  assert.equal(
    unwrapWebhook(body, { headers: signed(body, time), key }).type,
    "membership.activated",
  );
  assert.throws(() =>
    unwrapWebhook(body + " ", { headers: signed(body, time), key }),
  );
  assert.throws(() =>
    unwrapWebhook(body, { headers: signed(body, "100"), key }),
  );
});
