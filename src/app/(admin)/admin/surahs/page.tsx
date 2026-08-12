'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

const initialSurahs = [
  { id: 1, number: 1, name: 'Al-Fatihah', arabicName: 'الفاتحة', revelationType: 'Meccan', versesCount: 7 },
  { id: 2, number: 2, name: 'Al-Baqarah', arabicName: 'البقرة', revelationType: 'Medinan', versesCount: 286 },
  { id: 3, number: 3, name: 'Ali \'Imran', arabicName: 'آل عمران', revelationType: 'Medinan', versesCount: 200 },
];

export default function AdminSurahsPage() {
  const [search, setSearch] = useState('');

  const filteredSurahs = initialSurahs.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.arabicName.includes(search) ||
      s.number.toString().includes(search)
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
                Surahs Management
              </span>
              <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
                إدارة السور
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">Manage Surah information, metadata and ordering</p>
          </div>
          <Button className="gap-2 self-start sm:self-auto bg-primary text-white hover:bg-primary-hover">
            <Plus className="w-4 h-4" />
            <span>Add Surah</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search surahs by name, Arabic name or number..."
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
            Surahs ({filteredSurahs.length})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {filteredSurahs.map((surah) => (
              <div key={surah.id} className="p-5 flex items-center justify-between gap-4 hover:bg-surface-hover/30 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Number badge */}
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-mono text-sm">
                    {surah.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text">{surah.name}</span>
                      <span className="font-arabic font-bold text-primary" dir="rtl">{surah.arabicName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-muted">{surah.revelationType} Revelation</span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-muted">{surah.versesCount} Verses</span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-text hover:text-primary hover:bg-surface transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-error hover:bg-error/5 hover:border-error/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredSurahs.length === 0 && (
              <div className="py-12 text-center text-text-muted">
                No surahs found matching search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
