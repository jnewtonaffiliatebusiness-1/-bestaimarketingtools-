"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";

const ORBS = [
  { name: "AI Marketing", slug: "ai-marketing-automation", color: "#6366f1", position: [-3, 0.5, 0] as [number, number, number] },
  { name: "Email Marketing", slug: "email-marketing", color: "#f59e0b", position: [-1.5, -0.8, 1] as [number, number, number] },
  { name: "SEO Tools", slug: "seo-content-tools", color: "#10b981", position: [0, 1.2, -1] as [number, number, number] },
  { name: "Social Media", slug: "social-media-analytics", color: "#3b82f6", position: [1.5, -0.5, 1] as [number, number, number] },
  { name: "CRM & Sales", slug: "crm-sales-automation", color: "#ef4444", position: [3, 0.3, 0] as [number, number, number] },
];

function Orb({ orb }: { orb: typeof ORBS[0] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const baseY = orb.position[1];

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = baseY + Math.sin(clock.elapsedTime * 0.8 + orb.position[0]) * 0.15;
      const targetScale = hovered ? 1.4 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={orb.position}
      onClick={() => router.push(`/category/${orb.slug}`)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial
        color={orb.color}
        emissive={orb.color}
        emissiveIntensity={hovered ? 1.2 : 0.6}
        roughness={0.1}
        metalness={0.3}
      />
      {hovered && (
        <Html center distanceFactor={6}>
          <div className="pointer-events-none whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white backdrop-blur">
            {orb.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default function CategoryOrbs() {
  return (
    <>
      {ORBS.map((orb) => (
        <Orb key={orb.slug} orb={orb} />
      ))}
    </>
  );
}
