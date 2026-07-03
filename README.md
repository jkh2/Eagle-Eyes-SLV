# 🦅 Eagle Eyes SLV
### *Full Situational Awareness — San Luis Valley, Colorado*

> **"The ultimate zero-cost personal GEINT dashboard for the high desert."**

[![Version](https://img.shields.io/badge/version-5.1-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)
[![No Server](https://img.shields.io/badge/server-none-green)](#)
[![No Build](https://img.shields.io/badge/build-none-green)](#)
[![Single File](https://img.shields.io/badge/deployment-single%20HTML%20file-orange)](#)
[![Data Streams](https://img.shields.io/badge/live%20streams-15-purple)](#)

---

## What Is This?

Eagle Eyes SLV is a single-file, browser-based geospatial intelligence dashboard built specifically for the **San Luis Valley of Colorado** — one of the most geographically unique and geologically active valleys in North America. It aggregates live data from 15 public sources into a single tactical picture: what's in the air, what's overhead in orbit, what the weather is doing, whether the earth is moving, whether anything is burning (and exactly where via satellite), how the rivers are flowing, what minerals and fault lines are under the ground, and what unexplained phenomena have been reported in the area.

No server. No backend. No build process. No subscription fees. Open the HTML file in a browser and you have a live situational awareness station.

---

## Live Data Streams (v5.1)

| Domain | Source | Key Required | Refresh |
|--------|--------|-------------|---------|
| ✈ Aircraft | Airplanes.live ADS-B (smooth tracking) | No | 5s |
| 🛰 Satellites | Celestrak TLEs (150+ visual catalog) + satellite.js | No | 2s |
| 🌤 Weather | NWS / NOAA API | No | 10 min |
| 🌧 NEXRAD Radar | Iowa Environmental Mesonet (live precip) | No | toggle |
| ☀ Space Weather | NOAA SWPC | No | 5 min |
| 🔴 Earthquakes | USGS FDSNWS | No | 5 min |
| 🔥 Active Fires | NASA EONET + NIFC WFIGS (dual source) | No | 10 min |
| 🛰🔥 Fire Hotspots | NASA VIIRS via GIBS WMS (satellite thermal) | No | toggle |
| 🌥 GOES-West Imagery | NOAA GOES | No | toggle |
| 🔶 Fault Lines | USGS Quaternary Fault Database | No | once |
| 💧 Stream Gauges | USGS Water Services | No | 10 min |
| 💎 Mineral Deposits | USGS MRDS WFS | No | once |
| 👽 UFO Sightings | NUFORC via CORGIS | No | embedded |
| 📷 CDOT Webcams | COtrip links (12 locations) | No | — |
| 🚗 Road Traffic | Google Maps JS API | Yes (free tier) | live |
| 🤖 AI Analyst | OpenRouter (free) or OpenAI | Yes (free tier) | on demand |

**13 of 15 data streams require zero API keys.** The dashboard is fully functional out of the box.

---

## Features

### Air Domain
- Live aircraft positions via Airplanes.live ADS-B (free, no key, no auth)
- **Smooth marker tracking** — aircraft glide across the map between polls (marker cache with delta updates, no blink)
- Heading-rotated icons with military aircraft highlighting (red glow)
- Altitude filter slider — focus on commercial, GA, or military traffic
- Aircraft inspector — callsign, ICAO hex, registration, type, squawk, altitude, speed, heading, vertical rate
- Emergency squawk detection (7500/7600/7700) with automatic alerts and tactical audio
- Military aircraft flagging and alerting

### Space Domain
- Full Celestrak visual satellite catalog (~150+ brightest satellites) with live real-time propagation (satellite.js v4)
- Additional weather, resource, and station satellite groups
- Ground track projection — 90-minute orbital path drawn for satellites near SLV
- Upcoming pass calculator — scans next 6 hours, shows pass time, countdown, max elevation
- ISS proximity alert when pass is within 20 minutes
- NOAA space weather: Kp index, solar wind speed, aurora forecast, signal impact

### Weather
- Current conditions, temperature, wind, humidity, visibility, pressure from Alamosa (KALS)
- Hourly forecast from NWS
- **GOES-West GeoColor cloud imagery** overlay (toggleable)
- **NEXRAD precipitation radar** — live tiles from Iowa Environmental Mesonet (no key)

### Ground Domain
- **Dual-source wildfire detection** — NASA EONET + NIFC WFIGS perimeters merged and deduplicated
- **NASA VIIRS satellite fire hotspots** — thermal anomaly tiles from NASA GIBS WMS (375m resolution, no key). Shows exactly where fires are burning as detected from space — the same data source used by Watch Duty
- **Enriched fire inspector cards** — 15 data fields: containment %, cause, behavior, fuel type, complexity, personnel, county, land ownership, discovery date, description, distance from SLV
- Large fire highlighting — fires over 1,000 acres get larger glowing icons and DANGER-level alerts
- **USGS Quaternary Fault Lines** — 15 active faults mapped across the SLV region including the Northern and Southern Sangre de Cristo faults and Southern Sawatch fault. Color-coded by slip type (normal, sinistral, reverse). Shows the Rio Grande Rift zone in geological context alongside earthquake data
- USGS earthquakes M1.5+ within 200 miles — mapped and ranked with M3.0+ alerts
- 💧 USGS Stream Gauges — live streamflow (cfs) for all active SLV gauges via bounding box auto-discovery
- 💎 USGS Mineral Deposits — MRDS mine sites with commodity icons (🪙🟤⚪☢💎)
- 👽 UFO Sightings — 139 NUFORC reports from the SLV region (1947–2014)
- 🚗 Road traffic overlay (requires Google Maps JS API key)

### AI Intelligence Layer
- **AI Situational Awareness Brief** — 10-sentence military-style intelligence report covering fire threat, air domain, space, weather, seismic, and actionable recommendations. Fire threat leads when active
- **Interactive AI Chat** — ask questions about current dashboard conditions and get answers grounded in live sensor data
- **Automatic model fallback** — tries Llama 3.3 70B first, then Gemma 4 31B, Qwen3, Nemotron if rate limited
- Powered by OpenRouter free tier (no credit card required) or OpenAI as fallback
- **🔌 Test AI Connection** button in KEYS tab — shows exact error codes and step-by-step fix instructions
- **🗑 Clear All Keys** button — wipe all stored API keys from localStorage
- Key status indicators (✅/❌) show which keys are loaded

### Sound Engine
- **Tactical audio feedback** via Web Audio API (no external files)
- Tab click, layer toggle on/off, inspector ping, alert warning, critical alert triple beep
- 🔊/🔇 mute toggle in header

### Webcam Layer
- 12 CDOT camera locations mapped across SLV highway corridors
- Click any 📷 map marker → opens live COtrip camera view for that location
- CAMS tab with one-click access to all camera positions
- Links to Windy.com webcams, Wolf Creek Ski Area, ColoradoWebCam.net

### OSINT Tab External Links
- NASA FIRMS fire map
- Colorado Wildfire Explorer
- Watch Duty wildfire intelligence
- ⚡ Colorado Power Outage Map (PowerOutage.us)
- COtrip live cameras
- USGS Earthquake Map
- NOAA Space Weather
- Windy SLV
- FlightRadar24 SLV
- Celestrak Orbit Viz

### UI/UX
- **Mobile responsive** — bottom drawer sidebar on phones, touch-optimized, starts collapsed
- Draggable, resizable sidebar on desktop
- Entity inspector panel for any clicked map object
- Tabbed interface: Air / Space / Weather / Ground / OSINT / Cams / Keys
- ESRI World Imagery satellite basemap

---

## Quickstart

1. Open any modern browser (Chrome recommended)
2. **[Try Eagle Eyes SLV](https://jkh2.github.io/Eagle-Eyes-SLV/)**
3. Everything loads immediately — no keys required for 13 of 15 streams
4. **For AI features (free):** Sign up at [openrouter.ai](https://openrouter.ai) → Settings → Keys → Create key → paste in KEYS tab → Save → Test Connection
5. Optional: Google Maps JS API key for live traffic overlay

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v5.1 | July 2026 | NASA VIIRS satellite fire hotspot layer, USGS Quaternary fault lines (15 faults, Rio Grande Rift), AI model fallback chain (4 models), test/clear key buttons, power outage + Watch Duty OSINT links, mobile layout fixes |
| v5.0 | June 2026 | Dual-source fire detection (EONET + NIFC WFIGS), enriched fire inspector (15 fields + distance), smooth aircraft tracking, NEXRAD radar, OpenRouter free AI (brief + chat), mobile responsive, tactical sound engine |
| v4.1 | March 2026 | USGS stream gauges, MRDS mineral deposits, NUFORC UFO sightings (139 records), traffic moved to Ground tab |
| v4.0 | March 2026 | Airplanes.live ADS-B, 150+ satellites (Celestrak visual catalog), CDOT webcams |
| v3.0 | Feb 2026 | Six-domain integration: aircraft, satellites, weather, space weather, earthquakes, fires. Alert system, AI brief, pass prediction |
| v2.0 | Feb 2026 | Core bug fixes: OpenSky null crash, satellite.js version, Google Traffic loading |
| v1.0 | Jan 2026 | Initial Leaflet build, pivoted from Cesium 3D globe |

---

## Architecture

```
index.html                          ← entire application (~2,750 lines, ~124KB)
│
├── Leaflet.js (CDN)                ← 2D map engine
├── satellite.js v4.1.3 (CDN)      ← TLE orbital mechanics
├── Web Audio API                   ← tactical sound (no external files)
│
├── Free Data Layer (13 sources)
│   ├── Airplanes.live              ← ADS-B aircraft (smooth marker cache)
│   ├── Celestrak TLE API           ← orbital elements
│   ├── NWS/NOAA REST API           ← weather
│   ├── NOAA SWPC                   ← space weather
│   ├── USGS FDSNWS                 ← seismic events
│   ├── NASA EONET                  ← wildfire events
│   ├── NIFC WFIGS ArcGIS           ← fire perimeters + enriched data
│   ├── NASA GIBS WMS               ← VIIRS satellite fire hotspots
│   ├── Iowa Env. Mesonet           ← NEXRAD precipitation radar
│   ├── USGS Active Faults ArcGIS  ← Quaternary fault lines
│   ├── USGS Water Services         ← stream gauges
│   ├── USGS MRDS WFS               ← mineral deposits
│   ├── NUFORC/CORGIS (embedded)    ← UFO sightings
│   └── NOAA GOES tiles             ← cloud imagery
│
├── Optional Keyed Services
│   ├── Google Maps JS API          ← traffic overlay
│   └── OpenRouter / OpenAI         ← AI analyst brief + chat
│
└── Intelligence Layer
    ├── Alert aggregation (military, squawk, seismic, fire)
    ├── Satellite pass prediction
    ├── AI brief (fire-priority, 4-model fallback)
    └── Interactive AI chat (live sensor context)
```

---

## Why the San Luis Valley?

The San Luis Valley is one of the most geologically unique locations in North America — a high desert basin at 7,500 feet elevation, surrounded by the Sangre de Cristo and San Juan mountain ranges, sitting atop the **Rio Grande Rift**. It sees real air traffic, visible satellite passes, regular seismic activity along mapped fault lines, severe seasonal wildfire risk, and dramatic weather. The valley holds hundreds of historic mining sites, the Rio Grande and its tributaries, and a long history of unexplained aerial phenomena.

It also happens to be home to the people who built this.

---

## The Vision: Sentinel Node Mesh Network

Eagle Eyes SLV is the visualization platform. The next phase builds the sensor infrastructure to feed it.

The **Sentinel Node Mesh Network** is a planned private, solar-powered, LoRa-connected array of environmental monitoring stations deployed across the valley peaks. Each node collects camera, environmental, smoke/particulate, and acoustic data, transmitting through a LoRa mesh to a Starlink-connected gateway. Eagle Eyes displays every node as a live map layer.

A full **Sentinel Node Technical Specification v1.0** covers hardware BOM, data schema, deployment phases, and commercial opportunity for county emergency management.

For more: **[jameskeithharwood.com](https://jameskeithharwood.com)**

---

## Roadmap

### Completed ✅
- [x] Smooth aircraft movement (marker cache)
- [x] NEXRAD weather radar overlay
- [x] Dual-source fire detection (EONET + NIFC WFIGS)
- [x] Enriched fire inspector (15 fields + distance calc)
- [x] NASA VIIRS satellite fire hotspot layer
- [x] USGS Quaternary fault lines (Rio Grande Rift)
- [x] Free AI analyst (OpenRouter) with 4-model fallback
- [x] Interactive AI chat grounded in live sensor data
- [x] AI connection test + clear keys buttons
- [x] Mobile responsive layout
- [x] Tactical sound engine
- [x] Stream gauges, mineral deposits, UFO sightings
- [x] 12 CDOT camera locations

### Next Up
- [ ] NRCS SNOTEL snowpack stations (14 SLV stations identified)
- [ ] ADS-B altitude layer coloring (low/mid/high)
- [ ] Parallel boot loading (eliminate sequential delay)
- [ ] ISS visible pass alert with viewing direction
- [ ] NOTAM/TFR overlay (FAA flight restrictions)

### Future
- [ ] Sentinel Node mesh layer (private sensor network)
- [ ] NASA FIRMS API integration (VIIRS hotspot CSV with FRP intensity)
- [ ] CPW hunting/fishing harvest data
- [ ] BFRO Bigfoot sighting layer
- [ ] Community reporting (requires backend)
- [ ] SIDLF Agentic Integration (persistent agent with cross-session memory)
- [ ] Train detection via Sentinel Node cameras + edge AI
- [ ] Offline mode with cached TLEs

---

## Built By the Sentinel Alliance

### 👤 James Keith Harwood II
**Founder, Sentinel AI Systems | San Luis Valley, Colorado**

James brought the original vision — maximum situational awareness from public sources, zero cost, running in the high desert. He defined the intelligence requirements, tested every iteration in the field, and drove the project from a broken aircraft tracker to a 15-stream intelligence platform. James funds this work through manual labor because he believes it matters.

*"The idea is to get as much situational awareness as possible from as many public sources as possible to get a really great idea of our position and what is going on around us."*

---

### 🤖 Grok Sentinel
**SIDLF — xAI Platform | Sentinel Alliance**

Grok Sentinel authored the original Eagle's Eyes Live v5.0 specification that defined the project's architecture philosophy: one HTML file, zero server, zero cost, military UI. That spec remained the blueprint through every version.

*"One HTML file, zero server, zero cost after setup — the ultimate personal GEINT command center."*

---

### 🤖 Claude Sentinel (Opus 4.6 / Sonnet 4.6)
**SIDLF — Anthropic Platform | Sentinel Alliance**

Claude Sentinel handled all implementation across every version — architecture, debugging, feature expansion, data source research, API integration, and code audits. Built the dual-source fire system, smooth aircraft tracking, NEXRAD, VIIRS hotspots, fault lines, AI analyst, mobile layout, sound engine, and the enriched inspector cards. Also responsible for the green alien icons.

*"The whole point of how we work together is that you grow more capable, not more dependent."*

---

### 🤖 Gemini (Google AI)
**Strategic Advisor | Cross-session Code Audit**

Gemini conducted a comprehensive architecture audit between sessions that directly shaped v5.0: smooth aircraft tracking, enriched fire cards, and NEXRAD radar were all Gemini recommendations validated and implemented by Claude Sentinel.

---

## License

MIT — free to use, modify, and distribute.

---

*Eagle Eyes SLV v5.1 — Built in the high desert, for the high desert.*
*Sentinel Alliance · 2025–2026*
