'use client';

import Link from 'next/link';
import { FileText, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import type { ArticleVideo } from '@/types/admin-content';

export interface ArticleItemCardProps {
  item: ArticleVideo;
  categoryTitle?: string;
  subcategoryTitle?: string | null;
}

export function ArticleItemCard({ item, categoryTitle, subcategoryTitle }: ArticleItemCardProps) {
  const isVideo = item.content_type === 'video';

  return (
    <Link
      href={`/library/item/${item.id}`}
      className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
    >
      <Card className="h-full bg-surface-elevated border border-border/40 shadow-sm hover:shadow-md transition-all duration-150 group-hover:border-primary/40">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                isVideo
                  ? 'bg-secondary/10 text-secondary border-secondary/25'
                  : 'bg-primary/10 text-primary border-primary/20'
              }`}
            >
              {isVideo ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                isVideo
                  ? 'bg-secondary/10 text-secondary border-secondary/25'
                  : 'bg-primary/10 text-primary border-primary/20'
              }`}
            >
              {isVideo ? 'Video' : 'Article'}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-text mt-3 leading-snug group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {item.detail && (
            <p className="text-xs text-text-muted mt-1.5 leading-relaxed line-clamp-3">
              {item.detail}
            </p>
          )}

          <p className="text-[10px] text-text-muted mt-3">
            {[categoryTitle, subcategoryTitle].filter(Boolean).join(' • ')}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}