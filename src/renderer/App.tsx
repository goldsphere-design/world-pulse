import { useSocket } from './hooks/useSocket';
import { useAppStore } from './store/useAppStore';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';

function App() {
  // Initialize socket connection
  useSocket();

  const { isInitialized, connectionStatus } = useAppStore();

  // Show loading screen until we have initial data
  if (!isInitialized || connectionStatus !== 'connected') {
    return <LoadingScreen />;
  }

  return <Dashboard />;
}

export default App;
