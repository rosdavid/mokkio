/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  createRateLimiter,
  publicApiLimiter,
  adminApiLimiter,
  exportLimiter,
  authLimiter,
  getClientIp,
} from "@/lib/rate-limit";

describe("Rate Limiting", () => {
  describe("createRateLimiter", () => {
    it("should allow requests within the limit", async () => {
      const limiter = createRateLimiter({ interval: 60000, limit: 5 });
      const ip = "192.168.1.1";

      // First request should succeed
      const result1 = await limiter.check(ip);
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(4);

      // Second request should also succeed
      const result2 = await limiter.check(ip);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(3);
    });

    it("should block requests after exceeding the limit", async () => {
      const limiter = createRateLimiter({ interval: 60000, limit: 3 });
      const ip = "192.168.1.2";

      // Use up all tokens
      await limiter.check(ip); // 2 remaining
      await limiter.check(ip); // 1 remaining
      await limiter.check(ip); // 0 remaining

      // Next request should be blocked
      const result = await limiter.check(ip);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it("should track different IPs separately", async () => {
      const limiter = createRateLimiter({ interval: 60000, limit: 2 });
      const ip1 = "192.168.1.3";
      const ip2 = "192.168.1.4";

      // Use up tokens for ip1
      await limiter.check(ip1);
      await limiter.check(ip1);
      const result1 = await limiter.check(ip1);
      expect(result1.success).toBe(false);

      // ip2 should still have tokens
      const result2 = await limiter.check(ip2);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(1);
    });

    it("should reset tokens after the interval", async () => {
      const limiter = createRateLimiter({ interval: 100, limit: 2 }); // 100ms interval
      const ip = "192.168.1.5";

      // Use up all tokens
      await limiter.check(ip);
      await limiter.check(ip);

      const blocked = await limiter.check(ip);
      expect(blocked.success).toBe(false);

      // Wait for interval to pass
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should have tokens again
      const allowed = await limiter.check(ip);
      expect(allowed.success).toBe(true);
    });

    it("should reset rate limit for specific identifier", async () => {
      const limiter = createRateLimiter({ interval: 60000, limit: 2 });
      const ip = "192.168.1.6";

      // Use up tokens
      await limiter.check(ip);
      await limiter.check(ip);

      const blocked = await limiter.check(ip);
      expect(blocked.success).toBe(false);

      // Reset the limiter
      limiter.reset(ip);

      // Should be allowed again
      const allowed = await limiter.check(ip);
      expect(allowed.success).toBe(true);
      expect(allowed.remaining).toBe(1);
    });

    it("should return correct metadata", async () => {
      const limiter = createRateLimiter({ interval: 60000, limit: 10 });
      const ip = "192.168.1.7";

      const result = await limiter.check(ip);

      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("remaining");
      expect(result).toHaveProperty("reset");
      expect(typeof result.success).toBe("boolean");
      expect(typeof result.remaining).toBe("number");
      expect(typeof result.reset).toBe("number");
    });

    it("should return retryAfter when rate limited", async () => {
      const limiter = createRateLimiter({ interval: 60000, limit: 1 });
      const ip = "192.168.1.8";

      await limiter.check(ip); // Use the only token

      const result = await limiter.check(ip);
      expect(result.success).toBe(false);
      expect(result.retryAfter).toBeDefined();
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.retryAfter).toBeLessThanOrEqual(60);
    });
  });

  describe("Pre-configured limiters", () => {
    beforeEach(() => {
      // Reset all limiters before each test
      publicApiLimiter.reset("test-ip");
      adminApiLimiter.reset("test-ip");
      exportLimiter.reset("test-ip");
      authLimiter.reset("test-ip");
    });

    it("publicApiLimiter should have 10 requests per minute", async () => {
      const ip = "test-public-api";
      publicApiLimiter.reset(ip);

      // Make 10 requests (should all succeed)
      for (let i = 0; i < 10; i++) {
        const result = await publicApiLimiter.check(ip);
        expect(result.success).toBe(true);
      }

      // 11th request should fail
      const result = await publicApiLimiter.check(ip);
      expect(result.success).toBe(false);
    });

    it("adminApiLimiter should have 20 requests per minute", async () => {
      const ip = "test-admin-api";
      adminApiLimiter.reset(ip);

      // Make 20 requests (should all succeed)
      for (let i = 0; i < 20; i++) {
        const result = await adminApiLimiter.check(ip);
        expect(result.success).toBe(true);
      }

      // 21st request should fail
      const result = await adminApiLimiter.check(ip);
      expect(result.success).toBe(false);
    });

    it("exportLimiter should have 3 requests per minute", async () => {
      const ip = "test-export";
      exportLimiter.reset(ip);

      // Make 3 requests (should all succeed)
      for (let i = 0; i < 3; i++) {
        const result = await exportLimiter.check(ip);
        expect(result.success).toBe(true);
      }

      // 4th request should fail
      const result = await exportLimiter.check(ip);
      expect(result.success).toBe(false);
    });

    it("authLimiter should have 5 requests per minute", async () => {
      const ip = "test-auth";
      authLimiter.reset(ip);

      // Make 5 requests (should all succeed)
      for (let i = 0; i < 5; i++) {
        const result = await authLimiter.check(ip);
        expect(result.success).toBe(true);
      }

      // 6th request should fail
      const result = await authLimiter.check(ip);
      expect(result.success).toBe(false);
    });
  });

  describe("getClientIp", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-forwarded-for": "203.0.113.1, 198.51.100.1",
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe("203.0.113.1");
    });

    it("should extract IP from x-real-ip header", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-real-ip": "203.0.113.2",
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe("203.0.113.2");
    });

    it("should extract IP from cf-connecting-ip header (Cloudflare)", () => {
      const request = new Request("http://localhost", {
        headers: {
          "cf-connecting-ip": "203.0.113.3",
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe("203.0.113.3");
    });

    it("should prioritize x-forwarded-for over other headers", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-forwarded-for": "203.0.113.4",
          "x-real-ip": "203.0.113.5",
          "cf-connecting-ip": "203.0.113.6",
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe("203.0.113.4");
    });

    it("should fallback to 127.0.0.1 when no headers present", () => {
      const request = new Request("http://localhost");

      const ip = getClientIp(request);
      expect(ip).toBe("127.0.0.1");
    });

    it("should handle x-forwarded-for with multiple IPs", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-forwarded-for": "203.0.113.7, 198.51.100.2, 192.0.2.1",
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe("203.0.113.7"); // Should return first IP
    });
  });

  describe("status method", () => {
    it("should check status without consuming tokens", async () => {
      const limiter = createRateLimiter({ interval: 60000, limit: 5 });
      const ip = "192.168.1.9";

      // Check status without consuming
      const status1 = limiter.status(ip);
      expect(status1?.remaining).toBe(5);

      // Actually consume a token
      await limiter.check(ip);

      // Status should show reduced tokens
      const status2 = limiter.status(ip);
      expect(status2?.remaining).toBe(4);

      // Check status again - shouldn't consume another token
      const status3 = limiter.status(ip);
      expect(status3?.remaining).toBe(4);
    });

    it("should return null for new identifier", () => {
      const limiter = createRateLimiter({ interval: 60000, limit: 5 });
      const ip = "192.168.1.10";

      const status = limiter.status(ip);
      expect(status).not.toBeNull();
      expect(status?.remaining).toBe(5);
    });
  });
});
