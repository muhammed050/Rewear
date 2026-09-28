import test from "node:test";
import assert from "node:assert/strict";
import { garment, analysisSchema } from "../lib/schemas";
import { matchScore, matchCloset } from "../lib/matching";
import { membershipAccess } from "../lib/billing-state";
const jacket = garment.parse({
  name: "Suede jacket",
  category: "jackets",
  primary_color: "brown",
  fit: "regular",
  season: ["fall"],
  style_tags: ["minimal"],
});
test("matching rejects wrong category even if color and tags match", () => {
  assert.equal(matchScore(jacket, { ...jacket, category: "shoes" }), 0);
});
test("matching gives perfect score only when weighted attributes match", () => {
  assert.equal(matchScore(jacket, jacket), 100);
  assert.ok(matchScore(jacket, { ...jacket, primary_color: "green" }) < 100);
});
test("a wardrobe piece cannot fill two slots", () => {
  const item = {
    ...jacket,
    id: "one",
    image_url: null,
    favorite: false,
    created_at: "",
  };
  const result = matchCloset([jacket, jacket], [item]);
  assert.equal(result.filter((r) => r.match).length, 1);
});
test("empty closet never produces invented matches", () => {
  assert.equal(matchCloset([jacket], [])[0].match, null);
});
test("cancelled or expired membership never grants access", () => {
  const future = new Date(Date.now() + 86400000).toISOString();
  assert.equal(membershipAccess("canceled", future), false);
  assert.equal(membershipAccess("expired", future), false);
  assert.equal(membershipAccess("active", "2020-01-01"), false);
});
test("active paid period grants access, missing expiry fails closed", () => {
  assert.equal(
    membershipAccess("active", new Date(Date.now() + 86400000).toISOString()),
    true,
  );
  assert.equal(membershipAccess("active", null), false);
  assert.equal(
    membershipAccess("past_due", new Date(Date.now() + 86400000).toISOString()),
    false,
  );
});
test("AI schema rejects missing items and invalid confidence", () => {
  assert.equal(
    analysisSchema.safeParse({ items: [], aesthetic: [], palette: [] }).success,
    false,
  );
  assert.equal(
    garment.safeParse({ ...jacket, ai_confidence: 2 }).success,
    false,
  );
});
test("alternative versions choose a different owned candidate", () => {
  const a = {
    ...jacket,
    id: "one",
    image_url: null,
    favorite: false,
    created_at: "",
  };
  const b = { ...a, id: "two", primary_color: "tan" };
  assert.equal(matchCloset([jacket], [a, b], 0)[0].match?.item.id, "one");
  assert.equal(matchCloset([jacket], [a, b], 1)[0].match?.item.id, "two");
});
