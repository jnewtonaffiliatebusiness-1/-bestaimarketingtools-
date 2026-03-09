"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ParticleSystem from "./ParticleSystem";
import CategoryOrbs from "./CategoryOrbs";

function WebGLCheck({ children }: { children: React.ReactNode }) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  if (supported === null) return null;
  if (!supported) return null;
  return <>{children}</>;
}

export default function GalaxyScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <WebGLCheck>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={isMobile ? 0.75 : 1}
          gl={{ antialias: !isMobile, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <ParticleSystem count={isMobile ? 2000 : 8000} />
            <CategoryOrbs />
            {!isMobile && (
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.2}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
              />
            )}
          </Suspense>
        </Canvas>
      </WebGLCheck>
    </div>
  );
}
