import { createClient } from "@supabase/supabase-js";
const id = process.env.DEMO_USER_ID;
if (!id) throw new Error("Set DEMO_USER_ID to a dedicated demo account UUID.");
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
const pieces = [
  ["Suede jacket", "jackets", "brown"],
  ["Ribbed tank", "tops", "cream"],
  ["Straight jeans", "jeans", "blue"],
  ["Everyday loafers", "shoes", "brown"],
  ["Shoulder bag", "bags", "burgundy"],
  ["Cotton shirt", "shirts", "white"],
  ["Tailored trousers", "pants", "black"],
  ["Wool sweater", "sweaters", "gray"],
  ["Long coat", "coats", "camel"],
  ["Simple trainers", "shoes", "white"],
  ["Slip dress", "dresses", "black"],
  ["Midi skirt", "skirts", "navy"],
  ["Linen shorts", "shorts", "beige"],
  ["Cropped cardigan", "sweaters", "pink"],
  ["Canvas tote", "bags", "cream"],
  ["Everyday earrings", "jewelry", "gold"],
  ["Silk scarf", "accessories", "red"],
  ["Workout leggings", "activewear", "black"],
  ["Denim jacket", "jackets", "blue"],
  ["Relaxed tee", "tops", "white"],
];
const { error } = await db
  .from("closet_items")
  .insert(
    pieces.map(([name, category, primary_color]) => ({
      user_id: id,
      name: `[Demo] ${name}`,
      category,
      primary_color,
      source: "demo",
      fit: "regular",
      pattern: "solid",
      style_tags: ["minimal", "casual"],
      season: ["spring", "fall"],
    })),
  );
if (error) throw error;
console.log("Created 20 explicitly labeled demo pieces.");
