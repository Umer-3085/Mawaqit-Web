import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '../../../../lib/api';
import { PageContainer } from '@/components/layout/PageContainer';
import { SurahReaderClient } from '@/components/quran/SurahReaderClient';
import type { Surah, Verse, TranslationTafseerDetailSimple } from '@/types/admin-content';

interface PageProps {
  params: Promise<{ surah_number: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { surah_number } = await params;
  const number = parseInt(surah_number, 10);
  if (isNaN(number) || number < 1 || number > 114) {
    return { title: 'Surah — Mawaqit مواقيت' };
  }
  let surah: Surah | null = null;
  try {
    surah = await apiClient.getSurah(number);
  } catch {
    surah = null;
  }
  if (!surah) return { title: 'Surah — Mawaqit مواقيت' };
  return {
    title: `Surah ${surah.english_name} — Mawaqit مواقيت`,
    description: `Read Surah ${surah.english_name} (${surah.name_arabic}) with translation. ${surah.english_name_translation}, ${surah.revelation_type} revelation, ${surah.total_ayat} verses.`,
  };
}

export default async function SurahReaderPage({ params }: PageProps) {
  const { surah_number } = await params;
  const number = parseInt(surah_number, 10);
  if (isNaN(number) || number < 1 || number > 114) notFound();

  let surah: Surah | null = null;
  let verses: Verse[] = [];
  let editions: TranslationTafseerDetailSimple[] = [];
  try {
    [surah, verses, editions] = await Promise.all([
      apiClient.getSurah(number),
      apiClient.getVersesBySurah(number),
      apiClient.getTranslationTafseerDetailsAll(),
    ]);
  } catch {
    // fall through; client will surface error states
  }
  if (!surah) notFound();

  return (
    <PageContainer>
      <SurahReaderClient surah={surah} initialVerses={verses} editions={editions} />
    </PageContainer>
  );
}