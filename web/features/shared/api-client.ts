/**
 * Shared API Client
 * 
 * Centralized API client for making HTTP requests.
 * Features: error handling, request/response interceptors, type safety.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { params, ...init } = config;

  // Build URL with query params
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Default headers
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message ?? `Request failed with status ${response.status}`,
      response.status,
      errorData.code
    );
  }

  const data = await response.json();
  return { data, status: response.status };
}

export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "DELETE" }),
};

/**
 * Type-safe query key factory for data fetching
 */
export const queryKeys = {
  customers: {
    all: ["customers"] as const,
    list: (filters: Record<string, unknown>) => ["customers", "list", filters] as const,
    detail: (id: string) => ["customers", "detail", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (filters: Record<string, unknown>) => ["orders", "list", filters] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
    byCustomer: (customerId: string) => ["orders", "customer", customerId] as const,
  },
} as const;
