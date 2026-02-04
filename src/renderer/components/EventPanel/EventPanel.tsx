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
    astronomy: 'ASTRONOMY',
  };
  return labels[type] || type.toUpperCase();
}

function getSeverityClass(severity?: number): string {
  if (!severity) return '';
  if (severity >= 7) return 'border-l-red-500 bg-red-500/5';
  if (severity >= 4) return 'border-l-yellow-400 bg-yellow-400/5';
  return '';
}

interface EventItemProps {
  event: Event;
  isFeatured: boolean;
  onClick: () => void;
}

function EventItem({ event, isFeatured, onClick }: EventItemProps) {
  const severityClass = getSeverityClass(event.severity);
  const featuredClass = isFeatured ? 'bg-yellow-400/15 border-l-yellow-400 translate-x-1' : '';

  return (
    <div
      className={`border-l-3 border-l-green-400 p-2 mb-2.5 text-xs leading-relaxed bg-green-400/5 cursor-pointer transition-all hover:translate-x-1 ${severityClass} ${featuredClass}`}
      onClick={onClick}
    >
      <div className="text-green-400 font-bold">
        {'>>'} {getEventTypeLabel(event.type)}
        {isFeatured && ' [FEATURED]'}
      </div>
      <div className="text-gray-400">{event.title}</div>
      <div className="text-gray-400">{formatTimestamp(event.timestamp)}</div>
      {event.description && <div className="text-gray-400">{event.description}</div>}
      {event.location && (
        <div className="text-gray-400">
          {event.location.name ||
            `${event.location.lat.toFixed(1)}, ${event.location.lon.toFixed(1)}`}
        </div>
      )}
    </div>
  );
}

export function EventPanel() {
  const { events, featuredEvent, setFeaturedEvent } = useAppStore();

  return (
    <div className="bg-[#0f1419] border-2 border-green-400 p-4 flex flex-col h-full">
      <div className="text-xs font-bold border-b border-green-400 pb-2 mb-3 uppercase text-green-400">
        EVENTS [{events.length}]
      </div>
      <div className="flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-gray-500 text-sm">Waiting for events...</div>
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
  );
}
