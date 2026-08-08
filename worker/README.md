# CDOT Traffic Proxy — Setup

Live CDOT traffic data can't be fetched directly by Eagle Eyes. This Worker is the
bridge. Written Aug 7, 2026.

## Why a proxy at all

Two constraints, both verified directly rather than assumed:

1. **CORS.** cotrip.org's own `/api/graphql` needs no key and returns real live CDOT
   data (confirmed: road work in the valley, statewide road reports including an
   active closure). But its CORS preflight returns `200` with **no**
   `Access-Control-Allow-Origin` header, so a browser fetch from
   `jameskeithharwood.com` fails with `TypeError: Failed to fetch`. Camera *images*
   work because `<img>` is exempt from CORS. JSON is not.
2. **Key exposure.** This repo is public. An API key in `index.html` is a published
   secret. It has to live somewhere else.

A Cloudflare Worker fixes both: it calls CDOT server-side (no CORS there) and holds
the key as a secret outside git. Free tier is 100,000 requests/day — far beyond what
this dashboard needs, especially with the built-in 60s cache.

## Steps — these are yours, not Claude's

Claude can't create accounts or handle the key in plaintext. Both steps below
involve credentials, so you do them.

### 1. Register for the CDOT data feed

Go to **https://manage-api.cotrip.org** and create a developer account.

> **Correction worth carrying:** `manage-api.cotrip.org` is the *registration
> portal*, not the data host. It serves an Angular SPA shell (HTTP 200 + HTML) for
> every path — including `/api/v1/incidents`, which makes it look like a working
> API endpoint when it isn't. **Get the real feed base URL from the developer docs
> after you log in**, then set `UPSTREAM_BASE` in `cotrip-proxy.js`. Don't trust
> the placeholder currently in that file; it's a guess and is marked as one.

While you're in the docs, note the real auth style. The Worker currently sends
`Authorization: Bearer <key>`; if CDOT wants `?apiKey=` or a custom header instead,
that's a one-line change.

### 2. Deploy the Worker

```bash
npm install -g wrangler
wrangler login                      # opens your browser; you authorize
wrangler init cotrip-proxy          # or drop this file into an existing project
wrangler secret put COTRIP_API_KEY  # paste the key at the prompt — it goes
                                    # straight into Cloudflare, never into git
wrangler deploy
```

Wrangler prompts for the key in your terminal. Don't paste it into chat — Claude
never needs to see it, and shouldn't.

### 3. Tell Claude the Worker URL

The deployed URL (e.g. `https://cotrip-proxy.<you>.workers.dev`) is **not** a
secret — it's just an address, and the Worker refuses any origin not on its
allowlist. Hand that over and Claude wires the dashboard to it.

## Verify it works

```bash
# Should return data:
curl -H "Origin: https://jameskeithharwood.com" \
     "https://cotrip-proxy.<you>.workers.dev/incidents?minLat=37&maxLat=38.5&minLon=-106.5&maxLon=-105"

# Should return 403 — proves it isn't an open proxy:
curl -H "Origin: https://example.com" \
     "https://cotrip-proxy.<you>.workers.dev/incidents"

# Should return 500 with a clear message if the secret was never set:
#   {"error":"COTRIP_API_KEY secret is not configured on this Worker"}
```

That last one is deliberate. It fails **loudly**. A silent empty response would
reproduce exactly the bug fixed in `fetchSpaceWeather()` on Aug 7, 2026 — a dead
NOAA endpoint sitting behind a bare `if (r2.ok)`, leaving a blank field on the page
with no console error, for an unknown length of time. Absence of data should
announce itself.

## Security notes

- **Origin allowlist** — only `jameskeithharwood.com`, `jkh2.github.io`, and
  `localhost:8791` are accepted.
- **Path allowlist** — only the named feeds are forwarded, so a leaked Worker URL
  can't be used as a general-purpose relay.
- **Key never reaches the browser.** It's injected server-side only.
- **60s cache** — keeps load off CDOT and well inside quota.
