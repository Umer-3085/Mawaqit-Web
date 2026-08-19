'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Surah } from '@/types/admin-content';

const PAGE_SIZE = 50;

export interface SurahListClientProps {
  initialSurahs: Surah[];
}

export function SurahListClient({ initialSurahs }: SurahListClientProps) {
  const [revelationType, setRevelationType] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialSurahs.filter((s) => {
      if (revelationType && s.revelation_type !== revelationType) return false;
      if (!q) return true;
      return (
        s.english_name.toLowerCase().includes(q) ||
        s.english_name_translation.toLowerCase().includes(q) ||
        s.name_arabic.toLowerCase().includes(q) ||
        String(s.surah_number) === q
      );
    });
  }, [initialSurahs, revelationType, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3">
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              The Holy Quran
            </span>
            <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
              القرآن الكريم
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Browse all {initialSurahs.length} surahs and read verses with translations.
          </p>
        </div>
      </div>

      {/* Filters */}
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

      {/* Surah List */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
            Surahs ({filtered.length})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {paged.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary" />
              <p className="text-base font-semibold text-text">No surahs found</p>
              <p className="text-xs mt-1">Try adjusting the filters or search criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {paged.map((surah) => (
                <Link
                  key={surah.surah_number}
                  href={`/quran/${surah.surah_number}`}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-surface-hover/30 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-mono text-sm group-hover:bg-primary group-hover:text-white transition-colors">
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
                        <span className="text-xs text-text-muted">{surah.revelation_type}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{surah.total_ayat} Verses</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-text-muted group-hover:text-primary transition-colors text-sm">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Page {currentPage} of {totalPages} ({filtered.length} surahs)
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