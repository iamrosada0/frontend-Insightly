import { authHeaders } from './auth';

// Define the base API URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Define custom error interface
export interface ApiError extends Error {
  status: number;
  body: Record<string, unknown>;
}

// Define generic response type
type ApiResponse<T> = T | null;

// Define fetch options type
interface ApiFetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

export async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path}`;

  // Merge headers and filter out undefined values
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const auth = authHeaders();
  for (const [key, value] of Object.entries(auth)) {
    if (value !== undefined) {
      headers[key] = value;
    }
  }
  if (opts.headers) {
    for (const [key, value] of Object.entries(opts.headers)) {
      if (value !== undefined) {
        headers[key] = value;
      }
    }
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...opts,
    headers,
  });

  if (!res.ok) {
    let errorBody: Record<string, unknown>;
    try {
      const text = await res.text();
      errorBody = text ? JSON.parse(text) : { message: res.statusText };
    } catch {
      errorBody = { message: res.statusText };
    }

    // Create ApiError with required properties
    const error: ApiError = Object.assign(new Error(errorBody.message?.toString() || res.statusText), {
      status: res.status,
      body: errorBody,
    });

    throw error;
  }

  return res.status !== 204 ? res.json() : null;
}