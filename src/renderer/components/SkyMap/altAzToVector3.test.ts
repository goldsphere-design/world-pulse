import { describe, it, expect } from 'vitest';
import { altAzToVector3 } from './altAzToVector3';

describe('altAzToVector3', () => {
  const RADIUS = 50;

  it('should place zenith (90° altitude) at y=radius', () => {
    const v = altAzToVector3(90, 0, RADIUS);
    expect(v.y).toBeCloseTo(RADIUS, 1);
    expect(v.x).toBeCloseTo(0, 1);
    expect(v.z).toBeCloseTo(0, 1);
  });

  it('should place horizon (0° altitude) at y=0', () => {
    const v = altAzToVector3(0, 180, RADIUS);
    expect(v.y).toBeCloseTo(0, 1);
  });

  it('should produce vectors of correct radius', () => {
    const testCases = [
      { alt: 90, az: 0 }, // Zenith
      { alt: 0, az: 0 }, // North horizon
      { alt: 0, az: 90 }, // East horizon
      { alt: 0, az: 180 }, // South horizon
      { alt: 0, az: 270 }, // West horizon
      { alt: 45, az: 45 }, // Mid-sky
    ];

    for (const { alt, az } of testCases) {
      const v = altAzToVector3(alt, az, RADIUS);
      expect(v.length()).toBeCloseTo(RADIUS, 1);
    }
  });

  it('should place north (azimuth 0°) along positive z-axis', () => {
    const v = altAzToVector3(0, 0, RADIUS);
    expect(v.z).toBeCloseTo(RADIUS, 1);
    expect(v.x).toBeCloseTo(0, 1);
  });

  it('should place east (azimuth 90°) along positive x-axis', () => {
    const v = altAzToVector3(0, 90, RADIUS);
    expect(v.x).toBeCloseTo(RADIUS, 1);
    expect(v.z).toBeCloseTo(0, 1);
  });

  it('should place south (azimuth 180°) along negative z-axis', () => {
    const v = altAzToVector3(0, 180, RADIUS);
    expect(v.z).toBeCloseTo(-RADIUS, 1);
    expect(v.x).toBeCloseTo(0, 1);
  });

  it('should place west (azimuth 270°) along negative x-axis', () => {
    const v = altAzToVector3(0, 270, RADIUS);
    expect(v.x).toBeCloseTo(-RADIUS, 1);
    expect(v.z).toBeCloseTo(0, 1);
  });

  it('should handle negative altitudes (below horizon)', () => {
    const v = altAzToVector3(-30, 0, RADIUS);
    expect(v.y).toBeLessThan(0);
    expect(v.length()).toBeCloseTo(RADIUS, 1);
  });
});
