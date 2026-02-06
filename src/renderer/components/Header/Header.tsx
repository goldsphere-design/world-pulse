import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function Header() {
  const { featuredEvent, connectionStatus } = useAppStore();
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

  const getConnectionIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return <span className="ob-status-nominal ob-text-glow">LIVE</span>;
      case 'connecting':
        return <span className="ob-status-warning">CONNECTING</span>;
      case 'disconnected':
        return <span className="ob-status-critical">OFFLINE</span>;
      case 'error':
        return <span className="ob-status-critical">ERROR</span>;
    }
  };

  return (
    <header className="bg-ob-bg-panel border-b border-ob-border px-5 py-3 flex items-center gap-8 text-sm">
      {/* Logo/Title */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-ob-cyan ob-glow" />
        <span className="ob-heading text-ob-cyan tracking-ultrawide">WORLD PULSE</span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-ob-border" />

      {/* Connection Status */}
      <div className="ob-label flex items-center gap-2">
        <span className="text-ob-text-dim">STATUS</span>
        <span className="font-medium">{getConnectionIndicator()}</span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-ob-border" />

      {/* Time */}
      <div className="ob-label flex items-center gap-2">
        <span className="text-ob-text-dim">UTC</span>
        <span className="ob-value text-ob-text tabular-nums">{formatTime(time)}</span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-ob-border" />

      {/* Featured Event / Monitoring */}
      <div className="flex-1 truncate">
        {featuredEvent ? (
          <div className="flex items-center gap-2">
            <span className="ob-label text-ob-amber">ALERT</span>
            <span className="text-ob-amber ob-transition-snap">{featuredEvent.title}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ob-success animate-pulse" />
            <span className="ob-label text-ob-text-dim">MONITORING ACTIVE</span>
          </div>
        )}
      </div>

      {/* Corner accent lines */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-ob-cyan opacity-40" />
    </header>
  );
}
