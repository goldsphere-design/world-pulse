import { useAppStore } from '../../store/useAppStore';

export function Globe() {
  const { events, featuredEvent, setFeaturedEvent } = useAppStore();

  // Get unique events with locations for pins
  const eventsWithLocations = events.filter((e) => e.location).slice(0, 15);

  // Simple projection to map lat/lon to x/y percentages
  const projectToMap = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="bg-[#0f1419] border-2 border-green-400 p-4 flex flex-col min-h-0">
      <div className="text-xs font-bold border-b border-green-400 pb-2 mb-3 uppercase text-green-400">
        GLOBE [GEOGRAPHIC VIEW]
      </div>

      {/* Globe visualization container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative" style={{ width: '320px', height: '320px' }}>
          {/* Globe circle */}
          <div
            className="w-full h-full rounded-full relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #1a3a3a, #0a1a1a)',
              border: '3px solid #00ff88',
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-40">
              {[20, 40, 50, 60, 80].map((pos) => (
                <div
                  key={`h-${pos}`}
                  className="absolute w-full bg-green-400"
                  style={{ top: `${pos}%`, height: '1px' }}
                />
              ))}
              {[20, 40, 50, 60, 80].map((pos) => (
                <div
                  key={`v-${pos}`}
                  className="absolute h-full bg-green-400"
                  style={{ left: `${pos}%`, width: '1px' }}
                />
              ))}
            </div>

            {/* Simple continent outlines (stylized) */}
            <div className="absolute inset-0 opacity-30">
              {/* North America */}
              <div
                className="absolute"
                style={{
                  top: '15%',
                  left: '8%',
                  width: '22%',
                  height: '35%',
                  border: '2px solid #00ff88',
                  background: 'rgba(0, 255, 136, 0.15)',
                  clipPath:
                    'polygon(30% 0%, 60% 5%, 85% 15%, 95% 45%, 80% 70%, 55% 85%, 40% 95%, 20% 80%, 10% 60%, 5% 30%, 15% 10%)',
                }}
              />
              {/* South America */}
              <div
                className="absolute"
                style={{
                  top: '50%',
                  left: '20%',
                  width: '12%',
                  height: '30%',
                  border: '2px solid #00ff88',
                  background: 'rgba(0, 255, 136, 0.15)',
                  clipPath: 'polygon(40% 0%, 70% 10%, 80% 50%, 60% 100%, 20% 90%, 10% 40%)',
                }}
              />
              {/* Europe */}
              <div
                className="absolute"
                style={{
                  top: '12%',
                  left: '43%',
                  width: '18%',
                  height: '22%',
                  border: '2px solid #00ff88',
                  background: 'rgba(0, 255, 136, 0.15)',
                  clipPath:
                    'polygon(5% 40%, 20% 10%, 45% 0%, 75% 15%, 90% 35%, 100% 60%, 85% 85%, 60% 100%, 30% 90%, 10% 70%)',
                }}
              />
              {/* Africa */}
              <div
                className="absolute"
                style={{
                  top: '32%',
                  left: '42%',
                  width: '18%',
                  height: '35%',
                  border: '2px solid #00ff88',
                  background: 'rgba(0, 255, 136, 0.15)',
                  clipPath: 'polygon(30% 0%, 70% 5%, 85% 40%, 70% 100%, 30% 95%, 15% 50%)',
                }}
              />
              {/* Asia */}
              <div
                className="absolute"
                style={{
                  top: '10%',
                  left: '55%',
                  width: '35%',
                  height: '45%',
                  border: '2px solid #00ff88',
                  background: 'rgba(0, 255, 136, 0.15)',
                  clipPath:
                    'polygon(5% 35%, 15% 15%, 40% 5%, 70% 10%, 90% 30%, 95% 60%, 80% 90%, 40% 95%, 10% 70%)',
                }}
              />
              {/* Australia */}
              <div
                className="absolute"
                style={{
                  top: '60%',
                  left: '75%',
                  width: '15%',
                  height: '18%',
                  border: '2px solid #00ff88',
                  background: 'rgba(0, 255, 136, 0.15)',
                  clipPath: 'polygon(20% 10%, 80% 0%, 100% 50%, 70% 100%, 10% 80%, 0% 30%)',
                }}
              />
            </div>

            {/* Event pins */}
            {eventsWithLocations.map((event) => {
              if (!event.location) return null;
              const { x, y } = projectToMap(event.location.lat, event.location.lon);
              const isFeatured = featuredEvent?.id === event.id;

              return (
                <div
                  key={event.id}
                  className="absolute rounded-full cursor-pointer transition-all"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isFeatured ? '16px' : '10px',
                    height: isFeatured ? '16px' : '10px',
                    background: isFeatured ? '#facc15' : '#ef4444',
                    boxShadow: isFeatured
                      ? '0 0 20px #facc15, 0 0 40px #facc15'
                      : '0 0 10px #ef4444',
                    zIndex: isFeatured ? 20 : 10,
                    animation: isFeatured ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  }}
                  onClick={() => setFeaturedEvent(event)}
                  title={event.title}
                />
              );
            })}

            {/* Center label when no events */}
            {eventsWithLocations.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-green-400/50 text-sm">No events to display</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-green-400/70 flex justify-center gap-6">
        <span className="flex items-center gap-2">
          <span
            className="rounded-full"
            style={{ width: '10px', height: '10px', background: '#facc15' }}
          />
          Featured
        </span>
        <span className="flex items-center gap-2">
          <span
            className="rounded-full"
            style={{ width: '8px', height: '8px', background: '#ef4444' }}
          />
          Event
        </span>
      </div>
    </div>
  );
}
