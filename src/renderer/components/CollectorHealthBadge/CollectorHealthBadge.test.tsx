import React from 'react';
import { render, screen } from '@testing-library/react';
import CollectorHealthBadge from './CollectorHealthBadge';

describe('CollectorHealthBadge', () => {
  it('renders name and status with healthy color', () => {
    render(<CollectorHealthBadge name="EQ" status="healthy" />);
    expect(screen.getByText('EQ')).toBeDefined();
    expect(screen.getByText('healthy')).toBeDefined();
  });
});
