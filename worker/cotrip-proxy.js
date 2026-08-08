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

// Upstream paths this Worker will forward. Anything else is refused, so a
// leaked Worker URL can't be turned into a general-purpose relay.
const ALLOWED_PATHS = [
  'incidents',
  'roadconditions',
  'weatherstations',
  'plannedevents',
  'speed',
];

// Set once the real base URL is known from CDOT's post-registration docs.
// NOTE (Aug 7, 2026): manage-api.cotrip.org is the REGISTRATION PORTAL, not the
// data host -- it serves an Angular SPA shell (200 + HTML) for every path,
// including /api/v1/incidents, which makes it look like a live endpoint when it
// isn't. Confirm the actual feed base URL in the developer docs before trusting
// this default.
const UPSTREAM_BASE = 'https://data-api.cotrip.org/api/v1';

const CACHE_SECONDS = 60; // Be a good citizen; also keeps us well under quota.

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

    if (!env.COTRIP_API_KEY) {
      // Fail loudly. A silent empty result here would reproduce exactly the bug
      // this dashboard just fixed in fetchSpaceWeather(): a dead data path that
      // looked fine because nothing ever reported it.
      return deny(500, 'COTRIP_API_KEY secret is not configured on this Worker', origin);
    }

    const url = new URL(request.url);
    const feed = url.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (!ALLOWED_PATHS.includes(feed)) {
      return deny(404, `Unknown feed "${feed}". Allowed: ${ALLOWED_PATHS.join(', ')}`, origin);
    }

    // Forward only caller-supplied bbox-style params; never forward arbitrary headers.
    const upstream = new URL(`${UPSTREAM_BASE}/${feed}`);
    for (const k of ['minLat', 'maxLat', 'minLon', 'maxLon', 'limit', 'offset']) {
      const v = url.searchParams.get(k);
      if (v !== null) upstream.searchParams.set(k, v);
    }

    const cache = caches.default;
    const cacheKey = new Request(upstream.toString(), { method: 'GET' });
    let hit = await cache.match(cacheKey);

    if (!hit) {
      let res;
      try {
        res = await fetch(upstream.toString(), {
          headers: { 'Authorization': `Bearer ${env.COTRIP_API_KEY}`, 'Accept': 'application/json' },
        });
      } catch (e) {
        return deny(502, `Upstream fetch failed: ${e}`, origin);
      }
      if (!res.ok) return deny(502, `Upstream returned ${res.status}`, origin);

      hit = new Response(res.body, res);
      hit.headers.set('Cache-Control', `public, max-age=${CACHE_SECONDS}`);
      ctx.waitUntil(cache.put(cacheKey, hit.clone()));
    }

    const out = new Response(hit.body, hit);
    for (const [k, v] of Object.entries(corsHeaders(origin))) out.headers.set(k, v);
    out.headers.set('Content-Type', 'application/json');
    return out;
  },
};
