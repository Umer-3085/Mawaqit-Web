'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { cn } from '@/components/ui/utils';
import { Plus, BookOpen, Book, FileText, Video, FolderTree, TrendingUp } from 'lucide-react';

const stats = [
  {
    label: 'Total Verses',
    arabicLabel: 'إجمالي الآيات',
    value: '6,236',
    icon: BookOpen,
    color: 'bg-primary/10 text-primary border-primary/20',
    subtext: 'Active Quran Verses',
    href: '/admin/verses',
  },
  {
    label: 'Total Surahs',
    arabicLabel: 'إجمالي السور',
    value: '114',
    icon: Book,
    color: 'bg-secondary/10 text-secondary border-secondary/20',
    subtext: 'Complete Surahs List',
    href: '/admin/surahs',
  },
  {
    label: 'Articles',
    arabicLabel: 'المقالات',
    value: '0',
    icon: FileText,
    color: 'bg-primary/10 text-primary border-primary/20',
    subtext: 'Published Knowledge',
    href: '/admin/articles',
  },
  {
    label: 'Videos',
    arabicLabel: 'الفيديوهات',
    value: '0',
    icon: Video,
    color: 'bg-secondary/10 text-secondary border-secondary/20',
    subtext: 'Linked Video Links',
    href: '/admin/videos',
  },
];

const quickActions = [
  { label: 'Add Verse', actionText: 'CREATE VERSE', href: '/admin/verses', icon: Plus },
  { label: 'Add Surah', actionText: 'CREATE SURAH', href: '/admin/surahs', icon: Book },
  { label: 'Write Article', actionText: 'WRITE ARTICLE', href: '/admin/articles', icon: FileText },
  { label: 'Add Video Link', actionText: 'ADD URL LINK', href: '/admin/videos', icon: Video },
  { label: 'Categories', actionText: 'MANAGE GROUPS', href: '/admin/categories', icon: FolderTree },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3">
            Admin Dashboard
            <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
              لوحة التحكم
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-1">Overview and content management for AJ Islamic Library</p>
        </div>
      </div>

      {/* Stats Grid - Inspired by PrayerTimeCard design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block group">
            <div
              className={cn(
                'relative flex flex-col justify-between p-5 rounded-xl transition-all duration-150 ease-out select-none',
                'bg-surface-elevated border border-border/40 shadow-sm hover:shadow-md hover:border-primary/30'
              )}
            >
              {/* Card Header: English label left, Arabic label right */}
              <div className="flex items-center justify-between w-full mb-3 gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  {stat.label}
                </span>
                <span className="font-arabic text-xs font-semibold text-text-muted/80" dir="rtl">
                  {stat.arabicLabel}
                </span>
              </div>

              {/* Card Body: Large count and icon side-by-side */}
              <div className="flex items-center justify-between my-2">
                <span className="text-3xl font-extrabold tracking-tight text-text tabular-nums">
                  {stat.value}
                </span>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>

              {/* Card Footer: Subtext */}
              <div className="mt-2 pt-2 border-t border-border/10 flex items-center justify-between">
                <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                  {stat.subtext}
                </span>
                <span className="text-[10px] text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Panel - Inspired by MethodControls grid */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <span>Quick Actions</span>
            <span className="font-arabic text-primary text-sm font-medium select-none" dir="rtl">
              إجراءات سريعة
            </span>
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href} className="group block">
                <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-border/40 bg-background/30 hover:bg-surface-hover hover:border-primary/40 transition-all duration-150 text-center h-full cursor-pointer select-none">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-150">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-text group-hover:text-primary transition-colors duration-150">
                    {action.label}
                  </span>
                  <span className="text-[9px] text-text-muted mt-1.5 uppercase tracking-widest font-semibold">
                    {action.actionText}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Panel */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <span>Recent Activity</span>
            <span className="font-arabic text-primary text-sm font-medium select-none" dir="rtl">
              النشاطات الأخيرة
            </span>
          </h2>
        </CardHeader>
        <CardContent className="p-8 text-center text-text-muted">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary animate-pulse" />
          <p className="text-base font-semibold text-text">No Recent Activity</p>
          <p className="text-xs mt-1 max-w-sm mx-auto">Database is in synced state. Start managing content to see live system audit logs here.</p>
        </CardContent>
      </Card>
    </div>
  );
}