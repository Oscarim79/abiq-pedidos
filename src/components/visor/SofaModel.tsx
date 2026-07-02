import { RoundedBox } from "@react-three/drei";

// Sofá modular de 3 plazas construido con primitivas. El color de la tela es
// configurable. Las patas son de latón (material metálico).
//
// NOTA para la siguiente fase: cuando el vendedor suba un archivo .glb real,
// este componente se reemplaza por algo tan simple como:
//   const { scene } = useGLTF(urlDelModelo);  return <primitive object={scene} />;
// El resto de la pantalla (visor, controles, comentarios) no cambia.

const ASIENTOS_X = [-0.98, 0, 0.98];

export function SofaModel({ color }: { color: string }) {
  return (
    <group>
      {/* Patas de latón */}
      {[
        [-1.25, 0.4],
        [1.25, 0.4],
        [-1.25, -0.4],
        [1.25, -0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]}>
          <cylinderGeometry args={[0.06, 0.05, 0.2, 16]} />
          <meshStandardMaterial color="#b08d57" metalness={0.85} roughness={0.35} />
        </mesh>
      ))}

      {/* Base / estructura del asiento */}
      <RoundedBox args={[3, 0.45, 1.15]} radius={0.07} smoothness={4} position={[0, 0.42, 0]}>
        <meshStandardMaterial color={color} roughness={0.85} />
      </RoundedBox>

      {/* Cojines del asiento */}
      {ASIENTOS_X.map((x) => (
        <RoundedBox
          key={`s-${x}`}
          args={[0.92, 0.26, 1.0]}
          radius={0.08}
          smoothness={4}
          position={[x, 0.78, 0.05]}
        >
          <meshStandardMaterial color={color} roughness={0.9} />
        </RoundedBox>
      ))}

      {/* Respaldo (estructura) */}
      <RoundedBox args={[3, 0.95, 0.26]} radius={0.07} smoothness={4} position={[0, 1.12, -0.45]}>
        <meshStandardMaterial color={color} roughness={0.85} />
      </RoundedBox>

      {/* Cojines del respaldo */}
      {ASIENTOS_X.map((x) => (
        <RoundedBox
          key={`b-${x}`}
          args={[0.9, 0.72, 0.2]}
          radius={0.08}
          smoothness={4}
          position={[x, 1.05, -0.33]}
        >
          <meshStandardMaterial color={color} roughness={0.9} />
        </RoundedBox>
      ))}

      {/* Brazos */}
      {[-1.45, 1.45].map((x) => (
        <RoundedBox
          key={`a-${x}`}
          args={[0.28, 0.72, 1.15]}
          radius={0.09}
          smoothness={4}
          position={[x, 0.92, 0]}
        >
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
      ))}
    </group>
  );
}
