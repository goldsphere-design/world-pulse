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
    <div
      style={{
        background: '#0f1419',
        border: '2px solid #00ff88',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          borderBottom: '1px solid #00ff88',
          paddingBottom: '8px',
          marginBottom: '12px',
          textTransform: 'uppercase',
          color: '#00ff88',
        }}
      >
        GLOBE [GEOGRAPHIC VIEW]
      </div>

      {/* Globe visualization container - centered */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '350px',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '320px',
            height: '320px',
          }}
        >
          {/* Globe circle */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'relative',
              overflow: 'hidden',
              background: 'radial-gradient(circle at 30% 30%, #1a3a3a, #0a1a1a)',
              border: '3px solid #00ff88',
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Grid lines */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
              {[20, 40, 50, 60, 80].map((pos) => (
                <div
                  key={`h-${pos}`}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '1px',
                    background: '#00ff88',
                    top: `${pos}%`,
                  }}
                />
              ))}
              {[20, 40, 50, 60, 80].map((pos) => (
                <div
                  key={`v-${pos}`}
                  style={{
                    position: 'absolute',
                    height: '100%',
                    width: '1px',
                    background: '#00ff88',
                    left: `${pos}%`,
                  }}
                />
              ))}
            </div>

            {/* Continent outlines */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
              {/* North America */}
              <div
                style={{
                  position: 'absolute',
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
                style={{
                  position: 'absolute',
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
                style={{
                  position: 'absolute',
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
                style={{
                  position: 'absolute',
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
                style={{
                  position: 'absolute',
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
                style={{
                  position: 'absolute',
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
                  onClick={() => setFeaturedEvent(event)}
                  title={event.title}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isFeatured ? '16px' : '10px',
                    height: isFeatured ? '16px' : '10px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    background: isFeatured ? '#facc15' : '#ef4444',
                    boxShadow: isFeatured
                      ? '0 0 20px #facc15, 0 0 40px #facc15'
                      : '0 0 10px #ef4444',
                    zIndex: isFeatured ? 20 : 10,
                    animation: isFeatured ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  }}
                />
              );
            })}

            {/* Center label when no events */}
            {eventsWithLocations.length === 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'rgba(0, 255, 136, 0.5)', fontSize: '14px' }}>
                  No events to display
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: '16px',
          fontSize: '12px',
          color: 'rgba(0, 255, 136, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#facc15',
            }}
          />
          Featured
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444',
            }}
          />
          Event
        </span>
      </div>
    </div>
  );
}
