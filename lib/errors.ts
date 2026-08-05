export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public override readonly message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(status: number, data: unknown): ApiError {
    const message = typeof data === 'object' && data !== null && 'detail' in data
      ? String((data as Record<string, unknown>)["detail"])
      : `Request failed with status ${status}`;
    return new ApiError(status, message, data);
  }
}

export class NetworkError extends Error {
  constructor(public override readonly cause?: Error) {
    super(cause?.message ?? 'Network request failed');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(public readonly timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}