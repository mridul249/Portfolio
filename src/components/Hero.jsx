import { Suspense, lazy, useRef } from 'react';
import { motion } from 'framer-motion';
import content from '../data/content.json';
import DitherPortrait from './DitherPortrait.jsx';

// Hero-only pixel field (heavy WebGL - keep it lazy).
const DitherBackground = lazy(() => import('./DitherBackground.jsx'));

const { profile } = content;

// One line of the name lockup, split into letters. Letters near the cursor
// compress (scale down toward the baseline); everything springs back via a
// CSS transition on pointer leave.
function NameLine({ text, className }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (!ref.current) return;
    for (const span of ref.current.children) {
      const r = span.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const k = Math.max(0, 1 - Math.hypot(e.clientX - cx, (e.clientY - cy) * 0.6) / 260);
      span.style.transform = k > 0 ? `scale(${1 - 0.22 * k * k})` : '';
    }
  };
  const onLeave = () => {
    if (!ref.current) return;
    for (const span of ref.current.children) span.style.transform = '';
  };

  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`block ${className}`}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-300 ease-out"
          style={{ transformOrigin: '50% 100%' }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.75 } },
};
const rise = {
  hidden: { y: 28, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-5 pt-14">
      {/* Bayer-dithered pixel field with cursor spotlight - hero box only. */}
      <Suspense fallback={null}>
        <DitherBackground />
      </Suspense>

      {/* Dithered portrait block, bleeding off the right edge. */}
      <div
        className="pointer-events-none absolute -right-8 top-14 bottom-24 hidden w-[36%] md:block"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 35%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 35%)',
        }}
      >
        <DitherPortrait />
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto w-full max-w-7xl">
        <motion.p variants={rise} className="font-headline text-sm font-extrabold tracking-wide text-accent">
          {profile.eyebrow}
        </motion.p>
        <motion.p variants={rise} className="mono mt-2 text-[11px] text-white">
          {profile.tagline}
        </motion.p>

        <motion.h1
          variants={rise}
          className="mt-8 font-headline text-[17vw] font-black leading-[0.88] tracking-tight md:text-[9.5rem]"
        >
          <NameLine text={profile.nameLine1} className="text-cream" />
          <NameLine text={profile.nameLine2} className="text-accent" />
        </motion.h1>

        {/* Stat row with square-bullet separators. */}
        <motion.p variants={rise} className="mono mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-white">
          {profile.statRow.map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              {i > 0 && <span className="text-accent">▪</span>}
              {s}
            </span>
          ))}
        </motion.p>

        <motion.div variants={rise} className="mono mt-8 flex items-center gap-5 text-[10px]">
          <a href={profile.resume} target="_blank" rel="noreferrer" className="text-cream underline underline-offset-4 decoration-dim transition-colors hover:text-accent">
            RESUME →
          </a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="text-grey transition-colors hover:text-accent">
            GITHUB →
          </a>
        </motion.div>
      </motion.div>

      {/* <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mono absolute bottom-14 right-5 text-[10px] text-grey"
      >
        ▼ SCROLL
      </motion.span> */}
    </section>
  );
}
