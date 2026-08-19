'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { BookOpenText, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { apiClient } from '@/api';
import type { Category } from '@/types/admin-content';

export interface LibraryClientProps {
  initialCategories: Category[];
}

export function LibraryClient({ initialCategories }: LibraryClientProps) {
  const { data: counts, error } = useSWR(
    'library-category-counts',
    async () => {
      const categories = initialCategories;
      const entries = await Promise.all(
        categories.map(async (c) => {
          try {
            const items = await apiClient.getArticlesVideos({ category_id: c.id, page_size: 1 });
            return [c.id, items.total] as const;
          } catch {
            return [c.id, 0] as const;
          }
        })
      );
      return new Map<number, number>(entries);
    },
    { fallbackData: new Map() }
  );

  const categories = useMemo(() => initialCategories, [initialCategories]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3">
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              Islamic Library
            </span>
            <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
              المكتبة
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Articles and videos organized by topic — Quran, Hadith, Fiqh and more.
          </p>
        </div>
      </div>

      {error && (
        <ErrorAlert
          message="Failed to load library data. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      {categories.length === 0 ? (
        <Card className="bg-surface-elevated border border-border/40 shadow-sm">
          <CardContent className="py-12 text-center text-text-muted">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary" />
            <p className="text-base font-semibold text-text">No categories yet</p>
            <p className="text-xs mt-1">Check back later — content is being added.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/library/${category.id}`}
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
            >
              <Card className="h-full bg-surface-elevated border border-border/40 shadow-sm hover:shadow-md transition-all duration-150">
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-lime group-hover:text-black transition-colors">
                    <BookOpenText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-text">{category.title}</h3>
                  {category.description && (
                    <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  <p className="text-xs text-text-muted mt-4">
                    {counts?.get(category.id) ?? 0} items
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}