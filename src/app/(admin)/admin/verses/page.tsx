'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { apiClient } from '@/api';
import type { Surah, Verse } from '@/types/admin-content';

export default function AdminVersesPage() {
  const [surahNumber, setSurahNumber] = useState<number | null>(null);
  const [juz, setJuz] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: surahs, error: surahsError } = useSWR('admin-surahs-all', () => apiClient.getSurahsAll());

  const { data: verseData, error: versesError, isLoading } = useSWR(
    ['admin-verses', surahNumber, juz, search, page],
    () =>
      apiClient.getVerses({
        page,
        page_size: 50,
        surah_number: surahNumber ?? undefined,
        juz: juz ?? undefined,
        search: search || undefined,
      })
  );

  const handleSurahChange = (value: number) => {
    setSurahNumber(value);
    setPage(1);
  };

  const handleJuzChange = (value: number) => {
    setJuz(value);
    setPage(1);
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
                Verses
              </span>
              <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
                الآيات
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Browse the Quranic verses. Content is seeded from the Holy Quran and is read-only
            </p>
          </div>
        </div>
      </div>

      {(surahsError || versesError) && (
        <ErrorAlert
          message="Failed to load verses. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <Select
          label="Surah"
          placeholder="All surahs..."
          options={(surahs ?? []).map((s: Surah) => ({
            value: s.surah_number,
            label: `${s.surah_number}. ${s.english_name} — ${s.name_arabic}`,
          }))}
          value={surahNumber ? String(surahNumber) : ''}
          onChange={(v) => handleSurahChange(Number(v))}
        />
        <Select
          label="Juz"
          placeholder="All juz..."
          options={Array.from({ length: 30 }, (_, i) => ({
            value: i + 1,
            label: `Juz ${i + 1}`,
          }))}
          value={juz ? String(juz) : ''}
          onChange={(v) => handleJuzChange(Number(v))}
        />
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search verses by Arabic text or Surah number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Verses List */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
            Verses ({verseData?.total ?? 0})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : !verseData || verseData.items.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary" />
              <p className="text-base font-semibold text-text">No verses found</p>
              <p className="text-xs mt-1">Try adjusting the filters or search criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {verseData.items.map((verse: Verse) => (
                <div
                  key={`${verse.surah_number}-${verse.number_in_surah}`}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-hover/30 transition-colors"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-xs font-bold font-mono">
                        Surah {verse.surah_number} : Verse {verse.number_in_surah}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface border border-border/40 text-xs font-mono text-text-muted">
                        Global #{verse.global_number}
                      </span>
                      {verse.juz && (
                        <span className="px-2 py-0.5 rounded bg-surface border border-border/40 text-xs font-mono text-text-muted">
                          Juz {verse.juz}
                        </span>
                      )}
                      {verse.page_no && (
                        <span className="px-2 py-0.5 rounded bg-surface border border-border/40 text-xs font-mono text-text-muted">
                          Page {verse.page_no}
                        </span>
                      )}
                    </div>
                    {verse.arabic && (
                      <p
                        className="font-arabic-classical text-2xl text-text leading-loose text-right md:text-left"
                        dir="rtl"
                      >
                        {verse.arabic}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {verseData && verseData.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Page {verseData.page} of {verseData.total_pages} ({verseData.total} verses)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={verseData.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={verseData.page >= verseData.total_pages}
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
