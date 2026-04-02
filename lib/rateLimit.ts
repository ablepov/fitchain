type FixedWindowEntry = {
  count: number;
  resetAt: number;
};

type FixedWindowResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

type RateLimitStore = Map<string, FixedWindowEntry>;

declare global {
  var __fitchainRateLimitStore: RateLimitStore | undefined;
}

function getRateLimitStore() {
  if (!globalThis.__fitchainRateLimitStore) {
    globalThis.__fitchainRateLimitStore = new Map<string, FixedWindowEntry>();
  }

  return globalThis.__fitchainRateLimitStore;
}

function cleanupExpiredEntries(store: RateLimitStore, now: number) {
  if (store.size < 500) {
    return;
  }

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function takeFixedWindowLimit(key: string, limit: number, windowMs: number): FixedWindowResult {
  const store = getRateLimitStore();
  const now = Date.now();
  cleanupExpiredEntries(store, now);

  const currentEntry = store.get(key);
  if (!currentEntry || currentEntry.resetAt <= now) {
    const nextEntry = {
      count: 1,
      resetAt: now + windowMs,
    };

    store.set(key, nextEntry);

    return {
      allowed: true,
      remaining: Math.max(0, limit - nextEntry.count),
      resetAt: nextEntry.resetAt,
    };
  }

  currentEntry.count += 1;
  store.set(key, currentEntry);

  return {
    allowed: currentEntry.count <= limit,
    remaining: Math.max(0, limit - currentEntry.count),
    resetAt: currentEntry.resetAt,
  };
}
