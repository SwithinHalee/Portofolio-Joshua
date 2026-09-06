"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#FFFFFF",
          color: "#111111",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            borderBottom: "1px solid #EAEAEA",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a href="/" style={{ color: "#111111", textDecoration: "none", fontSize: 14 }}>
            Joshua Abdiel
          </a>
          <span style={{ fontSize: 12, color: "#616161" }}>INDEX / CRITICAL</span>
        </header>
        <main
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.08em", color: "#9F2F2D", marginBottom: 12 }}>
              CRITICAL FAULT · APPLICATION SHELL
            </p>
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 40,
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
              }}
            >
              The archive failed to boot.
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#555555", marginBottom: 24 }}>
              A fault escaped the section boundary and reached the application shell. Reloading
              usually restores the index.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 4,
                  padding: "12px 20px",
                  fontFamily: "inherit",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Reload archive
              </button>
              <a
                href="/"
                style={{
                  border: "1px solid #EAEAEA",
                  backgroundColor: "#FBFBFA",
                  color: "#111111",
                  borderRadius: 4,
                  padding: "12px 20px",
                  fontSize: 12,
                  textDecoration: "none",
                }}
              >
                Return to index
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
