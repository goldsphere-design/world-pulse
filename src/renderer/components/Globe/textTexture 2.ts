import * as THREE from 'three';

/**
 * Create a canvas-based texture with text for use in Three.js sprites.
 * Uses the Oblivion design system (cyan text, dark background, JetBrains Mono).
 *
 * @param text - The text to render (typically 3-letter city code)
 * @param options - Optional customization
 * @returns THREE.CanvasTexture ready for sprite material
 */
export function createTextTexture(
  text: string,
  options: {
    fontSize?: number;
    textColor?: string;
    backgroundColor?: string;
    glowIntensity?: number;
  } = {}
): THREE.CanvasTexture {
  const {
    fontSize = 24,
    textColor = '#00D4FF', // Oblivion cyan
    backgroundColor = '#0A0A0F', // Oblivion background
    glowIntensity = 8,
  } = options;

  // Canvas dimensions (power of 2 for better GPU performance)
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;

  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text setup
  ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add subtle glow effect
  if (glowIntensity > 0) {
    ctx.shadowColor = textColor;
    ctx.shadowBlur = glowIntensity;
  }

  // Render text
  ctx.fillStyle = textColor;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create and configure texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  return texture;
}
