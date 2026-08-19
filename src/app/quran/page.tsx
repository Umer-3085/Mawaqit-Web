import type { Metadata } from 'next';
import { apiClient } from '../../../lib/api';
import { PageContainer } from '@/components/layout/PageContainer';
import { SurahListClient } from '@/components/quran/SurahListClient';

export const metadata: Metadata = {
  title: 'Quran — Mawaqit مواقيت',
  description: 'Browse all 114 surahs of the Holy Quran and read verses with translations.',
};

export default async function QuranPage() {
  let surahs: Awaited<ReturnType<typeof apiClient.getSurahsAll>> = [];
  try {
    surahs = await apiClient.getSurahsAll();
  } catch {
    surahs = [];
  }

  return (
    <PageContainer>
      <SurahListClient initialSurahs={surahs} />
    </PageContainer>
  );
}