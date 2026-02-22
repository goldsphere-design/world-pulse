/**
 * Abstract base class for data collectors
 * All data source plugins should extend this
 */

import type { Event, DataCollector, EventType } from '@shared/types';

export abstract class BaseCollector implements DataCollector {
  public readonly name: string;
  public readonly type: EventType;
  public readonly interval: number;
  public enabled: boolean = true;

  private timer: NodeJS.Timeout | null = null;
  private lastFetch: number = 0;
  private errorCount: number = 0;
  private readonly maxErrors: number;
  public disabledReason: string | null = null;

  // Optional callback invoked when the collector becomes disabled
  public onDisabled?: (reason?: string) => void;

  constructor(name: string, type: EventType, interval: number, maxErrors = 5) {
    this.name = name;
    this.type = type;
    this.interval = interval;
    this.maxErrors = maxErrors;
  }

  /**
   * Implement this to fetch data from your source
   */
  abstract fetch(): Promise<Event[]>;

  /**
   * Implement this to validate external data
   */
  abstract validate(data: unknown): boolean;

  /**
   * Start the collector (polling loop)
   */
  start(callback: (events: Event[]) => void): void {
    if (this.timer) {
      console.warn(`[${this.name}] Already running`);
      return;
    }

    console.warn(`[${this.name}] Starting collector (interval: ${this.interval}ms)`);

    // Initial fetch (single iteration)
    this.pollNow(callback).catch(() => {});

    // Schedule recurring
    this.timer = setInterval(() => {
      this.pollNow(callback).catch(() => {});
    }, this.interval);
  }

  /**
   * Stop the collector
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.warn(`[${this.name}] Stopped`);
    }
  }

  /**
   * Single iteration of the polling logic. Public to allow deterministic testing.
   */
  public async pollNow(callback: (events: Event[]) => void): Promise<void> {
    if (!this.enabled) return;

    try {
      const events = await this.fetch();

      if (events.length > 0) {
        console.warn(`[${this.name}] Fetched ${events.length} events`);
        callback(events);
      }

      this.lastFetch = Date.now();
      this.errorCount = 0; // Reset on success
    } catch (error) {
      this.errorCount++;
      console.error(`[${this.name}] Fetch error (${this.errorCount}/${this.maxErrors}):`, error);

      if (this.errorCount >= this.maxErrors) {
        this.disabledReason = 'max_errors';
        console.error(`[${this.name}] Max errors reached, disabling collector`);
        this.stop();
        this.enabled = false;
        if (this.onDisabled) this.onDisabled(this.disabledReason);
      }
    }
  }

  /**
   * Get collector status
   */
  getStatus() {
    return {
      name: this.name,
      type: this.type,
      enabled: this.enabled,
      running: this.timer !== null,
      lastFetch: this.lastFetch,
      errorCount: this.errorCount,
    };
  }
}
