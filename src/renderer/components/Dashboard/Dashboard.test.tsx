import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { useAppStore } from '../../store/useAppStore';

// Mock the Globe component since it uses WebGL which isn't available in jsdom
vi.mock('../Globe/Globe', () => ({
  Globe: () => <div data-testid="globe-mock">Globe</div>,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    useAppStore.setState({
      connectionStatus: 'connected',
      serverStatus: null,
      events: [],
      featuredEvent: null,
      selectedEvent: null,
      isInitialized: true,
    });
  });

  it('should render the Header', () => {
    render(<Dashboard />);
    expect(screen.getByText('WORLD PULSE')).toBeInTheDocument();
  });

  it('should render the Globe section', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('globe-mock')).toBeInTheDocument();
  });

  it('should render the EventPanel', () => {
    render(<Dashboard />);
    expect(screen.getByText(/EVENTS \[/)).toBeInTheDocument();
  });

  it('should render the Ticker', () => {
    render(<Dashboard />);
    expect(screen.getByText('WORLD PULSE v0.1.0')).toBeInTheDocument();
  });

  it('should show all main layout sections together', () => {
    render(<Dashboard />);
    // Header
    expect(screen.getByText('WORLD PULSE')).toBeInTheDocument();
    // Globe (mocked)
    expect(screen.getByTestId('globe-mock')).toBeInTheDocument();
    // Event panel
    expect(screen.getByText(/EVENTS \[/)).toBeInTheDocument();
    // Ticker status bar
    expect(screen.getByText('0 SOURCES ACTIVE')).toBeInTheDocument();
  });
});
