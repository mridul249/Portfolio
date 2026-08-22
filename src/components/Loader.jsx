import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Boot sequence: a thin horizontal loader fills, shrinks to a stub, then the
// stub (layoutId "nav-shell") morphs into the fixed navbar when App swaps
// this component for <Navbar/>.
export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [shrunk, setShrunk] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const t0 = performance.now();
    const DURATION = 1400;
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / DURATION);
      // Ease so the last few percent hang for a beat.
      setPct(Math.floor((1 - Math.pow(1 - k, 2.2)) * 100));
      if (k < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!done.current) {
        done.current = true;
        setShrunk(true);
        setTimeout(onDone, 420);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-base"
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.15 } }}
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          layoutId="nav-shell"
          className="h-[2px] w-64 overflow-hidden bg-edge"
          animate={shrunk ? { width: 44 } : {}}
          transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
        </motion.div>
        <motion.p
          className="mono text-[10px] text-grey tabular-nums"
          animate={shrunk ? { opacity: 0 } : {}}
        >
          LOADING {String(pct).padStart(3, '0')}
        </motion.p>
      </div>
    </motion.div>
  );
}
