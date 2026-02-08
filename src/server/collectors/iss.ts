/**
 * ISS (International Space Station) Position Collector
 * APIs:
 *   - http://api.open-notify.org/iss-now.json (position)
 *   - https://api.wheretheiss.at/v1/satellites/25544 (detailed)
 */

import axios from 'axios';
import type { Event, ISSEvent } from '@shared/types';
import { BaseCollector } from './base';

interface OpenNotifyResponse {
  message: string;
  timestamp: number;
  iss_position: {
    latitude: string;
    longitude: string;
  };
}

interface WhereTheISSResponse {
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

export class ISSCollector extends BaseCollector {
  private readonly openNotifyUrl = 'http://api.open-notify.org/iss-now.json';
  private readonly whereTheISSUrl = 'https://api.wheretheiss.at/v1/satellites/25544';

  constructor() {
    // Update every 10 seconds for smooth tracking
    super('ISS Tracker', 'iss', 10 * 1000);
  }

  async fetch(): Promise<Event[]> {
    try {
      // Try Where The ISS At API first (more detailed)
      const response = await axios.get<WhereTheISSResponse>(this.whereTheISSUrl, {
        timeout: 5000,
      });

      if (this.validateWhereTheISS(response.data)) {
        return [this.transformWhereTheISS(response.data)];
      }
    } catch {
      // Fallback to Open Notify
      const response = await axios.get<OpenNotifyResponse>(this.openNotifyUrl, {
        timeout: 5000,
      });

      if (this.validate(response.data)) {
        return [this.transformOpenNotify(response.data)];
      }
    }

    return [];
  }

  validate(data: unknown): data is OpenNotifyResponse {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as OpenNotifyResponse;
    return (
      obj.message === 'success' &&
      obj.iss_position?.latitude !== undefined &&
      obj.iss_position?.longitude !== undefined
    );
  }

  private validateWhereTheISS(data: unknown): data is WhereTheISSResponse {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as WhereTheISSResponse;
    return (
      typeof obj.latitude === 'number' &&
      typeof obj.longitude === 'number' &&
      typeof obj.altitude === 'number'
    );
  }

  private transformOpenNotify(data: OpenNotifyResponse): ISSEvent {
    const lat = parseFloat(data.iss_position.latitude);
    const lon = parseFloat(data.iss_position.longitude);

    return {
      id: 'iss-position',
      timestamp: data.timestamp * 1000,
      type: 'iss',
      location: { lat, lon, name: 'International Space Station' },
      severity: 0, // Always visible, no severity
      title: 'ISS - International Space Station',
      description: `Current position: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
      data: {
        altitude: 408, // Average ISS altitude
        velocity: 27600, // Average velocity km/h
        visibility: 'daylight',
      },
    };
  }

  private transformWhereTheISS(data: WhereTheISSResponse): ISSEvent {
    return {
      id: 'iss-position',
      timestamp: data.timestamp * 1000,
      type: 'iss',
      location: {
        lat: data.latitude,
        lon: data.longitude,
        name: 'International Space Station',
      },
      severity: 0,
      title: 'ISS - International Space Station',
      description: `Alt: ${data.altitude.toFixed(0)} km | Speed: ${data.velocity.toFixed(0)} km/h`,
      data: {
        altitude: data.altitude,
        velocity: data.velocity,
        visibility: data.visibility as 'daylight' | 'eclipsed',
      },
    };
  }
}
