'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Edit2, Trash2, Calendar, User } from 'lucide-react';
import { useState } from 'react';

const initialArticles = [
  { id: 1, title: 'Understanding Tafsir methodology', author: 'Dr. Abdul Malik', category: 'Tafsir', date: '2026-08-10', status: 'Published' },
  { id: 2, title: 'The Importance of Salat in congregation', author: 'Sheikh Yusuf', category: 'Fiqh', date: '2026-08-12', status: 'Draft' },
];

export default function AdminArticlesPage() {
  const [search, setSearch] = useState('');

  const filteredArticles = initialArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
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
              Articles Management
              <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
                إدارة المقالات
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">Write, review, publish and edit islamic library articles</p>
          </div>
          <Button className="gap-2 self-start sm:self-auto bg-primary text-white hover:bg-primary-hover">
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search articles by title, author or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* List Card */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
            Articles ({filteredArticles.length})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {filteredArticles.map((article) => (
              <div key={article.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-hover/30 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {article.category}
                    </span>
                    <span className="text-text-muted text-[10px]">•</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      article.status === 'Published'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-text text-base">
                    {article.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{article.author}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-text hover:text-primary hover:bg-surface transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-error hover:bg-error/5 hover:border-error/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredArticles.length === 0 && (
              <div className="py-12 text-center text-text-muted">
                No articles found matching search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
