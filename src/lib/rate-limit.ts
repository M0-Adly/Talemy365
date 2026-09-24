interface RateLimitRecord {
  count: number
  resetTime: number
}

// In-memory sliding window rate limiter
const store = new Map<string, RateLimitRecord>()

interface RateLimitOptions {
  maxAttempts: number
  windowMs: number
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = store.get(identifier)

  // Clean up expired entries periodically
  if (store.size > 1000) {
    for (const [key, val] of store.entries()) {
      if (now > val.resetTime) {
        store.delete(key)
      }
    }
  }

  if (!record || now > record.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    })
    return {
      success: true,
      remaining: options.maxAttempts - 1,
      resetTime: now + options.windowMs,
    }
  }

  if (record.count >= options.maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  record.count += 1
  return {
    success: true,
    remaining: options.maxAttempts - record.count,
    resetTime: record.resetTime,
  }
}

export function resetRateLimit(identifier: string): void {
  store.delete(identifier)
}
