/**
 * Space Weather / Aurora Collector
 * API: NOAA Space Weather Prediction Center
 * https://services.swpc.noaa.gov/
 */

import axios from 'axios';
import type { Event, AuroraEvent } from '@shared/types';
import { BaseCollector } from './base';

interface KpIndexEntry {
  time_tag: string;
  kp: string;
  kp_fraction: string;
  observed_swpc: string;
  noaa_scale: string;
}

export class AuroraCollector extends BaseCollector {
  // NOAA planetary K-index (Kp) - measures geomagnetic storm intensity
  private readonly kpUrl = 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json';

  constructor() {
    // Update every 5 minutes
    super('Aurora/Space Weather', 'aurora', 5 * 60 * 1000);
  }

  async fetch(): Promise<Event[]> {
    const response = await axios.get<KpIndexEntry[]>(this.kpUrl, {
      timeout: 10000,
    });

    if (!this.validate(response.data)) {
      throw new Error('Invalid response from NOAA SWPC');
    }

    // Get the most recent Kp reading
    const latest = response.data[response.data.length - 1];
    if (!latest) return [];

    return [this.transform(latest)];
  }

  validate(data: unknown): data is KpIndexEntry[] {
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return true;
    const first = data[0];
    return typeof first === 'object' && first !== null && 'kp' in first && 'time_tag' in first;
  }

  private transform(entry: KpIndexEntry): AuroraEvent {
    const kpValue = parseFloat(entry.kp);
    const stormLevel = this.getStormLevel(kpValue);
    const severity = this.calculateSeverity(kpValue);

    // Aurora is visible at high latitudes
    // Kp 5+ can be seen at lower latitudes
    const visibility = this.getVisibilityInfo(kpValue);

    return {
      id: `aurora-${entry.time_tag}`,
      timestamp: new Date(entry.time_tag).getTime(),
      type: 'aurora',
      location: {
        lat: visibility.latitude,
        lon: 0, // Aurora is circumpolar
        name: visibility.region,
      },
      severity,
      title: `Aurora Activity: Kp ${kpValue.toFixed(1)}`,
      description: `${stormLevel} - ${visibility.description}`,
      data: {
        kpIndex: kpValue,
        stormLevel: stormLevel.toLowerCase().replace(' ', '_') as
          | 'quiet'
          | 'unsettled'
          | 'storm'
          | 'severe',
        hemisphere: 'both',
      },
    };
  }

  private getStormLevel(kp: number): string {
    if (kp >= 8) return 'Severe Storm';
    if (kp >= 7) return 'Strong Storm';
    if (kp >= 6) return 'Moderate Storm';
    if (kp >= 5) return 'Minor Storm';
    if (kp >= 4) return 'Unsettled';
    return 'Quiet';
  }

  private calculateSeverity(kp: number): number {
    // Map Kp 0-9 to severity 0-10
    return Math.min(10, (kp / 9) * 10);
  }

  private getVisibilityInfo(kp: number): {
    latitude: number;
    region: string;
    description: string;
  } {
    // Higher Kp = aurora visible at lower latitudes
    if (kp >= 9) {
      return {
        latitude: 40,
        region: 'Mid-Latitudes (40°N/S)',
        description: 'Visible as far south as Spain/Northern US',
      };
    }
    if (kp >= 7) {
      return {
        latitude: 50,
        region: 'Northern Europe/Canada',
        description: 'Visible across UK, Germany, Northern US',
      };
    }
    if (kp >= 5) {
      return {
        latitude: 60,
        region: 'Scandinavia/Alaska',
        description: 'Visible in Iceland, Norway, Alaska',
      };
    }
    return {
      latitude: 67,
      region: 'Arctic Circle',
      description: 'Visible in Northern Scandinavia, Northern Canada',
    };
  }
}
