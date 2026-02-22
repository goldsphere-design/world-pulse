import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAppStore } from '../../store/useAppStore';
import { StarField } from './StarField';
import { CelestialObjects } from './CelestialObjects';
import { HorizonRing } from './HorizonRing';

interface SkyMapProps {
  observerLat?: number; // Default: 40°N (mid-latitude)
  observerLon?: number; // Default: 0° (prime meridian)
}

/**
 * Sky Map component showing celestial objects (planets, asteroids, stars)
 * against a time-aware night sky. Complements the geographic Globe view.
 */
export function SkyMap({ observerLat = 40, observerLon: _observerLon = 0 }: SkyMapProps) {
  const { events } = useAppStore();

  // Filter celestial events (planets and asteroids)
  const celestialEvents = useMemo(
    () => events.filter((e) => e.type === 'planet' || e.type === 'asteroid'),
    [events]
  );

  return (
    <div className="ob-panel p-4 flex flex-col h-full">
      <div className="ob-panel-inner flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ob-border pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="ob-heading text-sm text-ob-text tracking-wide">SKY MAP</span>
            <span className="ob-label text-ob-cyan">[CELESTIAL]</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-ob-amber animate-pulse" />
            <span className="ob-label text-[9px] text-ob-text-dim">3D VIEW</span>
          </div>
        </div>

        {/* 3D Sky Canvas */}
        <div className="flex-1 min-h-0 relative">
          <Canvas
            camera={{ position: [0, 0, 0], fov: 75 }}
            style={{ background: 'transparent' }}
            gl={{ antialias: true, alpha: true }}
          >
            <StarField />
            <CelestialObjects events={celestialEvents} />
            <HorizonRing observerLat={observerLat} />
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              minDistance={0.1}
              maxDistance={10}
              zoomSpeed={0.5}
            />
          </Canvas>
        </div>

        {/* Legend */}
        <div className="mt-3 pt-3 border-t border-ob-border flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-ob-amber" />
            <span className="ob-label text-ob-text-dim">PLANETS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-ob-cyan" />
            <span className="ob-label text-ob-text-dim">ASTEROIDS</span>
          </div>
          <span className="ml-auto ob-label text-ob-text-dim tabular-nums">
            {celestialEvents.length} OBJECTS
          </span>
        </div>
      </div>
    </div>
  );
}
