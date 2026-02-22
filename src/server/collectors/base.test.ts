import { describe, it, expect } from 'vitest';
import { BaseCollector } from './base';

class FailingCollector extends BaseCollector {
  constructor(maxErrors = 2) {
    super('fail-test', 'earthquake', 1000, maxErrors);
  }

  async fetch() {
    throw new Error('simulated failure');
  }

  validate() {
    return false;
  }
}

describe('BaseCollector', () => {
  it('disables after configured max errors', async () => {
    const c = new FailingCollector(2);

    // provide no-op callback
    const noop = () => {};

    // First failure
    await c.pollNow(noop).catch(() => {});
    expect(c.getStatus().enabled).toBe(true);
    expect(c.getStatus().errorCount).toBe(1);

    // Second failure -> should disable
    await c.pollNow(noop).catch(() => {});
    expect(c.getStatus().enabled).toBe(false);
    expect(c.getStatus().errorCount).toBe(2);
    expect(c.disabledReason).toBe('max_errors');
  });
});
