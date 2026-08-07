"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const SESSION_KEY = "note-match:intro-shown";
const AUTO_DISMISS_MS = 4200;
const SKIP_APPEARS_MS = 1000;

const taglineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
};

const word = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function WelcomeIntro() {
  // Starts `null` ("checking") so the server and first client render both
  // produce nothing - the sessionStorage check only ever happens after
  // mount, so this overlay never causes a hydration mismatch or hides the
  // real page underneath; it's purely additive on top of it.
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);
    setShouldShow(!alreadySeen);
  }, []);

  useEffect(() => {
    if (!shouldShow) return;
    const skipTimer = setTimeout(() => setShowSkip(true), SKIP_APPEARS_MS);
    const autoTimer = setTimeout(() => dismiss(), AUTO_DISMISS_MS);
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(autoTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow]);

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  }

  if (!shouldShow) return null;

  const tagline = "Find your next favourite scent — by notes, not luck.".split(" ");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6"
        >
          <svg width="140" height="140" viewBox="0 0 140 140" className="mb-6 text-foreground">
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx="70"
                cy="70"
                r={18 + i * 22}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1, 1.15] }}
                transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity, repeatDelay: 0.4 }}
              />
            ))}
          </svg>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold tracking-tight"
          >
            🌸 Note Match
          </motion.h1>

          <motion.p
            variants={taglineContainer}
            initial="hidden"
            animate="show"
            className="mt-3 flex max-w-sm flex-wrap justify-center gap-x-1.5 text-center text-muted-foreground"
          >
            {tagline.map((w, i) => (
              <motion.span key={i} variants={word}>
                {w}
              </motion.span>
            ))}
          </motion.p>

          {showSkip && (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={dismiss}
              className="absolute bottom-10 text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Skip
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
