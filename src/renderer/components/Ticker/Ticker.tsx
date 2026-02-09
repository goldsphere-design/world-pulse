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

export function Ticker() {
  const { events, serverStatus } = useAppStore();

  // Get the 10 most recent events for the ticker
  const tickerEvents = events.slice(0, 10);
  const activeCollectors = serverStatus?.collectors.filter((c) => c.running).length || 0;

  return (
    <div className="bg-ob-bg-panel border-t border-ob-border">
      {/* Scrolling ticker */}
      <div className="px-5 py-3 overflow-hidden border-b border-ob-border/50">
        <div className="flex animate-scroll whitespace-nowrap text-sm">
          {tickerEvents.length > 0 ? (
            <>
              {/* Double the items for seamless scrolling */}
              {[...tickerEvents, ...tickerEvents].map((event, index) => {
                const indicator = getEventIndicator(event.type, event.severity);
                return (
                  <Fragment key={`${event.id}-${index}`}>
                    <span className="px-6 flex items-center gap-2">
                      <span className={indicator.color}>{indicator.symbol}</span>
                      <span className="text-ob-text">{event.title}</span>
                    </span>
                    <span className="text-ob-border">|</span>
                  </Fragment>
                );
              })}
            </>
          ) : (
            <span className="ob-label text-ob-text-dim">AWAITING EVENTS...</span>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-ob-bg-primary px-5 py-2 text-xs flex items-center gap-6">
        {/* Sources */}
        <div className="flex items-center gap-2">
          <span className="ob-label text-ob-text-dim">SOURCES</span>
          <span className="ob-value text-ob-cyan">{activeCollectors}</span>
        </div>

        {/* Divider */}
        <div className="h-3 w-px bg-ob-border" />

        {/* Refresh interval */}
        <div className="flex items-center gap-2">
          <span className="ob-label text-ob-text-dim">INTERVAL</span>
          <span className="ob-value text-ob-text">5M</span>
        </div>

        {/* Divider */}
        <div className="h-3 w-px bg-ob-border" />

        {/* Event count */}
        <div className="flex items-center gap-2">
          <span className="ob-label text-ob-text-dim">EVENTS</span>
          <span className="ob-value text-ob-text">{events.length}</span>
          <span className="ob-label text-ob-text-dim">(24H)</span>
        </div>

        {/* Version - right aligned */}
        <div className="ml-auto flex items-center gap-2">
          <span className="ob-label text-ob-text-dim">SYS</span>
          <span className="text-ob-text-dim text-[10px]">WORLD PULSE v0.2.0</span>
        </div>
      </div>
    </div>
  );
}
