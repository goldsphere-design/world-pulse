import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { createEarthTexture, latLonToVector3 } from './earthTexture';
import type { Event } from '@shared/types';

const GLOBE_RADIUS = 1;

/** Atmosphere glow rendered on the backside of a slightly larger sphere */
function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 1.04, 64, 32]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0.04} side={THREE.BackSide} />
    </mesh>
  );
}

/** The main earth sphere with canvas texture */
function EarthSphere() {
  const texture = useMemo(() => createEarthTexture(), []);

  return (
    <>
      {/* Solid globe */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 32]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      {/* Faint wireframe overlay for depth */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.002, 24, 12]} />
        <meshBasicMaterial color="#00ff88" wireframe transparent opacity={0.04} />
      </mesh>
    </>
  );
}

/** A single event marker on the globe surface */
function EventMarker({
  event,
  isFeatured,
  onClick,
}: {
  event: Event;
  isFeatured: boolean;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const position = useMemo(() => {
    if (!event.location) return new THREE.Vector3(0, 0, 0);
    return latLonToVector3(event.location.lat, event.location.lon, GLOBE_RADIUS * 1.01);
  }, [event.location]);

  // Pulse animation for featured markers
  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (isFeatured) {
      const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.3;
      ref.current.scale.setScalar(scale);
    } else {
      ref.current.scale.setScalar(1);
    }
  });

  const color = isFeatured ? '#facc15' : '#ef4444';
  const size = isFeatured ? 0.025 : 0.015;

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

/** Glow ring around event markers for visibility */
function EventGlow({ event, isFeatured }: { event: Event; isFeatured: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const position = useMemo(() => {
    if (!event.location) return new THREE.Vector3(0, 0, 0);
    return latLonToVector3(event.location.lat, event.location.lon, GLOBE_RADIUS * 1.008);
  }, [event.location]);

  // LookAt center so the ring faces outward
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const mat = new THREE.Matrix4().lookAt(
      position,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0)
    );
    q.setFromRotationMatrix(mat);
    return q;
  }, [position]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (isFeatured) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.5;
      ref.current.scale.setScalar(scale);
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 - Math.sin(clock.elapsedTime * 2) * 0.2;
    }
  });

  const color = isFeatured ? '#facc15' : '#ef4444';

  return (
    <mesh ref={ref} position={position} quaternion={quaternion}>
      <ringGeometry args={[0.02, 0.04, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={isFeatured ? 0.4 : 0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Container that auto-rotates and holds the globe + markers */
function RotatingGlobe({ children, isPaused }: { children: React.ReactNode; isPaused: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current && !isPaused) {
      ref.current.rotation.y += delta * 0.08;
    }
  });

  return <group ref={ref}>{children}</group>;
}

/** All event markers as a group */
function EventMarkers() {
  const { events, featuredEvent, setFeaturedEvent } = useAppStore();

  const eventsWithLocations = useMemo(
    () => events.filter((e) => e.location).slice(0, 30),
    [events]
  );

  return (
    <group>
      {eventsWithLocations.map((event) => {
        const isFeatured = featuredEvent?.id === event.id;
        return (
          <group key={event.id}>
            <EventMarker
              event={event}
              isFeatured={isFeatured}
              onClick={() => setFeaturedEvent(event)}
            />
            <EventGlow event={event} isFeatured={isFeatured} />
          </group>
        );
      })}
    </group>
  );
}

/** Small background stars for ambiance */
function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const r = 8 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={600} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#00ff88" size={0.03} transparent opacity={0.4} />
    </points>
  );
}

/** Main Globe component */
export function Globe() {
  const [isInteracting, setIsInteracting] = useState(false);
  const { events } = useAppStore();
  const eventsWithLocations = events.filter((e) => e.location).length;

  const handlePointerDown = useCallback(() => setIsInteracting(true), []);
  const handlePointerUp = useCallback(() => {
    // Resume rotation after a brief delay
    setTimeout(() => setIsInteracting(false), 2000);
  }, []);

  return (
    <div className="bg-[#0f1419] border-2 border-green-400 p-4 flex flex-col h-full">
      <div className="text-xs font-bold border-b border-green-400 pb-2 mb-3 uppercase text-green-400 w-full">
        GLOBE [GEOGRAPHIC VIEW]
      </div>

      {/* 3D Globe Canvas */}
      <div
        className="flex-1 relative cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <Canvas
          camera={{ position: [0, 0.3, 2.4], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ antialias: true, alpha: true }}
        >
          <Stars />
          <RotatingGlobe isPaused={isInteracting}>
            <EarthSphere />
            <Atmosphere />
            <EventMarkers />
          </RotatingGlobe>
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={1.5}
            maxDistance={5}
            zoomSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Legend */}
      <div className="mt-2 text-xs text-green-400/70 flex gap-4 flex-shrink-0">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-400 rounded-full" /> Featured
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full" /> Event
        </span>
        <span className="ml-auto text-green-400/40">{eventsWithLocations} plotted</span>
      </div>
    </div>
  );
}
