import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { SkyMap } from './SkyMap';
import { StarField } from './StarField';
import { HorizonRing } from './HorizonRing';

describe('SkyMap', () => {
  it('should render without crashing', () => {
    const { container } = render(<SkyMap />);
    expect(container).toBeTruthy();
  });

  it('should display SKY MAP header', () => {
    const { getByText } = render(<SkyMap />);
    expect(getByText(/SKY MAP/i)).toBeTruthy();
  });

  it('should display CELESTIAL label', () => {
    const { getByText } = render(<SkyMap />);
    expect(getByText(/\[CELESTIAL\]/i)).toBeTruthy();
  });

  it('should use default observer position', () => {
    // Default is 40°N, 0°E
    const { container } = render(<SkyMap />);
    expect(container).toBeTruthy();
  });

  it('should accept custom observer coordinates', () => {
    const { container } = render(<SkyMap observerLat={51.5} observerLon={-0.1} />);
    expect(container).toBeTruthy();
  });
});

describe('StarField', () => {
  it('should render stars without errors', () => {
    const { container } = render(
      <Canvas>
        <StarField />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });
});

describe('HorizonRing', () => {
  it('should render horizon ring without errors', () => {
    const { container } = render(
      <Canvas>
        <HorizonRing />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it('should accept observer latitude', () => {
    const { container } = render(
      <Canvas>
        <HorizonRing observerLat={51.5} />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });
});
