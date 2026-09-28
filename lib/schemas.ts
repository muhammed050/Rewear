import { z } from "zod";
import { categories } from "./config";
export const garment = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(categories),
  primary_color: z.string().max(40),
  subcategory: z.string().max(80).default(""),
  fit: z.string().max(40).default("regular"),
  pattern: z.string().max(40).default("solid"),
  season: z.array(z.string().max(30)).max(4).default([]),
  style_tags: z.array(z.string().max(30)).max(8).default([]),
  brand: z.string().max(80).default(""),
  ai_confidence: z.number().min(0).max(1).default(0),
});
export const analysisSchema = z.object({
  aesthetic: z.array(z.string()).max(8),
  palette: z.array(z.string()).max(10),
  items: z.array(garment).min(1).max(20),
});
export type Garment = z.infer<typeof garment>;
export type Analysis = z.infer<typeof analysisSchema>;
export type ClosetItem = Garment & {
  id: string;
  image_url: string | null;
  favorite: boolean;
  created_at: string;
};
