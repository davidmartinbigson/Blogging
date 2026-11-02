import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const revalidate = 86400;
export const contentType = "image/png";

const size = { width: 1200, height: 630 };

function clamp(text: string, max = 110) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/**
 * Dynamic Open Graph / social card generator.
 * /og?title=...&k=food
 * Generated on demand at the edge and cached for a day — no design tool needed.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clamp(searchParams.get("title") || `${siteConfig.name} — ${siteConfig.tagline}`, 96);
  const kicker = (searchParams.get("kicker") || "Sage & Story").toUpperCase().slice(0, 40);
  const kind = searchParams.get("kind") === "story" ? "STORY STUDIO" : null;
  const accent = kind ? "#d8a74a" : "#e2743f";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14110d",
          padding: "64px 72px",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "radial-gradient(circle, #4d6a5233 0%, transparent 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 40, color: "#f4eee4" }}>Sage</span>
            <span style={{ fontSize: 40, color: accent }}>&amp;</span>
            <span style={{ fontSize: 40, color: "#f4eee4" }}>Story</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 3,
              color: accent,
              textTransform: "uppercase",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {kind ?? kicker}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 64 : 76,
            lineHeight: 1.12,
            color: "#f4eee4",
            letterSpacing: -1.5,
            maxWidth: 980,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #3a332b",
            paddingTop: 24,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 22,
            color: "#a49a8b",
          }}
        >
          <span>{siteConfig.tagline}</span>
          <span>{siteConfig.domain}</span>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
      },
    },
  );
}
