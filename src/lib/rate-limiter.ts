/**
 * rate-limiter.ts - Simple In-Memory Sliding Window Rate Limiter
 * Secures public API endpoints against denial of service without external Redis overhead.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipCache = new Map<string, RateLimitRecord>();

// Cleanup stale records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    ipCache.forEach((record, ip) => {
      record.timestamps = record.timestamps.filter(t => now - t < 60000);
      if (record.timestamps.length === 0) {
        ipCache.delete(ip);
      }
    });
  }, 300000);
}

export function checkRateLimit(
  ip: string,
  limitPerMinute: number = 60
): { allowed: boolean; remaining: number; resetTimeMs: number } {
  const now = Date.now();
  const windowMs = 60000;
  
  let record = ipCache.get(ip);
  if (!record) {
    record = { timestamps: [] };
    ipCache.set(ip, record);
  }

  // Remove timestamps outside window
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);

  if (record.timestamps.length >= limitPerMinute) {
    const oldest = record.timestamps[0];
    const resetTimeMs = windowMs - (now - oldest);
    return {
      allowed: false,
      remaining: 0,
      resetTimeMs: Math.max(0, resetTimeMs)
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limitPerMinute - record.timestamps.length,
    resetTimeMs: windowMs
  };
}
