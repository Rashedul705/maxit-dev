export function getBackendUrl(): string {
  return process.env.BACKEND_INTERNAL_URL || process.env.BACKEND_URL || 'http://localhost:5001';
}

export function isFallbackDataEnabled(): boolean {
  if (process.env.FALLBACK_DATA_ENABLED !== undefined) {
    return process.env.FALLBACK_DATA_ENABLED === 'true' || process.env.FALLBACK_DATA_ENABLED === '1';
  }
  // Default: false in production, true in development
  return process.env.NODE_ENV !== 'production';
}

export async function fetchFromBackend<T = any>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const baseUrl = getBackendUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      cache: 'no-store',
      signal: options?.signal || AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      const statusText = res.statusText || 'Error';
      if (!isFallbackDataEnabled()) {
        const errorMsg = `[Backend Error] Request to ${url} failed with HTTP ${res.status} (${statusText}). Fallback data is disabled (FALLBACK_DATA_ENABLED=false).`;
        console.error(`[CRITICAL] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      console.error(
        `[SERVER-ERROR] [Backend Fallback Engaged] Request to ${url} failed with HTTP ${res.status} (${statusText}). Returning fallback data because FALLBACK_DATA_ENABLED is enabled.`
      );
      return null;
    }

    return (await res.json()) as T;
  } catch (error: any) {
    if (!isFallbackDataEnabled()) {
      const errorMsg = `[Backend Error] Exception during request to ${url}: ${error?.message || error}. Fallback data is disabled (FALLBACK_DATA_ENABLED=false).`;
      console.error(`[CRITICAL] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    console.error(
      `[SERVER-ERROR] [Backend Fallback Engaged] Exception during request to ${url}: ${error?.message || error}. Returning fallback data because FALLBACK_DATA_ENABLED is enabled.`
    );
    return null;
  }
}
