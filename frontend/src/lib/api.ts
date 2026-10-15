export function getBackendUrl(): string {
  return process.env.BACKEND_URL || 'http://localhost:5001';
}

export async function fetchFromBackend<T = any>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const baseUrl = getBackendUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const res = await fetch(url, {
      ...options,
      cache: 'no-store',
      signal: options?.signal || AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      console.warn(`[Backend Fetch Failed] ${url} returned HTTP ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error: any) {
    console.error(`[Backend Fetch Exception] ${endpoint}:`, error?.message || error);
    return null;
  }
}
