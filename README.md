# World Pulse 🌍

> A real-time information radiator visualizing global events on an interactive 3D globe.

**Status:** 🏗️ Planning Phase  
**Version:** 0.1.0

---

## What Is This?

World Pulse is your command center for understanding what's happening in the world and your day. It combines:

- 🌍 Real-time global events (earthquakes, weather, news)
- 📊 News sentiment heat mapping
- 🔭 Astronomical phenomena
- 📅 Your personal schedule and context
- 🎵 Music discoveries

All visualized on a beautiful 3D globe with supporting dashboards.

---

## Quick Start

**Prerequisites:**
- Node.js 20+ LTS
- npm or pnpm
- macOS/Windows/Linux

**Setup:**
```bash
# Clone the repository
git clone <repo-url>
cd world-pulse

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local
# (See API Keys section below)

# Start development server
npm run dev

# Or launch in Electron
npm run dev:electron
```

---

## API Keys

You'll need free API keys for:

1. **OpenWeather** - [Get key](https://openweathermap.org/api)
2. **NewsAPI** - [Get key](https://newsapi.org/)
3. **Spotify** (optional) - [Get credentials](https://developer.spotify.com/)

Add them to `.env.local`:
```env
OPENWEATHER_API_KEY=your_key_here
NEWSAPI_KEY=your_key_here
SPOTIFY_CLIENT_ID=your_id_here
SPOTIFY_CLIENT_SECRET=your_secret_here
```

---

## Project Structure

```
world-pulse/
├── src/
│   ├── main/          # Electron main process
│   ├── renderer/      # React frontend
│   ├── server/        # Node.js backend + data collectors
│   └── shared/        # Shared types/constants
├── tests/             # Unit, integration, E2E tests
├── docs/              # Additional documentation
└── SPEC.md            # Technical specification
```

---

## Development Commands

```bash
npm run dev              # Start dev server (frontend + backend)
npm run dev:electron     # Launch Electron wrapper
npm test                 # Run all tests
npm run lint             # Check code style
npm run build            # Production build
npm run build:electron   # Package desktop app
```

---

## Documentation

- [Technical Specification](./SPEC.md) - Architecture, tech stack, roadmap
- [API Documentation](./docs/API.md) - Backend endpoints (coming soon)
- [Contributing Guide](./docs/CONTRIBUTING.md) - Development workflow (coming soon)

---

## Roadmap

**Phase 1 (MVP):** Globe rendering + earthquakes + weather + basic ticker  
**Phase 2:** News sentiment heat map  
**Phase 3:** Personal calendar integration  
**Phase 4:** Music, astronomy, ocean data  
**Phase 5:** Production polish + auto-updates  
**Phase 6:** Web deployment option

See [SPEC.md](./SPEC.md) for detailed milestones.

---

## Tech Stack

- **Frontend:** React + Three.js + Tailwind CSS
- **Backend:** Node.js + Express + Socket.io
- **Desktop:** Electron
- **Database:** SQLite
- **Testing:** Vitest + Playwright
- **Language:** TypeScript

---

## Security

This project follows security best practices:
- No secrets in code (use `.env.local`)
- Regular dependency updates via Dependabot
- CVE scanning in CI
- HTTPS-only external API calls

See [Security Policy](./SECURITY.md) for reporting vulnerabilities.

---

## License

MIT (or choose your license)

---

## Credits

Inspired by:
- The visual aesthetics of *Oblivion* and *The Matrix*
- GitHub's global activity visualizations
- Real-time security attack maps

Built by Dan Goldman with Amp 🎸
