"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function ScentObject({ reveal }: { reveal: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Slow idle rotation so it feels alive even without cursor input.
    mesh.rotation.y += delta * 0.08;

    // Restrained cursor-driven tilt - small range, eased toward target rather
    // than snapping, so it reads as a subtle parallax rather than a spin.
    const targetX = pointer.y * 0.15;
    const targetZTilt = pointer.x * 0.15;
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetX, 0.04);
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetZTilt, 0.04);

    const targetScale = 0.85 + reveal * 0.15;
    mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.06));
  });

  return (
    <mesh ref={meshRef} scale={0.85}>
      <icosahedronGeometry args={[1.15, 6]} />
      <MeshTransmissionMaterial
        thickness={0.5}
        roughness={0.06}
        transmission={0.95}
        ior={1.4}
        chromaticAberration={0.05}
        anisotropy={0.2}
        color="#d8bd8e"
        distortion={0.12}
        distortionScale={0.2}
        temporalDistortion={0.05}
        clearcoat={1}
        clearcoatRoughness={0.1}
        opacity={reveal}
        transparent
      />
    </mesh>
  );
}
