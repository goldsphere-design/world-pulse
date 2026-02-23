import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders title and description and calls retry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<EmptyState title="No data" description="Try again" onRetry={onRetry} />);

    expect(screen.getByText('No data')).toBeDefined();
    expect(screen.getByText('Try again')).toBeDefined();

    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalled();
  });
});
