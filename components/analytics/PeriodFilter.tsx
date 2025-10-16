'use client';

import { Button } from '@/components/ui/button';

interface PeriodFilterProps {
  period: '7d' | '30d' | '90d';
  onChange: (period: '7d' | '30d' | '90d') => void;
}

export default function PeriodFilter({ period, onChange }: PeriodFilterProps) {
  const periods = [
    { value: '7d' as const, label: '7 Dias' },
    { value: '30d' as const, label: '30 Dias' },
    { value: '90d' as const, label: '90 Dias' },
  ];

  return (
    <div className="flex gap-2">
      {periods.map((p) => (
        <Button
          key={p.value}
          variant={period === p.value ? 'default' : 'outline'}
          onClick={() => onChange(p.value)}
          size="sm"
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
