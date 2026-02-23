import React from 'react';

type Status = 'healthy' | 'degraded' | 'disabled';

type Props = {
  name: string;
  status: Status;
  reason?: string | null;
};

export default function CollectorHealthBadge({ name, status, reason }: Props) {
  const color = status === 'healthy' ? '#10b981' : status === 'degraded' ? '#f59e0b' : '#ef4444';

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
      title={reason ?? undefined}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 20,
          background: color,
          display: 'inline-block',
        }}
      />
      <span style={{ color: '#cfe8ff' }}>{name}</span>
      <span style={{ color: '#9fb9d6', marginLeft: 8, fontSize: 12 }}>{status}</span>
    </div>
  );
}
