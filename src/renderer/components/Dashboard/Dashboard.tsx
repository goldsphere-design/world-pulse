import { useState, useEffect } from 'react';
import { Header } from '../Header/Header';
import { Globe } from '../Globe/Globe';
import { EventPanel } from '../EventPanel/EventPanel';
import { Ticker } from '../Ticker/Ticker';

export function Dashboard() {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    // Trigger boot sequence after mount
    const timer = setTimeout(() => setIsBooted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-ob-bg-primary text-ob-text font-mono ob-dot-grid ob-scanline ob-noise ob-vignette">
      {/* Header */}
      <div className={isBooted ? 'ob-boot-fade-in ob-boot-delay-1' : 'opacity-0'}>
        <Header />
      </div>

      {/* Main content area */}
      <main className="flex-1 min-h-0 grid grid-cols-[1.6fr_1fr] gap-3 p-3 overflow-hidden">
        <div className={`min-h-0 ${isBooted ? 'ob-boot-fade-in ob-boot-delay-2' : 'opacity-0'}`}>
          <Globe />
        </div>
        <div className={`min-h-0 ${isBooted ? 'ob-boot-fade-in ob-boot-delay-3' : 'opacity-0'}`}>
          <EventPanel />
        </div>
      </main>

      {/* Ticker */}
      <div className={isBooted ? 'ob-boot-fade-in ob-boot-delay-4' : 'opacity-0'}>
        <Ticker />
      </div>
    </div>
  );
}
