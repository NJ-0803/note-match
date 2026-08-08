"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useHeroCapabilities, useIsMobileViewport } from "@/lib/useHeroCapabilities";

function BottleMesh({ color, reveal }: { color: string; reveal: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y += delta * 0.12;

    const targetX = pointer.y * 0.12;
    const targetZ = pointer.x * 0.12;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.05);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetZ, 0.05);

    // Gentle vertical float, like it's suspended.
    group.position.y = Math.sin(performance.now() * 0.0006) * 0.08;

    const targetScale = 0.9 + reveal * 0.1;
    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, targetScale, 0.06));
  });

  return (
    <group ref={groupRef} scale={0.9}>
      {/* Body */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.55, 0.62, 1.5, 48]} />
        <MeshTransmissionMaterial
          thickness={0.5}
          roughness={0.05}
          transmission={0.95}
          ior={1.4}
          chromaticAberration={0.04}
          anisotropy={0.15}
          color={color}
          distortion={0.1}
          distortionScale={0.15}
          temporalDistortion={0.04}
          clearcoat={1}
          clearcoatRoughness={0.08}
          opacity={reveal}
          transparent
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.35, 32]} />
        <MeshTransmissionMaterial
          thickness={0.3}
          roughness={0.05}
          transmission={0.95}
          ior={1.4}
          color={color}
          clearcoat={1}
          opacity={reveal}
          transparent
        />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.22, 32]} />
        <meshStandardMaterial color="#1a1815" metalness={0.7} roughness={0.35} opacity={reveal} transparent />
      </mesh>
    </group>
  );
}

function RevealController({ children }: { children: (reveal: number) => React.ReactNode }) {
  const [reveal, setReveal] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const durationMs = 1400;
    let raf: number;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      setReveal(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <>{children(reveal)}</>;
}

export default function PerfumeBottle3D({ color }: { color: string }) {
  const capability = useHeroCapabilities();
  const isMobile = useIsMobileViewport();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (capability !== "enabled") {
    return (
      <div
        className="h-full w-full rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 45%, color-mix(in srgb, ${color} 25%, transparent), transparent 70%)`,
        }}
      />
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile }}
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 4], fov: 40 }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[2.5, 2, 3]} intensity={140} color="#f2efe8" decay={1.5} />
        <pointLight position={[-2.5, -1, 2]} intensity={70} color={color} decay={1.5} />
        <RevealController>{(reveal) => <BottleMesh color={color} reveal={reveal} />}</RevealController>
      </Canvas>
    </div>
  );
}
