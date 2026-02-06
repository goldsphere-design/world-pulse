import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Ticker } from './Ticker';
import { useAppStore } from '../../store/useAppStore';
import type { Event } from '@shared/types';

function mockEvent(id: string, overrides?: Partial<Event>): Event {
  return {
    id,
    timestamp: Date.now(),
    type: 'earthquake',
    location: { lat: 0, lon: 0, name: 'Test' },
    severity: 3,
    title: `Event ${id}`,
    data: {},
    ...overrides,
  };
}

describe('Ticker', () => {
  beforeEach(() => {
    useAppStore.setState({
      events: [],
      serverStatus: null,
    });
  });

  it('should show waiting message when no events', () => {
    render(<Ticker />);
    expect(screen.getByText('Waiting for events...')).toBeInTheDocument();
  });

  it('should render event titles in ticker', () => {
    useAppStore.setState({ events: [mockEvent('1')] });
    render(<Ticker />);
    // Text is split across nodes (emoji + title), so use a function matcher
    const titles = screen.getAllByText((_content, element) => {
      return !!(element?.textContent?.includes('Event 1') && element?.tagName === 'SPAN');
    });
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('should show source count', () => {
    useAppStore.setState({
      serverStatus: {
        ready: true,
        collectors: [
          { name: 'test', enabled: true, running: true },
          { name: 'test2', enabled: true, running: false },
        ],
      },
    });
    render(<Ticker />);
    expect(screen.getByText('1 SOURCES ACTIVE')).toBeInTheDocument();
  });

  it('should show event count', () => {
    const events = [mockEvent('1'), mockEvent('2'), mockEvent('3')];
    useAppStore.setState({ events });
    render(<Ticker />);
    expect(screen.getByText('3 EVENTS (24h)')).toBeInTheDocument();
  });

  it('should show version number', () => {
    render(<Ticker />);
    expect(screen.getByText('WORLD PULSE v0.1.0')).toBeInTheDocument();
  });

  it('should show refresh interval', () => {
    render(<Ticker />);
    expect(screen.getByText('REFRESH: 5min')).toBeInTheDocument();
  });

  it('should limit ticker to 10 events', () => {
    const events = Array.from({ length: 20 }, (_, i) => mockEvent(`${i}`));
    useAppStore.setState({ events });
    render(<Ticker />);
    // Event 10+ should not be in the ticker (only 0-9, each doubled = 20 renders)
    expect(screen.queryByText('Event 15')).not.toBeInTheDocument();
  });
});
