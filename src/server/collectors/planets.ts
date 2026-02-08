/**
 * Planet Visibility Collector
 * Uses simplified orbital calculations to determine which planets are visible tonight.
 * No external API required - pure astronomy calculations.
 */

import type { Event, PlanetEvent } from '@shared/types';
import { BaseCollector } from './base';

// Orbital elements for major planets (simplified, J2000 epoch)
interface OrbitalElements {
  name: string;
  a: number; // Semi-major axis (AU)
  e: number; // Eccentricity
  I: number; // Inclination (degrees)
  L: number; // Mean longitude at epoch (degrees)
  longPeri: number; // Longitude of perihelion (degrees)
  longNode: number; // Longitude of ascending node (degrees)
  period: number; // Orbital period (days)
  magnitude: number; // Base apparent magnitude
  symbol: string;
}

const PLANETS: OrbitalElements[] = [
  {
    name: 'Mercury',
    a: 0.387,
    e: 0.206,
    I: 7.0,
    L: 252.25,
    longPeri: 77.46,
    longNode: 48.33,
    period: 87.97,
    magnitude: -0.4,
    symbol: '☿',
  },
  {
    name: 'Venus',
    a: 0.723,
    e: 0.007,
    I: 3.39,
    L: 181.98,
    longPeri: 131.53,
    longNode: 76.68,
    period: 224.7,
    magnitude: -4.4,
    symbol: '♀',
  },
  {
    name: 'Mars',
    a: 1.524,
    e: 0.093,
    I: 1.85,
    L: 355.45,
    longPeri: 336.04,
    longNode: 49.56,
    period: 686.98,
    magnitude: -2.0,
    symbol: '♂',
  },
  {
    name: 'Jupiter',
    a: 5.203,
    e: 0.048,
    I: 1.3,
    L: 34.33,
    longPeri: 14.75,
    longNode: 100.47,
    period: 4332.59,
    magnitude: -2.7,
    symbol: '♃',
  },
  {
    name: 'Saturn',
    a: 9.537,
    e: 0.054,
    I: 2.49,
    L: 50.08,
    longPeri: 92.43,
    longNode: 113.66,
    period: 10759.22,
    magnitude: 0.5,
    symbol: '♄',
  },
];

// Constellation boundaries (simplified)
const CONSTELLATIONS = [
  { name: 'Aries', start: 0, end: 30 },
  { name: 'Taurus', start: 30, end: 60 },
  { name: 'Gemini', start: 60, end: 90 },
  { name: 'Cancer', start: 90, end: 120 },
  { name: 'Leo', start: 120, end: 150 },
  { name: 'Virgo', start: 150, end: 180 },
  { name: 'Libra', start: 180, end: 210 },
  { name: 'Scorpius', start: 210, end: 240 },
  { name: 'Sagittarius', start: 240, end: 270 },
  { name: 'Capricornus', start: 270, end: 300 },
  { name: 'Aquarius', start: 300, end: 330 },
  { name: 'Pisces', start: 330, end: 360 },
];

export class PlanetCollector extends BaseCollector {
  constructor() {
    // Update hourly
    super('Planet Visibility', 'planet', 60 * 60 * 1000);
  }

  async fetch(): Promise<Event[]> {
    const now = new Date();
    const events: Event[] = [];

    // Add Moon phase
    events.push(this.getMoonEvent(now));

    // Calculate position for each planet
    for (const planet of PLANETS) {
      const event = this.calculatePlanetEvent(planet, now);
      if (event) {
        events.push(event);
      }
    }

    return events;
  }

  validate(_data: unknown): boolean {
    // No external data to validate
    return true;
  }

  private calculatePlanetEvent(planet: OrbitalElements, date: Date): PlanetEvent | null {
    // Days since J2000 epoch (Jan 1, 2000 12:00 TT)
    const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
    const daysSinceJ2000 = (date.getTime() - J2000) / (24 * 60 * 60 * 1000);

    // Calculate mean anomaly
    const meanLongitude = (planet.L + (360 / planet.period) * daysSinceJ2000) % 360;

    // Simplified ecliptic longitude (ignoring perturbations)
    const eclipticLon = meanLongitude;

    // Get constellation
    const constellation = this.getConstellation(eclipticLon);

    // Estimate altitude (simplified - assumes observer at mid-northern latitudes)
    const localHour = date.getUTCHours();
    const hourAngle = (localHour - 12) * 15; // degrees
    const altitude = this.estimateAltitude(eclipticLon, hourAngle);

    // Only return if planet is potentially visible (altitude > -10)
    if (altitude < -10) {
      return null;
    }

    // Estimate azimuth (very simplified)
    const azimuth = (eclipticLon + hourAngle + 180) % 360;

    // Calculate visibility description
    const visibility = this.getVisibilityDescription(altitude, planet.magnitude);

    return {
      id: `planet-${planet.name.toLowerCase()}`,
      timestamp: date.getTime(),
      type: 'planet',
      location: null, // Planets are in the sky, not on Earth
      severity: this.getMagnitudeSeverity(planet.magnitude),
      title: `${planet.symbol} ${planet.name} in ${constellation}`,
      description: visibility,
      data: {
        planetName: planet.name,
        constellation,
        magnitude: planet.magnitude,
        altitude,
        azimuth,
        riseTime: this.estimateRiseTime(eclipticLon),
        setTime: this.estimateSetTime(eclipticLon),
      },
    };
  }

  private getMoonEvent(date: Date): PlanetEvent {
    // Calculate Moon phase (simplified)
    const lunarCycle = 29.53; // days
    const newMoon = new Date('2024-01-11T11:57:00Z').getTime();
    const daysSinceNewMoon = (date.getTime() - newMoon) / (24 * 60 * 60 * 1000);
    const phase = (daysSinceNewMoon % lunarCycle) / lunarCycle;

    const phaseName = this.getMoonPhaseName(phase);
    const illumination = Math.abs(Math.cos(phase * 2 * Math.PI - Math.PI) * 100);

    // Approximate ecliptic position (Moon moves ~13° per day)
    const eclipticLon = (phase * 360) % 360;
    const constellation = this.getConstellation(eclipticLon);

    return {
      id: 'planet-moon',
      timestamp: date.getTime(),
      type: 'planet',
      location: null,
      severity: 2, // Moon is always notable
      title: `🌙 Moon - ${phaseName}`,
      description: `${illumination.toFixed(0)}% illuminated in ${constellation}`,
      data: {
        planetName: 'Moon',
        constellation,
        magnitude: -12.7 + (1 - phase) * 10, // Full moon is brighter
        altitude: 45, // Approximate
        azimuth: 180,
        riseTime: 'Varies',
        setTime: 'Varies',
        phase,
      },
    };
  }

  private getConstellation(eclipticLon: number): string {
    const lon = ((eclipticLon % 360) + 360) % 360;
    for (const c of CONSTELLATIONS) {
      if (lon >= c.start && lon < c.end) {
        return c.name;
      }
    }
    return 'Aries';
  }

  private estimateAltitude(eclipticLon: number, hourAngle: number): number {
    // Very simplified altitude calculation
    // Assumes 45° latitude observer, ignores declination properly
    const sinAlt =
      Math.sin((23.5 * Math.PI) / 180) * Math.sin((eclipticLon * Math.PI) / 180) +
      Math.cos((23.5 * Math.PI) / 180) *
        Math.cos((eclipticLon * Math.PI) / 180) *
        Math.cos((hourAngle * Math.PI) / 180);
    return (Math.asin(sinAlt) * 180) / Math.PI;
  }

  private getVisibilityDescription(altitude: number, magnitude: number): string {
    if (altitude > 30) {
      return magnitude < 0 ? 'Excellent visibility - bright!' : 'Good visibility';
    }
    if (altitude > 10) {
      return 'Visible in evening/morning sky';
    }
    if (altitude > 0) {
      return 'Low on horizon - look early/late';
    }
    return 'Below horizon - not currently visible';
  }

  private getMagnitudeSeverity(magnitude: number): number {
    // Brighter = higher severity for visibility
    if (magnitude < -3) return 8;
    if (magnitude < -1) return 6;
    if (magnitude < 1) return 4;
    return 2;
  }

  private getMoonPhaseName(phase: number): string {
    if (phase < 0.03 || phase > 0.97) return 'New Moon';
    if (phase < 0.22) return 'Waxing Crescent';
    if (phase < 0.28) return 'First Quarter';
    if (phase < 0.47) return 'Waxing Gibbous';
    if (phase < 0.53) return 'Full Moon';
    if (phase < 0.72) return 'Waning Gibbous';
    if (phase < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
  }

  private estimateRiseTime(eclipticLon: number): string {
    // Very rough estimate based on position
    const hourOffset = Math.floor(((360 - eclipticLon) / 360) * 24);
    const hour = (6 + hourOffset) % 24;
    return `~${hour.toString().padStart(2, '0')}:00`;
  }

  private estimateSetTime(eclipticLon: number): string {
    const hourOffset = Math.floor(((360 - eclipticLon) / 360) * 24);
    const hour = (18 + hourOffset) % 24;
    return `~${hour.toString().padStart(2, '0')}:00`;
  }
}
