'use client';

import { ElevationTooltip } from './ElevationTooltip';
import { cn } from '@/components/ui/utils';
import type { NaflMethod } from '@/types/prayer-times';

interface NaflMethodBadgeProps {
  method: NaflMethod;
  variant?: 'corner' | 'inline';
  className?: string;
}

const METHOD_LABELS: Record<NaflMethod, string> = {
  STANDARD_15MIN: '15 min',
  QUARTER_DAY: '¼ Day',
  SOLAR_ANGLE_SPEAR: 'Solar (Spear)',
  SOLAR_ANGLE_DUHA: 'Solar (Duha)',
  MALIKI_DELAYED: 'Maliki',
};

export function NaflMethodBadge({ method, variant = 'inline', className }: NaflMethodBadgeProps) {
  const label = METHOD_LABELS[method];
  const isQuarterDay = method === 'QUARTER_DAY';

  const baseClasses = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider';
  const variantClasses = {
    corner: isQuarterDay 
      ? 'bg-ivory text-black border border-ivory/20'
      : 'bg-lime text-black border border-lime/20',
    inline: isQuarterDay
      ? 'bg-ivory/10 text-ivory border border-ivory/20'
      : 'bg-lime/10 text-lime border border-lime/20',
  };

  if (variant === 'corner') {
    return (
      <ElevationTooltip
        elevation={0}
        prayerName="duha"
        naflMethod={method}
        position="left"
      >
        <span className={cn(baseClasses, variantClasses.corner, className)}>
          {label}
        </span>
      </ElevationTooltip>
    );
  }

  return (
    <ElevationTooltip
      elevation={0}
      prayerName="duha"
      naflMethod={method}
      position="right"
    >
      <span className={cn(baseClasses, variantClasses.inline, className)}>
        {label}
      </span>
    </ElevationTooltip>
  );
}