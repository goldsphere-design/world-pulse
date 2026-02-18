import { Fragment } from 'react';
import { useAppStore } from '../../store/useAppStore';

function getEventIndicator(type: string, severity?: number): { color: string; symbol: string } {
  // Color based on severity
  let color = 'text-ob-cyan';
  if (severity !== undefined) {
    if (severity >= 7) color = 'text-ob-danger';
    else if (severity >= 4) color = 'text-ob-amber';
  }

  // Symbol based on type
  const symbols: Record<string, string> = {
    earthquake: '\u25C6', // diamond
    weather: '\u25B2', // triangle
    news: '\u25A0', // square
    astronomy: '\u2605', // star
    volcano: '\u25B3', // triangle up (hollow)
    iss: '\u2302', // house/station
    aurora: '\u2248', // wavy lines
    asteroid: '\u2736', // six-pointed star
    planet: '\u25CB', // circle (hollow)
  };

  return { color, symbol: symbols[type] || '\u25CF' }; // default: circle
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'NOW';
  if (minutes < 60) return `${minutes}M`;
  return `${Math.floor(minutes / 60)}H`;
}

export function Ticker() {
  const { events, serverStatus, connectionStatus } = useAppStore();

  // Get the 10 most recent events for the ticker
  const tickerEvents = events.slice(0, 10);
  const activeCollectors = serverStatus?.collectors.filter((c) => c.running).length || 0;
  const totalCollectors = serverStatus?.collectors.length || 0;

  return (
    <div className="bg-ob-bg-panel border-t border-ob-border">
      {/* Scrolling ticker */}
      <div className="px-5 py-2.5 overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-ob-bg-panel to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-ob-bg-panel to-transparent z-10" />

        <div className="flex animate-scroll whitespace-nowrap text-xs">
          {tickerEvents.length > 0 ? (
            <>
              {/* Double the items for seamless scrolling */}
              {[...tickerEvents, ...tickerEvents].map((event, index) => {
                const indicator = getEventIndicator(event.type, event.severity);
                return (
                  <Fragment key={`${event.id}-${index}`}>
                    <span className="px-5 flex items-center gap-2">
                      <span className={`${indicator.color} text-[10px]`}>{indicator.symbol}</span>
                      <span className="text-ob-text">{event.title}</span>
                      <span className="text-ob-text-dim text-[10px] tabular-nums">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </span>
                    <span className="text-ob-cyan/20 px-1">{'\u00B7'}</span>
                  </Fragment>
                );
              })}
            </>
          ) : (
            <span className="ob-label text-ob-text-dim">AWAITING EVENTS...</span>
          )}
        </div>
      </div>

      {/* Status bar with gradient top border */}
      <div className="relative">
        <div className="ob-divider" />
        <div className="bg-ob-bg-primary/80 px-5 py-2 text-[10px] flex items-center gap-5">
          {/* Connection */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-1 h-1 rounded-full ${connectionStatus === 'connected' ? 'bg-ob-success' : 'bg-ob-amber'}`}
            />
            <span className="ob-label text-ob-text-dim">SYS</span>
            <span
              className={connectionStatus === 'connected' ? 'text-ob-success' : 'text-ob-amber'}
            >
              {connectionStatus === 'connected' ? 'NOMINAL' : connectionStatus.toUpperCase()}
            </span>
          </div>

          {/* Subtle divider */}
          <div className="w-px h-3 bg-ob-border" />

          {/* Sources */}
          <div className="flex items-center gap-1.5">
            <span className="ob-label text-ob-text-dim">SOURCES</span>
            <span className="text-ob-cyan tabular-nums">
              {activeCollectors}/{totalCollectors}
            </span>
          </div>

          {/* Subtle divider */}
          <div className="w-px h-3 bg-ob-border" />

          {/* Refresh interval */}
          <div className="flex items-center gap-1.5">
            <span className="ob-label text-ob-text-dim">INTERVAL</span>
            <span className="text-ob-text tabular-nums">5M</span>
          </div>

          {/* Subtle divider */}
          <div className="w-px h-3 bg-ob-border" />

          {/* Event count */}
          <div className="flex items-center gap-1.5">
            <span className="ob-label text-ob-text-dim">EVENTS</span>
            <span className="text-ob-text tabular-nums">{events.length}</span>
          </div>

          {/* Version - right aligned */}
          <div className="ml-auto flex items-center gap-3">
            <div className="w-px h-3 bg-ob-border" />
            <span className="text-ob-text-dim">WORLD PULSE v0.2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
