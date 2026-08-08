"use client";

import { useEffect, useState } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scramble(text: string) {
  return text
    .split("")
    .map((char) => (char === " " ? " " : CHARSET[Math.floor(Math.random() * CHARSET.length)]))
    .join("");
}

// One-off scramble-to-resolve reveal, meant for a single moment (not a
// running/repeating effect) - see the top-strip product label in
// ScrubVideoHero. Runs once on mount, then settles.
export default function DecryptedText({
  text,
  className = "",
  speed = 35,
  delay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  // Starts as the real text (matches SSR output, avoids a hydration
  // mismatch from randomizing during render) and is swapped to scrambled
  // client-side once mounted, immediately before the reveal begins.
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let revealed = 0;
    let frame: ReturnType<typeof setInterval> | undefined;
    setDisplay(scramble(text));
    const start = setTimeout(() => {
      frame = setInterval(() => {
        revealed += 1;
        setDisplay(
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < revealed) return text[i];
              return CHARSET[Math.floor(Math.random() * CHARSET.length)];
            })
            .join("")
        );
        if (revealed >= text.length) {
          if (frame) clearInterval(frame);
          setDisplay(text);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(start);
      if (frame) clearInterval(frame);
    };
  }, [text, speed, delay]);

  return <span className={className}>{display}</span>;
}
