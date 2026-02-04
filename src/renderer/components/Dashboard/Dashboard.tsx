import { Header } from '../Header/Header';
import { Globe } from '../Globe/Globe';
import { EventPanel } from '../EventPanel/EventPanel';
import { Ticker } from '../Ticker/Ticker';

export function Dashboard() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0e1a] text-green-400 font-mono">
      <Header />

      <main className="flex-1 grid grid-cols-[1.5fr_1fr] gap-4 p-4 min-h-0">
        <Globe />
        <EventPanel />
      </main>

      <Ticker />
    </div>
  );
}
