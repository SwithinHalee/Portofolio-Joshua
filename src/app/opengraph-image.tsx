import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social card: bone canvas, hairline frame, editorial type. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F7F6F3",
          border: "1px solid #EAEAEA",
          padding: 64,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 2,
            color: "#616161",
          }}
        >
          <span>JOSHUA ABDIEL — ENGINEERING PORTFOLIO</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#111111",
              maxWidth: 900,
            }}
          >
            Engineering deliberate web interfaces.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 32,
              fontFamily: "monospace",
              fontSize: 22,
              color: "#616161",
            }}
          >
            <span
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
                padding: "8px 16px",
                borderRadius: 4,
                fontSize: 20,
              }}
            >
              FRONTEND ENGINEER
            </span>
            <span>TANGERANG, ID · TYPED · FAST</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
