import { useEffect } from 'react';
// pixi.js generates shader-sync code via eval, which our strict CSP blocks.
// This side-effect import swaps in pixi's eval-free polyfills.
import 'pixi.js/unsafe-eval';
import { mount, behaviors, nearestVertex, LAUNCH_AGILE } from '@banjobyster/bysters';
import { CRT_TODDLER } from './characters/crt-toddler.js';
import { GLITCH_IMP } from './characters/glitch-imp.js';
import { WINNOW } from './characters/winnow.js';

const {
  wander,
  commanded,
  followCursor,
  fleeCursor,
  watchCursor,
  watchNearest,
  avoidCursorGaze,
  flourish,
  liveliness,
  mood,
} = behaviors;

// Where on the ladder (page x) the bots aim, and where in the viewport each
// one rides (fraction of viewport height) so they stack instead of overlapping.
const RAIL_X = 30;
const VIEW_FRAC = { pip: 0.4, byte: 0.55, winnow: 0.7 };

// commanded() routes a byster to `self.command` at priority above wander/perch;
// re-issuing that command every frame at the CURRENT viewport makes the bots
// continuously chase where you're reading - climb DOWN as you scroll down, UP
// as you scroll up. fleeCursor/flee sit above it, so they still bolt from the
// cursor before resuming the climb.
const CAST = [
  {
    name: 'pip',
    character: CRT_TODDLER,
    caps: LAUNCH_AGILE,
    speedScale: 1.25,
    spawnAt: '#hero',
    behaviors: [
      commanded({ priority: 55 }),
      followCursor({ face: 'eager', near: 80, priority: 40 }),
      watchCursor(),
      flourish(['excited', 'wink', 'happy'], { every: 7, hold: 1.4 }),
      wander(),
      liveliness({ base: 1.25, vary: 0.15, every: 3 }),
      mood('idle'),
    ],
  },
  {
    name: 'byte',
    character: GLITCH_IMP,
    caps: LAUNCH_AGILE,
    speedScale: 1.3,
    spawnAt: '#hero',
    behaviors: [
      fleeCursor({ radius: 170, face: 'panic', speed: 1.6 }),
      commanded({ priority: 55 }),
      flourish(['cackle', 'grin'], { every: 6, hold: 1.2 }),
      wander(),
      watchNearest(),
      liveliness({ base: 1.3, vary: 0.35, every: 1.3 }),
      mood('mischief'),
    ],
  },
  {
    name: 'winnow',
    character: WINNOW,
    caps: LAUNCH_AGILE,
    speedScale: 1.1,
    spawnAt: '#hero',
    behaviors: [
      fleeCursor({ radius: 200, face: 'lookaway', speed: 1.4, alpha: 0.25 }),
      avoidCursorGaze(),
      commanded({ priority: 55 }),
      flourish(['peek', 'dream'], { every: 5 }),
      wander(),
      liveliness({ base: 1.1, vary: 0.2, every: 4.2 }),
      mood('idle'),
    ],
  },
];

export default function Bysters() {
  useEffect(() => {
    let handle = null;
    let cancelled = false;
    let raf = 0;

    // Every frame, aim each bot at the ladder vertex nearest its slot in the
    // CURRENT viewport. The command clears on arrival, so re-issuing keeps them
    // pinned to your scroll position and climbing in the scroll direction.
    const follow = () => {
      const g = handle && handle.graph;
      if (g && g.vertices.length) {
        const vh = window.innerHeight || 800;
        const top = window.scrollY || 0;
        for (const m of handle.cast) {
          if (!m.byster) continue;
          const frac = VIEW_FRAC[m.name] ?? 0.5;
          const v = nearestVertex(g, RAIL_X, top + vh * frac);
          if (v) m.byster.command(v.id);
        }
      }
      raf = requestAnimationFrame(follow);
    };

    // Let fonts/layout settle so the rail rungs have real rects before compile.
    const timer = setTimeout(() => {
      mount({
        bysters: CAST,
        terrain: '[data-walk]',
        fixtures: false,
        ground: false, // the rail ladder is the only terrain
        shadow: true,
      })
        .then((h) => {
          if (cancelled) {
            h.unmount?.();
            return;
          }
          handle = h;
          if (!h.degraded) raf = requestAnimationFrame(follow);
        })
        .catch((err) => {
          // WebGL missing / reduced motion -> degraded no-op; never break the page.
          console.warn('[bysters] not mounted:', err);
        });
    }, 650);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      handle?.unmount?.();
    };
  }, []);

  return null;
}
