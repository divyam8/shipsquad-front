"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlowButton } from "./GlowButton";
import { waitlistSchema } from "@/lib/validations";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "duplicate"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shipsquad-waitlist");
      if (saved) setStatus("success");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const result = waitlistSchema.safeParse({ email, projectDescription });
    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: result.data.email,
          projectDescription: result.data.projectDescription,
        }),
      });

      if (res.status === 409) {
        setStatus("duplicate");
        return;
      }

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      setStatus("success");
      localStorage.setItem("shipsquad-waitlist", "true");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-2xl border border-success/20 bg-success/5 p-6"
      >
        <svg
          className="h-12 w-12 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-semibold text-text-primary">
          You&apos;re on the list!
        </p>
        <p className="text-sm text-text-secondary">
          We&apos;ll be in touch soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3">
      <input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        className="min-h-[44px] rounded-xl border border-white/[0.12] bg-bg-elevated/80 px-4 py-3 text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent-blue/60 focus:ring-1 focus:ring-accent-blue/20"
        required
      />
      <textarea
        placeholder="Tell us about your project (optional)"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        rows={2}
        maxLength={500}
        className="resize-none rounded-xl border border-white/[0.12] bg-bg-elevated/80 px-4 py-3 text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent-blue/60 focus:ring-1 focus:ring-accent-blue/20"
      />
      {projectDescription.length > 0 && (
        <p className="text-right text-xs text-text-muted">
          {projectDescription.length}/500
        </p>
      )}
      <GlowButton type="submit" disabled={status === "loading"} size="lg">
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Joining...
          </span>
        ) : (
          "Join the Waitlist"
        )}
      </GlowButton>

      <AnimatePresence>
        {status === "error" && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-error"
          >
            {errorMessage}
          </motion.p>
        )}
        {status === "duplicate" && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-accent-cyan"
          >
            You&apos;re already on the list! We&apos;ll be in touch soon.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
