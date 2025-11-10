/**
 * Rate Limiting Utility
 *
 * Implements a token bucket algorithm to prevent API abuse.
 * Each IP address gets a bucket of tokens that refills over time.
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({ interval: 60000, limit: 10 });
 * const { success, remaining } = await limiter.check(ipAddress);
 * if (!success) {
 *   return NextResponse.json(
 *     { error: 'Too many requests' },
 *     { status: 429 }
 *   );
 * }
 * ```
 */

interface RateLimitConfig {
  /**
   * Time window in milliseconds
   * @example 60000 = 1 minute
   */
  interval: number;

  /**
   * Maximum number of requests allowed per interval
   * @example 10 = 10 requests per interval
   */
  limit: number;
}

interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean;

  /**
   * Number of remaining requests in current window
   */
  remaining: number;

  /**
   * Unix timestamp when the limit resets
   */
  reset: number;

  /**
   * Time in seconds until the limit resets
   */
  retryAfter?: number;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

// In-memory storage for rate limit buckets
// In production, consider using Redis or similar distributed cache
const buckets = new Map<string, TokenBucket>();

/**
 * Creates a rate limiter with the specified configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  return {
    /**
     * Check if a request from the given identifier is allowed
     * @param identifier Unique identifier (typically IP address)
     * @returns Rate limit result with success status and metadata
     */
    check: async (identifier: string): Promise<RateLimitResult> => {
      const now = Date.now();
      const key = `${identifier}:${config.interval}:${config.limit}`;

      // Get or create bucket for this identifier
      let bucket = buckets.get(key);

      if (!bucket) {
        bucket = {
          tokens: config.limit,
          lastRefill: now,
        };
        buckets.set(key, bucket);
      }

      // Calculate how many tokens to add based on time elapsed
      const timeSinceLastRefill = now - bucket.lastRefill;
      const tokensToAdd =
        Math.floor(timeSinceLastRefill / config.interval) * config.limit;

      if (tokensToAdd > 0) {
        bucket.tokens = Math.min(config.limit, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;
      }

      // Calculate reset time (when the bucket will be full again)
      const reset = bucket.lastRefill + config.interval;

      // Check if request is allowed
      if (bucket.tokens > 0) {
        bucket.tokens -= 1;

        return {
          success: true,
          remaining: bucket.tokens,
          reset,
        };
      }

      // Rate limit exceeded
      const retryAfter = Math.ceil((reset - now) / 1000);

      return {
        success: false,
        remaining: 0,
        reset,
        retryAfter,
      };
    },

    /**
     * Reset the rate limit for a specific identifier
     * Useful for testing or manual intervention
     */
    reset: (identifier: string): void => {
      const key = `${identifier}:${config.interval}:${config.limit}`;
      buckets.delete(key);
    },

    /**
     * Get current status without consuming a token
     */
    status: (identifier: string): RateLimitResult | null => {
      const now = Date.now();
      const key = `${identifier}:${config.interval}:${config.limit}`;
      const bucket = buckets.get(key);

      if (!bucket) {
        return {
          success: true,
          remaining: config.limit,
          reset: now + config.interval,
        };
      }

      const timeSinceLastRefill = now - bucket.lastRefill;
      const tokensToAdd =
        Math.floor(timeSinceLastRefill / config.interval) * config.limit;
      const currentTokens = Math.min(config.limit, bucket.tokens + tokensToAdd);
      const reset = bucket.lastRefill + config.interval;

      return {
        success: currentTokens > 0,
        remaining: currentTokens,
        reset,
        retryAfter:
          currentTokens > 0 ? undefined : Math.ceil((reset - now) / 1000),
      };
    },
  };
}

/**
 * Pre-configured rate limiters for different API endpoints
 */

// Public API endpoints: 10 requests per minute
export const publicApiLimiter = createRateLimiter({
  interval: 60 * 1000, // 1 minute
  limit: 10,
});

// Admin API endpoints: 20 requests per minute
export const adminApiLimiter = createRateLimiter({
  interval: 60 * 1000, // 1 minute
  limit: 20,
});

// Authentication endpoints: 5 requests per minute
export const authLimiter = createRateLimiter({
  interval: 60 * 1000, // 1 minute
  limit: 5,
});

// Export endpoints: 3 requests per minute (resource-intensive)
export const exportLimiter = createRateLimiter({
  interval: 60 * 1000, // 1 minute
  limit: 3,
});

/**
 * Extract IP address from request
 * Handles proxies and cloudflare
 */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);

  // Check common proxy headers
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default value for development
  return "127.0.0.1";
}

/**
 * Cleanup old buckets periodically to prevent memory leaks
 * Should be called periodically (e.g., every hour)
 */
export function cleanupOldBuckets(maxAge: number = 3600000): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  buckets.forEach((bucket, key) => {
    if (now - bucket.lastRefill > maxAge) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => buckets.delete(key));
}

// Cleanup every hour
if (typeof setInterval !== "undefined") {
  setInterval(() => cleanupOldBuckets(), 3600000);
}
