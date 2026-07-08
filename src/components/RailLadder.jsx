import { useEffect, useRef, useState } from 'react';

// The ladder: a rail down the left gutter whose rung clips are real walkable
// terrain ([data-walk]). The rungs ZIG-ZAG between two overlapping columns:
// the bysters' jumps are projectile arcs, so two ledges stacked dead-vertical
// can't be connected (you'd rise and land back on the same spot). Staggering
// them left/right gives each hop a horizontal throw, so the bot can climb
// diagonally rung-to-rung and the compiled graph is connected top to bottom.
// Rungs are kept dense so a single max jump can skip several at once (faster
// climbs). Document-anchored (absolute, full doc height) -> scrolls with the page.
const RUNG_GAP = 40; // dense rungs: a single max jump (~168px) can skip several at once
const COL_A = 2; // left px of the left column
const COL_B = 36; // opposite column so odd-numbered rungs above are diagonally reachable
const RUNG_W = 42;

export default function RailLadder() {
  const [count, setCount] = useState(0);
  const [height, setHeight] = useState(0);

  const RUNG_H = 7; // capsule height - pair with RUNG_W for pill proportions
  const RUNG_W = 50; // pill shape: half the height
  useEffect(() => {
    let t = 0;
    const commit = () => {
      const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      const n = Math.max(2, Math.ceil(h / RUNG_GAP));
      setHeight((prev) => (prev === h ? prev : h));
      setCount((prev) => (prev === n ? prev : n));
    };
    const measure = () => {
      clearTimeout(t);
      t = setTimeout(commit, 120);
    };
    commit();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[6] hidden md:block"
      style={{ height, width: 90 }}
    >
      {/* the rail spine */}
      <div className="absolute top-0 h-full w-px bg-edge" style={{ left: COL_A + RUNG_W / 2 }} />
      {/* rung clips - each is a walkable ledge; they zig-zag so bots can hop up */}
      {Array.from({ length: count }).map((_, i) => (
        <i
          key={i}
          data-walk
          className="absolute block rounded-full"
          style={{
            top: i * RUNG_GAP,
            left: i % 2 === 0 ? COL_A : COL_B,
            width: RUNG_W,
            height: RUNG_H, // taller now - capsule, not a flat bar (try ~22–24)
            border: '1.5px solid var(--color-dim)',
            background: 'var(--color-bg)', // occludes the vertical line behind it
            opacity: 0.85,
            zIndex: 1, // must sit above the vertical track line
          }}
        >
          {/* the little centered nub */}
          <span
            className="absolute rounded-sm"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: RUNG_W * 0.18,
              height: RUNG_H * 0.32,
              background: 'var(--color-dim)',
              opacity: 0.7,
            }}
          />
        </i>
      ))}
    </div>
  );
}
