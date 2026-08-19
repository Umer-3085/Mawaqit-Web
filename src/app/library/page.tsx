import type { Metadata } from 'next';
import { apiClient } from '../../../lib/api';
import { PageContainer } from '@/components/layout/PageContainer';
import { LibraryClient } from '@/components/library/LibraryClient';

export const metadata: Metadata = {
  title: 'Library — Mawaqit مواقيت',
  description: 'Browse articles and videos on Quran, Hadith, Fiqh and more from the Mawaqit library.',
};

export default async function LibraryPage() {
  let categories: Awaited<ReturnType<typeof apiClient.getCategories>>['items'] = [];
  try {
    const data = await apiClient.getCategories({ page_size: 100 });
    categories = data.items;
  } catch {
    categories = [];
  }

  return (
    <PageContainer>
      <LibraryClient initialCategories={categories} />
    </PageContainer>
  );
}