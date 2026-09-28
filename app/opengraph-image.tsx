import { ImageResponse } from "next/og";
export const alt = "Rewear — You already own the outfit.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#fcfbf8",
        padding: "70px",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontFamily: "serif", fontSize: 60, color: "#8f243e" }}>
        rewear.
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 87,
          lineHeight: 1.05,
          fontFamily: "serif",
          color: "#171614",
        }}
      >
        <span>You already own</span>
        <span style={{ color: "#8f243e", fontStyle: "italic" }}>
          the outfit.
        </span>
      </div>
      <div style={{ fontSize: 23, color: "#746c64" }}>
        Your inspiration. Your closet. A whole new look.
      </div>
    </div>,
    size,
  );
}
