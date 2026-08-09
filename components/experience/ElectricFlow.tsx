"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

type FlowLine = {
  id: string;
  d: string;
  duration: number;
  delay: number;
  width: number;
  dash: string;
  aboveText?: boolean;
  parallax: number;
};

// Replaces the central bottle: instead of an object, the hero's energy
// reads through motion itself - glowing current-like lines with a spark
// traveling each path (native SVG animateMotion, so it always tracks the
// path exactly regardless of viewBox scaling). Some sit behind the
// headline, some in front, for the same depth effect the ingredients use.
const LINES: FlowLine[] = [
  {
    id: "a",
    d: "M -50,120 C 250,50 450,300 700,220 C 950,150 1100,350 1300,280",
    duration: 5,
    delay: 0.3,
    width: 1.4,
    dash: "8 28",
    parallax: 10,
  },
  {
    id: "b",
    d: "M -50,650 C 300,700 500,450 750,500 C 1000,550 1150,380 1300,420",
    duration: 6.5,
    delay: 0.5,
    width: 1.4,
    dash: "6 30",
    parallax: 16,
    aboveText: true,
  },
  {
    id: "c",
    d: "M 150,-50 C 260,220 560,150 600,400 C 640,650 460,700 520,850",
    duration: 4.2,
    delay: 0.4,
    width: 1.1,
    dash: "5 22",
    parallax: 22,
    aboveText: true,
  },
  {
    id: "d",
    d: "M 1250,100 C 950,250 850,150 600,350 C 400,500 250,450 -50,600",
    duration: 7,
    delay: 0.6,
    width: 1.4,
    dash: "10 34",
    parallax: 8,
  },
];

function FlowLineLayer({
  line,
  pointerX,
  pointerY,
}: {
  line: FlowLine;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const x = useTransform(pointerX, (v) => v * line.parallax);
  const y = useTransform(pointerY, (v) => v * line.parallax * 0.6);

  return (
    <motion.div
      aria-hidden
      style={{ x, y, zIndex: line.aboveText ? 25 : 5 }}
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: line.delay }}
    >
      <svg className="h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none">
        <path id={`flow-${line.id}`} d={line.d} stroke="var(--accent)" strokeOpacity="0.14" strokeWidth={line.width} />
        <motion.path
          d={line.d}
          stroke="var(--accent)"
          strokeWidth={line.width}
          strokeLinecap="round"
          strokeDasharray={line.dash}
          style={{ filter: "drop-shadow(0 0 4px var(--accent))" }}
          animate={{ strokeDashoffset: [0, -220] }}
          transition={{ duration: line.duration, repeat: Infinity, ease: "linear" }}
        />
        <circle r={line.width + 2.5} fill="var(--accent)" style={{ filter: "drop-shadow(0 0 6px var(--accent))" }}>
          <animateMotion dur={`${line.duration * 1.4}s`} repeatCount="indefinite" rotate="auto">
            <mpath href={`#flow-${line.id}`} />
          </animateMotion>
        </circle>
      </svg>
    </motion.div>
  );
}

export default function ElectricFlow({
  pointerX,
  pointerY,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  return (
    <>
      {LINES.map((line) => (
        <FlowLineLayer key={line.id} line={line} pointerX={pointerX} pointerY={pointerY} />
      ))}
    </>
  );
}
