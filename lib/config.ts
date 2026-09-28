export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const categories = [
  "tops",
  "shirts",
  "sweaters",
  "jackets",
  "coats",
  "dresses",
  "skirts",
  "jeans",
  "pants",
  "shorts",
  "activewear",
  "shoes",
  "bags",
  "jewelry",
  "accessories",
  "other",
] as const;
export const limits = {
  free: { closet: 40, recreate: 5, stylist: 5 },
  plus: { closet: 10000, recreate: 200, stylist: 100 },
};
export const styles = [
  "Minimal",
  "Streetwear",
  "Old Money",
  "Y2K",
  "Coquette",
  "Clean Girl",
  "Vintage",
  "Casual",
  "Business Casual",
  "Athleisure",
  "Dark Feminine",
  "Boho",
];
