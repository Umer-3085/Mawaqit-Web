import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '../../../../../lib/api';
import { PageContainer } from '@/components/layout/PageContainer';
import { ItemDetailClient } from '@/components/library/ItemDetailClient';
import type { Category, SubCategory } from '@/types/admin-content';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const itemId = parseInt(id, 10);
  if (isNaN(itemId) || itemId < 1) return { title: 'Library — Mawaqit مواقيت' };
  try {
    const item = await apiClient.getArticleVideo(itemId);
    return {
      title: `${item.title} — Library | Mawaqit مواقيت`,
      description: item.detail?.slice(0, 160) ?? `Read ${item.title}.`,
    };
  } catch {
    return { title: 'Library — Mawaqit مواقيت' };
  }
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const itemId = parseInt(id, 10);
  if (isNaN(itemId) || itemId < 1) notFound();

  let item: Awaited<ReturnType<typeof apiClient.getArticleVideo>> | null = null;
  let category: Category | null = null;
  let subcategory: SubCategory | null = null;
  try {
    item = await apiClient.getArticleVideo(itemId);
    if (item) {
      const [catData, subData] = await Promise.all([
        apiClient.getCategories({ page_size: 100 }),
        apiClient.getSubcategories({ page_size: 100 }),
      ]);
      category = catData.items.find((c) => c.id === item!.category_id) ?? null;
      subcategory =
        item.subcategory_id != null
          ? subData.items.find((s) => s.id === item!.subcategory_id) ?? null
          : null;
    }
  } catch {
    item = null;
  }
  if (!item) notFound();

  return (
    <PageContainer>
      <ItemDetailClient item={item} category={category} subcategory={subcategory} />
    </PageContainer>
  );
}