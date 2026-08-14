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

export interface TranslationTafseerDetailCreateInput {
  title: string;
  lang: string;
  author: string;
  direction?: 'ltr' | 'rtl';
  description?: string;
}

export interface TranslationTafseerDetailUpdateInput {
  title?: string;
  lang?: string;
  author?: string;
  direction?: 'ltr' | 'rtl';
  description?: string;
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

export interface VerseTextUpsertInput {
  verse_translation?: string;
  verse_tafseer?: string;
}

export interface VerseTextBulkItemInput {
  verse_number: number;
  verse_translation?: string;
  verse_tafseer?: string;
}

export interface VerseTextBulkUpsertInput {
  surah_number: number;
  detail_id: number;
  items: VerseTextBulkItemInput[];
}

export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type EditionType = 'translation' | 'tafsir';

export interface Category {
  id: number;
  title: string;
  description: string | null;
}

export interface SubCategory {
  id: number;
  title: string;
  category_id: number;
  description: string | null;
}

export interface ArticleVideo {
  id: number;
  title: string;
  detail: string | null;
  category_id: number;
  subcategory_id: number | null;
  link: string | null;
  content_type: 'article' | 'video';
}

export interface ArticleVideoCreateInput {
  title: string;
  detail?: string;
  category_id: number;
  subcategory_id?: number | null;
  link?: string;
}

export interface ArticleVideoUpdateInput {
  title?: string;
  detail?: string;
  category_id?: number;
  subcategory_id?: number | null;
  link?: string;
}

export interface CategoryCreateInput {
  title: string;
  description?: string;
}

export interface CategoryUpdateInput {
  title?: string;
  description?: string;
}

export interface SubCategoryCreateInput {
  title: string;
  category_id: number;
  description?: string;
}

export interface SubCategoryUpdateInput {
  title?: string;
  category_id?: number;
  description?: string;
}
