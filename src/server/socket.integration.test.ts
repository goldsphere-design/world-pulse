import { describe, it, expect, afterEach } from 'vitest';
import { io as Client, Socket } from 'socket.io-client';
import { createApp } from './app';

interface EventPayload {
  events: Array<{
    id: string;
    timestamp: number;
    type: string;
    location: null | Record<string, unknown>;
    title: string;
    data: Record<string, unknown>;
  }>;
  timestamp: number;
}

describe('Socket.io integration', () => {
  let app: ReturnType<typeof createApp>;
  let clientSocket: Socket | null = null;

  afterEach(() => {
    try {
      clientSocket?.disconnect();
    } catch (_e) {
      // Ignore cleanup errors
    }
    app?.httpServer.close();
    app?.io.close();
  });

  it('emits events:initial on connect and events:new when server adds events', async () => {
    app = createApp({ corsOrigin: '*' });

    // Start HTTP server on ephemeral port
    await new Promise<void>((resolve) => {
      app.httpServer.listen(0, () => resolve());
    });

    // Determine address
    // @ts-expect-error: address() can return string; we handle that in ternary
    const addr = app.httpServer.address() as { port: number } | null;
    const port = typeof addr === 'object' && addr ? addr.port : 0;
    const url = `http://127.0.0.1:${port}`;

    // Connect client
    clientSocket = Client(url, { transports: ['websocket'] });

    const initial = await new Promise<EventPayload>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('no initial event')), 2000);
      clientSocket?.once('events:initial', (payload: EventPayload) => {
        clearTimeout(timeout);
        resolve(payload);
      });
    });

    expect(initial).toBeDefined();
    expect(Array.isArray(initial.events)).toBe(true);

    // Now add events on server and expect events:new
    const newEvent = {
      id: 'socket-test-1',
      timestamp: Date.now(),
      type: 'earthquake' as const,
      location: null,
      title: 'Socket Test',
      data: {},
    };

    const newPayload = await new Promise<EventPayload>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('no events:new')), 2000);
      clientSocket?.once('events:new', (payload: EventPayload) => {
        clearTimeout(timeout);
        resolve(payload);
      });
      // Trigger server-side add
      app.addEvents([newEvent]);
    });

    expect(newPayload).toBeDefined();
    expect(Array.isArray(newPayload.events)).toBe(true);
    expect(newPayload.events[0].id).toBe('socket-test-1');
  });
});
