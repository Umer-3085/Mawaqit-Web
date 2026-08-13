'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, Plus, Search, Edit2, Trash2, FolderOpen, FolderTree, Layers } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { apiClient } from '@/api';
import type { Category, SubCategory } from '@/types/admin-content';

type CategoryModalState = { mode: 'create' } | { mode: 'edit'; category: Category } | null;
type SubCategoryModalState =
  | { mode: 'create'; defaultCategoryId?: number }
  | { mode: 'edit'; subCategory: SubCategory }
  | null;
type DeleteTarget =
  | { type: 'category'; name: string; entity: Category }
  | { type: 'subcategory'; name: string; entity: SubCategory }
  | null;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState<number | 'all'>('all');
  const [categoryModal, setCategoryModal] = useState<CategoryModalState>(null);
  const [subCategoryModal, setSubCategoryModal] = useState<SubCategoryModalState>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    data: categoryData,
    error: categoriesError,
    isLoading: categoriesLoading,
    mutate: mutateCategories,
  } = useSWR('admin-categories', () => apiClient.getCategories({ page_size: 100 }));

  const {
    data: subCategoryData,
    error: subCategoriesError,
    isLoading: subCategoriesLoading,
    mutate: mutateSubCategories,
  } = useSWR('admin-subcategories', () => apiClient.getSubcategories({ page_size: 100 }));

  const categories = categoryData?.items ?? [];
  const subCategories = subCategoryData?.items ?? [];

  const subCountByCategory = new Map<number, number>();
  subCategories.forEach((sc) => {
    subCountByCategory.set(sc.category_id, (subCountByCategory.get(sc.category_id) ?? 0) + 1);
  });

  const filteredCategories = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredSubCategories = subCategories.filter(
    (sc) => {
      const matchesFilter = subCategoryFilter === 'all' || sc.category_id === subCategoryFilter;
      const matchesSearch =
        sc.title.toLowerCase().includes(search.toLowerCase()) ||
        (sc.description ?? '').toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    }
  );

  const categoryNameById = (id: number): string =>
    categories.find((c) => c.id === id)?.title ?? `Category #${id}`;

  const handleDeleteCategory = async (category: Category) => {
    setDeleting(true);
    setActionError(null);
    try {
      await apiClient.deleteCategory(category.id);
      await Promise.all([mutateCategories(), mutateSubCategories()]);
      setDeleteTarget(null);
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSubCategory = async (subCategory: SubCategory) => {
    setDeleting(true);
    setActionError(null);
    try {
      await apiClient.deleteSubcategory(subCategory.id);
      await Promise.all([mutateSubCategories(), mutateCategories()]);
      setDeleteTarget(null);
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') handleDeleteCategory(deleteTarget.entity);
    else handleDeleteSubCategory(deleteTarget.entity);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-x-8 gap-y-3 pb-4 border-b border-border/40">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-x-3 gap-y-1 flex-wrap">
              <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                Categories & Subcategories
              </span>
              <span className="font-arabic text-primary text-lg font-semibold select-none whitespace-nowrap" dir="rtl">
                التصنيفات والتصنيفات الفرعية
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1.5">
              Organize articles and videos with categories and their subcategories
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              size="sm"
              className="gap-2 bg-primary text-white hover:bg-primary-hover"
              onClick={() => setCategoryModal({ mode: 'create' })}
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setSubCategoryModal({ mode: 'create' })}
            >
              <Plus className="w-4 h-4" />
              <span>Add Subcategory</span>
            </Button>
          </div>
        </div>
      </div>

      {(categoriesError || subCategoriesError) && (
        <ErrorAlert
          message="Failed to load categories. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      {actionError && (
        <ErrorAlert message={actionError} title="Action Failed" onDismiss={() => setActionError(null)} />
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search categories or subcategories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Categories Section */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4 flex flex-row items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-primary" />
            Categories ({categories.length})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {categoriesLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary" />
              <p className="text-base font-semibold text-text">No categories found</p>
              <p className="text-xs mt-1">Create a category to start organizing content.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-hover/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text">{category.title}</span>
                        <span className="px-2 py-0.5 rounded bg-surface border border-border/50 text-[10px] text-text-muted font-bold">
                          {subCountByCategory.get(category.id) ?? 0} subcategories
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-text hover:text-primary hover:bg-surface transition-colors"
                      onClick={() => setCategoryModal({ mode: 'edit', category })}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleting}
                      className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-error hover:bg-error/5 hover:border-error/30 transition-colors"
                      onClick={() =>
                        setDeleteTarget({ type: 'category', name: category.title, entity: category })
                      }
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

      {/* Subcategories Section */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4 flex flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Layers className="w-4 h-4 text-secondary" />
            Subcategories ({subCategories.length})
          </h2>
          <div className="w-64">
            <Select
              label="Filter by Category"
              placeholder="All categories..."
              options={[
                ...categories.map((c) => ({ value: c.id, label: c.title })),
              ]}
              value={subCategoryFilter === 'all' ? '' : String(subCategoryFilter)}
              onChange={(v) => setSubCategoryFilter(v ? Number(v) : 'all')}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {subCategoriesLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredSubCategories.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <Layers className="w-10 h-10 mx-auto mb-3 opacity-40 text-secondary" />
              <p className="text-base font-semibold text-text">No subcategories found</p>
              <p className="text-xs mt-1">
                Add subcategories to organize content under each category.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredSubCategories.map((subCategory) => (
                <div
                  key={subCategory.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-hover/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary border border-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text">{subCategory.title}</span>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold">
                          {categoryNameById(subCategory.category_id)}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{subCategory.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-text hover:text-primary hover:bg-surface transition-colors"
                      onClick={() => setSubCategoryModal({ mode: 'edit', subCategory })}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleting}
                      className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-error hover:bg-error/5 hover:border-error/30 transition-colors"
                      onClick={() =>
                        setDeleteTarget({ type: 'subcategory', name: subCategory.title, entity: subCategory })
                      }
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

      {/* Category Modal */}
      <CategoryModal
        state={categoryModal}
        onClose={() => setCategoryModal(null)}
        onSaved={() => {
          setCategoryModal(null);
          mutateCategories();
          mutateSubCategories();
        }}
      />

      {/* Subcategory Modal */}
      <SubCategoryModal
        state={subCategoryModal}
        categories={categories}
        onClose={() => setSubCategoryModal(null)}
        onSaved={() => {
          setSubCategoryModal(null);
          mutateSubCategories();
          mutateCategories();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.type === 'subcategory' ? 'Subcategory' : 'Category'}`}
        message={
          deleteTarget?.type === 'category'
            ? `Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone. Content attached to it may prevent deletion.`
            : `Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

interface CategoryModalProps {
  state: CategoryModalState;
  onClose: () => void;
  onSaved: () => void;
}

function CategoryModal({ state, onClose, onSaved }: CategoryModalProps) {
  return (
    <Modal
      open={!!state}
      onClose={onClose}
      title={state?.mode === 'edit' ? 'Edit Category' : 'Create Category'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="category-form"
            className="bg-primary text-white hover:bg-primary-hover"
          >
            {state?.mode === 'edit' ? 'Save Changes' : 'Create Category'}
          </Button>
        </>
      }
    >
      {state && (
        <CategoryFormContent
          key={state.mode === 'edit' ? `edit-${state.category.id}` : 'create'}
          state={state}
          onSaved={onSaved}
        />
      )}
    </Modal>
  );
}

function CategoryFormContent({
  state,
  onSaved,
}: {
  state: Exclude<CategoryModalState, null>;
  onSaved: () => void;
}) {
  const isEdit = state.mode === 'edit';
  const [title, setTitle] = useState(isEdit ? state.category.title : '');
  const [description, setDescription] = useState(isEdit ? (state.category.description ?? '') : '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError(null);
    try {
      if (isEdit) {
        await apiClient.updateCategory(state.category.id, { title: title.trim(), description: description.trim() || undefined });
      } else {
        await apiClient.createCategory({ title: title.trim(), description: description.trim() || undefined });
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="e.g. Tafsir"
        autoFocus
      />
      <Input
        label="Description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g. Exegesis and explanations of Quranic verses"
      />
      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}

interface SubCategoryModalProps {
  state: SubCategoryModalState;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

function SubCategoryModal({ state, categories, onClose, onSaved }: SubCategoryModalProps) {
  return (
    <Modal
      open={!!state}
      onClose={onClose}
      title={state?.mode === 'edit' ? 'Edit Subcategory' : 'Create Subcategory'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="subcategory-form" className="bg-primary text-white hover:bg-primary-hover">
            {state?.mode === 'edit' ? 'Save Changes' : 'Create Subcategory'}
          </Button>
        </>
      }
    >
      {state && (
        <SubCategoryFormContent
          key={state.mode === 'edit' ? `edit-${state.subCategory.id}` : 'create'}
          state={state}
          categories={categories}
          onSaved={onSaved}
        />
      )}
    </Modal>
  );
}

function SubCategoryFormContent({
  state,
  categories,
  onSaved,
}: {
  state: Exclude<SubCategoryModalState, null>;
  categories: Category[];
  onSaved: () => void;
}) {
  const isEdit = state.mode === 'edit';
  const [title, setTitle] = useState(isEdit ? state.subCategory.title : '');
  const [categoryId, setCategoryId] = useState<number | null>(
    isEdit ? state.subCategory.category_id : (state.defaultCategoryId ?? null)
  );
  const [description, setDescription] = useState(isEdit ? (state.subCategory.description ?? '') : '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;
    setError(null);
    try {
      if (isEdit) {
        await apiClient.updateSubcategory(state.subCategory.id, {
          title: title.trim(),
          category_id: categoryId,
          description: description.trim() || undefined,
        });
      } else {
        await apiClient.createSubcategory({
          title: title.trim(),
          category_id: categoryId,
          description: description.trim() || undefined,
        });
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form id="subcategory-form" onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Subcategory Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="e.g. Tafseer Al-Muyassar"
        autoFocus
      />
      <Select
        label="Parent Category"
        placeholder="Select a category..."
        options={categories.map((c) => ({ value: c.id, label: c.title }))}
        value={categoryId ? String(categoryId) : ''}
        onChange={(v) => setCategoryId(Number(v))}
        required
      />
      <Input
        label="Description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description"
      />
      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
