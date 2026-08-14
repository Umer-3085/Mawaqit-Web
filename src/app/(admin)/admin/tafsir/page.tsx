'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, Plus, Edit2, Trash2, BookOpenText, ScrollText } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { VerseContentEditor } from '@/components/admin/VerseContentEditor';
import { apiClient, classifyEditionTypes } from '@/api';
import type { EditionType, TranslationTafseerDetail, Surah } from '@/types/admin-content';

type EditionModalState =
  | { mode: 'create' }
  | { mode: 'edit'; edition: TranslationTafseerDetail }
  | null;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

export default function AdminTafsirPage() {
  const [editionId, setEditionId] = useState<number | null>(null);
  const [surahNumber, setSurahNumber] = useState<number | null>(null);
  const [editionTypes, setEditionTypes] = useState<Map<number, EditionType | null>>(new Map());
  const [editionModal, setEditionModal] = useState<EditionModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<TranslationTafseerDetail | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: editions,
    error: editionsError,
    isLoading: editionsLoading,
    mutate: mutateEditions,
  } = useSWR('admin-tafsir-editions', () => apiClient.getTranslationTafseerDetails({ page_size: 100 }));

  const allDetails = useMemo(() => editions?.items ?? [], [editions]);

  useEffect(() => {
    if (!allDetails.length) return;
    let cancelled = false;
    classifyEditionTypes(allDetails).then((types) => {
      if (!cancelled) setEditionTypes(types);
    });
    return () => {
      cancelled = true;
    };
  }, [allDetails]);

  const tafsirEditions = allDetails.filter((d) => editionTypes.get(d.id) === 'tafsir');
  const { data: surahs, error: surahsError } = useSWR('admin-surahs-all', () =>
    apiClient.getSurahsAll()
  );

  const selectedSurah = surahs?.find((s: Surah) => s.surah_number === surahNumber);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError(null);
    try {
      await apiClient.deleteTranslationTafseerDetail(deleteTarget.id);
      if (editionId === deleteTarget.id) {
        setEditionId(null);
        setSurahNumber(null);
      }
      await mutateEditions();
      setDeleteTarget(null);
    } catch (error) {
      setActionError(getErrorMessage(error));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

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
                Tafsir Management
              </span>
              <span className="font-arabic text-primary text-xl font-semibold select-none" dir="rtl">
                إدارة التفاسير
              </span>
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Manage tafsir editions and edit verse tafsir in-place
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              size="sm"
              className="gap-2 bg-primary text-white hover:bg-primary-hover"
              onClick={() => setEditionModal({ mode: 'create' })}
            >
              <Plus className="w-4 h-4" />
              <span>Add Tafsir</span>
            </Button>
          </div>
        </div>
      </div>

      {(editionsError || surahsError) && (
        <ErrorAlert
          message="Failed to load tafsir data. Make sure the API server is running."
          title="Loading Error"
        />
      )}

      {actionError && (
        <ErrorAlert message={actionError} title="Action Failed" onDismiss={() => setActionError(null)} />
      )}

      {/* Editions List */}
      <Card className="bg-surface-elevated border border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-secondary" />
            Tafsir Editions ({tafsirEditions.length})
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {editionsLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : tafsirEditions.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <BookOpenText className="w-10 h-10 mx-auto mb-3 opacity-40 text-secondary" />
              <p className="text-base font-semibold text-text">No tafsir editions found</p>
              <p className="text-xs mt-1">Create a tafsir edition to start adding verse content.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {tafsirEditions.map((edition) => (
                <div
                  key={edition.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-hover/30 transition-colors"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary border border-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpenText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-text">{edition.title}</span>
                        <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/20 text-[10px] font-bold">
                          tafsir
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface border border-border/50 text-[10px] text-text-muted font-bold">
                          {edition.lang}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface border border-border/50 text-[10px] text-text-muted font-bold">
                          {edition.author}
                        </span>
                      </div>
                      {edition.description && (
                        <p className="text-sm text-text-secondary mt-1">{edition.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-text hover:text-primary hover:bg-surface transition-colors"
                      onClick={() => setEditionModal({ mode: 'edit', edition })}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleting}
                      className="h-9 w-9 p-0 flex items-center justify-center border-border/60 text-error hover:bg-error/5 hover:border-error/30 transition-colors"
                      onClick={() => setDeleteTarget(edition)}
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

      {/* Verse Content Editor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Tafsir Edition"
          placeholder="Select an edition..."
          options={tafsirEditions.map((d) => ({
            value: d.id,
            label: `${d.title} (${d.lang})`,
          }))}
          value={editionId ? String(editionId) : ''}
          onChange={(v) => {
            setEditionId(Number(v));
            setSurahNumber(null);
          }}
        />
        <Select
          label="Surah"
          placeholder="Select a surah..."
          options={(surahs ?? []).map((s: Surah) => ({
            value: s.surah_number,
            label: `${s.surah_number}. ${s.english_name} — ${s.name_arabic}`,
          }))}
          value={surahNumber ? String(surahNumber) : ''}
          onChange={(v) => setSurahNumber(Number(v))}
          disabled={!editionId}
        />
      </div>

      {editionId && surahNumber && selectedSurah ? (
        <VerseContentEditor
          key={`${editionId}-${surahNumber}`}
          editionId={editionId}
          surah={selectedSurah}
          field="verse_tafseer"
          badgeClass="bg-secondary/15 text-secondary border-secondary/20"
          placeholder="Enter tafsir for this verse..."
          onSaved={() => mutateEditions()}
        />
      ) : (
        <Card className="bg-surface-elevated border border-border/40 shadow-sm">
          <CardContent className="p-12 text-center text-text-muted">
            <BookOpenText className="w-10 h-10 mx-auto mb-3 opacity-40 text-secondary" />
            <p className="text-base font-semibold text-text">Select an edition and surah</p>
            <p className="text-xs mt-1">Pick a tafsir edition and a surah to edit its verse tafsir</p>
          </CardContent>
        </Card>
      )}

      {/* Edition Modal */}
      <EditionModal
        state={editionModal}
        onClose={() => setEditionModal(null)}
        onSaved={() => {
          setEditionModal(null);
          mutateEditions();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Tafsir Edition"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone. Editions that still have verse content cannot be deleted.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

interface EditionModalProps {
  state: EditionModalState;
  onClose: () => void;
  onSaved: () => void;
}

function EditionModal({ state, onClose, onSaved }: EditionModalProps) {
  return (
    <Modal
      open={!!state}
      onClose={onClose}
      title={state?.mode === 'edit' ? 'Edit Tafsir Edition' : 'Add Tafsir Edition'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edition-form" className="bg-primary text-white hover:bg-primary-hover">
            {state?.mode === 'edit' ? 'Save Changes' : 'Create Edition'}
          </Button>
        </>
      }
    >
      {state && (
        <EditionFormContent
          key={state.mode === 'edit' ? `edit-${state.edition.id}` : 'create'}
          state={state}
          onSaved={onSaved}
        />
      )}
    </Modal>
  );
}

function EditionFormContent({
  state,
  onSaved,
}: {
  state: Exclude<EditionModalState, null>;
  onSaved: () => void;
}) {
  const isEdit = state.mode === 'edit';
  const [title, setTitle] = useState(isEdit ? state.edition.title : '');
  const [lang, setLang] = useState(isEdit ? state.edition.lang : '');
  const [author, setAuthor] = useState(isEdit ? state.edition.author : '');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(
    isEdit ? (state.edition.direction ?? 'ltr') : 'ltr'
  );
  const [description, setDescription] = useState(isEdit ? (state.edition.description ?? '') : '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || lang.trim().length !== 2 || !author.trim()) return;
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        lang: lang.trim().toLowerCase(),
        author: author.trim(),
        direction,
        description: description.trim() || undefined,
      };
      if (isEdit) {
        await apiClient.updateTranslationTafseerDetail(state.edition.id, payload);
      } else {
        await apiClient.createTranslationTafseerDetail(payload);
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form id="edition-form" onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="e.g. Tafseer Al-Muyassar"
        autoFocus
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Language Code"
          type="text"
          value={lang}
          onChange={(e) => setLang(e.target.value.toLowerCase().slice(0, 2))}
          required
          maxLength={2}
          placeholder="e.g. ar"
        />
        <Select
          label="Direction"
          placeholder="Select direction..."
          options={[
            { value: 'ltr', label: 'Left to Right (LTR)' },
            { value: 'rtl', label: 'Right to Left (RTL)' },
          ]}
          value={direction}
          onChange={(v) => setDirection(v as 'ltr' | 'rtl')}
        />
      </div>
      <Input
        label="Author"
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        placeholder="e.g. Ministry of Islamic Affairs"
      />
      <Input
        label="Description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description"
      />
      {lang && lang.length !== 2 && (
        <p className="text-xs text-error font-medium" role="alert">
          Language code must be exactly 2 characters (e.g. en, ar, ur).
        </p>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}