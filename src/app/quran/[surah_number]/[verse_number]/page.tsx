import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '../../../../../lib/api';
import { PageContainer } from '@/components/layout/PageContainer';
import { VerseDetailClient } from '@/components/quran/VerseDetailClient';
import type { Surah, Verse, VerseText } from '@/types/admin-content';

interface PageProps {
  params: Promise<{ surah_number: string; verse_number: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { surah_number, verse_number } = await params;
  const s = parseInt(surah_number, 10);
  const v = parseInt(verse_number, 10);
  if (isNaN(s) || s < 1 || s > 114 || isNaN(v) || v < 1) {
    return { title: 'Verse — Mawaqit مواقيت' };
  }
  let surah: Surah | null = null;
  try {
    surah = await apiClient.getSurah(s);
  } catch {
    surah = null;
  }
  if (!surah) return { title: 'Verse — Mawaqit مواقيت' };
  return {
    title: `Surah ${surah.english_name}, Verse ${v} — Mawaqit مواقيت`,
    description: `Read verse ${v} of Surah ${surah.english_name} (${surah.name_arabic}) with translations and tafsir.`,
  };
}

export default async function VerseDetailPage({ params }: PageProps) {
  const { surah_number, verse_number } = await params;
  const s = parseInt(surah_number, 10);
  const v = parseInt(verse_number, 10);
  if (isNaN(s) || s < 1 || s > 114 || isNaN(v) || v < 1) notFound();

  let surah: Surah | null = null;
  let verse: Verse | null = null;
  let texts: VerseText[] = [];
  try {
    [surah, verse, texts] = await Promise.all([
      apiClient.getSurah(s),
      apiClient.getVersesBySurah(s).then((vs) => vs.find((x) => x.number_in_surah === v) ?? null),
      apiClient.getVerseTextsByVerse(s, v),
    ]);
  } catch {
    // fall through; client will surface error states
  }
  if (!surah || !verse) notFound();

  return (
    <PageContainer>
      <VerseDetailClient surah={surah} verse={verse} initialTexts={texts} />
    </PageContainer>
  );
}