import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import type { Event } from '@shared/types';
import type { BaseCollector } from './collectors/base';

export function createApp(options?: { corsOrigin?: string }) {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: options?.corsOrigin || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  let eventCache: Event[] = [];
  const MAX_EVENTS = 100;
  let collectors: BaseCollector[] = [];

  // Middleware
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
    socket.emit('events:initial', {
      events: eventCache,
      timestamp: Date.now(),
    });

    socket.on('disconnect', () => {
      // Client disconnected
    });
  });

  return {
    app,
    httpServer,
    io,
    addEvents(events: Event[]) {
      eventCache = [...events, ...eventCache].slice(0, MAX_EVENTS);
    },
    getEventCache() {
      return eventCache;
    },
    setCollectors(c: BaseCollector[]) {
      collectors = c;
    },
  };
}
