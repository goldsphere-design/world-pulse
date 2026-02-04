import { Header } from '../Header/Header';
import { Globe } from '../Globe/Globe';
import { EventPanel } from '../EventPanel/EventPanel';
import { Ticker } from '../Ticker/Ticker';

export function Dashboard() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0e1a',
        color: '#00ff88',
        fontFamily: "'Courier New', Consolas, Monaco, monospace",
      }}
    >
      <Header />

      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '16px',
          padding: '16px',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <Globe />
        <EventPanel />
      </main>

      <Ticker />
    </div>
  );
}
