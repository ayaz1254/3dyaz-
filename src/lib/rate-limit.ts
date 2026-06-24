/**
 * Rate limiter using Upstash Redis (serverless-compatible).
 *
 * Falls back to in-memory if UPSTASH_REDIS_URL is not configured.
 *
 * Environment variables:
 *   UPSTASH_REDIS_URL      - https://your-region.upstash.io
 *   UPSTASH_REDIS_TOKEN    - Upstash REST API token
 *
 * Get these from https://console.upstash.com → Create Database → REST API
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;  // max requests per window

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit {
  if (!ratelimit) {
    const redisUrl = process.env.UPSTASH_REDIS_URL;
    const redisToken = process.env.UPSTASH_REDIS_TOKEN;

    if (redisUrl && redisToken) {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_MS}ms`),
        analytics: true,
        prefix: "ratelimit",
      });
    } else {
      // Fallback: in-memory (still works locally, not on multi-instance)
      ratelimit = createFallback();
    }
  }
  return ratelimit;
}

/**
 * In-memory fallback for local development without Upstash.
 */
function createFallback(): Ratelimit {
  const ipMap = new Map<string, number[]>();

  return {
    limit: async (id: string) => {
      const now = Date.now();
      const windowStart = now - WINDOW_MS;
      let timestamps = ipMap.get(id);

      if (timestamps) {
        timestamps = timestamps.filter((t) => t > windowStart);
      }

      if (!timestamps || timestamps.length < MAX_REQUESTS) {
        const updated = [...(timestamps || []), now];
        ipMap.set(id, updated);
        return {
          success: true,
          limit: MAX_REQUESTS,
          remaining: MAX_REQUESTS - updated.length,
          reset: now + WINDOW_MS,
        };
      }

      return {
        success: false,
        limit: MAX_REQUESTS,
        remaining: 0,
        reset: (timestamps[0] || now) + WINDOW_MS,
      };
    },
  } as Ratelimit;
}

export async function rateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const rl = getRatelimit();
  const result = await rl.limit(ip);
  return { allowed: result.success, remaining: result.remaining };
}
