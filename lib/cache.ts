import type { PurchaseAdvisorResponse } from '@/types';

interface CacheEntry<T> {
  data: T;
  expiresAt: string;
}

/**
 * In-memory cache for advisor responses per user
 * In production, this would use Redis or similar
 */
class AdvisorCache {
  private cache: Map<string, CacheEntry<PurchaseAdvisorResponse>> = new Map();

  set(userId: string, response: PurchaseAdvisorResponse): void {
    this.cache.set(userId, {
      data: response,
      expiresAt: response.expiresAt,
    });
  }

  get(userId: string): PurchaseAdvisorResponse | null {
    const entry = this.cache.get(userId);

    if (!entry) {
      return null;
    }

    if (new Date(entry.expiresAt) < new Date()) {
      this.cache.delete(userId);
      return null;
    }

    return entry.data;
  }

  clear(userId: string): void {
    this.cache.delete(userId);
  }

  clearAll(): void {
    this.cache.clear();
  }
}

export const advisorCache = new AdvisorCache();
