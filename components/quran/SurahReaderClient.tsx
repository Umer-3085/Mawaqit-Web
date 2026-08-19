'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { apiClient } from '@/api';
import { VerseRow, useVerseTextMap } from '@/components/quran/VerseRow';
import type { Surah, Verse, TranslationTafseerDetailSimple } from '@/types/admin-content';

const NO_EDITION = 'none';
const VERSES_PER_PAGE = 25;

export interface SurahReaderClientProps {
  surah: Surah;
  initialVerses: Verse[];
  editions: TranslationTafseerDetailSimple[];
}

export function SurahReaderClient({ surah, initialVerses, editions }: SurahReaderClientProps) {
  const [editionId, setEditionId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const selectedEdition = editions.find((e) => e.id === editionId);

  const { data: texts, error, isLoading } = useSWR(
    editionId != null ? ['quran-texts', surah.surah_number, editionId] : null,
    () => apiClient.getVerseTextsForEdition(surah.surah_number, editionId!)
  );

  const textMap = useVerseTextMap(texts);
  const totalPages = Math.max(1, Math.ceil(surah.total_ayat / VERSES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedVerses = useMemo(() => {
    const start = (currentPage - 1) * VERSES_PER_PAGE;
    return initialVerses.slice(start, start + VERSES_PER_PAGE);
  }, [initialVerses, currentPage]);

  const handleEditionChange = (v: string) => {
    setEditionId(v === NO_EDITION ? null : Number(v));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <Link
            href="/quran"
            className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-lime transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Surahs</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3 mt-2">
            <span className="bg-gradient-to-r from-lime via-lime-light to-ivory bg-clip-text text-transparent">
              Surah {surah.english_name}
            </span>
            <span className="font-arabic text-lime text-xl font-semibold select-none" dir="rtl">
              {surah.name_arabic}
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {surah.english_name_translation} • {surah.revelation_type} • {surah.total_ayat} verses
          </p>
        </div>
        {/* Prev/Next surah */}
        <div className="flex items-center gap-2">
          {surah.surah_number > 1 && (
            <Link
              href={`/quran/${surah.surah_number - 1}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/60 text-sm text-text-muted hover:text-lime hover:bg-surface transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </Link>
          )}
          {surah.surah_number < 114 && (
            <Link
              href={`/quran/${surah.surah_number + 1}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/60 text-sm text-text-muted hover:text-lime hover:bg-surface transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Edition selector */}
      <div className="max-w-md">
        <Select
          label="Translation / Tafsir"
          options={[
            { value: NO_EDITION, label: 'Arabic only (no translation)' },
            ...(editions.length
              ? editions
              : [{ id: 1, title: 'Saheeh International', lang: 'en' }]
            ).map((e) => ({ value: String(e.id), label: `${e.title} (${e.lang})` })),
          ]}
          value={editionId == null ? NO_EDITION : String(editionId)}
          onChange={handleEditionChange}
        />
      </div>

      {error && (
        <ErrorAlert
          message="Failed to load translations. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
            Verses {currentPage > 1 ? `${(currentPage - 1) * VERSES_PER_PAGE + 1}–` : ''}
            {Math.min(currentPage * VERSES_PER_PAGE, surah.total_ayat)} of {surah.total_ayat}
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {editionId != null && isLoading && !texts ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="px-6">
              {pagedVerses.map((verse) => (
                <VerseRow
                  key={verse.number_in_surah}
                  verse={verse}
                  text={textMap.get(verse.number_in_surah) ?? null}
                  editionTitle={selectedEdition?.title}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}