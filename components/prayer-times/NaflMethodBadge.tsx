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

const METHOD_DESCRIPTIONS: Record<NaflMethod, string> = {
  STANDARD_15MIN: 'Fixed 15 minutes after sunrise (Ishraq) / before Dhuhr (Duha)',
  QUARTER_DAY: 'Duha = ¼ of daylight hours after sunrise',
  SOLAR_ANGLE_SPEAR: 'Solar angle method (Spear calculator variant)',
  SOLAR_ANGLE_DUHA: 'Solar angle for Duha (typically 15-20°)',
  MALIKI_DELAYED: 'Maliki school: delayed Asr, specific Duha timing',
};

export function NaflMethodBadge({ method, variant = 'inline', className }: NaflMethodBadgeProps) {
  const label = METHOD_LABELS[method];
  const description = METHOD_DESCRIPTIONS[method];

  const baseClasses = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider';
  const variantClasses = {
    corner: 'bg-primary/10 text-primary border border-primary/20',
    inline: 'bg-surface border border-border/40 text-text-muted',
  };

  if (variant === 'corner') {
    return (
      <ElevationTooltip
        elevation={0}
        prayerName="duha"
        naflMethod={method}
        position="left"
      >
        <span
          className={cn(baseClasses, variantClasses.corner, className)}
          title={description}
        >
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
      position="top"
    >
      <span
        className={cn(baseClasses, variantClasses.inline, className)}
        title={description}
      >
        {label}
      </span>
    </ElevationTooltip>
  );
}