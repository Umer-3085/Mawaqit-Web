import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '../../../../../lib/api';
import { PageContainer } from '@/components/layout/PageContainer';
import { SubcategoryDetailClient } from '@/components/library/SubcategoryDetailClient';
import type { Category, SubCategory } from '@/types/admin-content';

interface PageProps {
  params: Promise<{ category_id: string; subcategory_id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category_id, subcategory_id } = await params;
  const cid = parseInt(category_id, 10);
  const sid = parseInt(subcategory_id, 10);
  if (isNaN(cid) || isNaN(sid) || cid < 1 || sid < 1) return { title: 'Library — Mawaqit مواقيت' };
  try {
    const sub = await apiClient.getSubcategories({ page_size: 100 }).then((d) => d.items.find((s) => s.id === sid));
    if (sub) {
      return {
        title: `${sub.title} — Library | Mawaqit مواقيت`,
        description: sub.description ?? `Browse ${sub.title} articles and videos.`,
      };
    }
  } catch {
    // ignore
  }
  return { title: 'Library — Mawaqit مواقيت' };
}

export default async function SubcategoryDetailPage({ params }: PageProps) {
  const { category_id, subcategory_id } = await params;
  const cid = parseInt(category_id, 10);
  const sid = parseInt(subcategory_id, 10);
  if (isNaN(cid) || isNaN(sid) || cid < 1 || sid < 1) notFound();

  let category: Category | null = null;
  let subcategory: SubCategory | null = null;
  let items: Awaited<ReturnType<typeof apiClient.getArticlesVideos>> = {
    items: [],
    total: 0,
    page: 1,
    page_size: 100,
    total_pages: 0,
  };
  try {
    const [catData, subData, itemData] = await Promise.all([
      apiClient.getCategories({ page_size: 100 }),
      apiClient.getSubcategories({ page_size: 100 }),
      apiClient.getArticlesVideos({ category_id: cid, subcategory_id: sid, page_size: 100 }),
    ]);
    category = catData.items.find((c) => c.id === cid) ?? null;
    subcategory = subData.items.find((s) => s.id === sid && s.category_id === cid) ?? null;
    items = itemData;
  } catch {
    // fall through; client will surface error states
  }
  if (!category || !subcategory) notFound();

  return (
    <PageContainer>
      <SubcategoryDetailClient
        category={category}
        subcategory={subcategory}
        initialItems={items.items}
        initialTotal={items.total}
      />
    </PageContainer>
  );
}