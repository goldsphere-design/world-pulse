import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface BootLine {
  text: string;
  status: 'ok' | 'pending' | 'error';
  delay: number;
}

export function LoadingScreen() {
  const { connectionStatus, serverStatus } = useAppStore();
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const bootLines: BootLine[] = [
    { text: 'WORLD PULSE SYSTEM v0.2.0', status: 'ok', delay: 200 },
    { text: 'Initializing subsystems', status: 'ok', delay: 400 },
    {
      text: `Backend connection: ${connectionStatus}`,
      status: connectionStatus === 'connected' ? 'ok' : 'pending',
      delay: 600,
    },
    {
      text: `Data collectors: ${serverStatus ? serverStatus.collectors.filter((c) => c.running).length + ' active' : 'awaiting'}`,
      status: serverStatus?.collectors.some((c) => c.running) ? 'ok' : 'pending',
      delay: 800,
    },
    { text: 'Loading globe renderer', status: 'pending', delay: 1000 },
    { text: 'Establishing data stream', status: 'pending', delay: 1200 },
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    bootLines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), bootLines[i].delay));
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, serverStatus]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  const getStatusIndicator = (status: BootLine['status']) => {
    switch (status) {
      case 'ok':
        return <span className="text-ob-success">OK</span>;
      case 'pending':
        return <span className="text-ob-amber animate-pulse">...</span>;
      case 'error':
        return <span className="text-ob-danger">ERR</span>;
    }
  };

  return (
    <div className="w-screen h-screen bg-ob-bg-primary flex items-center justify-center font-mono ob-dot-grid">
      <div className="w-full max-w-lg px-8">
        {/* Title with glow */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-ultrawide text-ob-cyan ob-readout-value">
            WORLD PULSE
          </h1>
          <div className="ob-divider mt-4" />
          <div className="mt-3 text-xs tracking-wide text-ob-text-dim uppercase">
            Global Event Monitoring System
          </div>
        </div>

        {/* Boot sequence terminal */}
        <div className="ob-panel p-5">
          <div className="ob-panel-inner">
            <div className="text-xs space-y-2">
              {bootLines.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 ob-boot-line"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-ob-cyan/60">&gt;</span>
                    <span className="text-ob-text">{line.text}</span>
                  </div>
                  <span className="ob-label text-[10px]">[{getStatusIndicator(line.status)}]</span>
                </div>
              ))}
              {visibleLines < bootLines.length && (
                <div className="flex items-center gap-1 text-ob-cyan/40">
                  <span>&gt;</span>
                  {showCursor && <span className="ob-terminal-cursor" />}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="ob-progress-track">
                <div
                  className="ob-progress-fill"
                  style={{ width: `${(visibleLines / bootLines.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status footer */}
        <div className="mt-6 flex items-center justify-between text-[10px]">
          <span className="ob-label text-ob-text-dim">BOOT SEQUENCE</span>
          <span className="ob-label text-ob-text-dim tabular-nums">
            {visibleLines}/{bootLines.length} SUBSYSTEMS
          </span>
        </div>
      </div>
    </div>
  );
}
