import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import type { Event } from '@shared/types';
import { EarthquakeCollector } from './collectors/earthquakes';

// Load environment variables
dotenv.config();

const ALLOWED_ORIGIN = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

// In-memory event store (most recent events)
let eventCache: Event[] = [];
const MAX_EVENTS = 100;

// Initialize collectors
const earthquakeCollector = new EarthquakeCollector();
const collectors = [earthquakeCollector];

// Start collectors and emit events via Socket.io
function startCollectors() {
  console.log('[Server] Starting data collectors...');

  earthquakeCollector.start((events) => {
    // Add new events to cache
    eventCache = [...events, ...eventCache].slice(0, MAX_EVENTS);

    // Emit to all connected clients
    io.emit('events:new', { events, timestamp: Date.now() });
    console.log(`[Server] Emitted ${events.length} earthquake events to clients`);
  });
}

// Middleware
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Status endpoint for frontend initialization
app.get('/api/status', (_req, res) => {
  const collectorStatuses = collectors.map((c) => c.getStatus());
  res.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    collectors: collectorStatuses,
    eventCount: eventCache.length,
  });
});

// Get all cached events
app.get('/api/events', (_req, res) => {
  res.json({
    events: eventCache,
    timestamp: new Date().toISOString(),
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Send current events to newly connected client
  socket.emit('events:initial', {
    events: eventCache,
    timestamp: Date.now(),
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Socket.io] WebSocket server ready`);

  // Start collectors after server is running
  startCollectors();
});

// Graceful shutdown handler
function shutdown(signal: string) {
  console.log(`\n[Server] ${signal} received, shutting down gracefully...`);

  // Stop all collectors
  collectors.forEach((c) => c.stop());

  // Close all socket connections
  io.close(() => {
    console.log('[Server] Socket.io connections closed');
  });

  httpServer.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });

  // Force exit after 5 seconds if graceful shutdown fails
  setTimeout(() => {
    console.log('[Server] Forcing exit...');
    process.exit(1);
  }, 5000);
}

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled rejection:', reason);
});
