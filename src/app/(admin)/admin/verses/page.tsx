'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

const initialVerses = [
  { id: 1, surah: 1, verseNumber: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
  { id: 2, surah: 1, verseNumber: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: '[All] praise is [due] to Allah, Lord of the worlds -' },
  { id: 3, surah: 1, verseNumber: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'The Entirely Merciful, the Especially Merciful,' },
];

export default function AdminVersesPage() {
  const [search, setSearch] = useState('');

  const filteredVerses = initialVerses.filter(
    (v) =>
      v.text.includes(search) ||
      v.translation.toLowerCase().includes(search.toLowerCase()) ||
      v.surah.toString().includes(search)
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
              Verses Management
              <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
                إدارة الآيات
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">Manage, edit and translate Quranic verses in the library</p>
          </div>
          <Button className="gap-2 self-start sm:self-auto bg-primary text-white hover:bg-primary-hover">
            <Plus className="w-4 h-4" />
            <span>Add Verse</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search verses by Arabic text, translation or Surah number..."
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
            Verses ({filteredVerses.length})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {filteredVerses.map((verse) => (
              <div key={verse.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-hover/30 transition-colors">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-xs font-bold font-mono">
                      Surah {verse.surah} : Verse {verse.verseNumber}
                    </span>
                  </div>
                  {/* Arabic Text */}
                  <p className="font-arabic-classical text-2xl text-text leading-loose text-right md:text-left" dir="rtl">
                    {verse.text}
                  </p>
                  {/* Translation */}
                  <p className="text-sm text-text-secondary italic">
                    {verse.translation}
                  </p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-text hover:text-primary hover:bg-surface transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-error hover:bg-error/5 hover:border-error/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredVerses.length === 0 && (
              <div className="py-12 text-center text-text-muted">
                No verses found matching search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
