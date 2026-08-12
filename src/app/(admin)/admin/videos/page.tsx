'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Edit2, Trash2, Video, Globe, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const initialVideos = [
  { id: 1, title: 'Introduction to Quranic Grammar', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'Language', date: '2026-08-01' },
  { id: 2, title: 'Detailed Prayer Tutorial (Salat Steps)', url: 'https://vimeo.com/123456789', category: 'Fiqh', date: '2026-08-05' },
];

export default function AdminVideosPage() {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [videos, setVideos] = useState(initialVideos);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newVideo = {
      id: Date.now(),
      title: newTitle,
      url: newUrl,
      category: newCategory,
      date: new Date().toISOString().split('T')[0] ?? '2026-08-13',
    };

    setVideos([newVideo, ...videos]);
    setNewTitle('');
    setNewUrl('');
    setShowAddForm(false);
  };

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.url.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
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
              Video Links Management
              <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
                إدارة روابط الفيديو
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">Manage external video URL links integrated within library content</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="gap-2 self-start sm:self-auto bg-primary text-white hover:bg-primary-hover"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Hide Panel' : 'Add Video Link'}</span>
          </Button>
        </div>
      </div>

      {/* Info Notice about URL linking */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 text-sm text-text-secondary">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-primary">Video Upload Notice:</span> Videos are not uploaded to the server to preserve bandwidth and storage. Simply paste links (URLs) from external services such as YouTube, Vimeo, or internet archives.
        </div>
      </div>

      {/* Add Video Form (if shown) */}
      {showAddForm && (
        <Card className="bg-surface-elevated border border-primary/20 shadow-md animate-fade-in-down">
          <CardHeader className="border-b border-border/40 px-6 py-4">
            <h2 className="text-base font-bold text-text">Link a New Video</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleAddVideo} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Quranic Grammar"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Video URL (YouTube, Vimeo, etc.)</label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                >
                  <option value="General">General</option>
                  <option value="Tafsir">Tafsir</option>
                  <option value="Fiqh">Fiqh</option>
                  <option value="Language">Language</option>
                </select>
              </div>
              <div className="flex gap-2.5 pt-2">
                <Button type="submit" className="bg-primary text-white hover:bg-primary-hover">
                  Add Link
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search videos by title, URL or category..."
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
            Video Links ({filteredVideos.length})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {filteredVideos.map((video) => (
              <div key={video.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-hover/30 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {video.category}
                    </span>
                    <span className="text-text-muted text-[10px]">•</span>
                    <span className="text-xs text-text-muted">Added: {video.date}</span>
                  </div>
                  <h3 className="font-semibold text-text text-base flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{video.title}</span>
                  </h3>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-secondary-hover underline break-all mt-1"
                  >
                    <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{video.url}</span>
                  </a>
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
            {filteredVideos.length === 0 && (
              <div className="py-12 text-center text-text-muted">
                No video links found matching search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
