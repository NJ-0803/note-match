"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// A procedural rust-toned planet texture, drawn once to a canvas rather than
// shipping an image asset - blotchy surface noise plus faint polar caps read
// as "Mars" without needing a real NASA texture.
function buildMarsTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const base = ctx.createLinearGradient(0, 0, 0, size);
  base.addColorStop(0, "#b5652c");
  base.addColorStop(0.5, "#c97a3a");
  base.addColorStop(1, "#7c3f18");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1100; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 3 + Math.random() * 16;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(60,25,10,0.16)" : "rgba(230,165,105,0.14)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,246,235,0.3)";
  ctx.beginPath();
  ctx.ellipse(size / 2, size * 0.05, size * 0.3, size * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size / 2, size * 0.97, size * 0.24, size * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function MarsPlanet({ reveal }: { reveal: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const texture = useMemo(buildMarsTexture, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.y += delta * 0.05;

    const targetX = 0.15 + pointer.y * 0.08;
    const targetZ = pointer.x * 0.06;
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetX, 0.03);
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetZ, 0.03);

    const targetScale = 0.92 + reveal * 0.08;
    mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.06));
  });

  return (
    <group>
      <mesh ref={meshRef} scale={0.9}>
        <sphereGeometry args={[1.15, 48, 48]} />
        <meshStandardMaterial map={texture} roughness={0.92} metalness={0} transparent opacity={reveal} />
      </mesh>
      {/* thin warm atmosphere rim, faked with a back-facing additive shell */}
      <mesh scale={1.24}>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial
          color="#e8825a"
          transparent
          opacity={reveal * 0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
