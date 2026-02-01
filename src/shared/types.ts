/**
 * Shared types used across frontend, backend, and Electron layers
 */

/**
 * Base event type for all data sources
 */
export interface Event {
  id: string;
  timestamp: number; // Unix timestamp in ms
  type: EventType;
  location: GeoLocation | null;
  severity?: number; // 0-10 scale for visualization
  title: string;
  description?: string;
  data: Record<string, any>; // Source-specific data
}

export type EventType =
  | 'earthquake'
  | 'weather'
  | 'news'
  | 'astronomy'
  | 'music'
  | 'ocean'
  | 'calendar'
  | 'historical';

export interface GeoLocation {
  lat: number;
  lon: number;
  name?: string; // City/region name
}

/**
 * Weather-specific event data
 */
export interface WeatherEvent extends Event {
  type: 'weather';
  data: {
    temperature: number; // Celsius
    condition: string; // 'clear', 'rain', 'storm', etc.
    windSpeed: number; // m/s
    humidity: number; // percentage
    pressure: number; // hPa
  };
}

/**
 * Earthquake-specific event data
 */
export interface EarthquakeEvent extends Event {
  type: 'earthquake';
  data: {
    magnitude: number;
    depth: number; // km
    region: string;
  };
}

/**
 * News-specific event data
 */
export interface NewsEvent extends Event {
  type: 'news';
  data: {
    headline: string;
    source: string;
    url: string;
    sentiment: number; // -1 to 1 (negative to positive)
    category: string;
  };
}

/**
 * Data collector plugin interface
 */
export interface DataCollector {
  name: string;
  type: EventType;
  interval: number; // ms between fetches
  enabled: boolean;
  fetch(): Promise<Event[]>;
  validate(data: unknown): boolean;
}

/**
 * Application state shape
 */
export interface AppState {
  events: Event[];
  selectedEvent: Event | null;
  activeCollectors: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * User settings
 */
export interface UserSettings {
  theme: 'dark' | 'light';
  enabledDataSources: EventType[];
  personalLocation: GeoLocation | null;
  updateInterval: number; // minutes
  notificationsEnabled: boolean;
}

/**
 * WebSocket message types
 */
export interface WSMessage {
  type: 'event' | 'update' | 'error' | 'ping';
  payload: any;
  timestamp: number;
}
