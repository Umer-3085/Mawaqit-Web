'use client';

import { cn } from '@/components/ui/utils';

export interface PrayerTimeCardProps {
  label: string;
  arabicLabel?: string;
  time: string | null | undefined;
  elevation?: number | null;
  isObligatory?: boolean;
  isNext?: boolean;
  className?: string;
}

const ARABIC_LABELS: Record<string, string> = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
  Ishraq: 'الإشراق',
  'Duha Start': 'بداية الضحى',
  'Duha End': 'نهاية الضحى',
  'Awwabin Start': 'بداية الأوابين',
  'Awwabin End': 'نهاية الأوابين',
};

export function PrayerTimeCard({
  label,
  arabicLabel,
  time,
  elevation,
  isObligatory = false,
  isNext = false,
  className,
}: PrayerTimeCardProps) {
  const arLabel = arabicLabel || ARABIC_LABELS[label];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-between p-4 rounded-xl transition-all duration-150 ease-out select-none',
        'border border-border/40 shadow-sm hover:shadow-md',
        isObligatory ? 'bg-surface' : 'bg-surface/50 dark:bg-surface/30',
        isObligatory && 'ring-2 ring-primary/20 border-primary/30',
        isNext && 'bg-primary/5 dark:bg-primary/10 ring-2 ring-primary border-primary shadow-md',
        className
      )}
    >
      {isNext && (
        <span className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-semibold tracking-wider uppercase shadow-sm">
          Next Prayer
        </span>
      )}

      {/* Header: English & Arabic Labels */}
      <div className="flex items-center justify-between w-full mb-2 gap-1">
        <span className={cn('text-xs font-semibold uppercase tracking-wider', isNext ? 'text-primary' : 'text-text-muted')}>
          {label}
        </span>
        {arLabel && (
          <span className={cn('font-arabic text-sm font-semibold', isNext ? 'text-primary' : 'text-text-muted/80')} dir="rtl">
            {arLabel}
          </span>
        )}
      </div>

      {/* Time Display */}
      <div className="my-1">
        <span className={cn('text-2xl sm:text-3xl font-bold tabular-nums tracking-tight', isNext ? 'text-primary font-extrabold' : 'text-text')}>
          {time ?? '—'}
        </span>
      </div>

      {/* Elevation or status subtext */}
      {elevation !== undefined && elevation !== null ? (
        <span className="text-[11px] text-text-muted font-mono mt-1">
          {elevation}° solar angle
        </span>
      ) : (
        <span className="text-[11px] text-text-muted/60 mt-1 uppercase tracking-xs">
          {isObligatory ? 'Obligatory' : 'Sunnah / Nafl'}
        </span>
      )}
    </div>
  );
}