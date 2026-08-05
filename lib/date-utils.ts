import { HijriDate } from 'hijri-js';

export interface FormattedDate {
  gregorian: string;
  hijri: string;
  hijriShort: string;
  weekday: string;
  isoDate: string;
}

const ARABIC_MONTHS = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

const ARABIC_WEEKDAYS = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export function formatDateWithHijri(isoDate: string): FormattedDate {
  const gregDate = new Date(isoDate + 'T00:00:00');
  const hijri = new HijriDate(gregDate);

  const gregorian = gregDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const weekday = ARABIC_WEEKDAYS[gregDate.getDay()];
  const hijriDay = hijri.getDate();
  const hijriMonth = ARABIC_MONTHS[hijri.getMonth()];
  const hijriYear = hijri.getFullYear();

  const hijriFormatted = 'يوم ' + weekday + '، ' + hijriDay + ' ' + hijriMonth + ' ' + hijriYear + ' ه';

  const hijriShort = hijriDay + ' ' + hijriMonth + ' ' + hijriYear + ' ه';

  return {
    gregorian,
    hijri: hijriFormatted,
    hijriShort,
    weekday,
    isoDate,
  };
}

export function formatGregorianOnly(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTodayISO(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}