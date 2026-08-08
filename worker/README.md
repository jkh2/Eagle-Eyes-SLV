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
the key as an encrypted secret outside git. Free tier is 100,000 requests/day — far
beyond what this dashboard needs, especially with the built-in 60s cache.

## The API, as actually verified (Aug 7, 2026)

| | |
|---|---|
| Base URL | `https://data.cotrip.org/api/v1` |
| Auth | query parameter `?apiKey=<key>` — **not** an `Authorization` header |
| Paging | `offset` |

Confirmed two ways: Colorado DFPC-CoE's own production ETL against this API
([`dfpc-coe/etl-cotrip-incidents`](https://github.com/dfpc-coe/etl-cotrip-incidents),
`task.ts`), and direct probing of the live host.

**Real endpoints** (camelCase, **case-sensitive** — `roadconditions` 404s,
`roadConditions` works):

`incidents` · `plannedEvents` · `weatherStations` · `roadConditions` · `signs` ·
`speed` · `destinations`

The "Traveler Information" subscription covers the first four. The last three are
real endpoints but may sit in a different subscription group — expect `403` there.

> **How this was mapped without a key:** the API distinguishes `403 Not Authorized`
> (endpoint exists, you're unauthorized) from `404 "The current request is not
> defined by this API"` (no such endpoint). That's a genuinely discriminating
> signal, so probing for 403s reveals the real surface. Worth contrasting with
> cotrip's GraphQL layer names, where a deliberately bogus layer returns a clean
> `0` results with no error — there, a zero proves nothing.

> **Two earlier guesses that were wrong**, kept here as a caution: the first draft
> of this Worker used `data-api.cotrip.org` and `Authorization: Bearer`. Both were
> plausible and both were wrong. `manage-api.cotrip.org` is the *registration
> portal*, not the data host — it serves an Angular SPA shell (HTTP 200 + HTML) for
> every path including `/api/v1/incidents`, which reads as a live endpoint but
> isn't.

## Setup — all point-and-click, no terminal needed

Account creation and the key itself are James's steps by design; the key never
passes through the assistant or this repo.

1. **Free Cloudflare account** — cloudflare.com.
2. **Workers & Pages → Create → Create Worker.** Name it `cotrip-proxy`, click
   **Deploy** (deploys a placeholder — fine).
3. **Edit code.** Replace everything with the contents of `cotrip-proxy.js`, then
   **Deploy**.
4. **Settings → Variables and Secrets → Add:**
   - Name: `COTRIP_API_KEY`
   - Value: your key from https://manage-api.cotrip.org
   - Type: **Secret** (not "Text" — Secret encrypts it and hides it afterward)
   - Save.

The Worker URL (`https://cotrip-proxy.<you>.workers.dev`) is not a secret — it's an
address, and the Worker refuses any origin not on its allowlist.

## Verify it works

```bash
# Should return incident JSON:
curl -H "Origin: https://jameskeithharwood.com" \
     "https://cotrip-proxy.<you>.workers.dev/incidents"

# Should return 403 — proves it isn't an open proxy:
curl -H "Origin: https://example.com" \
     "https://cotrip-proxy.<you>.workers.dev/incidents"

# Should return a clear 500 if the secret was never set:
#   {"error":"COTRIP_API_KEY secret is not configured on this Worker"}
```

That last one is deliberate. It fails **loudly**. A silent empty response would
reproduce exactly the bug fixed in `fetchSpaceWeather()` on Aug 7, 2026 — a dead
NOAA endpoint sitting behind a bare `if (r2.ok)`, leaving a blank field on the page
with no console error, for an unknown length of time. Absence of data should
announce itself.

## Security notes

- **Origin allowlist** — only `jameskeithharwood.com`, `jkh2.github.io`, and
  `localhost:8791`.
- **Feed allowlist** — only the named feeds are forwarded, so a leaked Worker URL
  can't become a general-purpose relay.
- **Key never reaches the browser**, and is deliberately excluded from the cache key
  so it never becomes part of a cache identifier.
- **60s cache** — keeps load off CDOT and well inside quota.
