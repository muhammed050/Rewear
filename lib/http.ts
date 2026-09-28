import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { appUrl } from "./config";
export function checkOrigin(req: Request) {
  if (req.headers.get("origin") !== new URL(appUrl).origin)
    throw new Error("FORBIDDEN");
}
export function fail(error: unknown) {
  const key =
    error instanceof ZodError || error instanceof SyntaxError
      ? "INVALID"
      : error instanceof Error
        ? error.message
        : "";
  const map: Record<string, [number, string]> = {
    UNAUTHORIZED: [401, "Sign in to save your wardrobe."],
    FORBIDDEN: [403, "This action is not available."],
    SETUP_REQUIRED: [503, "Rewear is getting ready. Please try again soon."],
    AI_UNAVAILABLE: [
      503,
      "Outfit analysis is being prepared. Your image has not been processed.",
    ],
    AI_FAILED: [
      502,
      "We couldn’t read that outfit clearly. Try another image or crop the outfit.",
    ],
    LIMIT: [
      429,
      "You have reached your plan limit. Explore Rewear+ or try again next month.",
    ],
    INVALID: [400, "Please check your details and try again."],
  };
  const [status, message] = map[key] || [
    500,
    "Something went wrong. Please try again.",
  ];
  return NextResponse.json({ error: message }, { status });
}
