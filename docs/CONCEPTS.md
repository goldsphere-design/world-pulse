# World Pulse - Visual Concepts

**Created:** 2026-01-31  
**Purpose:** Explore different UI/UX directions before implementation

---

## Concept A: "Command Center" (Oblivion-inspired)

**Aesthetic:** Clean, futuristic, white/blue palette, holographic feel

```
┌─────────────────────────────────────────────────────────────────────┐
│  WORLD PULSE                                    22:04 EST  SAT 31/1 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────┐  ┌────────────────────────────────┐ │
│  │                          │  │ RECENT EVENTS                  │ │
│  │                          │  ├────────────────────────────────┤ │
│  │                          │  │ 🌍 M5.2 Earthquake             │ │
│  │       3D GLOBE           │  │    Tonga, Pacific Ocean        │ │
│  │    (rotating Earth)      │  │    Depth: 10km  •  2 min ago   │ │
│  │                          │  │                                │ │
│  │  • Clean wireframe grid  │  │ ⛈️  Storm System               │ │
│  │  • Glowing event pins    │  │    Atlantic, 500km E of FL    │ │
│  │  • Subtle atmosphere     │  │    Cat 2  •  8 min ago         │ │
│  │  • Arc lines connecting  │  │                                │ │
│  │    related events        │  │ 📰 News Cluster: 127 stories   │ │
│  │                          │  │    Middle East                 │ │
│  │                          │  │    Sentiment: -0.42  •  Active │ │
│  └──────────────────────────┘  └────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ▶ M6.8 Chile  •  ⛈️ Pacific Typhoon  •  🔭 ISS Pass 23:15    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                  ^ Horizontal ticker (auto-scroll) │
├─────────────────────────────────────────────────────────────────────┤
│  ⚙️ Sources Active: 4/7  •  Updates: Live  •  Latency: 1.2s        │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Large central globe (60% of screen)
- Clean white/cyan/blue color scheme
- Minimalist side panel with scrolling events
- Thin horizontal ticker at bottom
- Semi-transparent panels, floating feel
- Smooth animations (pulsing pins, rotating globe)

**Pros:**
- Easy to focus on globe
- Clean, professional look
- Not overwhelming

**Cons:**
- Less "information dense"
- Might feel sterile
- Limited space for multiple data views

---

## Concept B: "Mission Control" (NASA/Matrix hybrid)

**Aesthetic:** Dark theme, green/amber accents, dense information, retro-futuristic

```
┌─────────────────────────────────────────────────────────────────────┐
│█ WORLD PULSE █ LIVE FEED █ 22:04:17 EST                          █ │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─GLOBE─────────┐ ┌─EVENTS──────┐ ┌─TRENDS──────┐ ┌─YOUR DAY────┐ │
│ │               │ │ >> SEISMIC  │ │ ↑ News +14% │ │ 📅 9:00 AM  │ │
│ │   [Earth]     │ │ M5.2 Tonga  │ │ ↓ Quake -3% │ │   Team Sync │ │
│ │               │ │ 22:02 EST   │ │             │ │             │ │
│ │ Heat map ON   │ │ Depth: 10km │ │ 🔥 Hotspots │ │ 🌦️ Rain PM  │ │
│ │ Sentiment:    │ │             │ │ • Middle E. │ │ Temp: 42°F  │ │
│ │ [████░░░░░░]  │ │ >> WEATHER  │ │ • S. Asia   │ │             │ │
│ │ -1.0 ←→ +1.0  │ │ Storm ATL-4 │ │ • Europe    │ │ 🎵 New:     │ │
│ │               │ │ Cat 2, 120kt│ │             │ │ Alt-J album │ │
│ └───────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                     │
│ ┌─TICKER (LIVE)────────────────────────────────────────────────────┐│
│ │ M6.8 CHILE • TYPHOON PACIFIC • ISS OVERHEAD 23:15 • SOLAR FLARE…││
│ └──────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│ ⚡ 7 SOURCES ACTIVE │ 🔄 REFRESH: 5s │ 📊 1,247 EVENTS (24h)        │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Grid layout with multiple panels
- Dark background (black/dark gray)
- Green/amber/cyan text (terminal aesthetic)
- Personal context panel (calendar, weather, music)
- Real-time stats at bottom
- Heat map overlay on globe showing news sentiment

**Pros:**
- Information-dense
- Easy to scan multiple data sources
- Includes personal context (your day)
- Very "command center" feel

**Cons:**
- Can feel cluttered
- Harder to focus on one thing
- Might be overwhelming on smaller screens

---

## Concept C: "Immersive Globe" (Full-screen focus)

**Aesthetic:** Globe is the UI, everything overlays on it

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
│                         🌍                                          │
│                    (Massive Globe)                                  │
│                                                                     │
│     📍 M5.2 Tonga                                                  │
│     ├─ 22:02 EST                                                   │
│     └─ Depth: 10km                                                 │
│                                                                     │
│                                              ⛈️                    │
│                                          Storm ATL-4               │
│                                          Cat 2, 120kt              │
│                                                                     │
│  ┌─────────────────────────────────────┐                          │
│  │ 🔴 M6.8 Chile  •  ⛈️ Typhoon  •  🔭 ISS Pass 23:15            │ │
│  └─────────────────────────────────────┘                          │
│                                            (bottom ticker, subtle) │
│                                                                     │
│ [◀ Rotate] [Settings] [Sources]                   22:04 EST       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Globe fills entire screen
- Event details appear as "callouts" near their location on globe
- Minimal chrome (controls at bottom corners)
- Ticker bar appears only when there's breaking news
- Click on event pin → details expand in place
- Gesture-based navigation (swipe to rotate, pinch to zoom)

**Pros:**
- Most immersive
- Beautiful, cinematic
- Great for large displays
- Focus on the world, not UI

**Cons:**
- Less info visible at once
- Harder to compare multiple events
- Might be hard to navigate at first

---

## Concept D: "Split View" (Globe + Detail Panels)

**Aesthetic:** 60/40 split, globe on left, dynamic panels on right

```
┌─────────────────────────────────────────────────────────────────────┐
│ WORLD PULSE                                                         │
├──────────────────────────────┬──────────────────────────────────────┤
│                              │ ┌─ FOCUS: Earthquake ─────────────┐ │
│                              │ │                                  │ │
│                              │ │ M5.2 • Tonga, Pacific Ocean      │ │
│         🌍                   │ │ Occurred: 22:02 EST (2 min ago)  │ │
│                              │ │ Depth: 10.3 km                   │ │
│    [Spinning Globe]          │ │ Magnitude: 5.2 Mw                │ │
│                              │ │                                  │ │
│  • Pins glow on hover        │ │ [See Details] [USGS Link]        │ │
│  • Click pin → details       │ │                                  │ │
│    populate right side       │ ├──────────────────────────────────┤ │
│                              │ │ Related Events (within 500km):   │ │
│  [Sentiment Heat Map: OFF]   │ │ • M3.1 - 18 min ago              │ │
│  [Event Types: All]          │ │ • M2.8 - 1 hour ago              │ │
│                              │ └──────────────────────────────────┘ │
│                              │                                      │
│                              │ ┌─ TIMELINE ────────────────────┐   │
│                              │ │ 22:00 ████░░░░░░░░░░          │   │
│                              │ │ 21:00 ░░██████░░░░░░          │   │
│                              │ │ 20:00 ░░░░███░░░░░░░          │   │
│                              │ └───────────────────────────────┘   │
├──────────────────────────────┴──────────────────────────────────────┤
│ 🔴 Breaking: M6.8 Chile  •  ⛈️ Storm Atlantic  •  📰 127 stories  │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- 60/40 split (globe left, details right)
- Right panel dynamically changes based on selected event
- Timeline chart shows event frequency over time
- Bottom ticker for breaking/recent
- Controls overlay on globe

**Pros:**
- Good balance of globe + details
- Easy to explore (click → learn more)
- Timeline gives temporal context
- Flexible layout

**Cons:**
- Less screen space for globe than Concept C
- Right panel might feel busy
- Harder to see multiple events at once

---

## Comparison Matrix

| Feature | A: Command | B: Mission | C: Immersive | D: Split |
|---------|------------|------------|--------------|----------|
| Globe Size | Large | Medium | Huge | Medium-Large |
| Info Density | Low | High | Very Low | Medium |
| Personal Context | No | Yes | No | Optional |
| Learning Curve | Easy | Medium | Easy | Easy |
| Best For | Focus | Analysis | Display | Exploration |
| Overwhelm Risk | Low | Medium | Low | Low |

---

## Hybrid Possibilities

You could also **mix and match**:

- **B + C:** Dense grid layout, but press `F` to go full-screen immersive globe
- **A + D:** Clean aesthetic of A, but split-view layout of D
- **Modes:** Start in C (immersive), click event → transition to D (split view)

---

## My Recommendations

**For daily large-screen display:** **Concept B (Mission Control)**
- Shows everything at once
- Includes your personal context (calendar, weather, music)
- Easy to glance at while working

**For demo/wow factor:** **Concept C (Immersive Globe)**
- Most visually striking
- Great for showing off the tech
- Perfect for large TV in living room

**For development/testing:** **Concept D (Split View)**
- Easiest to build iteratively
- Good balance of features
- Easy to add/remove panels

---

## Next Step

**I can build interactive HTML prototypes** of 1-2 of these concepts so you can see them in action (with a static globe, not full 3D yet).

Which concepts interest you most? Or should I create a hybrid combining elements you like?
