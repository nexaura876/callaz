/**
 * A deliberately small in-memory limiter for the enquiry form.
 *
 * One process, one map, no dependency. It resets on deploy and it does not span
 * instances, which is fine for what it defends against: a single script hammering
 * the form. Anything more determined than that belongs at the edge, in front of
 * the app, rather than inside it.
 */
type Bucket = { count: number; expires: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/** Keeps the map from growing without bound on a long-lived instance. */
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.expires <= now) buckets.delete(key);
  }
}

export function takeToken(key: string) {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.expires <= now) {
    buckets.set(key, { count: 1, expires: now + WINDOW_MS });
    return { allowed: true as const };
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return { allowed: false as const, retryAfterMs: bucket.expires - now };
  }

  bucket.count += 1;
  return { allowed: true as const };
}
