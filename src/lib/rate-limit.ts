const ipMap = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;  // max requests per window

export function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  let timestamps = ipMap.get(ip);

  // Clean old entries
  if (timestamps) {
    timestamps = timestamps.filter((t) => t > windowStart);
  }

  if (!timestamps || timestamps.length < MAX_REQUESTS) {
    const updated = [...(timestamps || []), now];
    ipMap.set(ip, updated);
    return { allowed: true, remaining: MAX_REQUESTS - updated.length };
  }

  return { allowed: false, remaining: 0 };
}
