'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/components/ui/utils';

interface ElevationTooltipProps {
  elevation: number;
  prayerName: 'ishraq' | 'duha';
  naflMethod?: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'left';
}

const TOOLTIP_CONTENT: Record<'ishraq' | 'duha', string | ((method: string) => string)> = {
  ishraq: '15° — ISNA/MWL standard: Ishraq = sunrise + ~20 min',
  duha: (method: string) => {
    switch (method) {
      case 'QUARTER_DAY':
        return '¼ daylight hours after sunrise';
      case 'SOLAR_ANGLE_DUHA':
        return '15-20° solar angle (ISNA standard)';
      case 'STANDARD_15MIN':
        return 'Fixed 15 min after sunrise';
      case 'SOLAR_ANGLE_SPEAR':
        return 'Solar angle method (Spear calculator)';
      case 'MALIKI_DELAYED':
        return 'Maliki school: specific Duha timing';
      default:
        return 'Based on selected nafl method';
    }
  },
};

export function ElevationTooltip({
  elevation,
  prayerName,
  naflMethod = 'QUARTER_DAY',
  children,
  position = 'top',
}: ElevationTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !childRef.current) return;

    const tooltip = tooltipRef.current;
    const child = childRef.current;
    const childRect = child.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Check if tooltip would go off screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;

    if (position === 'top') {
      if (childRect.top - tooltipRect.height - 8 < 0) {
        newPosition = 'right';
      }
    } else if (position === 'right') {
      if (childRect.right + tooltipRect.width + 8 > viewportWidth) {
        newPosition = 'left';
      }
    } else if (position === 'left') {
      if (childRect.left - tooltipRect.width - 8 < 0) {
        newPosition = 'right';
      }
    }

    setActualPosition(newPosition);
  }, [isVisible, position]);

  const content = typeof TOOLTIP_CONTENT[prayerName] === 'function'
    ? TOOLTIP_CONTENT[prayerName](naflMethod)
    : TOOLTIP_CONTENT[prayerName];

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  return (
    <span
      ref={childRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg shadow-lg',
            'whitespace-nowrap max-w-[280px] text-wrap',
            'animate-fade-in-up',
            positionClasses[actualPosition]
          )}
          role="tooltip"
        >
          <div className="font-semibold text-primary mb-0.5">{elevation}° Solar Angle</div>
          <div>{content}</div>
          <div className="absolute w-0 h-0 border-4 border-transparent">
            {actualPosition === 'top' && <div className="bottom-[-8px] left-1/2 -translate-x-1/2 border-t-white dark:border-t-gray-100" />}
            {actualPosition === 'right' && <div className="left-[-8px] top-1/2 -translate-y-1/2 border-r-white dark:border-r-gray-100" />}
            {actualPosition === 'left' && <div className="right-[-8px] top-1/2 -translate-y-1/2 border-l-white dark:border-l-gray-100" />}
          </div>
        </div>
      )}
    </span>
  );
}