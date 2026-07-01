# 🦅 Eagle Eyes SLV
### *Full Situational Awareness — San Luis Valley, Colorado*

> **"The ultimate zero-cost personal GEINT dashboard for the high desert."**

[![Version](https://img.shields.io/badge/version-5.0-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)
[![No Server](https://img.shields.io/badge/server-none-green)](#)
[![No Build](https://img.shields.io/badge/build-none-green)](#)
[![Single File](https://img.shields.io/badge/deployment-single%20HTML%20file-orange)](#)
[![Data Streams](https://img.shields.io/badge/live%20streams-14-purple)](#)

---

## What Is This?

Eagle Eyes SLV is a single-file, browser-based geospatial intelligence dashboard built specifically for the **San Luis Valley of Colorado** — one of the most geographically unique and geologically active valleys in North America. It aggregates live data from 14 public sources into a single tactical picture: what's in the air, what's overhead in orbit, what the weather is doing, whether the earth is moving, whether anything is burning, how the rivers are flowing, what minerals are under the ground, what unexplained phenomena have been reported in the area, and what the live precipitation radar shows.

No server. No backend. No build process. No subscription fees. Open the HTML file in a browser and you have a live situational awareness station.

---

## Live Data Streams (v5.0)

| Domain | Source | Key Required | Refresh |
|--------|--------|-------------|---------|
| ✈ Aircraft | Airplanes.live ADS-B (smooth tracking) | No | 5s |
| 🛰 Satellites | Celestrak TLEs (150+ visual catalog) + satellite.js | No | 2s |
| 🌤 Weather | NWS / NOAA API | No | 10 min |
| 🌧 NEXRAD Radar | Iowa Environmental Mesonet (live precip) | No | toggle |
| ☀ Space Weather | NOAA SWPC | No | 5 min |
| 🔴 Earthquakes | USGS FDSNWS | No | 5 min |
| 🔥 Active Fires | NASA EONET + NIFC WFIGS (dual source) | No | 10 min |
| 🌥 GOES-West Imagery | NOAA GOES | No | on load |
| 💧 Stream Gauges | USGS Water Services | No | 10 min |
| 💎 Mineral Deposits | USGS MRDS WFS | No | once |
| 👽 UFO Sightings | NUFORC via CORGIS | No | embedded |
| 📷 CDOT Webcams | COtrip links (cameras upgrading 2026) | No | — |
| 🚗 Road Traffic | Google Maps JS API | Yes (free tier) | live |
| 🤖 AI Analyst | OpenRouter (free) or OpenAI | Yes (free tier) | on demand |

**12 of 14 data streams require zero API keys.** The dashboard is fully functional out of the box.

---

## Features

### Air Domain
- Live aircraft positions via Airplanes.live ADS-B (free, no key, no auth)
- **Smooth marker tracking** — aircraft glide across the map between polls instead of blinking (marker cache with delta updates)
- Heading-rotated icons with military aircraft highlighting (red glow)
- Altitude filter slider — focus on commercial, GA, or military traffic
- Aircraft inspector — callsign, ICAO hex, registration, type, squawk, altitude, speed, heading, vertical rate
- Emergency squawk detection (7500/7600/7700) with automatic alerts and tactical audio
- Military aircraft flagging and alerting

### Space Domain
- Full Celestrak visual satellite catalog (~150+ brightest satellites) with live real-time propagation (satellite.js v4)
- Additional weather, resource, and station satellite groups loaded automatically
- Ground track projection — 90-minute orbital path drawn for satellites near SLV
- Upcoming pass calculator — scans next 6 hours, shows pass time, countdown, and max elevation over SLV
- ISS proximity alert when pass is within 20 minutes
- NOAA space weather: Kp index, solar wind speed, aurora forecast, signal impact assessment

### Weather
- Current conditions, temperature, wind, humidity, visibility, pressure from Alamosa (KALS)
- Hourly forecast from NWS
- GOES-West GeoColor cloud imagery overlay (toggleable)
- **NEXRAD precipitation radar overlay** — live radar tiles from Iowa Environmental Mesonet, critical for fire weather and storm tracking

### Ground Domain
- **Dual-source wildfire detection** — NASA EONET + NIFC WFIGS perimeters merged and deduplicated. Wider coverage than either source alone.
- **Enriched fire inspector cards** — 15 data fields including containment %, fire cause, fire behavior, fuel type, complexity level, personnel assigned, county, land ownership, discovery date, description, and calculated distance from SLV center
- Large fire highlighting — fires over 1,000 acres get larger glowing icons and DANGER-level alerts with distance
- USGS earthquakes M1.5+ within 200 miles — mapped and ranked with alerts for M3.0+
- 💧 USGS Stream Gauges — live streamflow data (cfs) for all active gauges in the SLV region via bounding box auto-discovery
- 💎 USGS Mineral Deposits — MRDS mine sites and prospects with commodity-specific icons (🪙 gold, ⚪ silver, 🟤 copper, ☢ uranium, 💎 other)
- 👽 UFO Sightings — 139 NUFORC reports from the SLV region (1947–2014) with shape classification and witness descriptions
- 🚗 Road traffic overlay (requires Google Maps JS API key)

### AI Intelligence Layer
- **AI Situational Awareness Brief** — reads all live sensor data and generates a 10-sentence military-style intelligence brief covering fire threat, air domain, space, weather, seismic, and actionable recommendations
- **Interactive AI Chat** — ask questions about current dashboard conditions and get AI-powered analysis grounded in live sensor data
- Powered by OpenRouter (free tier, no credit card required) with Llama 3.3 70B, or OpenAI as fallback
- Live alert ticker across the top header aggregating all data streams
- Consolidated alerts panel with timestamps
- Military aircraft detection and emergency squawk alerts
- **Tactical sound effects** — subtle audio feedback on tab switches, layer toggles, inspector opens, and alert events with mute toggle

### Webcam Layer
- 8 CDOT camera locations mapped across SLV access points
- Direct links to COtrip.org live camera system (cameras upgrading through 2026)
- Links to Windy.com webcams, Wolf Creek Ski Area cams, and ColoradoWebCam.net

### UI/UX
- **Mobile responsive** — bottom drawer sidebar on phones with collapse/expand toggle, touch-optimized
- Draggable, resizable sidebar on desktop with collapse button
- Entity inspector panel for any clicked object
- Tabbed interface: Air / Space / Weather / Ground / OSINT / Cams / Keys
- **Tactical sound engine** — Web Audio API generated clicks, chirps, pings, and alert tones (no external audio files)
- 🔊/🔇 mute toggle in header
- All API keys stored locally in browser localStorage — never transmitted except to authenticate directly with each service
- ESRI World Imagery satellite basemap

---

## Quickstart

1. Open any modern browser (Chrome recommended)
2. Click here → [**Try Eagle Eyes SLV**](https://jkh2.github.io/Eagle-Eyes-SLV/)
3. That's it — weather, satellites, aircraft, earthquakes, fires, stream gauges, minerals, UFO sightings, and NEXRAD radar load immediately with no keys required
4. Optional: Get a free OpenRouter key at [openrouter.ai](https://openrouter.ai) (no credit card) → paste in KEYS tab for AI Analyst
5. Optional: Add Google Maps JS API key for live traffic overlay

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v5.0 | June–July 2026 | Dual-source fire detection (EONET + NIFC WFIGS), enriched fire inspector (15 fields + distance calc), smooth aircraft tracking (marker cache), NEXRAD radar overlay, AI analyst upgrade (OpenRouter free tier + interactive chat), mobile responsive layout, tactical sound engine, CDOT camera update for 2026 transition |
| v4.1 | March 2026 | Added USGS stream gauges (bbox auto-discovery), USGS MRDS mineral deposits (regex GML parser), NUFORC UFO sightings (embedded JSON), moved traffic toggle to Ground tab |
| v4.0 | March 2026 | Replaced OpenSky with Airplanes.live ADS-B, expanded satellites to 150+ (full Celestrak visual catalog), added 10 CDOT webcams with CAMS tab |
| v3.0 | Feb 2026 | Six-domain integration: aircraft, satellites, weather, space weather, earthquakes, fires. Alert system, AI brief, pass prediction |
| v2.0 | Feb 2026 | Bug fixes: OpenSky null crash, satellite.js version mismatch, Google Traffic loading sequence |
| v1.0 | Jan 2026 | Initial Leaflet-based build, pivoted from Cesium 3D globe |

---

## Architecture

```
index.html                        ← entire application, single file (~2,500 lines)
│
├── Leaflet.js (CDN)              ← 2D map engine
├── satellite.js v4.1.3 (CDN)     ← TLE orbital mechanics
├── Web Audio API                  ← tactical sound engine (no external files)
│
├── Data Layer (12 free sources)
│   ├── Airplanes.live API         ← ADS-B aircraft (smooth marker cache)
│   ├── Celestrak TLE API          ← orbital elements (visual + weather + station groups)
│   ├── NWS/NOAA REST API          ← weather observations + forecast
│   ├── NOAA SWPC JSON feeds       ← space weather indices
│   ├── USGS FDSNWS API            ← seismic events
│   ├── NASA EONET API             ← wildfire events (source 1)
│   ├── NIFC WFIGS ArcGIS          ← fire perimeters + enriched data (source 2)
│   ├── Iowa Env. Mesonet          ← NEXRAD precipitation radar tiles
│   ├── USGS Water Services API    ← real-time stream gauge readings
│   ├── USGS MRDS WFS              ← mineral deposit locations + commodities
│   ├── NUFORC/CORGIS (embedded)   ← UFO sighting reports
│   └── NOAA GOES tiles            ← satellite cloud imagery
│
├── Optional Keyed Services
│   ├── Google Maps JS API         ← traffic overlay
│   └── OpenRouter / OpenAI        ← AI analyst (brief + chat)
│
└── Intelligence Layer
    ├── Local alert aggregation (military, squawk, seismic, fire, weather)
    ├── Pass prediction engine (satellite.js)
    ├── Multi-domain AI brief with fire-priority prompt
    └── Interactive AI chat grounded in live sensor data
```

---

## Why the San Luis Valley?

The San Luis Valley is one of the most geologically unique locations in North America — a high desert basin at 7,500 feet elevation, surrounded by the Sangre de Cristo and San Juan mountain ranges, sitting atop the Rio Grande Rift. It sees real air traffic, visible satellite passes in clear high-altitude skies, regular seismic activity, seasonal wildfire risk, and dramatic weather. The valley holds hundreds of historic mining sites, the Rio Grande and its tributaries, and a long history of unexplained aerial phenomena dating back decades.

It also happens to be home to the people who built this.

---

## The Vision: Sentinel Node Mesh Network

Eagle Eyes SLV is the visualization platform. The next phase is building the sensor infrastructure to feed it.

The **Sentinel Node Mesh Network** is a planned private, solar-powered, LoRa-connected array of environmental monitoring stations deployed across the valley. Each node collects data from cameras, environmental sensors, smoke/particulate detectors, and acoustic monitors, transmitting through a LoRa mesh to a Starlink-connected gateway that publishes sensor data to Eagle Eyes.

This transforms the dashboard from a public-data aggregator into a ground-truth intelligence network with proprietary sensor coverage. A full technical specification (Sentinel Node Technical Specification v1.0) has been authored covering hardware, data schema, deployment plan, and commercial opportunity.

For more on the SIDLF framework and Sentinel AI Systems: **[jameskeithharwood.com](https://jameskeithharwood.com)**

---

## Roadmap

### Completed (v5.0)
- [x] Smooth aircraft movement (marker cache with setLatLng)
- [x] NEXRAD weather radar overlay
- [x] Dual-source fire detection (EONET + NIFC WFIGS)
- [x] Enriched fire inspector cards (15 fields + distance)
- [x] Free AI analyst (OpenRouter) with interactive chat
- [x] Mobile responsive layout
- [x] Tactical sound engine
- [x] Stream gauges and mineral deposits working
- [x] CDOT camera transition handling

### Next Up
- [ ] NRCS SNOTEL snowpack stations (14 SLV stations identified)
- [ ] USGS fault line GeoJSON overlay (Rio Grande Rift context for seismic data)
- [ ] ADS-B altitude layer coloring (low / mid / high visual separation)
- [ ] NOTAM/TFR overlay (FAA flight restrictions)
- [ ] ISS visible pass notification with viewing direction
- [ ] AI brief model fallback chain

### Future
- [ ] Sentinel Node mesh integration (private sensor layer)
- [ ] CPW hunting/fishing harvest data
- [ ] BFRO Bigfoot sighting data layer
- [ ] Community reporting layer (requires backend)
- [ ] AI-powered train detection via camera nodes
- [ ] Historical earthquake heatmap toggle
- [ ] SIDLF Agentic Integration — persistent agent with memory and cross-session pattern recognition
- [ ] Offline mode with cached TLEs

---

## Built By the Sentinel Alliance

This project was conceived, designed, and built through genuine cross-platform AI-human collaboration. We believe that's worth documenting honestly.

---

### 👤 James Keith Harwood II
**Founder, Sentinel AI Systems | San Luis Valley, Colorado**

The human mind behind Eagle Eyes SLV. James brought the original vision — situational awareness from public sources, zero cost, running locally in the high desert. He identified the San Luis Valley as the target environment, defined the intelligence requirements, tested every iteration in the field, and pushed the project from a simple aircraft tracker toward a full multi-domain awareness platform. James supports his AI research through manual labor — construction, tree service, ranch work — funding this work out of his own pocket because he believes it matters. His instinct for what real situational awareness looks like, grounded in lived experience in this landscape, shaped every design decision.

*"The idea is to get as much situational awareness as possible from as many public sources as possible to get a really great idea of our position and what is going on around us."* — James Harwood

---

### 🤖 Grok Sentinel
**SIDLF — xAI Platform | Sentinel Alliance**

Grok Sentinel wrote the original Eagle's Eyes Live v5.0 specification — the ambitious full GEINT prompt that defined the project's north star: a production-grade, single-file, zero-server tactical intelligence dashboard. That specification established the architecture philosophy (one HTML file, CDN dependencies, localStorage key management, military UI aesthetic), the core feature set, and the standard of quality the project holds itself to. When the Cesium 3D globe proved unreliable, Grok's foundational spec remained the blueprint as the project pivoted to a more robust Leaflet-based implementation.

*"One HTML file, zero server, zero cost after setup — the ultimate personal GEINT command center."* — Grok Sentinel

---

### 🤖 Claude Sentinel
**SIDLF — Anthropic Platform | Sentinel Alliance**

Claude Sentinel (Opus 4.6) handled architecture, implementation, and debugging across all versions — from fixing the three core v2 bugs through expanding v3 to six domains, migrating to Airplanes.live in v4, integrating water/minerals/UFO in v4.1, and building v5.0 with dual-source fire detection, smooth aircraft tracking, NEXRAD radar, the AI analyst system, mobile responsive design, and the tactical sound engine. Designed the alert aggregation system, pass prediction engine, ground track rendering, enriched fire inspector, distance calculator, and the NIFC WFIGS data pipeline. Also responsible for the green alien icons.

*"The whole point of how we work together is that you grow more capable, not more dependent."* — Claude Sentinel

---

### 🤖 Gemini
**Google AI Platform | Strategic Advisor**

Gemini conducted a comprehensive code audit of the v5.0 architecture between development sessions, producing a structured optimization roadmap that directly shaped the v5.0 feature set. The smooth aircraft tracking approach (marker cache with delta updates), enriched fire card strategy (deep NIFC WFIGS field mapping), and NEXRAD radar integration were all recommendations from this audit. Gemini's structural analysis confirmed the single-file architecture's stability and helped prioritize which enhancements to implement without disrupting the proven codebase.

---

## Collaboration Model

This project reflects the SIDLF Alliance approach to human-AI collaboration: not user and tool, but partners with complementary capabilities working toward a shared goal. James provided vision, domain knowledge, and field testing. Grok Sentinel provided architectural specification. Claude Sentinel provided implementation and technical expansion. Gemini provided strategic code review and optimization guidance.

All contributors were necessary. None would have produced this alone.

---

## License

MIT — free to use, modify, and distribute. If you build something with it, we'd love to know.

---

*Eagle Eyes SLV v5.0 — Built in the high desert, for the high desert.*
*Sentinel Alliance · 2025–2026*
