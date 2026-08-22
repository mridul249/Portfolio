import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// The DOM half of the cursor: a crisp accent dot plus a spring-lagged pixel
// square. The dither spotlight-reveal of the background itself happens in the
// DitherBackground shader, which tracks the same pointer. Fine pointers only.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const blobX = useSpring(x, { stiffness: 160, damping: 20, mass: 0.6 });
  const blobY = useSpring(y, { stiffness: 160, damping: 20, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target;
      setHot(!!(el && el.closest && el.closest('a, button, [data-cursor-hot]')));
    };
    window.addEventListener('pointermove', move, { passive: true });

    return () => {
      window.removeEventListener('pointermove', move);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Crisp pixel-square outline lagging behind the dot - the pixelated
          spotlight itself lives in the DitherBackground shader. */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: blobX,
          y: blobY,
          width: 26,
          height: 26,
          translateX: '-50%',
          translateY: '-50%',
          border: '1px solid rgba(195,255,252,0.35)',
        }}
        animate={{ scale: hot ? 1.6 : 1, rotate: hot ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      />
      {/* Core dot. */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
        style={{
          x,
          y,
          width: 6,
          height: 6,
          translateX: '-50%',
          translateY: '-50%',
          background: '#c3fffc',
          boxShadow: '0 0 10px rgba(195,255,252,0.7)',
        }}
        animate={{ scale: hot ? 0.5 : 1 }}
      />
    </>
  );
}
