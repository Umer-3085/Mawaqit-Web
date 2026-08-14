'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Save, SaveAll, Check, Pencil } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { apiClient } from '@/api';
import type { Surah, VerseText } from '@/types/admin-content';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

async function fetchAllVerseTexts(detailId: number, surahNumber: number): Promise<VerseText[]> {
  const all: VerseText[] = [];
  let page = 1;
  while (true) {
    const data = await apiClient.getVerseTexts({
      detail_id: detailId,
      surah_number: surahNumber,
      page,
      page_size: 100,
    });
    all.push(...data.items);
    if (page >= data.total_pages) break;
    page += 1;
  }
  return all;
}

export interface VerseContentEditorProps {
  editionId: number;
  surah: Surah;
  field: 'verse_translation' | 'verse_tafseer';
  badgeClass?: string;
  placeholder?: string;
  onSaved?: () => void;
}

export function VerseContentEditor({
  editionId,
  surah,
  field,
  badgeClass = 'bg-primary/10 text-primary border-primary/20',
  placeholder,
  onSaved,
}: VerseContentEditorProps) {
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(surah.total_ayat);
  const [content, setContent] = useState<Record<number, string>>({});
  const [savingVerse, setSavingVerse] = useState<number | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [savedVerse, setSavedVerse] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: verses, error: versesError } = useSWR(
    ['admin-surah-verses', surah.surah_number],
    () => apiClient.getVersesBySurah(surah.surah_number)
  );

  const { data: existing, error: existingError, mutate: mutateExisting } = useSWR(
    ['admin-editor-content', editionId, surah.surah_number],
    () => fetchAllVerseTexts(editionId, surah.surah_number)
  );

  const initial = useMemo(() => {
    const init: Record<number, string> = {};
    for (const verse of verses ?? []) {
      init[verse.number_in_surah] = '';
    }
    for (const row of existing ?? []) {
      init[row.verse_number] = row[field] ?? '';
    }
    return init;
  }, [verses, existing, field]);

  const visibleVerses = useMemo(() => {
    if (!verses) return [];
    return verses.filter(
      (v) => v.number_in_surah >= rangeFrom && v.number_in_surah <= rangeTo
    );
  }, [verses, rangeFrom, rangeTo]);

  const dirtyVerseNumbers = useMemo(() => {
    const dirty: number[] = [];
    for (const verse of visibleVerses) {
      const num = verse.number_in_surah;
      if ((content[num] ?? initial[num] ?? '') !== (initial[num] ?? '')) dirty.push(num);
    }
    return dirty;
  }, [visibleVerses, content, initial]);

  const handleSaveVerse = async (verseNumber: number) => {
    setSavingVerse(verseNumber);
    setActionError(null);
    try {
      const row = (existing ?? []).find((r) => r.verse_number === verseNumber);
      await apiClient.upsertVerseText(surah.surah_number, verseNumber, editionId, {
        verse_translation: field === 'verse_translation' ? content[verseNumber] ?? initial[verseNumber] ?? '' : row?.verse_translation ?? '',
        verse_tafseer: field === 'verse_tafseer' ? content[verseNumber] ?? initial[verseNumber] ?? '' : row?.verse_tafseer ?? '',
      });
      setSavedVerse(verseNumber);
      setTimeout(() => setSavedVerse((v) => (v === verseNumber ? null : v)), 2000);
      await mutateExisting();
      onSaved?.();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setSavingVerse(null);
    }
  };

  const handleSaveSurah = async () => {
    setSavingAll(true);
    setActionError(null);
    try {
      const items = dirtyVerseNumbers.map((verseNumber) => {
        const row = (existing ?? []).find((r) => r.verse_number === verseNumber);
        return {
          verse_number: verseNumber,
          verse_translation:
            field === 'verse_translation' ? content[verseNumber] ?? initial[verseNumber] ?? '' : row?.verse_translation ?? '',
          verse_tafseer:
            field === 'verse_tafseer' ? content[verseNumber] ?? initial[verseNumber] ?? '' : row?.verse_tafseer ?? '',
        };
      });
      if (items.length === 0) return;
      await apiClient.bulkUpsertVerseTexts({
        surah_number: surah.surah_number,
        detail_id: editionId,
        items,
      });
      await mutateExisting();
      onSaved?.();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setSavingAll(false);
    }
  };

  const loading = !verses || !existing;
  const hasError = versesError || existingError;

  return (
    <Card className="bg-surface-elevated border border-border/40 shadow-sm">
      <CardHeader className="border-b border-border/40 px-6 py-4 flex flex-row items-center justify-between gap-4 flex-wrap">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
          <Pencil className="w-4 h-4 text-primary" />
          Verse Editor — {surah.english_name} ({rangeFrom}–{rangeTo})
        </h2>
        <div className="flex items-center gap-2">
          <Input
            label="From"
            type="number"
            value={String(rangeFrom)}
            onChange={(e) => {
              const v = Math.max(1, Math.min(Number(e.target.value) || 1, rangeTo));
              setRangeFrom(v);
            }}
            className="w-24"
            min={1}
            max={surah.total_ayat}
          />
          <Input
            label="To"
            type="number"
            value={String(rangeTo)}
            onChange={(e) => {
              const v = Math.max(rangeFrom, Math.min(Number(e.target.value) || surah.total_ayat, surah.total_ayat));
              setRangeTo(v);
            }}
            className="w-24"
            min={rangeFrom}
            max={surah.total_ayat}
          />
          <Button
            variant="outline"
            size="sm"
            className="gap-2 mt-5"
            onClick={handleSaveSurah}
            loading={savingAll}
            disabled={dirtyVerseNumbers.length === 0}
          >
            <SaveAll className="w-4 h-4" />
            Save Surah{dirtyVerseNumbers.length > 0 ? ` (${dirtyVerseNumbers.length})` : ''}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : hasError ? (
          <div className="py-12 text-center text-text-muted">
            <p className="text-base font-semibold text-error">Failed to load verses</p>
          </div>
        ) : (
          <>
            {actionError && (
              <div className="px-6 pt-4">
                <ErrorAlert message={actionError} title="Save Failed" onDismiss={() => setActionError(null)} />
              </div>
            )}
            <div className="divide-y divide-border/30">
              {visibleVerses.map((verse) => {
                const num = verse.number_in_surah;
                const isSaving = savingVerse === num;
                const isSaved = savedVerse === num;
                const isDirty = (content[num] ?? '') !== (initial[num] ?? '');
                return (
                  <div
                    key={num}
                    className="p-5 flex flex-col md:flex-row md:items-start gap-4 hover:bg-surface-hover/30 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center font-bold font-mono text-sm ${badgeClass}`}
                    >
                      {num}
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <p
                        className="font-arabic text-lg leading-loose text-text select-none"
                        dir="rtl"
                        lang="ar"
                      >
                        {verse.arabic}
                      </p>
                      <Textarea
                        value={content[num] ?? initial[num] ?? ''}
                        onChange={(e) => setContent((prev) => ({ ...prev, [num]: e.target.value }))}
                        placeholder={placeholder ?? 'Enter content for this verse...'}
                        rows={3}
                        disabled={isSaving}
                        className="leading-relaxed"
                      />
                    </div>
                    <div className="flex items-center gap-2 md:flex-col md:items-end shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleSaveVerse(num)}
                        loading={isSaving}
                        disabled={!isDirty}
                      >
                        {isSaved ? <Check className="w-4 h-4 text-success" /> : <Save className="w-4 h-4" />}
                        {isSaved ? 'Saved' : 'Save Verse'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            {visibleVerses.length === 0 && (
              <div className="py-12 text-center text-text-muted">
                <p className="text-base font-semibold text-text">No verses in this range</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}