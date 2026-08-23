// In-memory Token-Bucket & sliding window rate limiter for edge/workers and node environments
interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const trackerMap = new Map<string, RateLimitTracker>();

// Clean up stale IP entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of trackerMap.entries()) {
      if (now > record.resetTime) {
        trackerMap.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number; // Allowed requests per window (default 20)
  windowMs?: number; // Time window in milliseconds (default 60 seconds)
}

/**
 * Checks if an identifier (IP address or user ID) has exceeded the rate limit
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { isRateLimited: boolean; remaining: number; resetMs: number } {
  const limit = options.limit ?? 20;
  const windowMs = options.windowMs ?? 60 * 1000;
  const now = Date.now();

  const record = trackerMap.get(identifier);

  if (!record || now > record.resetTime) {
    trackerMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      isRateLimited: false,
      remaining: limit - 1,
      resetMs: windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      isRateLimited: true,
      remaining: 0,
      resetMs: record.resetTime - now,
    };
  }

  record.count += 1;
  return {
    isRateLimited: false,
    remaining: limit - record.count,
    resetMs: record.resetTime - now,
  };
}
