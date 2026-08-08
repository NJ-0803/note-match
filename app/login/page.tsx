"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import MagneticButton from "@/components/motion/MagneticButton";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-accent">
          N&deg; 003 — Account
        </p>
        <h1 className="mt-2 text-center font-display text-3xl tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to sync your collection across devices."
            : "Save your collection and matches to come back to later."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
            />
          </div>

          <MagneticButton
            type="submit"
            className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </MagneticButton>
        </form>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-border bg-surface-muted p-4 text-sm text-muted-foreground"
          >
            Accounts aren&apos;t connected to a real backend yet — this form isn&apos;t wired up to store or
            verify anything. Your collection still lives only in this browser via{" "}
            <Link href="/collection" className="underline hover:text-foreground">
              My Collection
            </Link>
            .
          </motion.div>
        )}

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "signin" ? "signup" : "signin"));
            setSubmitted(false);
          }}
          className="mt-6 w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signin" ? "Don't have an account? Create one" : "Already have an account? Sign in"}
        </button>
      </motion.div>
    </div>
  );
}
