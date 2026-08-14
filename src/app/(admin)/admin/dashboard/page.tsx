'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import useSWR from 'swr';
import { cn } from '@/components/ui/utils';
import { apiClient } from '@/api';
import { BookOpen, Book, Languages, BookOpenText, FileText, Video, FolderTree, Layers, TrendingUp } from 'lucide-react';

const staticStats = [
  {
    label: 'Total Surahs',
    arabicLabel: 'إجمالي السور',
    value: '114',
    icon: Book,
    cardClass: 'bg-ivory/5 ring-2 ring-ivory border-ivory/40 shadow-md hover:bg-ivory/10',
    iconClass: 'bg-secondary/15 text-secondary border-secondary/20',
    subtext: 'Complete Surahs List',
    href: '/admin/surahs',
  },
  {
    label: 'Total Verses',
    arabicLabel: 'إجمالي الآيات',
    value: '6,236',
    icon: BookOpen,
    cardClass: 'ring-2 ring-lime/20 border-lime/30 bg-surface-elevated hover:bg-surface-hover/30',
    iconClass: 'bg-primary/10 text-primary border-primary/20',
    subtext: 'Active Quran Verses',
    href: '/admin/verses',
  },
  {
    label: 'Translations',
    arabicLabel: 'الترجمات',
    value: '32',
    icon: Languages,
    cardClass: 'ring-2 ring-lime/20 border-lime/30 bg-surface-elevated hover:bg-surface-hover/30',
    iconClass: 'bg-primary/10 text-primary border-primary/20',
    subtext: 'Translation Editions',
    href: '/admin/translations',
  },
  {
    label: 'Tafsir',
    arabicLabel: 'التفاسير',
    value: '6',
    icon: BookOpenText,
    cardClass: 'bg-ivory/5 ring-2 ring-ivory border-ivory/40 shadow-md hover:bg-ivory/10',
    iconClass: 'bg-secondary/15 text-secondary border-secondary/20',
    subtext: 'Tafsir Editions',
    href: '/admin/tafsir',
  },
];

const quickActions = [
  { label: 'Browse Surahs', actionText: 'VIEW SURAHS', href: '/admin/surahs', icon: Book },
  { label: 'Browse Verses', actionText: 'VIEW VERSES', href: '/admin/verses', icon: BookOpen },
  { label: 'Manage Translations', actionText: 'MANAGE TRANSLATIONS', href: '/admin/translations', icon: Languages },
  { label: 'Add Tafsir', actionText: 'ADD TAFSIR', href: '/admin/tafsir', icon: BookOpenText },
  { label: 'Write Article', actionText: 'WRITE ARTICLE', href: '/admin/articles', icon: FileText },
  { label: 'Add Video Link', actionText: 'ADD URL LINK', href: '/admin/videos', icon: Video },
  { label: 'Categories', actionText: 'MANAGE GROUPS', href: '/admin/categories', icon: FolderTree },
];

export default function AdminDashboardPage() {
  const { data: categoryData } = useSWR('admin-dashboard-categories', () =>
    apiClient.getCategories({ page_size: 1 })
  );
  const { data: subCategoryData } = useSWR('admin-dashboard-subcategories', () =>
    apiClient.getSubcategories({ page_size: 1 })
  );
  const { data: articleData } = useSWR('admin-dashboard-articles', () =>
    apiClient.getArticlesVideos({ type: 'article', page_size: 1 })
  );
  const { data: videoData } = useSWR('admin-dashboard-videos', () =>
    apiClient.getArticlesVideos({ type: 'video', page_size: 1 })
  );

  const liveStats = [
    {
      label: 'Categories',
      arabicLabel: 'التصنيفات',
      value: categoryData?.total?.toLocaleString() ?? '—',
      icon: FolderTree,
      cardClass: 'ring-2 ring-lime/20 border-lime/30 bg-surface-elevated hover:bg-surface-hover/30',
      iconClass: 'bg-primary/10 text-primary border-primary/20',
      subtext: 'Content Groups',
      href: '/admin/categories',
    },
    {
      label: 'Subcategories',
      arabicLabel: 'التصنيفات الفرعية',
      value: subCategoryData?.total?.toLocaleString() ?? '—',
      icon: Layers,
      cardClass: 'bg-ivory/5 ring-2 ring-ivory border-ivory/40 shadow-md hover:bg-ivory/10',
      iconClass: 'bg-secondary/15 text-secondary border-secondary/20',
      subtext: 'Sub Groups',
      href: '/admin/categories',
    },
    {
      label: 'Articles',
      arabicLabel: 'المقالات',
      value: articleData?.total?.toLocaleString() ?? '—',
      icon: FileText,
      cardClass: 'ring-2 ring-lime/20 border-lime/30 bg-surface-elevated hover:bg-surface-hover/30',
      iconClass: 'bg-primary/10 text-primary border-primary/20',
      subtext: 'Published Knowledge',
      href: '/admin/articles',
    },
    {
      label: 'Videos',
      arabicLabel: 'الفيديوهات',
      value: videoData?.total?.toLocaleString() ?? '—',
      icon: Video,
      cardClass: 'bg-ivory/5 ring-2 ring-ivory border-ivory/40 shadow-md hover:bg-ivory/10',
      iconClass: 'bg-secondary/15 text-secondary border-secondary/20',
      subtext: 'Linked Video Links',
      href: '/admin/videos',
    },
  ];

  const stats = [...staticStats, ...liveStats];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3">
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              Admin Dashboard
            </span>
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
                stat.cardClass
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
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', stat.iconClass)}>
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
      <Card className="bg-surface-elevated border border-lime/30 ring-2 ring-lime/20 shadow-md">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <span>Quick Actions</span>
            <span className="font-arabic text-primary text-sm font-medium select-none" dir="rtl">
              إجراءات سريعة
            </span>
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      <Card className="bg-surface-elevated border border-ivory/40 ring-2 ring-ivory/20 shadow-md">
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