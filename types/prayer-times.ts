export type CalculationMethod =
  | 'MUSLIM_WORLD_LEAGUE'
  | 'EGYPTIAN'
  | 'KARACHI'
  | 'UMM_AL_QURA'
  | 'DUBAI'
  | 'MOON_SIGHTING_COMMITTEE'
  | 'NORTH_AMERICA'
  | 'KUWAIT'
  | 'QATAR'
  | 'SINGAPORE'
  | 'UOIF';

export type Madhab = 'SHAFI' | 'HANAFI';

export type HighLatitudeRule =
  | 'MIDDLE_OF_THE_NIGHT'
  | 'SEVENTH_OF_THE_NIGHT'
  | 'TWILIGHT_ANGLE';

export type NaflMethod =
  | 'STANDARD_15MIN'
  | 'QUARTER_DAY'
  | 'SOLAR_ANGLE_SPEAR'
  | 'SOLAR_ANGLE_DUHA'
  | 'MALIKI_DELAYED';

export const CALCULATION_METHODS: CalculationMethod[] = [
  'MUSLIM_WORLD_LEAGUE',
  'EGYPTIAN',
  'KARACHI',
  'UMM_AL_QURA',
  'DUBAI',
  'MOON_SIGHTING_COMMITTEE',
  'NORTH_AMERICA',
  'KUWAIT',
  'QATAR',
  'SINGAPORE',
  'UOIF',
];

export const MADHABS: Madhab[] = ['SHAFI', 'HANAFI'];

export const HIGH_LATITUDE_RULES: HighLatitudeRule[] = [
  'MIDDLE_OF_THE_NIGHT',
  'SEVENTH_OF_THE_NIGHT',
  'TWILIGHT_ANGLE',
];

export const NAFL_METHODS: NaflMethod[] = [
  'STANDARD_15MIN',
  'QUARTER_DAY',
  'SOLAR_ANGLE_SPEAR',
  'SOLAR_ANGLE_DUHA',
  'MALIKI_DELAYED',
];

export interface ParsedTime {
  hours: number;
  minutes: number;
  formatted: string;
}

export interface ParsedDate {
  year: number;
  month: number;
  day: number;
  date: Date;
  formatted: string;
}

export interface PrayerTimesResponse {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  timezone: string;
  calculation_method: CalculationMethod;
  madhab: Madhab;
  ishraq?: string | null;
  ishraq_elevation?: number | null;
  duha_start?: string | null;
  duha_start_elevation?: number | null;
  duha_end?: string | null;
  awwabin_start?: string | null;
  awwabin_end?: string | null;
  nafl_method?: NaflMethod | null;
}

export interface PrayerTimesRangeResponse {
  items: PrayerTimesResponse[];
  start_date: string;
  end_date: string;
}

export interface SingleDayParams {
  lat: number;
  lng: number;
  prayer_date?: string;
  calculation_method?: CalculationMethod;
  madhab?: Madhab;
  high_latitude_rule?: HighLatitudeRule;
  timezone: string;
  nafl_method?: NaflMethod;
}

export interface DateRangeParams {
  lat: number;
  lng: number;
  start_date: string;
  end_date: string;
  calculation_method?: CalculationMethod;
  madhab?: Madhab;
  high_latitude_rule?: HighLatitudeRule;
  timezone: string;
  nafl_method?: NaflMethod;
}

export interface LocationParams {
  lat: number;
  lng: number;
  timezone: string;
  calculation_method: CalculationMethod;
  madhab: Madhab;
  high_latitude_rule: HighLatitudeRule;
  nafl_method: NaflMethod;
}

export interface ParsedPrayerTimesResponse extends PrayerTimesResponse {
  parsedDate: ParsedDate;
  parsedFajr: ParsedTime;
  parsedSunrise: ParsedTime;
  parsedDhuhr: ParsedTime;
  parsedAsr: ParsedTime;
  parsedMaghrib: ParsedTime;
  parsedIsha: ParsedTime;
  parsedIshraq: ParsedTime | null;
  parsedDuhaStart: ParsedTime | null;
  parsedDuhaEnd: ParsedTime | null;
  parsedAwwabinStart: ParsedTime | null;
  parsedAwwabinEnd: ParsedTime | null;
}