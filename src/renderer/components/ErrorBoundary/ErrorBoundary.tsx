import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  name: string;
  fallback?: ReactNode;
  retryDelayMs?: number;
  maxRetries?: number;
}

interface ErrorBoundaryState {
  hasError: boolean;
  retryCount: number;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  static defaultProps = {
    retryDelayMs: 5000,
    maxRetries: 3,
  };

  state: ErrorBoundaryState = {
    hasError: false,
    retryCount: 0,
    error: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[ErrorBoundary:${this.props.name}] ${error.message}`,
      '\nComponent stack:',
      info.componentStack
    );
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  handleRetry = () => {
    const { maxRetries = 3, retryDelayMs = 5000 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.retryTimer = setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          error: null,
          retryCount: prev.retryCount + 1,
        }));
      }, retryDelayMs);
    }
  };

  render() {
    const { hasError, retryCount, error } = this.state;
    const { children, name, fallback, maxRetries = 3 } = this.props;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    const canRetry = retryCount < maxRetries;

    return (
      <div className="flex flex-col items-center justify-center h-full bg-ob-bg-primary/80 border border-ob-border rounded p-4 text-center">
        <div className="text-ob-amber font-mono text-xs uppercase tracking-wider mb-2">
          {name} unavailable
        </div>
        <div className="text-ob-text-muted font-mono text-[10px] mb-3">
          {error?.message || 'Unexpected error'}
        </div>
        {canRetry ? (
          <button
            onClick={this.handleRetry}
            className="text-ob-cyan font-mono text-[10px] uppercase tracking-wider border border-ob-cyan/30 px-3 py-1 hover:bg-ob-cyan/10 transition-colors"
          >
            Retry ({maxRetries - retryCount} remaining)
          </button>
        ) : (
          <div className="text-ob-text-muted font-mono text-[10px]">
            Max retries reached — reload page to recover
          </div>
        )}
      </div>
    );
  }
}
