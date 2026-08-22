<samp>
  
# Mridul Kumar - Portfolio

<img src="public/portfolio_screencast.gif" alt="Portfolio Demo" width="100%">

<br>

See live demo at [mriduld.in](https://mriduld.in)

<br>

Minimal dark-grey portfolio featuring a mono HUD chrome, WebGL fluid background, procedurally-animated bots, and a custom secure analytics pipeline.

## Features

* **Dynamic Scroll Ladder Bot**: A CRT-robot that smoothly climbs a vertical rail to track page scroll progress (`ScrollLadderBot.jsx`).
* **Custom Analytics Engine**: Integrated secure visitor and event tracking with instant Telegram notifications and MongoDB storage.
* **Dithered Aesthetics**: Procedurally generated dither pixel background and custom-dithered hero portrait.
* **Graceful Degradation**: Fully respects accessibility preferences. If WebGL fails or `prefers-reduced-motion` is enabled, it gracefully falls back to a flat background and static bot while retaining all core functionality.

## Sources & Tech Stack

This project was built utilizing and drawing inspiration from several open-source frameworks:

* **Vite + React** - Core framework and build tool.
* **Tailwind CSS v4** - Utility-first styling.
* **Framer Motion** - Component transitions and layout animations.
* **React Three Fiber** - WebGL fluid background rendering.
* **[@banjobyster/bysters](https://github.com/banjobyster/bysters)** - Procedural character animations for the ladder bot.


## Architecture

| Piece | File |
| --- | --- |
| Boot loader → navbar morph | `Loader.jsx`, `Navbar.jsx` |
| Dither pixel background + cursor spotlight (hero only) | `DitherBackground.jsx` |
| Cursor: accent dot + lagged pixel square | `CustomCursor.jsx` |
| Bottom HUD (scroll / cursor / section / theme / clock) | `Hud.jsx` |
| Dithered hero portrait | `DitherPortrait.jsx` |
| Core competencies icons | `CoreCompetencies.jsx` |
| Sections | `Hero`, `Marquee`, `Experience`, `Work`, `CoreCompetencies`, `Articles`, `About`, `Contact` |
| Scroll-tracking ladder bot | `ScrollLadderBot.jsx` |
| Visitor analytics | `lib/analytics.js` |

## Ladder bot details

A CRT-robot climbs a vertical rail to track scroll. Target Y = `scrollY / (scrollHeight - innerHeight)`; it lerps toward that target at an equal speed up or down, one rAF loop, no per-frame React re-render. `idle` when at target, `climb` while moving, sprite flips via `[data-dir]`.

> An alternate pixi.js-based version (bots physically climbing `[data-walk]` rungs) lives unused under `src/bysters/` - it descends far faster than it climbs, so it can't track upward scroll. Delete `src/bysters/` and the `@banjobyster/bysters`/`pixi.js` deps if you don't need it.

## Custom Secure Analytics

The portfolio utilizes a custom-built Express/MongoDB backend to track traffic and interactions securely, without relying on third-party commercial trackers. It pushes Telegram notifications per visit/event. It honors Do-Not-Track/GPC signals.

**1. Visit Tracking (`/api/track`)**
Fires once per session. It generates a stable `visitorId` and securely collects the user's OS, browser, and referrer. IP addresses are evaluated server-side to resolve general geolocation (City, Region, Country) before being logged to MongoDB Atlas and triggering an instant Telegram notification.

**2. Event Tracking (`/api/event`)**
Tracks specific user interactions without logging duplicate visit data. Used to monitor targeted actions such as:

* Clicking the Resume download link.
* Clicking outbound social links (GitHub, LinkedIn, Codeforces).

**Security:** Both endpoints are protected by an Express rate-limiter, strict payload size restrictions, domain-specific CORS policies, and a shared API Secret header to prevent endpoint abuse.

## Blog / Articles API

`content.json → articles.apiUrl` is empty, so the section shows `[ NOTHING TO DISPLAY ]`. To enable:

1. Set `apiUrl` to an endpoint returning `[{ "title", "date", "url", "tags": [] }]`.
2. Add its origin to `connect-src` in the CSP in `vite.config.js`.

## Optional assets

* `public/portrait.jpg` - hero portrait, auto-dithered. Falls back to a procedural pattern if absent.
* `public/resume.pdf` - linked from hero, navbar, About, Contact.
* `public/portfolio_screencast.mp4` - demo video referenced above.

## Deploy

Custom domain via `CNAME`; `npm run build` outputs a root-served `dist/`. A build-time plugin injects the CSP meta tag (GitHub Pages can't set headers).

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for the full license text and the [NOTICE](NOTICE) file for attribution requirements.

</samp>
