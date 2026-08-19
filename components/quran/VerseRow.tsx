'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { Verse, VerseText } from '@/types/admin-content';

export interface VerseRowProps {
  verse: Verse;
  text: VerseText | null;
  editionTitle?: string | null;
}

export function VerseRow({ verse, text, editionTitle }: VerseRowProps) {
  return (
    <div className="py-6 border-b border-border/30 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        {/* Arabic verse */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <Link
              href={`/quran/${verse.surah_number}/${verse.number_in_surah}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              <span aria-hidden="true">۝</span>
              <span>Verse {verse.number_in_surah}</span>
            </Link>
            {verse.sajda && (
              <span className="px-2 py-0.5 rounded bg-secondary/15 border border-secondary/30 text-secondary text-[10px] font-bold uppercase tracking-wider">
                Sajda
              </span>
            )}
          </div>
          {verse.arabic && (
            <p
              className="font-arabic text-2xl sm:text-[1.75rem] leading-loose text-text text-right select-none"
              dir="rtl"
              lang="ar"
            >
              {verse.arabic}
            </p>
          )}
          {text?.verse_translation?.trim() && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Translation{editionTitle ? ` — ${editionTitle}` : ''}
              </p>
              <p className="text-base text-text-secondary leading-relaxed" dir="ltr">
                {text.verse_translation}
              </p>
            </div>
          )}
          {text?.verse_tafseer?.trim() && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Tafsir{editionTitle ? ` — ${editionTitle}` : ''}
              </p>
              <p
                className="text-sm text-text-secondary leading-relaxed border-l-2 border-border/50 pl-4"
                dir="ltr"
              >
                {text.verse_tafseer}
              </p>
            </div>
          )}
        </div>
        {/* Verse number marker */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-arabic text-lg mt-1"
          aria-label={`Verse ${verse.number_in_surah}`}
          dir="rtl"
        >
          <span className="text-sm">{verse.number_in_surah}</span>
        </div>
      </div>
    </div>
  );
}

export function useVerseTextMap(texts: VerseText[] | null | undefined): Map<number, VerseText> {
  return useMemo(() => {
    const map = new Map<number, VerseText>();
    if (texts) {
      for (const t of texts) {
        map.set(t.verse_number, t);
      }
    }
    return map;
  }, [texts]);
}