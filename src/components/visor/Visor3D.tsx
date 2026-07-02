"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { SofaModel } from "./SofaModel";

export default function Visor3D({ color }: { color: string }) {
  return (
    <Canvas camera={{ position: [3.6, 2.0, 4.6], fov: 40 }} dpr={[1, 2]}>
      <color attach="background" args={["#f1efe9"]} />

      {/* Iluminación */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} />
      <directionalLight position={[-5, 3, -4]} intensity={0.4} />

      <Suspense fallback={null}>
        <SofaModel color={color} />
        {/* Sombra suave en el piso para "anclar" el sofá */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.35}
          scale={12}
          blur={2.6}
          far={4}
        />
      </Suspense>

      {/* Controles: rotar (arrastrar), zoom (rueda/pellizco). Sin desplazamiento. */}
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.1}
        target={[0, 0.85, 0]}
        minDistance={3}
        maxDistance={9}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2 - 0.02}
      />
    </Canvas>
  );
}
