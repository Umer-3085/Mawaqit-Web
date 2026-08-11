'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/components/ui/utils';
import type { CalculationMethod, Madhab, HighLatitudeRule, NaflMethod } from '@/types/prayer-times';

interface MethodInfoProps {
  calculation_method: CalculationMethod;
  madhab: Madhab;
  high_latitude_rule: HighLatitudeRule;
  nafl_method: NaflMethod;
  variant?: 'collapsible' | 'separate';
}

const METHOD_INFO: Record<string, { title: string; description: string; link?: string }> = {
  // Calculation Methods
  MUSLIM_WORLD_LEAGUE: {
    title: 'Muslim World League',
    description: '18° Fajr, 17° Isha. Standard worldwide, used in Europe, Far East, parts of USA.',
    link: 'https://www.muslimworldleague.org/',
  },
  EGYPTIAN: {
    title: 'Egyptian General Authority of Survey',
    description: '19.5° Fajr, 17.5° Isha. Used in Egypt, North Africa.',
    link: 'https://www.surveyofegypt.gov.eg/',
  },
  KARACHI: {
    title: 'University of Islamic Sciences, Karachi',
    description: '18° Fajr, 18° Isha. Used in Pakistan, Bangladesh, India, Afghanistan, parts of Europe.',
    link: 'https://www.uis.edu.pk/',
  },
  UMM_AL_QURA: {
    title: 'Umm al-Qura University, Makkah',
    description: '18.5° Fajr, 90 min after Maghrib for Isha. Official in Saudi Arabia.',
    link: 'https://uqu.edu.sa/',
  },
  DUBAI: {
    title: 'Dubai',
    description: '18.2° Fajr, 18.2° Isha. Used in UAE, Gulf regions.',
    link: 'https://www.islamicfinder.org/',
  },
  MOON_SIGHTING_COMMITTEE: {
    title: 'Moon Sighting Committee (USA)',
    description: '18° Fajr, 18° Isha. Used by Muslim communities in North America.',
    link: 'https://www.moonsighting.com/',
  },
  NORTH_AMERICA: {
    title: 'ISNA (Islamic Society of North America)',
    description: '15° Fajr, 15° Isha. Common in USA/Canada.',
    link: 'https://www.isna.net/',
  },
  KUWAIT: {
    title: 'Kuwait',
    description: '18° Fajr, 17.5° Isha. Used in Kuwait, parts of Gulf.',
  },
  QATAR: {
    title: 'Qatar',
    description: '18° Fajr, 17.5° Isha. Used in Qatar.',
  },
  SINGAPORE: {
    title: 'Singapore (MUIS)',
    description: '20° Fajr, 18° Isha. Used in Singapore, Malaysia, Indonesia.',
    link: 'https://www.muis.gov.sg/',
  },
  UOIF: {
    title: 'Union of Islamic Organizations of France',
    description: '12° Fajr, 12° Isha. Used in France, parts of Europe.',
    link: 'https://www.uoif-online.com/',
  },

  // Madhabs
  SHAFI: {
    title: 'Shafi\'i (Standard)',
    description: 'Asr starts when shadow length = object length. Used by majority of Sunni schools.',
  },
  HANAFI: {
    title: 'Hanafi (Later Asr)',
    description: 'Asr starts when shadow length = 2x object length. Results in later Asr time.',
  },

  // High Latitude Rules
  MIDDLE_OF_THE_NIGHT: {
    title: 'Middle of the Night',
    description: 'Fajr = midpoint between sunset and sunrise. Isha = midpoint. Conservative.',
  },
  SEVENTH_OF_THE_NIGHT: {
    title: '1/7th of the Night',
    description: 'Fajr = 1/7 night before sunrise. Isha = 1/7 night after sunset. Moderate.',
  },
  TWILIGHT_ANGLE: {
    title: 'Twilight Angle',
    description: 'Uses same angle as Fajr/Isha for high latitudes. Most accurate for extreme latitudes.',
  },

  // Nafl Methods
  STANDARD_15MIN: {
    title: 'Standard 15 Minutes',
    description: 'Ishraq = sunrise + 15 min. Duha = 15 min before Dhuhr. Fixed offsets.',
  },
  QUARTER_DAY: {
    title: 'Quarter Day',
    description: 'Duha = ¼ of daylight hours after sunrise. Varies by season/latitude.',
  },
  SOLAR_ANGLE_SPEAR: {
    title: 'Solar Angle (Spear)',
    description: 'Spear calculator variant. Uses specific solar angles for nafl times.',
  },
  SOLAR_ANGLE_DUHA: {
    title: 'Solar Angle (Duha)',
    description: 'Duha based on 15-20° solar angle. Common in North America (ISNA).',
  },
  MALIKI_DELAYED: {
    title: 'Maliki Delayed',
    description: 'Maliki school specific: delayed Asr, distinct Duha/Ishraq calculation.',
  },
};

function MethodInfoItem({ title, description, link }: { title: string; description: string; link?: string }) {
  return (
    <div className="p-3 rounded-lg bg-surface/50 border border-black/40">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-ivory">{title}</h4>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-primary hover:underline flex items-center gap-1"
          >
            Learn more
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
      <p className="text-xs text-text-muted mt-1 leading-relaxed">{description}</p>
    </div>
  );
}

export function MethodInfo({
  calculation_method,
  madhab,
  high_latitude_rule,
  nafl_method,
  variant = 'collapsible',
}: MethodInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { title: 'Calculation Authority', key: calculation_method },
    { title: 'Asr Calculation (Madhab)', key: madhab },
    { title: 'High Latitude Rule', key: high_latitude_rule },
    { title: 'Nafl Method', key: nafl_method },
  ];

  const renderContent = () => (
    <div className="space-y-3">
      {sections.map(({ title, key }) => {
        const info = METHOD_INFO[key];
        if (!info) return null;
        return (
          <MethodInfoItem
            key={key}
            title={`${title}: ${info.title}`}
            description={info.description}
            link={info.link}
          />
        );
      })}
    </div>
  );

  if (variant === 'separate') {
    return (
      <Card className="p-4 space-y-3 bg-ivory/5 border-black/40">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ivory mb-2">
          Method Details
        </h3>
        {renderContent()}
      </Card>
    );
  }

  // Collapsible variant
  return (
    <div className="border-t border-black/40 pt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-text-muted hover:text-ivory transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-ivory font-medium">Method Details</span>
        </span>
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 animate-fade-in-down">
          {renderContent()}
        </div>
      )}
    </div>
  );
}