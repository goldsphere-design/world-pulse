import React from 'react';

type Props = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export default function EmptyState({
  title = 'No events to display',
  description = "We're not receiving any live events right now.",
  onRetry,
}: Props) {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
    >
      <div style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🌐</div>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <p style={{ color: '#9fb9d6' }}>{description}</p>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={onRetry}
            style={{
              background: '#06b6d4',
              color: '#021025',
              border: 'none',
              padding: '8px 12px',
              borderRadius: 8,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
