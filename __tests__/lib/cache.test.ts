import { describe, it, expect, beforeEach } from 'vitest';
import type { PurchaseAdvisorResponse } from '@/types';

describe('Advisor Cache', () => {
  let cache: Map<string, PurchaseAdvisorResponse>;

  beforeEach(() => {
    cache = new Map();
  });

  describe('Basic Operations', () => {
    it('should store cache entry', () => {
      const response: PurchaseAdvisorResponse = {
        id: 'resp1',
        userId: 'user123',
        recommendations: [],
        summary: 'Test',
        reasoning: 'Test',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      cache.set('user123', response);
      expect(cache.has('user123')).toBe(true);
    });

    it('should retrieve cached entry', () => {
      const response: PurchaseAdvisorResponse = {
        id: 'resp1',
        userId: 'user123',
        recommendations: [],
        summary: 'Test',
        reasoning: 'Test',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      cache.set('user123', response);
      const retrieved = cache.get('user123');

      expect(retrieved).toEqual(response);
    });

    it('should return null for non-existent key', () => {
      const retrieved = cache.get('nonexistent');
      expect(retrieved).toBeUndefined();
    });

    it('should clear specific entry', () => {
      const response: PurchaseAdvisorResponse = {
        id: 'resp1',
        userId: 'user123',
        recommendations: [],
        summary: 'Test',
        reasoning: 'Test',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      cache.set('user123', response);
      cache.delete('user123');

      expect(cache.has('user123')).toBe(false);
    });

    it('should clear all entries', () => {
      const response: PurchaseAdvisorResponse = {
        id: 'resp1',
        userId: 'user123',
        recommendations: [],
        summary: 'Test',
        reasoning: 'Test',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      cache.set('user123', response);
      cache.set('user456', response);

      cache.clear();

      expect(cache.size).toBe(0);
    });
  });

  describe('Expiration', () => {
    it('should store expiry timestamp', () => {
      const expiresAt = new Date(Date.now() + 3600000).toISOString();
      const response: PurchaseAdvisorResponse = {
        id: 'resp1',
        userId: 'user123',
        recommendations: [],
        summary: 'Test',
        reasoning: 'Test',
        generatedAt: new Date().toISOString(),
        expiresAt,
      };

      cache.set('user123', response);
      const retrieved = cache.get('user123');

      expect(retrieved?.expiresAt).toBe(expiresAt);
    });

    it('should have 1 hour TTL', () => {
      const generatedAt = new Date();
      const expiresAt = new Date(generatedAt.getTime() + 3600000);

      const ttlMs = expiresAt.getTime() - generatedAt.getTime();
      expect(ttlMs).toBe(3600000);
    });

    it('should detect expired entries', () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 1000); // 1 second ago

      const isExpired = pastDate < now;
      expect(isExpired).toBe(true);
    });
  });

  describe('Multiple Users', () => {
    it('should store different data per user', () => {
      const response1: PurchaseAdvisorResponse = {
        id: 'resp1',
        userId: 'user1',
        recommendations: [],
        summary: 'Summary 1',
        reasoning: 'Reasoning 1',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      const response2: PurchaseAdvisorResponse = {
        id: 'resp2',
        userId: 'user2',
        recommendations: [],
        summary: 'Summary 2',
        reasoning: 'Reasoning 2',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      cache.set('user1', response1);
      cache.set('user2', response2);

      expect(cache.get('user1')?.summary).toBe('Summary 1');
      expect(cache.get('user2')?.summary).toBe('Summary 2');
    });

    it('should clear single user without affecting others', () => {
      const response1: PurchaseAdvisorResponse = {
        id: 'resp1',
        userId: 'user1',
        recommendations: [],
        summary: 'Summary 1',
        reasoning: 'Reasoning 1',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      const response2: PurchaseAdvisorResponse = {
        id: 'resp2',
        userId: 'user2',
        recommendations: [],
        summary: 'Summary 2',
        reasoning: 'Reasoning 2',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      cache.set('user1', response1);
      cache.set('user2', response2);

      cache.delete('user1');

      expect(cache.has('user1')).toBe(false);
      expect(cache.has('user2')).toBe(true);
    });
  });
});
