import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '../../../../lib/api';
import { PageContainer } from '@/components/layout/PageContainer';
import { CategoryDetailClient } from '@/components/library/CategoryDetailClient';
import type { Category } from '@/types/admin-content';

interface PageProps {
  params: Promise<{ category_id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category_id } = await params;
  const id = parseInt(category_id, 10);
  if (isNaN(id) || id < 1) return { title: 'Library — Mawaqit مواقيت' };
  let category: Category | null = null;
  try {
    category = await apiClient.getCategories({ page_size: 100 }).then((d) => d.items.find((c) => c.id === id) ?? null);
  } catch {
    category = null;
  }
  if (!category) return { title: 'Library — Mawaqit مواقيت' };
  return {
    title: `${category.title} — Library | Mawaqit مواقيت`,
    description: category.description ?? `Browse ${category.title} articles and videos.`,
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { category_id } = await params;
  const id = parseInt(category_id, 10);
  if (isNaN(id) || id < 1) notFound();

  let category: Category | null = null;
  let subcategories: Awaited<ReturnType<typeof apiClient.getSubcategories>>['items'] = [];
  let items: Awaited<ReturnType<typeof apiClient.getArticlesVideos>> = { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  try {
    [category, subcategories, items] = await Promise.all([
      apiClient.getCategories({ page_size: 100 }).then((d) => d.items.find((c) => c.id === id) ?? null),
      apiClient.getSubcategories({ category_id: id, page_size: 100 }).then((d) => d.items),
      apiClient.getArticlesVideos({ category_id: id, page_size: 100 }),
    ]);
  } catch {
    // fall through; client will surface error states
  }
  if (!category) notFound();

  return (
    <PageContainer>
      <CategoryDetailClient
        category={category}
        initialSubcategories={subcategories}
        initialItems={items.items}
        initialTotal={items.total}
      />
    </PageContainer>
  );
}