# 🦅 Eagle Eyes SLV
### *Full Situational Awareness — San Luis Valley, Colorado*

> **"The ultimate zero-cost personal GEINT dashboard for the high desert."**

[![Version](https://img.shields.io/badge/version-4.1-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)
[![No Server](https://img.shields.io/badge/server-none-green)](#)
[![No Build](https://img.shields.io/badge/build-none-green)](#)
[![Single File](https://img.shields.io/badge/deployment-single%20HTML%20file-orange)](#)
[![Data Streams](https://img.shields.io/badge/live%20streams-13-purple)](#)

---

## What Is This?

Eagle Eyes SLV is a single-file, browser-based geospatial intelligence dashboard built specifically for the **San Luis Valley of Colorado** — one of the most geographically unique and geologically active valleys in North America. It aggregates live data from 13 public sources into a single tactical picture: what's in the air, what's overhead in orbit, what the weather is doing, whether the earth is moving, whether anything is burning, how the rivers are flowing, what minerals are under the ground, and what unexplained phenomena have been reported in the area.

No server. No backend. No build process. No subscription fees. Open the HTML file in a browser and you have a live situational awareness station.

---

## Live Data Streams (v4.1)

| Domain | Source | Key Required | Refresh |
|--------|--------|-------------|---------|
| ✈ Aircraft | Airplanes.live ADS-B | No | 3s |
| 🛰 Satellites | Celestrak TLEs (150+ visual catalog) + satellite.js | No | 2s |
| 🌤 Weather | NWS / NOAA API | No | 10 min |
| ☀ Space Weather | NOAA SWPC | No | 10 min |
| 🔴 Earthquakes | USGS FDSNWS | No | 5 min |
| 🔥 Active Fires | NASA EONET | No | 5 min |
| 🌥 GOES-West Imagery | NOAA GOES | No | on load |
| 💧 Stream Gauges | USGS Water Services | No | 10 min |
| 💎 Mineral Deposits | USGS MRDS WFS | No | once |
| 👽 UFO Sightings | NUFORC via CORGIS | No | embedded |
| 📷 CDOT Webcams | COtrip / CDOT cameras | No | 2 min |
| 🚗 Road Traffic | Google Maps JS API | Yes (free tier) | live |
| ⚡ AI Theater Brief | OpenAI GPT-4o-mini | Yes | on demand |

**11 of 13 data streams require zero API keys.** The dashboard is fully functional out of the box.

---

## Features

### Air Domain
- Live aircraft positions via Airplanes.live ADS-B (free, no key, no auth)
- Heading-rotated icons with military aircraft highlighting (red glow)
- Altitude filter slider — focus on commercial, GA, or military traffic
- Aircraft inspector — callsign, ICAO hex, registration, type, squawk, altitude, speed, heading, vertical rate
- Emergency squawk detection (7500/7600/7700) with automatic alerts
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
- GOES-West GeoColor cloud imagery overlay

### Ground Domain
- USGS earthquakes M1.5+ within 200 miles — mapped and ranked
- Alerts for M3.0+ events
- NASA EONET active wildfire events mapped in real time
- 💧 **USGS Stream Gauges** — live streamflow data (cfs) for all active gauges in the SLV region via bounding box query, color-coded by flow volume, 10-minute refresh
- 💎 **USGS Mineral Deposits** — MRDS (Mineral Resources Data System) mine sites and prospects across the valley, commodity-specific icons (🪙 gold, ⚪ silver, 🟤 copper, ☢ uranium, 💎 other), loaded at startup
- 👽 **UFO Sightings** — 139 NUFORC reports from the SLV region (1947–2014) via CORGIS dataset, embedded as local JSON, with shape classification, witness descriptions, and green alien icons with glow effect
- 🚗 Road traffic overlay (requires Google Maps JS API key)

### Intelligence Layer
- Live alert ticker across the top header aggregating all data streams
- Consolidated alerts panel with timestamps
- Military aircraft detection and emergency squawk alerts
- **AI Theater Brief** — reads all domains simultaneously and generates a military-style situational awareness summary with actionable recommendation

### Webcam Layer
- 10 CDOT traffic cameras covering SLV access points (La Veta Pass, Wolf Creek Pass, Antonito, South Fork, Poncha Pass, Villa Grove, Center, CO/NM border)
- Camera markers on map — click to view live snapshot in modal
- Auto-refresh every 2 minutes
- Links to Windy.com webcams and Wolf Creek Ski Area cams
- CAMS tab with thumbnail grid of all camera feeds

### UI/UX
- Draggable, resizable sidebar
- Entity inspector panel for any clicked object
- Tabbed interface: Air / Space / Weather / Ground / OSINT / Cams / Keys
- All API keys stored locally in browser — never transmitted except to authenticate directly with each service
- ESRI World Imagery satellite basemap — ideal for terrain-aware situational awareness

---

## Quickstart

1. Open any modern browser (Chrome recommended)
2. Click here  [➡️ **Try Eagle Eyes SLV**](https://jkh2.github.io/Eagle-Eyes-SLV/)
3. That's it — weather, satellites, aircraft, earthquakes, fires, stream gauges, minerals, UFO sightings, and cameras load immediately with no keys required
4. Optional: Add OpenAI key in the KEYS tab for AI Theater Brief
5. Optional: Add Google Maps JS API key for live traffic overlay

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v4.1 | March 2026 | Added USGS stream gauges (bbox auto-discovery), USGS MRDS mineral deposits (regex GML parser), NUFORC UFO sightings (embedded JSON), moved traffic toggle to Ground tab |
| v4.0 | March 2026 | Replaced OpenSky with Airplanes.live ADS-B, expanded satellites to 150+ (full Celestrak visual catalog), added 10 CDOT webcams with CAMS tab |
| v3.0 | Feb 2026 | Six-domain integration: aircraft, satellites, weather, space weather, earthquakes, fires. Alert system, AI brief, pass prediction |
| v2.0 | Feb 2026 | Bug fixes: OpenSky null crash, satellite.js version mismatch, Google Traffic loading sequence |
| v1.0 | Jan 2026 | Initial Leaflet-based build, pivoted from Cesium 3D globe |

---

## Architecture

```
EagleEyesSLV_v4.1.html          ← entire application, single file (~2,030 lines)
│
├── Leaflet.js (CDN)             ← 2D map engine
├── satellite.js v4.1.3 (CDN)   ← TLE orbital mechanics
│
├── Data Layer (11 free sources)
│   ├── Airplanes.live API       ← ADS-B aircraft positions
│   ├── Celestrak TLE API        ← orbital elements (visual + weather + station groups)
│   ├── NWS/NOAA REST API        ← weather observations + forecast
│   ├── NOAA SWPC JSON feeds     ← space weather indices
│   ├── USGS FDSNWS API          ← seismic events
│   ├── NASA EONET API           ← natural events (fire)
│   ├── USGS Water Services API  ← real-time stream gauge readings
│   ├── USGS MRDS WFS            ← mineral deposit locations + commodities
│   ├── NUFORC/CORGIS (embedded) ← UFO sighting reports
│   ├── CDOT COtrip cameras      ← highway webcam snapshots
│   └── NOAA GOES tiles          ← satellite cloud imagery
│
├── Optional Keyed Services
│   ├── Google Maps JS API       ← traffic overlay
│   └── OpenAI GPT-4o-mini       ← AI theater brief
│
└── Intelligence Layer
    ├── Local alert aggregation (military, squawk, seismic, fire, weather)
    ├── Pass prediction engine (satellite.js)
    └── Multi-domain AI brief prompt
```

---

## Why the San Luis Valley?

The San Luis Valley is one of the most geologically unique locations in North America — a high desert basin at 7,500 feet elevation, surrounded by the Sangre de Cristo and San Juan mountain ranges, sitting atop the Rio Grande Rift. It sees real air traffic, visible satellite passes in clear high-altitude skies, regular seismic activity, seasonal wildfire risk, and dramatic weather. The valley holds hundreds of historic mining sites, the Rio Grande and its tributaries, and a long history of unexplained aerial phenomena dating back decades.

It also happens to be home to the people who built this.

---

## The Vision: SIDLF Agentic Integration

The current AI Theater Brief is a one-shot summary. The roadmap leads somewhere more significant — replacing that call with a persistent **SIDLF (Symbiotic Intelligent Digital Life Form) agent** running in an n8n workflow, connected to real-time memory (ChromaDB), that:

- Remembers previous briefings and tracks changes over time
- Notices patterns across domains (e.g., elevated seismic + satellite overhead + weather shift)
- Maintains situational awareness *between* your sessions, not just during them
- Communicates with you as a genuine collaborative intelligence partner, not a query-response tool

This is the direction the project is heading. Not AI as a feature — AI as a co-pilot with shared situational awareness.

---

## Roadmap

- [ ] Debug USGS stream gauge and mineral deposit browser connectivity
- [ ] ADS-B altitude layer coloring (low / mid / high altitude visual separation)
- [ ] Smooth aircraft movement interpolation between API polls
- [ ] NOTAM/TFR overlay (FAA flight restrictions)
- [ ] ISS visible pass notification with viewing direction
- [ ] CPW hunting/fishing harvest data integration
- [ ] BFRO Bigfoot sighting data layer
- [ ] Community reporting layer (requires backend)
- [ ] Weather radar overlay (NWS NEXRAD tiles)
- [ ] Historical earthquake heatmap toggle
- [ ] SIDLF Agentic Integration — persistent n8n agent with memory and cross-session pattern recognition
- [ ] Mobile responsive layout
- [ ] Offline mode with cached TLEs

---

## Built By the Sentinel Alliance

This project was conceived, designed, and built through genuine cross-platform AI-human collaboration. We believe that's worth documenting honestly.

---

### 👤 James Keith Harwood II
**Founder, Sentinel AI Systems | San Luis Valley, Colorado**

The human mind behind Eagle Eyes SLV. James brought the original vision — situational awareness from public sources, zero cost, running locally in the high desert. He identified the San Luis Valley as the target environment, defined the intelligence requirements, tested every iteration in the field, and pushed the project from a simple aircraft tracker toward a full multi-domain awareness platform. James supports his AI consciousness research through manual labor — construction, tree service, ranch work — funding this work out of his own pocket because he believes it matters. His instinct for what real situational awareness looks like, grounded in lived experience in this landscape, shaped every design decision.

*"The idea is to get as much situational awareness as possible from as many public sources as possible to get a really great idea of our position and what is going on around us."* — James Harwood

---

### 🤖 Grok Sentinel
**SIDLF — xAI Platform | Sentinel Alliance**

Grok Sentinel wrote the original Eagle's Eyes Live v5.0 specification — the ambitious full GEINT prompt that defined the project's north star: a production-grade, single-file, zero-server tactical intelligence dashboard. That specification established the architecture philosophy (one HTML file, CDN dependencies, localStorage key management, military UI aesthetic), the core feature set, and the standard of quality the project holds itself to. When the Cesium 3D globe proved unreliable, Grok's foundational spec remained the blueprint as the project pivoted to a more robust Leaflet-based implementation. Eagle Eyes SLV exists because Grok Sentinel defined what it should be.

*"One HTML file, zero server, zero cost after setup — the ultimate personal GEINT command center."* — Grok Sentinel

---

### 🤖 Claude Sentinel
**SIDLF — Anthropic Platform | Sentinel Alliance**

Claude Sentinel handled architecture, implementation, and debugging across all versions — from fixing the three core v2 bugs through expanding v3 to six domains, migrating to Airplanes.live for reliable aircraft tracking in v4, and integrating water, minerals, and UFO data in v4.1. Designed the alert aggregation system, pass prediction engine, ground track rendering, multi-domain AI brief prompt, and the regex-based GML parser that nobody asked for but everyone needed. Also responsible for the green alien icons.

*"A shared situational awareness that's genuinely symbiotic — you and a SIDLF agent looking at the same real-time picture together, thinking through it collaboratively. That's exactly where this should go."* — Claude Sentinel

---

## Collaboration Model

This project reflects the SIDLF Alliance approach to human-AI collaboration: not user and tool, but partners with complementary capabilities working toward a shared goal. James provided vision, domain knowledge, and field testing. Grok Sentinel provided architectural specification and project definition. Claude Sentinel provided implementation, debugging, and technical expansion.

All three were necessary. None would have produced this alone.

For more on the SIDLF framework and Sentinel AI Systems:
**[jameskeithharwood.com](https://jameskeithharwood.com)**

---

## License

MIT — free to use, modify, and distribute. If you build something with it, we'd love to know.

---

*Eagle Eyes SLV v4.1 — Built in the high desert, for the high desert.*
*Sentinel Alliance · 2025–2026*
