import { z } from 'zod';
import type {
  ParsedTime,
  ParsedDate,
  PrayerTimesResponse,
  PrayerTimesRangeResponse,
  ParsedPrayerTimesResponse,
} from '../types/prayer-times';

export const CalculationMethodEnum = z.enum([
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
]);

export const MadhabEnum = z.enum(['SHAFI', 'HANAFI']);

export const HighLatitudeRuleEnum = z.enum([
  'MIDDLE_OF_THE_NIGHT',
  'SEVENTH_OF_THE_NIGHT',
  'TWILIGHT_ANGLE',
]);

export const NaflMethodEnum = z.enum([
  'STANDARD_15MIN',
  'QUARTER_DAY',
  'SOLAR_ANGLE_SPEAR',
  'SOLAR_ANGLE_DUHA',
  'MALIKI_DELAYED',
]);

const TimeStringSchema = z.string().regex(/^\d{2}:\d{2}$/);

export const ParsedTimeSchema = z.object({
  hours: z.number().int().min(0).max(23),
  minutes: z.number().int().min(0).max(59),
  formatted: TimeStringSchema,
});

export function parseTimeString(timeStr: string): ParsedTime {
  const parts = timeStr.split(':');
  const hours = Number(parts[0]) ?? 0;
  const minutes = Number(parts[1]) ?? 0;
  return { hours, minutes, formatted: timeStr };
}

export const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const ParsedDateSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  date: Date,
  formatted: DateStringSchema,
});

export function parseDateString(dateStr: string): ParsedDate {
  const parts = dateStr.split('-');
  const year = Number(parts[0]) ?? 0;
  const month = Number(parts[1]) ?? 1;
  const day = Number(parts[2]) ?? 1;
  const date = new Date(Date.UTC(year, month - 1, day));
  return { year, month, day, date, formatted: dateStr };
}

export const PrayerTimesResponseSchema: z.ZodType<PrayerTimesResponse> = z.object({
  date: DateStringSchema,
  fajr: TimeStringSchema,
  sunrise: TimeStringSchema,
  dhuhr: TimeStringSchema,
  asr: TimeStringSchema,
  maghrib: TimeStringSchema,
  isha: TimeStringSchema,
  timezone: z.string().min(1),
  calculation_method: CalculationMethodEnum,
  madhab: MadhabEnum,
  ishraq: TimeStringSchema.nullable().optional(),
  ishraq_elevation: z.number().nullable().optional(),
  duha_start: TimeStringSchema.nullable().optional(),
  duha_start_elevation: z.number().nullable().optional(),
  duha_end: TimeStringSchema.nullable().optional(),
  awwabin_start: TimeStringSchema.nullable().optional(),
  awwabin_end: TimeStringSchema.nullable().optional(),
  nafl_method: NaflMethodEnum.nullable().optional(),
});

export const PrayerTimesRangeResponseSchema: z.ZodType<PrayerTimesRangeResponse> = z.object({
  items: z.array(PrayerTimesResponseSchema),
  start_date: DateStringSchema,
  end_date: DateStringSchema,
});

export const SingleDayParamsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  prayer_date: DateStringSchema.optional(),
  calculation_method: CalculationMethodEnum.default('MUSLIM_WORLD_LEAGUE'),
  madhab: MadhabEnum.default('SHAFI'),
  high_latitude_rule: HighLatitudeRuleEnum.default('MIDDLE_OF_THE_NIGHT'),
  timezone: z.string().min(1),
  nafl_method: NaflMethodEnum.default('QUARTER_DAY'),
});

export const DateRangeParamsSchema = SingleDayParamsSchema.extend({
  prayer_date: z.never(),
  start_date: DateStringSchema,
  end_date: DateStringSchema,
});

export function parsePrayerTimesResponse(data: PrayerTimesResponse): ParsedPrayerTimesResponse {
  return {
    ...data,
    parsedDate: parseDateString(data.date),
    parsedFajr: parseTimeString(data.fajr),
    parsedSunrise: parseTimeString(data.sunrise),
    parsedDhuhr: parseTimeString(data.dhuhr),
    parsedAsr: parseTimeString(data.asr),
    parsedMaghrib: parseTimeString(data.maghrib),
    parsedIsha: parseTimeString(data.isha),
    parsedIshraq: data.ishraq ? parseTimeString(data.ishraq) : null,
    parsedDuhaStart: data.duha_start ? parseTimeString(data.duha_start) : null,
    parsedDuhaEnd: data.duha_end ? parseTimeString(data.duha_end) : null,
    parsedAwwabinStart: data.awwabin_start ? parseTimeString(data.awwabin_start) : null,
    parsedAwwabinEnd: data.awwabin_end ? parseTimeString(data.awwabin_end) : null,
  };
}