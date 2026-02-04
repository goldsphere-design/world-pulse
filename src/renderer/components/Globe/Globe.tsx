import { useAppStore } from '../../store/useAppStore';

export function Globe() {
  const { events, featuredEvent, setFeaturedEvent } = useAppStore();

  // Get unique events with locations for pins
  const eventsWithLocations = events.filter((e) => e.location).slice(0, 10);

  // Simple projection to map lat/lon to x/y percentages on a flat map
  const projectToMap = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="bg-[#0f1419] border-2 border-green-400 p-4 flex flex-col items-center justify-center h-full">
      <div className="text-xs font-bold border-b border-green-400 pb-2 mb-3 uppercase text-green-400 w-full">
        GLOBE [GEOGRAPHIC VIEW]
      </div>

      {/* Globe visualization container */}
      <div className="relative w-80 h-80 flex-shrink-0">
        {/* Globe circle */}
        <div
          className="w-full h-full rounded-full border-3 border-green-400 relative overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #1a3a3a, #0a1a1a)',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-40">
            {[20, 40, 50, 60, 80].map((pos) => (
              <div
                key={`h-${pos}`}
                className="absolute w-full h-px bg-green-400"
                style={{ top: `${pos}%` }}
              />
            ))}
            {[20, 40, 50, 60, 80].map((pos) => (
              <div
                key={`v-${pos}`}
                className="absolute h-full w-px bg-green-400"
                style={{ left: `${pos}%` }}
              />
            ))}
          </div>

          {/* Simple continent outlines (stylized) */}
          <div className="absolute inset-0 opacity-20">
            {/* North America */}
            <div
              className="absolute border-2 border-green-400 bg-green-400/15"
              style={{
                top: '15%',
                left: '8%',
                width: '22%',
                height: '35%',
                clipPath:
                  'polygon(30% 0%, 60% 5%, 85% 15%, 95% 45%, 80% 70%, 55% 85%, 40% 95%, 20% 80%, 10% 60%, 5% 30%, 15% 10%)',
              }}
            />
            {/* Europe */}
            <div
              className="absolute border-2 border-green-400 bg-green-400/15"
              style={{
                top: '12%',
                left: '43%',
                width: '18%',
                height: '22%',
                clipPath:
                  'polygon(5% 40%, 20% 10%, 45% 0%, 75% 15%, 90% 35%, 100% 60%, 85% 85%, 60% 100%, 30% 90%, 10% 70%)',
              }}
            />
            {/* Asia */}
            <div
              className="absolute border-2 border-green-400 bg-green-400/15"
              style={{
                top: '8%',
                left: '55%',
                width: '38%',
                height: '50%',
                clipPath:
                  'polygon(5% 35%, 15% 15%, 30% 5%, 50% 0%, 70% 8%, 85% 20%, 95% 40%, 100% 65%, 90% 85%, 70% 95%, 45% 100%, 25% 90%, 10% 70%, 0% 50%)',
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
                className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all z-10 ${
                  isFeatured ? 'w-5 h-5 bg-yellow-400 animate-pulse' : 'bg-red-500'
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: isFeatured ? '0 0 20px #facc15, 0 0 40px #facc15' : '0 0 10px #ef4444',
                }}
                onClick={() => setFeaturedEvent(event)}
                title={event.title}
              />
            );
          })}

          {/* Center label */}
          {eventsWithLocations.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-green-400/50 text-sm">No events to display</span>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-green-400/70 flex gap-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-400 rounded-full" /> Featured
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full" /> Event
        </span>
      </div>
    </div>
  );
}
