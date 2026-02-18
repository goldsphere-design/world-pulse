import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function Header() {
  const { featuredEvent, connectionStatus, events } = useAppStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      })
      .toUpperCase();
  };

  const getConnectionIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ob-success ob-glow" />
            <span className="ob-status-nominal ob-text-glow">LIVE</span>
          </span>
        );
      case 'connecting':
        return (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ob-amber animate-pulse" />
            <span className="ob-status-warning">SYNC</span>
          </span>
        );
      case 'disconnected':
        return (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ob-danger" />
            <span className="ob-status-critical">OFFLINE</span>
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ob-danger" />
            <span className="ob-status-critical">ERROR</span>
          </span>
        );
    }
  };

  return (
    <header className="relative bg-ob-bg-panel border-b border-ob-border px-5 py-3 ob-header-accent">
      <div className="flex items-center gap-6 text-sm">
        {/* Logo/Title */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-ob-cyan ob-glow" />
          <span className="ob-heading text-ob-cyan tracking-ultrawide text-sm">WORLD PULSE</span>
        </div>

        {/* Gradient divider */}
        <div className="ob-divider-vertical h-5" />

        {/* Connection Status */}
        <div className="ob-label flex items-center gap-2">
          <span className="text-ob-text-dim text-[10px]">STATUS</span>
          {getConnectionIndicator()}
        </div>

        {/* Gradient divider */}
        <div className="ob-divider-vertical h-5" />

        {/* Date & Time */}
        <div className="flex items-center gap-3">
          <div className="ob-label flex items-center gap-2">
            <span className="text-ob-text-dim text-[10px]">UTC</span>
            <span className="ob-readout-value text-sm tabular-nums">{formatTime(time)}</span>
          </div>
          <span className="text-ob-text-dim text-[10px]">{formatDate(time)}</span>
        </div>

        {/* Gradient divider */}
        <div className="ob-divider-vertical h-5" />

        {/* Featured Event / Monitoring Status */}
        <div className="flex-1 min-w-0">
          {featuredEvent ? (
            <div className="ob-featured-bar px-3 py-1.5 rounded-sm flex items-center gap-3">
              <span className="ob-label text-ob-amber text-[10px] shrink-0">ALERT</span>
              <span className="text-ob-amber text-xs truncate ob-transition-snap">
                {featuredEvent.title}
              </span>
              {featuredEvent.severity !== undefined && featuredEvent.severity > 0 && (
                <span className="ob-label text-ob-amber/70 text-[9px] shrink-0 ml-auto tabular-nums">
                  MAG {featuredEvent.severity.toFixed(1)}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-ob-success animate-pulse" />
              <span className="ob-label text-ob-text-dim text-[10px]">
                MONITORING {events.length > 0 ? `${events.length} EVENTS` : 'ACTIVE'}
              </span>
            </div>
          )}
        </div>

        {/* Event count badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="ob-label text-ob-text-dim text-[10px]">EVENTS</span>
          <span className="ob-readout-value text-sm tabular-nums">{events.length}</span>
        </div>
      </div>

      {/* Corner accent marks */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-ob-cyan/30" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-ob-cyan/30" />
    </header>
  );
}
