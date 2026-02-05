import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { useAppStore } from '../../store/useAppStore';

describe('Header', () => {
  beforeEach(() => {
    useAppStore.setState({
      connectionStatus: 'connected',
      featuredEvent: null,
    });
  });

  it('should render the WORLD PULSE title', () => {
    render(<Header />);
    expect(screen.getByText('WORLD PULSE')).toBeInTheDocument();
  });

  it('should show LIVE when connected', () => {
    render(<Header />);
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('should show OFFLINE when disconnected', () => {
    useAppStore.setState({ connectionStatus: 'disconnected' });
    render(<Header />);
    expect(screen.getByText('OFFLINE')).toBeInTheDocument();
  });

  it('should show CONNECTING when connecting', () => {
    useAppStore.setState({ connectionStatus: 'connecting' });
    render(<Header />);
    expect(screen.getByText('CONNECTING...')).toBeInTheDocument();
  });

  it('should show ERROR on connection error', () => {
    useAppStore.setState({ connectionStatus: 'error' });
    render(<Header />);
    expect(screen.getByText('ERROR')).toBeInTheDocument();
  });

  it('should show Monitoring when no featured event', () => {
    render(<Header />);
    expect(screen.getByText('Monitoring...')).toBeInTheDocument();
  });

  it('should show featured event title when available', () => {
    useAppStore.setState({
      featuredEvent: {
        id: '1',
        timestamp: Date.now(),
        type: 'earthquake',
        location: null,
        title: 'M5.0 - Near Coast of Peru',
        data: {},
      },
    });
    render(<Header />);
    expect(screen.getByText(/M5.0 - Near Coast of Peru/)).toBeInTheDocument();
  });

  it('should show FEATURED label with featured event', () => {
    useAppStore.setState({
      featuredEvent: {
        id: '1',
        timestamp: Date.now(),
        type: 'earthquake',
        location: null,
        title: 'Test Event',
        data: {},
      },
    });
    render(<Header />);
    expect(screen.getByText(/FEATURED/)).toBeInTheDocument();
  });

  it('should display UTC time', () => {
    render(<Header />);
    expect(screen.getByText(/UTC/)).toBeInTheDocument();
  });
});
