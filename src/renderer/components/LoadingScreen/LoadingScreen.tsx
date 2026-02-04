import { useAppStore } from '../../store/useAppStore';

export function LoadingScreen() {
  const { connectionStatus, serverStatus } = useAppStore();

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting to server...';
      case 'connected':
        return serverStatus?.ready ? 'Loading data...' : 'Waiting for collectors...';
      case 'disconnected':
        return 'Disconnected. Reconnecting...';
      case 'error':
        return 'Connection error. Retrying...';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return '✓';
      case 'connecting':
        return '...';
      case 'disconnected':
      case 'error':
        return '✗';
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0a0e1a] text-green-400 flex items-center justify-center font-mono">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">WORLD PULSE</h1>
        <div className="text-xl opacity-70 mb-8">{getStatusMessage()}</div>

        {/* Loading animation */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Status indicators */}
        <div className="text-sm opacity-50 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span
              className={connectionStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'}
            >
              {getStatusIcon()}
            </span>
            <span>Backend: {connectionStatus}</span>
          </div>
          {serverStatus && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-400">✓</span>
              <span>
                Collectors: {serverStatus.collectors.filter((c) => c.running).length} active
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 text-xs opacity-30">Phase 1 - MVP Development</div>
      </div>
    </div>
  );
}
