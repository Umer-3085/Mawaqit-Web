export interface Surah {
  surah_number: number;
  total_ayat: number;
  name_arabic: string;
  english_name: string;
  english_name_translation: string;
  revelation_type: 'Meccan' | 'Medinan';
}

export interface Verse {
  surah_number: number;
  number_in_surah: number;
  arabic: string | null;
  global_number: number;
  juz: number | null;
  manzil: number | null;
  page_no: number | null;
  ruku: number | null;
  hizb_quarter: number | null;
  sajda: boolean;
}

export interface TranslationTafseerDetail {
  id: number;
  title: string;
  lang: string;
  author: string;
  direction: 'ltr' | 'rtl' | null;
  description: string | null;
}

export interface TranslationTafseerDetailSimple {
  id: number;
  title: string;
  lang: string;
}

export interface VerseText {
  surah_number: number;
  verse_number: number;
  detail_id: number;
  verse_translation: string;
  verse_tafseer: string | null;
}

export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type EditionType = 'translation' | 'tafsir';
