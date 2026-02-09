import { useAppStore } from '../../store/useAppStore';
import type { Event } from '@shared/types';

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
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

function getSeverityColor(severity?: number): { border: string; bg: string; text: string } {
  if (!severity) return { border: 'border-l-ob-border', bg: '', text: 'text-ob-text-dim' };
  if (severity >= 7)
    return { border: 'border-l-ob-danger', bg: 'bg-ob-danger/5', text: 'text-ob-danger' };
  if (severity >= 4)
    return { border: 'border-l-ob-amber', bg: 'bg-ob-amber/5', text: 'text-ob-amber' };
  return { border: 'border-l-ob-cyan/40', bg: '', text: 'text-ob-cyan' };
}

interface EventItemProps {
  event: Event;
  isFeatured: boolean;
  onClick: () => void;
}

function EventItem({ event, isFeatured, onClick }: EventItemProps) {
  const severity = getSeverityColor(event.severity);

  return (
    <div
      className={`
        border-l-2 ${severity.border} ${severity.bg}
        p-3 mb-2 text-xs leading-relaxed
        bg-ob-bg-elevated/50 cursor-pointer
        ob-transition-snap hover:bg-ob-bg-elevated hover:translate-x-1
        ${isFeatured ? 'bg-ob-amber/10 border-l-ob-amber translate-x-1' : ''}
      `}
      onClick={onClick}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`ob-label ${severity.text}`}>{getEventTypeLabel(event.type)}</span>
          {isFeatured && (
            <span className="ob-label text-ob-amber px-1.5 py-0.5 border border-ob-amber/40 text-[9px]">
              FEATURED
            </span>
          )}
        </div>
        <span className="ob-label text-ob-text-dim tabular-nums">
          {formatTimestamp(event.timestamp)}
        </span>
      </div>

      {/* Title */}
      <div className="text-ob-text font-medium mb-1">{event.title}</div>

      {/* Description */}
      {event.description && (
        <div className="text-ob-text-dim text-[11px] mb-1">{event.description}</div>
      )}

      {/* Location */}
      {event.location && (
        <div className="text-ob-text-dim text-[10px] flex items-center gap-1">
          <span className="text-ob-cyan/60">LOC</span>
          <span>
            {event.location.name ||
              `${event.location.lat.toFixed(2)}, ${event.location.lon.toFixed(2)}`}
          </span>
        </div>
      )}

      {/* Severity indicator */}
      {event.severity !== undefined && event.severity > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-ob-border rounded-full overflow-hidden">
            <div
              className={`h-full ${event.severity >= 7 ? 'bg-ob-danger' : event.severity >= 4 ? 'bg-ob-amber' : 'bg-ob-cyan'}`}
              style={{ width: `${Math.min(event.severity * 10, 100)}%` }}
            />
          </div>
          <span className="ob-label text-[9px]">MAG {event.severity.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}

export function EventPanel() {
  const { events, featuredEvent, setFeaturedEvent } = useAppStore();

  return (
    <div className="ob-panel p-4 flex flex-col h-full">
      <div className="ob-panel-inner flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ob-border pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="ob-heading text-sm text-ob-text tracking-wide">EVENTS</span>
            <span className="ob-label text-ob-cyan">[{events.length}]</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-ob-success animate-pulse" />
            <span className="ob-label text-[9px] text-ob-text-dim">LIVE</span>
          </div>
        </div>

        {/* Event list */}
        <div className="flex-1 overflow-y-auto pr-1">
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
