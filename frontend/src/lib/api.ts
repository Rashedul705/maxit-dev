export function getBackendUrl(): string {
  return process.env.BACKEND_INTERNAL_URL || process.env.BACKEND_URL || 'http://localhost:5001';
}

export function isFallbackDataEnabled(): boolean {
  if (process.env.FALLBACK_DATA_ENABLED !== undefined) {
    return process.env.FALLBACK_DATA_ENABLED === 'true' || process.env.FALLBACK_DATA_ENABLED === '1';
  }
  // Default to true so production never crashes on temporary backend network hiccups
  return true;
}

// In-memory cache for SSR to serve last-known good data if backend is temporarily slow/down
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function fetchFromBackend<T = any>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const baseUrl = getBackendUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      // Enable Next.js ISR (Incremental Static Regeneration) cache
      next: { revalidate: 60, ...(options as any)?.next },
      signal: options?.signal || AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      const statusText = res.statusText || 'Error';
      console.warn(`[Backend Warning] Request to ${url} returned HTTP ${res.status} (${statusText}).`);
      
      // Serve from memory cache if available
      const cached = memoryCache.get(cleanEndpoint);
      if (cached && cached.data) {
        return cached.data as T;
      }
      return null;
    }

    const data = (await res.json()) as T;
    if (data) {
      memoryCache.set(cleanEndpoint, { data, timestamp: Date.now() });
    }
    return data;
  } catch (error: any) {
    console.warn(`[Backend Warning] Request to ${url} failed: ${error?.message || error}. Using fallback.`);
    
    // Serve from memory cache if available
    const cached = memoryCache.get(cleanEndpoint);
    if (cached && cached.data) {
      return cached.data as T;
    }

    return null;
  }
}
