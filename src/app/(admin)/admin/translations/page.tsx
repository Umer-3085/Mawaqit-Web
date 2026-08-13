'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, Search, Languages } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { apiClient, classifyEditionTypes } from '@/api';
import type { EditionType, TranslationTafseerDetailSimple, Surah, VerseText } from '@/types/admin-content';

export default function AdminTranslationsPage() {
  const [editionId, setEditionId] = useState<number | null>(null);
  const [surahNumber, setSurahNumber] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editionTypes, setEditionTypes] = useState<Map<number, EditionType | null>>(new Map());

  const { data: allDetails, error: detailsError } = useSWR(
    'admin-editions-all',
    () => apiClient.getTranslationTafseerDetailsAll()
  );

  useSWR(
    allDetails ? ['admin-edition-types', allDetails] : null,
    async () => {
      const types = await classifyEditionTypes(allDetails as TranslationTafseerDetailSimple[]);
      setEditionTypes(types);
      return types;
    }
  );

  const { data: surahs, error: surahsError } = useSWR('admin-surahs-all', () => apiClient.getSurahsAll());

  const translations = allDetails?.filter((d) => editionTypes.get(d.id) === 'translation') ?? [];

  const { data: verseTexts, error: textsError, isLoading: textsLoading } = useSWR(
    editionId && surahNumber ? ['admin-verse-texts', editionId, surahNumber, page] : null,
    () =>
      apiClient.getVerseTexts({
        detail_id: editionId as number,
        surah_number: surahNumber as number,
        page,
        page_size: 100,
      })
  );

  const selectedSurah = surahs?.find((s: Surah) => s.surah_number === surahNumber);
  const filteredTexts = (verseTexts?.items ?? []).filter(
    (t: VerseText) =>
      t.verse_translation.toLowerCase().includes(search.toLowerCase()) ||
      t.verse_number.toString().includes(search)
  );

  const handleEditionChange = (value: number) => {
    setEditionId(value);
    setPage(1);
    setSearch('');
  };

  const handleSurahChange = (value: number) => {
    setSurahNumber(value);
    setPage(1);
    setSearch('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Back Button */}
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3">
              <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                Translations Management
              </span>
              <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
                إدارة الترجمات
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Browse and manage verse translations across all translation editions
            </p>
          </div>
        </div>
      </div>

      {(detailsError || surahsError) && (
        <ErrorAlert
          message="Failed to load translation data. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      {/* Edition + Surah Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Translation Edition"
          placeholder="Select an edition..."
          options={(translations as TranslationTafseerDetailSimple[]).map((d) => ({
            value: d.id,
            label: `${d.title} (${d.lang})`,
          }))}
          value={editionId ? String(editionId) : ''}
          onChange={(v) => handleEditionChange(Number(v))}
        />
        <Select
          label="Surah"
          placeholder="Select a surah..."
          options={(surahs ?? []).map((s: Surah) => ({
            value: s.surah_number,
            label: `${s.surah_number}. ${s.english_name} — ${s.name_arabic}`,
          }))}
          value={surahNumber ? String(surahNumber) : ''}
          onChange={(v) => handleSurahChange(Number(v))}
        />
      </div>

      {/* Search */}
      {verseTexts && (
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search translation text or verse number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      )}

      {/* Verse Texts List */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4 flex flex-row items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
            {selectedSurah
              ? `${selectedSurah.english_name} — Translations (${filteredTexts.length})`
              : 'Translations'}
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {textsLoading && editionId && surahNumber ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : textsError ? (
            <div className="py-12 text-center text-text-muted">
              <p className="text-base font-semibold text-error">Failed to load verse translations</p>
            </div>
          ) : !editionId || !surahNumber ? (
            <div className="py-12 text-center text-text-muted">
              <Languages className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary" />
              <p className="text-base font-semibold text-text">Select an edition and surah</p>
              <p className="text-xs mt-1">Pick a translation edition and a surah to view its translated verses</p>
            </div>
          ) : filteredTexts.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <p className="text-base font-semibold text-text">No translation content found</p>
              <p className="text-xs mt-1">
                This surah has no translation content for the selected edition{search ? ' matching your search' : ''}.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredTexts.map((text) => (
                <div
                  key={`${text.surah_number}-${text.verse_number}-${text.detail_id}`}
                  className="p-5 flex items-start gap-4 hover:bg-surface-hover/30 transition-colors"
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-mono text-sm">
                    {text.verse_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text leading-relaxed">{text.verse_translation}</p>
                    <p className="text-xs text-text-muted mt-1.5">
                      Surah {text.surah_number} : Verse {text.verse_number}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {verseTexts && verseTexts.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Page {verseTexts.page} of {verseTexts.total_pages} ({verseTexts.total} verses)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={verseTexts.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={verseTexts.page >= verseTexts.total_pages}
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
