"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

export default function ScrubVideoHero({
  videoSrc,
  posterSrc,
  totalFrames = 60,
  children,
}: {
  videoSrc: string;
  posterSrc: string;
  totalFrames?: number;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [duration, setDuration] = useState(0);
  const [frame, setFrame] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  // Scrub through most of the clip, then let the last stretch of scroll
  // dissolve the whole scene away into whatever comes next.
  const scrubProgress = useTransform(scrollYProgress, [0, 0.75], [0, 1], { clamp: true });
  const dissolveOpacity = useTransform(scrollYProgress, [0.65, 1], [1, 0]);
  const dissolveScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const dissolveBlurPx = useTransform(scrollYProgress, [0.65, 1], [0, 14]);
  const dissolveFilter = useTransform(dissolveBlurPx, (v) => `blur(${v}px)`);
  const promptOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useMotionValueEvent(scrubProgress, "change", (v) => {
    const video = videoRef.current;
    if (video && duration) video.currentTime = v * duration;
    setFrame(Math.round(v * totalFrames));
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function onLoaded() {
      if (video) setDuration(video.duration);
    }
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      style={
        prefersReducedMotion
          ? undefined
          : { opacity: dissolveOpacity, scale: dissolveScale, filter: dissolveFilter }
      }
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {prefersReducedMotion ? (
        <Image src={posterSrc} alt="" fill priority className="object-cover" />
      ) : (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={posterSrc}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/75" />

      {/* Viewfinder corner brackets */}
      <div className="pointer-events-none absolute inset-6 sm:inset-8">
        <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-foreground/40" />
        <div className="absolute right-0 top-0 h-6 w-6 border-r border-t border-foreground/40" />
        <div className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-foreground/40" />
        <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-foreground/40" />
      </div>

      {/* Rotated side labels */}
      <div className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 -rotate-90 font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/40 sm:block">
        Scroll to explore
      </div>
      <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rotate-90 font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/40 sm:block">
        Note Match — Olfactory Archive
      </div>

      {/* Top strip */}
      <div className="relative z-10 flex items-start justify-between px-8 pt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50 sm:pt-10">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Fragrance Archive
        </span>
        <span className="hidden sm:inline">Emporio Armani · Stronger With You Absolutely</span>
      </div>

      {children}

      {/* Center scroll prompt */}
      <motion.div
        style={{ opacity: promptOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-28 z-10 flex flex-col items-center gap-2 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/60">Scroll to search</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-foreground/60"
        >
          ↓
        </motion.div>
      </motion.div>

      {/* Bottom scrubber */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-8 pb-6 font-mono text-[10px] uppercase tracking-widest text-foreground/50">
        <div className="mb-2 h-px w-full bg-foreground/15">
          <motion.div
            style={{ scaleX: scrubProgress }}
            className="h-full w-full origin-left bg-accent"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>01 — Discover</span>
          <span>
            Frame {String(frame).padStart(3, "0")} / {totalFrames}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
