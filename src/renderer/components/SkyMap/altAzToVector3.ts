import * as THREE from 'three';

/**
 * Convert altitude/azimuth coordinates to a 3D position on a celestial sphere.
 * Used for positioning planets and celestial objects in the sky map.
 *
 * @param altitude - Elevation above horizon in degrees (0° = horizon, 90° = zenith)
 * @param azimuth - Compass direction in degrees (0° = North, 90° = East, 180° = South, 270° = West)
 * @param radius - Distance from observer (center of sphere)
 * @returns THREE.Vector3 position on the celestial sphere
 */
export function altAzToVector3(altitude: number, azimuth: number, radius: number): THREE.Vector3 {
  // Convert degrees to radians
  const altRad = (altitude * Math.PI) / 180;
  const azRad = (azimuth * Math.PI) / 180;

  // Calculate 3D coordinates
  // x: East-West (azimuth rotation around y-axis)
  // y: Up-Down (altitude)
  // z: North-South (azimuth rotation around y-axis)
  const x = radius * Math.cos(altRad) * Math.sin(azRad);
  const y = radius * Math.sin(altRad);
  const z = radius * Math.cos(altRad) * Math.cos(azRad);

  return new THREE.Vector3(x, y, z);
}
