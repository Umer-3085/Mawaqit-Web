'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, Plus, Search, Edit2, Trash2, FileText, FolderOpen, Layers } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { apiClient } from '@/api';
import type { ArticleVideo, Category, SubCategory } from '@/types/admin-content';

type ArticleModalState = { mode: 'create' } | { mode: 'edit'; article: ArticleVideo } | null;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

export default function AdminArticlesPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<number | 'all'>('all');
  const [articleModal, setArticleModal] = useState<ArticleModalState>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArticleVideo | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    data: articleData,
    error: articlesError,
    isLoading: articlesLoading,
    mutate: mutateArticles,
  } = useSWR(
    ['admin-articles', categoryFilter, subCategoryFilter],
    () =>
      apiClient.getArticlesVideos({
        page_size: 100,
        type: 'article',
        category_id: categoryFilter === 'all' ? undefined : categoryFilter,
        subcategory_id: subCategoryFilter === 'all' ? undefined : subCategoryFilter,
      })
  );

  const {
    data: categoryData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useSWR('admin-categories', () => apiClient.getCategories({ page_size: 100 }));

  const {
    data: subCategoryData,
    isLoading: subCategoriesLoading,
  } = useSWR('admin-subcategories', () => apiClient.getSubcategories({ page_size: 100 }));

  const articles = articleData?.items ?? [];
  const categories = categoryData?.items ?? [];
  const subCategories = subCategoryData?.items ?? [];

  const categoryNameById = (id: number): string =>
    categories.find((c) => c.id === id)?.title ?? `Category #${id}`;
  const subCategoryNameById = (id: number | null): string | null => {
    if (id === null) return null;
    return subCategories.find((sc) => sc.id === id)?.title ?? `Subcategory #${id}`;
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.detail ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const subCategoriesOfFilteredCategory = categoryFilter === 'all'
    ? subCategories
    : subCategories.filter((sc) => sc.category_id === categoryFilter);

  const handleDelete = async (article: ArticleVideo) => {
    setDeleting(true);
    setActionError(null);
    try {
      await apiClient.deleteArticleVideo(article.id);
      await mutateArticles();
      setDeleteTarget(null);
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const handleCategoryFilterChange = (value: number | 'all') => {
    setCategoryFilter(value);
    setSubCategoryFilter('all');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
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
                Articles
              </span>
              <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
                المقالات
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Create and manage articles tagged with categories and subcategories
            </p>
          </div>
          <Button
            className="gap-2 self-start sm:self-auto bg-primary text-white hover:bg-primary-hover"
            onClick={() => setArticleModal({ mode: 'create' })}
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </Button>
        </div>
      </div>

      {(articlesError || categoriesError) && (
        <ErrorAlert
          message="Failed to load articles. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      {actionError && (
        <ErrorAlert message={actionError} title="Action Failed" onDismiss={() => setActionError(null)} />
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search articles by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <Select
          label="Category"
          placeholder="All categories..."
          options={categories.map((c) => ({ value: c.id, label: c.title }))}
          value={categoryFilter === 'all' ? '' : String(categoryFilter)}
          onChange={(v) => handleCategoryFilterChange(v ? Number(v) : 'all')}
        />
        <Select
          label="Subcategory"
          placeholder="All subcategories..."
          options={subCategoriesOfFilteredCategory.map((sc) => ({ value: sc.id, label: sc.title }))}
          value={subCategoryFilter === 'all' ? '' : String(subCategoryFilter)}
          onChange={(v) => setSubCategoryFilter(v ? Number(v) : 'all')}
        />
      </div>

      {/* Articles List */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            All Articles ({articles.length})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {articlesLoading || categoriesLoading || subCategoriesLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary" />
              <p className="text-base font-semibold text-text">No articles found</p>
              <p className="text-xs mt-1">Write your first article to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-surface-hover/30 transition-colors"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-text">{article.title}</span>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold inline-flex items-center gap-1">
                          <FolderOpen className="w-3 h-3" />
                          {categoryNameById(article.category_id)}
                        </span>
                        {subCategoryNameById(article.subcategory_id) && (
                          <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/20 text-[10px] font-bold inline-flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {subCategoryNameById(article.subcategory_id)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary mt-1.5 line-clamp-2">{article.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-text hover:text-primary hover:bg-surface transition-colors"
                      onClick={() => setArticleModal({ mode: 'edit', article })}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleting}
                      className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-error hover:bg-error/5 hover:border-error/30 transition-colors"
                      onClick={() => setDeleteTarget(article)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Article Modal */}
      <ArticleModal
        state={articleModal}
        categories={categories}
        subCategories={subCategories}
        onClose={() => setArticleModal(null)}
        onSaved={() => {
          setArticleModal(null);
          mutateArticles();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget);
        }}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

interface ArticleModalProps {
  state: ArticleModalState;
  categories: Category[];
  subCategories: SubCategory[];
  onClose: () => void;
  onSaved: () => void;
}

function ArticleModal({ state, categories, subCategories, onClose, onSaved }: ArticleModalProps) {
  return (
    <Modal
      open={!!state}
      onClose={onClose}
      title={state?.mode === 'edit' ? 'Edit Article' : 'Write Article'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="article-form" className="bg-primary text-white hover:bg-primary-hover">
            {state?.mode === 'edit' ? 'Save Changes' : 'Publish Article'}
          </Button>
        </>
      }
    >
      {state && (
        <ArticleFormContent
          key={state.mode === 'edit' ? `edit-${state.article.id}` : 'create'}
          state={state}
          categories={categories}
          subCategories={subCategories}
          onSaved={onSaved}
        />
      )}
    </Modal>
  );
}

function ArticleFormContent({
  state,
  categories,
  subCategories,
  onSaved,
}: {
  state: Exclude<ArticleModalState, null>;
  categories: Category[];
  subCategories: SubCategory[];
  onSaved: () => void;
}) {
  const isEdit = state.mode === 'edit';
  const [title, setTitle] = useState(isEdit ? state.article.title : '');
  const [detail, setDetail] = useState(isEdit ? (state.article.detail ?? '') : '');
  const [categoryId, setCategoryId] = useState<number | null>(isEdit ? state.article.category_id : null);
  const [subcategoryId, setSubcategoryId] = useState<number | null>(
    isEdit ? (state.article.subcategory_id ?? null) : null
  );
  const [error, setError] = useState<string | null>(null);

  const subCategoriesOfCategory = subCategories.filter((sc) => sc.category_id === categoryId);

  const handleCategoryChange = (v: number) => {
    setCategoryId(Number(v));
    setSubcategoryId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;
    setError(null);
    try {
      if (isEdit) {
        await apiClient.updateArticleVideo(state.article.id, {
          title: title.trim(),
          detail: detail.trim() || undefined,
          category_id: categoryId,
          subcategory_id: subcategoryId,
        });
      } else {
        await apiClient.createArticleVideo({
          title: title.trim(),
          detail: detail.trim() || undefined,
          category_id: categoryId,
          subcategory_id: subcategoryId,
        });
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form id="article-form" onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Article Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="e.g. The Virtues of Fasting in Ramadan"
        autoFocus
      />
      <div>
        <label className="block text-xs font-semibold text-text-secondary mb-1.5" htmlFor="article-detail">
          Content
        </label>
        <textarea
          id="article-detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          rows={6}
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
          placeholder="Write the article content here..."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          placeholder="Select a category..."
          options={categories.map((c) => ({ value: c.id, label: c.title }))}
          value={categoryId ? String(categoryId) : ''}
          onChange={handleCategoryChange}
          required
        />
        <Select
          label="Subcategory (optional)"
          placeholder="Select a subcategory..."
          options={subCategoriesOfCategory.map((sc) => ({ value: sc.id, label: sc.title }))}
          value={subcategoryId ? String(subcategoryId) : ''}
          onChange={(v) => setSubcategoryId(v ? Number(v) : null)}
          disabled={!categoryId || subCategoriesOfCategory.length === 0}
        />
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}