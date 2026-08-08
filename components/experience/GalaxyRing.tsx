"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 2200;
const INNER_RADIUS = 0.75;
const OUTER_RADIUS = 1.55;

// A flattened ring of points, denser and brighter near the inner edge and
// thinning into a wispy, cooler-toned trail toward the outside - reads as an
// orbital / accretion-disk shape rather than a plain closed torus.
function buildRing() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  const core = new THREE.Color("#fff6e8");
  const mid = new THREE.Color("#e8b876");
  const edge = new THREE.Color("#7a5230");

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.pow(Math.random(), 1.8);
    const radius = THREE.MathUtils.lerp(INNER_RADIUS, OUTER_RADIUS, t);
    const angle = Math.random() * Math.PI * 2;
    const thickness = 0.06 - t * 0.045;
    const y = (Math.random() - 0.5) * thickness;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    const c = t < 0.4 ? core.clone().lerp(mid, t / 0.4) : mid.clone().lerp(edge, (t - 0.4) / 0.6);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  return { positions, colors };
}

// A soft round glow sprite for each particle, drawn once to a canvas rather
// than shipping an image asset - plain square WebGL points read as hard
// pixels, this keeps them consistent with the glow language used elsewhere
// (cursor trail, atmosphere blobs).
function buildSpriteTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.7)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function GalaxyRing({ reveal }: { reveal: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const { positions, colors } = useMemo(buildRing, []);
  const sprite = useMemo(buildSpriteTexture, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y += delta * 0.06;

    // Held at a tilt so the ring reads edge-on like a galaxy/accretion disk,
    // with a small cursor-driven parallax layered on top.
    const targetX = 0.4 + pointer.y * 0.08;
    const targetZ = pointer.x * 0.08;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.04);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetZ, 0.04);

    const targetScale = 0.85 + reveal * 0.15;
    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, targetScale, 0.06));
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]} scale={0.85}>
      {/* Glowing core, faked with layered additive-blended spheres since
          there's no postprocessing/bloom pipeline in this project. */}
      <mesh>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color="#fff6e8" transparent opacity={reveal} />
      </mesh>
      <mesh scale={1.8}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial
          color="#f0c98a"
          transparent
          opacity={reveal * 0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={3.2}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial
          color="#c2a878"
          transparent
          opacity={reveal * 0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={PARTICLE_COUNT} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} count={PARTICLE_COUNT} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          map={sprite}
          vertexColors
          transparent
          opacity={reveal * 0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
