import { config } from '../constants/config';
import type { ApiError } from '../types/habit';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, token, headers = {} } = options;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.apiTimeout);

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const error: ApiError = {
          message: errBody.message ?? `Request failed (${res.status})`,
          status: res.status,
          code: errBody.code,
        };
        throw error;
      }

      if (res.status === 204) return undefined as T;
      return (await res.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  get<T>(path: string, token?: string | null) {
    return this.request<T>(path, { method: 'GET', token });
  }

  post<T>(path: string, body?: unknown, token?: string | null) {
    return this.request<T>(path, { method: 'POST', body, token });
  }

  patch<T>(path: string, body?: unknown, token?: string | null) {
    return this.request<T>(path, { method: 'PATCH', body, token });
  }

  delete<T>(path: string, token?: string | null) {
    return this.request<T>(path, { method: 'DELETE', token });
  }
}

export const apiClient = new ApiClient(config.apiUrl);
