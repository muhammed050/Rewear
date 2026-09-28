import { MetadataRoute } from "next";
import { appUrl } from "@/lib/config";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/home",
        "/closet",
        "/outfits",
        "/settings",
        "/onboarding",
        "/stylist",
        "/pack",
        "/admin",
        "/sign-in",
        "/recreate",
        "/r/",
      ],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
