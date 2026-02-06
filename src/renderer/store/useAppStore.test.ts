import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';
import type { Event } from '@shared/types';

function mockEvent(id: string, overrides?: Partial<Event>): Event {
  return {
    id,
    timestamp: Date.now(),
    type: 'earthquake',
    location: { lat: 0, lon: 0, name: 'Test Location' },
    severity: 3,
    title: `Event ${id}`,
    data: {},
    ...overrides,
  };
}

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      connectionStatus: 'connecting',
      serverStatus: null,
      events: [],
      featuredEvent: null,
      selectedEvent: null,
      isInitialized: false,
    });
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const state = useAppStore.getState();
      expect(state.connectionStatus).toBe('connecting');
      expect(state.events).toEqual([]);
      expect(state.featuredEvent).toBeNull();
      expect(state.selectedEvent).toBeNull();
      expect(state.isInitialized).toBe(false);
    });
  });

  describe('setConnectionStatus', () => {
    it('should update connection status', () => {
      useAppStore.getState().setConnectionStatus('connected');
      expect(useAppStore.getState().connectionStatus).toBe('connected');
    });

    it('should handle all status values', () => {
      const statuses = ['connecting', 'connected', 'disconnected', 'error'] as const;
      for (const status of statuses) {
        useAppStore.getState().setConnectionStatus(status);
        expect(useAppStore.getState().connectionStatus).toBe(status);
      }
    });
  });

  describe('setEvents', () => {
    it('should set events array', () => {
      const events = [mockEvent('1'), mockEvent('2')];
      useAppStore.getState().setEvents(events);
      expect(useAppStore.getState().events).toEqual(events);
    });

    it('should auto-select first event as featured if none set', () => {
      const events = [mockEvent('1'), mockEvent('2')];
      useAppStore.getState().setEvents(events);
      expect(useAppStore.getState().featuredEvent).toEqual(events[0]);
    });

    it('should not override existing featured event', () => {
      const featured = mockEvent('featured');
      useAppStore.setState({ featuredEvent: featured });
      useAppStore.getState().setEvents([mockEvent('1')]);
      expect(useAppStore.getState().featuredEvent?.id).toBe('featured');
    });

    it('should handle empty events array', () => {
      useAppStore.getState().setEvents([]);
      expect(useAppStore.getState().events).toEqual([]);
      expect(useAppStore.getState().featuredEvent).toBeNull();
    });
  });

  describe('addEvents', () => {
    it('should prepend new events to existing list', () => {
      useAppStore.getState().setEvents([mockEvent('old')]);
      useAppStore.getState().addEvents([mockEvent('new')]);
      const events = useAppStore.getState().events;
      expect(events[0].id).toBe('new');
      expect(events[1].id).toBe('old');
    });

    it('should cap events at 100', () => {
      const initial = Array.from({ length: 90 }, (_, i) => mockEvent(`init-${i}`));
      useAppStore.getState().setEvents(initial);
      const added = Array.from({ length: 20 }, (_, i) => mockEvent(`add-${i}`));
      useAppStore.getState().addEvents(added);
      expect(useAppStore.getState().events.length).toBe(100);
    });

    it('should update featured event for high severity (>=5)', () => {
      useAppStore.getState().setEvents([mockEvent('low', { severity: 2 })]);
      const highSeverity = mockEvent('high', { severity: 7 });
      useAppStore.getState().addEvents([highSeverity]);
      expect(useAppStore.getState().featuredEvent?.id).toBe('high');
    });

    it('should not update featured for low severity events', () => {
      const initial = mockEvent('initial');
      useAppStore.getState().setEvents([initial]);
      useAppStore.getState().addEvents([mockEvent('low', { severity: 2 })]);
      expect(useAppStore.getState().featuredEvent?.id).toBe('initial');
    });
  });

  describe('setFeaturedEvent', () => {
    it('should set featured event', () => {
      const event = mockEvent('featured');
      useAppStore.getState().setFeaturedEvent(event);
      expect(useAppStore.getState().featuredEvent).toEqual(event);
    });

    it('should allow clearing featured event', () => {
      useAppStore.getState().setFeaturedEvent(mockEvent('1'));
      useAppStore.getState().setFeaturedEvent(null);
      expect(useAppStore.getState().featuredEvent).toBeNull();
    });
  });

  describe('setInitialized', () => {
    it('should set initialized state', () => {
      useAppStore.getState().setInitialized(true);
      expect(useAppStore.getState().isInitialized).toBe(true);
    });
  });

  describe('setServerStatus', () => {
    it('should set server status', () => {
      const status = {
        ready: true,
        collectors: [{ name: 'test', enabled: true, running: true }],
      };
      useAppStore.getState().setServerStatus(status);
      expect(useAppStore.getState().serverStatus).toEqual(status);
    });
  });
});
