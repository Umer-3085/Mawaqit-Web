'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { apiClient } from '@/api';
import { ArticleItemCard } from '@/components/library/ArticleItemCard';
import type { ArticleVideo, Category, SubCategory } from '@/types/admin-content';

type TypeFilter = 'all' | 'article' | 'video';

export interface SubcategoryDetailClientProps {
  category: Category;
  subcategory: SubCategory;
  initialItems: ArticleVideo[];
  initialTotal: number;
}

export function SubcategoryDetailClient({
  category,
  subcategory,
  initialItems,
  initialTotal,
}: SubcategoryDetailClientProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const {
    data: itemsData,
    error,
    isLoading,
  } = useSWR(
    ['library-subcategory-items', subcategory.id, typeFilter],
    () =>
      apiClient.getArticlesVideos({
        category_id: category.id,
        subcategory_id: subcategory.id,
        page_size: 100,
        type: typeFilter,
      }),
    { fallbackData: typeFilter === 'all' ? { items: initialItems, total: initialTotal } : undefined }
  );

  const items = itemsData?.items ?? [];
  const total = itemsData?.total ?? initialTotal;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <Link
            href={`/library/${category.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {category.title}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3 mt-2">
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              {subcategory.title}
            </span>
          </h1>
          {subcategory.description && (
            <p className="text-sm text-text-muted mt-1">{subcategory.description}</p>
          )}
        </div>
      </div>

      {error && (
        <ErrorAlert
          message="Failed to load items. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      {/* Type filter */}
      <div className="flex items-center gap-2">
        {(
          [
            { value: 'all', label: 'All' },
            { value: 'article', label: 'Articles' },
            { value: 'video', label: 'Videos' },
          ] as { value: TypeFilter; label: string }[]
        ).map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setTypeFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              typeFilter === f.value
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'text-text-muted border-border/60 hover:text-primary hover:bg-surface'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {isLoading && items.length === 0 ? (
        <Card className="bg-surface-elevated border border-border/40 shadow-sm">
          <CardContent className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card className="bg-surface-elevated border border-border/40 shadow-sm">
          <CardContent className="py-12 text-center text-text-muted">
            <p className="text-base font-semibold text-text">No items found</p>
            <p className="text-xs mt-1">Nothing in this subcategory yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <p className="text-xs text-text-muted mb-3">{total} item{total === 1 ? '' : 's'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ArticleItemCard
                key={item.id}
                item={item}
                categoryTitle={category.title}
                subcategoryTitle={subcategory.title}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}