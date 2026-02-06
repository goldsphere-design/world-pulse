import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EarthquakeCollector } from './earthquakes';
import axios from 'axios';

vi.mock('axios');
const mockedGet = vi.mocked(axios.get);

function createUSGSResponse(
  features: Array<{
    mag: number;
    place: string;
    lon: number;
    lat: number;
    depth: number;
    id: string;
  }>
) {
  return {
    data: {
      type: 'FeatureCollection',
      metadata: {},
      features: features.map((f) => ({
        id: f.id,
        properties: {
          mag: f.mag,
          place: f.place,
          time: Date.now(),
          updated: Date.now(),
          url: '',
          detail: '',
          type: 'earthquake',
        },
        geometry: {
          coordinates: [f.lon, f.lat, f.depth],
        },
      })),
    },
  };
}

describe('EarthquakeCollector', () => {
  let collector: EarthquakeCollector;

  beforeEach(() => {
    collector = new EarthquakeCollector();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should have correct name and type', () => {
      expect(collector.name).toBe('USGS Earthquakes');
      expect(collector.type).toBe('earthquake');
    });

    it('should be enabled by default', () => {
      expect(collector.enabled).toBe(true);
    });

    it('should have 5 minute interval', () => {
      expect(collector.interval).toBe(5 * 60 * 1000);
    });
  });

  describe('validate', () => {
    it('should accept valid USGS FeatureCollection', () => {
      const valid = {
        type: 'FeatureCollection',
        features: [{ properties: { mag: 5.0 } }, { properties: { mag: 3.2 } }],
      };
      expect(collector.validate(valid)).toBe(true);
    });

    it('should accept empty feature collection', () => {
      const valid = { type: 'FeatureCollection', features: [] };
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

    it('should reject wrong type field', () => {
      expect(collector.validate({ type: 'Point', features: [] })).toBe(false);
    });

    it('should reject missing features', () => {
      expect(collector.validate({ type: 'FeatureCollection' })).toBe(false);
    });

    it('should reject features without mag property', () => {
      const invalid = {
        type: 'FeatureCollection',
        features: [{ properties: {} }],
      };
      expect(collector.validate(invalid)).toBe(false);
    });
  });

  describe('fetch', () => {
    it('should transform USGS data into Event objects', async () => {
      mockedGet.mockResolvedValueOnce(
        createUSGSResponse([
          { mag: 5.2, place: 'Near Tokyo', lon: 139.7, lat: 35.7, depth: 10, id: 'abc123' },
        ])
      );

      const events = await collector.fetch();

      expect(events).toHaveLength(1);
      expect(events[0].id).toBe('quake-abc123');
      expect(events[0].type).toBe('earthquake');
      expect(events[0].title).toContain('M5.2');
      expect(events[0].title).toContain('Near Tokyo');
      expect(events[0].location?.lat).toBe(35.7);
      expect(events[0].location?.lon).toBe(139.7);
      expect(events[0].description).toContain('10.0 km');
    });

    it('should calculate severity correctly', async () => {
      mockedGet.mockResolvedValueOnce(
        createUSGSResponse([
          { mag: 2.5, place: 'Min', lon: 0, lat: 0, depth: 5, id: 'min' },
          { mag: 7.0, place: 'Max', lon: 0, lat: 0, depth: 5, id: 'max' },
          { mag: 4.75, place: 'Mid', lon: 0, lat: 0, depth: 5, id: 'mid' },
        ])
      );

      const events = await collector.fetch();

      // mag 2.5 -> severity 0
      expect(events[0].severity).toBeCloseTo(0, 1);
      // mag 7.0 -> severity 10
      expect(events[1].severity).toBeCloseTo(10, 1);
      // mag 4.75 -> severity ~5
      expect(events[2].severity).toBeCloseTo(5, 1);
    });

    it('should throw on invalid response', async () => {
      mockedGet.mockResolvedValueOnce({ data: { type: 'invalid' } });
      await expect(collector.fetch()).rejects.toThrow('Invalid response from USGS API');
    });

    it('should throw on network error', async () => {
      mockedGet.mockRejectedValueOnce(new Error('Network Error'));
      await expect(collector.fetch()).rejects.toThrow('Network Error');
    });
  });

  describe('getStatus', () => {
    it('should report correct status', () => {
      const status = collector.getStatus();
      expect(status.name).toBe('USGS Earthquakes');
      expect(status.type).toBe('earthquake');
      expect(status.enabled).toBe(true);
      expect(status.running).toBe(false);
      expect(status.errorCount).toBe(0);
    });
  });
});
