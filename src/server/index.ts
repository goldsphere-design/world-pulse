import dotenv from 'dotenv';
import { createApp } from './app';
import { EarthquakeCollector } from './collectors/earthquakes';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const { httpServer, io, addEvents, setCollectors } = createApp({
  corsOrigin: process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173',
});

// Initialize collectors
const earthquakeCollector = new EarthquakeCollector();
const collectors = [earthquakeCollector];
setCollectors(collectors);

// Start collectors and emit events via Socket.io
function startCollectors() {
  console.log('[Server] Starting data collectors...');

  earthquakeCollector.start((events) => {
    addEvents(events);
    io.emit('events:new', { events, timestamp: Date.now() });
    console.log(`[Server] Emitted ${events.length} earthquake events to clients`);
  });
}

// Start server
httpServer.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Socket.io] WebSocket server ready`);

  // Start collectors after server is running
  startCollectors();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully');

  // Stop all collectors
  collectors.forEach((c) => c.stop());

  httpServer.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled rejection:', reason);
});
