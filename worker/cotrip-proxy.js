/**
 * Eagle Eyes SLV — CDOT COtrip data-feed proxy (Cloudflare Worker)
 * ----------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * Eagle Eyes is a static page on GitHub Pages. It has no server. That creates
 * two hard constraints for any live traffic source:
 *
 *   1. CORS. Verified directly (Aug 7, 2026): cotrip.org's own /api/graphql
 *      endpoint needs no key and returns real live CDOT data, but its preflight
 *      returns 200 with NO Access-Control-Allow-Origin header, so a browser
 *      fetch from jameskeithharwood.com fails outright. (Camera *images* work
 *      because <img> is exempt from CORS. JSON is not.)
 *
 *   2. Key exposure. The Eagle-Eyes-SLV repo is PUBLIC. An API key committed
 *      into index.html is a published secret, not a configured one.
 *
 * This Worker solves both: it holds the CDOT key as a Cloudflare secret (never
 * in git), calls CDOT server-side where CORS does not apply, and returns the
 * result to the page with proper CORS headers.
 *
 * SECURITY POSTURE — this is deliberately NOT an open proxy:
 *   - Requests are only accepted from an allowlisted origin.
 *   - Only allowlisted upstream paths are forwarded (no arbitrary relay).
 *   - The key is injected here and never travels to the browser.
 *
 * SETUP (see worker/README.md — James does these, they involve an account/secret):
 *   wrangler secret put COTRIP_API_KEY
 */

// Origins permitted to call this Worker.
const ALLOWED_ORIGINS = [
  'https://jameskeithharwood.com',
  'https://jkh2.github.io',
  'http://localhost:8791',   // local testing (python -m http.server 8791)
];

// Upstream feeds this Worker will forward, keyed by the lowercase path callers
// use. Values are CDOT's real endpoint names, which are camelCase and
// CASE-SENSITIVE -- "roadconditions" 404s, "roadConditions" works.
//
// Verified Aug 7, 2026 without a key: this API discriminates usefully between
// "endpoint exists but you're unauthorized" (403 Not Authorized) and "no such
// endpoint" (404 "The current request is not defined by this API"), so the real
// surface below was mapped by probing for 403s.
//
// James's subscription ("Traveler Information", Approved) covers the first four.
// signs/speed/destinations are real endpoints but may belong to a different
// subscription group -- expect 403 on those until confirmed.
const FEEDS = {
  incidents:      'incidents',
  plannedevents:  'plannedEvents',
  weatherstations:'weatherStations',
  roadconditions: 'roadConditions',
  signs:          'signs',
  speed:          'speed',
  destinations:   'destinations',
};

// Base URL and auth style confirmed against Colorado DFPC-CoE's own production
// ETL against this API (github.com/dfpc-coe/etl-cotrip-incidents, task.ts):
//   new URL('/api/v1/incidents', 'https://data.cotrip.org/')
//   url.searchParams.append('apiKey', token)
// Auth is a QUERY PARAMETER, not an Authorization header.
const UPSTREAM_BASE = 'https://data.cotrip.org/api/v1';

const CACHE_SECONDS = 60; // Be a good citizen; also keeps us well under quota.

// Accepted names for the API-key secret, in preference order. COTRIP_API_KEY is
// the intended one, but Cloudflare's dashboard makes it easy to land on a
// differently-cased or dashed name (and its Worker-name field enforces
// lowercase-and-dashes, which is easy to mistake for the variable-name rule).
// Rather than make the deploy depend on getting a label exactly right, accept
// any of these and report clearly when none is present.
const KEY_NAMES = ['COTRIP_API_KEY', 'cotrip-api-key', 'cotrip_api_key', 'COTRIP_KEY', 'cotrip-proxy'];

function resolveKey(env) {
  for (const n of KEY_NAMES) {
    const v = env[n];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function deny(status, message, origin) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin || 'null') },
  });
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin);

    if (request.method === 'OPTIONS') {
      return allowed
        ? new Response(null, { status: 204, headers: corsHeaders(origin) })
        : deny(403, 'Origin not allowed', 'null');
    }
    if (request.method !== 'GET') return deny(405, 'Method not allowed', origin);
    if (!allowed) return deny(403, 'Origin not allowed', 'null');

    // Validate the REQUEST before reporting on server config: a bad path should
    // be reported as a bad path regardless of whether the key happens to be set.
    const url = new URL(request.url);
    const requested = url.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    const feed = FEEDS[requested];
    if (!feed) {
      return deny(404, `Unknown feed "${requested}". Allowed: ${Object.keys(FEEDS).join(', ')}`, origin);
    }

    const apiKey = resolveKey(env);
    if (!apiKey) {
      // Fail loudly, and name what was actually looked for vs. what exists, so a
      // naming mismatch is diagnosable at a glance. A silent empty result here
      // would reproduce exactly the bug this dashboard just fixed in
      // fetchSpaceWeather(): a dead data path that looked fine because nothing
      // ever reported it. (Only binding NAMES are listed -- never values.)
      const present = Object.keys(env).filter(k => typeof env[k] === 'string');
      return deny(500,
        `No API key secret found. Looked for: ${KEY_NAMES.join(', ')}. ` +
        `Secrets currently bound: ${present.length ? present.join(', ') : '(none)'}`,
        origin);
    }

    // Forward only caller-supplied paging params; never forward arbitrary headers.
    const upstream = new URL(`${UPSTREAM_BASE}/${feed}`);
    for (const k of ['offset', 'limit']) {
      const v = url.searchParams.get(k);
      if (v !== null) upstream.searchParams.set(k, v);
    }
    // Auth goes on the query string (CDOT's scheme), added last and only here --
    // it never reaches the browser.
    upstream.searchParams.set('apiKey', apiKey);

    // Cache key deliberately EXCLUDES the apiKey, so the secret never becomes
    // part of a cache identifier and a rotated key doesn't orphan the cache.
    const cache = caches.default;
    const keyless = new URL(upstream.toString());
    keyless.searchParams.delete('apiKey');
    const cacheKey = new Request(keyless.toString(), { method: 'GET' });
    let hit = await cache.match(cacheKey);

    if (!hit) {
      let res;
      try {
        res = await fetch(upstream.toString(), { headers: { 'Accept': 'application/json' } });
      } catch (e) {
        return deny(502, `Upstream fetch failed: ${e}`, origin);
      }
      if (!res.ok) {
        // 403 here most likely means this feed isn't in the account's subscription
        // group, which is a different problem from a bad key -- say so plainly.
        const hint = res.status === 403
          ? ' (403 = key rejected, or this feed is outside your subscription group)'
          : '';
        return deny(502, `Upstream returned ${res.status}${hint}`, origin);
      }

      hit = new Response(res.body, res);
      hit.headers.set('Cache-Control', `public, max-age=${CACHE_SECONDS}`);
      ctx.waitUntil(cache.put(cacheKey, hit.clone()));
    }

    // Optional bounding-box filter, applied HERE rather than upstream so the
    // cached copy stays whole and one cache entry serves every bbox.
    // Reason this exists: roadConditions returns ~3.6 MB statewide (dense
    // LineString geometry). Sending that to a phone on cell data is not
    // acceptable, and filtering in the browser would still transfer all of it.
    const bbox = ['minLat','maxLat','minLon','maxLon'].map(k => parseFloat(url.searchParams.get(k)));
    if (bbox.every(Number.isFinite)) {
      const [minLat, maxLat, minLon, maxLon] = bbox;
      try {
        const data = await hit.clone().json();
        if (data && Array.isArray(data.features)) {
          const before = data.features.length;
          data.features = data.features.filter(f => {
            const g = f && f.geometry;
            if (!g || !g.coordinates) return false;
            // Handles Point ([lon,lat]) and LineString/MultiLineString (nested
            // arrays): keep the feature if ANY vertex falls inside the box.
            const anyInside = (c) => Array.isArray(c[0])
              ? c.some(anyInside)
              : (typeof c[0] === 'number' && typeof c[1] === 'number' &&
                 c[1] >= minLat && c[1] <= maxLat && c[0] >= minLon && c[0] <= maxLon);
            return anyInside(g.coordinates);
          });
          data.filtered = { before, after: data.features.length, bbox: { minLat, maxLat, minLon, maxLon } };
          const body = JSON.stringify(data);
          const filtered = new Response(body, { status: 200 });
          filtered.headers.set('Content-Type', 'application/json');
          for (const [k, v] of Object.entries(corsHeaders(origin))) filtered.headers.set(k, v);
          filtered.headers.set('Cache-Control', `public, max-age=${CACHE_SECONDS}`);
          return filtered;
        }
      } catch (e) {
        // Filtering must never turn a working feed into a failure -- fall through
        // and return the unfiltered payload rather than erroring the caller.
        console.warn('bbox filter failed, returning unfiltered:', String(e));
      }
    }

    const out = new Response(hit.body, hit);
    for (const [k, v] of Object.entries(corsHeaders(origin))) out.headers.set(k, v);
    out.headers.set('Content-Type', 'application/json');
    return out;
  },
};
