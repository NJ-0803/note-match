"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import MaskReveal from "@/components/motion/MaskReveal";

const LINKS = [
  { href: "/", label: "Discover" },
  { href: "/compare", label: "Compare" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/collection", label: "My Collection" },
  { href: "/login", label: "Sign in" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="relative z-40 border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg tracking-tight">
            Note Match
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            data-cursor="Open"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            aria-expanded={open}
            aria-label="Open menu"
          >
            Menu
            <span className="flex flex-col gap-[3px]">
              <span className="block h-px w-4 bg-current" />
              <span className="block h-px w-4 bg-current" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
          >
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
              <span className="font-display text-lg tracking-tight">Note Match</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close menu"
              >
                Close
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-start justify-center gap-2 px-6 sm:px-16">
              {LINKS.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-cursor="Open"
                  className="group flex items-baseline gap-4 font-display text-4xl tracking-tight text-foreground/70 transition-colors hover:text-foreground sm:text-6xl"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                    className="font-mono text-sm text-accent"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>
                  <span className="relative inline-block">
                    <MaskReveal text={link.label} delay={0.14 + i * 0.06} />
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 ease-out group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
