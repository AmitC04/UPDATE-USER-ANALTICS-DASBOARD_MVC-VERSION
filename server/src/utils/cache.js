/**
 * In-Memory LRU Cache Utility
 * - Drop-in replacement pattern (same API); can be swapped for Redis without
 *   changing call sites.
 * - Fixes Backend Issue #5  : bounded memory via LRU eviction (MAX_CACHE_SIZE).
 * - Fixes Backend Issue #23 : getCacheStats() for observability.
 */

const { MAX_CACHE_SIZE } = require('./constants');

/** @type {Map<string, {value: any, expiresAt: number}>} */
const store = new Map();
let _hits = 0;
let _misses = 0;

/**
 * Get a cached value by key.
 * Promotes entry to MRU position on hit.
 * Returns null if not found or expired.
 * @param {string} key
 * @returns {*}
 */
function get(key) {
  const entry = store.get(key);
  if (!entry) {
    _misses++;
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    _misses++;
    return null;
  }
  // LRU: re-insert to move to tail (most recently used)
  store.delete(key);
  store.set(key, entry);
  _hits++;
  return entry.value;
}

/**
 * Set a value in the cache.
 * If the store is at capacity, the least-recently-used entry is evicted.
 * @param {string} key
 * @param {*} value
 * @param {number} ttlSeconds - TTL in seconds (default: 300 = 5 min)
 */
function set(key, value, ttlSeconds = 300) {
  // Evict LRU (oldest insertion) when at max capacity
  if (store.size >= MAX_CACHE_SIZE && !store.has(key)) {
    const lruKey = store.keys().next().value;
    store.delete(lruKey);
  }
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Delete a specific cache key.
 * @param {string} key
 */
function del(key) {
  store.delete(key);
}

/**
 * Delete all keys that start with the given prefix.
 * Useful for targeted cache invalidation (e.g. flush all funnel keys).
 * @param {string} prefix
 */
function delByPrefix(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/**
 * Clear all cached entries and reset statistics.
 */
function flush() {
  store.clear();
  _hits = 0;
  _misses = 0;
}

/**
 * Return cache health statistics for monitoring.
 * Fixes Backend Issue #23.
 * @returns {{ size: number, maxSize: number, hits: number, misses: number, hitRate: string }}
 */
function getCacheStats() {
  const total = _hits + _misses;
  return {
    size: store.size,
    maxSize: MAX_CACHE_SIZE,
    hits: _hits,
    misses: _misses,
    hitRate: total > 0 ? `${(((_hits / total) * 100)).toFixed(1)}%` : '0%',
  };
}

module.exports = { get, set, del, delByPrefix, flush, getCacheStats };
