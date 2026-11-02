import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const hits = new Map<string, { count: number; reset: number }>();

function limited(key: string, limit = 4, windowMs = 60_000) {
  const now = Date.now();
  const record = hits.get(key);
  if (!record || record.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  record.count += 1;
  return record.count > limit;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (limited(ip)) {
    return NextResponse.json(
      { message: "Too many messages from this connection. Try again in a minute." },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const name = clean(payload.name, 80);
  const email = clean(payload.email, 254).toLowerCase();
  const reason = clean(payload.reason, 60) || "General";
  const message = clean(payload.message, 4000);

  if (name.length < 2) {
    return NextResponse.json({ message: "Please add your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ message: "That email address does not look right." }, { status: 400 });
  }
  if (message.length < 20) {
    return NextResponse.json(
      { message: "Please add a little more detail (20 characters or more)." },
      { status: 400 },
    );
  }

  const endpoint = process.env.CONTACT_ENDPOINT;

  if (!endpoint) {
    console.info("[contact] message received:", { name, email, reason, length: message.length });
    return NextResponse.json({ message: "Message received." });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, reason, message, site: "sageandstory.com" }),
    });
    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
  } catch (error) {
    console.error("[contact] forward failed:", error);
    return NextResponse.json(
      { message: "We could not deliver that just now. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "Message sent." });
}
