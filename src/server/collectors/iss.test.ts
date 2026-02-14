import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ISSCollector } from './iss';
import axios from 'axios';

vi.mock('axios');
const mockedGet = vi.mocked(axios.get);

function createWhereTheISSResponse(overrides: Partial<WhereTheISSData> = {}) {
  const defaults: WhereTheISSData = {
    name: 'iss',
    id: 25544,
    latitude: 41.5,
    longitude: -73.2,
    altitude: 420.5,
    velocity: 27580.3,
    visibility: 'daylight',
    footprint: 4500,
    timestamp: 1700000000,
    daynum: 2460000,
    solar_lat: 10.5,
    solar_lon: 45.2,
    units: 'kilometers',
  };
  return { data: { ...defaults, ...overrides } };
}

function createOpenNotifyResponse(
  overrides: Partial<{ latitude: string; longitude: string; timestamp: number; message: string }>
) {
  return {
    data: {
      message: overrides.message ?? 'success',
      timestamp: overrides.timestamp ?? 1700000000,
      iss_position: {
        latitude: overrides.latitude ?? '41.5',
        longitude: overrides.longitude ?? '-73.2',
      },
    },
  };
}

interface WhereTheISSData {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  footprint: number;
  timestamp: number;
  daynum: number;
  solar_lat: number;
  solar_lon: number;
  units: string;
}

describe('ISSCollector', () => {
  let collector: ISSCollector;

  beforeEach(() => {
    collector = new ISSCollector();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should have correct name and type', () => {
      expect(collector.name).toBe('ISS Tracker');
      expect(collector.type).toBe('iss');
    });

    it('should be enabled by default', () => {
      expect(collector.enabled).toBe(true);
    });

    it('should have 10 second interval', () => {
      expect(collector.interval).toBe(10 * 1000);
    });
  });

  describe('validate (OpenNotify)', () => {
    it('should accept valid OpenNotify response', () => {
      const valid = {
        message: 'success',
        iss_position: { latitude: '41.5', longitude: '-73.2' },
      };
      expect(collector.validate(valid)).toBe(true);
    });

    it('should reject null', () => {
      expect(collector.validate(null)).toBe(false);
    });

    it('should reject undefined', () => {
      expect(collector.validate(undefined)).toBe(false);
    });

    it('should reject non-object', () => {
      expect(collector.validate('string')).toBe(false);
      expect(collector.validate(42)).toBe(false);
    });

    it('should reject response with non-success message', () => {
      const invalid = {
        message: 'error',
        iss_position: { latitude: '41.5', longitude: '-73.2' },
      };
      expect(collector.validate(invalid)).toBe(false);
    });

    it('should reject response without iss_position', () => {
      const invalid = { message: 'success' };
      expect(collector.validate(invalid)).toBe(false);
    });

    it('should reject response with missing latitude', () => {
      const invalid = {
        message: 'success',
        iss_position: { longitude: '-73.2' },
      };
      expect(collector.validate(invalid)).toBe(false);
    });

    it('should reject response with missing longitude', () => {
      const invalid = {
        message: 'success',
        iss_position: { latitude: '41.5' },
      };
      expect(collector.validate(invalid)).toBe(false);
    });
  });

  describe('fetch', () => {
    it('should use WhereTheISS API as primary source', async () => {
      mockedGet.mockResolvedValueOnce(createWhereTheISSResponse());

      const events = await collector.fetch();

      expect(mockedGet).toHaveBeenCalledTimes(1);
      expect(mockedGet).toHaveBeenCalledWith('https://api.wheretheiss.at/v1/satellites/25544', {
        timeout: 5000,
      });
      expect(events).toHaveLength(1);
    });

    it('should transform WhereTheISS data correctly', async () => {
      mockedGet.mockResolvedValueOnce(
        createWhereTheISSResponse({
          latitude: 51.5,
          longitude: -0.1,
          altitude: 415.7,
          velocity: 27590.4,
          visibility: 'eclipsed',
          timestamp: 1700000000,
        })
      );

      const events = await collector.fetch();

      expect(events).toHaveLength(1);
      const event = events[0];
      expect(event.id).toBe('iss-position');
      expect(event.type).toBe('iss');
      expect(event.timestamp).toBe(1700000000 * 1000);
      expect(event.location).toEqual({
        lat: 51.5,
        lon: -0.1,
        name: 'International Space Station',
      });
      expect(event.severity).toBe(0);
      expect(event.title).toBe('ISS - International Space Station');
      expect(event.description).toContain('416');
      expect(event.description).toContain('27590');
      expect(event.data.altitude).toBe(415.7);
      expect(event.data.velocity).toBe(27590.4);
      expect(event.data.visibility).toBe('eclipsed');
    });

    it('should fall back to OpenNotify when WhereTheISS fails', async () => {
      mockedGet
        .mockRejectedValueOnce(new Error('Service unavailable'))
        .mockResolvedValueOnce(createOpenNotifyResponse({}));

      const events = await collector.fetch();

      expect(mockedGet).toHaveBeenCalledTimes(2);
      expect(mockedGet).toHaveBeenNthCalledWith(2, 'http://api.open-notify.org/iss-now.json', {
        timeout: 5000,
      });
      expect(events).toHaveLength(1);
    });

    it('should transform OpenNotify data correctly', async () => {
      mockedGet.mockRejectedValueOnce(new Error('Service unavailable')).mockResolvedValueOnce(
        createOpenNotifyResponse({
          latitude: '-33.87',
          longitude: '151.21',
          timestamp: 1700000000,
        })
      );

      const events = await collector.fetch();

      expect(events).toHaveLength(1);
      const event = events[0];
      expect(event.id).toBe('iss-position');
      expect(event.type).toBe('iss');
      expect(event.timestamp).toBe(1700000000 * 1000);
      expect(event.location).toEqual({
        lat: -33.87,
        lon: 151.21,
        name: 'International Space Station',
      });
      expect(event.severity).toBe(0);
      expect(event.title).toBe('ISS - International Space Station');
      expect(event.description).toContain('-33.87');
      expect(event.description).toContain('151.21');
      expect(event.data.altitude).toBe(408);
      expect(event.data.velocity).toBe(27600);
      expect(event.data.visibility).toBe('daylight');
    });

    it('should return empty array when WhereTheISS returns invalid data', async () => {
      mockedGet.mockResolvedValueOnce({
        data: { latitude: 'not-a-number', longitude: null },
      });

      const events = await collector.fetch();

      expect(events).toHaveLength(0);
    });

    it('should return empty array when both APIs fail validation', async () => {
      mockedGet.mockRejectedValueOnce(new Error('WhereTheISS down')).mockResolvedValueOnce({
        data: { message: 'error', iss_position: {} },
      });

      const events = await collector.fetch();

      expect(events).toHaveLength(0);
    });
  });

  describe('getStatus', () => {
    it('should report correct status', () => {
      const status = collector.getStatus();
      expect(status.name).toBe('ISS Tracker');
      expect(status.type).toBe('iss');
      expect(status.enabled).toBe(true);
      expect(status.running).toBe(false);
      expect(status.errorCount).toBe(0);
    });
  });
});
