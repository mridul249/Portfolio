# Mridul Kumar - Portfolio

<video src="https://raw.githubusercontent.com/mridul249/Portfolio/ef4c16b26af0fb4030765f2d3a61a21f0a239118/public/portfolio_screencast.mp4" controls="controls" muted="muted" width="100%">
</video>

Minimal dark-grey portfolio: mono HUD chrome, WebGL fluid background, procedurally-animated bots. Built with **Vite + React**, **Tailwind CSS v4**, **Framer Motion**, **React Three Fiber**, and [`@banjobyster/bysters`](https://github.com/banjobyster/bysters).

## Run

```bash
npm install
npm run dev      # dev server
npm run build    # production -> dist/
npm run preview  # preview the build
```

## Editing content

All site text lives in **[`src/data/content.json`](src/data/content.json)** - name, nav, work, experience, about, contact, marquee, badge. Edit that file only; no component needs touching.

- Section order follows the `nav` array - reorder it and the site renumbers.
- **Projects**: home shows the first `workHomeLimit` entries; `#/projects` lists all. Give an entry `"status": "coming soon"` to render just a dimmed title + tag, no description/link needed.
- **Projects page**: card grid, click to expand (`details`, falling back to `description`). Returning to home restores your exact scroll position.

## Architecture

| Piece | File |
|---|---|
| Boot loader → navbar morph | `Loader.jsx`, `Navbar.jsx` |
| Dither pixel background + cursor spotlight (hero only) | `DitherBackground.jsx` |
| Cursor: accent dot + lagged pixel square | `CustomCursor.jsx` |
| Bottom HUD (scroll / cursor / section / theme / clock) | `Hud.jsx` |
| Dithered hero portrait | `DitherPortrait.jsx` |
| Core competencies icons | `CoreCompetencies.jsx` |
| Sections | `Hero`, `Marquee`, `Experience`, `Work`, `CoreCompetencies`, `Articles`, `About`, `Contact` |
| Scroll-tracking ladder bot | `ScrollLadderBot.jsx` |
| Visitor analytics | `lib/analytics.js` |

Degrades cleanly: no WebGL or `prefers-reduced-motion` → flat background, static bot, everything else works.

## Ladder bot

A CRT-robot climbs a vertical rail to track scroll (`ScrollLadderBot.jsx`). Target Y = `scrollY / (scrollHeight - innerHeight)`; it lerps toward that target at an equal speed up or down, one rAF loop, no per-frame React re-render. `idle` when at target, `climb` while moving, sprite flips via `[data-dir]`. `prefers-reduced-motion` → sits still.

> An alternate pixi.js-based version (bots physically climbing `[data-walk]` rungs) lives unused under `src/bysters/` - it descends far faster than it climbs, so it can't track upward scroll. Delete `src/bysters/` and the `@banjobyster/bysters`/`pixi.js` deps if you don't need it.

## Blog / Articles API

`content.json → articles.apiUrl` is empty, so the section shows `[ NOTHING TO DISPLAY ]`. To enable:
1. Set `apiUrl` to an endpoint returning `[{ "title", "date", "url", "tags": [] }]`.
2. Add its origin to `connect-src` in the CSP in `vite.config.js`.

## Visitor analytics

`content.json → analytics.endpoint` is empty (disabled). Set it to a collector URL and each visit POSTs a fingerprint + stable `visitorId` + page/referrer. IP/geolocation are resolved server-side, not client-side. Fires once per session, honors Do-Not-Track/GPC.
1. Add the endpoint's origin to `connect-src` in the CSP.
2. Depending on jurisdiction (GDPR/ePrivacy), fingerprinting may need a consent banner first.

## Optional assets

- `public/portrait.jpg` - hero portrait, auto-dithered. Falls back to a procedural pattern if absent.
- `public/resume.pdf` - linked from hero, navbar, About, Contact.
- `public/portfolio_screencast.mp4` - demo video referenced above.

## Deploy

Custom domain via `CNAME`; `npm run build` outputs a root-served `dist/`. A build-time plugin injects the CSP meta tag (GitHub Pages can't set headers).

## License

MIT - see [LICENSE](LICENSE).