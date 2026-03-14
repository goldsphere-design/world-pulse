import * as THREE from 'three';

const HORIZON_COLOR = '#00D4FF'; // Cyan (Oblivion primary)
const HORIZON_RADIUS_INNER = 40;
const HORIZON_RADIUS_OUTER = 42;

interface HorizonRingProps {
  observerLat?: number; // Observer latitude in degrees
}

/**
 * Ring marking the horizon (altitude = 0°) in the sky map.
 * Rotated based on observer latitude for correct orientation.
 */
export function HorizonRing({ observerLat = 40 }: HorizonRingProps) {
  // Tilt the ring based on observer latitude
  // At equator (0°), ring is vertical (π/2)
  // At poles (±90°), ring is horizontal (0 or π)
  const tiltAngle = Math.PI / 2 - (observerLat * Math.PI) / 180;

  return (
    <mesh rotation={[tiltAngle, 0, 0]}>
      <ringGeometry args={[HORIZON_RADIUS_INNER, HORIZON_RADIUS_OUTER, 64]} />
      <meshBasicMaterial color={HORIZON_COLOR} transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}
