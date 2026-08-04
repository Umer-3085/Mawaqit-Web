'use client';

import { Card, CardContent } from '../../components/ui/Card';
import { cn } from '../../components/ui/utils';

interface PrayerTimeCardProps {
  label: string;
  time: string | null | undefined;
  elevation?: number | null;
  isObligatory?: boolean;
  className?: string;
}

export function PrayerTimeCard({
  label,
  time,
  elevation,
  isObligatory = false,
  className,
}: PrayerTimeCardProps) {
  return (
    <Card className={cn('flex flex-col items-center p-4', isObligatory && 'ring-2 ring-primary/20', className)}>
      <CardContent className="flex flex-col items-center gap-1 w-full">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
          {label}
        </span>
        <span className="text-2xl font-semibold text-text tabular-nums">
          {time ?? '—'}
        </span>
        {elevation !== undefined && elevation !== null && (
          <span className="text-xs text-text-muted font-mono">
            {elevation}°
          </span>
        )}
      </CardContent>
    </Card>
  );
}