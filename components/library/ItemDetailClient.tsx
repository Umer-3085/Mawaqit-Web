'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, FileText, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import type { ArticleVideo, Category, SubCategory } from '@/types/admin-content';

export interface ItemDetailClientProps {
  item: ArticleVideo;
  category: Category | null;
  subcategory: SubCategory | null;
}

export function ItemDetailClient({ item, category, subcategory }: ItemDetailClientProps) {
  const isVideo = item.content_type === 'video';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-2 pb-4 border-b border-border/40">
        <Link
          href={subcategory ? `/library/${category?.id}/${subcategory.id}` : `/library/${category?.id ?? ''}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-lime transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            Back to {subcategory?.title ?? category?.title ?? 'Library'}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
              isVideo
                ? 'bg-ivory/10 text-ivory border-ivory/25'
                : 'bg-lime/10 text-lime border-lime/25'
            }`}
          >
            {isVideo ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            {isVideo ? 'Video' : 'Article'}
          </span>
          {category && (
            <Link
              href={`/library/${category.id}`}
              className="text-xs font-semibold text-text-muted hover:text-lime transition-colors"
            >
              {category.title}
            </Link>
          )}
          {subcategory && (
            <>
              <span className="text-xs text-text-muted">•</span>
              <Link
                href={`/library/${category?.id}/${subcategory.id}`}
className="text-xs font-semibold text-text-muted hover:text-lime transition-colors"
              >
                {subcategory.title}
              </Link>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
          {item.title}
        </h1>
      </div>

      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          {isVideo && item.link ? (
            <div className="mb-6">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lime text-black text-sm font-semibold hover:bg-lime-hover transition-colors"
              >
                <Video className="w-4 h-4" />
                Watch Video
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          ) : null}

          {item.detail ? (
            <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed">
              {item.detail.split('\n').map((line, i) =>
                line.trim() ? (
                  <p key={i} className="mb-4 last:mb-0">
                    {line}
                  </p>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              No description provided for this {isVideo ? 'video' : 'article'}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}