import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from './app';

describe('Server API', () => {
  let app: ReturnType<typeof createApp>;

  afterEach(() => {
    app?.httpServer.close();
    app?.io.close();
  });

  function setup() {
    app = createApp({ corsOrigin: '*' });
    return app;
  }

  describe('GET /health', () => {
    it('should return 200 with ok status', async () => {
      const { app: expressApp } = setup();
      const res = await request(expressApp).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });

    it('should return valid ISO timestamp', async () => {
      const { app: expressApp } = setup();
      const res = await request(expressApp).get('/health');

      const date = new Date(res.body.timestamp);
      expect(date.getTime()).not.toBeNaN();
    });
  });

  describe('GET /api/status', () => {
    it('should return ready status', async () => {
      const { app: expressApp } = setup();
      const res = await request(expressApp).get('/api/status');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ready');
      expect(res.body.collectors).toBeDefined();
      expect(Array.isArray(res.body.collectors)).toBe(true);
      expect(res.body.eventCount).toBe(0);
    });

    it('should report event count', async () => {
      const { app: expressApp, addEvents } = setup();
      addEvents([
        {
          id: '1',
          timestamp: Date.now(),
          type: 'earthquake',
          location: null,
          title: 'Test',
          data: {},
        },
      ]);

      const res = await request(expressApp).get('/api/status');
      expect(res.body.eventCount).toBe(1);
    });
  });

  describe('GET /api/events', () => {
    it('should return empty events initially', async () => {
      const { app: expressApp } = setup();
      const res = await request(expressApp).get('/api/events');

      expect(res.status).toBe(200);
      expect(res.body.events).toEqual([]);
      expect(res.body.timestamp).toBeDefined();
    });

    it('should return added events', async () => {
      const { app: expressApp, addEvents } = setup();
      const event = {
        id: 'test-1',
        timestamp: Date.now(),
        type: 'earthquake' as const,
        location: { lat: 35.7, lon: 139.7, name: 'Tokyo' },
        severity: 5,
        title: 'M5.0 - Near Tokyo',
        data: { magnitude: 5.0 },
      };
      addEvents([event]);

      const res = await request(expressApp).get('/api/events');
      expect(res.body.events).toHaveLength(1);
      expect(res.body.events[0].id).toBe('test-1');
      expect(res.body.events[0].location.name).toBe('Tokyo');
    });

    it('should cap events at 100', async () => {
      const { app: expressApp, addEvents } = setup();
      const events = Array.from({ length: 120 }, (_, i) => ({
        id: `event-${i}`,
        timestamp: Date.now(),
        type: 'earthquake' as const,
        location: null,
        title: `Event ${i}`,
        data: {},
      }));
      addEvents(events);

      const res = await request(expressApp).get('/api/events');
      expect(res.body.events.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Unknown routes', () => {
    it('should return 404 for unknown paths', async () => {
      const { app: expressApp } = setup();
      const res = await request(expressApp).get('/unknown');
      expect(res.status).toBe(404);
    });
  });
});
