"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  count: number;
}

export default function ParticleSystem({ count }: Props) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#1a1aff"), // deep blue
      new THREE.Color("#ffffff"), // white
      new THREE.Color("#ff8c00"), // amber
      new THREE.Color("#6366f1"), // indigo
      new THREE.Color("#a78bfa"), // violet
    ];

    for (let i = 0; i < count; i++) {
      // Galaxy spiral arms
      const arm = Math.floor(Math.random() * 3);
      const angle = (arm / 3) * Math.PI * 2;
      const radius = Math.random() * 8 + 0.5;
      const spread = radius * 0.3;
      const armAngle = angle + radius * 0.5;

      positions[i * 3] = Math.cos(armAngle) * radius + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = Math.sin(armAngle) * radius + (Math.random() - 0.5) * spread;

      const color = palette[Math.floor(Math.random() * palette.length)];
      // Core particles are brighter (white/indigo), outer are dimmer blue
      const brightness = Math.max(0, 1 - radius / 12);
      colors[i * 3] = color.r * (0.5 + brightness * 0.5);
      colors[i * 3 + 1] = color.g * (0.5 + brightness * 0.5);
      colors[i * 3 + 2] = color.b * (0.5 + brightness * 0.5);
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
