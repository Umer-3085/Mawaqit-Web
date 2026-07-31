import { z } from 'zod';

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

export type CalculationMethod = z.infer<typeof CalculationMethodEnum>;
export type Madhab = z.infer<typeof MadhabEnum>;
export type HighLatitudeRule = z.infer<typeof HighLatitudeRuleEnum>;
export type NaflMethod = z.infer<typeof NaflMethodEnum>;

export const CALCULATION_METHODS = CalculationMethodEnum.options;
export const MADHABS = MadhabEnum.options;
export const HIGH_LATITUDE_RULES = HighLatitudeRuleEnum.options;
export const NAFL_METHODS = NaflMethodEnum.options;

const TimeStringSchema = z.string().regex(/^\d{2}:\d{2}$/);

export const ParsedTimeSchema = z.object({
  hours: z.number().int().min(0).max(23),
  minutes: z.number().int().min(0).max(59),
  formatted: TimeStringSchema,
});

export function parseTimeString(timeStr: string): z.infer<typeof ParsedTimeSchema> {
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

export function parseDateString(dateStr: string): z.infer<typeof ParsedDateSchema> {
  const parts = dateStr.split('-');
  const year = Number(parts[0]) ?? 0;
  const month = Number(parts[1]) ?? 1;
  const day = Number(parts[2]) ?? 1;
  const date = new Date(Date.UTC(year, month - 1, day));
  return { year, month, day, date, formatted: dateStr };
}

export const PrayerTimesResponseSchema = z.object({
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
  ishraq: TimeStringSchema.nullish(),
  ishraq_elevation: z.number().nullable().optional(),
  duha_start: TimeStringSchema.nullish(),
  duha_start_elevation: z.number().nullable().optional(),
  duha_end: TimeStringSchema.nullish(),
  awwabin_start: TimeStringSchema.nullish(),
  awwabin_end: TimeStringSchema.nullish(),
  nafl_method: NaflMethodEnum.nullish(),
});

export const PrayerTimesRangeResponseSchema = z.object({
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

export type PrayerTimesResponse = z.infer<typeof PrayerTimesResponseSchema>;
export type PrayerTimesRangeResponse = z.infer<typeof PrayerTimesRangeResponseSchema>;
export type SingleDayParams = z.infer<typeof SingleDayParamsSchema>;
export type DateRangeParams = z.infer<typeof DateRangeParamsSchema>;

export function parsePrayerTimesResponse(data: PrayerTimesResponse): PrayerTimesResponse & {
  parsedDate: z.infer<typeof ParsedDateSchema>;
  parsedFajr: z.infer<typeof ParsedTimeSchema>;
  parsedSunrise: z.infer<typeof ParsedTimeSchema>;
  parsedDhuhr: z.infer<typeof ParsedTimeSchema>;
  parsedAsr: z.infer<typeof ParsedTimeSchema>;
  parsedMaghrib: z.infer<typeof ParsedTimeSchema>;
  parsedIsha: z.infer<typeof ParsedTimeSchema>;
  parsedIshraq: z.infer<typeof ParsedTimeSchema> | null;
  parsedDuhaStart: z.infer<typeof ParsedTimeSchema> | null;
  parsedDuhaEnd: z.infer<typeof ParsedTimeSchema> | null;
  parsedAwwabinStart: z.infer<typeof ParsedTimeSchema> | null;
  parsedAwwabinEnd: z.infer<typeof ParsedTimeSchema> | null;
} {
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