'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, Search, Book } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { apiClient } from '@/api';
import type { Surah } from '@/types/admin-content';

export default function AdminSurahsPage() {
  const [revelationType, setRevelationType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: surahData, error, isLoading } = useSWR(
    ['admin-surahs', revelationType, search, page],
    () =>
      apiClient.getSurahs({
        page,
        page_size: 50,
        revelation_type: revelationType ?? undefined,
        search: search || undefined,
      })
  );

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
                Surahs
              </span>
              <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
                السور
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Browse the 114 surahs of the Holy Quran. Content is seeded and read-only
            </p>
          </div>
        </div>
      </div>

      {error && (
        <ErrorAlert
          message="Failed to load surahs. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <Select
          label="Revelation Type"
          placeholder="All types..."
          options={[
            { value: 'Meccan', label: 'Meccan' },
            { value: 'Medinan', label: 'Medinan' },
          ]}
          value={revelationType ?? ''}
          onChange={(v) => {
            setRevelationType(v || null);
            setPage(1);
          }}
        />
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search surahs by name, Arabic name or number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Surahs List */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
            Surahs ({surahData?.total ?? 0})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : !surahData || surahData.items.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <Book className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary" />
              <p className="text-base font-semibold text-text">No surahs found</p>
              <p className="text-xs mt-1">Try adjusting the filters or search criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {surahData.items.map((surah: Surah) => (
                <div
                  key={surah.surah_number}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-surface-hover/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Number badge */}
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-mono text-sm">
                      {surah.surah_number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text">{surah.english_name}</span>
                        <span className="font-arabic font-bold text-primary" dir="rtl">
                          {surah.name_arabic}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted">{surah.english_name_translation}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{surah.revelation_type} Revelation</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{surah.total_ayat} Verses</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {surahData && surahData.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Page {surahData.page} of {surahData.total_pages} ({surahData.total} surahs)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={surahData.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={surahData.page >= surahData.total_pages}
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
