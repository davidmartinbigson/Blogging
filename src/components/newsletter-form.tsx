"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CheckIcon } from "./icons";

type Props = {
  variant?: "inline" | "stacked";
  className?: string;
  cta?: string;
};

export function NewsletterForm({ variant = "inline", className, cta = "Subscribe" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setStatus("done");
      setMessage(data.message || "You're on the list. Check your inbox to confirm.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div
        className={cn(
          "flex items-start gap-2.5 rounded-lg border border-sage/30 bg-sage-soft px-4 py-3 text-sm text-ink-soft",
          className,
        )}
        role="status"
      >
        <CheckIcon className="mt-0.5 size-4 shrink-0 text-sage" />
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(variant === "inline" ? "flex flex-col gap-2 sm:flex-row" : "flex flex-col gap-2", className)}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent"
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85 disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : cta}
        <ArrowRightIcon className="size-3.5" />
      </button>
      {status === "error" ? (
        <p className="text-xs text-accent" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
