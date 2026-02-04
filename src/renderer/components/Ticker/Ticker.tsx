import { Fragment } from 'react';
import { useAppStore } from '../../store/useAppStore';

function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    earthquake: '🔴',
    weather: '⛈️',
    news: '📰',
    astronomy: '🔭',
  };
  return icons[type] || '📌';
}

export function Ticker() {
  const { events, serverStatus } = useAppStore();

  // Get the 10 most recent events for the ticker
  const tickerEvents = events.slice(0, 10);

  const activeCollectors = serverStatus?.collectors.filter((c) => c.running).length || 0;

  return (
    <div className="bg-[#0f1419] border-t-2 border-green-400">
      {/* Scrolling ticker */}
      <div className="px-5 py-3 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap text-sm">
          {tickerEvents.length > 0 ? (
            <>
              {/* Double the items for seamless scrolling */}
              {[...tickerEvents, ...tickerEvents].map((event, index) => (
                <Fragment key={`${event.id}-${index}`}>
                  <span className="px-10">
                    {getEventIcon(event.type)} {event.title}
                  </span>
                  <span className="px-2 text-green-400/50">•</span>
                </Fragment>
              ))}
            </>
          ) : (
            <span className="text-gray-500">Waiting for events...</span>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-[#0a0e1a] border-t border-green-400 px-5 py-2 text-xs flex gap-8">
        <span className="text-green-400">{activeCollectors} SOURCES ACTIVE</span>
        <span className="text-green-400">REFRESH: 5min</span>
        <span className="text-green-400">{events.length} EVENTS (24h)</span>
        <span className="ml-auto text-green-400/60">WORLD PULSE v0.1.0</span>
      </div>
    </div>
  );
}
