'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Plus, BookOpen, Book, FileText, Video, FolderTree, Users, TrendingUp } from 'lucide-react';

const stats = [
  {
    label: 'Total Verses',
    value: '6,236',
    icon: BookOpen,
    color: 'bg-primary/10 text-primary',
    href: '/admin/verses',
  },
  {
    label: 'Total Surahs',
    value: '114',
    icon: Book,
    color: 'bg-blue/10 text-blue-600',
    href: '/admin/surahs',
  },
  {
    label: 'Articles',
    value: '0',
    icon: FileText,
    color: 'bg-green/10 text-green-600',
    href: '/admin/articles',
  },
  {
    label: 'Videos',
    value: '0',
    icon: Video,
    color: 'bg-purple/10 text-purple-600',
    href: '/admin/videos',
  },
];

const quickActions = [
  { label: 'Add Verse', href: '/admin/verses/create', icon: Plus },
  { label: 'Add Surah', href: '/admin/surahs/create', icon: Book },
  { label: 'Write Article', href: '/admin/articles/create', icon: FileText },
  { label: 'Upload Video', href: '/admin/videos/create', icon: Video },
  { label: 'Manage Categories', href: '/admin/categories', icon: FolderTree },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-text-muted mt-1">Overview of your content management</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">{stat.label}</p>
                    <p className="text-3xl font-bold text-text mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Button variant="outline" size="sm" className="gap-2">
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text">Recent Activity</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-text-muted">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No recent activity</p>
            <p className="text-sm mt-1">Start managing content to see activity here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}