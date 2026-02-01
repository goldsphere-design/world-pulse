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
  private readonly maxErrors: number = 5;

  constructor(name: string, type: EventType, interval: number) {
    this.name = name;
    this.type = type;
    this.interval = interval;
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

    console.log(`[${this.name}] Starting collector (interval: ${this.interval}ms)`);

    const poll = async () => {
      if (!this.enabled) return;

      try {
        const events = await this.fetch();

        if (events.length > 0) {
          console.log(`[${this.name}] Fetched ${events.length} events`);
          callback(events);
        }

        this.lastFetch = Date.now();
        this.errorCount = 0; // Reset on success
      } catch (error) {
        this.errorCount++;
        console.error(`[${this.name}] Fetch error (${this.errorCount}/${this.maxErrors}):`, error);

        if (this.errorCount >= this.maxErrors) {
          console.error(`[${this.name}] Max errors reached, disabling collector`);
          this.stop();
          this.enabled = false;
        }
      }
    };

    // Initial fetch
    poll();

    // Schedule recurring
    this.timer = setInterval(poll, this.interval);
  }

  /**
   * Stop the collector
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log(`[${this.name}] Stopped`);
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
