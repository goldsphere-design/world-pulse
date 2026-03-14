export function OblvnDemo() {
  return (
    <div className="p-4 space-y-4">
      <div className="ob-panel p-4 ob-dot-grid ob-glow">
        <div className="ob-panel-inner">
          <div className="flex items-center justify-between">
            <div>
              <div className="ob-label">SYSTEM</div>
              <div className="ob-heading">Light Table</div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="ob-label">STATUS</div>
              <span className="ob-status-nominal ob-value">NOMINAL</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="ob-panel p-3">
              <div className="ob-label">Nodes</div>
              <div className="ob-value ob-value-highlight">128</div>
            </div>
            <div className="ob-panel p-3 ob-panel-active">
              <div className="ob-label">Throughput</div>
              <div className="ob-value ob-value-highlight">2.3k/s</div>
            </div>
            <div className="ob-panel p-3">
              <div className="ob-label">Alerts</div>
              <div className="ob-value ob-status-warning">3</div>
            </div>
          </div>

          <div className="mt-4 ob-scanline p-2">
            <div className="text-sm text-ob-text-dim">
              Marquee: 03/22 12:42 UTC · 3 new seismic events
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="ob-panel p-3 flex-1">
          <div className="ob-label">Micro</div>
          <div className="ob-value">0.003</div>
        </div>
        <div className="ob-panel p-3 flex-1 ob-glitch">
          <div className="ob-label">Latency</div>
          <div className="ob-value">46ms</div>
        </div>
      </div>
    </div>
  );
}

export default OblvnDemo;
