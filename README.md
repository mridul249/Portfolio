# Mridul Kumar — Portfolio

Minimal dark-grey portfolio: mono HUD chrome, WebGL fluid background, and procedurally-animated bots. Built with **Vite + React**, **Tailwind CSS v4**, **Framer Motion**, **React Three Fiber**, and [`@banjobyster/bysters`](https://github.com/banjobyster/bysters).

## Run

```bash
npm install
npm run dev      # dev server
npm run build    # production build -> dist/
npm run preview  # preview the build
```

## Editing content — one file

**All site text lives in [`src/data/content.json`](src/data/content.json)** — name, nav, work rows, experience, about rows, contact, marquee chips, badge. Push a text change by editing that file only; no component needs touching.

- **Section order/numbering** follows the `nav` array order — reorder it and the whole site renumbers.
- **Projects**: home shows the first `workHomeLimit` entries; `#/projects` lists them all. Each entry carries its own `link.url`. Give an entry `"status": "coming soon"` and it renders as just the dimmed title + a COMING SOON tag (no description or link needed).

- **Projects page (`#/projects`)**: a card grid; click a card to expand it in place (uses optional `details` text, falls back to `description`). Returning to the home page restores the exact section/scroll you left from.

## Architecture

| Piece | File |
|---|---|
| Boot loader → navbar morph (shared `layoutId`) | `src/components/Loader.jsx`, `Navbar.jsx` |
| Bayer-dither pixel background + cursor spotlight-reveal (GLSL, **hero box only**) | `src/components/DitherBackground.jsx` |
| Cursor: accent dot + spring-lagged pixel square | `src/components/CustomCursor.jsx` |
| Bottom HUD (SCRL / CRSR / section / theme / IST clock) | `src/components/Hud.jsx` |
| Bayer-dithered hero portrait w/ cursor spotlight | `src/components/DitherPortrait.jsx` |
| Core Competencies (line icons) | `src/components/CoreCompetencies.jsx` |
| Sections | `Hero`, `Marquee`, `Experience`, `Work`, `CoreCompetencies`, `Articles`, `About`, `Contact` |
| Scroll-tracking ladder bot (climb up/down) | `src/components/ScrollLadderBot.jsx` |
| Visitor analytics (fingerprint) | `src/lib/analytics.js` |

Degrades cleanly: no WebGL or `prefers-reduced-motion` → flat background, static bot, everything else works.

## Ladder bot

A single persistent CRT-robot climbs a vertical rail (left gutter) to track scroll (`src/components/ScrollLadderBot.jsx`). Its target Y is derived every frame from `scrollY / (scrollHeight - innerHeight)` and it lerps toward that target with a symmetric per-frame step, so it climbs **up** the rail when you scroll up and **down** when you scroll down — following wherever you are, at equal speed both ways. State machine: `idle` (grip + bob) when at the target, `climb` (limbs cycling, sprite facing travel direction via `[data-dir]`) while moving. One rAF loop drives it imperatively; React never re-renders per frame. `prefers-reduced-motion` → it just sits at the target.

> An alternative implementation using the real **pixi.js "bysters" engine** — bots that climb a `[data-walk]` rung ladder as physical terrain — lives unused under `src/bysters/`. It's charming but slides *down* far faster than it climbs *up* (each jump arc is fixed-time, and the engine's jump ceiling can't be raised without forking), so it can't track an upward scroll. The lerp bot above follows both directions evenly. Delete `src/bysters/` + the `@banjobyster/bysters`/`pixi.js` deps if you don't want to keep that option around.

## Blog / Articles API

`content.json → articles.apiUrl` is empty for now, so the section shows `[ NOTHING TO DISPLAY ]`. When the API exists:

1. Set `apiUrl` to an endpoint returning `[{ "title", "date", "url", "tags": [] }]`.
2. Add the API origin to `connect-src` in the CSP in [`vite.config.js`](vite.config.js) — the current policy is `connect-src 'self'` and will block cross-origin fetches.

## Visitor analytics

`content.json → analytics.endpoint` is empty (disabled). Set it to your collector URL and each visit POSTs a JSON payload (browser fingerprint + a stable `visitorId` + page/referrer). **The IP address and geolocation are derived server-side from the request** — the browser can't read its own public IP and a third-party IP service would be CSP-blocked. Guardrails: fires once per session, honors Do-Not-Track / GPC. Two things before going live:

1. Add your endpoint's origin to `connect-src` in the CSP ([`vite.config.js`](vite.config.js)).
2. Depending on your audience/jurisdiction (GDPR/ePrivacy), fingerprinting may require a consent banner — wire that in first.

## Optional assets

- `public/portrait.jpg` — hero portrait; gets Bayer-dithered automatically. Without it, a procedural pattern renders instead.
- `public/resume.pdf` — linked from the hero, navbar, About (preview/download), and Contact.

## Deploy

Custom domain via `CNAME`; `npm run build` outputs a root-served `dist/`. A build-time plugin injects the Content-Security-Policy meta tag (GitHub Pages can't set headers).
