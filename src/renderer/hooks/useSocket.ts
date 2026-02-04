import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppStore } from '../store/useAppStore';
import type { Event } from '@shared/types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

interface EventsPayload {
  events: Event[];
  timestamp: number;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { setConnectionStatus, setServerStatus, setEvents, addEvents, setInitialized } =
    useAppStore();

  useEffect(() => {
    // Fetch initial server status
    const checkServerStatus = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/status`);
        if (response.ok) {
          const status = await response.json();
          setServerStatus({
            ready: status.status === 'ready',
            collectors: status.collectors || [],
          });
        }
      } catch (error) {
        console.error('[Socket] Failed to fetch server status:', error);
      }
    };

    // Initialize socket connection
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      setConnectionStatus('connected');
      checkServerStatus();
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
      setConnectionStatus('error');
    });

    // Handle initial events on connection
    socket.on('events:initial', (data: EventsPayload) => {
      console.log(`[Socket] Received ${data.events.length} initial events`);
      setEvents(data.events);
      setInitialized(true);
    });

    // Handle new events
    socket.on('events:new', (data: EventsPayload) => {
      console.log(`[Socket] Received ${data.events.length} new events`);
      addEvents(data.events);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [setConnectionStatus, setServerStatus, setEvents, addEvents, setInitialized]);

  return socketRef.current;
}
