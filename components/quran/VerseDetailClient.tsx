'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { apiClient } from '@/api';
import type {
  Surah,
  Verse,
  VerseText,
  TranslationTafseerDetailSimple,
} from '@/types/admin-content';

const NO_EDITION = 'none';

export interface VerseDetailClientProps {
  surah: Surah;
  verse: Verse;
  initialTexts: VerseText[];
}

export function VerseDetailClient({ surah, verse, initialTexts }: VerseDetailClientProps) {
  const [editionId, setEditionId] = useState<number | null>(null);

  const { data: editions, error } = useSWR(
    'quran-editions',
    () => apiClient.getTranslationTafseerDetailsAll()
  );

  const editionList: TranslationTafseerDetailSimple[] = editions?.length
    ? editions
    : [{ id: 1, title: 'Saheeh International', lang: 'en' }];

  const text = useMemo(
    () => initialTexts.find((t) => t.detail_id === editionId) ?? null,
    [initialTexts, editionId]
  );
  const selectedEdition = editionList.find((e) => e.id === editionId);
  const prevVerse = verse.number_in_surah > 1;
  const nextVerse = verse.number_in_surah < surah.total_ayat;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <Link
            href={`/quran/${surah.surah_number}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Surah {surah.english_name}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3 mt-2">
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              Surah {surah.english_name} · Verse {verse.number_in_surah}
            </span>
            <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
              {surah.name_arabic}
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {surah.english_name_translation} • {surah.revelation_type}
            {verse.juz ? ` • Juz ${verse.juz}` : ''}
            {verse.page_no ? ` • Page ${verse.page_no}` : ''}
          </p>
        </div>
      </div>

      {error && (
        <ErrorAlert
          message="Failed to load editions. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      {/* Edition selector */}
      <div className="max-w-md">
        <Select
          label="Translation / Tafsir"
          options={[
            { value: NO_EDITION, label: 'Arabic only (no translation)' },
            ...editionList.map((e) => ({ value: String(e.id), label: `${e.title} (${e.lang})` })),
          ]}
          value={editionId == null ? NO_EDITION : String(editionId)}
          onChange={(v) => setEditionId(v === NO_EDITION ? null : Number(v))}
        />
      </div>

      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          {!initialTexts.length ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div>
              {verse.arabic && (
                <div className="flex items-start justify-between gap-4">
                  <p
                    className="flex-1 font-arabic text-2xl sm:text-3xl leading-loose text-text select-none"
                    dir="rtl"
                    lang="ar"
                  >
                    {verse.arabic}
                  </p>
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-arabic text-lg mt-1"
                    aria-label={`Verse ${verse.number_in_surah}`}
                    dir="rtl"
                  >
                    <span className="text-sm">{verse.number_in_surah}</span>
                  </div>
                </div>
              )}

              {verse.sajda && (
                <div className="mt-4">
                  <span className="px-2.5 py-1 rounded bg-secondary/15 border border-secondary/30 text-secondary text-[10px] font-bold uppercase tracking-wider">
                    Sajda Verse
                  </span>
                </div>
              )}

              {text?.verse_translation && (
                <div className="mt-6 pt-6 border-t border-border/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Translation{selectedEdition ? ` — ${selectedEdition.title}` : ''}
                  </p>
                  <p className="text-base sm:text-lg text-text leading-relaxed" dir="ltr">
                    {text.verse_translation}
                  </p>
                </div>
              )}

              {text?.verse_tafseer && (
                <div className="mt-6 pt-6 border-t border-border/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Tafsir{selectedEdition ? ` — ${selectedEdition.title}` : ''}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed" dir="ltr">
                    {text.verse_tafseer}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verse navigation */}
      <div className="flex items-center justify-between">
        {prevVerse ? (
          <Link
            href={`/quran/${surah.surah_number}/${verse.number_in_surah - 1}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/60 text-sm text-text-muted hover:text-primary hover:bg-surface transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Verse</span>
          </Link>
        ) : (
          <span />
        )}
        {nextVerse ? (
          <Link
            href={`/quran/${surah.surah_number}/${verse.number_in_surah + 1}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/60 text-sm text-text-muted hover:text-primary hover:bg-surface transition-colors"
          >
            <span>Next Verse</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/quran/${Math.min(surah.surah_number + 1, 114)}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/60 text-sm text-text-muted hover:text-primary hover:bg-surface transition-colors"
          >
            <span>Next Surah</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}