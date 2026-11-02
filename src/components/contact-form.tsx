"use client";

import { useState } from "react";
import { CheckIcon } from "./icons";

const reasons = [
  "Correction",
  "Editorial question",
  "Advertising",
  "Write for us",
  "Something else",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          reason: data.get("reason"),
          message: data.get("message"),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(body.message || "Message could not be sent.");
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Message could not be sent.");
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-sage/30 bg-sage-soft p-5" role="status">
        <CheckIcon className="mt-0.5 size-5 shrink-0 text-sage" />
        <div>
          <p className="font-serif text-lg font-semibold text-ink">Message sent</p>
          <p className="mt-1 text-sm text-muted">
            Thanks — a person will read this. Corrections get priority; everything else is
            answered within two working days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>

      <div>
        <label htmlFor="reason" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-faint">
          Reason
        </label>
        <select
          id="reason"
          name="reason"
          className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
          defaultValue={reasons[0]}
        >
          {reasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-faint">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          rows={6}
          placeholder="If this is a correction, include the article URL and the specific detail."
          className="w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-accent"
        />
      </div>

      {status === "error" ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-faint">
          We use your message only to reply. See the privacy policy.
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-faint">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
      />
    </div>
  );
}
