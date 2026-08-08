"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimationControls, useTransform, useReducedMotion, type MotionValue } from "motion/react";

// The hero's one central object. Image-based (real product photography,
// hand digitally removed) rather than a fake procedural 3D bottle - built so
// a GLB/GLTF model can later drop in behind the same pointer-tilt + entrance
// + gentle-float motion logic without touching this file's structure much.
export default function CentralBottle({
  pointerX,
  pointerY,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  const rotateY = useTransform(pointerX, [-1, 1], [-7, 7]);
  const rotateX = useTransform(pointerY, [-1, 1], [5, -5]);
  const driftX = useTransform(pointerX, (v) => v * 14);
  const driftY = useTransform(pointerY, (v) => v * 8);

  useEffect(() => {
    if (prefersReducedMotion) {
      controls.set("visible");
      return;
    }
    let cancelled = false;
    (async () => {
      await controls.start("visible");
      if (cancelled) return;
      controls.start("float");
    })();
    return () => {
      cancelled = true;
    };
  }, [controls, prefersReducedMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[16%] z-10 flex justify-center"
      style={{ perspective: 1200 }}
    >
      <motion.div style={{ x: driftX, y: driftY, rotateX, rotateY }} className="relative">
        <motion.div
          data-cursor="Explore"
          data-cursor-strong
          variants={{
            hidden: { opacity: 0, scale: 0.82, y: 46, filter: "blur(18px)" },
            visible: {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 1.15, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
            },
            float: {
              y: [0, -12, 0],
              rotate: [0, 1.2, 0, -1.2, 0],
              transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            },
          }}
          initial="hidden"
          animate={controls}
          className="pointer-events-auto relative cursor-none"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 scale-125 rounded-full bg-accent/25 blur-[70px]"
            style={{ mixBlendMode: "screen" }}
          />
          <Image
            src="/hero/bottle-float.jpg"
            alt="Emporio Armani Stronger With You Absolutely"
            width={900}
            height={1350}
            priority
            className="h-[32vh] w-auto max-h-[320px] select-none object-contain sm:h-[38vh]"
            style={{ mixBlendMode: "screen" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
