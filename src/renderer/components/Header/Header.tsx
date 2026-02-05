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
        return <span className="text-green-400">LIVE</span>;
      case 'connecting':
        return <span className="text-yellow-400">CONNECTING...</span>;
      case 'disconnected':
        return <span className="text-red-400">OFFLINE</span>;
      case 'error':
        return <span className="text-red-400">ERROR</span>;
    }
  };

  return (
    <header className="bg-[#0f1419] border-b-2 border-green-400 px-5 py-2.5 flex items-center gap-8 text-sm font-bold">
      <div className="text-green-400">WORLD PULSE</div>
      <div className="pl-4 border-l-2 border-green-400">{getConnectionIndicator()}</div>
      <div className="pl-4 border-l-2 border-green-400 text-green-400">{formatTime(time)} UTC</div>
      <div className="pl-4 border-l-2 border-green-400 flex-1 truncate">
        {featuredEvent ? (
          <span className="text-yellow-400">FEATURED: {featuredEvent.title}</span>
        ) : (
          <span className="text-green-400/40">Monitoring...</span>
        )}
      </div>
    </header>
  );
}
