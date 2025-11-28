type CacheEntry<T> = {
  value: T
  expiresAt: number
}

const cacheStore = new Map<string, CacheEntry<any>>()

export const getCache = <T>(key: string): T | null => {
  const entry = cacheStore.get(key)
  if (!entry) return null

  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key)
    return null
  }

  return entry.value as T
}

export const setCache = <T>(key: string, value: T, ttl = 30_000) => {
  cacheStore.set(key, { value, expiresAt: Date.now() + ttl })
}

export const invalidateCacheByPrefix = (prefix: string) => {
  cacheStore.forEach((_, key) => {
    if (key.startsWith(prefix)) cacheStore.delete(key)
  })
}

export const clearCache = () => cacheStore.clear()
