import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Ensures an image URL is safe and accessible.
 * If an image points to ibb.co (which is blocked by some regional ISPs / firewalls in Bangladesh),
 * routes it safely through Cloudflare-backed cache (wsrv.nl) to avoid broken images.
 */
export function getSafeImageUrl(src?: string | null): string {
  if (!src) return ""
  if (typeof src === "string" && (src.includes("i.ibb.co") || src.includes("ibb.co"))) {
    return `https://wsrv.nl/?url=${encodeURIComponent(src)}`
  }
  return src
}
