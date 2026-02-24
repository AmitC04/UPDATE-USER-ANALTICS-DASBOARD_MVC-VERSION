/**
 * In-Memory Cache Utility
 * Issue #21 - Caching strategy for frequently accessed analytics data
 * Drop-in replacement pattern; can be swapped for Redis without changing call sites.
 */

const store = new Map();

/**
 * Get a cached value by key.
 * Returns null if not found or expired.
 */
function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * Set a value in the cache.
 * @param {string} key
 * @param {*} value
 * @param {number} ttlSeconds - Time-to-live in seconds (default: 300 = 5 min)
 */
function set(key, value, ttlSeconds = 300) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Delete a specific cache key.
 */
function del(key) {
  store.delete(key);
}

/**
 * Clear all cached entries.
 */
function flush() {
  store.clear();
}

module.exports = { get, set, del, flush };
