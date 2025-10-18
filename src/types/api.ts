export interface ApiError extends Error {
  status: number;
  body: Record<string, unknown>;
}

export type ApiResponse<T> = T | null;