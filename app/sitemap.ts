import { MetadataRoute } from "next";
import { appUrl } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/how-it-works",
    "/pricing",
    "/examples",
    "/ai-outfit-recreator",
    "/digital-closet",
    "/outfit-planner",
    "/packing-list",
    "/blog",
    "/blog/build-a-digital-closet",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${appUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
