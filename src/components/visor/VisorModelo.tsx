"use client";

import { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds, Center, useGLTF } from "@react-three/drei";

// Carga el archivo .glb desde el enlace temporal del navegador.
function Modelo({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Si el archivo no es un .glb válido, no rompemos la página: mostramos un aviso.
class LimiteError extends Component<
  { fallback: ReactNode; children: ReactNode },
  { fallo: boolean }
> {
  state = { fallo: false };
  static getDerivedStateFromError() {
    return { fallo: true };
  }
  render() {
    return this.state.fallo ? this.props.fallback : this.props.children;
  }
}

export default function VisorModelo({ url }: { url: string }) {
  return (
    <LimiteError
      fallback={
        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-stone-500">
          El archivo se guardó, pero no se pudo mostrar la vista previa 3D
          (¿es un .glb válido?).
        </div>
      }
    >
      <Canvas
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [3.5, 2, 4.5], fov: 45 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#f1efe9"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        <directionalLight position={[-5, 3, -4]} intensity={0.4} />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Modelo url={url} />
            </Center>
          </Bounds>
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.1}
        />
      </Canvas>
    </LimiteError>
  );
}
