import { initialize } from 'hijri-js';

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

const hijriConverter = initialize();

export function formatDateWithHijri(isoDate: string): FormattedDate {
  const gregDate = new Date(isoDate + 'T00:00:00');
  const hijri = hijriConverter.gregorianToHijri(
    String(gregDate.getFullYear()),
    String(gregDate.getMonth() + 1),
    String(gregDate.getDate()),
    '/'
  );

  const gregorian = gregDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const weekday = ARABIC_WEEKDAYS[gregDate.getDay()] ?? '';
  const hijriDay = Number(hijri.day);
  const hijriMonth = ARABIC_MONTHS[Number(hijri.month) - 1];
  const hijriYear = Number(hijri.year);

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
  return now.toISOString().split('T')[0] ?? '';
}

export function addDaysISO(date: string, days: number): string {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0] ?? '';
}

export function subDaysISO(date: string, days: number): string {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0] ?? '';
}

export function parseLocationParams(params: { [key: string]: string | string[] | undefined }): {
  lat: number;
  lng: number;
  timezone: string;
  calculation_method: string;
  madhab: string;
  high_latitude_rule: string;
  nafl_method: string;
} {
  const lat = Number(params['lat']) || 0;
  const lng = Number(params['lng']) || 0;
  const timezone = (Array.isArray(params['timezone']) ? params['timezone'][0] : params['timezone']) ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const calculation_method = (Array.isArray(params['calculation_method']) ? params['calculation_method'][0] : params['calculation_method']) ?? 'MUSLIM_WORLD_LEAGUE';
  const madhab = (Array.isArray(params['madhab']) ? params['madhab'][0] : params['madhab']) ?? 'SHAFI';
  const high_latitude_rule = (Array.isArray(params['high_latitude_rule']) ? params['high_latitude_rule'][0] : params['high_latitude_rule']) ?? 'MIDDLE_OF_THE_NIGHT';
  const nafl_method = (Array.isArray(params['nafl_method']) ? params['nafl_method'][0] : params['nafl_method']) ?? 'STANDARD_15MIN';

  return {
    lat,
    lng,
    timezone,
    calculation_method,
    madhab,
    high_latitude_rule,
    nafl_method,
  };
}