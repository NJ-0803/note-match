"use client";

import { useEffect, useRef } from "react";

type ThinkingOrbProps = {
  className?: string;
  label?: string;
  paused?: boolean;
  size?: number;
};

type Dot = { x: number; y: number; z: number; r: number; ink: number; alpha: number };

function drawSearchingOrb(ctx: CanvasRenderingContext2D, size: number, time: number, dark: boolean) {
  const center = size / 2;
  const radius = (size / 2) * 0.82;
  const tilt = 0.4 + 0.06 * Math.sin(time * 0.35);
  const yaw = time * 0.5;
  const scan = time * 1.7;
  const sinTilt = Math.sin(tilt);
  const cosTilt = Math.cos(tilt);
  const sinYaw = Math.sin(yaw);
  const cosYaw = Math.cos(yaw);
  const radiusScale = (size / 300) ** 0.6;
  const dots: Dot[] = [];
  const rings = size <= 24 ? 6 : 17;
  const longitudeDensity = size <= 24 ? 14 : 44;

  for (let ring = 0; ring <= rings; ring++) {
    const latitude = -Math.PI / 2 + (ring / rings) * Math.PI;
    const cosLatitude = Math.cos(latitude);
    const sinLatitude = Math.sin(latitude);
    const longitudeCount = Math.max(1, Math.round(Math.abs(cosLatitude) * longitudeDensity));

    for (let longitudeIndex = 0; longitudeIndex < longitudeCount; longitudeIndex++) {
      const longitude = (longitudeIndex / longitudeCount) * 2 * Math.PI;
      const x = cosLatitude * Math.cos(longitude);
      const y = sinLatitude;
      const z = cosLatitude * Math.sin(longitude);
      const rotatedX = x * cosYaw + z * sinYaw;
      const rotatedZ = -x * sinYaw + z * cosYaw;
      const rotatedY = y * cosTilt - rotatedZ * sinTilt;
      const depth = y * sinTilt + rotatedZ * cosTilt;
      const angularDistance = Math.atan2(Math.sin(longitude + yaw - scan), Math.cos(longitude + yaw - scan));
      const scanBoost = Math.exp(-(angularDistance * angularDistance) / 0.18) * Math.max(0, depth);

      dots.push({
        x: center + rotatedX * radius,
        y: center - rotatedY * radius,
        z: depth,
        r: Math.max(0.3, (1.05 + 2.975 * ((depth + 1) / 2) + scanBoost) * radiusScale),
        ink: 0.62 - 0.54 * ((depth + 1) / 2),
        alpha: 0.45 + 0.55 * Math.min(1, scanBoost),
      });
    }
  }

  dots.sort((a, b) => a.z - b.z);
  for (const dot of dots) {
    const grayscale = Math.round((dark ? 1 - dot.ink : dot.ink) * 255);
    ctx.fillStyle = `rgba(${grayscale}, ${grayscale}, ${grayscale}, ${dot.alpha})`;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function ThinkingOrb({ className, label = "Finding scent matches", paused = false, size = 20 }: ThinkingOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let running = false;
    let visible = true;

    const frame = (time: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, size, size);
      drawSearchingOrb(context, size, time / 1000, true);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrame);
    };

    const loop = (time: number) => {
      frame(time);
      if (running) animationFrame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || paused || reducedMotion || document.visibilityState === "hidden") return;
      running = true;
      animationFrame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") stop();
      else if (visible) start();
    };

    frame(reducedMotion ? 600 : performance.now());
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [paused, size]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={label}
      className={className}
      height={size}
      role="img"
      style={{ display: "block", height: size, width: size }}
      width={size}
    />
  );
}
