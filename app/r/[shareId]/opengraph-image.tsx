import { ImageResponse } from "next/og";
import { publicResult } from "@/lib/shares";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";
export default async function Image({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const r = await publicResult((await params).shareId);
  return new ImageResponse(
    <div
      style={{
        background: "#f3dce2",
        width: "100%",
        height: "100%",
        padding: 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#8f243e",
      }}
    >
      <span style={{ fontSize: 45 }}>rewear.</span>
      <span style={{ fontSize: 80, fontFamily: "serif" }}>
        {r
          ? `I already owned ${r.items.filter((i) => i.owned).length} of ${r.items.length} pieces.`
          : "This look is private."}
      </span>
      <span style={{ fontSize: 28 }}>
        {r
          ? "Your inspiration. Your closet. Your version."
          : "Create a look of your own."}
      </span>
    </div>,
    size,
  );
}
