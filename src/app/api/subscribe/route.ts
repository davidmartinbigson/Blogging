import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Very small in-memory throttle. Good enough for a single-region deploy. */
const hits = new Map<string, { count: number; reset: number }>();

function limited(key: string, limit = 6, windowMs = 60_000) {
  const now = Date.now();
  const record = hits.get(key);
  if (!record || record.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  record.count += 1;
  return record.count > limit;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (limited(ip)) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again in a minute." },
      { status: 429 },
    );
  }

  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { message: "That email address does not look right." },
      { status: 400 },
    );
  }

  const endpoint = process.env.NEWSLETTER_ENDPOINT;

  // No provider configured yet: accept the signup so the UI can be tested,
  // and log it so it is visible in the Vercel function logs.
  if (!endpoint) {
    console.info("[newsletter] signup (no NEWSLETTER_ENDPOINT configured):", email);
    return NextResponse.json({
      message: "You're on the list. Look for the first letter on Sunday.",
    });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEWSLETTER_TOKEN
          ? { Authorization: `Bearer ${process.env.NEWSLETTER_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ email, source: "sageandstory.com" }),
    });

    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
  } catch (error) {
    console.error("[newsletter] forward failed:", error);
    return NextResponse.json(
      { message: "We could not save that right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "You're on the list. Check your inbox to confirm." });
}
