import { useAppStore } from '../../store/useAppStore';
import type { Event } from '@shared/types';

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    earthquake: 'SEISMIC',
    weather: 'WEATHER',
    news: 'NEWS',
    astronomy: 'ASTRO',
    volcano: 'VOLCANO',
    iss: 'ISS',
    aurora: 'AURORA',
    asteroid: 'ASTEROID',
    planet: 'PLANET',
  };
  return labels[type] || type.toUpperCase();
}

function getEventTypeSymbol(type: string): string {
  const symbols: Record<string, string> = {
    earthquake: '\u25C6',
    weather: '\u25B2',
    news: '\u25A0',
    astronomy: '\u2605',
    volcano: '\u25B3',
    iss: '\u2302',
    aurora: '\u2248',
    asteroid: '\u2736',
    planet: '\u25CB',
  };
  return symbols[type] || '\u25CF';
}

function getSeverityClass(severity?: number): string {
  if (!severity) return '';
  if (severity >= 7) return 'ob-event-card-danger';
  if (severity >= 4) return 'ob-event-card-featured';
  return '';
}

function getSeverityTextClass(severity?: number): string {
  if (!severity) return 'text-ob-cyan';
  if (severity >= 7) return 'text-ob-danger';
  if (severity >= 4) return 'text-ob-amber';
  return 'text-ob-cyan';
}

interface EventItemProps {
  event: Event;
  isFeatured: boolean;
  onClick: () => void;
}

function EventItem({ event, isFeatured, onClick }: EventItemProps) {
  const severityClass = isFeatured ? 'ob-event-card-featured' : getSeverityClass(event.severity);
  const typeColor = getSeverityTextClass(event.severity);

  return (
    <div className={`ob-event-card ${severityClass} p-3 mb-2 cursor-pointer`} onClick={onClick}>
      {/* Top row: type badge + timestamp */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`${typeColor} text-[10px]`}>{getEventTypeSymbol(event.type)}</span>
          <span className={`ob-label ${typeColor} text-[10px]`}>
            {getEventTypeLabel(event.type)}
          </span>
          {isFeatured && (
            <span className="ob-label text-ob-amber px-1.5 py-0.5 border border-ob-amber/30 bg-ob-amber/5 text-[9px]">
              FEATURED
            </span>
          )}
        </div>
        <span className="ob-label text-ob-text-dim text-[10px] tabular-nums">
          {formatTimestamp(event.timestamp)}
        </span>
      </div>

      {/* Title */}
      <div className="text-ob-text text-xs font-medium mb-1">{event.title}</div>

      {/* Description (truncated) */}
      {event.description && (
        <div className="text-ob-text-dim text-[11px] mb-1.5 line-clamp-2">{event.description}</div>
      )}

      {/* Bottom row: location + severity gauge */}
      <div className="flex items-center justify-between gap-2 mt-1">
        {event.location && (
          <div className="text-ob-text-dim text-[10px] flex items-center gap-1 min-w-0">
            <span className="text-ob-cyan/50 shrink-0">LOC</span>
            <span className="truncate">
              {event.location.name ||
                `${event.location.lat.toFixed(1)}, ${event.location.lon.toFixed(1)}`}
            </span>
          </div>
        )}
        {event.severity !== undefined && event.severity > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-[3px] bg-ob-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${event.severity >= 7 ? 'bg-ob-danger' : event.severity >= 4 ? 'bg-ob-amber' : 'bg-ob-cyan'}`}
                style={{ width: `${Math.min(event.severity * 10, 100)}%` }}
              />
            </div>
            <span className="ob-label text-[9px] tabular-nums">{event.severity.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Featured event detail card at top of panel */
function FeaturedDetail({ event }: { event: Event }) {
  return (
    <div className="mb-3 p-3 bg-ob-amber/5 border border-ob-amber/20 relative">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ob-amber to-transparent opacity-50" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-ob-amber text-xs">{getEventTypeSymbol(event.type)}</span>
          <span className="ob-label text-ob-amber text-[10px]">FEATURED EVENT</span>
        </div>
        <span className="text-ob-text-dim text-[10px]">{formatTimeAgo(event.timestamp)}</span>
      </div>

      <div className="text-ob-text text-sm font-medium mb-1">{event.title}</div>

      {event.description && (
        <div className="text-ob-text-dim text-[11px] mb-2">{event.description}</div>
      )}

      <div className="flex items-center gap-4 text-[10px]">
        {event.location && (
          <div className="flex items-center gap-1 text-ob-text-dim">
            <span className="text-ob-cyan/50">LOC</span>
            <span>
              {event.location.name ||
                `${event.location.lat.toFixed(2)}, ${event.location.lon.toFixed(2)}`}
            </span>
          </div>
        )}
        {event.severity !== undefined && event.severity > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-ob-text-dim">MAG</span>
            <span
              className={`font-medium tabular-nums ${event.severity >= 7 ? 'text-ob-danger' : event.severity >= 4 ? 'text-ob-amber' : 'text-ob-cyan'}`}
            >
              {event.severity.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function EventPanel() {
  const { events, featuredEvent, setFeaturedEvent } = useAppStore();

  return (
    <div className="ob-panel p-4 flex flex-col h-full">
      <div className="ob-panel-inner flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3">
          <div className="ob-section-header flex-1">
            <span className="ob-heading text-sm text-ob-text tracking-wide">EVENTS</span>
            <span className="ob-label text-ob-cyan text-[10px]">[{events.length}]</span>
          </div>
          <div className="flex items-center gap-1.5 ml-3">
            <div className="w-1 h-1 rounded-full bg-ob-success animate-pulse" />
            <span className="ob-label text-[9px] text-ob-text-dim">LIVE</span>
          </div>
        </div>

        {/* Featured event detail */}
        {featuredEvent && <FeaturedDetail event={featuredEvent} />}

        {/* Event list */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <div className="w-8 h-8 border border-ob-border rounded-full flex items-center justify-center mb-2 animate-pulse">
                <div className="w-3 h-3 border-t border-r border-ob-cyan animate-spin" />
              </div>
              <span className="ob-label text-ob-text-dim">AWAITING DATA</span>
            </div>
          ) : (
            events
              .slice(0, 20)
              .map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  isFeatured={featuredEvent?.id === event.id}
                  onClick={() => setFeaturedEvent(event)}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
