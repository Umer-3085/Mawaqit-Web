import { ApiError, TimeoutError, isApiError, isNetworkError, isTimeoutError } from './errors';
import {
  PrayerTimesResponse,
  PrayerTimesRangeResponse,
  SingleDayParams,
  DateRangeParams,
} from '../types/prayer-times';
import {
  PrayerTimesResponseSchema,
  PrayerTimesRangeResponseSchema,
  SingleDayParamsSchema,
  DateRangeParamsSchema,
} from './validation';

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY = 500;

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  retryableStatuses?: number[];
  shouldRetry?: (error: unknown) => boolean;
}

function isRetryableError(error: unknown, retryableStatuses: number[]): boolean {
  if (isNetworkError(error) || isTimeoutError(error)) {
    return true;
  }
  if (isApiError(error)) {
    return retryableStatuses.includes(error.status);
  }
  return false;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  timeoutMs: number,
  retryOptions: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    baseDelayMs = DEFAULT_BASE_DELAY,
    maxDelayMs = 10000,
    retryableStatuses = [408, 429, 500, 502, 503, 504],
    shouldRetry = (err) => isRetryableError(err, retryableStatuses),
  } = retryOptions;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw ApiError.fromResponse(response.status, errorData);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError(timeoutMs);
      }

      if (attempt < maxRetries && shouldRetry(error)) {
        const delay = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs);
        const jitter = delay * 0.1 * Math.random();
        await sleep(delay + jitter);
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

export interface ApiClientConfig {
  baseURL: string;
  timeoutMs?: number;
  retryOptions?: RetryOptions;
}

export class ApiClient {
  private readonly baseURL: string;
  private readonly timeoutMs: number;
  private readonly retryOptions: RetryOptions;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL.replace(/\/$/, '');
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT;
    this.retryOptions = config.retryOptions ?? {};
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(`${this.baseURL}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return fetchWithRetry<T>(
      this.buildUrl(path, params),
      { method: 'GET', headers: { Accept: 'application/json' } },
      this.timeoutMs,
      this.retryOptions
    );
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return fetchWithRetry<T>(
      `${this.baseURL}${path}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      },
      this.timeoutMs,
      this.retryOptions
    );
  }

  async getPrayerTimes(params: SingleDayParams): Promise<PrayerTimesResponse> {
    const validated = SingleDayParamsSchema.parse(params);
    const queryParams = {
      lat: validated.lat,
      lng: validated.lng,
      date: validated.prayer_date,
      calculation_method: validated.calculation_method,
      madhab: validated.madhab,
      high_latitude_rule: validated.high_latitude_rule,
      timezone: validated.timezone,
      nafl_method: validated.nafl_method,
    };
    const data = await this.get<PrayerTimesResponse>('/prayer-times', queryParams);
    return PrayerTimesResponseSchema.parse(data);
  }

  async getTodayPrayerTimes(params: Omit<SingleDayParams, 'prayer_date'>): Promise<PrayerTimesResponse> {
    const queryParams = {
      lat: params.lat,
      lng: params.lng,
      timezone: params.timezone,
      calculation_method: params.calculation_method,
      madhab: params.madhab,
      high_latitude_rule: params.high_latitude_rule,
      nafl_method: params.nafl_method,
    };
    const data = await this.get<PrayerTimesResponse>('/prayer-times/today', queryParams);
    return PrayerTimesResponseSchema.parse(data);
  }

  async getPrayerTimesRange(params: DateRangeParams): Promise<PrayerTimesRangeResponse> {
    const validated = DateRangeParamsSchema.parse(params);
    const queryParams = {
      lat: validated.lat,
      lng: validated.lng,
      start_date: validated.start_date,
      end_date: validated.end_date,
      calculation_method: validated.calculation_method,
      madhab: validated.madhab,
      high_latitude_rule: validated.high_latitude_rule,
      timezone: validated.timezone,
      nafl_method: validated.nafl_method,
    };
    const data = await this.get<PrayerTimesRangeResponse>('/prayer-times/range', queryParams);
    return PrayerTimesRangeResponseSchema.parse(data);
  }

  async getMethods(): Promise<string[]> {
    const data = await this.get<string[]>('/prayer-times/methods');
    return Array.isArray(data) ? data : [];
  }
}

export function createApiClient(config?: Partial<ApiClientConfig>): ApiClient {
  const baseURL = config?.baseURL ?? process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8000';
  return new ApiClient({
    baseURL,
    timeoutMs: config?.timeoutMs ?? DEFAULT_TIMEOUT,
    retryOptions: config?.retryOptions ?? {},
  });
}

export const apiClient = createApiClient();