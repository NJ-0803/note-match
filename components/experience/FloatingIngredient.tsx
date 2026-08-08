"use client";

import { useEffect } from "react";
import { motion, useAnimationControls, useTransform, type MotionValue } from "motion/react";

export type IngredientType =
  | "bergamot"
  | "vanilla"
  | "petal"
  | "oud"
  | "peppercorn"
  | "droplet"
  | "amber";

type Edge = "top" | "bottom" | "left" | "right";

export type IngredientConfig = {
  id: string;
  type: IngredientType;
  /** position as % of the hero container */
  top: string;
  left: string;
  size: number;
  /** 0 (far background) - 1 (close foreground): drives parallax strength, blur, opacity, scale */
  depth: number;
  /** which edge it drifts in from on mount */
  from: Edge;
  entranceDelay: number;
  floatDuration: number;
  floatAmplitude: number;
  rotateRange: number;
  tint?: string;
  /** stacks above the headline text instead of behind it */
  aboveText?: boolean;
};

const EDGE_OFFSET: Record<Edge, { x: number; y: number }> = {
  top: { x: 0, y: -120 },
  bottom: { x: 0, y: 120 },
  left: { x: -140, y: 0 },
  right: { x: 140, y: 0 },
};

function Bergamot({ size, tint = "#9caf6a" }: { size: number; tint?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke={tint} strokeOpacity="0.55" strokeWidth="1.2" fill={tint} fillOpacity="0.08" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="20"
          y1="20"
          x2={20 + 17 * Math.cos((i * Math.PI) / 4)}
          y2={20 + 17 * Math.sin((i * Math.PI) / 4)}
          stroke={tint}
          strokeOpacity="0.35"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

function VanillaPod({ size, tint = "#4a3323" }: { size: number; tint?: string }) {
  return (
    <svg width={size * 0.4} height={size} viewBox="0 0 16 60" fill="none">
      <path
        d="M8 2C3 10 3 50 8 58C13 50 13 10 8 2Z"
        fill={tint}
        fillOpacity="0.55"
        stroke={tint}
        strokeOpacity="0.4"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function Petal({ size, tint = "#c98ba0" }: { size: number; tint?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size * 1.6,
        background: `radial-gradient(ellipse at 50% 35%, ${tint}55 0%, transparent 72%)`,
        filter: "blur(6px)",
        borderRadius: "50%",
      }}
    />
  );
}

function Oud({ size, tint = "#2a1c12" }: { size: number; tint?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size * 0.55,
        background: tint,
        opacity: 0.6,
        borderRadius: "40% 60% 55% 45% / 60% 40% 60% 40%",
      }}
    />
  );
}

function Peppercorn({ size, tint = "#1a1613" }: { size: number; tint?: string }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: size * 0.28,
            height: size * 0.28,
            background: tint,
            opacity: 0.7,
            borderRadius: "9999px",
          }}
        />
      ))}
    </div>
  );
}

function Droplet({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        background: "radial-gradient(circle at 32% 28%, rgba(242,239,232,0.9) 0%, rgba(194,168,120,0.25) 40%, transparent 75%)",
        backdropFilter: "blur(1px)",
        boxShadow: "inset 0 0 8px rgba(242,239,232,0.15)",
      }}
    />
  );
}

function Amber({ size, tint = "var(--accent)" }: { size: number; tint?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        background: `radial-gradient(circle, ${tint}66 0%, transparent 70%)`,
        filter: "blur(10px)",
        mixBlendMode: "screen",
      }}
    />
  );
}

const SHAPES: Record<IngredientType, (p: { size: number; tint?: string }) => React.ReactNode> = {
  bergamot: Bergamot,
  vanilla: VanillaPod,
  petal: Petal,
  oud: Oud,
  peppercorn: Peppercorn,
  droplet: Droplet,
  amber: Amber,
};

export default function FloatingIngredient({
  config,
  pointerX,
  pointerY,
}: {
  config: IngredientConfig;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const controls = useAnimationControls();

  const parallaxStrength = 14 + config.depth * 26;
  const px = useTransform(pointerX, (v) => v * parallaxStrength);
  const py = useTransform(pointerY, (v) => v * parallaxStrength * 0.7);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await controls.start("visible");
      if (cancelled) return;
      controls.start("float");
    })();
    return () => {
      cancelled = true;
    };
  }, [controls]);

  const origin = EDGE_OFFSET[config.from];
  const Shape = SHAPES[config.type];

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        top: config.top,
        left: config.left,
        x: px,
        y: py,
        zIndex: config.aboveText ? 25 : 5,
        opacity: 0.35 + config.depth * 0.5,
        filter: `blur(${(1 - config.depth) * 3}px)`,
      }}
    >
      <motion.div
        data-cursor="Discover"
        className="pointer-events-auto cursor-none"
        variants={{
          hidden: { opacity: 0, x: origin.x, y: origin.y, scale: 0.6, filter: "blur(10px)" },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 0.75 + config.depth * 0.4,
            filter: "blur(0px)",
            transition: { duration: 1, delay: config.entranceDelay, ease: [0.16, 1, 0.3, 1] },
          },
          float: {
            y: [0, -config.floatAmplitude, 0],
            rotate: [0, config.rotateRange, 0, -config.rotateRange, 0],
            transition: { duration: config.floatDuration, repeat: Infinity, ease: "easeInOut" },
          },
        }}
        initial="hidden"
        animate={controls}
      >
        <Shape size={config.size} tint={config.tint} />
      </motion.div>
    </motion.div>
  );
}
